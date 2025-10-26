/**
 * Client Form Validation Utilities
 * Validates against actual database schema with ENGLISH field names
 */

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidCodiceFiscale = (cf) => {
    if (!cf) return true;
    const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
    return cfRegex.test(cf);
};

const isValidPartitaIva = (piva) => {
    if (!piva) return true;
    const pivaRegex = /^[0-9]{11}$/;
    return pivaRegex.test(piva);
};

const isValidPhone = (phone) => {
    if (!phone) return true;
    const cleaned = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    return phoneRegex.test(cleaned);
};

/**
 * Validate private client form
 */
export const validatePrivateForm = (form) => {
    const errors = {};

    if (!form.first_name?.trim()) {
        errors.first_name = 'Il nome è obbligatorio';
    }

    if (!form.last_name?.trim()) {
        errors.last_name = 'Il cognome è obbligatorio';
    }

    if (!form.tax_code?.trim()) {
        errors.tax_code = 'Il codice fiscale è obbligatorio';
    } else if (!isValidCodiceFiscale(form.tax_code)) {
        errors.tax_code = 'Codice fiscale non valido (16 caratteri)';
    }

    if (!form.email?.trim()) {
        errors.email = "L'email è obbligatoria";
    } else if (!isValidEmail(form.email)) {
        errors.email = 'Formato email non valido';
    }

    if (!form.phone?.trim()) {
        errors.phone = 'Il telefono è obbligatorio';
    } else if (!isValidPhone(form.phone)) {
        errors.phone = 'Formato telefono non valido';
    }

    if (form.mobile && !isValidPhone(form.mobile)) {
        errors.mobile = 'Formato cellulare non valido';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate business client form
 */
export const validateBusinessForm = (form) => {
    const errors = {};

    if (!form.company_name?.trim()) {
        errors.company_name = 'La ragione sociale è obbligatoria';
    }

    if (!form.vat_number?.trim()) {
        errors.vat_number = 'La partita IVA è obbligatoria';
    } else if (!isValidPartitaIva(form.vat_number)) {
        errors.vat_number = 'Partita IVA non valida (11 cifre)';
    }

    if (!form.email?.trim()) {
        errors.email = "L'email è obbligatoria";
    } else if (!isValidEmail(form.email)) {
        errors.email = 'Formato email non valido';
    }

    if (!form.phone?.trim()) {
        errors.phone = 'Il telefono è obbligatorio';
    } else if (!isValidPhone(form.phone)) {
        errors.phone = 'Formato telefono non valido';
    }

    if (form.tax_code && !isValidCodiceFiscale(form.tax_code)) {
        errors.tax_code = 'Codice fiscale non valido';
    }

    if (form.mobile && !isValidPhone(form.mobile)) {
        errors.mobile = 'Formato cellulare non valido';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate client form based on type
 */
export const validateClientForm = (form, type) => {
    if (type === 'business' || form.type === 'business') {
        return validateBusinessForm(form);
    }
    return validatePrivateForm(form);
};
