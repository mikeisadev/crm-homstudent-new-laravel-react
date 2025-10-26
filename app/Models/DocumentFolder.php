<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Polymorphic Document Folder Model
 *
 * Works with any entity (Client, Room, Property, Condominium)
 * Each entity has its own independent folder structure
 *
 * Features:
 * - Unlimited folder nesting
 * - Hierarchical path tracking
 * - Cascade deletion (deleting folder deletes all contents)
 */
class DocumentFolder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'folderable_id',
        'folderable_type',
        'parent_folder_id',
        'name',
        'path',
    ];

    protected $appends = ['documents_count', 'subfolders_count'];

    /**
     * Boot method - Cascade delete documents and subfolders
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($folder) {
            // Delete all documents in this folder
            $folder->documents()->each(function ($document) {
                $document->delete();
            });

            // Delete all subfolders (will cascade)
            $folder->subfolders()->each(function ($subfolder) {
                $subfolder->delete();
            });
        });
    }

    /**
     * Polymorphic relationship - folder can belong to any entity
     */
    public function folderable()
    {
        return $this->morphTo();
    }

    /**
     * Parent folder relationship
     */
    public function parentFolder()
    {
        return $this->belongsTo(DocumentFolder::class, 'parent_folder_id');
    }

    /**
     * Subfolders relationship
     */
    public function subfolders()
    {
        return $this->hasMany(DocumentFolder::class, 'parent_folder_id');
    }

    /**
     * Documents in this folder
     */
    public function documents()
    {
        return $this->hasMany(Document::class, 'folder_id');
    }

    /**
     * Get documents count
     *
     * @return int
     */
    public function getDocumentsCountAttribute()
    {
        return $this->documents()->count();
    }

    /**
     * Get subfolders count
     *
     * @return int
     */
    public function getSubfoldersCountAttribute()
    {
        return $this->subfolders()->count();
    }

    /**
     * Get breadcrumb trail
     *
     * @return array
     */
    public function getBreadcrumbs()
    {
        $breadcrumbs = [];
        $current = $this;

        while ($current) {
            array_unshift($breadcrumbs, [
                'id' => $current->id,
                'name' => $current->name,
            ]);
            $current = $current->parentFolder;
        }

        // Add root
        array_unshift($breadcrumbs, [
            'id' => null,
            'name' => 'Home',
        ]);

        return $breadcrumbs;
    }

    /**
     * Build full path from root
     *
     * @return string
     */
    public function buildPath()
    {
        $path = [];
        $current = $this;

        while ($current) {
            array_unshift($path, $current->name);
            $current = $current->parentFolder;
        }

        return implode('/', $path);
    }
}
