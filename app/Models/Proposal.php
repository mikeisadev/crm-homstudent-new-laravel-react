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
        'secondary_client_id',
        'property_type',
        'property_id',
        'room_id',
        'proposal_type',
        'status',
        'proposed_start_date',
        'proposed_end_date',
        'notice_months',
        'deposit_return_days',
        'sent_at',
        'monthly_rent',
        'deposit_amount',
        'entry_fee',
        'validity_days',
        'installments_json',
        'html_document',
        'notes',
    ];

    protected $casts = [
        'proposed_start_date' => 'date',
        'proposed_end_date' => 'date',
        'sent_at' => 'datetime',
        'monthly_rent' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'entry_fee' => 'decimal:2',
        'notice_months' => 'integer',
        'deposit_return_days' => 'integer',
        'validity_days' => 'integer',
        'installments_json' => 'array', // JSON casting for 12 installments
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function secondaryClient()
    {
        return $this->belongsTo(Client::class, 'secondary_client_id');
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
