# Simple listing UI development [DONE]
- We have to develop a reusable react component to create a simple record listing 
- This react component must be reusable and configurable with config object javascript files (the same pattern we used for KanbanBoard.jsx with fluxKanbanConfig.js config file)
- Focus on clean, modular, simple, very secure and production ready code like a senior developer would do
- The code must be production ready and act like a senior software engineer.
- Focus on creating a simple UI/UX for this component.
- Use the colors of the old CRM renewing the bad looking parts
- But note this: do not elaborate too much, focus on simplicity and making what must be done for that component.
- IMPORTANT: only the labels of the UI must be in italian. Keys in the code, object keys, database columns and functions MUST BE in english. Like a senior software enegineer would do for a production ready software.

# Listing tabs to be developed:
- You should develop this react component for the main group called "GESTIONE" that groups the following tabs:
    - "Caparre" - database entity: deposits
    - "Disdette" - database entity: cancellations
    - "Bollette" - database entity: invoices
    - "Sanzioni" - database entity: penalties
- As you can notice, I've also indicated the database entity related for that tab and from which database table you should:
    - Get the data when showing the records to the listing component
    - Send the data when updating

# Behavior for each tab [DONE]
- Data should be listed in the react component I said
- We should have:
    - Header part where we have the title of the tab and next a button to add a new record of that tab entity. The button should be have an italian label "{appropriate_icon} Nuovo {entity_name}"
        - The button to add a new record of an entity should open a modal with all the necessary fields to create the desired entity. Notice: to generate a modal you can recycle the react component for the registry component inside "resources/js/components/registry/RegistryFormModal.js". It makes no sense duplicating the code.
    - Body part: we should have the react component to list those record with all the columns tha represent the label of the data in the cells below.
    - Notes for the listing component: the listing component beyond showing the necessary data, should give to the user the following actions:
        - "Modifica" (or related icon to that feature) to edit the current record of that entity. Clicking te button "Modifica" a modal should open with the filled up data
        - "Elimina" (or related icon to that feature) to delete the current record of that entity, protect this feature with an alert
- Notes for the "Upload file fields": in some modals for certain entities is required or requested to upload a file that should be attached only for that record for that entity in a properly called private folder. This feature must be developed with safety, creating a folder for the uploaded files for that entity (for example for "Sanzioni" file uploads we will have a private storage folder called "penalties_doc_folder", and inside each folder for each penalty record with the uploaded files inside for that record). But we also have to explore the behavior of the upload file fields in the modal when adding or editing each record:
    - When creating an entity record, in the modal I need an upload file field
    - When editing an entity record, in the modal I must have the possibility to see that file in another tab (via the blob:resource pattern you've implemented for the other parts of this CRM) and the possibility to edit the previously updated file with a new file upload action

# Rule [DONE]
- The given field for an entity must be mapped and be the same for the actually configured database columns of that entity (this is important for data consistency)
- In the fields I will give you, you will notice that there are relation between entities that must be respected

# Data and fields to be developed for each tab [DONE]:
Now I will give you the fields for the "Sanzioni" tab. Later I will give you the fields for the other tabs. But for the other tabs you can insert the react component and config the fields to a single "Esempio" field.

- Screenshots of the old "Sanzioni" tab TO BE analyzed:
    - screenshot of the tab "Sanzioni": documentation/management/add_new_sanzione.png
    - screenshot of the modal to add a new "Sanzione": documentation/management/sanzioni_tab.png

- "Sanzioni" (entity: penalties):
    - "Tipo immobile" (react select field) here you can select one of the two main entities about real estate inside this CRM:
        - "Stanza" or rooms, as you can see is an entity inside this project
        - "Immobile" or properties, as you can see is an entity inside this project
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Keep "stanza" selected as default starting value.
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Based on the selected option for this field, the next field ("Codice stanza" | "Codice immobile") will load data in a different way and the feature is described next.
        - RELATION: there is a relation with a penalty and a property or room (it depends which is selected)
    - "Codice stanza" | "Codice immobile" (react select field) this field is critical: based on the selected entity in "Tipo immobile" field here you'll see the list of all the available properties if you selected "Immobile" in "Tipo immobile" or the list of all the rooms available if you selected "Stanza" in "Tipo immobile"
        - RELATION: here's the real relation between the current penalty and the selected id for a room or a property
    - "Motivo sanzione" (free textarea field)
    - "Inquilino sanzionato" (react select field) here we select the fined client, so here you must list all the available clients. Here is another relation: a penalty is related to a certain client.
    - "Importo sanzione" (free number field) the amount of the penalty
    - "Carica fattura" (file field to upload a PDF file) the attached invoice for the current penalty
    - "Carica contabile di pagamento" (file field to upload a PDF file) the attached payment document from the customer (so there are two possible files to be uploaded per record in this penalties entity)

# Procedure and Fields to be developed for "Caparre" tab [DONE]:
- Develop "Caparre" tab or deposits (DATABASE entity)
- Use the Listing react component
- Config a config file like you've done for penalties (reference: resources/js/config/penaltiesListingConfig.js)
- Fields to have in the add or edit modal:
    - "Tipo immobile" (react select field) here you can select one of the two main entities about real estate inside this CRM:
        - "Stanza" or rooms, as you can see is an entity inside this project
        - "Immobile" or properties, as you can see is an entity inside this project
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Keep "stanza" selected as default starting value.
        - DEVELOPING THIS FIELD IS IMPORTANT TO: Based on the selected option for this field, the next field ("Codice stanza" | "Codice immobile") will load data in a different way and the feature is described next.
        - RELATION: there is a relation with a deposit and a property or room (it depends which is selected)
    - "Codice stanza" | "Codice immobile" (react select field) this field is critical: based on the selected entity in "Tipo immobile" field here you'll see the list of all the available properties if you selected "Immobile" in "Tipo immobile" or the list of all the rooms available if you selected "Stanza" in "Tipo immobile"
        - RELATION: here's the real relation between the current deposit and the selected id for a room or a property
    - "Importo caparra (€)" (free number text) the amount for the current deposit
    - "Inquilino sanzionato" (react select field) here we select the client, so here you must list all the available clients. Here is another relation: a deposit is related to a certain client.
    - "Carica contabile pagamento caparra" (file upload field) here I can upload a PDF document for the current "Caparra" that MUST be stored as private document. In the private folder there must be a folder for deposit document, and inside this folder I need a uuid named folder for each deposit record and inside the uploaded document for the current deposit (THIS IS REALLY IMPORTANT)

# Procedure and Fields to be developed for "Disdette" tab:
- Develop "Disdette" tab or cancellations (DATABASE entity)
- Use the Listing react component
- Config a config file like you've done for penalties (reference: resources/js/config/penaltiesListingConfig.js)
- Fields to have in the add or edit modal:
    - "Seleziona un contratto esistente" (react select field) here you have to list all the available contracts inside the CRM, we have to create a correlation between the current "Disdetta" cancellation with a selected contract by ther IDs. If necessary recheck the model and database table configuration for cancellations entity.
    - "Data richiesta della disdetta" (flatpickr date field) here you can select a date for the cancellation request date
    - "Tipologia di richiesta" (react select field) here you can select between two values: "Gravi motivi" or "Normale". create a data structure in frontend files to store this type of datas, but the keys of the object to store this data MUST BE in english and values in italian (the labels I gave you)
    - "Note" (free textarea field) the notes for the current cancellation