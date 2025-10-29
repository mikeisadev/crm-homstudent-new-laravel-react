/**
 * Contract Constants
 * All contract-related data constants and enums
 */

// Contract Types (Tipo di contratto) - Same as proposal types
export const CONTRACT_TYPES = [
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

// Contract Statuses (MUST match EXACTLY the kanban columns from fluxKanbanConfig.js)
export const CONTRACT_STATUSES = [
    { value: 'draft', label: 'Bozze' },
    { value: 'to_send', label: 'Da inviare' },
    { value: 'sent', label: 'Inviato' },
    { value: 'awaiting_client', label: 'In attesa cliente' },
    { value: 'signed', label: 'Firmato con' },
    { value: 'hosted', label: 'Ospitato' },
    { value: 'expired', label: 'Scaduto' },
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
