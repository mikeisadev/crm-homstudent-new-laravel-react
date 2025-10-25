<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'internal_code',
        'room_type',
        'surface_area',
        'monthly_price',
        'weekly_price',
        'daily_price',
        'minimum_stay_type',
        'minimum_stay_number',
        'deposit_amount',
        'entry_fee',
        'min_age',
        'max_age',
        'smoking_allowed',
        'pets_allowed',
        'musical_instruments_allowed',
        'gender_preference',
        'occupant_type',
        'has_double_bed',
        'cancellation_notice_months',
        'fiscal_regime',
        'fiscal_rate',
        'is_published_web',
        'availability_type',
        'available_from',
        'notes',
    ];

    protected $casts = [
        'surface_area' => 'decimal:2',
        'monthly_price' => 'decimal:2',
        'weekly_price' => 'decimal:2',
        'daily_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'entry_fee' => 'decimal:2',
        'min_age' => 'integer',
        'max_age' => 'integer',
        'smoking_allowed' => 'boolean',
        'pets_allowed' => 'boolean',
        'musical_instruments_allowed' => 'boolean',
        'has_double_bed' => 'boolean',
        'cancellation_notice_months' => 'integer',
        'fiscal_rate' => 'decimal:2',
        'is_published_web' => 'boolean',
        'available_from' => 'date',
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }
}
