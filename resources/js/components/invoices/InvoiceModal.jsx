import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Flatpickr from 'react-flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it';
import 'flatpickr/dist/flatpickr.css';
import { INVOICE_TYPES, SEND_CHARGE_OPTIONS, MONTHS_IT } from '../../data/invoiceConstants';
import api from '../../services/api';
import DateUtil from '../../utils/date';

/**
 * Invoice Modal Component
 *
 * Modal for creating/editing invoices (Bollette) for properties
 * Includes complex "Mesi di competenza" field with all 12 months
 */
export default function InvoiceModal({ isOpen, onClose, onSave, invoice = null, propertyId = null }) {
    const isEdit = !!invoice;
    const showPropertySelector = !propertyId; // Show property selector when no propertyId provided

    // Initialize months competence data structure (all 12 months)
    const initializeMonthsData = (existingData = null) => {
        const currentYear = new Date().getFullYear();

        // Create base structure for all 12 months
        const baseStructure = MONTHS_IT.map(month => ({
            month: month.key,
            monthName: month.name,
            year: currentYear,
            amount: '',
            selected: false
        }));

        // Parse if it's a JSON string (sometimes API returns string instead of parsed array)
        let parsedData = existingData;
        if (typeof existingData === 'string') {
            try {
                parsedData = JSON.parse(existingData);
            } catch (e) {
                console.error('Failed to parse months_competence_data:', e);
                parsedData = null;
            }
        }

        // If we have existing data, merge it with the base structure
        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
            return baseStructure.map((baseMonth) => {
                // Find matching month in existing data
                const existingMonth = parsedData.find(m => m.month === baseMonth.month);

                if (existingMonth) {
                    // Merge existing data with base structure
                    return {
                        ...baseMonth,
                        year: existingMonth.year || baseMonth.year,
                        amount: existingMonth.amount || '',
                        selected: existingMonth.selected || false
                    };
                }

                return baseMonth;
            });
        }

        return baseStructure;
    };

    const [formData, setFormData] = useState({
        property_id: invoice?.property_id || '',
        invoice_type: invoice?.invoice_type || '',
        issue_date: invoice?.issue_date || '',
        due_date: invoice?.due_date || '',
        send_charge: invoice?.send_charge || false,
        description: invoice?.description || '',
        amount: invoice?.amount || '',
        contract_included_amount: invoice?.contract_included_amount || '',
        amount_to_charge: invoice?.amount_to_charge || '',
        file: null
    });

    const [properties, setProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(false);

    const [monthsData, setMonthsData] = useState(
        initializeMonthsData(invoice?.months_competence_data)
    );
    const [useAnnual, setUseAnnual] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch properties when modal opens (only if showing property selector)
    useEffect(() => {
        if (isOpen && showPropertySelector) {
            fetchProperties();
        }
    }, [isOpen, showPropertySelector]);

    const fetchProperties = async () => {
        try {
            setLoadingProperties(true);
            const response = await api.get('/properties', { params: { per_page: 9999 } });
            const propertiesData = response.data.data.properties || [];
            setProperties(propertiesData);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoadingProperties(false);
        }
    };

    // Reset form when modal opens/closes or invoice changes
    useEffect(() => {
        if (isOpen) {
            if (invoice) {
                setFormData({
                    property_id: invoice.property_id || '',
                    invoice_type: invoice.invoice_type || '',
                    issue_date: invoice.issue_date || '',
                    due_date: invoice.due_date || '',
                    send_charge: invoice.send_charge || false,
                    description: invoice.description || '',
                    amount: invoice.amount || '',
                    contract_included_amount: invoice.contract_included_amount || '',
                    amount_to_charge: invoice.amount_to_charge || '',
                    file: null
                });
                setMonthsData(initializeMonthsData(invoice.months_competence_data));
            } else {
                // Reset for new invoice
                setFormData({
                    property_id: propertyId || '',
                    invoice_type: '',
                    issue_date: '',
                    due_date: '',
                    send_charge: false,
                    description: '',
                    amount: '',
                    contract_included_amount: '',
                    amount_to_charge: '',
                    file: null
                });
                setMonthsData(initializeMonthsData());
            }
            setUseAnnual(false);
        }
    }, [isOpen, invoice, propertyId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMonthChange = (index, field, value) => {
        setMonthsData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            // Auto-select when amount is entered
            if (field === 'amount' && value && !updated[index].selected) {
                updated[index].selected = true;
            }

            return updated;
        });
    };

    const handleAnnualToggle = (checked) => {
        setUseAnnual(checked);
        if (checked) {
            // Deselect all individual months
            setMonthsData(prev => prev.map(m => ({ ...m, selected: false })));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = new FormData();

            // Add basic fields
            Object.keys(formData).forEach(key => {
                if (key !== 'file' && formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            // If propertyId was provided as prop (property context), use that
            if (propertyId && !showPropertySelector) {
                submitData.set('property_id', propertyId);
            }

            // Add months competence data as JSON (always include all 12 months)
            submitData.append('months_competence_data', JSON.stringify(monthsData));

            // Add file if selected
            if (formData.file) {
                submitData.append('file', formData.file);
            }

            await onSave(submitData, isEdit);
            onClose();
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Errore nel salvataggio della bolletta');
        } finally {
            setSaving(false);
        }
    };

    const handleViewPdf = async (invoice) => {
        if (!invoice.file_path) {
            alert('Nessun file disponibile per questa bolletta');
            return;
        }

        try {
            // Determine the endpoint based on context
            const endpoint = propertyId
                ? `/properties/${propertyId}/invoices/${invoice.id}/view`
                : `/invoices/${invoice.id}/view`;

            const response = await api.get(endpoint, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            // Open in new tab
            window.open(blobUrl, '_blank');

            // Clean up after 1 minute
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
            console.error('Error viewing PDF:', error);
            alert('Errore nella visualizzazione del file');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Modifica bolletta' : 'Carica bolletta'}
            maxWidth="6xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Selector - Only shown when not in property context */}
                {showPropertySelector && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Immobile *
                        </label>
                        <Select
                            options={properties.map(p => ({
                                value: p.id,
                                label: `${p.internal_code} - ${p.name || p.address}`
                            }))}
                            value={properties.find(p => p.id === parseInt(formData.property_id)) ? {
                                value: parseInt(formData.property_id),
                                label: (() => {
                                    const prop = properties.find(p => p.id === parseInt(formData.property_id));
                                    return `${prop.internal_code} - ${prop.name || prop.address}`;
                                })()
                            } : null}
                            onChange={(option) => handleInputChange('property_id', option ? option.value : '')}
                            placeholder={loadingProperties ? 'Caricamento immobili...' : 'Seleziona immobile'}
                            isDisabled={loadingProperties}
                            isClearable={false}
                        />
                    </div>
                )}

                {/* Basic Fields - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Invoice Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo bolletta *
                        </label>
                        <Select
                            options={Object.entries(INVOICE_TYPES).map(([key, label]) => ({
                                value: key,
                                label: label
                            }))}
                            value={formData.invoice_type ? {
                                value: formData.invoice_type,
                                label: INVOICE_TYPES[formData.invoice_type]
                            } : null}
                            onChange={(option) => handleInputChange('invoice_type', option ? option.value : '')}
                            placeholder="Seleziona tipo"
                            isClearable={false}
                        />
                    </div>

                    {/* Received Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data ricezione *
                        </label>
                        <Flatpickr
                            value={new Date(formData.issue_date)}
                            onChange={([date]) => handleInputChange('issue_date', DateUtil.formatDate(date))}
                            options={{
                                dateFormat: 'd/m/Y',
                                locale: Italian,
                                allowInput: true
                            }}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Send Charge */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invio addebito
                        </label>
                        <Select
                            options={Object.entries(SEND_CHARGE_OPTIONS).map(([key, label]) => ({
                                value: key,
                                label: label
                            }))}
                            value={{
                                value: formData.send_charge ? 'yes' : 'no',
                                label: formData.send_charge ? SEND_CHARGE_OPTIONS.yes : SEND_CHARGE_OPTIONS.no
                            }}
                            onChange={(option) => handleInputChange('send_charge', option ? option.value === 'yes' : false)}
                            isClearable={false}
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data scadenza pagamento
                        </label>
                        <Flatpickr
                            value={new Date(formData.due_date)}
                            onChange={([date]) => handleInputChange('due_date', DateUtil.formatDate(date))}
                            options={{
                                dateFormat: 'd/m/Y',
                                locale: Italian,
                                allowInput: true
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Mesi di competenza Field Group */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Mesi di competenza</h3>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useAnnual}
                                onChange={(e) => handleAnnualToggle(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Annuale</span>
                        </label>
                    </div>

                    {!useAnnual && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                            {monthsData.map((monthData, index) => (
                                <div key={monthData.month} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={monthData.selected}
                                        onChange={(e) => handleMonthChange(index, 'selected', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    {/* Month Name */}
                                    <span className="text-xs font-medium text-gray-700 w-16">{monthData.monthName}</span>

                                    {/* Year */}
                                    <input
                                        type="number"
                                        value={monthData.year}
                                        onChange={(e) => handleMonthChange(index, 'year', e.target.value)}
                                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        min="2000"
                                        max="2100"
                                    />

                                    {/* Amount */}
                                    <input
                                        type="number"
                                        value={monthData.amount}
                                        onChange={(e) => handleMonthChange(index, 'amount', e.target.value)}
                                        placeholder="€"
                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Importo bolletta (€)
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Importo incluso contratto (€)
                        </label>
                        <input
                            type="number"
                            value={formData.contract_included_amount}
                            onChange={(e) => handleInputChange('contract_included_amount', e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Importo da addebitare (€)
                        </label>
                        <input
                            type="number"
                            value={formData.amount_to_charge}
                            onChange={(e) => handleInputChange('amount_to_charge', e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrizione
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carica bolletta (PDF)
                    </label>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="invoice-file-upload"
                        accept="application/pdf"
                        onChange={(e) => handleInputChange('file', e.target.files[0])}
                        className="hidden"
                    />

                    {/* Modern file upload button */}
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={() => document.getElementById('invoice-file-upload').click()}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            <i className="material-icons text-sm">upload_file</i>
                            {formData.file ? 'Cambia file' : 'Seleziona file PDF'}
                        </Button>

                        {/* Show selected file name */}
                        {formData.file && (
                            <span className="text-sm text-gray-700 flex items-center gap-1">
                                <i className="material-icons text-sm text-green-600">check_circle</i>
                                {formData.file.name}
                            </span>
                        )}
                    </div>

                    {/* Show existing file when editing (if no new file selected) */}
                    {isEdit && invoice?.file_path && !formData.file && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <i className="material-icons text-blue-600">picture_as_pdf</i>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        File esistente
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {invoice.file_path.split('/').pop()}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleViewPdf(invoice)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                            >
                                <i className="material-icons text-sm">visibility</i>
                                Visualizza
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        disabled={saving}
                    >
                        Annulla
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Salvataggio...' : (isEdit ? 'Aggiorna bolletta' : 'Salva bolletta')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
