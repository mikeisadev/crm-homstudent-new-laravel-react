# Kanbans tab types development
Inside this CRM we'll have to fully develop a kanban style tab for each of these tabs/entities available in the current CRM web app:

- "Contratti di gestione" (jsx resource: ManagementContracts.jsx) - database entity: management_contracts 
- "Proposte" (jsx resource: Proposals.jsx) - database entity: proposals
- "Contratti" (jsx resource: Contracts.jsx) - database entity: contracts


# Old CRM kanbans styles
As you know, we're remaking this new CRM starting from the logic of old one, re-engineering everything from scratch, remaking the UI/UX, redesigning, redesigning the database and doing a big effort to create a new, great and fully scalable and modular architecture.

I'll give you below the screenshots of how were the three kanbans in the old CRM:

- "Contratti di gestione" old kanban screenshot: "documentation/kanbans/old/contratti_di_gestione_kanban.png"
- "Proposte" old kanban screenshot: "documentation/kanbans/old/contratti_kanban.png"
- "Contratti" old kanban screenshot: "documentation/kanbans/old/proposte_kanban.png"

## What to look for and consider
As you'll see in the old screenshots the kanban has a clear structure:
- Top header with:
    - left smaller part: title of the tab + new button that will open a modal to insert a new entity
    - right bigger part: all the statuses available in the canban
- Body with all the columns referring to each possible status. Each column has a reasonable space in which a list of entities can live, if status of this entity changes it goes to the relative column with that status.

# What to do
- Create a global, modular and flexible kanban component that we can reuse for the three tabs, like a senior software engineer would do
- Create a config file for these kanbans like we have done for the other entities with other componets (we have to follow the same principle and data structure principle we used inside "resources/js/config/registryConfigs.js" but creating another config file like "fluxKanbanConfig.js).
- Obviously statuses of each kanban type must be inside a data structure with english keys and italian values 
- Reuse the UI components we've already configured
- For each "Nuovo" button that is on the left part of the header open a modal where there will be a form with fields we'll define later, but add a "Salva" button 
- When clicking an element inside the kanban open the modal. Later inside the fields of that modal we'll insert the correct data
- As you made a modern UI/UX and design for the sections we've developed until now, do then same thing for these kanbans (but take into consideration the style you've defined and used so far). Don't create design breaks from tab to tab, the design and concept must remain across all the web app.

# Rules to follow:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer
- Remember that we've developed a lot of ready-to-use components or components that can be the bricks to build new interfaces or components.
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- Functions, code comments, keys in the code and other things that happen in the code must be in english
- [IF I DEFINED MODAL FIELDS, NOT YET] Don't forget to add placeholders in the modal fields even if you don't see in the screenshots.
- [IF I DEFINED MODAL FIELDS, NOT YET] Remember to add react select in the fields where is needed with the appropriate type of data.
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"

# How we'll go further
We'll first develop those basic things. Then if you'll do the job correctly, I'll mark each list as done. New things to develop or to adjust will be described inside this document. 

I'll give you indications on the fields you'll have to add for each kanban modal later.

# 1) New things to develop or add [DONE]:
- Kanban component body must be horizontally scrollable to scroll along all kanban column status
- When clicking a status button on the right top header part the user must see the kanban body scroll to the correct kanban status column

# 2) Finish to develop kanban "Contratti di gestione" tab, entity name "management_contracts" [DONE]:
- Add the fields you see in the screenshot "documentation/kanbans/old/contratti_di_gestione_kanban_modal.png" to the modal to add a new management contract inside the kanban for "Contratti di gestione"
- Take into consideration those notes about the fields of the modal to add a new management contract:
    - "Immobile" (react select field) here you have to list all the available properties because I need the possibility to relate the generated management contract with a property
    - "Tipo di contratto" (react select field) will have those possible values: "Con rappresentanza", "Senza rappresentanza", add the placeholder "Seleziona tipo di contratto"
    - "Proprietari" (react select field with multiple select possibilities) here you have to list all the available owners inside the CRM becuase I need a relation between the created management contract with multiple owners
    - "Gestore" (react select field) with the possibility to select those values: "Top rent", add a placeholder "Seleziona gestore"
    - "Data ordierna" (flatpickr only date field) preselect the current date
    - "Data inizio" (flatpickr only date field) to select a start date
    - "Data fine" (flatpickr only date field) to select an end date
    - "Mesi di preavviso" (number field)
    - "Stato operativo" (react select field) with those values: "Bozza di proposta", "Contratto attivo", "Contratto in corso", "Contratto scaduto", "Dismesso anticipatamente". Pay close attention: those are the statuses that can be found inside the kanban columns. Pay attention to this important detail.
    - "Note" (free textarea field)
    - "Note di dismissione anticipata" (free textarea field)
    - "Compenso di gestione (%)" (number field)
    - "Carica PDF" a button that will allow you to attach a PDF document for the current management contract. Consider the best option to save a single document attached to the current management contract that will be created. Can you consider using the already present database entity "documents"? Do a very deep analysis on this part.
- The button to save and add a new management contract should be labeled with "Genera contratto"
- The button to edit and update an exisiting management contract should be labeled with "Modifica contratto"
- When you click a single item inside the kanban you can modify the management contract loading its data inside the modal, this is very important. In the edit modal for the management contract I must have the possibility to view the document by clicking to a link present in another label inside the modal called "Visualizza PDF allegato"

# 3) Finish to develop kanban "Proposte" tab, entity name "proposals" [DONE]:
- Add the fields you see in the screenshot "documentation/kanbans/old/proposte_kanban_modal.png" to the modal to add a new proposal inside the kanban for "Proposte"
- Take into consideration those notes about the fields of the modal to add a new proposal:
    - "Tipo di proposta" (react select field) and the fields you can select are: "Sublocazione", "Abitativo a canone libero", "Abitativo a canone concordato", "Transitorio per lavoratori", "Transitorio per studenti". Add a proper select value placeholder or "Seleziona tipo di proposta" placeholder.
    - "Data inizio" (flatpickr only date field) to select a start date
    - "Data fine" (flatpickr only date field) to select an end date
    - "Tipo immobile" (react select field) here you can select one of the two main entities about real estate inside this CRM:
        - "Stanza" or rooms, as you can see is an entity inside this project
        - "Immobile" or properties, as you can see is an entity inside this project
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Keep "stanza" selected as default starting value.
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Based on the selected option for this field, the next field ("Codice stanza" | "Codice immobile") will load data in a different way and the feature is described next.
    - "Codice stanza" | "Codice immobile" (react select field) this field is critical: based on the selected entity in "Tipo immobile" field here you'll see the list of all the available properties if you selected "Immobile" in "Tipo immobile" or the list of all the rooms available if you selected "Stanza" in "Tipo immobile"
    - "Mesi di preavviso" (number field)
    - "Giorni per la restituzione della caparra" (number field)
    - "Data invio" (date time field) also this field is critical because it must be present as data for each proposal in the column of the database table for proposals, but it should correspond to the timestamp when a proposal is inserted into the database. So it should be handled by the backend and database only and not be shown in the modal as a field.
    - "Cliente 1" can be also named "Inquilino 1" (react select field) this is another critical field that is very very important: when creating a proposal you can assign a max of two clients to a proposal for a room or a property. So here should be listed all the available clients in the CRM and you can select one of them.
    - "Cliente 2" can be also named "Inquilino 2" (react select field) this is the field where you can select the second client for the current proposal. So this field should not be selectable if you did not select the first client. After selecting the first client, you can use this field where you'll see a list of all available clients except the one you selected in the field "Cliente 1" or "Inquilino 1".
    - "Importo caparra" (number field)
    - "Spese ingresso" (number field)
    - "Canone mensile" (number field)
    - "Giorni di validità" (number field) with default value equal to "2"
    - "Rateizzazione" (field group) this field is very very critical and must be implemented perfectly also with the underlying database structure that will be modified for proposals entity. This field group must have, with the best UX/UI and UX features, all the 12 payment fields grouped in a 4 columns. Each month should have two fields: one to select the month where that payment should be done by the selected client or clients (and this field should be a flatpickr date only field) and the other one to insert the amount to be paid (and this field should be a number field). Now also the process of saving this data in the database is critical: this because we have a structured data with 12 elements which each one of them has two values (one a date and the second is a number). I was thinking in having a database column for the proposal table called "installments_json" where we store all the 12 installments in the JSON format, that we'll encode and decode for each future edit of the single proposal, because they can be edited in the future when clicking an item in the proposals kanban. Inside this json data structure I also need an hidden field for each of the 12 installments called "is_payment_completed" with true or false possible values. This will be used by me in the future to continue developing this part of the software.
- The button to save and add a new proposal should be labeled with "Genera proposta"
- The button to edit and update an exisiting proposal should be labeled with "Modifica proposta"
- When you click a single item inside the kanban you can modify the proposal loading its data inside the modal, this is very important. Carefully load the installment data for each field in the installments field group, this is very important for a production ready software. Take all your time to develop this part as a real and powerful senior software engineer. I need this part completely production ready.
- Be sure that the proposals database table correctly represent the fields listed here and that each data field will find its place in the proposals database table, in the most correct way for a production ready software.
- Let's prepare for the next move by adding a new column called "html_document" to the proposals database table, this column is important because we'll have to load a default html document template when a fresh new proposal record is added. I'll later give you the html template to be loaded as default, also because this template document will have placeholders that will be replaced with the data of the proposal record.

# 4) Finish to develop kanban tab "Contratti", entity name "contracts" [DONE]:
NOTE: this note I'm giving to you is very critical, as you will notice the fields that should be inside the modal to add a new contract are practically the same of the ones available in the modal to add a new proposal, some labels will change. But is important that the data is saved inside the "contracts" database table.

- Add the fields you see in the screenshot "documentation/kanbans/old/contratti_kanban_modal.png" to the modal to add a new contract inside the kanban for "Contratti"
- Take into consideration those notes about the fields of the modal to add a new contract:
    - "Tipo di contratto" (react select field) and the fields you can select are: "Sublocazione", "Abitativo a canone libero", "Abitativo a canone concordato", "Transitorio per lavoratori", "Transitorio per studenti". Add a proper select value placeholder or "Seleziona tipo di proposta" placeholder.
    - "Data inizio" (flatpickr only date field) to select a start date
    - "Data fine" (flatpickr only date field) to select an end date
    - "Tipo immobile" (react select field) here you can select one of the two main entities about real estate inside this CRM:
        - "Stanza" or rooms, as you can see is an entity inside this project
        - "Immobile" or properties, as you can see is an entity inside this project
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Keep "stanza" selected as default starting value.
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Based on the selected option for this field, the next field ("Codice stanza" | "Codice immobile") will load data in a different way and the feature is described next.
    - "Codice stanza" | "Codice immobile" (react select field) this field is critical: based on the selected entity in "Tipo immobile" field here you'll see the list of all the available properties if you selected "Immobile" in "Tipo immobile" or the list of all the rooms available if you selected "Stanza" in "Tipo immobile"
    - "Mesi di preavviso" (number field)
    - "Giorni per la restituzione della caparra" (number field)
    - "Data invio" (date time field) also this field is critical because it must be present as data for each contract in the column of the database table for contracts, but it should correspond to the timestamp when a contract is inserted into the database. So it should be handled by the backend and database only and not be shown in the modal as a field.
    - "Cliente 1" can be also named "Inquilino 1" (react select field) this is another critical field that is very very important: when creating a contract you can assign a max of two clients to a contract for a room or a property. So here should be listed all the available clients in the CRM and you can select one of them.
    - "Cliente 2" can be also named "Inquilino 2" (react select field) this is the field where you can select the second client for the current contract. So this field should not be selectable if you did not select the first client. After selecting the first client, you can use this field where you'll see a list of all available clients except the one you selected in the field "Cliente 1" or "Inquilino 1".
    - "Importo caparra" (number field)
    - "Spese ingresso" (number field)
    - "Canone mensile" (number field)
    - "Giorni di validità" (number field) with default value equal to "2"
    - "Rateizzazione" (field group) this field is very very critical and must be implemented perfectly also with the underlying database structure that will be modified for contracts entity. This field group must have, with the best UX/UI and UX features, all the 12 payment fields grouped in a 4 columns. Each month should have two fields: one to select the month where that payment should be done by the selected client or clients (and this field should be a flatpickr date only field) and the other one to insert the amount to be paid (and this field should be a number field). Now also the process of saving this data in the database is critical: this because we have a structured data with 12 elements which each one of them has two values (one a date and the second is a number). I was thinking in having a database column for the contract table called "installments_json" where we store all the 12 installments in the JSON format, that we'll encode and decode for each future edit of the single contract, because they can be edited in the future when clicking an item in the contracts kanban. Inside this json data structure I also need an hidden field for each of the 12 installments called "is_payment_completed" with true or false possible values. This will be used by me in the future to continue developing this part of the software [YOU SHOULD ALREADY HAVE THE REACT COMPONENT TO SHOW A FIELD LIKE THIS ONE].
- The button to save and add a new contract should be labeled with "Genera contratto"
- The button to edit and update an exisiting contract should be labeled with "Modifica contratto"
- When you click a single item inside the kanban you can modify the contract loading its data inside the modal, this is very important. Carefully load the installment data for each field in the installments field group, this is very important for a production ready software. Take all your time to develop this part as a real and powerful senior software engineer. I need this part completely production ready.
- Be sure that the contracts database table correctly represent the fields listed here and that each data field will find its place in the contracts database table, in the most correct way for a production ready software.
- Let's prepare for the next move by adding a new column called "html_document" to the contracts database table, this column is important because we'll have to load a default html document template when a fresh new contract record is added. I'll later give you the html template to be loaded as default, also because this template document will have placeholders that will be replaced with the data of the contract record.