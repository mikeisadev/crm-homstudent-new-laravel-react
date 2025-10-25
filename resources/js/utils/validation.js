/**
 * Validation utilities for form validation
 * Provides Italian error messages
 */

/**
 * Validate maintenance form
 *
 * @param {Object} form - Form data
 * @returns {Object} Validation result {isValid: boolean, errors: Object}
 */
export const validateMaintenanceForm = (form) => {
    const errors = {};

    if (!form.property_id) errors.property_id = 'Devi selezionare un immobile';
    if (!form.room_id) errors.room_id = 'Devi selezionare una stanza';
    if (!form.maintenance_name) errors.maintenance_name = 'Il nome della manutenzione è obbligatorio';
    if (!form.urgency_type) errors.urgency_type = 'La tipologia di urgenza è obbligatoria';
    if (!form.maintenance_type) errors.maintenance_type = 'La tipologia di manutenzione è obbligatoria';

    if (form.start_date && form.end_date) {
        const start = new Date(form.start_date);
        const end = new Date(form.end_date);
        
        if (start > end) {
            errors.end_date = 'La data di fine deve essere successiva alla data di inizio';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate check-in form
 *
 * @param {Object} form - Form data
 * @returns {Object} Validation result
 */
export const validateCheckinForm = (form) => {
    const errors = {};

    if (!form.checkin_date) {
        errors.checkin_date = 'La data di check-in è obbligatoria';
    }

    if (!form.location) {
        errors.location = 'Il luogo di check-in è obbligatorio';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate check-out form
 *
 * @param {Object} form - Form data
 * @returns {Object} Validation result
 */
export const validateCheckoutForm = (form) => {
    const errors = {};

    if (!form.checkout_date) {
        errors.checkout_date = 'La data di check-out è obbligatoria';
    }

    if (!form.location) {
        errors.location = 'Il luogo di check-out è obbligatorio';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate report form
 *
 * @param {Object} form - Form data
 * @returns {Object} Validation result
 */
export const validateReportForm = (form) => {
    const errors = {};

    if (!form.property_id) errors.property_id = 'Devi selezionare un immobile';
    if (!form.room_id) errors.room_id = 'Devi selezionare una stanza';
    if (!form.activity_name) errors.activity_name = "Il nome dell'attività è obbligatorio";
    if (!form.urgency_type) errors.urgency_type = 'La tipologia di urgenza è obbligatoria';

    if (form.start_date && form.end_date) {
        const start = new Date(form.start_date);
        const end = new Date(form.end_date);

        if (start > end) {
            errors.end_date = 'La data di fine deve essere successiva alla data di inizio';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
