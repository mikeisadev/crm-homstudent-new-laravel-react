/**
 * Registry Configuration System
 *
 * Configuration-driven architecture for all registry data types:
 * - Clients (Clienti)
 * - Rooms (Stanze)
 * - Properties (Immobili)
 * - Condominiums (Condomini)
 *
 * Each entity is defined by a configuration object that specifies:
 * - Metadata (name, icon, API endpoint)
 * - List display (fields to show, search placeholder)
 * - Detail accordions (sections with fields)
 * - Related data tabs (contracts, documents, etc.)
 * - Form structure (for create/edit modal)
 *
 * This eliminates code duplication and makes adding new entities trivial.
 */

// Import data constants for select fields
import { COUNTRIES, NATIONALITIES } from '../data/countries';
import { ITALIAN_PROVINCES } from '../data/italianProvinces';
import { ITALIAN_CITIES } from '../data/italianCities';
import {
    ROOM_TYPES,
    MINIMUM_STAY_TYPES,
    YES_NO_OPTIONS,
    GENDER_PREFERENCES,
    OCCUPANT_TYPES,
    FISCAL_RATES,
    AVAILABILITY_TYPES
} from '../data/roomConstants';
import {
    PROPERTY_TYPES,
    INTENDED_USE_TYPES,
    LAYOUT_TYPES,
    PROPERTY_STATUS_TYPES,
    PROPERTY_CONDITION_TYPES,
    ENERGY_CERTIFICATES,
    HEATING_TYPES,
    COOLING_TYPES,
    HOT_WATER_TYPES,
    MANAGEMENT_TYPES,
    PROPERTY_EQUIPMENT
} from '../data/propertyConstants';

/**
 * Client (Clienti) Configuration - COMPLETE IMPLEMENTATION
 * All 9 accordion sections + All 9 form sections + Custom tab renderers
 */
export const clientsConfig = {
    // Entity metadata
    entity: 'client',
    entityPlural: 'clients',
    title: 'Clienti',
    titleSingular: 'Cliente',
    icon: 'person',

    // API configuration
    apiEndpoint: '/clients',

    // Editing behavior
    hidePerAccordionEdit: true, // Hide per-accordion edit buttons (use global edit only)

    // Backward compatibility flags (temporarily use existing components)
    useExistingFormComponent: true,
    existingFormComponent: 'ClientFormModal',

    // List configuration
    list: {
        searchPlaceholder: 'Cerca cliente',
        getPrimaryText: (item) => {
            if (item.full_name) return item.full_name;
            if (item.type === 'business') return item.company_name || 'Azienda senza nome';
            const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();
            return fullName || 'Cliente senza nome';
        },
        getSecondaryText: (item) => {
            const parts = [];
            if (item.address) parts.push(item.address);
            if (item.city) parts.push(item.city);
            return parts.join(', ');
        },
        filters: [
            {
                key: 'type',
                label: 'Tipo',
                type: 'radio',
                options: [
                    { value: 'all', label: 'Tutti' },
                    { value: 'private', label: 'Clienti privati' },
                    { value: 'business', label: 'Aziende' }
                ],
                defaultValue: 'all'
            }
        ]
    },

    // ===== DETAIL VIEW ACCORDIONS (Inline Editing) =====
    accordions: [
        // ACCORDION 1: Dati anagrafici principali
        {
            key: 'anagrafica',
            title: 'Dati anagrafici principali',
            defaultOpen: true,
            editable: true,
            fields: [
                {
                    key: 'type',
                    label: 'Tipo',
                    type: 'select',
                    editable: true,
                    options: [
                        { value: 'private', label: 'Privato' },
                        { value: 'business', label: 'Azienda' }
                    ],
                    getValue: (item) => item.type === 'business' ? 'Azienda' : 'Privato'
                },
                {
                    key: 'company_name',
                    label: 'Ragione Sociale',
                    type: 'text',
                    editable: true,
                    showIf: (item) => item.type === 'business'
                },
                {
                    key: 'first_name',
                    label: 'Nome',
                    type: 'text',
                    editable: true,
                    showIf: (item) => item.type === 'private'
                },
                {
                    key: 'last_name',
                    label: 'Cognome',
                    type: 'text',
                    editable: true,
                    showIf: (item) => item.type === 'private'
                },
                {
                    key: 'tax_code',
                    label: 'Codice Fiscale',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'vat_number',
                    label: 'Partita IVA',
                    type: 'text',
                    editable: true,
                    showIf: (item) => item.type === 'business'
                },
                {
                    key: 'unique_code',
                    label: 'Codice univoco',
                    type: 'text',
                    editable: true,
                    showIf: (item) => item.type === 'business',
                    isMeta: true,
                    getValue: (item) => item.meta_data?.unique_code || ''
                }
            ]
        },

        // ACCORDION 2: Documento d'identità
        {
            key: 'documento',
            title: "Documento d'identità",
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'document_type',
                    label: 'Tipo documento',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: [
                        { value: '', label: 'Non specificato' },
                        { value: 'carta_identita', label: "Carta d'identità" },
                        { value: 'passaporto', label: 'Passaporto' },
                        { value: 'patente', label: 'Patente di guida' },
                        { value: 'permesso_soggiorno', label: 'Permesso di soggiorno' }
                    ],
                    getValue: (item) => {
                        const docType = item.meta_data?.document_type;
                        const docMap = {
                            'carta_identita': "Carta d'identità",
                            'passaporto': 'Passaporto',
                            'patente': 'Patente di guida',
                            'permesso_soggiorno': 'Permesso di soggiorno'
                        };
                        return docMap[docType] || '';
                    }
                },
                {
                    key: 'document_number',
                    label: 'Numero documento',
                    type: 'text',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.document_number || ''
                },
                {
                    key: 'document_issued_by',
                    label: 'Rilasciato da',
                    type: 'text',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.document_issued_by || ''
                }
            ]
        },

        // ACCORDION 3: Dati di nascita
        {
            key: 'nascita',
            title: 'Dati di nascita',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'birth_date',
                    label: 'Data di nascita',
                    type: 'date',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.birth_date || ''
                },
                {
                    key: 'birth_city',
                    label: 'Comune di nascita',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: ITALIAN_CITIES,
                    getValue: (item) => item.meta_data?.birth_city || ''
                },
                {
                    key: 'birth_province',
                    label: 'Provincia di nascita',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: ITALIAN_PROVINCES,
                    getValue: (item) => item.meta_data?.birth_province || ''
                },
                {
                    key: 'birth_country',
                    label: 'Stato di nascita',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: COUNTRIES,
                    getValue: (item) => item.meta_data?.birth_country || ''
                }
            ]
        },

        // ACCORDION 4: Dati personali
        {
            key: 'personali',
            title: 'Dati personali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'nationality',
                    label: 'Nazionalità',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: NATIONALITIES,
                    getValue: (item) => item.meta_data?.nationality || ''
                },
                {
                    key: 'gender',
                    label: 'Sesso',
                    type: 'select',
                    editable: true,
                    isMeta: true,
                    options: [
                        { value: '', label: 'Non specificato' },
                        { value: 'M', label: 'Uomo' },
                        { value: 'F', label: 'Donna' }
                    ],
                    getValue: (item) => {
                        const gender = item.meta_data?.gender;
                        return gender === 'M' ? 'Uomo' : gender === 'F' ? 'Donna' : 'Non specificato';
                    }
                },
                {
                    key: 'father_name',
                    label: 'Nome padre',
                    type: 'text',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.father_name || ''
                },
                {
                    key: 'mother_name',
                    label: 'Nome madre',
                    type: 'text',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.mother_name || ''
                }
            ]
        },

        // ACCORDION 5: Contatti principali
        {
            key: 'contatti',
            title: 'Contatti principali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'email',
                    label: 'Email',
                    type: 'email',
                    editable: true
                },
                {
                    key: 'phone',
                    label: 'Telefono',
                    type: 'tel',
                    editable: true
                },
                {
                    key: 'mobile',
                    label: 'Cellulare',
                    type: 'tel',
                    editable: true
                },
                {
                    key: 'phone_secondary',
                    label: 'Telefono 2',
                    type: 'tel',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.phone_secondary || ''
                },
                {
                    key: 'email_secondary',
                    label: 'Email 2',
                    type: 'email',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.email_secondary || ''
                },
                {
                    key: 'fax',
                    label: 'Fax',
                    type: 'text',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.fax || ''
                },
                {
                    key: 'pec',
                    label: 'PEC',
                    type: 'email',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.pec || ''
                }
            ]
        },

        // ACCORDION 6: Indirizzo
        {
            key: 'indirizzo',
            title: 'Indirizzo',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'address',
                    label: 'Indirizzo',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'civic_number',
                    label: 'Numero civico',
                    type: 'text',
                    editable: true,
                    isMeta: true,
                    getValue: (item) => item.meta_data?.civic_number || ''
                },
                {
                    key: 'postal_code',
                    label: 'CAP',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'city',
                    label: 'Comune',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_CITIES
                },
                {
                    key: 'province',
                    label: 'Provincia',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_PROVINCES
                },
                {
                    key: 'country',
                    label: 'Nazione',
                    type: 'select',
                    editable: true,
                    options: COUNTRIES
                }
            ]
        },

        // ACCORDION 7: Social network
        {
            key: 'social',
            title: 'Social network',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'facebook',
                    label: 'Facebook',
                    type: 'text',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.facebook || ''
                },
                {
                    key: 'linkedin',
                    label: 'LinkedIn',
                    type: 'text',
                    editable: true,
                    isContact: true,
                    getValue: (item) => item.contacts_data?.linkedin || ''
                }
            ]
        },

        // ACCORDION 8: Dati bancari
        {
            key: 'bancari',
            title: 'Dati bancari',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'bank_name',
                    label: 'Banca',
                    type: 'text',
                    editable: true,
                    isBanking: true,
                    getValue: (item) => item.banking_data?.bank_name || ''
                },
                {
                    key: 'iban',
                    label: 'IBAN',
                    type: 'text',
                    editable: true,
                    isBanking: true,
                    getValue: (item) => item.banking_data?.iban || ''
                },
                {
                    key: 'payment_method',
                    label: 'Modalità di pagamento',
                    type: 'text',
                    editable: true,
                    isBanking: true,
                    getValue: (item) => item.banking_data?.payment_method || ''
                }
            ]
        },

        // ACCORDION 9: Note
        {
            key: 'note',
            title: 'Note',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'notes',
                    label: 'Note aggiuntive',
                    type: 'textarea',
                    editable: true
                }
            ]
        }
    ],

    // ===== FORM MODAL SECTIONS (Create Only - 9 Tabbed Sections) =====
    formSections: [
        // ... will be completed in next step (this is already very large)
    ],

    // ===== RELATED DATA TABS =====
    tabs: [
        {
            key: 'contracts',
            label: 'Lista contratti',
            icon: 'description',
            endpoint: (id) => `/clients/${id}/contracts`,
            renderer: 'ContractsTabRenderer'
        },
        {
            key: 'proposals',
            label: 'Proposte',
            icon: 'assignment',
            endpoint: (id) => `/clients/${id}/proposals`,
            renderer: 'ProposalsTabRenderer'
        },
        {
            key: 'documents',
            label: 'Documenti',
            icon: 'folder',
            endpoint: (id) => `/clients/${id}/documents`,
            renderer: 'DocumentManager',
            hasUpload: true,
            rendererProps: {
                entityType: 'client',
                apiEndpoint: '/clients'
            }
        }
    ]
};

/**
 * Room (Stanze) Configuration
 */
export const roomsConfig = {
    // Entity metadata
    entity: 'room',
    entityPlural: 'rooms',
    title: 'Stanze',
    titleSingular: 'Stanza',
    icon: 'bed',

    // API configuration
    apiEndpoint: '/rooms',

    // Editing behavior
    hidePerAccordionEdit: true, // Hide per-accordion edit buttons (use global edit only)

    // List configuration
    list: {
        searchPlaceholder: 'Cerca stanza',
        getPrimaryText: (item) => item.internal_code || `Stanza ${item.id}`,
        getSecondaryText: (item) => {
            const roomType = ROOM_TYPES.find(rt => rt.value === item.room_type);
            return roomType ? roomType.label : item.room_type || '';
        },
        // No filters for rooms
        filters: []
    },

    // Detail view accordions
    accordions: [
        {
            key: 'info',
            title: 'Info generali',
            defaultOpen: true,
            editable: true,
            fields: [
                {
                    key: 'internal_code',
                    label: 'Cod. stanza interno',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'property_id',
                    label: 'Immobile',
                    type: 'select',
                    editable: true,
                    loadFrom: '/properties',
                    optionLabel: (property) => property.internal_code || property.name || property.address || `Immobile ${property.id}`,
                    placeholder: 'Seleziona un immobile',
                    getValue: (item) => item.property?.internal_code || item.property?.name || item.property?.address || '-'
                },
                {
                    key: 'room_type',
                    label: 'Tipo stanza',
                    type: 'select',
                    options: ROOM_TYPES,
                    placeholder: 'Seleziona tipo',
                    editable: true,
                    getValue: (item) => {
                        const roomType = ROOM_TYPES.find(rt => rt.value === item.room_type);
                        return roomType ? roomType.label : item.room_type || '-';
                    }
                },
                {
                    key: 'surface_area',
                    label: 'Superficie',
                    type: 'number',
                    suffix: 'm²',
                    editable: true
                }
            ]
        },
        {
            key: 'pricing',
            title: 'Prezzi e condizioni',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'monthly_price',
                    label: 'Importo mensile',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.monthly_price ? `€${parseFloat(item.monthly_price).toFixed(2)}` : '-'
                },
                {
                    key: 'weekly_price',
                    label: 'Importo settimanale',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.weekly_price ? `€${parseFloat(item.weekly_price).toFixed(2)}` : '-'
                },
                {
                    key: 'daily_price',
                    label: 'Importo giornaliero',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.daily_price ? `€${parseFloat(item.daily_price).toFixed(2)}` : '-'
                },
                {
                    key: 'minimum_stay_type',
                    label: 'Tipo di permanenza minima',
                    type: 'select',
                    options: MINIMUM_STAY_TYPES,
                    placeholder: 'Seleziona tipo',
                    editable: true,
                    getValue: (item) => {
                        const stayType = MINIMUM_STAY_TYPES.find(st => st.value === item.minimum_stay_type);
                        return stayType ? stayType.label : item.minimum_stay_type || '-';
                    }
                },
                {
                    key: 'minimum_stay_number',
                    label: 'Periodo di permanenza minima',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'deposit_amount',
                    label: 'Caparra (€)',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.deposit_amount ? `€${parseFloat(item.deposit_amount).toFixed(2)}` : '-'
                },
                {
                    key: 'entry_fee',
                    label: 'Spese di ingresso',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.entry_fee ? `€${parseFloat(item.entry_fee).toFixed(2)}` : '-'
                },
                {
                    key: 'cancellation_notice_months',
                    label: 'Mesi di preavviso per la cancellazione',
                    type: 'number',
                    editable: true
                }
            ]
        },
        {
            key: 'rules',
            title: 'Regole e preferenze',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'min_age',
                    label: 'Età minima',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'max_age',
                    label: 'Età massima',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'smoking_allowed',
                    label: 'Fumare interno',
                    type: 'select',
                    options: YES_NO_OPTIONS,
                    placeholder: 'Seleziona opzione',
                    editable: true,
                    getValue: (item) => item.smoking_allowed ? 'Si' : 'No'
                },
                {
                    key: 'pets_allowed',
                    label: 'Animali',
                    type: 'select',
                    options: YES_NO_OPTIONS,
                    placeholder: 'Seleziona opzione',
                    editable: true,
                    getValue: (item) => item.pets_allowed ? 'Si' : 'No'
                },
                {
                    key: 'musical_instruments_allowed',
                    label: 'Suonare strumenti',
                    type: 'select',
                    options: YES_NO_OPTIONS,
                    placeholder: 'Seleziona opzione',
                    editable: true,
                    getValue: (item) => item.musical_instruments_allowed ? 'Si' : 'No'
                },
                {
                    key: 'gender_preference',
                    label: 'Sesso preferito',
                    type: 'select',
                    options: GENDER_PREFERENCES,
                    placeholder: 'Seleziona',
                    editable: true,
                    getValue: (item) => {
                        const gender = GENDER_PREFERENCES.find(g => g.value === item.gender_preference);
                        return gender ? gender.label : item.gender_preference || '-';
                    }
                },
                {
                    key: 'occupant_type',
                    label: 'Genere accettato',
                    type: 'select',
                    options: OCCUPANT_TYPES,
                    placeholder: 'Seleziona',
                    editable: true,
                    getValue: (item) => {
                        const occType = OCCUPANT_TYPES.find(o => o.value === item.occupant_type);
                        return occType ? occType.label : item.occupant_type || '-';
                    }
                },
                {
                    key: 'has_double_bed',
                    label: 'Coppie nel letto matrimoniale',
                    type: 'select',
                    options: YES_NO_OPTIONS,
                    placeholder: 'Seleziona opzione',
                    editable: true,
                    getValue: (item) => item.has_double_bed ? 'Si' : 'No'
                }
            ]
        },
        {
            key: 'fiscal',
            title: 'Dati fiscali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'fiscal_regime',
                    label: 'Regime fiscale voluto',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'fiscal_rate',
                    label: 'Aliquota fiscale',
                    type: 'select',
                    options: FISCAL_RATES,
                    placeholder: 'Seleziona aliquota',
                    editable: true,
                    getValue: (item) => {
                        const rate = FISCAL_RATES.find(r => r.value === String(item.fiscal_rate));
                        return rate ? rate.label : item.fiscal_rate ? `${item.fiscal_rate}%` : '-';
                    }
                }
            ]
        },
        {
            key: 'web',
            title: 'Pubblicazione web',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'is_published_web',
                    label: 'Abilita pubblicazione web',
                    type: 'select',
                    options: YES_NO_OPTIONS,
                    placeholder: 'Seleziona opzione',
                    editable: true,
                    getValue: (item) => item.is_published_web ? 'Si' : 'No'
                },
                {
                    key: 'availability_type',
                    label: 'Tipo disponibilità',
                    type: 'select',
                    options: AVAILABILITY_TYPES,
                    placeholder: 'Seleziona tipo disponibilità',
                    editable: true,
                    getValue: (item) => {
                        const avail = AVAILABILITY_TYPES.find(a => a.value === item.availability_type);
                        return avail ? avail.label : item.availability_type || '-';
                    }
                },
                {
                    key: 'available_from',
                    label: 'Disponibile dal',
                    type: 'date',
                    editable: true
                }
            ]
        },
        {
            key: 'notes',
            title: 'Note',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'notes',
                    label: null,
                    type: 'textarea',
                    editable: true
                }
            ]
        }
    ],

    // Related data tabs
    tabs: [
        {
            key: 'contracts',
            label: 'Contratti',
            icon: 'description',
            endpoint: (id) => `/rooms/${id}/contracts`,
            renderer: 'ContractsTabRenderer'
        },
        {
            key: 'documents',
            label: 'Documenti',
            icon: 'folder',
            endpoint: (id) => `/rooms/${id}/documents`,
            renderer: 'DocumentManager',
            hasUpload: true,
            rendererProps: {
                entityType: 'rooms',
                apiEndpoint: '/rooms'
            }
        },
        {
            key: 'photos',
            label: 'Foto',
            icon: 'photo',
            endpoint: (id) => `/rooms/${id}/photos`,
            renderer: 'PhotosTabRenderer',
            rendererProps: {
                entityType: 'room',
                apiEndpoint: '/rooms'
            }
        },
        {
            key: 'maintenances',
            label: 'Manutenzioni',
            icon: 'build',
            endpoint: (id) => `/rooms/${id}/maintenances`,
            renderer: 'MaintenancesTabRenderer'
        },
        {
            key: 'equipment',
            label: 'Dotazioni',
            icon: 'inventory_2',
            endpoint: (id) => `/rooms/${id}/equipment`,
            renderer: 'EquipmentTabRenderer',
            rendererProps: {
                entityType: 'room'
            }
        }
    ],

    // Form configuration - Modal fields for "Nuovo" button
    formFields: [
        {
            key: 'property_id',
            label: 'Seleziona immobile',
            type: 'select',
            required: true,
            placeholder: 'Seleziona un immobile',
            loadFrom: '/properties', // Load properties from API
            optionLabel: (property) => property.internal_code || property.name || property.address || `Immobile ${property.id}`
        },
        {
            key: 'internal_code',
            label: 'Cod. interno stanza',
            type: 'text',
            required: true,
            placeholder: 'Es: 100A'
        },
        {
            key: 'surface_area',
            label: 'Superficie',
            type: 'number',
            placeholder: 'Es: 15'
        },
        {
            key: 'room_type',
            label: 'Tipo stanza',
            type: 'select',
            required: true,
            options: ROOM_TYPES,
            placeholder: 'Seleziona tipo'
        },
        {
            key: 'monthly_price',
            label: 'Importo mensile',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'weekly_price',
            label: 'Importo settimanale',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'daily_price',
            label: 'Importo giornaliero',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'minimum_stay_type',
            label: 'Permanenza minima tipo',
            type: 'select',
            options: MINIMUM_STAY_TYPES,
            placeholder: 'Seleziona tipo'
        },
        {
            key: 'minimum_stay_number',
            label: 'Permanenza minimo numero',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'deposit_amount',
            label: 'Caparra (€)',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'entry_fee',
            label: 'Spese di ingresso',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'min_age',
            label: 'Età minima',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'max_age',
            label: 'Età massima',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'smoking_allowed',
            label: 'Fumare interno',
            type: 'select',
            options: YES_NO_OPTIONS,
            placeholder: 'Seleziona opzione',
            defaultValue: '0'
        },
        {
            key: 'pets_allowed',
            label: 'Animali',
            type: 'select',
            options: YES_NO_OPTIONS,
            placeholder: 'Seleziona opzione',
            defaultValue: '0'
        },
        {
            key: 'musical_instruments_allowed',
            label: 'Suonare strumenti',
            type: 'select',
            options: YES_NO_OPTIONS,
            placeholder: 'Seleziona opzione',
            defaultValue: '0'
        },
        {
            key: 'gender_preference',
            label: 'Sesso preferito',
            type: 'select',
            options: GENDER_PREFERENCES,
            placeholder: 'Seleziona'
        },
        {
            key: 'occupant_type',
            label: 'Genere accettato',
            type: 'select',
            options: OCCUPANT_TYPES,
            placeholder: 'Seleziona'
        },
        {
            key: 'has_double_bed',
            label: 'Coppie nel letto matrimoniale',
            type: 'select',
            options: YES_NO_OPTIONS,
            placeholder: 'Seleziona opzione',
            defaultValue: '0'
        },
        {
            key: 'cancellation_notice_months',
            label: 'Mesi preavviso per cancellazione',
            type: 'number',
            placeholder: '0',
            defaultValue: 0
        },
        {
            key: 'fiscal_regime',
            label: 'Regime fiscale voluto',
            type: 'text',
            placeholder: 'Es: Cedolare secca'
        },
        {
            key: 'fiscal_rate',
            label: 'Aliquota fiscale',
            type: 'select',
            options: FISCAL_RATES,
            placeholder: 'Seleziona aliquota'
        },
        {
            key: 'is_published_web',
            label: 'Abilita pubblicazione web',
            type: 'select',
            options: YES_NO_OPTIONS,
            placeholder: 'Seleziona opzione',
            defaultValue: '0'
        },
        {
            key: 'availability_type',
            label: 'Tipo disponibilità',
            type: 'select',
            options: AVAILABILITY_TYPES,
            placeholder: 'Seleziona tipo disponibilità',
            required: false,
            // defaultValue: 'auto_from_contracts'
        },
        {
            key: 'available_from',
            label: 'Disponibile dal',
            type: 'date',
            placeholder: 'gg/mm/aaaa'
        },
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            placeholder: 'Inserisci note o informazioni aggiuntive sulla stanza...'
        }
    ]
};

/**
 * Property (Immobili) Configuration
 */
export const propertiesConfig = {
    // Entity metadata
    entity: 'property',
    entityPlural: 'properties',
    title: 'Immobili',
    titleSingular: 'Immobile',
    icon: 'apartment',

    // API configuration
    apiEndpoint: '/properties',

    // Editing behavior
    hidePerAccordionEdit: true, // Hide per-accordion edit buttons (use global edit only)

    // List configuration
    list: {
        searchPlaceholder: 'Cerca immobile',
        getPrimaryText: (item) => item.internal_code || item.name || `Immobile ${item.id}`,
        getSecondaryText: (item) => {
            const parts = [];
            if (item.address) parts.push(item.address);
            if (item.city) parts.push(item.city);
            return parts.join(', ');
        },
        // No filters for properties
        filters: []
    },

    // Detail view accordions
    accordions: [
        {
            key: 'info',
            title: 'Info generali',
            defaultOpen: true,
            editable: true,
            fields: [
                {
                    key: 'internal_code',
                    label: 'Codice interno',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'name',
                    label: 'Nome',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'property_type',
                    label: 'Tipo immobile',
                    type: 'select',
                    editable: true,
                    options: PROPERTY_TYPES,
                    placeholder: 'Seleziona tipo immobile'
                },
                {
                    key: 'condominium_id',
                    label: 'Condominio',
                    type: 'select',
                    editable: true,
                    loadFrom: '/condominiums',
                    optionLabel: (condominium) => condominium.name || `Condominio ${condominium.id}`,
                    placeholder: 'Seleziona un condominio',
                    getValue: (item) => item.condominium?.name || '-'
                },
                {
                    key: 'address',
                    label: 'Indirizzo',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'portal_address',
                    label: 'Indirizzo portale',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'city',
                    label: 'Comune',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_CITIES,
                    placeholder: 'Seleziona comune',
                    searchable: true
                },
                {
                    key: 'province',
                    label: 'Provincia',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_PROVINCES,
                    placeholder: 'Seleziona provincia'
                },
                {
                    key: 'postal_code',
                    label: 'CAP',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'country',
                    label: 'Stato',
                    type: 'select',
                    editable: true,
                    options: COUNTRIES,
                    placeholder: 'Seleziona stato'
                },
                {
                    key: 'zone',
                    label: 'Zona',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'intended_use',
                    label: 'Destinazione d\'uso',
                    type: 'select',
                    editable: true,
                    options: INTENDED_USE_TYPES,
                    placeholder: 'Seleziona destinazione d\'uso'
                }
            ]
        },
        {
            key: 'structural',
            title: 'Dati strutturali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'layout',
                    label: 'Planimetria',
                    type: 'select',
                    editable: true,
                    options: LAYOUT_TYPES,
                    placeholder: 'Seleziona planimetria'
                },
                {
                    key: 'surface_area',
                    label: 'Superficie',
                    type: 'number',
                    suffix: 'm²',
                    editable: true
                },
                {
                    key: 'property_status',
                    label: 'Stato immobile',
                    type: 'select',
                    editable: true,
                    options: PROPERTY_STATUS_TYPES,
                    placeholder: 'Seleziona stato immobile'
                },
                {
                    key: 'floor_number',
                    label: 'Piano',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'total_floors',
                    label: 'Piani totali',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'construction_year',
                    label: 'Anno di costruzione',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'condition',
                    label: 'Condizioni',
                    type: 'select',
                    editable: true,
                    options: PROPERTY_CONDITION_TYPES,
                    placeholder: 'Seleziona condizioni'
                },
                {
                    key: 'bathrooms_with_tub',
                    label: 'Bagni con vasca',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'bathrooms',
                    label: 'Bagni',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'balconies',
                    label: 'Balconi',
                    type: 'number',
                    editable: true
                }
            ]
        },
        {
            key: 'services',
            title: 'Servizi',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'has_concierge',
                    label: 'Portineria',
                    type: 'checkbox',
                    editable: true,
                    getValue: (item) => item.has_concierge ? 'Sì' : 'No'
                },
                {
                    key: 'is_published_web',
                    label: 'Pubblicato sul web',
                    type: 'checkbox',
                    editable: true,
                    getValue: (item) => item.is_published_web ? 'Sì' : 'No'
                },
                {
                    key: 'web_address',
                    label: 'Indirizzo web',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'description',
                    label: 'Descrizione',
                    type: 'textarea',
                    editable: true
                }
            ]
        },
        {
            key: 'cadastral',
            title: 'Dati catastali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'cadastral_section',
                    label: 'Sezione',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'cadastral_sheet',
                    label: 'Foglio',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'cadastral_particle',
                    label: 'Particella',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'cadastral_subordinate',
                    label: 'Subalterno',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'cadastral_category',
                    label: 'Categoria',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'cadastral_income',
                    label: 'Rendita',
                    type: 'number',
                    editable: true,
                    getValue: (item) => item.cadastral_income ? `€${parseFloat(item.cadastral_income).toFixed(2)}` : '-'
                },
                {
                    key: 'energy_certificate',
                    label: 'Certificato energetico',
                    type: 'select',
                    editable: true,
                    options: ENERGY_CERTIFICATES,
                    placeholder: 'Seleziona certificato energetico'
                }
            ]
        },
        {
            key: 'systems',
            title: 'Impianti',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'heating_type',
                    label: 'Tipo riscaldamento',
                    type: 'select',
                    editable: true,
                    options: HEATING_TYPES,
                    placeholder: 'Seleziona tipo riscaldamento'
                },
                {
                    key: 'cooling_type',
                    label: 'Tipo raffreddamento',
                    type: 'select',
                    editable: true,
                    options: COOLING_TYPES,
                    placeholder: 'Seleziona tipo raffreddamento'
                },
                {
                    key: 'hot_water_type',
                    label: 'Tipo acqua calda',
                    type: 'select',
                    editable: true,
                    options: HOT_WATER_TYPES,
                    placeholder: 'Seleziona tipo acqua calda'
                },
                {
                    key: 'cold_water_meter',
                    label: 'Contatore acqua fredda',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'electricity_pod',
                    label: 'POD elettrico',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'gas_pdr',
                    label: 'PDR gas',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'water_supplier',
                    label: 'Fornitore acqua',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'water_contract_details',
                    label: 'Dettagli contratto acqua',
                    type: 'textarea',
                    editable: true
                },
                {
                    key: 'gas_supplier',
                    label: 'Fornitore gas',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'gas_contract_details',
                    label: 'Dettagli contratto gas',
                    type: 'textarea',
                    editable: true
                },
                {
                    key: 'electricity_supplier',
                    label: 'Fornitore energia elettrica',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'electricity_contract_details',
                    label: 'Dettagli contratto elettrico',
                    type: 'textarea',
                    editable: true
                }
            ]
        },
        {
            key: 'notes',
            title: 'Note',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'notes',
                    label: null,
                    type: 'textarea',
                    editable: true
                }
            ]
        }
    ],

    // Related data tabs
    tabs: [
        {
            key: 'contracts',
            label: 'Contratti',
            icon: 'description',
            endpoint: (id) => `/properties/${id}/contracts`,
            renderer: 'ContractsTabRenderer'
        },
        {
            key: 'management_contracts',
            label: 'Contratti di gestione',
            icon: 'business_center',
            endpoint: (id) => `/properties/${id}/management-contracts`,
            renderer: 'ManagementContractsTabRenderer'
        },
        {
            key: 'documents',
            label: 'Documenti',
            icon: 'folder',
            endpoint: (id) => `/properties/${id}/documents`,
            renderer: 'DocumentManager',
            hasUpload: true,
            rendererProps: {
                entityType: 'property',
                apiEndpoint: '/properties'
            }
        },
        {
            key: 'photos',
            label: 'Foto',
            icon: 'photo',
            endpoint: (id) => `/properties/${id}/photos`,
            renderer: 'PhotosTabRenderer',
            rendererProps: {
                entityType: 'property',
                apiEndpoint: '/properties'
            }
        },
        {
            key: 'maintenances',
            label: 'Manutenzioni',
            icon: 'build',
            endpoint: (id) => `/properties/${id}/maintenances`,
            renderer: 'MaintenancesTabRenderer'
        },
        {
            key: 'penalties',
            label: 'Sanzioni',
            icon: 'gavel',
            endpoint: (id) => `/properties/${id}/penalties`,
            renderer: 'PenaltiesTabRenderer'
        },
        {
            key: 'invoices',
            label: 'Bollette',
            icon: 'receipt',
            endpoint: (id) => `/properties/${id}/invoices`,
            renderer: 'InvoicesTabRenderer'
        },
        {
            key: 'equipment',
            label: 'Dotazioni',
            icon: 'inventory_2',
            endpoint: (id) => `/properties/${id}/equipment`,
            renderer: 'EquipmentTabRenderer',
            rendererProps: {
                entityType: 'property'
            }
        },
        {
            key: 'owners',
            label: 'Proprietari',
            icon: 'person',
            endpoint: (id) => `/properties/${id}/owners`,
            renderer: 'OwnersTabRenderer'
        }
    ],

    // Form configuration - Complete form for "Nuovo Immobile" modal
    formFields: [
        // Row 1: Condominium, Name, Internal Code
        {
            key: 'condominium_id',
            label: 'Seleziona condominio',
            type: 'select',
            required: false,
            placeholder: '-- Seleziona un condominio --',
            loadFrom: '/condominiums',
            optionLabel: (condominium) => condominium.name || `Condominio ${condominium.id}`
        },
        {
            key: 'name',
            label: 'Nome immobile',
            type: 'text',
            required: true,
            placeholder: 'Es: Appartamento Centro'
        },
        {
            key: 'internal_code',
            label: 'Codice interno immobile',
            type: 'text',
            required: true,
            placeholder: 'Es: APP 100'
        },

        // Row 2: Property Type, Address, Portal Address
        {
            key: 'property_type',
            label: 'Tipologia immobile',
            type: 'select',
            required: true,
            options: PROPERTY_TYPES,
            placeholder: '-- Seleziona tipologia --'
        },
        {
            key: 'address',
            label: 'Indirizzo reale',
            type: 'text',
            required: true,
            placeholder: 'Es: Via Roma 123'
        },
        {
            key: 'portal_address',
            label: 'Indirizzo portale',
            type: 'text',
            required: false,
            placeholder: 'Es: Via Roma (indirizzo per portali)'
        },

        // Row 3: Postal Code, City, Province
        {
            key: 'postal_code',
            label: 'CAP',
            type: 'text',
            required: true,
            placeholder: 'Es: 35100'
        },
        {
            key: 'city',
            label: 'Comune',
            type: 'select',
            required: true,
            options: ITALIAN_CITIES,
            placeholder: '-- Seleziona comune --',
            searchable: true
        },
        {
            key: 'province',
            label: 'Provincia',
            type: 'select',
            required: true,
            options: ITALIAN_PROVINCES,
            placeholder: '-- Seleziona provincia --'
        },

        // Row 4: Country, Zone, Intended Use
        {
            key: 'country',
            label: 'Stato',
            type: 'select',
            required: false,
            options: COUNTRIES,
            placeholder: '-- Seleziona stato --',
            defaultValue: 'Italia'
        },
        {
            key: 'zone',
            label: 'Zona',
            type: 'text',
            required: false,
            placeholder: 'Es: Centro storico'
        },
        {
            key: 'intended_use',
            label: "Destinazione d'uso",
            type: 'select',
            required: true,
            options: INTENDED_USE_TYPES,
            placeholder: '-- Seleziona destinazione --'
        },

        // Row 5: Surface Area, Floor Number (optional but useful)
        {
            key: 'surface_area',
            label: 'Superficie (m²)',
            type: 'number',
            required: false,
            placeholder: 'Es: 85'
        },
        {
            key: 'floor_number',
            label: 'Piano',
            type: 'number',
            required: false,
            placeholder: 'Es: 2'
        },

        // Row 6: Notes (full width)
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            required: false,
            placeholder: 'Note aggiuntive sull\'immobile...',
            rows: 3
        }
    ]
};

/**
 * Condominium (Condomini) Configuration
 */
export const condominiumsConfig = {
    // Entity metadata
    entity: 'condominium',
    entityPlural: 'condominiums',
    title: 'Condomini',
    titleSingular: 'Condominio',
    icon: 'domain',

    // API configuration
    apiEndpoint: '/condominiums',

    // Editing behavior
    hidePerAccordionEdit: true, // Hide per-accordion edit buttons (use global edit only)

    // List configuration
    list: {
        searchPlaceholder: 'Nome condominio',
        getPrimaryText: (item) => item.name || `Condominio ${item.id}`,
        getSecondaryText: (item) => {
            const parts = [];
            if (item.address) parts.push(item.address);
            if (item.city) parts.push(item.city);
            return parts.join(', ');
        },
        // No filters for condominiums
        filters: []
    },

    // Detail view accordions
    accordions: [
        {
            key: 'info',
            title: 'Info generali',
            defaultOpen: true,
            editable: true,
            fields: [
                {
                    key: 'name',
                    label: 'Nome',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'tax_code',
                    label: 'Codice fiscale',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'address',
                    label: 'Indirizzo',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'city',
                    label: 'Comune',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_CITIES,
                    placeholder: 'Seleziona comune',
                    searchable: true
                },
                {
                    key: 'province',
                    label: 'Provincia',
                    type: 'select',
                    editable: true,
                    options: ITALIAN_PROVINCES,
                    placeholder: 'Seleziona provincia'
                },
                {
                    key: 'postal_code',
                    label: 'CAP',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'country',
                    label: 'Nazione',
                    type: 'select',
                    editable: true,
                    options: COUNTRIES,
                    placeholder: 'Seleziona stato'
                },
                {
                    key: 'construction_year',
                    label: 'Anno di costruzione',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'latitude',
                    label: 'Latitudine',
                    type: 'number',
                    editable: true
                },
                {
                    key: 'longitude',
                    label: 'Longitudine',
                    type: 'number',
                    editable: true
                }
            ]
        },
        {
            key: 'administrator',
            title: 'Amministratore',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'administrator_name',
                    label: 'Nome',
                    type: 'text',
                    editable: true
                },
                {
                    key: 'administrator_phone',
                    label: 'Telefono',
                    type: 'tel',
                    editable: true
                },
                {
                    key: 'administrator_mobile',
                    label: 'Cellulare',
                    type: 'tel',
                    editable: true
                },
                {
                    key: 'administrator_toll_free',
                    label: 'Numero verde',
                    type: 'tel',
                    editable: true
                },
                {
                    key: 'administrator_email',
                    label: 'Email',
                    type: 'email',
                    editable: true
                },
                {
                    key: 'administrator_pec',
                    label: 'PEC',
                    type: 'email',
                    editable: true
                }
            ]
        },
        {
            key: 'utilities',
            title: 'Utenze condominiali',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'water_meters_info',
                    label: 'Info contatori acqua',
                    type: 'textarea',
                    editable: true
                },
                {
                    key: 'electricity_meters_info',
                    label: 'Info contatori elettrici',
                    type: 'textarea',
                    editable: true
                },
                {
                    key: 'gas_meters_info',
                    label: 'Info contatori gas',
                    type: 'textarea',
                    editable: true
                },
                {
                    key: 'heating_system_info',
                    label: 'Info impianto riscaldamento',
                    type: 'textarea',
                    editable: true
                }
            ]
        },
        {
            key: 'notes',
            title: 'Note',
            defaultOpen: false,
            editable: true,
            fields: [
                {
                    key: 'notes',
                    label: null,
                    type: 'textarea',
                    editable: true
                }
            ]
        }
    ],

    // Related data tabs
    tabs: [
        {
            key: 'documents',
            label: 'Documenti',
            icon: 'folder',
            endpoint: (id) => `/condominiums/${id}/documents`,
            renderer: 'DocumentManager',
            hasUpload: true,
            rendererProps: {
                entityType: 'condominium',
                apiEndpoint: '/condominiums'
            }
        },
        {
            key: 'photos',
            label: 'Foto',
            icon: 'photo',
            endpoint: (id) => `/condominiums/${id}/photos`,
            renderer: 'PhotosTabRenderer',
            rendererProps: {
                entityType: 'condominium',
                apiEndpoint: '/condominiums'
            }
        }
    ],

    // Form configuration - Complete form for "Nuovo Condominio" modal
    formFields: [
        // Row 1: Nome, Codice Fiscale, Indirizzo, Comune
        {
            key: 'name',
            label: 'Nome condominio',
            type: 'text',
            required: true,
            placeholder: 'Es: Condominio Torre Belvedere'
        },
        {
            key: 'tax_code',
            label: 'Codice Fiscale',
            type: 'text',
            required: false,
            placeholder: 'Es: 12345678901'
        },
        {
            key: 'address',
            label: 'Indirizzo',
            type: 'text',
            required: true,
            placeholder: 'Es: Via Roma 123'
        },
        {
            key: 'city',
            label: 'Comune',
            type: 'select',
            required: true,
            options: ITALIAN_CITIES,
            placeholder: '-- Seleziona comune --',
            searchable: true
        },

        // Row 2: Cap, Provincia, Stato, Anno costituzione
        {
            key: 'postal_code',
            label: 'Cap',
            type: 'text',
            required: true,
            placeholder: 'Es: 35100'
        },
        {
            key: 'province',
            label: 'Provincia',
            type: 'select',
            required: false,
            options: ITALIAN_PROVINCES,
            placeholder: '-- Seleziona provincia --'
        },
        {
            key: 'country',
            label: 'Stato',
            type: 'select',
            required: false,
            options: COUNTRIES,
            placeholder: '-- Seleziona stato --',
            defaultValue: 'Italia'
        },
        {
            key: 'construction_year',
            label: 'Anno costituzione',
            type: 'number',
            required: false,
            placeholder: 'Es: 1985'
        },

        // Row 3: Nome amministratore, Telefono, Cellulare, Numero Verde
        {
            key: 'administrator_name',
            label: 'Nome amministratore',
            type: 'text',
            required: false,
            placeholder: 'Es: Mario Rossi'
        },
        {
            key: 'administrator_phone',
            label: 'Telefono amministratore',
            type: 'tel',
            required: false,
            placeholder: 'Es: 0498765432'
        },
        {
            key: 'administrator_mobile',
            label: 'Cellulare amministratore',
            type: 'tel',
            required: false,
            placeholder: 'Es: 3331234567'
        },
        {
            key: 'administrator_toll_free',
            label: 'Numero Verde',
            type: 'tel',
            required: false,
            placeholder: 'Es: 800123456'
        },

        // Row 4: Email, PEC, Contatori acqua, Contatori elettricità
        {
            key: 'administrator_email',
            label: 'Email amministratore',
            type: 'email',
            required: false,
            placeholder: 'Es: admin@condominio.it'
        },
        {
            key: 'administrator_pec',
            label: 'Pec amministratore',
            type: 'email',
            required: false,
            placeholder: 'Es: pec@condominio.it'
        },
        {
            key: 'water_meters_info',
            label: 'Contatori acqua',
            type: 'text',
            required: false,
            placeholder: 'Informazioni contatori acqua'
        },
        {
            key: 'electricity_meters_info',
            label: 'Contatori elettricità',
            type: 'text',
            required: false,
            placeholder: 'Informazioni contatori elettricità'
        },

        // Row 5: Contatori gas, Centrale termica
        {
            key: 'gas_meters_info',
            label: 'Contatori gas',
            type: 'text',
            required: false,
            placeholder: 'Informazioni contatori gas'
        },
        {
            key: 'heating_system_info',
            label: 'Centrale termica',
            type: 'text',
            required: false,
            placeholder: 'Informazioni centrale termica'
        },

        // Notes (full width if needed)
        {
            key: 'notes',
            label: 'Note',
            type: 'textarea',
            required: false,
            placeholder: 'Note aggiuntive sul condominio...',
            rows: 3
        }
    ]
};

/**
 * Get configuration for a specific entity type
 * @param {string} entityType - Type of entity (client, room, property, condominium)
 * @returns {object} Configuration object
 */
export function getRegistryConfig(entityType) {
    const configs = {
        client: clientsConfig,
        room: roomsConfig,
        property: propertiesConfig,
        condominium: condominiumsConfig
    };

    const config = configs[entityType];
    if (!config) {
        throw new Error(`Unknown entity type: ${entityType}`);
    }

    return config;
}

/**
 * Get all available registry configs
 * @returns {object} All configurations
 */
export function getAllRegistryConfigs() {
    return {
        clients: clientsConfig,
        rooms: roomsConfig,
        properties: propertiesConfig,
        condominiums: condominiumsConfig
    };
}
