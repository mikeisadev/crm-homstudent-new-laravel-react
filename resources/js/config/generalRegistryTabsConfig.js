/**
 * General Registry Tabs Configuration
 *
 * Configuration for general-purpose registry entities:
 * - Suppliers (Fornitori)
 * - Owners (Proprietari) - Future
 *
 * These entities don't have related tabs in the third column but maintain
 * the same 3-column layout structure for consistency.
 */

// Import data constants for select fields
import { COUNTRIES } from '../data/countries';
import { ITALIAN_PROVINCES } from '../data/italianProvinces';
import { ITALIAN_CITIES } from '../data/italianCities';

/**
 * Suppliers (Fornitori) Configuration
 * Italian supplier management with SDI, PEC, and comprehensive contact information
 */
export const suppliersConfig = {
    // Entity metadata
    entity: 'supplier',
    entityPlural: 'suppliers',
    title: 'Fornitori',
    titleSingular: 'Fornitore',
    icon: 'business',

    // API configuration
    apiEndpoint: '/suppliers',

    // Editing behavior
    hidePerAccordionEdit: false, // Show per-accordion edit buttons

    // List configuration
    list: {
        searchPlaceholder: 'Cerca fornitore',
        getPrimaryText: (item) => {
            return item.name || 'Fornitore senza nome';
        },
        getSecondaryText: (item) => {
            const parts = [];
            if (item.address) parts.push(item.address);
            if (item.city) parts.push(item.city);
            return parts.join(', ');
        },
        filters: []
    },

    // ===== DETAIL VIEW ACCORDIONS (Inline Editing) =====
    accordions: [
        {
            key: 'info_generali',
            title: 'Info generali',
            icon: 'info',
            defaultOpen: true,
            fields: [
                {
                    key: 'name',
                    label: 'Nome fornitore',
                    type: 'text',
                    placeholder: 'Nome fornitore',
                    required: true,
                },
                {
                    key: 'sdi',
                    label: 'SDI',
                    type: 'text',
                    placeholder: 'Codice SDI',
                },
                {
                    key: 'address',
                    label: 'Indirizzo',
                    type: 'text',
                    placeholder: 'Via, numero civico',
                },
                {
                    key: 'city',
                    label: 'Comune',
                    type: 'select',
                    options: ITALIAN_CITIES,
                    placeholder: 'Seleziona comune',
                    searchable: true,
                },
                {
                    key: 'postal_code',
                    label: 'CAP',
                    type: 'text',
                    placeholder: 'Codice postale',
                },
                {
                    key: 'province',
                    label: 'Provincia',
                    type: 'select',
                    options: ITALIAN_PROVINCES,
                    placeholder: 'Seleziona provincia',
                },
                {
                    key: 'country',
                    label: 'Nazione',
                    type: 'select',
                    options: COUNTRIES,
                    placeholder: 'Seleziona nazione',
                    defaultValue: 'Italia',
                },
                {
                    key: 'contact_person',
                    label: 'Referente',
                    type: 'text',
                    placeholder: 'Nome referente',
                },
                {
                    key: 'phone',
                    label: 'Telefono',
                    type: 'tel',
                    placeholder: '+39',
                },
                {
                    key: 'mobile',
                    label: 'Cellulare',
                    type: 'tel',
                    placeholder: '+39',
                },
                {
                    key: 'fax',
                    label: 'FAX',
                    type: 'text',
                    placeholder: 'Numero fax',
                },
                {
                    key: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'email@example.com',
                },
                {
                    key: 'sending_email',
                    label: 'Email invio',
                    type: 'email',
                    placeholder: 'Email per invio documenti',
                },
                {
                    key: 'pec',
                    label: 'PEC',
                    type: 'email',
                    placeholder: 'pec@pec.it',
                },
            ]
        },
        {
            key: 'note',
            title: 'Note',
            icon: 'description',
            defaultOpen: false,
            fields: [
                {
                    key: 'notes',
                    label: 'Note',
                    type: 'textarea',
                    placeholder: 'Note aggiuntive sul fornitore',
                    rows: 5,
                }
            ]
        }
    ],

    // ===== RELATED DATA TABS (Third Column) =====
    // No related tabs for suppliers - third column remains empty
    // but maintains same width for consistent layout
    tabs: [],

    // ===== FORM FIELDS FOR MODAL (Create/Edit) =====
    formFields: [
        {
            key: 'name',
            label: 'Nome fornitore',
            type: 'text',
            required: true,
            placeholder: 'Nome fornitore',
            section: 'Informazioni principali'
        },
        {
            key: 'sdi',
            label: 'SDI',
            type: 'text',
            required: false,
            placeholder: 'Codice SDI',
            section: 'Informazioni principali'
        },
        {
            key: 'address',
            label: 'Indirizzo',
            type: 'text',
            required: false,
            placeholder: 'Via, numero civico',
            section: 'Informazioni principali'
        },
        {
            key: 'city',
            label: 'Comune',
            type: 'select',
            required: false,
            options: ITALIAN_CITIES,
            placeholder: 'Seleziona comune',
            searchable: true,
            section: 'Informazioni principali'
        },
        {
            key: 'postal_code',
            label: 'CAP',
            type: 'text',
            required: false,
            placeholder: 'Codice postale',
            section: 'Informazioni principali'
        },
        {
            key: 'province',
            label: 'Provincia',
            type: 'select',
            required: false,
            options: ITALIAN_PROVINCES,
            placeholder: 'Seleziona provincia',
            section: 'Informazioni principali'
        },
        {
            key: 'country',
            label: 'Nazione',
            type: 'select',
            required: false,
            options: COUNTRIES,
            placeholder: 'Seleziona nazione',
            defaultValue: 'Italia',
            section: 'Informazioni principali'
        },
        {
            key: 'contact_person',
            label: 'Referente',
            type: 'text',
            required: false,
            placeholder: 'Nome referente',
            section: 'Contatti'
        },
        {
            key: 'phone',
            label: 'Telefono',
            type: 'tel',
            required: false,
            placeholder: '+39',
            section: 'Contatti'
        },
        {
            key: 'mobile',
            label: 'Cellulare',
            type: 'tel',
            required: false,
            placeholder: '+39',
            section: 'Contatti'
        },
        {
            key: 'fax',
            label: 'FAX',
            type: 'text',
            required: false,
            placeholder: 'Numero fax',
            section: 'Contatti'
        },
        {
            key: 'email',
            label: 'Email',
            type: 'email',
            required: false,
            placeholder: 'email@example.com',
            section: 'Contatti'
        },
        {
            key: 'sending_email',
            label: 'Email invio',
            type: 'email',
            required: false,
            placeholder: 'Email per invio documenti',
            section: 'Contatti'
        },
        {
            key: 'pec',
            label: 'PEC',
            type: 'email',
            required: false,
            placeholder: 'pec@pec.it',
            section: 'Contatti'
        },
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            required: false,
            placeholder: 'Note aggiuntive sul fornitore',
            rows: 5,
            section: 'Note'
        }
    ]
};

/**
 * Owners (Proprietari) Configuration
 * Property owners management with property relationship
 */
export const ownersConfig = {
    // Entity metadata
    entity: 'owner',
    entityPlural: 'owners',
    title: 'Proprietari',
    titleSingular: 'Proprietario',
    icon: 'person',

    // API configuration
    apiEndpoint: '/owners',

    // Editing behavior
    hidePerAccordionEdit: false, // Show per-accordion edit buttons

    // List configuration
    list: {
        searchPlaceholder: 'Cerca proprietario',
        getPrimaryText: (item) => {
            return item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Proprietario senza nome';
        },
        getSecondaryText: (item) => {
            const parts = [];
            if (item.address) parts.push(item.address);
            if (item.street_number) parts.push(item.street_number);
            if (item.city) parts.push(item.city);
            return parts.join(', ');
        },
        filters: []
    },

    // ===== DETAIL VIEW ACCORDIONS (Inline Editing) =====
    accordions: [
        {
            key: 'info_generali',
            title: 'Info generali',
            icon: 'info',
            defaultOpen: true,
            fields: [
                {
                    key: 'first_name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Nome del proprietario',
                    required: true,
                },
                {
                    key: 'last_name',
                    label: 'Cognome',
                    type: 'text',
                    placeholder: 'Cognome del proprietario',
                    required: true,
                },
                {
                    key: 'tax_code',
                    label: 'Codice fiscale',
                    type: 'text',
                    placeholder: 'Codice fiscale',
                },
                {
                    key: 'address',
                    label: 'Via',
                    type: 'text',
                    placeholder: 'Via, nome della strada',
                },
                {
                    key: 'street_number',
                    label: 'Numero civico',
                    type: 'text',
                    placeholder: 'Numero civico',
                },
                {
                    key: 'city',
                    label: 'Città',
                    type: 'select',
                    options: ITALIAN_CITIES,
                    placeholder: 'Seleziona città',
                    searchable: true,
                },
                {
                    key: 'postal_code',
                    label: 'CAP',
                    type: 'text',
                    placeholder: 'Codice postale',
                },
                {
                    key: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'email@example.com',
                },
            ]
        }
    ],

    // ===== RELATED DATA TABS (Third Column) =====
    // No related tabs for owners - third column remains empty
    // but maintains same width for consistent layout
    tabs: [],

    // ===== FORM FIELDS FOR MODAL (Create/Edit) =====
    formFields: [
        {
            key: 'first_name',
            label: 'Nome',
            type: 'text',
            required: true,
            placeholder: 'Nome del proprietario',
            section: 'Informazioni principali'
        },
        {
            key: 'last_name',
            label: 'Cognome',
            type: 'text',
            required: true,
            placeholder: 'Cognome del proprietario',
            section: 'Informazioni principali'
        },
        {
            key: 'tax_code',
            label: 'Codice fiscale',
            type: 'text',
            required: false,
            placeholder: 'Codice fiscale',
            section: 'Informazioni principali'
        },
        {
            key: 'address',
            label: 'Via',
            type: 'text',
            required: false,
            placeholder: 'Via, nome della strada',
            section: 'Indirizzo'
        },
        {
            key: 'street_number',
            label: 'Numero civico',
            type: 'text',
            required: false,
            placeholder: 'Numero civico',
            section: 'Indirizzo'
        },
        {
            key: 'city',
            label: 'Città',
            type: 'select',
            required: false,
            options: ITALIAN_CITIES,
            placeholder: 'Seleziona città',
            searchable: true,
            section: 'Indirizzo'
        },
        {
            key: 'postal_code',
            label: 'CAP',
            type: 'text',
            required: false,
            placeholder: 'Codice postale',
            section: 'Indirizzo'
        },
        {
            key: 'email',
            label: 'Email',
            type: 'email',
            required: false,
            placeholder: 'email@example.com',
            section: 'Contatti'
        }
    ]
};

/**
 * Get configuration for a specific general registry entity
 * @param {string} entityType - Type of entity (supplier, owner, etc.)
 * @returns {object} Configuration object
 */
export function getGeneralRegistryConfig(entityType) {
    const configs = {
        supplier: suppliersConfig,
        owner: ownersConfig,
    };

    const config = configs[entityType];
    if (!config) {
        throw new Error(`Unknown general registry entity type: ${entityType}`);
    }

    return config;
}

/**
 * Get all available general registry configs
 * @returns {object} All configurations
 */
export function getAllGeneralRegistryConfigs() {
    return {
        suppliers: suppliersConfig,
        owners: ownersConfig,
    };
}
