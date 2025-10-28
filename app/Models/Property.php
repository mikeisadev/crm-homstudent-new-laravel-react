<?php

namespace App\Models;

use App\Traits\HasDocuments;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes, HasDocuments;

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

    public function managementContracts()
    {
        return $this->hasMany(ManagementContract::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }

    /**
     * Get property photos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function photos()
    {
        return $this->hasMany(PropertyPhoto::class);
    }

    /**
     * Get property equipment (many-to-many)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function equipment()
    {
        return $this->belongsToMany(Equipment::class, 'property_equipment', 'property_id', 'equipment_id')
                    ->withTimestamps();
    }

    /**
     * Get property maintenances
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function maintenances()
    {
        return $this->hasMany(CalendarMaintenance::class, 'property_id');
    }

    /**
     * Get property meta entries
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function meta()
    {
        return $this->hasMany(PropertyMeta::class);
    }

    /**
     * Helper method to get a meta value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getMeta($key, $default = null)
    {
        $meta = $this->meta()->where('meta_key', $key)->first();
        return $meta ? $meta->meta_value : $default;
    }

    /**
     * Helper method to set a meta value
     *
     * @param string $key
     * @param mixed $value
     * @return PropertyMeta
     */
    public function setMeta($key, $value)
    {
        return $this->meta()->updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );
    }
}
