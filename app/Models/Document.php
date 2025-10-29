<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * Polymorphic Document Model
 *
 * Works with any entity (Client, Room, Property, Condominium)
 * Handles secure file storage with UUID-based folders
 *
 * Security features:
 * - Files stored outside public directory
 * - UUID-based folder names (non-guessable)
 * - UUID-based filenames (prevents overwriting)
 * - Soft deletes (can recover accidentally deleted files)
 */
class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'documentable_id',
        'documentable_type',
        'folder_id',
        'name',
        'stored_name',
        'extension',
        'mime_type',
        'size',
        'path',
        'is_viewable',
        'is_image',
        'is_pdf',
    ];

    protected $casts = [
        'size' => 'integer',
        'is_viewable' => 'boolean',
        'is_image' => 'boolean',
        'is_pdf' => 'boolean',
    ];

    protected $appends = ['formatted_size'];

    /**
     * Boot method - Delete physical file on deletion
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($document) {
            // Delete physical file when document is deleted
            if (Storage::disk('private')->exists($document->getFullDiskPath())) {
                Storage::disk('private')->delete($document->getFullDiskPath());
            }
        });
    }

    /**
     * Polymorphic relationship - document can belong to any entity
     */
    public function documentable()
    {
        return $this->morphTo();
    }

    /**
     * Relationship to folder
     */
    public function folder()
    {
        return $this->belongsTo(DocumentFolder::class, 'folder_id');
    }

    /**
     * Get full path on disk
     * Format: {entity_type}_documents/{uuid}/{path}
     *
     * @return string
     */
    public function getFullDiskPath()
    {
        $entityType = $this->getEntityStoragePath();
        $uuid = $this->documentable->documents_folder_uuid;

        return "{$entityType}/{$uuid}/{$this->path}";
    }

    /**
     * Get entity storage path based on type
     *
     * @return string
     */
    protected function getEntityStoragePath()
    {
        $typeMap = [
            'App\Models\Client' => 'client_documents',
            'App\Models\Room' => 'room_documents',
            'App\Models\Property' => 'property_documents',
            'App\Models\Condominium' => 'condominium_documents',
            'App\Models\ManagementContract' => 'managementcontract_documents',
        ];

        return $typeMap[$this->documentable_type] ?? 'documents';
    }

    /**
     * Get formatted file size
     *
     * @return string
     */
    public function getFormattedSizeAttribute()
    {
        $bytes = $this->size;

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' bytes';
    }

    /**
     * Check if document is an image
     *
     * @return bool
     */
    public function isImage()
    {
        return $this->is_image;
    }

    /**
     * Check if document is a PDF
     *
     * @return bool
     */
    public function isPdf()
    {
        return $this->is_pdf;
    }

    /**
     * Check if document is viewable in browser
     *
     * @return bool
     */
    public function isViewable()
    {
        return $this->is_viewable;
    }

    /**
     * Set computed flags based on extension
     *
     * @param string $extension
     */
    public function setComputedFlags($extension)
    {
        $this->is_pdf = ($extension === 'pdf');
        $this->is_image = in_array($extension, ['jpg', 'jpeg', 'png']);
        $this->is_viewable = ($this->is_pdf || $this->is_image);
    }
}
