Now we have to finish to develop the tab "Immobili" or defined as properties (properties table inside the database schema of the migration).

# These are the key step:
- The "Nuovo" button in "Immobili" tab must open a modal with these fields: "documentation/old_entity_registry_tabs/add_new_modals/add_new_property_modal.png"
- Those fields must be reported inside the form modal of the registry modal component and inside the middle column of the registry layout in accordions so those fields can be edited inline when the component is in edit mode
- If some fields cannot be saved inside the database because database columns are missing to save those fields, you can think of creating a "property_meta" table like we have done with "clients" and "client_meta".
- You'll find the old screenshot of "Immobili" tab in: documentation/old_entity_registry_tabs/properties_tab.png

# Below I describe to you the functionality and behavior of the fields you'll encounter in "add_new_property_modal.png":
- "Seleziona condominio" (react select field) list all the available condominiums (Condomini) inside the CRM because the single property is related to a condominium (do your checks in the models of the database)
- "Nome immobile" (free text field), here a text field to indicate the name of the property
- "Codice interno immobile" (free text field), indicate the internal code of the property
- "Tipologia immobile" (react select field), the possible values are: "Appartamento", "Casa", "Villa", "Ufficio"
- "Indirizzo reale" (free text field)
- "Indirizzo portale" (free text field)
- "CAP" (free text field)
- "Comune" (react select field) with all the "comuni" in Italy (you should already have the data inside the frontend files)
- "Provincia" (react select field) with all the provices in Italy already listed in a data structure inside the frontend files
- "Stato" (react select field) with all the states the you already listed in a data structure inside the frontend files
- "Zona" (free text field)
- "Destinazione d'uso" (react select field), these are the possible values: "Abitativo", "Direzionale", "Commerciale", "Industriale"

# Other fields that are inside the accordions of the old project:
The problem here is that I found that in the old project the accordion fields were more than those inside the modal (see the screenshot of the modal to add a new property). Below I copy pasted to you the HTML portion of that field accordion section of the old CRM in the "Immobili" (properties) tab. I ask you to ultrathink about this section and extract all the fields and to not forget that those fields MUST have their respective keys in english and only the label will be in italian. Remember that if there is a missing database column in properties table compared to the number of found fields act securely in adding the missing fields. Here's the HTML of the old CRM:

<div class="quadrati_cli" id="accordions" style="height: 82vh">
				<div class="accordion_imm" onclick="accordion_imm('0')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;"> Info
						generali </p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 100%;">
					<input type="hidden" id="id_imm" value="">
					<p> Cod. immobile interno:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="codice_interno" type="text" style="background-color: transparent;" readonly="">
					<p> Tipo immobile:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="tipo" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Appartamento</option>
														<option value="2">
								Casa</option>
														<option value="3">
								Villa</option>
														<option value="4">
								ufficio</option>
												</select>
					<p> Condominio:</p><input id="cond_imm" data-id="" data-tabella="immobili" data-campo="idcondominio" type="text" style="background-color: transparent;" readonly="">
					<p> Indirizzo:</p><input type="text" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="indirizzo" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Indirizzo portale:</p><input type="text" onchange="ins_dati_cli(this)" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="indirizzo_portale" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Comune:</p><input type="text" onchange="ins_dati_cli(this)" class="ana_imm" data-id="3" data-tabella="immobili" data-campo="comune" style="background-color: transparent; " readonly="">
					<p> Cap:</p><input type="text" onchange="ins_dati_cli(this)" class="ana_imm" data-id="3" data-tabella="immobili" data-campo="cap" style="background-color: transparent; " readonly="">
					<p> Provincia:</p><input type="text" onchange="ins_dati_cli(this)" class="ana_imm" data-id="3" data-tabella="immobili" data-campo="provincia" style="background-color: transparent; " readonly="">
					<p> Stato:</p><input onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="stato" type="text" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Quartiere:</p><input onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="zona" type="text" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Destizione d'uso:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="destinazione_uso" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Abitativo</option>
														<option value="2">
								Direzionale</option>
														<option value="3">
								Commerciale</option>
														<option value="4">
								Industriale</option>
												</select>
					<p> Gestione:</p>
					<select class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="stato_imm" type="text" style="background-color: transparent;">
						<option value="a regime">Subaffitto</option>
						<option value="in ristrutturazione">Gestione</option>
					</select>
				</div>
				<div class="accordion_imm" onclick="accordion_imm('1')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;"> Dati
						strutturali </p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 0;">
					<p> Disposizione:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="disposizione" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Un livello</option>
														<option value="2">
								due livelli</option>
												</select>
					<p> Stato:</p>
					<select class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="stato_imm" type="text" style="background-color: transparent;">
						<option value="a regime">A regime</option>
						<option value="in ristrutturazione">In ristrutturazione</option>
					</select>
					<p> Piano:</p><input type="number" onchange="ins_dati_cli(this)" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="piano" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Piani:</p><input type="number" onchange="ins_dati_cli(this)" class="ana_imm" data-id="3" data-tabella="immobili" data-campo="piani" style="background-color: transparent; " readonly="">
					<p> Anno di costruzione:</p><input type="text" onchange="ins_dati_cli(this)" class="ana_imm" data-id="3" data-tabella="immobili" data-campo="anno_costruzione" style="background-color: transparent; " readonly="">
					<p> Superficie:</p><input type="text" class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="superficie" style="background-color: transparent; " readonly="">
					<p> Stato dell'immobile:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="usura" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Nuovo</option>
														<option value="2">
								Ristrutturato</option>
														<option value="3">
								Buono</option>
														<option value="4">
								Da Ristrutturare</option>
														<option value="5">
								In Ristrutturazione</option>
												</select>
				</div>

				<div class="accordion_imm" onclick="accordion_imm('2')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;"> Servizi
					</p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 0;">
					<p> Servizio portineria:</p>
					<select class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="portineria" type="text" style="background-color: transparent;">
						<option value="no">No</option>
						<option value="si">Si</option>
					</select>
					<p> Bagno con vasca/doccia:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="bagni_vasca" type="number" style="background-color: transparent;" readonly="">
					<p> Bagno senza vasca/doccia:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="bagni" type="number" style="background-color: transparent;" readonly="">
					<p> Numero balconi:</p><input type="number" onchange="ins_dati_cli(this)" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="balconi" style="background-color: transparent; " class="ana_imm" readonly="">
				</div>

				<div class="accordion_imm" onclick="accordion_imm('3')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;"> Dati
						catastali </p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 0;">
					<p> Porzione materiale:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="por_mat" type="text" style="background-color: transparent;" readonly="">
					<p> Particella edificabile:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="part_edi" type="text" style="background-color: transparent;" readonly="">
					<p> Subalterno:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="subalterno" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Foglio:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="foglio" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Rendita:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="rendita" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Categoria:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="categoria" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Comune:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="comune2" style="background-color: transparent; " class="ana_imm" readonly="">
				</div>
				<div class="accordion_imm" onclick="accordion_imm('4')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;">
						Impianti </p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 0;">
					<p> Cert. energetica:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="cert_ene" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Classe A++</option>
														<option value="2">
								Classe A+</option>
														<option value="3">
								Classe A</option>
														<option value="4">
								Classe B</option>
														<option value="5">
								Classe C</option>
														<option value="6">
								Classe D</option>
														<option value="7">
								Classe E</option>
														<option value="8">
								Classe F</option>
														<option value="9">
								Classe G</option>
												</select>
					<p> Riscaldamento:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="riscaldamento" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Indipendente elettrico</option>
														<option value="2">
								Indipendente gas</option>
														<option value="3">
								Condominio</option>
														<option value="4">
								Centralizzato Gas</option>
												</select>
					<p> Raffreddamento:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="raffreddamento" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Indipendente aria condizionata</option>
														<option value="2">
								Indipendente ventilatore da soffitto</option>
														<option value="3">
								Condominiale raffreddamento pavimento</option>
												</select>
					<p> Acqua:</p>
					<select class="ana_imm" data-tabella="immobili" data-campo="acqua_san" onchange="ins_dati_cli(this)" style="color: black; background-color: transparent; border: 0;" disabled="" data-id="3">
						<option value="0"> </option>
													<option value="1">
								Indipendente elettrico</option>
														<option value="2">
								Indipendente gas</option>
												</select>
					<p> CTR Acqua Fredda:</p><input type="text" onchange="ins_dati_cli(this)" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="ctr_acqua_fredda" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> PDR POD elettricità:</p><input type="text" onchange="ins_dati_cli(this)" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="pod_elet" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> PDR Gas:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="pdr_gas" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Importo GAS incluso:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Importo EE incluso:</p><input type="text" autocomplete="off" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="" style="background-color: transparent; " class="ana_imm" readonly="">
				</div>
				<div class="accordion_imm" onclick="accordion_imm('5')">
					<p style="color: #606060; margin: 0 0 10 0; width:100%; font-size: 1rem; font-weight: 600;">
						Fornitori servizi </p>
					<div></div>
					<i class="material-icons img_imm" style="position:absolute; right: 5px; cursor:pointer; height:25px; transform: rotate(180deg);transition: all 0.3s; color:#337fed">arrow_drop_up</i><br>
				</div>
				<div class="panel_imm" style="height: 0;">
					<p> Fornitore acqua:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="fornitore_acqua" type="text" style="background-color: transparent;" readonly="">
					<p> Dati contratto acqua:</p><input class="ana_imm" onchange="ins_dati_cli(this)" data-id="3" data-tabella="immobili" data-campo="dati_ctr_acqua" type="text" style="background-color: transparent;" readonly="">
					<p> Fornitore gas:</p><input type="text" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="fornitore_gas" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Dati contratto gas:</p><input type="text" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="dati_ctr_gas" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Fornitore elettricità:</p><input type="text" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="fornitore_elet" style="background-color: transparent; " class="ana_imm" readonly="">
					<p> Dati contratto elettricità:</p><input type="text" autocomplete="off" data-id="3" data-tabella="immobili" data-campo="dati_ctr_elet" style="background-color: transparent; " class="ana_imm" readonly="">
				</div>
				<div>
					<p style="color: #606060; margin: 0 0 10 0 ; width:95%; font-size: 1rem; font-weight: 600;"> Note
					</p>
					<textarea class="ana_imm" id="note_cli" data-tabella="immobili" data-campo="note" data-id="3" oninput="ins_dati_cli(this); OnInput(this)" disabled=""></textarea>

				</div>

			</div>

# Related tabs:
"Immobili" or properties tab has those related tabs:

- "Contratti" related contracts to this property id

- "Contratti di gestione" related management_contracts to this property id (ATTENTION: this database table and the model is not already defined, the old project defined "Contratti di gestione" table as "contratti_pr" table inside the database in the old project folder path "/Users/michelemincone/Desktop/crm-homstudent", you can analyze in case you have to make the entire database migration, model and seeder)

- "Documenti" a Document Manager specific for each property (maybe this has already been fully implemented). Deeply analyze if this has been implemented correctly.

- "Foto" here you can upload only photos (jpg, png only) for the current property id (so each property has its own photos). Ultrathink here if this must be implemented properly. We've developed the reusable component "registry/tabRenderers/PhotosTabRenderer.jsx"

- "Manutenzioni" here you have to ultrathink and be very careful: do you remember that we've created the Calendar (Calendario) page where you can add "Manutenzioni", "Check in", "Check outs" and "Segnalazioni"? Well here we have to list the related "Manutenzioni" for the current property id.

- "Sanzioni" related penalties to this property id

- "Bollette" related invoices to this property id

- "Dotazioni" each property can have a set of equipments and they can be multiselected. So in this section we select all the equipemnts that a property can have. Those equipments are well defined inside $property_equipment array.

- "Proprietari" related owners to this property id

$property_equipment = [
    'elevator'                => 'Ascensore',
    'kitchen'                 => 'Cucina',
    'sofa'                    => 'Divano',
    'oven'                    => 'Forno',
    'microwave'               => 'Forno a microonde',
    'refrigerator'            => 'Frigorifero',
    'dishwasher'              => 'Lavastoviglie',
    'washing_machine'         => 'Lavatrice',
    'coffee_machine'          => 'Macchinetta caffè',
    'moka_pot'                => 'Moka da caffè',
    'pans_and_pots'           => 'Padelle e pentole',
    'plates_cutlery_glasses'  => 'Piatti, posate e bicchieri',
    'armchair'                => 'Poltrona',
    'central_heating'         => 'Riscaldamento centralizzato',
    'autonomous_heating'      => 'Riscaldamento autonomo',
    'drying_rack'             => 'Stendibiancheria',
    'table_with_chairs'       => 'Tavolo con sedie',
    'television'              => 'Televisione',
    'terrace'                 => 'Terrazzo',
];

# Rules:
- Ultrathink to write clean, modular, non redundant, secure, production ready code like a senior developer
- Remember that we've developed a lot of ready-to-use components or components that can be the bricks to build the same looking interface but to show different data in different tabs
- UI/UX labels must be in italian (because obviously we're shipping the software in italy)
- But functions, code comments, keys in the code and other things that happen in the code must be in english
- Don't forget to add placeholders in the modal fields even if you don't see in the screenshots.
- Inside this document I can give you old HTML of the old CRM that I've copy pasted here: that HTML can be parts of fields, forms, data or tables that you have to elaborate in they way I describe you
- I'll tell you when you can add checkpoint inside "documentation/DEVELOPMENT.md"