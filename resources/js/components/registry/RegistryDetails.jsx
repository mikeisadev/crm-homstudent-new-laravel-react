import { useState, useEffect } from 'react';
import AccordionSection from '../ui/AccordionSection';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import DateUtil from '../../utils/date';
import api from '../../services/api';

/**
 * Generic Registry Details Component
 *
 * Displays entity details in accordion sections with inline editing support
 * Configuration-driven to work with any entity type
 *
 * Features:
 * - Per-accordion edit mode
 * - Conditional field rendering (showIf)
 * - Complex field types (meta, contact, banking)
 * - Custom getValue/setValue functions
 *
 * @param {object} config - Registry configuration
 * @param {object} item - Entity object to display
 * @param {function} onEdit - Callback for modal edit (CREATE mode)
 * @param {function} onDelete - Callback for delete button
 * @param {function} onUpdate - Callback for inline updates (UPDATE mode)
 * @returns {JSX.Element}
 */
export default function RegistryDetails({ config, item, onEdit, onDelete, onUpdate }) {

    // GLOBAL EDIT MODE - When big blue "MODIFICA" button is clicked
    const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);

    // Edit state per accordion: { accordionKey: boolean } - DEPRECATED, kept for backward compat
    const [editModes, setEditModes] = useState({});

    // Form data - ALL fields when in global edit mode
    const [globalFormData, setGlobalFormData] = useState({});

    // Form data per accordion: { accordionKey: {...formData} } - DEPRECATED
    const [sectionData, setSectionData] = useState({});

    // Dynamic options for fields that load from API
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Reset edit modes when item changes
    useEffect(() => {
        setIsGlobalEditMode(false);
        setEditModes({});
        setSectionData({});
        setGlobalFormData({});
    }, [item?.id]);

    /**
     * Load dynamic options when entering edit mode
     */
    useEffect(() => {
        const loadDynamicOptions = async () => {
            if (!isGlobalEditMode || !config.accordions) return;

            // Find all fields with loadFrom property across all accordions
            const fieldsToLoad = [];
            config.accordions.forEach(accordion => {
                accordion.fields?.forEach(field => {
                    if (field.loadFrom && field.editable !== false) {
                        fieldsToLoad.push(field);
                    }
                });
            });

            if (fieldsToLoad.length === 0) return;

            setLoadingOptions(true);
            const optionsData = {};

            try {
                const promises = fieldsToLoad.map(async (field) => {
                    try {
                        // IMPORTANT: Add per_page=9999 to get ALL records for select field options
                        // These are for entity correlation, not listing/pagination
                        const url = field.loadFrom.includes('?')
                            ? `${field.loadFrom}&per_page=9999`
                            : `${field.loadFrom}?per_page=9999`;
                        const response = await api.get(url);
                        const data = response.data.data;

                        // Extract array from response
                        const dataKey = field.loadFrom.split('/').pop();
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

                        optionsData[field.key] = options;
                    } catch (error) {
                        console.error(`Error loading options for ${field.key}:`, error);
                        optionsData[field.key] = [];
                    }
                });

                await Promise.all(promises);
                setDynamicOptions(optionsData);
            } catch (error) {
                console.error('Error loading dynamic options:', error);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadDynamicOptions();
    }, [isGlobalEditMode, config.accordions]);

    /**
     * Get display value for a field
     * Supports: custom getValue, displayKey, meta/contact/banking fields, regular fields
     * Formats dates and numbers for display
     */
    const getFieldValue = (field, item) => {
        if (!item) return '-';

        let value;

        // Use custom getValue function if provided
        if (field.getValue) {
            value = field.getValue(item);
        } else if (field.displayKey) {
            // Handle nested fields (e.g., 'property.name')
            const keys = field.displayKey.split('.');
            value = item;
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined || value === null) return '-';
            }
        } else {
            // Handle direct field
            value = item[field.key];
        }

        // Return dash if empty
        if (value === undefined || value === null || value === '') return '-';

        // Format based on type AFTER getting the value
        if (field.type === 'number' && field.suffix) {
            return `${value} ${field.suffix}`;
        }

        // Format date fields for display (YYYY-MM-DD → DD/MM/YYYY)
        if (field.type === 'date' && value) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('it-IT');
                }
            } catch (e) {
                // If date parsing fails, return as-is
            }
        }

        return value;
    };

    /**
     * Get raw field value for editing (no formatting, no display text)
     * IMPORTANT: Never use getValue() here - it returns display text, not raw values!
     * For SELECT fields, we need "business" not "Azienda", "M" not "Uomo", etc.
     */
    const getRawFieldValue = (field, item) => {
        if (!item) return '';

        // Get raw value based on field data location
        let rawValue;

        if (field.isMeta) {
            // Meta data fields (e.g., gender, document_type)
            rawValue = item.meta_data?.[field.key];
        } else if (field.isContact) {
            // Contact data fields (e.g., phone_secondary, email_secondary)
            rawValue = item.contacts_data?.[field.key];
        } else if (field.isBanking) {
            // Banking data fields (e.g., bank_name, iban)
            rawValue = item.banking_data?.[field.key];
        } else if (field.displayKey) {
            // Handle nested fields (e.g., 'property.name')
            const keys = field.displayKey.split('.');
            let value = item;
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined || value === null) return '';
            }
            rawValue = value;
        } else {
            // Direct fields on main entity (e.g., type, first_name, email)
            rawValue = item[field.key];
        }

        // Convert boolean values to string for YES_NO select fields
        if (field.type === 'select' && typeof rawValue === 'boolean') {
            rawValue = rawValue ? '1' : '0';
        }

        // Return raw value, ensuring it's a string (empty string if null/undefined)
        return rawValue !== null && rawValue !== undefined ? rawValue : '';
    };

    /**
     * Filter visible fields based on showIf conditions
     */
    const getVisibleFields = (fields, item) => {
        if (!fields) return [];
        return fields.filter(field => {
            if (!field.showIf) return true;
            return field.showIf(item);
        });
    };

    /**
     * Enable GLOBAL edit mode - ALL fields become editable
     */
    const handleEnableGlobalEdit = () => {
        // Initialize form data with current values from ALL accordions
        const initialData = {};

        config.accordions?.forEach(accordion => {
            const visibleFields = getVisibleFields(accordion.fields, item);
            visibleFields.forEach(field => {
                if (field.editable !== false) {
                    initialData[field.key] = getRawFieldValue(field, item);
                }
            });
        });

        setGlobalFormData(initialData);
        setIsGlobalEditMode(true);
    };

    /**
     * Cancel GLOBAL edit mode
     */
    const handleCancelGlobalEdit = () => {
        setIsGlobalEditMode(false);
        setGlobalFormData({});
    };

    /**
     * Save ALL changes in global edit mode
     */
    const handleSaveGlobalEdit = async () => {
        // Build payload for ALL fields
        const allFields = [];
        config.accordions?.forEach(accordion => {
            const visibleFields = getVisibleFields(accordion.fields, item);
            allFields.push(...visibleFields);
        });

        const payload = buildSavePayload(globalFormData, allFields);

        try {
            await onUpdate(item.id, payload);
            setIsGlobalEditMode(false);
            setGlobalFormData({});
        } catch (error) {
            console.error('Error saving global edit:', error);
            // Error handling will be done by parent component
        }
    };

    /**
     * Handle field change in GLOBAL edit mode
     */
    const handleGlobalFieldChange = (fieldKey, value) => {
        setGlobalFormData(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    /**
     * Enter edit mode for an accordion
     */
    const handleEditAccordion = (accordionKey, fields) => {
        // Initialize form data with current values
        const initialData = {};
        fields.forEach(field => {
            if (field.editable !== false) {
                initialData[field.key] = getRawFieldValue(field, item);
            }
        });

        setSectionData(prev => ({ ...prev, [accordionKey]: initialData }));
        setEditModes(prev => ({ ...prev, [accordionKey]: true }));
    };

    /**
     * Cancel edit mode for an accordion
     */
    const handleCancelEdit = (accordionKey) => {
        setEditModes(prev => ({ ...prev, [accordionKey]: false }));
        setSectionData(prev => {
            const newData = { ...prev };
            delete newData[accordionKey];
            return newData;
        });
    };

    /**
     * Save changes for an accordion
     */
    const handleSaveAccordion = async (accordionKey, fields) => {
        const formData = sectionData[accordionKey];

        // Build save payload with correct structure for backend
        const payload = buildSavePayload(formData, fields);

        try {
            await onUpdate(item.id, payload);
            setEditModes(prev => ({ ...prev, [accordionKey]: false }));
            setSectionData(prev => {
                const newData = { ...prev };
                delete newData[accordionKey];
                return newData;
            });
        } catch (error) {
            console.error('Error saving accordion data:', error);
            // Error handling will be done by parent component
        }
    };

    /**
     * Build save payload with correct structure for backend
     * Separates regular fields, meta_data, contacts_data, banking_data
     */
    const buildSavePayload = (formData, fields) => {
        const payload = {
            meta_data: {},
            contacts_data: {},
            banking_data: {}
        };

        fields.forEach(field => {
            const value = formData[field.key];

            if (field.isMeta) {
                field.type === 'date' 
                    ? payload.meta_data[field.key] = DateUtil.formatDate(value) 
                    : payload.meta_data[field.key] = value;
            } else if (field.isContact) {
                payload.contacts_data[field.key] = value;
            } else if (field.isBanking) {
                payload.banking_data[field.key] = value;
            } else {
                payload[field.key] = value;
            }
        });

        // Remove empty nested objects
        if (Object.keys(payload.meta_data).length === 0) delete payload.meta_data;
        if (Object.keys(payload.contacts_data).length === 0) delete payload.contacts_data;
        if (Object.keys(payload.banking_data).length === 0) delete payload.banking_data;

        return payload;
    };

    /**
     * Handle field change in edit mode
     */
    const handleFieldChange = (accordionKey, fieldKey, value) => {
        setSectionData(prev => ({
            ...prev,
            [accordionKey]: {
                ...prev[accordionKey],
                [fieldKey]: value
            }
        }));
    };

    /**
     * Render a single field (display or edit mode)
     * Now uses GLOBAL edit mode instead of per-accordion
     */
    const renderField = (field, item, accordionKey, isEditMode) => {
        // Use GLOBAL edit mode if active, otherwise fall back to accordion edit mode
        const actualEditMode = isGlobalEditMode || isEditMode;

        // Skip non-editable fields in edit mode
        if (actualEditMode && field.editable === false) {
            return null;
        }

        // Get current value (from edit data or item)
        const displayValue = getFieldValue(field, item);

        // In GLOBAL edit mode, use globalFormData; otherwise use sectionData
        const editValue = isGlobalEditMode
            ? (globalFormData[field.key] ?? '')
            : (isEditMode ? (sectionData[accordionKey]?.[field.key] ?? '') : '');

        // Special case: no label (e.g., notes textarea)
        if (!field.label) {
            if (field.type === 'textarea') {
                return (
                    <div key={field.key} className="col-span-2">
                        {actualEditMode ? (
                            <textarea
                                value={editValue}
                                onChange={(e) => {
                                    if (isGlobalEditMode) {
                                        handleGlobalFieldChange(field.key, e.target.value);
                                    } else {
                                        handleFieldChange(accordionKey, field.key, e.target.value);
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            />
                        ) : (
                            <div className="text-gray-600 whitespace-pre-wrap">
                                {displayValue}
                            </div>
                        )}
                    </div>
                );
            }
            return null;
        }

        // Display-only fields (not editable even in edit mode)
        if (field.type === 'display-only') {
            return (
                <div key={field.key} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                    <div className="font-semibold text-gray-700">{field.label}:</div>
                    <div className="text-gray-600">{displayValue}</div>
                </div>
            );
        }

        return (
            <div key={field.key} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                <div className="font-semibold text-gray-700">{field.label}:</div>
                <div className="text-gray-600">
                    {actualEditMode ? (
                        field.type === 'select' ? (
                            // SELECT dropdown - React-Select
                            (() => {
                                // Get options: either dynamic (from API) or static (from config)
                                const isDynamic = field.loadFrom && dynamicOptions[field.key];
                                const fieldOptions = isDynamic ? dynamicOptions[field.key] : (field.options || []);

                                return (
                                    <Select
                                        options={fieldOptions}
                                        value={fieldOptions.find(opt => opt.value == editValue) || null}
                                        onChange={(selectedOption) => {
                                            const newValue = selectedOption?.value || '';
                                            if (isGlobalEditMode) {
                                                handleGlobalFieldChange(field.key, newValue);
                                            } else {
                                                handleFieldChange(accordionKey, field.key, newValue);
                                            }
                                        }}
                                        placeholder={field.placeholder || 'Seleziona...'}
                                        isDisabled={loadingOptions}
                                        isClearable={field.required !== true}
                                    />
                                );
                            })()
                        ) : field.type === 'date' ? (
                            // DATE picker (Flatpickr)
                            <DatePicker
                                value={(new Date(editValue))}
                                onChange={([date]) => {
                                    if (isGlobalEditMode) {
                                        handleGlobalFieldChange(field.key, date);
                                    } else {
                                        handleFieldChange(accordionKey, field.key, date);
                                    }
                                }}
                                placeholder="Seleziona data"
                                dateFormat="d/m/Y"
                            />
                        ) : (
                            // Regular INPUT (text, number, email, etc.)
                            <Input
                                type={field.type || 'text'}
                                value={editValue}
                                onChange={(e) => {
                                    if (isGlobalEditMode) {
                                        handleGlobalFieldChange(field.key, e.target.value);
                                    } else {
                                        handleFieldChange(accordionKey, field.key, e.target.value);
                                    }
                                }}
                                className="w-full"
                            />
                        )
                    ) : (
                        displayValue
                    )}
                </div>
            </div>
        );
    };

    /**
     * Render accordion section with inline editing support
     */
    const renderAccordion = (accordion) => {
        const isEditMode = editModes[accordion.key] || false;
        const isEditable = accordion.editable !== false;

        // Get visible fields based on conditional rendering
        const visibleFields = getVisibleFields(accordion.fields, item);

        // Empty section - show placeholder
        if (!visibleFields || visibleFields.length === 0) {
            return (
                <AccordionSection
                    key={accordion.key}
                    title={accordion.title}
                    defaultOpen={accordion.defaultOpen}
                >
                    <div className="p-4 text-gray-500 italic text-sm">
                        Sezione da completare
                    </div>
                </AccordionSection>
            );
        }

        return (
            <AccordionSection
                key={accordion.key}
                title={accordion.title}
                defaultOpen={accordion.defaultOpen}
            >
                <div className="p-4">
                    {/* Per-Accordion Edit Buttons - HIDDEN when in global edit mode OR when config.hidePerAccordionEdit is true */}
                    {isEditable && !isGlobalEditMode && !config.hidePerAccordionEdit && (
                        <div className="flex justify-end gap-2 mb-4">
                            {isEditMode ? (
                                <>
                                    <Button
                                        onClick={() => handleSaveAccordion(accordion.key, visibleFields)}
                                        variant="primary"
                                        size="sm"
                                        className="flex items-center gap-1"
                                    >
                                        <i className="material-icons text-sm">save</i>
                                        SALVA
                                    </Button>
                                    <Button
                                        onClick={() => handleCancelEdit(accordion.key)}
                                        variant="secondary"
                                        size="sm"
                                        className="flex items-center gap-1"
                                    >
                                        <i className="material-icons text-sm">close</i>
                                        ANNULLA
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => handleEditAccordion(accordion.key, visibleFields)}
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <i className="material-icons text-sm">edit</i>
                                    MODIFICA
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Fields */}
                    <div className="space-y-1">
                        {visibleFields.map((field) => renderField(field, item, accordion.key, isEditMode))}
                    </div>
                </div>
            </AccordionSection>
        );
    };

    // Empty state
    if (!item) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                        <i className="material-icons text-6xl mb-4">{config.icon}</i>
                        <p>Seleziona un {config.titleSingular.toLowerCase()} dalla lista</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header with Actions */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {config.list.getPrimaryText(item)}
                    </h2>
                    <div className="flex gap-2">
                        {/* GLOBAL EDIT MODE - Big Blue Button */}
                        {isGlobalEditMode ? (
                            <>
                                <Button
                                    onClick={handleSaveGlobalEdit}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <i className="material-icons text-sm">save</i>
                                    SALVA TUTTO
                                </Button>
                                <Button
                                    onClick={handleCancelGlobalEdit}
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                >
                                    <i className="material-icons text-sm">close</i>
                                    ANNULLA
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleEnableGlobalEdit}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <i className="material-icons text-sm">edit</i>
                                    MODIFICA
                                </Button>
                                <Button
                                    onClick={() => onDelete(item.id)}
                                    variant="danger"
                                    className="flex items-center gap-2"
                                >
                                    <i className="material-icons text-sm">delete</i>
                                    ELIMINA
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Accordion Sections */}
            <div className="flex-1 overflow-y-auto">
                {config.accordions?.map((accordion) => renderAccordion(accordion))}
            </div>
        </div>
    );
}
