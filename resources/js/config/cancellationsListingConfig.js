/**
 * Cancellations Listing Configuration
 *
 * Configuration for the Disdette (Cancellations) listing page
 * Follows the simple listing pattern with table display and CRUD operations
 */

export const cancellationsConfig = {
    // Entity metadata
    entity: 'cancellation',
    entityPlural: 'cancellations',
    title: 'Disdette',
    titleSingular: 'Disdetta',
    icon: 'cancel_presentation',

    // API configuration
    apiEndpoint: '/cancellations',

    // Table columns configuration
    columns: [
        {
            key: 'contract',
            label: 'Contratto',
            getValue: (item) => {
                if (!item.contract) return '-';
                // Display contract information (adjust based on Contract model structure)
                return item.contract.contract_code || `Contratto #${item.contract.id}`;
            }
        },
        {
            key: 'cancellation_date',
            label: 'Data richiesta',
            render: (value) => {
                if (!value) return '-';
                return new Date(value).toLocaleDateString('it-IT');
            }
        },
        {
            key: 'reason',
            label: 'Tipologia richiesta',
            render: (value) => value || '-'
        },
        {
            key: 'notes',
            label: 'Note',
            render: (value) => {
                if (!value) return '-';
                // Truncate long notes
                return value.length > 50 ? value.substring(0, 50) + '...' : value;
            }
        }
    ],

    // Form fields for modal (Create/Edit)
    formFields: [
        {
            key: 'contract_id',
            label: 'Seleziona un contratto esistente',
            type: 'select',
            required: true,
            placeholder: 'Seleziona contratto',
            section: 'Informazioni principali',
            loadFrom: '/contracts',
            optionLabel: (item) => {
                // Customize based on Contract model structure
                return item.contract_code || `Contratto #${item.id}`;
            }
        },
        {
            key: 'cancellation_date',
            label: 'Data richiesta della disdetta',
            type: 'date',
            required: true,
            placeholder: 'Seleziona data',
            section: 'Informazioni principali'
        },
        {
            key: 'reason',
            label: 'Tipologia di richiesta',
            type: 'select',
            required: true,
            options: [
                { value: 'Gravi motivi', label: 'Gravi motivi' },
                { value: 'Normale', label: 'Normale' }
            ],
            placeholder: 'Seleziona tipologia',
            section: 'Informazioni principali'
        },
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            required: false,
            placeholder: 'Inserisci note aggiuntive...',
            rows: 4,
            section: 'Dettagli aggiuntivi'
        }
    ]
};
