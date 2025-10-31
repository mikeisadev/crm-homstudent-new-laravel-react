import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import InstallmentsFieldGroup from '../ui/InstallmentsFieldGroup';
import api from '../../services/api';
import DateUtil from '../../utils/date';
import { viewDocument, getEntityTypeSlug } from '../../utils/documentViewer';

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
    const [uploadedFiles, setUploadedFiles] = useState({});

    const isEdit = !!item;

    /**
     * Load dynamic options for fields that require API data
     * SKIP controlled fields - they will be loaded by their control field
     */
    useEffect(() => {
        const loadDynamicOptions = async () => {
            if (!isOpen || !config.formFields) return;

            // Filter fields that have loadFrom BUT are NOT controlled by another field
            const fieldsWithLoadFrom = config.formFields.filter(field =>
                field.loadFrom && !field.controlledBy
            );

            if (fieldsWithLoadFrom.length === 0) return;

            setLoadingOptions(true);
            const optionsToLoad = {};

            try {
                // Load all dynamic options in parallel
                const promises = fieldsWithLoadFrom.map(async (field) => {
                    try {
                        // IMPORTANT: Add per_page=9999 to get ALL records for select field options
                        // These are for entity correlation, not listing/pagination
                        const url = field.loadFrom.includes('?')
                            ? `${field.loadFrom}&per_page=9999`
                            : `${field.loadFrom}?per_page=9999`;
                        const response = await api.get(url);
                        const data = response.data.data;

                        // Extract the actual array based on endpoint
                        // E.g., /properties returns data.properties, /clients returns data.clients
                        const dataKey = field.loadFrom.split('/').pop().split('?')[0]; // 'properties', 'clients', etc.
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
        const initializeForm = async () => {
            if (!isOpen) return;

            if (item) {
                // Edit mode - populate with item data
                const initialData = {};
                config.formFields?.forEach((field) => {
                    let value = item[field.key];

                    // Convert boolean values to string for YES_NO select fields
                    if (field.type === 'select' && typeof value === 'boolean') {
                        value = value ? '1' : '0';
                    }

                    // Handle multi-select: check for relationship data (e.g., owners)
                    if (field.isMulti && field.type === 'select') {
                        // Look for relationship data in item (e.g., item.owners)
                        const relationshipKey = field.key.replace('_ids', 's'); // owner_ids -> owners
                        const relationshipData = item[relationshipKey] || item[field.key.replace('_id', '').replace('_ids', '')];

                        if (Array.isArray(relationshipData)) {
                            // Extract IDs from relationship array
                            value = relationshipData.map(rel => rel.id);
                        } else if (Array.isArray(value)) {
                            value = value;
                        } else {
                            value = [];
                        }
                    }

                    initialData[field.key] = value !== undefined && value !== null ? value : (field.isMulti ? [] : '');
                });
                setFormData(initialData);

                // Load controlled field options based on initial control field values
                const controlledFields = config.formFields?.filter(f =>
                    f.controlledBy && initialData[f.controlledBy]
                ) || [];

                for (const field of controlledFields) {
                    await loadFieldOptions(field, initialData[field.controlledBy]);
                }
            } else {
                // Create mode - initialize with empty values or defaults
                const initialData = {};
                config.formFields?.forEach((field) => {
                    // Handle default values that are functions
                    let defaultVal = field.defaultValue;
                    if (typeof defaultVal === 'function') {
                        defaultVal = defaultVal();
                    }

                    initialData[field.key] = defaultVal !== undefined ? defaultVal : (field.isMulti ? [] : '');
                });
                setFormData(initialData);

                // Load controlled field options based on default control field values
                const controlledFields = config.formFields?.filter(f =>
                    f.controlledBy && initialData[f.controlledBy]
                ) || [];

                for (const field of controlledFields) {
                    await loadFieldOptions(field, initialData[field.controlledBy]);
                }
            }
            setErrors({});
            setUploadedFiles({});
        };

        initializeForm();
    }, [isOpen, item, config.formFields]);

    /**
     * Load options for a specific field dynamically
     */
    const loadFieldOptions = async (field, controlValue = null) => {
        if (!field.loadFrom) return;

        console.log(`[RegistryFormModal] Loading options for field: ${field.key}, controlValue: ${controlValue}`);

        try {
            // Determine endpoint based on control field value
            let endpoint = field.loadFrom;

            // If field is conditionally loaded based on another field
            if (field.conditionalLoad && controlValue) {
                const conditional = field.conditionalLoad[controlValue];
                if (conditional && conditional.endpoint) {
                    endpoint = conditional.endpoint;
                    console.log(`[RegistryFormModal] Using conditional endpoint for ${field.key}: ${endpoint}`);
                }
            }

            const url = endpoint.includes('?')
                ? `${endpoint}&per_page=9999`
                : `${endpoint}?per_page=9999`;

            console.log(`[RegistryFormModal] Fetching from URL: ${url}`);
            const response = await api.get(url);
            const data = response.data.data;

            // Extract the actual array based on endpoint
            const dataKey = endpoint.split('/').pop().split('?')[0];
            const items = data[dataKey] || [];
            console.log(`[RegistryFormModal] Loaded ${items.length} items for ${field.key}`);

            // Transform to react-select format
            let optionLabel = field.optionLabel;
            if (field.conditionalLoad && controlValue && field.conditionalLoad[controlValue]) {
                optionLabel = field.conditionalLoad[controlValue].optionLabel || optionLabel;
            }

            const options = items.map(item => ({
                value: item.id,
                label: optionLabel
                    ? (typeof optionLabel === 'function'
                        ? optionLabel(item)
                        : item[optionLabel])
                    : item.name || item.code || item.internal_code || `Item ${item.id}`
            }));

            console.log(`[RegistryFormModal] Setting ${options.length} options for ${field.key}`);
            setDynamicOptions(prev => ({
                ...prev,
                [field.key]: options
            }));
        } catch (error) {
            console.error(`[RegistryFormModal] Error loading options for ${field.key}:`, error);
            setDynamicOptions(prev => ({
                ...prev,
                [field.key]: []
            }));
        }
    };

    /**
     * Handle input change
     */
    const handleChange = async (fieldKey, value) => {
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

        // Check if this field controls other fields
        const controlledFields = config.formFields?.filter(f => f.controlledBy === fieldKey) || [];

        // Reload options for controlled fields
        for (const controlledField of controlledFields) {
            // Clear the value of the controlled field when control changes
            setFormData(prev => ({
                ...prev,
                [controlledField.key]: ''
            }));

            // Reload options based on new control value
            await loadFieldOptions(controlledField, value);
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
            // Pass both formData and uploadedFiles to parent
            await onSave(formData, uploadedFiles);
            // Modal will be closed by parent
        } catch (err) {
            // Error is handled by parent
            console.error('Error saving:', err);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Handle viewing a document
     * Uses blob URL for secure authenticated viewing
     */
    const handleViewDocument = async (document) => {
        const entityTypeSlug = getEntityTypeSlug(config);
        const filename = document.name || 'document.pdf';

        await viewDocument(
            entityTypeSlug,
            item.id,
            document.id,
            filename
        );
    };

    /**
     * Handle viewing a file field (for listing pages like penalties)
     * Uses blob URL for secure authenticated viewing
     */
    const handleViewFileField = async (fieldKey, fileType) => {
        try {
            // Make authenticated request for the file
            const response = await api.get(
                `${config.apiEndpoint}/${item.id}/view/${fileType}`,
                {
                    responseType: 'blob' // Important: get response as blob
                }
            );

            // Create blob URL from response
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/pdf'
            });
            const blobUrl = URL.createObjectURL(blob);

            // Open in new tab
            const newWindow = window.open(blobUrl, '_blank');

            // Clean up blob URL after window loads (or after 1 minute as fallback)
            if (newWindow) {
                newWindow.onload = () => {
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                };
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Errore durante la visualizzazione del file');
        }
    };

    /**
     * Render a form field based on configuration
     */
    const renderField = (field) => {
        // Check showWhen condition - skip rendering if condition not met
        if (field.showWhen && !field.showWhen(formData)) {
            return null;
        }

        // Check if this field has dynamic options loaded from API
        const isDynamicSelect = field.loadFrom && dynamicOptions[field.key];
        let fieldOptions = isDynamicSelect ? dynamicOptions[field.key] : field.options;

        // Handle excludeValue - filter out specific value from options
        if (field.excludeValue && formData[field.excludeValue] && fieldOptions) {
            const excludedId = formData[field.excludeValue];
            fieldOptions = fieldOptions.filter(opt => opt.value !== excludedId);
        }

        // Determine field label - support conditional labels based on control field
        let fieldLabel = field.label;
        if (field.conditionalLabel && field.controlledBy) {
            const controlValue = formData[field.controlledBy];
            if (controlValue && field.conditionalLabel[controlValue]) {
                fieldLabel = field.conditionalLabel[controlValue];
            }
        }

        return (
            <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {fieldLabel}
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
                    field.isMulti ? (
                        // Multi-select mode
                        <Select
                            options={fieldOptions || []}
                            value={fieldOptions?.filter(opt =>
                                Array.isArray(formData[field.key]) && formData[field.key].includes(opt.value)
                            ) || []}
                            onChange={(selectedOptions) => {
                                const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                                handleChange(field.key, values);
                            }}
                            placeholder={field.placeholder || 'Seleziona...'}
                            isDisabled={saving || loadingOptions}
                            isClearable={!field.required}
                            isMulti={true}
                        />
                    ) : (
                        // Single select mode
                        <Select
                            options={fieldOptions || []}
                            value={fieldOptions?.find(opt => opt.value === formData[field.key]) || null}
                            onChange={(selectedOption) => handleChange(field.key, selectedOption?.value || '')}
                            placeholder={field.placeholder || 'Seleziona...'}
                            isDisabled={saving || loadingOptions}
                            isClearable={!field.required}
                        />
                    )
                ) : field.type === 'file' ? (
                    // File upload field
                    <div className="space-y-2">
                        <input
                            type="file"
                            id={`file-${field.key}`}
                            accept={field.accept || '*'}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setUploadedFiles(prev => ({
                                        ...prev,
                                        [field.key]: file
                                    }));
                                    handleChange(field.key, file.name);
                                }
                            }}
                            className="hidden"
                            disabled={saving}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={() => document.getElementById(`file-${field.key}`).click()}
                                variant="secondary"
                                size="sm"
                                disabled={saving}
                            >
                                {field.buttonLabel || 'Scegli file'}
                            </Button>
                            {uploadedFiles[field.key] && (
                                <span className="text-sm text-gray-600">
                                    {uploadedFiles[field.key].name}
                                </span>
                            )}
                        </div>
                        {/* Show existing file link in edit mode (for registry pages with documents) */}
                        {isEdit && item && item.documents && item.documents.length > 0 && (
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleViewDocument(item.documents[0])}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                                    disabled={saving}
                                >
                                    📄 Visualizza PDF allegato
                                </button>
                                <span className="text-xs text-gray-500">
                                    ({item.documents[0].name || 'PDF'})
                                </span>
                            </div>
                        )}
                        {/* Show existing file link in edit mode (for listing pages with direct file fields) */}
                        {isEdit && item && item[field.key] && field.fileType && (
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleViewFileField(field.key, field.fileType)}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline font-medium flex items-center gap-1"
                                    disabled={saving}
                                >
                                    <i className="material-icons text-base">
                                        {field.fileType === 'invoice' ? 'description' : 'receipt'}
                                    </i>
                                    Visualizza file esistente
                                </button>
                                <span className="text-xs text-gray-500">
                                    ({item[field.key].split('/').pop() || 'File PDF'})
                                </span>
                            </div>
                        )}
                    </div>
                ) : field.type === 'date' ? (
                    <DatePicker
                        value={(new Date(formData[field.key])) || ''}
                        onChange={([date]) => {
                            if (date) {
                                handleChange(field.key, DateUtil.formatDate(date));
                            } else {
                                handleChange(field.key, '');
                            }
                        }}
                        placeholder={field.placeholder || 'gg/mm/aaaa'}
                        disabled={saving}
                        className={errors[field.key] ? 'border-red-500' : ''}
                    />
                ) : field.type === 'installments' ? (
                    <InstallmentsFieldGroup
                        value={formData[field.key] || (typeof field.defaultValue === 'function' ? field.defaultValue() : [])}
                        onChange={(installments) => handleChange(field.key, installments)}
                        disabled={saving}
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
                            {/* Grid fields (all fields except textarea, file, and installments) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {config.formFields
                                    .filter((field) => field.type !== 'textarea' && field.type !== 'file' && field.type !== 'installments')
                                    .map((field) => renderField(field))}
                            </div>

                            {/* Full-width complex fields (textarea, file, installments) at the bottom */}
                            {config.formFields
                                .filter((field) => field.type === 'textarea' || field.type === 'file' || field.type === 'installments')
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
                            isEdit
                                ? (config.editButtonLabel || 'Salva Modifiche')
                                : (config.createButtonLabel || 'Crea')
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
