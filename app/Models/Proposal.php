<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proposal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'proposal_number',
        'client_id',
        'property_type',
        'property_id',
        'room_id',
        'proposal_type',
        'status',
        'proposed_start_date',
        'proposed_end_date',
        'monthly_rent',
        'deposit_amount',
        'notes',
    ];

    protected $casts = [
        'proposed_start_date' => 'date',
        'proposed_end_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    // Helper method to get the referenced property or room
    public function getReferencedProperty()
    {
        if ($this->property_type === 'property') {
            return $this->property;
        }
        return $this->room;
    }
}
