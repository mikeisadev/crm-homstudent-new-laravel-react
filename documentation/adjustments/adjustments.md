Here I list all the adjustments or feature additions we will do to this current software.

Each addition will have a title, a date and also a [DONE] check only if that feature has been done.

# Adjustment inside "Immobili" registry tab for the related tab "Bollette" - 31 october 2025
Inside the tab "Immobili", which is a registry react component, I need to finish to develop the related tab "Bollette". 

If something until now is not clear, please restudy the entire code base, models, apis and database design to deeply understand what is going on.

The "Bollette" tab, which refers to the database entity or model "invoices", has a relation with "Immobili" or properties entity. As you can see this relation is clear because we have invoices as a related tab for properties.

You'll see that this relation is also defined inside the database entity invoices with a property_id column that refers as foreign key to the IDs of the properties db table.

So, inside this "Bollette" related tab I need the following UI and features:
- REQUIREMENT: Focus on developing clean, modular, maintainable, secure and not redundant code like a SENIOR SOFTWARE ENGINEER
- REQUIREMENT: You can deeply reanalyze the current codebase to see what has been done and maintain a certain consistency while developing this part.
- REQUIREMENT: the code must be secure and production ready
- A button to add a new invoice or "Bolletta", this button should be called "Carica bolletta"
- Clicking this button should open a Modal, which you can generate using already built react components, which should have those fields inside:
    - "Tipo bolletta" (react select fields) with those values: "Elettrica", "Gas, "Internet", "Utenze condominiali", "Tari". Please create a data structure to retain this data as javascript object (like you've done with other select fields values and keys). I need that this javascript config object will have values in italian (the ones I gave you) and keys which are the english version of the values I gave you properly converted as object key with underscorse.
    - "Data ricezione" (flatpickr only date field)
    - "Mesi di competenza (field group): this field is very critical and should be develop carefully: here I need all the twelve months organized in two or three columns, months are reported as text, a number field next that indicates the year of that month and a third number field (everything in row) where I can insert the amount per month. Then at the beginning of each row I need a checkbox to select that data row or autoselect when inserting a value in the third field for the amount to pay. Then as fallback second option add a checkbox with the label "Annuale" that is an option to inserting all the single fields. HOT TO PRESERVE THIS DATA: you should save all this data structure (month, year and amount with the checkbox) in a propert JSON string inside the database of invoices in a related database column. This is very very important. You should always include all the twelve months inside this data structure even if the user selected or inserted data for one, two or n months with the data.
    - "Invio addebito" (react select field) with the selection of "Si" (yes) or "No" (no)
    - "Descrizione" (free textarea field)
    - "Importo bolletta" (number field)
    - "Importo incluso contratto" (number field)
    - "Importo da addebitare" (number field)
    - "Data scadenza pagamento" (flatpickr date field)
    - "Carica bolletta" (file field) we must have the possibility to attach a PDF file of the current invoice. IMPORTANT: the uploaded pdf file for the current "invoice" should have it's folder in the private storage of laravel, and this folder should be named "invoice_attachment" or "invoice_docs". Inside this folder we'll have other folders related to each invoice record and inside the PDF attached file for that invoice
- REQUIREMENT: title of the modal when adding a new invoice is "Carica bolletta", when editing an invoice "Modifica bolletta"
- REQUIREMENT: add proper save invoice or update invoice buttons inside the modal
- REQUIREMENT: map the current fields I'm asking you to add with the available database columns inside the invoices database table because all the data must have a retain column in the database
- REQUIREMENT: Inside "Bollette" related tab I can see the list of all the invoices RELATED TO THE CURRENT SELECTED PROPERTY (or "Immobile")
- REQUIREMENT: When clicking a single invoice item in the listing for the invoices (BOLLETTE) I should have the possibility to view all the inserted data for that current invoice inside the same modal to view the inserted data and the uploaded file
- REQUIREMENT: When clicking a single invoice item in the listing for the invoices, I can view the attached PDF file by clicking a link that goes in a new tab BUT opens the blob://resource link. So in the frontend you should implement the view of that document as a BLOB like you've done for other parts of this software.
- REQUIREMENT: the uploaded pdf file for the current "invoice" should have it's folder in the private storage of laravel, and this folder should be named "invoice_attachment" or "invoice_docs". Inside this folder we'll have other folders related to each invoice record and inside the PDF attached file for that invoice
- REQUIREMENT: all the added invoices in the related tabs should then result inside "Bollette" MAIN TAB (the one present inside the sidebar of the CRM). Here we have a listing of all added invoices (using the record listing react component)
