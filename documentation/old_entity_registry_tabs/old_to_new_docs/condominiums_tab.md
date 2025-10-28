Here I list and describe all the steps to finish the development of the "Condomini" tab, also defined as "condominiums" as database entity.

# Key entity specifications
- Tab name in UI: "Condomini" (Italian label)
- Entity name as database table: "condominiums"

# Key step:
- The "Nuovo" button in "Condomini" tab must open a modal with these fields: "documentation/old_entity_registry_tabs/add_new_modals/add_new_condominium_modal.png"
- Those fields must be reported inside the form modal of the registry modal component and inside the middle column of the registry layout in accordions so those fields can be edited inline when the component is in edit mode
- If some fields cannot be saved inside the database because database columns are missing to save those fields, you can think of creating a "condominiums_meta" table like we have done with "clients" and "client_meta" if it is worth it, otherwise modify the existing entity database migration schema.
- You'll find the old screenshot of "Condomini" tab in: documentation/old_entity_registry_tabs/condominiums_tab.png
- Compare the database table columns of condominiums entity with the available form fields to double check if some data will not be stored in its database table

# Modal (add new) and accordion fields (edit) "add_new_condominium_modal.png":
- "Nome condominio" (free text field)
- "Codice fiscale" (free text field)
- "Indirizzo" (free text field)
- "Comune" (react select field) with all the "comuni" in Italy (you should already have the data inside the frontend files)
- "CAP" (free text field)
- "Provincia" (react select field) with all the provices in Italy already listed in a data structure inside the frontend files
- "Stato" (react select field) with all the states the you already listed in a data structure inside the frontend files
- "Anno di costruzione" (year only field)
- "Nome amministratore" (free text field)
- "Telefono amministratore" (free text field)
- "Cellulare amministratore" (free text field)
- "Numero verde" (free text field)
- "Email amministratore" (free text field)
- "PEC amministratore" (free text field)
- "Contatori acqua" (free text field)
- "Contatori elettricità" (free text field)
- "Contatori gas" (free text field)
- "Centrale termica" (free text field)
- "Note" (free textarea field)

# Related tabs:
"Condomini" or condominiums tab has those related tabs:

- "Foto" here you can upload only photos (jpg, png only) for the current condominium id (so each condominium has its own photos). Ultrathink here if this must be implemented properly. We've developed the reusable component "registry/tabRenderers/PhotosTabRenderer.jsx". See if all the backend (database photo reference and APIs) has been correctly implemented for this entity.
- "Documenti" a Document Manager specific for each condominium (maybe this has already been fully implemented). Deeply analyze if this has been implemented correctly.

# Rules:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer
- Remember that we've developed a lot of ready-to-use components or components that can be the bricks to build the same looking interface but to show different data in different tabs
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- But functions, code comments, keys in the code and other things that happen in the code must be in english
- Don't forget to add placeholders in the modal fields even if you don't see in the screenshots.
- Inside this document I can give you old HTML of the old CRM that I've copy pasted here: that HTML can be parts of fields, forms, data or tables that you have to elaborate in they way I describe you
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"
- Remember to add react select in the fields where is needed with the appropriate type of data.