<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Property;
use App\Models\PropertyPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Property Photo Controller
 * Manages photo uploads, viewing, and deletion for properties
 */
class PropertyPhotoController extends Controller
{
    use ApiResponse;

    /**
     * Storage disk for photos
     */
    protected $disk = 'local';

    /**
     * Get all photos for a property
     */
    public function index(int $propertyId)
    {
        try {
            $property = Property::findOrFail($propertyId);
            $photos = $property->photos()->orderBy('sort_order', 'asc')->get();

            foreach ($photos as $k => $v) {
                $file = $this->getPhotoDiskResource($propertyId, $v['id']);

                $photos[$k]['thumbnail'] = 'data:' . $file['mime_type'] . ';base64,' . base64_encode($file['file']);
            }

            return $this->success($photos, 'Foto recuperate con successo');
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }

    /**
     * Upload a photo
     */
    public function store(Request $request, int $propertyId)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB max
        ]);

        try {
            $property = Property::findOrFail($propertyId);
            $file = $request->file('photo');

            // Generate UUID-based stored name
            $extension = strtolower($file->getClientOriginalExtension());
            $storedName = Str::uuid() . '.' . $extension;

            // Build storage path
            $basePath = 'property_photos/' . $property->documents_folder_uuid;

            // Ensure directory exists
            if (!Storage::disk($this->disk)->exists($basePath)) {
                Storage::disk($this->disk)->makeDirectory($basePath, 0755, true);
            }

            // Store file
            $fullPath = "{$basePath}/{$storedName}";
            Storage::disk($this->disk)->put($fullPath, file_get_contents($file->getRealPath()));

            // Get highest sort_order and increment
            $maxOrder = $property->photos()->max('sort_order') ?? 0;

            // Create photo record
            $photo = PropertyPhoto::create([
                'property_id' => $property->id,
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => $storedName,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'path' => $storedName,
                'sort_order' => $maxOrder + 1,
            ]);

            return $this->success($photo, 'Foto caricata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nel caricamento della foto: ' . $e->getMessage(), 500);
        }
    }

    /**
     * View a photo (returns image blob)
     */
    public function view(int $propertyId, int $photoId)
    {
        try {
            $resource = $this->getPhotoDiskResource($propertyId, $photoId);

            return response($resource['file'], 200)->header('Content-Type', $resource['mime_type']);
        } catch (\Exception $e) {
            return $this->error('Errore nella visualizzazione della foto', 500);
        }
    }

    /**
     * Get photo thumbnail (same as view for now, could be optimized)
     */
    public function thumbnail(int $propertyId, int $photoId)
    {
        try {
            return $this->view($propertyId, $photoId);
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero della copertina dell\'immagine', 500);
        }
    }

    /**
     * Delete a photo
     */
    public function destroy(int $propertyId, int $photoId)
    {
        try {
            $property = Property::findOrFail($propertyId);
            $photo = PropertyPhoto::where('property_id', $property->id)->findOrFail($photoId);

            $photo->delete(); // Physical file is deleted by model boot method

            return $this->success(null, 'Foto eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della foto', 500);
        }
    }

    /**
     * Get image resource from disk
     */
    private function getPhotoDiskResource(int $propertyId, int $photoId) {
        $property = Property::findOrFail($propertyId);
        $photo = PropertyPhoto::where('property_id', $property->id)->findOrFail($photoId);

        $fullPath = $photo->getFullDiskPath();

        if (!Storage::disk($this->disk)->exists($fullPath)) {
            return $this->error('File non trovato', 404);
        }

        return [
            'file'       => Storage::disk($this->disk)->get($fullPath),
            'mime_type'  => $photo->mime_type
        ];
    }
}
