<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'client_id',
        'property_type',
        'property_id',
        'room_id',
        'amount',
        'payment_receipt',
        'refund_date',
        'refund_amount',
        'refund_notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_date' => 'date',
        'refund_amount' => 'decimal:2',
    ];

    // Relationships
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

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

    // Helper method to get the referenced property or room
    public function getReferencedProperty()
    {
        if ($this->property_type === 'property') {
            return $this->property;
        }
        return $this->room;
    }
}
