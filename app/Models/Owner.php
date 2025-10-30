<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Owner extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'company_name',
        'first_name',
        'last_name',
        'tax_code',
        'vat_number',
        'email',
        'phone',
        'mobile',
        'address',
        'street_number',
        'city',
        'province',
        'postal_code',
        'country',
        'bank_name',
        'iban',
        'notes',
    ];

    // Relationships
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_owners')
                    ->withPivot('ownership_percentage', 'is_primary')
                    ->withTimestamps();
    }

    public function propertyOwners()
    {
        return $this->hasMany(PropertyOwner::class);
    }

    // Accessor for full name
    public function getFullNameAttribute()
    {
        if ($this->type === 'business' && $this->company_name) {
            return $this->company_name;
        }
        return trim("{$this->first_name} {$this->last_name}");
    }
}
