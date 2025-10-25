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
        'amount',
        'description',
        'payment_date',
        'payment_method',
        'file_path',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'months_covered' => 'integer',
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
