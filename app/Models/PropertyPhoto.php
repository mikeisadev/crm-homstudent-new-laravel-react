<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * Property Photo Model
 * Stores photos/images for properties
 */
class PropertyPhoto extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'original_name',
        'stored_name',
        'mime_type',
        'size',
        'path',
        'sort_order',
    ];

    protected $casts = [
        'size' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Boot method - Auto-delete physical file on delete
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($photo) {
            $fullPath = $photo->getFullDiskPath();
            if (Storage::disk('local')->exists($fullPath)) {
                Storage::disk('local')->delete($fullPath);
            }
        });
    }

    /**
     * Property that owns this photo
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get full disk path for this photo
     *
     * @return string
     */
    public function getFullDiskPath()
    {
        return "property_photos/{$this->property->documents_folder_uuid}/{$this->path}";
    }
}
