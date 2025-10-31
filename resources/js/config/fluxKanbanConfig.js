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

import { CONTRACT_TYPES, MANAGERS, OPERATIONAL_STATUS } from '../data/managementContractConstants';
import { PROPOSAL_TYPES, PROPERTY_TYPES, PROPOSAL_STATUSES, generateDefaultInstallments } from '../data/proposalConstants';
import { CONTRACT_TYPES as CONT_TYPES, PROPERTY_TYPES as CONT_PROPERTY_TYPES, CONTRACT_STATUSES, generateDefaultInstallments as generateContractInstallments } from '../data/contractConstants';

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
        getTitle: (item) => `${item.contract_number || item.id}`,

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

    // Form fields for modal
    formFields: [
        {
            key: 'property_id',
            label: 'Immobile',
            type: 'select',
            required: true,
            loadFrom: '/properties',
            optionLabel: (item) => item.internal_code || item.name || `Immobile ${item.id}`,
            placeholder: 'Seleziona immobile',
        },
        {
            key: 'contract_type',
            label: 'Tipo di contratto',
            type: 'select',
            required: true,
            options: CONTRACT_TYPES,
            placeholder: 'Seleziona tipo di contratto',
        },
        {
            key: 'owner_ids',
            label: 'Proprietari',
            type: 'select',
            required: false,
            isMulti: true, // Multi-select
            loadFrom: '/owners',
            optionLabel: (item) => item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.company_name || `Proprietario ${item.id}`,
            placeholder: 'Seleziona un proprietario',
        },
        {
            key: 'manager',
            label: 'Gestore',
            type: 'select',
            required: false,
            options: MANAGERS,
            placeholder: 'Seleziona gestore',
        },
        {
            key: 'current_date',
            label: 'Data odierna',
            type: 'date',
            required: false,
            defaultValue: () => new Date().toISOString().split('T')[0], // Today's date
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'start_date',
            label: 'Data inizio',
            type: 'date',
            required: true,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'end_date',
            label: 'Data fine',
            type: 'date',
            required: false,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'notice_months',
            label: 'Mesi di preavviso',
            type: 'number',
            required: false,
            placeholder: '0',
        },
        {
            key: 'status',
            label: 'Stato operativo',
            type: 'select',
            required: true,
            options: OPERATIONAL_STATUS,
            placeholder: 'Seleziona stato',
        },
        {
            key: 'commission_percentage',
            label: 'Compenso di gestione (%)',
            type: 'number',
            required: false,
            placeholder: '0',
            step: '0.01',
        },
        {
            key: 'pdf_document',
            label: 'Carica PDF',
            type: 'file',
            required: false,
            accept: '.pdf',
            buttonLabel: 'Scegli file',
        },
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Inserisci note...',
        },
        {
            key: 'early_termination_notes',
            label: 'Note di dismissione anticipata',
            type: 'textarea',
            required: false,
            rows: 4,
            placeholder: 'Inserisci note di dismissione...',
        }
    ],

    // Custom button labels for create/edit actions
    createButtonLabel: 'Genera contratto',
    editButtonLabel: 'Modifica contratto',
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
                        const fullName = `${item.client.first_name || ''} ${item.client.last_name || ''}`.trim();
                        return fullName || item.client.company_name || '-';
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

    // Form fields for modal
    formFields: [
        {
            key: 'proposal_type',
            label: 'Tipo di proposta',
            type: 'select',
            required: true,
            options: PROPOSAL_TYPES,
            placeholder: 'Seleziona tipo di proposta',
        },
        {
            key: 'proposed_start_date',
            label: 'Data inizio',
            type: 'date',
            required: true,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'proposed_end_date',
            label: 'Data fine',
            type: 'date',
            required: false,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'property_type',
            label: 'Tipo immobile',
            type: 'select',
            required: true,
            options: PROPERTY_TYPES,
            defaultValue: 'room', // Default to "Stanza"
            placeholder: 'Seleziona tipo immobile',
        },
        {
            key: 'room_id',
            label: 'Codice stanza',
            type: 'select',
            required: false,
            loadFrom: '/rooms',
            optionLabel: (item) => item.internal_code || item.name || `Stanza ${item.id}`,
            placeholder: 'Seleziona stanza',
            dependsOn: 'property_type', // Show when property_type === 'room'
            showWhen: (formData) => formData.property_type === 'room',
        },
        {
            key: 'property_id',
            label: 'Codice immobile',
            type: 'select',
            required: false,
            loadFrom: '/properties',
            optionLabel: (item) => item.internal_code || item.name || `Immobile ${item.id}`,
            placeholder: 'Seleziona immobile',
            dependsOn: 'property_type', // Show when property_type === 'property'
            showWhen: (formData) => formData.property_type === 'property',
        },
        {
            key: 'notice_months',
            label: 'Mesi di preavviso',
            type: 'number',
            required: false,
            placeholder: '0',
        },
        {
            key: 'deposit_return_days',
            label: 'Giorni per la restituzione della caparra',
            type: 'number',
            required: false,
            placeholder: '0',
        },
        {
            key: 'client_id',
            label: 'Cliente 1 / Inquilino 1',
            type: 'select',
            required: true,
            loadFrom: '/clients',
            optionLabel: (item) => {
                const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();
                return fullName || item.company_name || `Cliente ${item.id}`;
            },
            placeholder: 'Seleziona cliente',
        },
        {
            key: 'secondary_client_id',
            label: 'Cliente 2 / Inquilino 2',
            type: 'select',
            required: false,
            loadFrom: '/clients',
            optionLabel: (item) => {
                const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();
                return fullName || item.company_name || `Cliente ${item.id}`;
            },
            placeholder: 'Seleziona secondo cliente (opzionale)',
            dependsOn: 'client_id', // Only enabled if client_id is selected
            excludeValue: 'client_id', // Exclude the value from client_id field
        },
        {
            key: 'deposit_amount',
            label: 'Importo caparra',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'entry_fee',
            label: 'Spese ingresso',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'monthly_rent',
            label: 'Canone mensile',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'validity_days',
            label: 'Giorni di validità',
            type: 'number',
            required: false,
            defaultValue: 2, // Default value is 2
            placeholder: '2',
        },
        {
            key: 'installments_json',
            label: '',
            type: 'installments', // Special field type for 12 installments
            required: false,
            defaultValue: () => generateDefaultInstallments(), // Generate 12 empty installments
        },
        {
            key: 'status',
            label: 'Stato',
            type: 'select',
            required: true,
            options: PROPOSAL_STATUSES,
            placeholder: 'Seleziona stato',
        },
    ],

    // Custom button labels for create/edit actions
    createButtonLabel: 'Genera proposta',
    editButtonLabel: 'Modifica proposta',
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
                        const fullName = `${item.client.first_name || ''} ${item.client.last_name || ''}`.trim();
                        return fullName || item.client.company_name || '-';
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

    // Form fields for modal
    formFields: [
        {
            key: 'contract_type',
            label: 'Tipo di contratto',
            type: 'select',
            required: true,
            options: CONT_TYPES,
            placeholder: 'Seleziona tipo di contratto',
        },
        {
            key: 'start_date',
            label: 'Data inizio',
            type: 'date',
            required: true,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'end_date',
            label: 'Data fine',
            type: 'date',
            required: false,
            placeholder: 'gg/mm/aaaa',
        },
        {
            key: 'property_type',
            label: 'Tipo immobile',
            type: 'select',
            required: true,
            options: CONT_PROPERTY_TYPES,
            defaultValue: 'room', // Default to "Stanza"
            placeholder: 'Seleziona tipo immobile',
        },
        {
            key: 'room_id',
            label: 'Codice stanza',
            type: 'select',
            required: false,
            loadFrom: '/rooms',
            optionLabel: (item) => item.internal_code || item.name || `Stanza ${item.id}`,
            placeholder: 'Seleziona stanza',
            dependsOn: 'property_type', // Show when property_type === 'room'
            showWhen: (formData) => formData.property_type === 'room',
        },
        {
            key: 'property_id',
            label: 'Codice immobile',
            type: 'select',
            required: false,
            loadFrom: '/properties',
            optionLabel: (item) => item.internal_code || item.name || `Immobile ${item.id}`,
            placeholder: 'Seleziona immobile',
            dependsOn: 'property_type', // Show when property_type === 'property'
            showWhen: (formData) => formData.property_type === 'property',
        },
        {
            key: 'cancellation_notice_months',
            label: 'Mesi di preavviso',
            type: 'number',
            required: false,
            placeholder: '0',
        },
        {
            key: 'deposit_return_days',
            label: 'Giorni per la restituzione della caparra',
            type: 'number',
            required: false,
            placeholder: '0',
        },
        {
            key: 'client_id',
            label: 'Cliente 1 / Inquilino 1',
            type: 'select',
            required: true,
            loadFrom: '/clients',
            optionLabel: (item) => {
                const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();
                return fullName || item.company_name || `Cliente ${item.id}`;
            },
            placeholder: 'Seleziona cliente',
        },
        {
            key: 'secondary_client_id',
            label: 'Cliente 2 / Inquilino 2',
            type: 'select',
            required: false,
            loadFrom: '/clients',
            optionLabel: (item) => {
                const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();
                return fullName || item.company_name || `Cliente ${item.id}`;
            },
            placeholder: 'Seleziona secondo cliente (opzionale)',
            dependsOn: 'client_id', // Only enabled if client_id is selected
            excludeValue: 'client_id', // Exclude the value from client_id field
        },
        {
            key: 'deposit_amount',
            label: 'Importo caparra',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'entry_fee',
            label: 'Spese ingresso',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'monthly_rent',
            label: 'Canone mensile',
            type: 'number',
            required: false,
            placeholder: '0.00',
            step: '0.01',
        },
        {
            key: 'validity_days',
            label: 'Giorni di validità',
            type: 'number',
            required: false,
            defaultValue: 2, // Default value is 2
            placeholder: '2',
        },
        {
            key: 'installments_json',
            label: '',
            type: 'installments', // Special field type for 12 installments
            required: false,
            defaultValue: () => generateContractInstallments(), // Generate 12 empty installments
        },
        {
            key: 'status',
            label: 'Stato',
            type: 'select',
            required: true,
            options: CONTRACT_STATUSES,
            placeholder: 'Seleziona stato',
        },
    ],

    // Custom button labels for create/edit actions
    createButtonLabel: 'Genera contratto',
    editButtonLabel: 'Modifica contratto',
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
