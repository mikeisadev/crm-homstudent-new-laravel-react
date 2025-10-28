<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManagementContract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'contract_number',
        'start_date',
        'end_date',
        'monthly_fee',
        'commission_percentage',
        'status',
        'services_included',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_fee' => 'decimal:2',
        'commission_percentage' => 'decimal:2',
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
