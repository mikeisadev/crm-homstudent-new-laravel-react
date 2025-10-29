<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_number',
        'year',
        'sequential_number',
        'proposal_id',
        'client_id',
        'secondary_client_id',
        'property_type',
        'condominium_id',
        'property_id',
        'room_id',
        'contract_type',
        'status',
        'start_date',
        'end_date',
        'cancellation_notice_months',
        'deposit_return_days',
        'sent_at',
        'monthly_rent',
        'deposit_amount',
        'entry_fee',
        'validity_days',
        'deposit_refund_percentage',
        'installments_json',
        'html_content',
        'html_document',
        'pdf_path',
        'origin',
    ];

    protected $casts = [
        'year' => 'integer',
        'sequential_number' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'sent_at' => 'datetime',
        'cancellation_notice_months' => 'integer',
        'deposit_return_days' => 'integer',
        'validity_days' => 'integer',
        'monthly_rent' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'entry_fee' => 'decimal:2',
        'deposit_refund_percentage' => 'integer',
        'installments_json' => 'array', // JSON casting for 12 installments
    ];

    // Relationships
    public function proposal()
    {
        return $this->belongsTo(Proposal::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function secondaryClient()
    {
        return $this->belongsTo(Client::class, 'secondary_client_id');
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function payments()
    {
        return $this->hasMany(ContractPayment::class);
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function cancellation()
    {
        return $this->hasOne(Cancellation::class);
    }

    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }

    // Helper method to get the referenced property
    public function getReferencedProperty()
    {
        if ($this->property_type === 'condominium') {
            return $this->condominium;
        } elseif ($this->property_type === 'property') {
            return $this->property;
        }
        return $this->room;
    }
}
