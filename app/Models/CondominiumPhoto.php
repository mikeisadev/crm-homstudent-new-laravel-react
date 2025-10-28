<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * Condominium Photo Model
 * Stores photos/images for condominiums
 */
class CondominiumPhoto extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'condominium_id',
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
     * Condominium that owns this photo
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    /**
     * Get full disk path for this photo
     *
     * @return string
     */
    public function getFullDiskPath()
    {
        return "condominium_photos/{$this->condominium->documents_folder_uuid}/{$this->path}";
    }
}
