import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import api from '../../services/api';

/**
 * Generic Registry Form Modal Component
 *
 * Handles create/edit modal for any entity type
 * Configuration-driven with dynamic form fields
 *
 * @param {object} config - Registry configuration
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Callback to close modal
 * @param {function} onSave - Callback to save data
 * @param {object|null} item - Item being edited (null for create)
 * @returns {JSX.Element}
 */
export default function RegistryFormModal({ config, isOpen, onClose, onSave, item }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [loadingOptions, setLoadingOptions] = useState(false);

    const isEdit = !!item;

    /**
     * Load dynamic options for fields that require API data
     */
    useEffect(() => {
        const loadDynamicOptions = async () => {
            if (!isOpen || !config.formFields) return;

            const fieldsWithLoadFrom = config.formFields.filter(field => field.loadFrom);
            if (fieldsWithLoadFrom.length === 0) return;

            setLoadingOptions(true);
            const optionsToLoad = {};

            try {
                // Load all dynamic options in parallel
                const promises = fieldsWithLoadFrom.map(async (field) => {
                    try {
                        const response = await api.get(field.loadFrom);
                        const data = response.data.data;

                        // Extract the actual array based on endpoint
                        // E.g., /properties returns data.properties, /clients returns data.clients
                        const dataKey = field.loadFrom.split('/').pop(); // 'properties', 'clients', etc.
                        const items = data[dataKey] || [];

                        // Transform to react-select format
                        const options = items.map(item => ({
                            value: item.id,
                            label: field.optionLabel
                                ? (typeof field.optionLabel === 'function'
                                    ? field.optionLabel(item)
                                    : item[field.optionLabel])
                                : item.name || item.internal_code || `Item ${item.id}`
                        }));

                        optionsToLoad[field.key] = options;
                    } catch (error) {
                        console.error(`Error loading options for ${field.key}:`, error);
                        optionsToLoad[field.key] = [];
                    }
                });

                await Promise.all(promises);
                setDynamicOptions(optionsToLoad);
            } catch (error) {
                console.error('Error loading dynamic options:', error);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadDynamicOptions();
    }, [isOpen, config.formFields]);

    /**
     * Initialize form data when modal opens or item changes
     */
    useEffect(() => {
        if (isOpen) {
            if (item) {
                // Edit mode - populate with item data
                const initialData = {};
                config.formFields?.forEach((field) => {
                    let value = item[field.key];

                    // Convert boolean values to string for YES_NO select fields
                    if (field.type === 'select' && typeof value === 'boolean') {
                        value = value ? '1' : '0';
                    }

                    initialData[field.key] = value !== undefined && value !== null ? value : '';
                });
                setFormData(initialData);
            } else {
                // Create mode - initialize with empty values or defaults
                const initialData = {};
                config.formFields?.forEach((field) => {
                    initialData[field.key] = field.defaultValue !== undefined ? field.defaultValue : '';
                });
                setFormData(initialData);
            }
            setErrors({});
        }
    }, [isOpen, item, config.formFields]);

    /**
     * Handle input change
     */
    const handleChange = (fieldKey, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldKey]: value
        }));

        // Clear error for this field
        if (errors[fieldKey]) {
            setErrors(prev => ({
                ...prev,
                [fieldKey]: null
            }));
        }
    };

    /**
     * Validate form
     */
    const validate = () => {
        const newErrors = {};

        config.formFields?.forEach((field) => {
            if (field.required && !formData[field.key]) {
                newErrors[field.key] = `${field.label} è obbligatorio`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setSaving(true);

        try {
            await onSave(formData);
            // Modal will be closed by parent
        } catch (err) {
            // Error is handled by parent
            console.error('Error saving:', err);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Render a form field based on configuration
     */
    const renderField = (field) => {
        // Check if this field has dynamic options loaded from API
        const isDynamicSelect = field.loadFrom && dynamicOptions[field.key];
        const fieldOptions = isDynamicSelect ? dynamicOptions[field.key] : field.options;

        return (
            <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                    <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`
                            w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}
                        `}
                        rows={field.rows || 5}
                        disabled={saving}
                    />
                ) : field.type === 'select' ? (
                    // Always use react-select for all select fields
                    <Select
                        options={fieldOptions || []}
                        value={fieldOptions?.find(opt => opt.value === formData[field.key]) || null}
                        onChange={(selectedOption) => handleChange(field.key, selectedOption?.value || '')}
                        placeholder={field.placeholder || 'Seleziona...'}
                        isDisabled={saving || loadingOptions}
                        isClearable={!field.required}
                    />
                ) : field.type === 'date' ? (
                    // Use flatpickr DatePicker for date fields
                    <DatePicker
                        value={formData[field.key] || ''}
                        onChange={(dates) => {
                            // Flatpickr returns array of dates, we want the first one
                            const selectedDate = dates[0];
                            if (selectedDate) {
                                // Format as YYYY-MM-DD for backend
                                const year = selectedDate.getFullYear();
                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                handleChange(field.key, `${year}-${month}-${day}`);
                            } else {
                                handleChange(field.key, '');
                            }
                        }}
                        placeholder={field.placeholder || 'gg/mm/aaaa'}
                        disabled={saving}
                        className={errors[field.key] ? 'border-red-500' : ''}
                    />
                ) : (
                    <Input
                        type={field.type || 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={errors[field.key] ? 'border-red-500' : ''}
                        disabled={saving}
                    />
                )}

                {errors[field.key] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                )}
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? `Modifica ${config.titleSingular}` : `Nuovo ${config.titleSingular}`}
            maxWidth="6xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="p-0">
                    {/* Placeholder message */}
                    {(!config.formFields || config.formFields.length === 0) ? (
                        <div className="text-center text-gray-500 py-8">
                            <i className="material-icons text-4xl mb-2">{config.icon}</i>
                            <p>Campi del modulo da completare</p>
                            <p className="text-sm mt-2 italic">Questa sezione verrà implementata a breve</p>
                        </div>
                    ) : (
                        <>
                            {/* Grid fields (all fields except textarea) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {config.formFields
                                    .filter((field) => field.type !== 'textarea')
                                    .map((field) => renderField(field))}
                            </div>

                            {/* Full-width textarea fields at the bottom */}
                            {config.formFields
                                .filter((field) => field.type === 'textarea')
                                .map((field) => (
                                    <div key={field.key} className="mt-4">
                                        {renderField(field)}
                                    </div>
                                ))}
                        </>
                    )}
                </div>

                {/* Footer with buttons */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
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
                        variant="primary"
                        disabled={saving || !config.formFields || config.formFields.length === 0}
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Salvataggio...
                            </>
                        ) : (
                            isEdit ? 'Salva Modifiche' : 'Crea'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
