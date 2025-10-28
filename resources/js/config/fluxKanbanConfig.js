/**
 * Flux Kanban Configuration
 *
 * Configuration for kanban-style workflows:
 * - Management Contracts (Contratti di gestione)
 * - Proposals (Proposte)
 * - Contracts (Contratti)
 *
 * Each configuration defines:
 * - Entity metadata
 * - Status definitions with colors
 * - Card display configuration
 * - Form fields for create/edit modals
 */

/**
 * Management Contracts (Contratti di gestione) Configuration
 */
export const managementContractsConfig = {
    // Entity metadata
    entity: 'management_contract',
    entityPlural: 'management_contracts',
    title: 'Contratti di Gestione',
    titleSingular: 'Contratto di Gestione',
    icon: 'description',

    // API configuration
    apiEndpoint: '/management-contracts',

    // New button label
    newButtonLabel: 'Nuovo Contratto',

    // Status definitions
    statuses: [
        {
            key: 'draft',
            label: 'Bozza di proposta',
            color: 'red',
            bgColor: 'bg-red-500',
            textColor: 'text-white'
        },
        {
            key: 'active',
            label: 'Contratto attivo',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'ongoing',
            label: 'Contratto in corso',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'expired',
            label: 'Contratto scaduto',
            color: 'green',
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            key: 'terminated',
            label: 'Disdetto anticipatamente',
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            textColor: 'text-white'
        }
    ],

    // Card display configuration
    card: {
        // Function to get card title
        getTitle: (item) => `Contratto n.${item.contract_number || item.id}`,

        // Fields to display in card
        fields: [
            {
                key: 'commission_percentage',
                label: 'Compenso Gestione',
                format: (value) => value ? `${value}%` : '0.00%'
            },
            {
                key: 'start_date',
                label: 'Data contratto',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            },
            {
                key: 'end_date',
                label: 'Data fine',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            }
        ]
    },

    // Form fields for modal (will be populated later by user)
    formFields: []
};

/**
 * Proposals (Proposte) Configuration
 */
export const proposalsConfig = {
    // Entity metadata
    entity: 'proposal',
    entityPlural: 'proposals',
    title: 'Proposte',
    titleSingular: 'Proposta',
    icon: 'draft',

    // API configuration
    apiEndpoint: '/proposals',

    // New button label
    newButtonLabel: 'Nuova Proposta',

    // Status definitions
    statuses: [
        {
            key: 'draft',
            label: 'Bozze',
            color: 'red',
            bgColor: 'bg-red-500',
            textColor: 'text-white'
        },
        {
            key: 'to_send',
            label: 'Da inviare',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'pending_outcome',
            label: 'In attesa di esito',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'to_countersign',
            label: 'Da controfirmare',
            color: 'green',
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            key: 'confirmed',
            label: 'Confermata',
            color: 'green',
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            key: 'not_confirmed',
            label: 'Non confermata',
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            textColor: 'text-white'
        }
    ],

    // Card display configuration
    card: {
        // Function to get card title
        getTitle: (item) => `Proposta n. ${item.proposal_number || item.id}`,

        // Fields to display in card
        fields: [
            {
                key: 'property_reference',
                label: '',
                format: (value, item) => {
                    // Display room or property reference
                    if (item.room) {
                        return item.room.internal_code || item.room.name || 'Stanza';
                    }
                    if (item.property) {
                        return item.property.internal_code || item.property.name || 'Immobile';
                    }
                    return '-';
                }
            },
            {
                key: 'client',
                label: '',
                format: (value, item) => {
                    if (item.client) {
                        return `${item.client.name} ${item.client.surname || ''}`.trim();
                    }
                    return '-';
                }
            },
            {
                key: 'proposed_start_date',
                label: 'Data inizio',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            },
            {
                key: 'proposed_end_date',
                label: 'Data scadenza',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            }
        ]
    },

    // Form fields for modal (will be populated later by user)
    formFields: []
};

/**
 * Contracts (Contratti) Configuration
 */
export const contractsConfig = {
    // Entity metadata
    entity: 'contract',
    entityPlural: 'contracts',
    title: 'Contratti',
    titleSingular: 'Contratto',
    icon: 'article',

    // API configuration
    apiEndpoint: '/contracts',

    // New button label
    newButtonLabel: 'Nuovo Contratto',

    // Status definitions
    statuses: [
        {
            key: 'draft',
            label: 'Bozze',
            color: 'red',
            bgColor: 'bg-red-500',
            textColor: 'text-white'
        },
        {
            key: 'to_send',
            label: 'Da inviare',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'sent',
            label: 'Inviato',
            color: 'orange',
            bgColor: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'awaiting_client',
            label: 'In attesa cliente',
            color: 'green',
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            key: 'signed',
            label: 'Firmato con',
            color: 'green',
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            key: 'hosted',
            label: 'Ospitato',
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            textColor: 'text-white'
        },
        {
            key: 'expired',
            label: 'Scaduto',
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            textColor: 'text-white'
        }
    ],

    // Card display configuration
    card: {
        // Function to get card title
        getTitle: (item) => `Contratto n. ${item.contract_number || item.id}`,

        // Fields to display in card
        fields: [
            {
                key: 'property_reference',
                label: '',
                format: (value, item) => {
                    // Display room, property, or condominium reference
                    if (item.room) {
                        return item.room.internal_code || item.room.name || 'Stanza';
                    }
                    if (item.property) {
                        return item.property.internal_code || item.property.name || 'Immobile';
                    }
                    if (item.condominium) {
                        return item.condominium.name || 'Condominio';
                    }
                    return '-';
                }
            },
            {
                key: 'client',
                label: '',
                format: (value, item) => {
                    if (item.client) {
                        return `${item.client.name} ${item.client.surname || ''}`.trim();
                    }
                    return '-';
                }
            },
            {
                key: 'start_date',
                label: 'Data inizio',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            },
            {
                key: 'end_date',
                label: 'Data scadenza',
                format: (value) => value ? new Date(value).toLocaleDateString('it-IT') : '-'
            }
        ]
    },

    // Form fields for modal (will be populated later by user)
    formFields: []
};

/**
 * Get configuration for a specific kanban type
 * @param {string} kanbanType - Type of kanban (management_contract, proposal, contract)
 * @returns {object} Configuration object
 */
export function getKanbanConfig(kanbanType) {
    const configs = {
        management_contract: managementContractsConfig,
        proposal: proposalsConfig,
        contract: contractsConfig
    };

    const config = configs[kanbanType];
    if (!config) {
        throw new Error(`Unknown kanban type: ${kanbanType}`);
    }

    return config;
}

/**
 * Get all available kanban configs
 * @returns {object} All configurations
 */
export function getAllKanbanConfigs() {
    return {
        managementContracts: managementContractsConfig,
        proposals: proposalsConfig,
        contracts: contractsConfig
    };
}
