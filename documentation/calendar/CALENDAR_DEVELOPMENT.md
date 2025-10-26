**NOTE: WE HAVE DONE THIS!**

Here I give you all the instructions to define the data to be inserted from the calendar view in the CRM.

To build these forms for each popup we'll need custom libraries for select fields, date and date times fields and for file upload fields. In the future we'll add up other libraries or you can suggest me others.

For now we'll need these react libraries:
- React Select
- React Flatpickr (react-flatpickr)

Standard things to keep in mind:
- in select fields leave the blank option "-- Seleziona un {nome_selezione} --" or if we are generic on the field label "-- Seleziona un valore --". But is clear that if the label is contract you'll write "-- Seleziona un contratto --", or in case of a customer you'll write "-- Seleziona un inquilino --". 
- add a title for each modal in this format "Inserisci nuova manutenzione" or the title relative to the modal.
- for text fields add a proper placeholder, for example "Scrivi qui il responsabile" or in text area add a proper placeholder, for example "Aggiungi una descrizione qui"
- the fields must be organized in three columns
- the fields must have their own label centered 
- if possible in date and date time fields add a placeholder "Seleziona una data" o "Seleziona una data e un orario"

Be smart:
- you can create components for fields (even to smartly manage the standard centering of the labels)

Pay attention that in some fields we're already defining the relationship with other parts of the CRM, for example inside "Seleziona immobile" we'll refer to properties or "Immobili", right? Then at the end tell me the relationships you found.

Button "Nuova manutenzione" -> popup opens -> here are all the fields:
- "Seleziona immobile" (select field, related to the data source "property" and the list is generated from the internal code of these properties)
- "Seleziona stanza" (select field, related to the rooms related to the selected property in the first field and list the related rooms by their internal code, if no "Immobile" is selected no rooms can be listed!)
- "Nome manutenzione" (select field with standard values to indicate the type of maintenance, standard values are inside: $Nome_Manutenzione_Values)
- "Tipologia di urgenza" (select field with standard values "Urgente", "Medio", "Non urgente")
- "Tipologia di manutenzione" (select field with standard values "Ordinaria", "Straordinaria")
- "Data segnalazione" (date only field)
- "Data inizio lavori" (date time field)
- "Data fine lavori" (date time field)
- "Fornitore" (select field where I can select the Suppliers inside the crm, this is a data correlation with another data set inside the CRM)
- "Segnalazione" (select field with standard values: "Amministratore", "Proprietario", "Top rent", "Inquilini")
- "Inquilino" (select field to select one of the customers inside "Customers" data set database)
- "Responsabile" (a free text field)
- "Descrizione" (a free textarea)

$Nome_Manutenzione_Values = [
    'mold' => 'Comparsa di muffa da eliminare',
    'infiltration' => 'Infiltrazione da altra unità',
    'masonry_works' => 'Opere murarie',
    'drain_clog' => 'Otturazione scarico lavabo/doccia/vasca',
    'shower_box_problem' => 'Problema box/asta doccia',
    'electrical_problem' => 'Problema elettrico/illuminazione',
    'heating_boiler' => 'Riscaldamento/caldaia con problemi',
    'appliance_breakdown' => 'Rottura elettrodomestico',
    'window_breakage' => 'Rottura finestre',
    'furniture_breakage' => 'Rottura mobilio',
    'door_breakage' => 'Rottura porte-portoncini',
    'shutter_breakage' => 'Rottura tapparelle-scuri',
    'painting' => 'Tinteggiature'
];

Button "Nuovo check-in" -> popup opens -> here all the fields:
- "Data check-in" (date time field)
- "Luogo check-in" (select field with values inside the variable $Luoghi_CHECKIN)
- "Inquilino" (select field to select one of the customers inside "Customers" data set database)
- "Seleziona un contratto" (select field with a list of contracts related to the data set Contracts)
- "Descrizione" (a free textarea)

$Luoghi_CHECKIN = [
    'ufficio_pd' => 'UFFICIO PD - via Enrico degli scrovegni 2/A',
    'ufficio_pd2' => 'UFFICIO PD2 - vicolo Cappellato Pedrocchi',
    'ufficio_mestre' => 'UFFICIO MESTRE - via Milano 15A',
    'house' => 'ABITAZIONE'
]; 

Button "Nuovo check-out" -> popup opens -> here all the fields:
- "Data check-out" (date time field)
- "Luogo check-out" (select field with values inside the variable $Luoghi_CHECKIN)
- "Inquilino" (select field to select one of the customers inside "Customers" data set database)
- "Seleziona un contratto" (select field with a list of contracts related to the data set Contracts)
- "Descrizione" (a free textarea)

Button "Nuova segnalazione" -> popup opens -> here all the fields:
- "Seleziona immobile" (select field, related to the data source "property" and the list is generated from the internal code of these properties)
- "Seleziona stanza" (select field, related to the rooms related to the selected property in the first field and list the related rooms by their internal code, if no "Immobile" is selected no rooms can be listed!)
- "Nome dell'attività" (select field, a list of values related to the variable $Nomi_Attività_Segnalazioni)
- "Tipologia urgenza" (select field, values: "urgente", "medio", "non urgente")
- "Data inizio lavori" (date time picker)
- "Data fine lavori" (date time picker)
- "Responsabile" (free text field)
- "Descrizione" (free text area)

$Nomi_Attività_Segnalazioni = [
    'first_tenant_reminder' => '1° Sollecito inquilino',
    'second_tenant_reminder' => '2° Sollecito inquilino',
    'third_tenant_reminder' => '3° Sollecito inquilino',
    'store_purchase' => 'Acquisto in negozio',
    'online_purchase' => 'Acquisto online',
    'procedure_update' => 'Aggiornamento procedure',
    'internet_line_activation' => 'Attivazione linea Internet',
    'bank_communication' => 'Comunicazione banca',
    'communication_with_administrator' => 'Comunicazione con amministratore',
    'material_delivery_to_tenant' => 'Consegna materiale ad inquilino',
    'utility_bills_excess_calculations' => 'Conteggi eccedenze bollette',
    'apartment_inspection' => 'Controllo appartamento',
    'invoice_issuing' => 'Emissioni fatture',
    'termination_preagreement_signature' => 'Firma preaccordo disdetta',
    'renewal_signature' => 'Firma rinnovo',
    'photographer' => 'Fotografo',
    'gardening' => 'Giardinaggio',
    'home_staging' => 'Home staging',
    'renewal_requests_sending' => 'Invio richieste rinnovo',
    'electric_meter_reading' => 'Lettura contatore Elettrico',
    'gas_meter_reading' => 'Lettura contatore Gas',
    'internal_staff_maintenance' => 'Manutenzione personale interno',
    'condominium_fees_payment' => 'Pagamento spese condominiali',
    'bring_material_to_apartment' => 'Portare materiale in appartamento',
    'cleaning' => 'Pulizie',
    'tenant_contract_registration' => 'Registrazione contratto inquilini',
    'landlord_contract_registration' => 'Registrazione contratto proprietari',
    'deposit_refund' => 'Restituzione caparre',
    'guaranty_request' => 'Richiesta fidejussione',
    'contract_termination' => 'Risoluzione contratto',
    'cash_withdrawal' => 'Ritiro soldi in contanti',
    'bills_download_from_portal' => 'Scarico bollette da portale',
    'deposit_payment_to_landlord' => 'Versamento deposito a proprietario',
    'tenant_visit_to_office' => 'Visita inquilino in ufficio',
    'room_viewing_to_interested_parties' => 'Visita stanza ad interessati'
];