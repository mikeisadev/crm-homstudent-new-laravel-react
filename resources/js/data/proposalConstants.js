/**
 * Proposal Constants
 * All proposal-related data constants and enums
 */

// Proposal Types (Tipo di proposta)
export const PROPOSAL_TYPES = [
    { value: 'sublease', label: 'Sublocazione' },
    { value: 'free_market_residential', label: 'Abitativo a canone libero' },
    { value: 'agreed_residential', label: 'Abitativo a canone concordato' },
    { value: 'temporary_workers', label: 'Transitorio per lavoratori' },
    { value: 'temporary_students', label: 'Transitorio per studenti' },
];

// Property Types (Tipo immobile) - Room or Property
export const PROPERTY_TYPES = [
    { value: 'room', label: 'Stanza' },
    { value: 'property', label: 'Immobile' },
];

// Proposal Statuses (matching kanban columns from fluxKanbanConfig.js)
export const PROPOSAL_STATUSES = [
    { value: 'draft', label: 'Bozze' },
    { value: 'to_send', label: 'Da inviare' },
    { value: 'pending_outcome', label: 'In attesa di esito' },
    { value: 'to_countersign', label: 'Da controfirmare' },
    { value: 'confirmed', label: 'Confermata' },
    { value: 'not_confirmed', label: 'Non confermata' },
];

/**
 * Generate default installments structure
 * Creates 12 empty installments with is_payment_completed flag
 *
 * @returns {Array} Array of 12 installment objects
 */
export function generateDefaultInstallments() {
    return Array.from({ length: 12 }, (_, index) => ({
        number: index + 1,
        date: '',
        amount: '',
        is_payment_completed: false
    }));
}

/**
 * Validate installments structure
 * Ensures all 12 installments have proper format
 *
 * @param {Array} installments - Array of installment objects
 * @returns {boolean} True if valid
 */
export function validateInstallments(installments) {
    if (!Array.isArray(installments) || installments.length !== 12) {
        return false;
    }

    return installments.every(inst =>
        typeof inst === 'object' &&
        'number' in inst &&
        'date' in inst &&
        'amount' in inst &&
        'is_payment_completed' in inst
    );
}
