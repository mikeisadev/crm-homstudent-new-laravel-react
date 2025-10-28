<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Property Meta Model
 * Stores extensible key-value metadata for properties
 * Used for fields like 'gestione' (management_type) and future extensibility
 */
class PropertyMeta extends Model
{
    use HasFactory;

    protected $table = 'property_meta';

    protected $fillable = [
        'property_id',
        'meta_key',
        'meta_value',
    ];

    /**
     * Get the property that owns this meta entry
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
