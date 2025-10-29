/**
 * Management Contract Constants
 * All management contract-related data constants and enums
 */

// Contract Types (Tipo di contratto)
export const CONTRACT_TYPES = [
    { value: 'with_representation', label: 'Con rappresentanza' },
    { value: 'without_representation', label: 'Senza rappresentanza' },
];

// Managers (Gestore)
export const MANAGERS = [
    { value: 'top_rent', label: 'Top Rent' },
];

// Operational Status (Stato operativo)
// These match the kanban column statuses
export const OPERATIONAL_STATUS = [
    { value: 'draft', label: 'Bozza di proposta' },
    { value: 'active', label: 'Contratto attivo' },
    { value: 'ongoing', label: 'Contratto in corso' },
    { value: 'expired', label: 'Contratto scaduto' },
    { value: 'terminated', label: 'Disdetto anticipatamente' },
];
