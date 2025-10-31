<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deposit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'depositable_type',
        'depositable_id',
        'client_id',
        'contract_id',
        'amount',
        'payment_document_file',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Polymorphic relationship (Room or Property)
     */
    public function depositable()
    {
        return $this->morphTo();
    }

    /**
     * Client relationship
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Contract relationship (optional, for future use)
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
