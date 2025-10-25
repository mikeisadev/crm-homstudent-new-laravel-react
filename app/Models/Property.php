<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'condominium_id',
        'internal_code',
        'name',
        'property_type',
        'address',
        'portal_address',
        'city',
        'province',
        'postal_code',
        'country',
        'zone',
        'intended_use',
        'layout',
        'surface_area',
        'property_status',
        'floor_number',
        'total_floors',
        'construction_year',
        'condition',
        'bathrooms_with_tub',
        'bathrooms',
        'balconies',
        'has_concierge',
        'is_published_web',
        'web_address',
        'description',
        'cadastral_section',
        'cadastral_sheet',
        'cadastral_particle',
        'cadastral_subordinate',
        'cadastral_category',
        'cadastral_income',
        'energy_certificate',
        'heating_type',
        'cooling_type',
        'hot_water_type',
        'cold_water_meter',
        'electricity_pod',
        'gas_pdr',
        'water_supplier',
        'water_contract_details',
        'gas_supplier',
        'gas_contract_details',
        'electricity_supplier',
        'electricity_contract_details',
        'notes',
    ];

    protected $casts = [
        'surface_area' => 'decimal:2',
        'floor_number' => 'integer',
        'total_floors' => 'integer',
        'construction_year' => 'integer',
        'bathrooms_with_tub' => 'integer',
        'bathrooms' => 'integer',
        'balconies' => 'integer',
        'has_concierge' => 'boolean',
        'is_published_web' => 'boolean',
        'cadastral_income' => 'decimal:2',
    ];

    // Relationships
    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function owners()
    {
        return $this->belongsToMany(Owner::class, 'property_owners')
                    ->withPivot('ownership_percentage', 'is_primary')
                    ->withTimestamps();
    }

    public function propertyOwners()
    {
        return $this->hasMany(PropertyOwner::class);
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }
}
