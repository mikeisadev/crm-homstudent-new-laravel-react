<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Room;
use App\Models\RoomPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoomPhotoController extends Controller
{
    use ApiResponse;

    /**
     * Storage disk for photos
     */
    protected $disk = 'local';

    /**
     * Get all photos for a room
     */
    public function index(int $roomId)
    {
        try {
            $room = Room::findOrFail($roomId);
            $photos = $room->photos()->orderBy('sort_order', 'asc')->get();

            return $this->success($photos, 'Foto recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle foto', 500);
        }
    }

    /**
     * Upload a photo
     */
    public function store(Request $request, int $roomId)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB max
        ]);

        try {
            $room = Room::findOrFail($roomId);
            $file = $request->file('photo');

            // Generate UUID-based stored name
            $extension = strtolower($file->getClientOriginalExtension());
            $storedName = Str::uuid() . '.' . $extension;

            // Build storage path
            $basePath = 'room_photos/' . $room->documents_folder_uuid;

            // Ensure directory exists
            if (!Storage::disk($this->disk)->exists($basePath)) {
                Storage::disk($this->disk)->makeDirectory($basePath, 0755, true);
            }

            // Store file
            $fullPath = "{$basePath}/{$storedName}";
            Storage::disk($this->disk)->put($fullPath, file_get_contents($file->getRealPath()));

            // Get highest sort_order and increment
            $maxOrder = $room->photos()->max('sort_order') ?? 0;

            // Create photo record
            $photo = RoomPhoto::create([
                'room_id' => $room->id,
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
    public function view(int $roomId, int $photoId)
    {
        try {
            $room = Room::findOrFail($roomId);
            $photo = RoomPhoto::where('room_id', $room->id)->findOrFail($photoId);

            $fullPath = $photo->getFullDiskPath();

            if (!Storage::disk($this->disk)->exists($fullPath)) {
                return $this->error('File non trovato', 404);
            }

            $file = Storage::disk($this->disk)->get($fullPath);
            return response($file, 200)->header('Content-Type', $photo->mime_type);
        } catch (\Exception $e) {
            return $this->error('Errore nella visualizzazione della foto', 500);
        }
    }

    /**
     * Get photo thumbnail (same as view for now, could be optimized)
     */
    public function thumbnail(int $roomId, int $photoId)
    {
        return $this->view($roomId, $photoId);
    }

    /**
     * Delete a photo
     */
    public function destroy(int $roomId, int $photoId)
    {
        try {
            $room = Room::findOrFail($roomId);
            $photo = RoomPhoto::where('room_id', $room->id)->findOrFail($photoId);

            $photo->delete(); // Physical file is deleted by model boot method

            return $this->success(null, 'Foto eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della foto', 500);
        }
    }
}
