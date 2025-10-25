/**
 * Calendar form constants and select options
 * Defines all dropdown values for maintenance, check-in, check-out, and reports
 */

// Maintenance names
export const MAINTENANCE_NAMES = [
    { value: 'mold', label: 'Comparsa di muffa da eliminare' },
    { value: 'infiltration', label: 'Infiltrazione da altra unità' },
    { value: 'masonry_works', label: 'Opere murarie' },
    { value: 'drain_clog', label: 'Otturazione scarico lavabo/doccia/vasca' },
    { value: 'shower_box_problem', label: 'Problema box/asta doccia' },
    { value: 'electrical_problem', label: 'Problema elettrico/illuminazione' },
    { value: 'heating_boiler', label: 'Riscaldamento/caldaia con problemi' },
    { value: 'appliance_breakdown', label: 'Rottura elettrodomestico' },
    { value: 'window_breakage', label: 'Rottura finestre' },
    { value: 'furniture_breakage', label: 'Rottura mobilio' },
    { value: 'door_breakage', label: 'Rottura porte-portoncini' },
    { value: 'shutter_breakage', label: 'Rottura tapparelle-scuri' },
    { value: 'painting', label: 'Tinteggiature' },
];

export const GET_MAINTENANCE_LABEL = (value) => {
    const type = MAINTENANCE_NAMES.find((type) => type.value === value);

    return type ? type.label : 'N/A';
}

// Urgency types
export const URGENCY_TYPES = [
    { value: 'urgent', label: 'Urgente' },
    { value: 'medium', label: 'Medio' },
    { value: 'not_urgent', label: 'Non urgente' },
];

export const GET_URGENCY_LABEL = (value) => {
    const type = URGENCY_TYPES.find((type) => type.value === value);

    return type ? type.label : 'N/A';
}

// Maintenance types
export const MAINTENANCE_TYPES = [
    { value: 'ordinary', label: 'Ordinaria' },
    { value: 'extraordinary', label: 'Straordinaria' },
];

export const GET_MAINTENANCE_TYPE_LABEL = (value) => {
    const type = MAINTENANCE_TYPES.find((type) => type.value === value);

    return type ? type.label : 'N/A';
}

// Report sources
export const REPORT_SOURCES = [
    { value: 'administrator', label: 'Amministratore' },
    { value: 'owner', label: 'Proprietario' },
    { value: 'top_rent', label: 'Top rent' },
    { value: 'tenants', label: 'Inquilini' },
];

export const GET_REPORT_SOURCE_LABEL = (value) => {
    const source = REPORT_SOURCES.find((source) => source.value === value);

    return source ? source.label : 'N/A';
}

// Check-in/Check-out locations
export const CHECKIN_LOCATIONS = [
    { value: 'ufficio_pd', label: 'UFFICIO PD - via Enrico degli scrovegni 2/A' },
    { value: 'ufficio_pd2', label: 'UFFICIO PD2 - vicolo Cappellato Pedrocchi' },
    { value: 'ufficio_mestre', label: 'UFFICIO MESTRE - via Milano 15A' },
    { value: 'house', label: 'ABITAZIONE' },
];

export const GET_CHECKIN_LOCATION_LABEL = (value) => {
    const location = CHECKIN_LOCATIONS.find((loc) => loc.value === value);

    return location ? location.label : 'N/A';
}

// Activity names for reports/segnalazioni
export const ACTIVITY_NAMES = [
    { value: 'first_tenant_reminder', label: '1° Sollecito inquilino' },
    { value: 'second_tenant_reminder', label: '2° Sollecito inquilino' },
    { value: 'third_tenant_reminder', label: '3° Sollecito inquilino' },
    { value: 'store_purchase', label: 'Acquisto in negozio' },
    { value: 'online_purchase', label: 'Acquisto online' },
    { value: 'procedure_update', label: 'Aggiornamento procedure' },
    { value: 'internet_line_activation', label: 'Attivazione linea Internet' },
    { value: 'bank_communication', label: 'Comunicazione banca' },
    { value: 'communication_with_administrator', label: 'Comunicazione con amministratore' },
    { value: 'material_delivery_to_tenant', label: 'Consegna materiale ad inquilino' },
    { value: 'utility_bills_excess_calculations', label: 'Conteggi eccedenze bollette' },
    { value: 'apartment_inspection', label: 'Controllo appartamento' },
    { value: 'invoice_issuing', label: 'Emissioni fatture' },
    { value: 'termination_preagreement_signature', label: 'Firma preaccordo disdetta' },
    { value: 'renewal_signature', label: 'Firma rinnovo' },
    { value: 'photographer', label: 'Fotografo' },
    { value: 'gardening', label: 'Giardinaggio' },
    { value: 'home_staging', label: 'Home staging' },
    { value: 'renewal_requests_sending', label: 'Invio richieste rinnovo' },
    { value: 'electric_meter_reading', label: 'Lettura contatore Elettrico' },
    { value: 'gas_meter_reading', label: 'Lettura contatore Gas' },
    { value: 'internal_staff_maintenance', label: 'Manutenzione personale interno' },
    { value: 'condominium_fees_payment', label: 'Pagamento spese condominiali' },
    { value: 'bring_material_to_apartment', label: 'Portare materiale in appartamento' },
    { value: 'cleaning', label: 'Pulizie' },
    { value: 'tenant_contract_registration', label: 'Registrazione contratto inquilini' },
    { value: 'landlord_contract_registration', label: 'Registrazione contratto proprietari' },
    { value: 'deposit_refund', label: 'Restituzione caparre' },
    { value: 'guaranty_request', label: 'Richiesta fidejussione' },
    { value: 'contract_termination', label: 'Risoluzione contratto' },
    { value: 'cash_withdrawal', label: 'Ritiro soldi in contanti' },
    { value: 'bills_download_from_portal', label: 'Scarico bollette da portale' },
    { value: 'deposit_payment_to_landlord', label: 'Versamento deposito a proprietario' },
    { value: 'tenant_visit_to_office', label: 'Visita inquilino in ufficio' },
    { value: 'room_viewing_to_interested_parties', label: 'Visita stanza ad interessati' },
];

export const GET_ACTIVITY_NAME_LABEL = (value) => {
    const activity = ACTIVITY_NAMES.find((act) => act.value === value);

    return activity ? activity.label : 'N/A';
}