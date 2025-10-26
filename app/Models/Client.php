<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'company_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'mobile',
        'tax_code',
        'vat_number',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'origin_source',
        'origin_details',
        'notes',
        'documents_folder_uuid',
    ];

    protected $casts = [
        'type' => 'string',
    ];

    /**
     * Boot method - Generate UUID and create folder on client creation
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($client) {
            // Generate UUID for document storage folder
            if (empty($client->documents_folder_uuid)) {
                $client->documents_folder_uuid = (string) Str::uuid();
            }

            // Create private document folder
            $folderPath = 'client_documents/' . $client->documents_folder_uuid;
            if (!Storage::exists($folderPath)) {
                Storage::makeDirectory($folderPath, 0755, true);
            }
        });

        static::deleting(function ($client) {
            // Soft delete - keep files but mark as deleted
            // For hard delete (future), uncomment below:
            // $folderPath = 'client_documents/' . $client->documents_folder_uuid;
            // Storage::deleteDirectory($folderPath);
        });
    }

    // Relationships
    public function meta()
    {
        return $this->hasMany(ClientMeta::class);
    }

    public function addresses()
    {
        return $this->hasMany(ClientAddress::class);
    }

    public function contacts()
    {
        return $this->hasMany(ClientContact::class);
    }

    public function banking()
    {
        return $this->hasMany(ClientBanking::class);
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function secondaryContracts()
    {
        return $this->hasMany(Contract::class, 'secondary_client_id');
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }

    public function folders()
    {
        return $this->hasMany(ClientFolder::class);
    }

    public function documents()
    {
        return $this->hasMany(ClientDocument::class);
    }

    // Helper method to get meta value
    public function getMeta($key, $default = null)
    {
        $meta = $this->meta()->where('meta_key', $key)->first();
        return $meta ? $meta->meta_value : $default;
    }

    // Helper method to set meta value
    public function setMeta($key, $value)
    {
        return $this->meta()->updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );
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
