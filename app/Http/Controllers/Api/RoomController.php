<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Room::query();

            if ($request->has('property_id')) {
                $query->where('property_id', $request->input('property_id'));
            }

            if ($request->has('room_type')) {
                $query->where('room_type', $request->input('room_type'));
            }

            if ($request->has('availability_type')) {
                $query->where('availability_type', $request->input('availability_type'));
            }

            $query->orderBy('created_at', 'desc');
            $rooms = $query->paginate(15);

            return $this->success([
                'rooms' => RoomResource::collection($rooms->items()),
                'pagination' => [
                    'total' => $rooms->total(),
                    'per_page' => $rooms->perPage(),
                    'current_page' => $rooms->currentPage(),
                    'last_page' => $rooms->lastPage(),
                ],
            ], 'Stanze recuperate con successo');

        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle stanze', 500);
        }
    }

    public function store(StoreRoomRequest $request)
    {
        try {
            $room = Room::create($request->validated());
            return $this->success(new RoomResource($room), 'Stanza creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della stanza', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $room = Room::with('property')->findOrFail($id);
            return $this->success(new RoomResource($room), 'Stanza recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Stanza non trovata', 404);
        }
    }

    public function update(UpdateRoomRequest $request, int $id)
    {
        try {
            $room = Room::findOrFail($id);
            $room->update($request->validated());
            return $this->success(new RoomResource($room->fresh()), 'Stanza aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della stanza', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $room = Room::findOrFail($id);
            $room->delete();
            return $this->success(null, 'Stanza eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della stanza', 500);
        }
    }
}
