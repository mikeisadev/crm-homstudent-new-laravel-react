<?php

namespace App\Traits;

use App\Models\Document;
use App\Models\DocumentFolder;
use Illuminate\Support\Str;

/**
 * HasDocuments Trait
 *
 * Provides document management functionality to any model
 * Handles documents_folder_uuid generation and polymorphic relationships
 */
trait HasDocuments
{
    /**
     * Boot the trait
     * Automatically generate UUID for new entities
     */
    protected static function bootHasDocuments()
    {
        static::creating(function ($model) {
            if (empty($model->documents_folder_uuid)) {
                $model->documents_folder_uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get all documents for this entity
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Get all folders for this entity
     */
    public function folders()
    {
        return $this->morphMany(DocumentFolder::class, 'folderable');
    }

    /**
     * Get root-level documents (not in any folder)
     */
    public function rootDocuments()
    {
        return $this->documents()->whereNull('folder_id');
    }

    /**
     * Get root-level folders (no parent)
     */
    public function rootFolders()
    {
        return $this->folders()->whereNull('parent_folder_id');
    }

    /**
     * Get documents in a specific folder
     *
     * @param int|null $folderId
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function documentsInFolder($folderId = null)
    {
        return $this->documents()->where('folder_id', $folderId);
    }

    /**
     * Get subfolders of a specific folder
     *
     * @param int|null $parentId
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function subfoldersOf($parentId = null)
    {
        return $this->folders()->where('parent_folder_id', $parentId);
    }

    /**
     * Get storage path for this entity's documents
     *
     * @return string
     */
    public function getDocumentsStoragePath()
    {
        $entityType = class_basename(static::class);
        return strtolower($entityType) . '_documents';
    }

    /**
     * Get full storage path including UUID
     *
     * @return string
     */
    public function getFullDocumentsPath()
    {
        return $this->getDocumentsStoragePath() . '/' . $this->documents_folder_uuid;
    }
}
