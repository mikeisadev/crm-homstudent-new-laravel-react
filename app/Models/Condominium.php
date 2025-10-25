<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Condominium extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'condominiums';

    protected $fillable = [
        'name',
        'tax_code',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'construction_year',
        'latitude',
        'longitude',
        'administrator_name',
        'administrator_phone',
        'administrator_mobile',
        'administrator_toll_free',
        'administrator_email',
        'administrator_pec',
        'water_meters_info',
        'electricity_meters_info',
        'gas_meters_info',
        'heating_system_info',
        'notes',
    ];

    protected $casts = [
        'construction_year' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    // Relationships
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
