<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipment';

    protected $fillable = [
        'key',
        'name',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /**
     * Rooms that have this equipment
     */
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_equipment', 'equipment_id', 'room_id')
                    ->withTimestamps();
    }

    /**
     * Properties that have this equipment
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_equipment', 'equipment_id', 'property_id')
                    ->withTimestamps();
    }
}
