<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'invoice_type',
        'invoice_number',
        'issue_date',
        'due_date',
        'months_covered',
        'months_competence_data',
        'amount',
        'contract_included_amount',
        'amount_to_charge',
        'description',
        'send_charge',
        'payment_date',
        'payment_method',
        'file_path',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'months_covered' => 'integer',
        'months_competence_data' => 'array',
        'amount' => 'decimal:2',
        'contract_included_amount' => 'decimal:2',
        'amount_to_charge' => 'decimal:2',
        'send_charge' => 'boolean',
        'payment_date' => 'date',
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
