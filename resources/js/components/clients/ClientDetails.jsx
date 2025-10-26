import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import AccordionSection from '../ui/AccordionSection';

/**
 * ClientDetails Component
 * Middle column - displays client details with accordion sections
 *
 * @param {Object|null} client - Selected client object
 * @param {function} onEdit - Callback for edit button
 * @param {function} onDelete - Callback for delete button
 * @param {function} onUpdate - Callback when client data is updated
 * @returns {JSX.Element}
 */
export default function ClientDetails({ client, onEdit, onDelete, onUpdate }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
                <i className="material-icons text-6xl mb-4">person_outline</i>
                <p className="text-lg">Seleziona un cliente dalla lista</p>
            </div>
        );
    }

    /**
     * Handle edit mode toggle
     */
    const handleEditToggle = () => {
        if (editMode) {
            // Save changes
            onUpdate(formData);
            setEditMode(false);
        } else {
            // Enter edit mode
            setFormData(client);
            setEditMode(true);
        }
    };

    /**
     * Handle field change
     */
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    /**
     * Get display name for client
     */
    const getClientName = () => {
        // Use full_name from API if available
        if (client.full_name) {
            return client.full_name;
        }

        if (client.type === 'business') {
            return client.company_name || 'Azienda';
        }
        return `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Cliente';
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    /**
     * Render field (read or edit mode)
     */
    const renderField = (label, field, type = 'text') => {
        const value = editMode ? formData[field] : client[field];

        return (
            <div className="grid grid-cols-2 border-b border-gray-100">
                <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">{label}:</div>
                <div className="py-3 px-4">
                    {editMode ? (
                        <Input
                            type={type}
                            value={value || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full"
                        />
                    ) : (
                        <span className="text-gray-900">{value || '-'}</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="mb-3">
                    <h2 className="text-xl font-bold text-blue-500 text-center">
                        {getClientName()}
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={handleEditToggle} variant={editMode ? 'primary' : 'secondary'}>
                        {editMode ? 'Salva' : 'Modifica'}
                    </Button>
                    <Button onClick={() => onDelete(client.id)} variant="danger">
                        Elimina
                    </Button>
                </div>
            </div>

            {/* Accordion Sections */}
            <div className="flex-1 overflow-y-auto">
                {/* 1. Dati anagrafici principali */}
                <AccordionSection title="Dati anagrafici principali" defaultOpen={true}>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Tipo:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">
                                {client.type === 'business' ? 'Azienda' : 'Privato'}
                            </span>
                        </div>
                    </div>
                    {client.type === 'business' && renderField('Ragione sociale', 'company_name')}
                    {client.type === 'private' && (
                        <>
                            {renderField('Nome', 'first_name')}
                            {renderField('Cognome', 'last_name')}
                        </>
                    )}
                    {renderField('Codice Fiscale', 'tax_code')}
                    {client.type === 'business' && (
                        <>
                            {renderField('Partita IVA', 'vat_number')}
                            <div className="grid grid-cols-2 border-b border-gray-100">
                                <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Codice univoco:</div>
                                <div className="py-3 px-4">
                                    <span className="text-gray-900">{client.meta_data?.unique_code || '-'}</span>
                                </div>
                            </div>
                        </>
                    )}
                </AccordionSection>

                {/* 2. Documento d'identità */}
                <AccordionSection title="Documento d'identità">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Tipo documento:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.document_type || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Numero documento:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.document_number || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Rilasciato da:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.document_issued_by || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 3. Dati di nascita */}
                <AccordionSection title="Dati di nascita">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Data di nascita:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{formatDate(client.meta_data?.birth_date) || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Comune di nascita:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.birth_city || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Provincia di nascita:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.birth_province || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Stato di nascita:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.birth_country || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 4. Dati personali */}
                <AccordionSection title="Dati personali">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Nazionalità:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.nationality || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Sesso:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">
                                {client.meta_data?.gender === 'M' ? 'Uomo' : client.meta_data?.gender === 'F' ? 'Donna' : '-'}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Nome padre:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.father_name || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Nome madre:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.mother_name || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 5. Contatti principali */}
                <AccordionSection title="Contatti principali">
                    {renderField('Email', 'email', 'email')}
                    {renderField('Telefono', 'phone', 'tel')}
                    {renderField('Cellulare', 'mobile', 'tel')}
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Telefono 2:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.phone_secondary || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Email 2:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.email_secondary || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Fax:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.fax || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">PEC:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.pec || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 6. Indirizzo */}
                <AccordionSection title="Indirizzo">
                    {renderField('Indirizzo', 'address')}
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Numero civico:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.meta_data?.civic_number || '-'}</span>
                        </div>
                    </div>
                    {renderField('CAP', 'postal_code')}
                    {renderField('Comune', 'city')}
                    {renderField('Provincia', 'province')}
                    {renderField('Nazione', 'country')}
                </AccordionSection>

                {/* 7. Social network */}
                <AccordionSection title="Social network">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Facebook:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.facebook || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">LinkedIn:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.contacts_data?.linkedin || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 8. Dati bancari */}
                <AccordionSection title="Dati bancari">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Banca:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.banking_data?.bank_name || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">IBAN:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.banking_data?.iban || '-'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Modalità pagamento:</div>
                        <div className="py-3 px-4">
                            <span className="text-gray-900">{client.banking_data?.payment_method || '-'}</span>
                        </div>
                    </div>
                </AccordionSection>

                {/* 9. Origine */}
                <AccordionSection title="Origine">
                    {renderField('Fonte', 'origin_source')}
                    {renderField('Dettagli origine', 'origin_details')}
                </AccordionSection>

                {/* 10. Creazione / Ultima modifica */}
                <AccordionSection title="Creazione / Ultima modifica">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                            Creazione:
                        </div>
                        <div className="py-3 px-4 text-gray-900">
                            {formatDate(client.created_at)}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-100">
                        <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                            Ultima modifica:
                        </div>
                        <div className="py-3 px-4 text-gray-900">
                            {formatDate(client.updated_at)}
                        </div>
                    </div>
                </AccordionSection>

                {/* 11. Note */}
                <div className="p-4 border-b border-gray-200">
                    <div className="font-semibold text-gray-700 mb-2">Note</div>
                    {editMode ? (
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Aggiungi note..."
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-md min-h-[100px] text-gray-700">
                            {client.notes || 'Nessuna nota'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
