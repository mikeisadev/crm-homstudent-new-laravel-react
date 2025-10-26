<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ClientFolder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'name',
        'path',
        'parent_folder_id',
    ];

    /**
     * Boot method - Create physical folder on creation
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($folder) {
            $fullPath = $folder->getFullDiskPath();
            if (!Storage::exists($fullPath)) {
                Storage::makeDirectory($fullPath, 0755, true);
            }
        });

        static::deleting(function ($folder) {
            // Delete all documents in this folder
            $folder->documents()->delete();

            // Delete all subfolders (cascade)
            $folder->children()->each(fn($child) => $child->delete());
        });
    }

    /**
     * Relationships
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function parent()
    {
        return $this->belongsTo(ClientFolder::class, 'parent_folder_id');
    }

    public function children()
    {
        return $this->hasMany(ClientFolder::class, 'parent_folder_id');
    }

    public function documents()
    {
        return $this->hasMany(ClientDocument::class, 'folder_id');
    }

    /**
     * Get full path on disk (including client UUID)
     *
     * @return string
     */
    public function getFullDiskPath()
    {
        return 'client_documents/' . $this->client->documents_folder_uuid . '/' . $this->path;
    }

    /**
     * Get breadcrumb trail from root to this folder
     *
     * @return array
     */
    public function getBreadcrumbs()
    {
        $breadcrumbs = [];
        $folder = $this;

        while ($folder) {
            array_unshift($breadcrumbs, [
                'id' => $folder->id,
                'name' => $folder->name,
            ]);
            $folder = $folder->parent;
        }

        return $breadcrumbs;
    }

    /**
     * Count documents and subfolders
     *
     * @return array
     */
    public function getCountsAttribute()
    {
        return [
            'documents' => $this->documents()->count(),
            'subfolders' => $this->children()->count(),
        ];
    }
}
