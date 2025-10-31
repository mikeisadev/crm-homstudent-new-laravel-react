<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * BugReport Model
 *
 * Represents a bug report submitted by users
 * Includes tracking, status management, and debugging information
 */
class BugReport extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'report_date',
        'bug_description',
        'status',
        'priority',
        'browser_info',
        'url',
        'ip_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'report_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<string>
     */
    protected $hidden = [
        'ip_address', // Hide sensitive information in API responses
    ];

    /**
     * Get the user who reported the bug
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include new bug reports
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope a query to only include unresolved bug reports
     */
    public function scopeUnresolved($query)
    {
        return $query->whereIn('status', ['new', 'in_progress']);
    }
}
