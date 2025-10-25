<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'due_date',
        'amount',
        'payment_status',
        'paid_at',
        'payment_method',
        'transaction_reference',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'paid_at' => 'date',
    ];

    // Relationships
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
