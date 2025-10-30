Here I list and describe all the steps to finish the development of the "Proprietari" tab. 
Defined as "owners" as database entity.

# Key entity specifications
- Tab name in UI: "Proprietari" (Italian label)
- Entity name as database table: "owners"

# Key step:
- The "Nuovo" button in "Proprietari" tab must open a modal with these fields: "documentation/owners/add_new_proprietario_modal.png"
- Those fields must be reported inside the form modal of the registry modal component and inside the middle column of the registry layout in accordions so those fields can be edited inline when the component is in edit mode
- If some fields cannot be saved inside the database because database columns are missing to save those fields you have to modify the TABLE SCHEMA of "owners" DATABASE ENTITY TABLE and add those fields. Note: those column names will be in english. Only UI labels in italian.
- You'll find the old screenshot of "Proprietari" tab in: "documentation/owners/proprietari_tab.png"
- Compare the database table columns of owners entity with the available form fields to double check if some data will not be stored in its database table

# Modal (add new) and accordion fields (edit) "add_new_owners_modal.png":
- "Seleziona immobile" (react select field) the property list (Immobili) where you can select one property to create a relationship between the current owner and a property
- "Nome" (free text field)
- "Cognome" (free text field)
- "Codice fiscale" (free text field)
- "Indirizzo" (free text field)
- "Numero civico" (free text field)
- "Città" (react select field) with all the cities in italy already listed in a data structure inside frontend files
- "CAP" (free text field)
- "Email" (email text field)

# Related tabs:
"Proprietari" or owners tab DOES NOT have related tabs. SO NOT RELATED TABS TO ADD. The third column won't have any content. But it's important that you keep the same width of the three columns even if the last one is not filled up.

# Rules:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer. You can reuse the components inside "resources/js/components/registry".
- Write a solid, stable and flexible config object inside "resources/js/config", like you've done inside "generalRegistryTabsConfig.js"
- Remember that we've developed a lot of ready-to-use components or ones that can be the bricks to build the same looking interface but to show different data in different tabs
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- But functions, code comments, keys in the code and other things that happen in the code must be in english
- Don't forget to add explicative placeholders in the modal fields even if you don't see in the screenshots.
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"
- Remember to add react select in the fields where is needed with the appropriate type of data.