import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

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

    const isEdit = !!item;

    /**
     * Initialize form data when modal opens or item changes
     */
    useEffect(() => {
        if (isOpen) {
            if (item) {
                // Edit mode - populate with item data
                const initialData = {};
                config.formFields?.forEach((field) => {
                    initialData[field.key] = item[field.key] || '';
                });
                setFormData(initialData);
            } else {
                // Create mode - initialize with empty values
                const initialData = {};
                config.formFields?.forEach((field) => {
                    initialData[field.key] = '';
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
                        rows={4}
                        disabled={saving}
                    />
                ) : field.type === 'select' ? (
                    <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`
                            w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}
                        `}
                        disabled={saving}
                    >
                        <option value="">Seleziona...</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
            maxWidth="md"
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    {/* Placeholder message */}
                    {(!config.formFields || config.formFields.length === 0) ? (
                        <div className="text-center text-gray-500 py-8">
                            <i className="material-icons text-4xl mb-2">{config.icon}</i>
                            <p>Campi del modulo da completare</p>
                            <p className="text-sm mt-2 italic">Questa sezione verrà implementata a breve</p>
                        </div>
                    ) : (
                        config.formFields.map((field) => renderField(field))
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
