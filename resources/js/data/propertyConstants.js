/**
 * Property Constants
 * All property-related data constants and enums
 */

// Property Types (Tipologia immobile)
export const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Appartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Ufficio' },
];

// Intended Use (Destinazione d'uso)
export const INTENDED_USE_TYPES = [
    { value: 'residential', label: 'Abitativo' },
    { value: 'directional', label: 'Direzionale' },
    { value: 'commercial', label: 'Commerciale' },
    { value: 'industrial', label: 'Industriale' },
];

// Layout/Arrangement (Disposizione)
export const LAYOUT_TYPES = [
    { value: 'single_level', label: 'Un livello' },
    { value: 'two_levels', label: 'Due livelli' },
];

// Property Status (Stato immobile)
export const PROPERTY_STATUS_TYPES = [
    { value: 'operational', label: 'A regime' },
    { value: 'under_renovation', label: 'In ristrutturazione' },
];

// Property Condition (Stato dell'immobile / Usura)
export const PROPERTY_CONDITION_TYPES = [
    { value: 'new', label: 'Nuovo' },
    { value: 'renovated', label: 'Ristrutturato' },
    { value: 'good', label: 'Buono' },
    { value: 'needs_renovation', label: 'Da Ristrutturare' },
    { value: 'under_renovation', label: 'In Ristrutturazione' },
];

// Energy Certificate (Certificazione energetica)
export const ENERGY_CERTIFICATES = [
    { value: 'a_plus_plus', label: 'Classe A++' },
    { value: 'a_plus', label: 'Classe A+' },
    { value: 'a', label: 'Classe A' },
    { value: 'b', label: 'Classe B' },
    { value: 'c', label: 'Classe C' },
    { value: 'd', label: 'Classe D' },
    { value: 'e', label: 'Classe E' },
    { value: 'f', label: 'Classe F' },
    { value: 'g', label: 'Classe G' },
];

// Heating Types (Riscaldamento)
export const HEATING_TYPES = [
    { value: 'independent_electric', label: 'Indipendente elettrico' },
    { value: 'independent_gas', label: 'Indipendente gas' },
    { value: 'condominium', label: 'Condominio' },
    { value: 'centralized_gas', label: 'Centralizzato Gas' },
];

// Cooling Types (Raffreddamento)
export const COOLING_TYPES = [
    { value: 'independent_air_conditioning', label: 'Indipendente aria condizionata' },
    { value: 'independent_ceiling_fan', label: 'Indipendente ventilatore da soffitto' },
    { value: 'condominium_floor_cooling', label: 'Condominiale raffreddamento pavimento' },
];

// Hot Water Types (Acqua calda)
export const HOT_WATER_TYPES = [
    { value: 'independent_electric', label: 'Indipendente elettrico' },
    { value: 'independent_gas', label: 'Indipendente gas' },
];

// Yes/No Options
export const YES_NO_OPTIONS = [
    { value: '1', label: 'Si' },
    { value: '0', label: 'No' },
];

// Management Type (Gestione) - for property_meta
export const MANAGEMENT_TYPES = [
    { value: 'subrent', label: 'Subaffitto' },
    { value: 'management', label: 'Gestione' },
];

// Property Equipment (Dotazioni immobili)
// These are the 19 equipment items from requirements
export const PROPERTY_EQUIPMENT = [
    { value: 'elevator', label: 'Ascensore' },
    { value: 'kitchen', label: 'Cucina' },
    { value: 'sofa', label: 'Divano' },
    { value: 'oven', label: 'Forno' },
    { value: 'microwave', label: 'Forno a microonde' },
    { value: 'refrigerator', label: 'Frigorifero' },
    { value: 'dishwasher', label: 'Lavastoviglie' },
    { value: 'washing_machine', label: 'Lavatrice' },
    { value: 'coffee_machine', label: 'Macchinetta caffè' },
    { value: 'moka_pot', label: 'Moka da caffè' },
    { value: 'pans_and_pots', label: 'Padelle e pentole' },
    { value: 'plates_cutlery_glasses', label: 'Piatti, posate e bicchieri' },
    { value: 'armchair', label: 'Poltrona' },
    { value: 'central_heating', label: 'Riscaldamento centralizzato' },
    { value: 'autonomous_heating', label: 'Riscaldamento autonomo' },
    { value: 'drying_rack', label: 'Stendibiancheria' },
    { value: 'table_with_chairs', label: 'Tavolo con sedie' },
    { value: 'television', label: 'Televisione' },
    { value: 'terrace', label: 'Terrazzo' },
];
