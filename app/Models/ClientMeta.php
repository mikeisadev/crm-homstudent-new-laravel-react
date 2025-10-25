<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientMeta extends Model
{
    use HasFactory;

    protected $table = 'client_meta';

    protected $fillable = [
        'client_id',
        'meta_key',
        'meta_value',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
