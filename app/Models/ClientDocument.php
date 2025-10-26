<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ClientDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'folder_id',
        'name',
        'stored_name',
        'extension',
        'mime_type',
        'size',
        'path',
    ];

    protected $appends = ['download_url', 'view_url', 'formatted_size'];

    /**
     * Boot method - Delete physical file on deletion
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($document) {
            // Delete physical file
            if (Storage::exists($document->getFullDiskPath())) {
                Storage::delete($document->getFullDiskPath());
            }
        });
    }

    /**
     * Relationships
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function folder()
    {
        return $this->belongsTo(ClientFolder::class, 'folder_id');
    }

    /**
     * Get full path on disk
     *
     * @return string
     */
    public function getFullDiskPath()
    {
        return 'client_documents/' . $this->client->documents_folder_uuid . '/' . $this->path;
    }

    /**
     * Get download URL accessor
     *
     * @return string
     */
    public function getDownloadUrlAttribute()
    {
        return route('api.clients.documents.download', [
            'client' => $this->client_id,
            'document' => $this->id,
        ]);
    }

    /**
     * Get view URL accessor (for PDFs and images)
     *
     * @return string|null
     */
    public function getViewUrlAttribute()
    {
        if (in_array($this->extension, ['pdf', 'jpg', 'jpeg', 'png'])) {
            return route('api.clients.documents.view', [
                'client' => $this->client_id,
                'document' => $this->id,
            ]);
        }
        return null;
    }

    /**
     * Get formatted file size
     *
     * @return string
     */
    public function getFormattedSizeAttribute()
    {
        $bytes = $this->size;

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' bytes';
    }

    /**
     * Check if document is an image
     *
     * @return bool
     */
    public function isImage()
    {
        return in_array($this->extension, ['jpg', 'jpeg', 'png']);
    }

    /**
     * Check if document is a PDF
     *
     * @return bool
     */
    public function isPdf()
    {
        return $this->extension === 'pdf';
    }

    /**
     * Check if document is viewable in browser
     *
     * @return bool
     */
    public function isViewable()
    {
        return $this->isImage() || $this->isPdf();
    }
}
