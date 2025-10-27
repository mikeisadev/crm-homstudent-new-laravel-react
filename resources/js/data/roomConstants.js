/**
 * Room Constants
 * All room-related data constants and enums
 */

// Room Types
export const ROOM_TYPES = [
    { value: 'single_large', label: 'Singola grande' },
    { value: 'single_small', label: 'Singola piccola' },
    { value: 'suite', label: 'Suite' },
    { value: 'suite_excelsior', label: 'Suite excelsior' },
    { value: 'suite_plus_c', label: 'Suite + c' },
    { value: 'royal_suite', label: 'Royal suite' },
    { value: 'premium', label: 'Premium' },
    { value: 'double', label: 'Doppia' },
    { value: 'single_economy', label: 'Singola economica' },
    { value: 'double_plus_b', label: 'Doppia + b' },
    { value: 'studio', label: 'Monolocale' },
];

// Minimum Stay Type
export const MINIMUM_STAY_TYPES = [
    { value: 'days', label: 'Giorni' },
    { value: 'months', label: 'Mesi' },
    { value: 'years', label: 'Anni' },
];

// Yes/No Options
export const YES_NO_OPTIONS = [
    { value: '1', label: 'Si' },
    { value: '0', label: 'No' },
];

// Gender Preference
export const GENDER_PREFERENCES = [
    { value: 'male', label: 'Maschio' },
    { value: 'female', label: 'Femmina' },
    { value: 'single', label: 'Single' },
    { value: 'couple', label: 'Coppia' },
    { value: 'family', label: 'Famiglia' },
    { value: 'any', label: 'Qualsiasi' },
];

// Occupant Type (Genere accettato)
export const OCCUPANT_TYPES = [
    { value: 'student', label: 'Studente' },
    { value: 'worker', label: 'Lavoratore' },
    { value: 'single', label: 'Single' },
    { value: 'couple', label: 'Coppia' },
    { value: 'family', label: 'Famiglia' },
];

// Fiscal Rate (Aliquota fiscale)
export const FISCAL_RATES = [
    { value: '0', label: 'Esente' },
    { value: '10', label: '10%' },
    { value: '14', label: '14%' },
    { value: '22', label: '22%' },
];

// Availability Type
export const AVAILABILITY_TYPES = [
    { value: 'auto_from_contracts', label: 'Automatica da contratti' },
    { value: 'forced_free', label: 'Forza libera' },
    { value: 'forced_occupied', label: 'Forza occupata' },
    { value: 'forced_free_from_date', label: 'Forza libera da data' },
];

// Room Equipment
export const ROOM_EQUIPMENT = [
    { value: 'wardrobe_2_door', label: 'Armadio 2 ante' },
    { value: 'wardrobe_3_door', label: 'Armadio 3 ante' },
    { value: 'wardrobe_4_door', label: 'Armadio 4 ante' },
    { value: 'wardrobe_6_door', label: 'Armadio 6 ante' },
    { value: 'double_bed', label: 'Letto matrimoniale' },
    { value: 'bed_half', label: 'Letto piazza e mezza' },
    { value: 'single_bed', label: 'Letto singolo' },
    { value: 'bedside_table', label: 'Comodino' },
    { value: 'bedside_lamp', label: 'Abat-jour comodino' },
    { value: 'floor_lamp', label: 'Lampada da terra' },
    { value: 'desk', label: 'Scrivania' },
    { value: 'desk_lamp', label: 'Lampada da studio' },
    { value: 'chair', label: 'Sedia' },
    { value: 'drawer_unit', label: 'Cassettiera' },
    { value: 'bookcase', label: 'Libreria' },
    { value: 'sofa', label: 'Divano' },
    { value: 'table', label: 'Tavolino' },
    { value: 'curtain', label: 'Tenda' },
    { value: 'chromecast', label: 'Chromecast' },
    { value: 'armchair', label: 'Poltroncina' },
    { value: 'radiator_panel', label: 'Piastra radiante' },
    { value: 'mirror', label: 'Specchio' },
    { value: 'shoe_rack', label: 'Scarpiera' },
];
