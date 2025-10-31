/**
 * Invoice (Bollette) Constants
 *
 * Data structures for invoice-related select fields
 */

/**
 * Invoice Types - Tipo bolletta
 * English keys with Italian labels
 */
export const INVOICE_TYPES = {
    electric: 'Elettrica',
    gas: 'Gas',
    internet: 'Internet',
    condominium_utilities: 'Utenze condominiali',
    tari: 'Tari'
};

/**
 * Yes/No options for "Invio addebito"
 */
export const SEND_CHARGE_OPTIONS = {
    yes: 'Si',
    no: 'No'
};

/**
 * Month names in Italian
 * Used for "Mesi di competenza" field group
 */
export const MONTHS_IT = [
    { key: 'january', name: 'Gennaio', shortName: 'Gen' },
    { key: 'february', name: 'Febbraio', shortName: 'Feb' },
    { key: 'march', name: 'Marzo', shortName: 'Mar' },
    { key: 'april', name: 'Aprile', shortName: 'Apr' },
    { key: 'may', name: 'Maggio', shortName: 'Mag' },
    { key: 'june', name: 'Giugno', shortName: 'Giu' },
    { key: 'july', name: 'Luglio', shortName: 'Lug' },
    { key: 'august', name: 'Agosto', shortName: 'Ago' },
    { key: 'september', name: 'Settembre', shortName: 'Set' },
    { key: 'october', name: 'Ottobre', shortName: 'Ott' },
    { key: 'november', name: 'Novembre', shortName: 'Nov' },
    { key: 'december', name: 'Dicembre', shortName: 'Dic' }
];
