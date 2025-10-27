<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class RoomPhoto extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'room_id',
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
     * Room that owns this photo
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get full disk path for this photo
     */
    public function getFullDiskPath()
    {
        return "room_photos/{$this->room->documents_folder_uuid}/{$this->path}";
    }
}
