# Document System Testing Checklist

## Overview
This checklist provides step-by-step instructions for testing the polymorphic document management system across all entities (Clients, Rooms, Properties, Condominiums).

**Created**: 2025-10-26
**Status**: Ready for testing
**Related**: CHECKPOINT 5 in DEVELOPMENT.md

---

## Pre-Testing Verification ✅

### Backend Verification (Completed)
- ✅ **Database migrations**: All 3 migrations successfully ran
  - `2025_10_26_140000_add_documents_folder_uuid_to_entities`
  - `2025_10_26_140001_create_document_folders_table`
  - `2025_10_26_140002_create_documents_table`

- ✅ **Entity UUIDs**: All existing records have UUIDs
  - 70 Rooms (all with `documents_folder_uuid`)
  - 30 Properties (all with `documents_folder_uuid`)
  - 5 Condominiums (all with `documents_folder_uuid`)

- ✅ **API Routes**: All 30 endpoints registered (10 per entity × 3 entities)
  - Rooms: `/api/rooms/{id}/documents`, `/api/rooms/{id}/folders`
  - Properties: `/api/properties/{id}/documents`, `/api/properties/{id}/folders`
  - Condominiums: `/api/condominiums/{id}/documents`, `/api/condominiums/{id}/folders`

- ✅ **Storage Directory**: `storage/app/private/` exists with proper permissions
  - `client_documents/` already exists
  - `room_documents/`, `property_documents/`, `condominium_documents/` will be auto-created on first upload

---

## Testing Steps

### 1. Test Document Upload - Empty State

**Purpose**: Verify buttons are visible even when no documents exist

#### For Rooms:
1. Navigate to **Stanze** (Rooms) tab
2. Click on **Room #1** in the list
3. Click on **Documenti** subtab
4. **Expected**:
   - ✅ "Crea cartella" button is visible
   - ✅ "Aggiungi documento" button is visible
   - ✅ Empty state message displayed ("Nessun documento presente")
5. Screenshot the empty state for documentation

#### For Properties:
1. Navigate to **Immobili** (Properties) tab
2. Click on **Property #1** in the list
3. Click on **Documenti** subtab
4. **Expected**: Same as Rooms above
5. Screenshot the empty state

#### For Condominiums:
1. Navigate to **Condomini** (Condominiums) tab
2. Click on **Condominium #1** in the list
3. Click on **Documenti** subtab
4. **Expected**: Same as Rooms above
5. Screenshot the empty state

---

### 2. Test Folder Creation

**Purpose**: Verify folder creation and directory auto-creation feature

#### For Rooms (Room #1):
1. Click **"Crea cartella"** button
2. Enter folder name: `Contratti`
3. Click **"Crea"**
4. **Expected**:
   - ✅ Folder appears in the list with folder icon
   - ✅ Folder shows "0 documenti"
   - ✅ Success message/toast notification
5. **Backend Verification**:
   ```bash
   # Check directory was created
   ls -la storage/app/private/room_documents/4de85ee0-fdf1-4e8b-8046-d7f75f9ce01f/

   # Check database record
   php artisan tinker --execute="App\Models\DocumentFolder::where('name', 'Contratti')->first();"
   ```
6. **Expected Filesystem**:
   - ✅ `storage/app/private/room_documents/` directory exists
   - ✅ `storage/app/private/room_documents/4de85ee0-fdf1-4e8b-8046-d7f75f9ce01f/` directory exists
7. **Expected Database**:
   - ✅ Record in `document_folders` table
   - ✅ `folderable_type` = `App\Models\Room`
   - ✅ `folderable_id` = `1`
   - ✅ `parent_folder_id` = `null`
   - ✅ `name` = `Contratti`

#### For Properties (Property #1):
1. Repeat steps above with folder name: `Planimetrie`
2. Verify directory: `storage/app/private/property_documents/{uuid}/`

#### For Condominiums (Condominium #1):
1. Repeat steps above with folder name: `Documenti Legali`
2. Verify directory: `storage/app/private/condominium_documents/{uuid}/`

---

### 3. Test Document Upload to Root

**Purpose**: Verify file upload works at root level (not in folder)

#### For Rooms (Room #1):
1. Click **"Aggiungi documento"** button
2. Select a test PDF file (create one if needed: `test-room-document.pdf`)
3. Click **"Carica"** or upload button
4. **Expected**:
   - ✅ Upload progress bar appears
   - ✅ Document appears in list with:
     - PDF icon (if PDF) or image icon (if image)
     - Original filename
     - File size (e.g., "245 KB")
     - Upload date
   - ✅ Action buttons: View, Download, Delete
5. **Backend Verification**:
   ```bash
   # Check file was stored with UUID name
   ls -la storage/app/private/room_documents/4de85ee0-fdf1-4e8b-8046-d7f75f9ce01f/

   # Should show something like: abc123-uuid.pdf

   # Check database record
   php artisan tinker --execute="App\Models\Document::where('documentable_type', 'App\Models\Room')->where('documentable_id', 1)->first();"
   ```
6. **Expected Database**:
   - ✅ Record in `documents` table
   - ✅ `documentable_type` = `App\Models\Room`
   - ✅ `documentable_id` = `1`
   - ✅ `folder_id` = `null` (root level)
   - ✅ `name` = Original filename
   - ✅ `stored_name` = UUID filename (e.g., `abc123-uuid.pdf`)
   - ✅ `is_pdf` = `true` (if PDF)
   - ✅ `is_viewable` = `true` (if PDF or image)

---

### 4. Test Document Upload Inside Folder

**Purpose**: Verify file upload works inside folder + subfolder path creation

#### For Rooms (Room #1 → Contratti folder):
1. Click on **"Contratti"** folder to open it
2. **Expected**:
   - ✅ Breadcrumb shows: "Root > Contratti"
   - ✅ Folder is empty (shows empty state)
   - ✅ Action buttons still visible
3. Click **"Aggiungi documento"** button
4. Select a test PDF file: `contratto-room1-2025.pdf`
5. Click upload
6. **Expected**:
   - ✅ Document appears inside folder
   - ✅ Breadcrumb still shows: "Root > Contratti"
7. **Backend Verification**:
   ```bash
   # Check subfolder was created in filesystem
   ls -la storage/app/private/room_documents/4de85ee0-fdf1-4e8b-8046-d7f75f9ce01f/Contratti/

   # Should show the uploaded file with UUID name

   # Check database
   php artisan tinker --execute="
   \$folder = App\Models\DocumentFolder::where('name', 'Contratti')->first();
   \$doc = App\Models\Document::where('folder_id', \$folder->id)->first();
   echo 'Path: ' . \$doc->path . PHP_EOL;
   "
   ```
8. **Expected Filesystem**:
   - ✅ `storage/app/private/room_documents/{uuid}/Contratti/` directory exists
   - ✅ File stored with UUID name inside folder
9. **Expected Database**:
   - ✅ `folder_id` = Contratti folder ID (not null)
   - ✅ `path` = `Contratti/{uuid-filename}.pdf`

---

### 5. Test Nested Folders

**Purpose**: Verify nested folder creation and navigation

#### For Rooms (Room #1):
1. Navigate to **Contratti** folder
2. Click **"Crea cartella"** inside this folder
3. Enter name: `2025`
4. Click create
5. **Expected**:
   - ✅ Subfolder "2025" appears
   - ✅ Shows "0 documenti"
6. Click on **"2025"** subfolder
7. **Expected**:
   - ✅ Breadcrumb shows: "Root > Contratti > 2025"
8. Upload a document inside this nested folder: `contratto-gennaio.pdf`
9. **Backend Verification**:
   ```bash
   # Check nested path was created
   ls -la storage/app/private/room_documents/4de85ee0-fdf1-4e8b-8046-d7f75f9ce01f/Contratti/2025/

   # Should show the file
   ```
10. **Expected**:
    - ✅ `path` in database = `Contratti/2025/{uuid-filename}.pdf`
    - ✅ Physical file exists at correct nested path

---

### 6. Test Document View

**Purpose**: Verify blob URL viewing works for PDFs and images

#### For PDFs:
1. Click **View** button on a PDF document
2. **Expected**:
   - ✅ PDF opens in new browser tab
   - ✅ URL is blob URL (not direct path)
   - ✅ PDF renders correctly
   - ✅ Can scroll through pages

#### For Images (if uploaded):
1. Click **View** button on an image document
2. **Expected**:
   - ✅ Image opens in new browser tab
   - ✅ URL is blob URL
   - ✅ Image renders correctly

---

### 7. Test Document Download

**Purpose**: Verify download functionality

1. Click **Download** button on any document
2. **Expected**:
   - ✅ Browser download prompt appears
   - ✅ Filename is original filename (not UUID name)
   - ✅ File downloads successfully
   - ✅ Downloaded file can be opened

---

### 8. Test Entity Isolation

**Purpose**: Verify documents are completely isolated per entity and per record

#### Test 1: Different entity types
1. Upload document to **Room #1** → Documenti
2. Navigate to **Property #1** → Documenti
3. **Expected**:
   - ✅ Property documents tab is empty (or shows only property docs)
   - ✅ Room document is NOT visible in Property
4. Navigate to **Condominium #1** → Documenti
5. **Expected**:
   - ✅ Condominium documents tab is empty (or shows only condo docs)
   - ✅ Room and Property documents NOT visible

#### Test 2: Different records of same entity
1. Upload document to **Room #1** → Documenti (name: "Room 1 Doc.pdf")
2. Navigate to **Room #2** → Documenti
3. Upload different document (name: "Room 2 Doc.pdf")
4. **Expected**:
   - ✅ Room #1 shows only "Room 1 Doc.pdf"
   - ✅ Room #2 shows only "Room 2 Doc.pdf"
   - ✅ Complete isolation between records

#### Backend Verification:
```bash
# Check filesystem isolation
ls -la storage/app/private/room_documents/
# Should show multiple UUID directories (one per room)

# Check each room's directory
ls -la storage/app/private/room_documents/{room-1-uuid}/
ls -la storage/app/private/room_documents/{room-2-uuid}/
# Each should contain only that room's documents
```

---

### 9. Test Document Deletion

**Purpose**: Verify cascade deletion and physical file deletion

#### Delete a document:
1. Click **Delete** button on a document
2. Confirm deletion
3. **Expected**:
   - ✅ Confirmation modal appears
   - ✅ Document removed from list
   - ✅ Success message
4. **Backend Verification**:
   ```bash
   # Check file was deleted from filesystem
   ls -la storage/app/private/room_documents/{uuid}/
   # File should NOT be present

   # Check database (soft delete)
   php artisan tinker --execute="App\Models\Document::withTrashed()->latest()->first();"
   # Should show deleted_at timestamp
   ```

#### Delete a folder:
1. Create a folder: `Test Delete`
2. Upload 2 documents inside it
3. Create a subfolder inside it
4. Upload 1 document in subfolder
5. Click **Delete** button on `Test Delete` folder
6. Confirm deletion
7. **Expected**:
   - ✅ Folder removed from list
   - ✅ All 3 documents also deleted (cascade)
   - ✅ Subfolder also deleted (cascade)
8. **Backend Verification**:
   ```bash
   # Check all documents were deleted
   php artisan tinker --execute="
   App\Models\Document::withTrashed()->whereNotNull('deleted_at')->count();
   "
   # Should show 3 deleted documents
   ```

---

### 10. Test File Validation

**Purpose**: Verify file type and size validation works

#### Test invalid file type:
1. Try to upload a `.txt` file
2. **Expected**:
   - ✅ Error message: "File type not allowed. Allowed types: pdf, doc, docx, jpg, jpeg, png"
   - ✅ File NOT uploaded

#### Test file size limit:
1. Try to upload a file > 10 MB
2. **Expected**:
   - ✅ Error message: "File size exceeds maximum allowed size of 10 MB"
   - ✅ File NOT uploaded

#### Test valid file types (All should work):
- ✅ PDF (`.pdf`)
- ✅ Word (`.doc`, `.docx`)
- ✅ Images (`.jpg`, `.jpeg`, `.png`)

---

### 11. Test Global Edit Mode

**Purpose**: Verify global edit mode doesn't break document tab

1. Navigate to **Room #1**
2. Click **MODIFICA** (big blue button)
3. **Expected**:
   - ✅ All fields become editable
   - ✅ Buttons change to "SALVA TUTTO" and "ANNULLA"
4. Click on **Documenti** tab while in edit mode
5. **Expected**:
   - ✅ Document tab still works normally
   - ✅ Can upload/delete documents
   - ✅ Edit mode doesn't affect document functionality
6. Click **SALVA TUTTO** or **ANNULLA**
7. **Expected**:
   - ✅ Returns to normal view mode
   - ✅ Documents tab still works

---

### 12. Test Directory Auto-Creation (Advanced)

**Purpose**: Verify directory auto-creation feature works for new entities

#### Create a new Room and test immediate upload:
1. Go to **Stanze** tab
2. Click **NUOVO** to create a new room
3. Fill in required fields and save
4. **Note the new Room ID** (e.g., Room #71)
5. **Immediately** click on **Documenti** tab (don't wait)
6. Click **"Aggiungi documento"**
7. Upload a file
8. **Expected**:
   - ✅ Upload succeeds (no errors)
   - ✅ File appears in list
9. **Backend Verification**:
   ```bash
   # Check logs for directory creation
   tail -n 50 storage/logs/laravel.log | grep "Created"

   # Should show:
   # Created base entity directory: room_documents
   # Created UUID directory: room_documents/{new-uuid}
   ```
10. **Expected Logs**:
    - ✅ Log entry: "Created base entity directory: room_documents" (if first room)
    - ✅ Log entry: "Created UUID directory: room_documents/{uuid}"

**This verifies the safety feature is working!**

---

## Expected Results Summary

### ✅ Functionality Checklist
- [ ] Empty state shows action buttons for all entities
- [ ] Folder creation works for all entities
- [ ] Document upload works at root level
- [ ] Document upload works inside folders
- [ ] Nested folders work correctly
- [ ] Breadcrumb navigation works
- [ ] View button opens PDFs/images in blob URL
- [ ] Download button downloads with original filename
- [ ] Complete entity isolation (Rooms ≠ Properties)
- [ ] Complete record isolation (Room #1 ≠ Room #2)
- [ ] Document deletion removes file from disk
- [ ] Folder deletion cascades to documents and subfolders
- [ ] File type validation rejects invalid types
- [ ] File size validation rejects files > 10 MB
- [ ] Directory auto-creation works for new entities
- [ ] Global edit mode doesn't break document tab

### ✅ Security Checklist
- [ ] Files stored in `storage/app/private/` (not public)
- [ ] UUID-based folder names (non-guessable)
- [ ] UUID-based filenames (non-guessable)
- [ ] Blob URLs used for viewing (not direct paths)
- [ ] Entity ownership verified on every operation
- [ ] Only allowed file types can be uploaded
- [ ] File size limit enforced

### ✅ Performance Checklist
- [ ] Upload progress bar shows for large files
- [ ] Document list loads quickly (even with many files)
- [ ] Folder navigation is instant
- [ ] No lag when switching between entities

---

## Common Issues & Troubleshooting

### Issue: "Crea cartella" button not visible
**Cause**: Empty state returning early
**Fix**: Already fixed in DocumentManager.jsx (empty state in content area only)

### Issue: Upload fails with "Directory not found"
**Cause**: Directory auto-creation not working
**Check**:
1. Verify `ensureDirectoryStructure()` is called in `DocumentService.php`
2. Check storage directory permissions: `chmod -R 755 storage/app/private/`
3. Check logs: `tail storage/logs/laravel.log`

### Issue: Validation error when uploading
**Cause**: Invalid file type or size
**Check**:
1. Verify file extension is in allowed list
2. Verify file size < 10 MB
3. Check MIME type matches extension

### Issue: Document shows in wrong entity
**Cause**: Polymorphic relationship not working
**Check**:
1. Verify `documentable_type` in database
2. Verify `documentable_id` in database
3. Check entity has `HasDocuments` trait

---

## Notes for Developer

- All tests should be performed in **Chrome/Firefox** for consistency
- Take screenshots of any errors for debugging
- Check browser console for JavaScript errors
- Check Laravel logs for backend errors: `tail -f storage/logs/laravel.log`
- If API returns 500 error, check logs immediately

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Mark "Test document upload in UI" as completed in DEVELOPMENT.md
2. ✅ Update CHECKPOINT 5 with test results
3. ✅ Document any issues found in GitHub issues
4. ✅ Move to next feature: Contracts tab implementation

---

**Happy Testing! 🧪**
