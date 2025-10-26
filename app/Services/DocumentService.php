<?php

namespace App\Services;

use App\Models\Document;
use App\Models\DocumentFolder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Document Service
 *
 * Handles all document management operations for any entity
 * Provides secure file storage with UUID-based organization
 *
 * Security features:
 * - Files stored in private storage (not publicly accessible)
 * - UUID-based folder names (non-guessable paths)
 * - UUID-based filenames (prevents overwriting and guessing)
 * - File type validation
 * - File size validation
 */
class DocumentService
{
    /**
     * Storage disk for documents
     */
    protected $disk = 'private';

    /**
     * Allowed file extensions
     */
    protected $allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

    /**
     * Maximum file size in bytes (10 MB)
     */
    protected $maxFileSize = 10 * 1024 * 1024;

    /**
     * Upload a document for an entity
     *
     * @param mixed $entity - Entity model instance
     * @param UploadedFile $file
     * @param int|null $folderId
     * @return Document
     */
    public function uploadDocument($entity, UploadedFile $file, $folderId = null)
    {
        // Validate file
        $this->validateFile($file);

        // Get file information
        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        // Generate UUID-based stored name (security)
        $storedName = Str::uuid() . '.' . $extension;

        // Build storage path
        $entityPath = $entity->getDocumentsStoragePath();
        $uuid = $entity->documents_folder_uuid;

        // Determine folder path if in folder
        $relativePath = $storedName;
        if ($folderId) {
            $folder = DocumentFolder::findOrFail($folderId);
            // Verify folder belongs to this entity
            if ($folder->folderable_id !== $entity->id || $folder->folderable_type !== get_class($entity)) {
                throw new \Exception('Folder does not belong to this entity');
            }
            $relativePath = $folder->buildPath() . '/' . $storedName;
        }

        // Full disk path
        $fullPath = "{$entityPath}/{$uuid}/{$relativePath}";

        // Store file
        Storage::disk($this->disk)->put($fullPath, file_get_contents($file->getRealPath()));

        // Create document record
        $document = new Document();
        $document->documentable()->associate($entity);
        $document->folder_id = $folderId;
        $document->name = $originalName;
        $document->stored_name = $storedName;
        $document->extension = $extension;
        $document->mime_type = $mimeType;
        $document->size = $size;
        $document->path = $relativePath;

        // Set computed flags
        $document->setComputedFlags($extension);

        $document->save();

        return $document;
    }

    /**
     * Create a folder for an entity
     *
     * @param mixed $entity - Entity model instance
     * @param string $name
     * @param int|null $parentId
     * @return DocumentFolder
     */
    public function createFolder($entity, $name, $parentId = null)
    {
        // Validate folder name
        $this->validateFolderName($name);

        // Verify parent folder belongs to entity if provided
        if ($parentId) {
            $parent = DocumentFolder::findOrFail($parentId);
            if ($parent->folderable_id !== $entity->id || $parent->folderable_type !== get_class($entity)) {
                throw new \Exception('Parent folder does not belong to this entity');
            }
        }

        // Create folder
        $folder = new DocumentFolder();
        $folder->folderable()->associate($entity);
        $folder->parent_folder_id = $parentId;
        $folder->name = $name;
        $folder->save();

        // Build and save path
        $folder->path = $folder->buildPath();
        $folder->save();

        return $folder;
    }

    /**
     * Get documents in a folder (or root if folderId is null)
     *
     * @param mixed $entity
     * @param int|null $folderId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getDocuments($entity, $folderId = null)
    {
        return $entity->documentsInFolder($folderId)->get();
    }

    /**
     * Get folders in a folder (or root if parentId is null)
     *
     * @param mixed $entity
     * @param int|null $parentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFolders($entity, $parentId = null)
    {
        return $entity->subfoldersOf($parentId)->get();
    }

    /**
     * Get a document by ID (with entity verification)
     *
     * @param mixed $entity
     * @param int $documentId
     * @return Document
     */
    public function getDocument($entity, $documentId)
    {
        $document = Document::findOrFail($documentId);

        // Verify document belongs to entity
        if ($document->documentable_id !== $entity->id || $document->documentable_type !== get_class($entity)) {
            throw new \Exception('Document does not belong to this entity');
        }

        return $document;
    }

    /**
     * Get a folder by ID (with entity verification)
     *
     * @param mixed $entity
     * @param int $folderId
     * @return DocumentFolder
     */
    public function getFolder($entity, $folderId)
    {
        $folder = DocumentFolder::findOrFail($folderId);

        // Verify folder belongs to entity
        if ($folder->folderable_id !== $entity->id || $folder->folderable_type !== get_class($entity)) {
            throw new \Exception('Folder does not belong to this entity');
        }

        return $folder;
    }

    /**
     * Delete a document
     *
     * @param mixed $entity
     * @param int $documentId
     * @return bool
     */
    public function deleteDocument($entity, $documentId)
    {
        $document = $this->getDocument($entity, $documentId);
        return $document->delete();
    }

    /**
     * Delete a folder and all its contents
     *
     * @param mixed $entity
     * @param int $folderId
     * @return bool
     */
    public function deleteFolder($entity, $folderId)
    {
        $folder = $this->getFolder($entity, $folderId);
        return $folder->delete();
    }

    /**
     * Get file contents for viewing/downloading
     *
     * @param mixed $entity
     * @param int $documentId
     * @return array ['contents' => string, 'mimeType' => string, 'filename' => string]
     */
    public function getFileContents($entity, $documentId)
    {
        $document = $this->getDocument($entity, $documentId);
        $fullPath = $document->getFullDiskPath();

        if (!Storage::disk($this->disk)->exists($fullPath)) {
            throw new \Exception('File not found on disk');
        }

        return [
            'contents' => Storage::disk($this->disk)->get($fullPath),
            'mimeType' => $document->mime_type,
            'filename' => $document->name,
        ];
    }

    /**
     * Validate uploaded file
     *
     * @param UploadedFile $file
     * @throws \Exception
     */
    protected function validateFile(UploadedFile $file)
    {
        // Check file size
        if ($file->getSize() > $this->maxFileSize) {
            throw new \Exception('File size exceeds maximum allowed size of 10 MB');
        }

        // Check file extension
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $this->allowedExtensions)) {
            throw new \Exception('File type not allowed. Allowed types: ' . implode(', ', $this->allowedExtensions));
        }

        // Check MIME type (additional security)
        $allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
        ];

        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            throw new \Exception('Invalid file type');
        }
    }

    /**
     * Validate folder name
     *
     * @param string $name
     * @throws \Exception
     */
    protected function validateFolderName($name)
    {
        // Check length
        if (strlen($name) > 100) {
            throw new \Exception('Folder name cannot exceed 100 characters');
        }

        // Check for invalid characters
        if (!preg_match('/^[\w\s\-]+$/u', $name)) {
            throw new \Exception('Folder name contains invalid characters');
        }
    }
}
