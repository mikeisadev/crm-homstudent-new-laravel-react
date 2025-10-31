import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Button from '../../ui/Button';
import InvoiceModal from '../../invoices/InvoiceModal';
import { INVOICE_TYPES } from '../../../data/invoiceConstants';

/**
 * Invoices Tab Renderer
 *
 * Displays and manages invoices (Bollette) for a property
 * Features:
 * - List all invoices for the property
 * - Create new invoices
 * - Edit existing invoices
 * - Delete invoices
 * - View PDF files with blob URLs
 */
const InvoicesTabRenderer = ({ entityId, endpoint }) => {
    const [invoices, setInvoices] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [viewMode, setViewMode] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [entityId, endpoint]);

    const fetchInvoices = async () => {
        try {
            setIsLoadingData(true);
            // endpoint is already a string from RegistryRelatedData (e.g., "/properties/16/invoices")
            const response = await api.get(endpoint);
            // The API returns the invoices array directly in response.data.data
            // If it's an array, use it directly, otherwise try to extract from data property
            const invoicesData = Array.isArray(response.data.data)
                ? response.data.data
                : (response.data.data?.invoices || response.data.data || []);
            setInvoices(invoicesData);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleAddInvoice = () => {
        setSelectedInvoice(null);
        setViewMode(false);
        setShowModal(true);
    };

    const handleEditInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setViewMode(false);
        setShowModal(true);
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setViewMode(true);
        setShowModal(true);
    };

    const handleSaveInvoice = async (formData, isEdit) => {
        try {
            if (isEdit && selectedInvoice) {
                // Update existing invoice
                await api.put(`/properties/${entityId}/invoices/${selectedInvoice.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create new invoice
                await api.post(`/properties/${entityId}/invoices`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            await fetchInvoices();
            setShowModal(false);
            setSelectedInvoice(null);
        } catch (error) {
            console.error('Error saving invoice:', error);
            throw error;
        }
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (!confirm('Sei sicuro di voler eliminare questa bolletta?')) {
            return;
        }

        try {
            await api.delete(`/properties/${entityId}/invoices/${invoiceId}`);
            await fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Errore nell\'eliminazione della bolletta');
        }
    };

    const handleViewPdf = async (invoice) => {
        if (!invoice.file_path) {
            alert('Nessun file disponibile per questa bolletta');
            return;
        }

        try {
            const response = await api.get(`/properties/${entityId}/invoices/${invoice.id}/view`, {
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

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento bollette...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Action Button - Always Visible */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <Button
                    onClick={handleAddInvoice}
                    className="flex items-center gap-2"
                >
                    <i className="material-icons text-sm">add</i>
                    Carica bolletta
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <i className="material-icons text-6xl mb-4">receipt</i>
                        <p className="text-lg">Nessuna bolletta presente</p>
                        <p className="text-sm mt-2">Carica la prima bolletta per questo immobile</p>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data Ricezione
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Importo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Da Addebitare
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Scadenza
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            File
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('it-IT') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {INVOICE_TYPES[invoice.invoice_type] || invoice.invoice_type || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {invoice.amount ? `€ ${parseFloat(invoice.amount).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.amount_to_charge ? `€ ${parseFloat(invoice.amount_to_charge).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('it-IT') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {invoice.file_path ? (
                                                    <button
                                                        onClick={() => handleViewPdf(invoice)}
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <i className="material-icons text-sm">picture_as_pdf</i>
                                                        Visualizza
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewInvoice(invoice)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title="Visualizza"
                                                    >
                                                        <i className="material-icons text-sm">visibility</i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditInvoice(invoice)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Modifica"
                                                    >
                                                        <i className="material-icons text-sm">edit</i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInvoice(invoice.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Elimina"
                                                    >
                                                        <i className="material-icons text-sm">delete</i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            {invoices.length > 0 && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                    <span>{invoices.length} {invoices.length === 1 ? 'bolletta' : 'bollette'}</span>
                </div>
            )}

            {/* Invoice Modal */}
            {showModal && (
                <InvoiceModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedInvoice(null);
                        setViewMode(false);
                    }}
                    onSave={handleSaveInvoice}
                    invoice={selectedInvoice}
                    propertyId={entityId}
                    viewMode={viewMode}
                />
            )}
        </div>
    );
};

export default InvoicesTabRenderer;
