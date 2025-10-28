<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Condominium;
use App\Models\CondominiumPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Condominium Photo Controller
 * Manages photo uploads, viewing, and deletion for condominiums
 */
class CondominiumPhotoController extends Controller
{
    use ApiResponse;

    /**
     * Storage disk for photos
     */
    protected $disk = 'local';

    /**
     * Get all photos for a condominium
     */
    public function index(int $condominiumId)
    {
        try {
            $condominium = Condominium::findOrFail($condominiumId);
            $photos = $condominium->photos()->orderBy('sort_order', 'asc')->get();

            foreach ($photos as $k => $v) {
                $file = $this->getPhotoDiskResource($condominiumId, $v['id']);

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
    public function store(Request $request, int $condominiumId)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB max
        ]);

        try {
            $condominium = Condominium::findOrFail($condominiumId);
            $file = $request->file('photo');

            // Generate UUID-based stored name
            $extension = strtolower($file->getClientOriginalExtension());
            $storedName = Str::uuid() . '.' . $extension;

            // Build storage path
            $basePath = 'condominium_photos/' . $condominium->documents_folder_uuid;

            // Ensure directory exists
            if (!Storage::disk($this->disk)->exists($basePath)) {
                Storage::disk($this->disk)->makeDirectory($basePath, 0755, true);
            }

            // Store file
            $fullPath = "{$basePath}/{$storedName}";
            Storage::disk($this->disk)->put($fullPath, file_get_contents($file->getRealPath()));

            // Get highest sort_order and increment
            $maxOrder = $condominium->photos()->max('sort_order') ?? 0;

            // Create photo record
            $photo = CondominiumPhoto::create([
                'condominium_id' => $condominium->id,
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
    public function view(int $condominiumId, int $photoId)
    {
        try {
            $resource = $this->getPhotoDiskResource($condominiumId, $photoId);

            return response($resource['file'], 200)->header('Content-Type', $resource['mime_type']);
        } catch (\Exception $e) {
            return $this->error('Errore nella visualizzazione della foto', 500);
        }
    }

    /**
     * Get photo thumbnail (same as view for now, could be optimized)
     */
    public function thumbnail(int $condominiumId, int $photoId)
    {
        try {
            return $this->view($condominiumId, $photoId);
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero della copertina dell\'immagine', 500);
        }
    }

    /**
     * Delete a photo
     */
    public function destroy(int $condominiumId, int $photoId)
    {
        try {
            $condominium = Condominium::findOrFail($condominiumId);
            $photo = CondominiumPhoto::where('condominium_id', $condominium->id)->findOrFail($photoId);

            $photo->delete(); // Physical file is deleted by model boot method

            return $this->success(null, 'Foto eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della foto', 500);
        }
    }

    /**
     * Get image resource from disk
     */
    private function getPhotoDiskResource(int $condominiumId, int $photoId) {
        $condominium = Condominium::findOrFail($condominiumId);
        $photo = CondominiumPhoto::where('condominium_id', $condominium->id)->findOrFail($photoId);

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
