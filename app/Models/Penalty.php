<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Penalty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'penaltyable_type',
        'penaltyable_id',
        'contract_id',
        'client_id',
        'penalty_type',
        'description',
        'amount',
        'invoice_file',
        'payment_document_file',
        'issue_date',
        'due_date',
        'paid_date',
        'payment_status',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_date' => 'date',
    ];

    // Polymorphic relationship (Room or Property)
    public function penaltyable()
    {
        return $this->morphTo();
    }

    // Relationships
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
