Here I list and describe all the steps to finish the development of the "Fornitori" tab. 
Defined as "suppliers" as database entity.

# Key entity specifications
- Tab name in UI: "Fornitori" (Italian label)
- Entity name as database table: "suppliers"

# Key step:
- The "Nuovo" button in "Fornitori" tab must open a modal with these fields: "documentation/suppliers/add_new_fornitore_modal.png"
- Those fields must be reported inside the form modal of the registry modal component and inside the middle column of the registry layout in accordions so those fields can be edited inline when the component is in edit mode
- If some fields cannot be saved inside the database because database columns are missing to save those fields you have to modify the TABLE SCHEMA of "suppliers" DATABASE ENTITY TABLE and add those fields.
- You'll find the old screenshot of "Fornitori" tab in: "documentation/suppliers/fornitori_tab.png"
- Compare the database table columns of suppliers entity with the available form fields to double check if some data will not be stored in its database table

# Modal (add new) and accordion fields (edit) "add_new_fornitore_modal.png":
- "SDI" (free text field)
- "Indirizzo" (free text field)
- "Comune" (react select field) with all the "comuni" in Italy (you should already have the data inside the frontend files)
- "CAP" (free text field)
- "Provincia" (react select field) with all the provices in Italy already listed in a data structure inside the frontend files
- "Nazione" (react select field) with all the list of countries already listed in a data structure inside the frontend files
- "Referente" (free text field)
- "Telefono" (free text field)
- "Cellulare" (tel text field)
- "FAX" (free text field)
- "Email" (email text field)
- "Email invio" (email text field)
- "PEC" (pec text field)
- "Note" (free textarea field)

# Related tabs:
"Fornitori" or suppliers tab DOES NOT have related tabs. SO NOT RELATED TABS TO ADD. The third column won't have any content. But it's important that you keep the same width of the three columns even if the last one is not filled up.

# Rules:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer. You can reuse the components inside "resources/js/components/registry".
- Write a solid, stable and flexible config file inside "resources/js/config", like you've done inside "resources/js/config/registryConfigs.js". But calling it, for example, "generalRegistryTabsConfig.js".
- Remember that we've developed a lot of ready-to-use components or ones that can be the bricks to build the same looking interface but to show different data in different tabs
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- But functions, code comments, keys in the code and other things that happen in the code must be in english
- Don't forget to add placeholders in the modal fields even if you don't see in the screenshots.
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"
- Remember to add react select in the fields where is needed with the appropriate type of data.