[DONE] - THIS SECTION HAS BEEN DEVELOPED SUCCESSFULLY

Now we have to finish to develop the tab "Stanze".

These are the key step:
- The "Nuovo" in "Stanze" tab must open a modal with these fields: "documentation/old_entity_registry_tabs/add_new_modals/add_new_room_modal.png"
- Those fields must be reported to be inline edited inside the middle column of the registry layout
- If some fields cannot be saved inside the database because database columns are missing to save that or those fields, you can think of creating a "room_meta" table like we have done with "clients" and "client_meta".
- You'll find Rooms tab screen of the old project in: documentation/old_entity_registry_tabs/rooms_tab.png

Below I describe to you the functionality and behavior of the fields you'll encounter in "add_new_room_modal.png":
- "Seleziona immobile" (select) the property list (Immobili) where you can select one property that will contain the room you're current adding 
- "Codice interno stanza" (free text field)
- "Superficie" (free text field)
- "Tipo stanza" (select) the values are inside $room_types
- "Importo mensile" (free number field)
- "Importo settimanale" (free number field)
- "Importo giornaliero" (free number field)
- "Tipo di permanenza minima" (select), values are: Giorni, Mesi, Anni (convert this in appropriate key(english)-value(italian) data structure)
- "Periodo di permanenza minima" (free number field)
- "Caparra (€)" (free number field)
- "Spese di ingresso" (free number field)
- "Età minima" (free number field)
- "Età massima" (free number field)
- "Fumare interno" (select), with values: Si, No (convert this in appropriate key(english)-value(italian) data structure)
- "Animali" (select), with values: Si, No (convert this in appropriate key(english)-value(italian) data structure)
- "Suonare strumenti" (select), with values: Si, No (convert this in appropriate key(english)-value(italian) data structure)
- "Sesso preferito" (select), with values: Maschio, Femmina, Single, Coppia, Famiglia (convert this in appropriate key(english)-value(italian) data structure)
- "Genere accettato" (select), with values: Studente, Lavoratore, Single, Coppia, Famiglia (convert this in appropriate key(english)-value(italian) data structure)
- "Coppie nel letto matrimoniale" (select), with values: Si, No (convert this in appropriate key(english)-value(italian) data structure)
- "Mesi di preavviso per la cancellazione" (free number field)
- "Regime fiscale voluto" (free text field)
- "Aliquota fiscale" (select), with values: Esente, 10%, 14%, 22% (convert this in appropriate key(english)-value(italian) data structure)
- "Abilita pubblicazione web" (select), with values: Si, No (convert this in appropriate key(english)-value(italian) data structure)
- "Tipo disponibilità" (select), with values: Automatica da contratti, Forza libera, Forza occupata, Forza libera da data (convert this in appropriate key(english)-value(italian) data structure)
- "Disponibile dal" (flatpickr date only field)

$roomTypes = [
    'single_large' => 'Singola grande',
    'single_small' => 'Singola piccola',
    'suite' => 'Suite',
    'suite_excelsior' => 'Suite excelsior',
    'suite_plus_c' => 'Suite + c',
    'royal_suite' => 'Royal suite',
    'premium' => 'Premium',
    'double' => 'Doppia',
    'single_economy' => 'Singola economica',
    'double_plus_b' => 'Doppia + b',
    'studio' => 'Monolocale',
];

Related tabs:
"Stanze" or rooms tab has those related tabs:
- "Contratti" related contracts to this room id
- "Documenti" a Document Manager specific for each room (maybe this has already been implemented)
- "Foto" here you can upload only photos (jpg, png only) for the current room id (so each room has its photos)
- "Manutenzioni" here you have to ultrathink and be very careful: do you remember that we've created the Calendar (Calendario) page where you can add "Manutenzioni", "Check in", "Check outs" and "Segnalazioni"? Well here we have to list the related "Manutenzioni" for the current room id.
- "Dotazioni" each room can have a set of equipments and they can be multiselected. So in this section we select all the equipemnts that a room can have. Those equipments are well defined inside $room_equipment array.

$room_equipment = [
    'wardrobe_2_door' => 'Armadio 2 ante',
    'wardrobe_3_door' => 'Armadio 3 ante',
    'wardrobe_4_door' => 'Armadio 4 ante',
    'wardrobe_6_door' => 'Armadio 6 ante',
    'double_bed' => 'Letto matrimoniale',
    'bed_half' => 'Letto piazza e mezza',
    'single_bed' => 'Letto singolo',
    'bedside_table' => 'Comodino',
    'bedside_lamp' => 'Abat-jour comodino',
    'floor_lamp' => 'Lampada da terra',
    'desk' => 'Scrivania',
    'desk_lamp' => 'Lampada da studio',
    'chair' => 'Sedia',
    'drawer_unit' => 'Cassettiera',
    'bookcase' => 'Libreria',
    'sofa' => 'Divano',
    'table' => 'Tavolino',
    'curtain' => 'Tenda',
    'chromecast' => 'Chromecast',
    'armchair' => 'Poltroncina',
    'radiator_panel' => 'Piastra radiante',
    'mirror' => 'Specchio',
    'shoe_rack' => 'Scarpiera',
];

Rules:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer
- Remember that we've developed a lot of ready-to-use components or components that can be the bricks to build the same looking interface but to show different data
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- But function, code comments, keys in the code and other things that happen in the code must be in english
- Don't forget to add placeholders in the modal fields even if you don't see in the screenshots.
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"

Fix and adjustments:
- You have to organize the fields of "Rooms" in three columns