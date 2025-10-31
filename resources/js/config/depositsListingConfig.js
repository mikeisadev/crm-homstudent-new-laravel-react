/**
 * Deposits Listing Configuration
 *
 * Configuration for the Caparre (Deposits) listing page
 * Follows the simple listing pattern with table display and CRUD operations
 */

export const depositsConfig = {
    // Entity metadata
    entity: 'deposit',
    entityPlural: 'deposits',
    title: 'Caparre',
    titleSingular: 'Caparra',
    icon: 'account_balance_wallet',

    // API configuration
    apiEndpoint: '/deposits',

    // Transform data before saving to map polymorphic relationship
    transformBeforeSave: (formData) => {
        const transformed = { ...formData };

        // Map property_type_selector to depositable_type
        if (transformed.property_type_selector) {
            transformed.depositable_type = transformed.property_type_selector === 'room'
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

        // Map depositable_type to property_type_selector for UI
        if (transformed.depositable_type) {
            transformed.property_type_selector = transformed.depositable_type === 'App\\Models\\Room'
                ? 'room'
                : 'property';
        }

        return transformed;
    },

    // Table columns configuration
    columns: [
        {
            key: 'depositable_type',
            label: 'Tipo immobile',
            getValue: (item) => {
                if (!item.depositable_type) return '-';
                return item.depositable_type === 'App\\Models\\Room' ? 'Stanza' : 'Immobile';
            }
        },
        {
            key: 'depositable',
            label: 'Codice immobile',
            getValue: (item) => {
                if (!item.depositable) return '-';
                return item.depositable.internal_code || '-';
            }
        },
        {
            key: 'client',
            label: 'Cliente',
            getValue: (item) => {
                if (!item.client) return '-';
                return `${item.client.first_name} ${item.client.last_name}`;
            }
        },
        {
            key: 'amount',
            label: 'Importo caparra (€)',
            render: (value) => value ? `€ ${parseFloat(value).toFixed(2)}` : '-'
        },
        {
            key: 'payment_document_file',
            label: 'Contabile pagamento',
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
            key: 'depositable_id',
            label: 'Codice stanza',  // Default label
            type: 'select',
            required: true,
            placeholder: 'Seleziona...',
            section: 'Informazioni principali',
            controlledBy: 'property_type_selector',
            loadFrom: '/rooms',  // Default endpoint
            optionLabel: (item) => `${item.internal_code}`,
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
            key: 'client_id',
            label: 'Cliente',
            type: 'select',
            required: true,
            placeholder: 'Seleziona cliente',
            section: 'Informazioni principali',
            loadFrom: '/clients',
            optionLabel: (item) => `${item.first_name} ${item.last_name}`
        },
        {
            key: 'amount',
            label: 'Importo caparra (€)',
            type: 'number',
            required: true,
            placeholder: 'Importo in euro',
            step: '0.01',
            min: '0',
            section: 'Dettagli finanziari'
        },
        {
            key: 'payment_document_file',
            label: 'Carica contabile pagamento caparra',
            type: 'file',
            required: false,
            accept: 'application/pdf',
            placeholder: 'Carica file PDF',
            section: 'Documenti',
            fileType: 'payment' // For viewing existing files
        }
    ]
};
