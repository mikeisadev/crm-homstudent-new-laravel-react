<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cancellation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'cancellation_date',
        'requested_by',
        'reason',
        'notice_given_date',
        'effective_date',
        'penalty_amount',
        'deposit_refund_amount',
        'notes',
    ];

    protected $casts = [
        'cancellation_date' => 'date',
        'notice_given_date' => 'date',
        'effective_date' => 'date',
        'penalty_amount' => 'decimal:2',
        'deposit_refund_amount' => 'decimal:2',
    ];

    // Relationships
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
