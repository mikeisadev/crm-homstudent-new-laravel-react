<?php

namespace App\Models;

use App\Traits\HasDocuments;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManagementContract extends Model
{
    use HasFactory, SoftDeletes, HasDocuments;

    protected $fillable = [
        'property_id',
        'contract_number',
        'contract_type',
        'manager',
        'current_date',
        'start_date',
        'end_date',
        'notice_months',
        'monthly_fee',
        'commission_percentage',
        'status',
        'services_included',
        'notes',
        'early_termination_notes',
        'documents_folder_uuid',
    ];

    protected $casts = [
        'current_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_fee' => 'decimal:2',
        'commission_percentage' => 'decimal:2',
        'notice_months' => 'integer',
    ];

    // Relationships

    /**
     * Property relationship
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Owners relationship (many-to-many via pivot table)
     */
    public function owners()
    {
        return $this->belongsToMany(Owner::class, 'management_contract_owners')
            ->withTimestamps();
    }

    // Note: documents() relationship is provided by HasDocuments trait
}
