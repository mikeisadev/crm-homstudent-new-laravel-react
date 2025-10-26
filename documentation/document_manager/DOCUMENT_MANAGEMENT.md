# Document Management System

## Overview

The CRM includes a complete, secure document management system for all entities. Each entity (Client, Room, Property, Condominium) has its own **isolated document storage** with folders.

## Key Features

### ✅ Entity-Specific Document Storage
- **Clients** → `/clients/{clientId}/documents`
- **Rooms** → `/rooms/{roomId}/documents`
- **Properties** → `/properties/{propertyId}/documents`
- **Condominiums** → `/condominiums/{condominiumId}/documents`

Each entity's documents are **completely isolated** - no cross-entity access is possible.

### ✅ Folder Management
- Create unlimited nested folders
- Organize documents hierarchically
- Breadcrumb navigation
- View folder contents (documents + subfolders count)
- Delete folders (removes all contents)

### ✅ Document Operations
- **Upload** - PDF, DOC, DOCX, JPG, PNG (max 10 MB)
- **View** - PDFs and images open in new tab
- **Download** - Authenticated download
- **Delete** - Remove documents permanently

### ✅ Security Features
- **Authenticated API requests** - All operations require authentication
- **Entity-scoped access** - Users can only access documents for entities they have permission to view
- **Blob URLs** - Documents are viewed via temporary, authenticated blob URLs (no direct file access)
- **Server-side validation** - File type and size validation on backend
- **Permission checks** - Backend validates user has permission for the entity

## Architecture

### Generic Document Service

**File:** `resources/js/services/genericDocumentService.js`

Factory function that creates entity-specific document services:

```javascript
import { getDocumentService } from '@/services/genericDocumentService';

// Get service for specific entity type
const documentService = getDocumentService('client'); // or 'room', 'property', 'condominium'

// Operations
await documentService.getDocuments(entityId, folderId);
await documentService.uploadDocument(entityId, file, folderId, onProgress);
await documentService.viewDocument(entityId, documentId);
await documentService.downloadDocument(entityId, documentId, filename);
await documentService.deleteDocument(entityId, documentId);

// Folder operations
await documentService.getFolders(entityId, parentId);
await documentService.createFolder(entityId, name, parentId);
await documentService.deleteFolder(entityId, folderId);
```

### Document Manager Component

**File:** `resources/js/components/registry/tabRenderers/DocumentManager.jsx`

Generic React component that provides complete UI for document management:

```jsx
<DocumentManager
    entityId={selectedClient.id}
    rendererProps={{
        entityType: 'client',
        apiEndpoint: '/clients'
    }}
/>
```

**Features included:**
- Folder creation modal
- File upload with progress bar
- Breadcrumb navigation
- Folder/document listing
- Delete confirmation
- Empty state handling
- Loading states

## API Endpoints

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{entity}/{id}/documents?folder_id={folderId}` | Get documents in folder |
| POST | `/{entity}/{id}/documents` | Upload document |
| GET | `/{entity}/{id}/documents/{docId}` | Get document details |
| GET | `/{entity}/{id}/documents/{docId}/view` | View document (blob) |
| GET | `/{entity}/{id}/documents/{docId}/download` | Download document (blob) |
| DELETE | `/{entity}/{id}/documents/{docId}` | Delete document |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{entity}/{id}/folders?parent_id={parentId}` | Get folders in parent |
| POST | `/{entity}/{id}/folders` | Create folder |
| GET | `/{entity}/{id}/folders/{folderId}` | Get folder details |
| DELETE | `/{entity}/{id}/folders/{folderId}` | Delete folder + contents |

**Entity types:** `clients`, `rooms`, `properties`, `condominiums`

## Database Schema

### documents Table
```sql
id               bigint primary key
documentable_id  bigint          -- Entity ID
documentable_type varchar(255)   -- Entity type (Client, Room, Property, Condominium)
folder_id        bigint nullable -- Parent folder
name             varchar(255)    -- Filename
path             varchar(500)    -- Storage path
size             integer         -- File size in bytes
mime_type        varchar(100)    -- MIME type
is_viewable      boolean         -- Can be viewed in browser
is_image         boolean         -- Is an image
is_pdf           boolean         -- Is a PDF
created_at       timestamp
updated_at       timestamp
```

### document_folders Table
```sql
id               bigint primary key
folderable_id    bigint          -- Entity ID
folderable_type  varchar(255)    -- Entity type
parent_folder_id bigint nullable -- Parent folder
name             varchar(255)    -- Folder name
created_at       timestamp
updated_at       timestamp
```

## Storage Structure

Documents are stored in Laravel's storage system:

```
storage/app/documents/
├── clients/
│   ├── 1/
│   │   ├── contract.pdf
│   │   ├── id_card.jpg
│   │   └── ...
│   ├── 2/
│   └── ...
├── rooms/
│   ├── 1/
│   └── ...
├── properties/
│   └── ...
└── condominiums/
    └── ...
```

**Security:** Files are stored **outside the public directory** - they cannot be accessed directly via URL. All access goes through authenticated API endpoints.

## Configuration

### Registry Config

Each entity configuration includes document tab:

```javascript
tabs: [
    {
        key: 'documents',
        label: 'Documenti',
        icon: 'folder',
        endpoint: (id) => `/clients/${id}/documents`,
        renderer: 'DocumentManager',
        hasUpload: true,
        rendererProps: {
            entityType: 'client',
            apiEndpoint: '/clients'
        }
    }
]
```

### File Validation

**Allowed formats:**
- PDF (`.pdf`)
- Word (`.doc`, `.docx`)
- Images (`.jpg`, `.jpeg`, `.png`)

**Max file size:** 10 MB

**Validation happens:**
1. Client-side (before upload starts)
2. Server-side (Laravel validation rules)

## User Interface

### Document List View

```
┌─────────────────────────────────────────┐
│ [Crea cartella] [Aggiungi documento]   │
├─────────────────────────────────────────┤
│ 📂 Home > Contracts > 2025             │ ← Breadcrumb
├─────────────────────────────────────────┤
│ 📁 January          3 docs, 0 folders  │
│ 📁 February         1 doc,  2 folders  │
│ 📄 contract.pdf     2.5 MB  01/03/2025 │
│ 🖼️ invoice.jpg      1.2 MB  15/03/2025 │
├─────────────────────────────────────────┤
│ 2 folders • 2 documents                 │
└─────────────────────────────────────────┘
```

### Features

1. **Hover Effects**
   - Folders: Blue highlight, show delete button
   - Documents: Gray highlight, show delete button

2. **Click Actions**
   - **Folder:** Navigate into folder
   - **Document (viewable):** Open in new tab
   - **Document (not viewable):** Download file
   - **Delete button:** Confirm then delete

3. **Upload Progress**
   ```
   Caricamento in corso...        45%
   ████████░░░░░░░░░░░░░░░░
   ```

4. **Create Folder Modal**
   ```
   ┌─────────────────────────┐
   │ Crea nuova cartella     │
   ├─────────────────────────┤
   │ Nome cartella:          │
   │ [_________________]     │
   │                         │
   │    [Annulla]  [Crea]   │
   └─────────────────────────┘
   ```

## Usage Examples

### Client Documents

```javascript
// User navigates to client details
// Clicks "Documenti" tab
// DocumentManager loads with client's documents

// User creates folder "Contracts"
// Uploads "contract_2025.pdf" to "Contracts" folder
// Views PDF in new tab
// Downloads PDF copy
```

### Room Documents

```javascript
// User views room details
// Clicks "Documenti" tab
// Uploads room photos
// Creates "Photos" folder
// Organizes photos by date
```

### Property Documents

```javascript
// Property manager uploads:
// - Cadastral documents
// - Energy certificates
// - Maintenance records
// All organized in folders
```

### Condominium Documents

```javascript
// Administrator uploads:
// - Assembly minutes
// - Regulations
// - Insurance policies
// All accessible to authorized users
```

## Security Best Practices

### ✅ Implemented

1. **Authentication Required**
   - All API endpoints require authenticated user
   - Laravel Sanctum token validation

2. **Authorization Checks**
   - Backend validates user has permission for entity
   - Example: User can only access documents for clients they manage

3. **No Direct File Access**
   - Files stored outside public directory
   - Access only via authenticated API endpoints
   - Temporary blob URLs for viewing (auto-revoked)

4. **File Validation**
   - File type whitelist (no executables)
   - File size limits (10 MB)
   - Filename sanitization

5. **Input Sanitization**
   - Folder names validated (alphanumeric + spaces, dashes, underscores)
   - SQL injection prevention (Laravel ORM)
   - XSS prevention (React escaping)

### ❌ Additional Recommendations

Consider implementing:

1. **Virus Scanning**
   - Integrate ClamAV or similar
   - Scan uploads before storage

2. **Audit Logging**
   - Log all document operations (who, what, when)
   - Track downloads and views

3. **Encryption at Rest**
   - Encrypt sensitive documents
   - Use Laravel encryption

4. **Rate Limiting**
   - Limit upload frequency
   - Prevent abuse

5. **Backup Strategy**
   - Regular document backups
   - Version control for critical documents

## Error Handling

### Client-Side Errors

```javascript
// File too large
"Il file supera il limite di 10 MB"

// Invalid file type
"Tipo di file non supportato. Formati consentiti: PDF, DOC, DOCX, JPG, PNG"

// Folder name validation
"Il nome della cartella può contenere solo lettere, numeri, spazi, trattini e underscore"
```

### Server-Side Errors

```javascript
// Network error
"Errore durante il caricamento del documento"

// Permission denied
"Non hai i permessi per accedere a questa risorsa"

// Document not found
"Documento non trovato"

// Folder not empty (if backend enforces)
"Impossibile eliminare una cartella non vuota"
```

## Testing Checklist

### Upload Tests
- ✅ Upload PDF (< 10 MB)
- ✅ Upload image (JPG, PNG)
- ✅ Upload Word document (DOC, DOCX)
- ✅ Reject file > 10 MB
- ✅ Reject invalid file type (.exe, .zip)
- ✅ Progress bar updates correctly
- ✅ Upload to root folder
- ✅ Upload to subfolder

### Folder Tests
- ✅ Create folder at root
- ✅ Create subfolder
- ✅ Create deeply nested folder (3+ levels)
- ✅ Folder name validation (invalid characters)
- ✅ Navigate into folder
- ✅ Navigate via breadcrumbs
- ✅ Delete empty folder
- ✅ Delete folder with contents

### Document Tests
- ✅ View PDF in new tab
- ✅ View image in new tab
- ✅ Download Word document
- ✅ Delete document
- ✅ Document count accurate
- ✅ Empty state displays correctly

### Security Tests
- ✅ Cannot access other user's documents
- ✅ Cannot access documents for unauthorized entity
- ✅ Direct file URLs don't work (must go through API)
- ✅ Blob URLs expire/revoke properly

### Cross-Entity Tests
- ✅ Client documents isolated from Room documents
- ✅ Room documents isolated from Property documents
- ✅ Property documents isolated from Condominium documents
- ✅ Each entity has independent folder structure

## Maintenance

### Disk Space Management

Monitor storage usage:
```bash
# Check documents directory size
du -sh storage/app/documents/

# Check by entity type
du -sh storage/app/documents/clients/
du -sh storage/app/documents/rooms/
du -sh storage/app/documents/properties/
du -sh storage/app/documents/condominiums/
```

### Cleanup Tasks

Consider periodic cleanup:
- Delete documents for deleted entities
- Remove orphaned files
- Archive old documents
- Compress large files

### Performance Optimization

For large installations:
- Index `documentable_id` and `documentable_type`
- Index `folder_id`
- Consider CDN for document serving
- Implement pagination for large folders

## Troubleshooting

### "Upload failed"
- Check file size (< 10 MB)
- Check file type (PDF, DOC, DOCX, JPG, PNG)
- Check network connection
- Check server storage space

### "Cannot view document"
- Check file is viewable type (PDF, JPG, PNG)
- Check browser allows pop-ups
- Check document exists in database

### "Folder creation failed"
- Check folder name (alphanumeric + spaces, dashes, underscores)
- Check name length (< 100 characters)
- Check parent folder exists

### "Permission denied"
- Check user is authenticated
- Check user has permission for entity
- Check entity exists

## Future Enhancements

Potential improvements:
1. **Document versioning** - Track document history
2. **Document sharing** - Share with other users
3. **Document preview** - Inline preview without opening new tab
4. **Document search** - Full-text search across documents
5. **Document tags** - Categorize documents
6. **Document comments** - Add notes to documents
7. **Bulk operations** - Upload/download/delete multiple files
8. **Drag & drop upload** - Drag files to upload
9. **Document templates** - Pre-defined document structures
10. **OCR integration** - Extract text from images/PDFs

---

**Last Updated:** 2025-10-26
**Version:** 1.0
**Status:** Production Ready ✅
