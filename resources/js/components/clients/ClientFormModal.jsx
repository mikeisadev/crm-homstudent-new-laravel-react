import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import { validateClientForm } from '../../utils/clientValidation';
import { COUNTRIES, NATIONALITIES } from '../../data/countries';
import { ITALIAN_PROVINCES } from '../../data/italianProvinces';
import { ITALIAN_CITIES } from '../../data/italianCities';
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '../../data/documentTypes';

/**
 * FormField wrapper component
 */
function FormField({ label, error, required, children, className = '' }) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

/**
 * ClientFormModal Component
 * Complete form with react-select for locations and flatpickr for dates
 */
export default function ClientFormModal({ isOpen, onClose, onSave, client = null }) {
    const [clientType, setClientType] = useState('private');
    const [formData, setFormData] = useState({});
    const [meta, setMeta] = useState({});
    const [contacts, setContacts] = useState({});
    const [banking, setBanking] = useState({});
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (client) {
                setFormData(client);
                setClientType(client.type || 'private');
                setMeta(client.meta_data || {});
                setContacts(client.contacts_data || {});
                setBanking(client.banking_data || {});
            } else {
                setFormData({ type: 'private', country: 'Italia' });
                setClientType('private');
                setMeta({});
                setContacts({});
                setBanking({});
            }
            setErrors({});
        }
    }, [isOpen, client]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };

    const handleMetaChange = (key, value) => {
        setMeta({ ...meta, [key]: value });
    };

    const handleContactChange = (type, value) => {
        setContacts({ ...contacts, [type]: value });
    };

    const handleBankingChange = (field, value) => {
        setBanking({ ...banking, [field]: value });
    };

    const handleTypeChange = (type) => {
        setClientType(type);
        setFormData({ ...formData, type });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const completeData = {
            ...formData,
            meta_data: meta,
            contacts_data: contacts,
            banking_data: banking,
        };

        const validation = validateClientForm(completeData, clientType);
        setErrors(validation.errors);
        if (!validation.isValid) return;

        setIsSaving(true);
        try {
            await onSave(completeData);
        } catch (error) {
            console.error('Error saving client:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            {client ? 'Modifica Cliente' : 'Inserisci nuovo cliente'}
                        </h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200">
                            <i className="material-icons">close</i>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        {/* SECTION 1: Dati anagrafici principali */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">person</i>
                                Dati anagrafici principali
                            </h3>

                            {/* Type Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="private"
                                            checked={clientType === 'private'}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            className="mr-2"
                                        />
                                        <span className="font-medium">Privato</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="business"
                                            checked={clientType === 'business'}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            className="mr-2"
                                        />
                                        <span className="font-medium">Azienda</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {clientType === 'business' && (
                                    <FormField label="Ragione Sociale" error={errors.company_name} required className="md:col-span-3">
                                        <Input
                                            value={formData.company_name || ''}
                                            onChange={(e) => handleChange('company_name', e.target.value)}
                                            placeholder="Es: Rossi S.r.l."
                                        />
                                    </FormField>
                                )}

                                {clientType === 'private' && (
                                    <>
                                        <FormField label="Nome" error={errors.first_name} required>
                                            <Input
                                                value={formData.first_name || ''}
                                                onChange={(e) => handleChange('first_name', e.target.value)}
                                                placeholder="Es: Mario"
                                            />
                                        </FormField>

                                        <FormField label="Cognome" error={errors.last_name} required>
                                            <Input
                                                value={formData.last_name || ''}
                                                onChange={(e) => handleChange('last_name', e.target.value)}
                                                placeholder="Es: Rossi"
                                            />
                                        </FormField>
                                    </>
                                )}

                                <FormField label="Codice Fiscale" error={errors.tax_code} required={clientType === 'private'}>
                                    <Input
                                        value={formData.tax_code || ''}
                                        onChange={(e) => handleChange('tax_code', e.target.value.toUpperCase())}
                                        placeholder="RSSMRA80A01H501U"
                                        maxLength={16}
                                    />
                                </FormField>

                                {clientType === 'business' && (
                                    <>
                                        <FormField label="Partita Iva" error={errors.vat_number} required>
                                            <Input
                                                value={formData.vat_number || ''}
                                                onChange={(e) => handleChange('vat_number', e.target.value)}
                                                placeholder="12345678901"
                                                maxLength={11}
                                            />
                                        </FormField>

                                        <FormField label="Codice univoco" error={errors.unique_code}>
                                            <Input
                                                value={meta.unique_code || ''}
                                                onChange={(e) => handleMetaChange('unique_code', e.target.value.toUpperCase())}
                                                placeholder="Codice SDI (7 caratteri)"
                                                maxLength={7}
                                            />
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: Documento d'identità */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">badge</i>
                                Documento d'identità
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="Tipo di documento" error={errors.document_type}>
                                    <Select
                                        options={DOCUMENT_TYPES}
                                        value={DOCUMENT_TYPES.find((d) => d.value === meta.document_type)}
                                        onChange={(option) => handleMetaChange('document_type', option?.value || '')}
                                        placeholder="Seleziona tipo documento"
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Numero documento" error={errors.document_number}>
                                    <Input
                                        value={meta.document_number || ''}
                                        onChange={(e) => handleMetaChange('document_number', e.target.value.toUpperCase())}
                                        placeholder="Es: CA12345AB"
                                    />
                                </FormField>

                                <FormField label="Documento rilasciato da" error={errors.document_issued_by}>
                                    <Input
                                        value={meta.document_issued_by || ''}
                                        onChange={(e) => handleMetaChange('document_issued_by', e.target.value)}
                                        placeholder="Es: Comune di Roma"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 3: Dati di nascita */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">cake</i>
                                Dati di nascita
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <FormField label="Data di nascita" error={errors.birth_date}>
                                    <DatePicker
                                        value={meta.birth_date || ''}
                                        onChange={([date]) => handleMetaChange('birth_date', date ? date.toISOString().split('T')[0] : '')}
                                        placeholder="Seleziona data"
                                        dateFormat="d/m/Y"
                                    />
                                </FormField>

                                <FormField label="Comune di nascita" error={errors.birth_city}>
                                    <Select
                                        options={ITALIAN_CITIES}
                                        value={ITALIAN_CITIES.find((c) => c.value === meta.birth_city)}
                                        onChange={(option) => {
                                            handleMetaChange('birth_city', option?.value || '');
                                            if (option?.province) {
                                                handleMetaChange('birth_province', option.province);
                                            }
                                        }}
                                        placeholder="Cerca comune..."
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Provincia di nascita" error={errors.birth_province}>
                                    <Select
                                        options={ITALIAN_PROVINCES}
                                        value={ITALIAN_PROVINCES.find((p) => p.value === meta.birth_province)}
                                        onChange={(option) => handleMetaChange('birth_province', option?.value || '')}
                                        placeholder="Seleziona provincia"
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Stato di nascita" error={errors.birth_country}>
                                    <Select
                                        options={COUNTRIES}
                                        value={COUNTRIES.find((c) => c.value === meta.birth_country)}
                                        onChange={(option) => handleMetaChange('birth_country', option?.value || '')}
                                        placeholder="Seleziona nazione"
                                        isClearable
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 4: Dati personali */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">info</i>
                                Dati personali
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <FormField label="Nazionalità" error={errors.nationality}>
                                    <Select
                                        options={NATIONALITIES}
                                        value={NATIONALITIES.find((n) => n.value === meta.nationality)}
                                        onChange={(option) => handleMetaChange('nationality', option?.value || '')}
                                        placeholder="Seleziona nazionalità"
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Sesso" error={errors.gender}>
                                    <Select
                                        options={GENDER_OPTIONS}
                                        value={GENDER_OPTIONS.find((g) => g.value === meta.gender)}
                                        onChange={(option) => handleMetaChange('gender', option?.value || '')}
                                        placeholder="Seleziona"
                                    />
                                </FormField>

                                <FormField label="Nome padre" error={errors.father_name}>
                                    <Input
                                        value={meta.father_name || ''}
                                        onChange={(e) => handleMetaChange('father_name', e.target.value)}
                                        placeholder="Es: Giuseppe"
                                    />
                                </FormField>

                                <FormField label="Nome madre" error={errors.mother_name}>
                                    <Input
                                        value={meta.mother_name || ''}
                                        onChange={(e) => handleMetaChange('mother_name', e.target.value)}
                                        placeholder="Es: Maria"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 5: Contatti principali */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">contact_phone</i>
                                Contatti principali
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <FormField label="Email" error={errors.email} required>
                                    <Input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="mario.rossi@esempio.it"
                                    />
                                </FormField>

                                <FormField label="Telefono" error={errors.phone} required>
                                    <Input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="+39 06 1234567"
                                    />
                                </FormField>

                                <FormField label="Cellulare" error={errors.mobile}>
                                    <Input
                                        type="tel"
                                        value={formData.mobile || ''}
                                        onChange={(e) => handleChange('mobile', e.target.value)}
                                        placeholder="+39 333 1234567"
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="Telefono 2" error={errors.phone_secondary}>
                                    <Input
                                        type="tel"
                                        value={contacts.phone_secondary || ''}
                                        onChange={(e) => handleContactChange('phone_secondary', e.target.value)}
                                        placeholder="+39 06 7654321"
                                    />
                                </FormField>

                                <FormField label="Email 2" error={errors.email_secondary}>
                                    <Input
                                        type="email"
                                        value={contacts.email_secondary || ''}
                                        onChange={(e) => handleContactChange('email_secondary', e.target.value)}
                                        placeholder="secondaria@esempio.it"
                                    />
                                </FormField>

                                <FormField label="Fax" error={errors.fax}>
                                    <Input
                                        value={contacts.fax || ''}
                                        onChange={(e) => handleContactChange('fax', e.target.value)}
                                        placeholder="+39 06 9876543"
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <FormField label="PEC" error={errors.pec}>
                                    <Input
                                        type="email"
                                        value={contacts.pec || ''}
                                        onChange={(e) => handleContactChange('pec', e.target.value)}
                                        placeholder="pec@pec.it"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 6: Indirizzo */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">home</i>
                                Indirizzo
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <FormField label="Indirizzo" error={errors.address} className="md:col-span-2">
                                    <Input
                                        value={formData.address || ''}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Via Roma"
                                    />
                                </FormField>

                                <FormField label="Numero civico" error={errors.civic_number}>
                                    <Input
                                        value={meta.civic_number || ''}
                                        onChange={(e) => handleMetaChange('civic_number', e.target.value)}
                                        placeholder="123"
                                    />
                                </FormField>

                                <FormField label="CAP" error={errors.postal_code}>
                                    <Input
                                        value={formData.postal_code || ''}
                                        onChange={(e) => handleChange('postal_code', e.target.value)}
                                        placeholder="00100"
                                        maxLength={5}
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="Comune" error={errors.city}>
                                    <Select
                                        options={ITALIAN_CITIES}
                                        value={ITALIAN_CITIES.find((c) => c.value === formData.city)}
                                        onChange={(option) => {
                                            handleChange('city', option?.value || '');
                                            if (option?.province) {
                                                handleChange('province', option.province);
                                            }
                                        }}
                                        placeholder="Cerca comune..."
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Provincia" error={errors.province}>
                                    <Select
                                        options={ITALIAN_PROVINCES}
                                        value={ITALIAN_PROVINCES.find((p) => p.value === formData.province)}
                                        onChange={(option) => handleChange('province', option?.value || '')}
                                        placeholder="Seleziona provincia"
                                        isClearable
                                    />
                                </FormField>

                                <FormField label="Nazione" error={errors.country}>
                                    <Select
                                        options={COUNTRIES}
                                        value={COUNTRIES.find((c) => c.value === formData.country)}
                                        onChange={(option) => handleChange('country', option?.value || 'Italia')}
                                        placeholder="Seleziona nazione"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 7: Social network */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">share</i>
                                Social network
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Facebook" error={errors.facebook}>
                                    <Input
                                        value={contacts.facebook || ''}
                                        onChange={(e) => handleContactChange('facebook', e.target.value)}
                                        placeholder="facebook.com/nomeutente"
                                    />
                                </FormField>

                                <FormField label="LinkedIn" error={errors.linkedin}>
                                    <Input
                                        value={contacts.linkedin || ''}
                                        onChange={(e) => handleContactChange('linkedin', e.target.value)}
                                        placeholder="linkedin.com/in/nomeutente"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 8: Dati bancari */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">account_balance</i>
                                Dati bancari
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="Banca" error={errors.bank_name}>
                                    <Input
                                        value={banking.bank_name || ''}
                                        onChange={(e) => handleBankingChange('bank_name', e.target.value)}
                                        placeholder="Es: Intesa Sanpaolo"
                                    />
                                </FormField>

                                <FormField label="IBAN" error={errors.iban}>
                                    <Input
                                        value={banking.iban || ''}
                                        onChange={(e) => handleBankingChange('iban', e.target.value.toUpperCase())}
                                        placeholder="IT60X0542811101000000123456"
                                        maxLength={34}
                                    />
                                </FormField>

                                <FormField label="Modalità di pagamento" error={errors.payment_method}>
                                    <Input
                                        value={banking.payment_method || ''}
                                        onChange={(e) => handleBankingChange('payment_method', e.target.value)}
                                        placeholder="Es: Bonifico, RID"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* SECTION 9: Note */}
                        <div className="mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i className="material-icons text-blue-600 mr-2">notes</i>
                                Note
                            </h3>
                            <FormField label="Note aggiuntive" error={errors.notes}>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Inserisci eventuali note aggiuntive..."
                                />
                            </FormField>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        <Button type="button" onClick={onClose} variant="secondary" disabled={isSaving}>
                            Annulla
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            {isSaving ? 'Salvataggio...' : 'Salva'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
