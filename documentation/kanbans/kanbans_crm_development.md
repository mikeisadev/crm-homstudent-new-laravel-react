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

# 1) New things to develop:
- Kanban component body must be horizontally scrollable to scroll along all kanban column status
- When clicking a status button on the right top header part the user must see the kanban body scroll to the correct kanban status column