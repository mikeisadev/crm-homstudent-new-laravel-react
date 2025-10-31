/**
 * Penalties Listing Configuration
 *
 * Configuration for the Sanzioni (Penalties) listing page
 * Follows the simple listing pattern with table display and CRUD operations
 */

export const penaltiesConfig = {
    // Entity metadata
    entity: 'penalty',
    entityPlural: 'penalties',
    title: 'Sanzioni',
    titleSingular: 'Sanzione',
    icon: 'gavel',

    // API configuration
    apiEndpoint: '/penalties',

    // Transform data before saving to map polymorphic relationship
    transformBeforeSave: (formData) => {
        const transformed = { ...formData };

        // Map property_type_selector to penaltyable_type
        if (transformed.property_type_selector) {
            transformed.penaltyable_type = transformed.property_type_selector === 'room'
                ? 'App\\Models\\Room'
                : 'App\\Models\\Property';

            // Remove the UI-only field
            delete transformed.property_type_selector;
        }

        return transformed;
    },

    // Transform data when loading for edit to map polymorphic relationship back to UI field
    transformForEdit: (item) => {
        const transformed = { ...item };

        // Map penaltyable_type to property_type_selector for UI
        if (transformed.penaltyable_type) {
            transformed.property_type_selector = transformed.penaltyable_type === 'App\\Models\\Room'
                ? 'room'
                : 'property';
        }

        return transformed;
    },

    // Table columns configuration
    columns: [
        {
            key: 'penaltyable_type',
            label: 'Tipo immobile',
            getValue: (item) => {
                if (!item.penaltyable_type) return '-';
                return item.penaltyable_type === 'App\\Models\\Room' ? 'Stanza' : 'Immobile';
            }
        },
        {
            key: 'penaltyable',
            label: 'Selezione immobile',
            getValue: (item) => {
                if (!item.penaltyable) return '-';
                // For rooms: show internal_code
                if (item.penaltyable_type === 'App\\Models\\Room') {
                    return item.penaltyable.internal_code || '-';
                }
                // For properties: show internal_code
                return item.penaltyable.internal_code || '-';
            }
        },
        {
            key: 'penalty_type',
            label: 'Tipo sanzione',
            getValue: (item) => item.penalty_type || '-'
        },
        {
            key: 'description',
            label: 'Motivo della sanzione',
            getValue: (item) => {
                const desc = item.description || '-';
                return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
            }
        },
        {
            key: 'client',
            label: 'Inquilino sanzionato',
            getValue: (item) => {
                if (!item.client) return '-';
                return `${item.client.first_name} ${item.client.last_name}`;
            }
        },
        {
            key: 'amount',
            label: 'Importo della sanzione (€)',
            render: (value) => value ? `€ ${parseFloat(value).toFixed(2)}` : '-'
        },
        {
            key: 'issue_date',
            label: 'Data inserimento',
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                return date.toLocaleDateString('it-IT');
            }
        },
        {
            key: 'due_date',
            label: 'Data di scadenza',
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                return date.toLocaleDateString('it-IT');
            }
        },
        {
            key: 'invoice_file',
            label: 'Fattura',
            hasFile: true,
            fileType: 'invoice'
        },
        {
            key: 'payment_document_file',
            label: 'Contabile del pagamento',
            hasFile: true,
            fileType: 'payment'
        }
    ],

    // Form fields for modal (Create/Edit)
    formFields: [
        {
            key: 'property_type_selector',
            label: 'Tipo immobile',
            type: 'select',
            required: true,
            options: [
                { value: 'room', label: 'Stanza' },
                { value: 'property', label: 'Immobile' }
            ],
            defaultValue: 'room',
            placeholder: 'Seleziona tipo immobile',
            section: 'Informazioni principali'
        },
        {
            key: 'penaltyable_id',
            label: 'Codice stanza',  // Default label
            type: 'select',
            required: true,
            placeholder: 'Seleziona...',
            section: 'Informazioni principali',
            controlledBy: 'property_type_selector',
            loadFrom: '/rooms',  // Default endpoint (api instance already has /api prefix)
            optionLabel: (item) => `${item.code}${item.property?.address ? ' - ' + item.property.address : ''}`,
            // Conditional configuration based on property_type_selector value
            conditionalLabel: {
                'room': 'Codice stanza',
                'property': 'Codice immobile'
            },
            conditionalLoad: {
                'room': {
                    endpoint: '/rooms',
                    optionLabel: (item) => `${item.internal_code}`
                },
                'property': {
                    endpoint: '/properties',
                    optionLabel: (item) => `${item.internal_code}`
                }
            }
        },
        {
            key: 'penalty_type',
            label: 'Tipo sanzione',
            type: 'text',
            required: true,
            placeholder: 'Es: Danni alla proprietà, Ritardo pagamento, ecc.',
            section: 'Informazioni principali'
        },
        {
            key: 'description',
            label: 'Motivo sanzione',
            type: 'textarea',
            required: true,
            placeholder: 'Descrivi il motivo della sanzione',
            rows: 4,
            section: 'Informazioni principali'
        },
        {
            key: 'client_id',
            label: 'Inquilino sanzionato',
            type: 'select',
            required: true,
            placeholder: 'Seleziona inquilino',
            section: 'Informazioni principali',
            loadFrom: '/clients',
            optionLabel: (item) => `${item.first_name} ${item.last_name}`
        },
        {
            key: 'amount',
            label: 'Importo sanzione',
            type: 'number',
            required: true,
            placeholder: 'Importo in euro',
            step: '0.01',
            min: '0',
            section: 'Dettagli finanziari'
        },
        {
            key: 'issue_date',
            label: 'Data inserimento',
            type: 'date',
            required: true,
            placeholder: 'Data di emissione della sanzione',
            section: 'Dettagli finanziari'
        },
        {
            key: 'due_date',
            label: 'Data di scadenza',
            type: 'date',
            required: false,
            placeholder: 'Data entro cui pagare',
            section: 'Dettagli finanziari'
        },
        {
            key: 'invoice_file',
            label: 'Carica fattura',
            type: 'file',
            required: false,
            accept: 'application/pdf',
            placeholder: 'Carica file PDF',
            section: 'Documenti',
            fileType: 'invoice' // For viewing existing files
        },
        {
            key: 'payment_document_file',
            label: 'Carica contabile di pagamento',
            type: 'file',
            required: false,
            accept: 'application/pdf',
            placeholder: 'Carica file PDF',
            section: 'Documenti',
            fileType: 'payment' // For viewing existing files
        }
    ]
};
