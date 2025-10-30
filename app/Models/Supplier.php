<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'contact_person',
        'type',
        'tax_code',
        'vat_number',
        'sdi',
        'email',
        'sending_email',
        'pec',
        'phone',
        'mobile',
        'fax',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'iban',
        'notes',
    ];
}
