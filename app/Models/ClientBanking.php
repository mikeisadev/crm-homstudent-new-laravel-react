<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientBanking extends Model
{
    use HasFactory;

    protected $table = 'client_banking';

    protected $fillable = [
        'client_id',
        'bank_name',
        'iban',
        'payment_method',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
