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
            $query = Room::with('property');

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('internal_code', 'like', "%{$search}%")
                      ->orWhere('room_type', 'like', "%{$search}%")
                      ->orWhere('notes', 'like', "%{$search}%")
                      ->orWhereHas('property', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%");
                      });
                });
            }

            if ($request->has('property_id')) {
                $query->where('property_id', $request->input('property_id'));
            }

            if ($request->has('room_type')) {
                $query->where('room_type', $request->input('room_type'));
            }

            if ($request->has('availability_type')) {
                $query->where('availability_type', $request->input('availability_type'));
            }

            $query->orderBy('internal_code', 'asc');

            // Respect per_page parameter for select field options (e.g., per_page=9999)
            // Default to 50 for listing pages
            $perPage = $request->input('per_page', 50);
            $rooms = $query->paginate($perPage);

            return $this->success([
                'rooms' => RoomResource::collection($rooms->items()),
                'pagination' => [
                    'total' => $rooms->total(),
                    'per_page' => $rooms->perPage(),
                    'current_page' => $rooms->currentPage(),
                    'last_page' => $rooms->lastPage(),
                    'from' => $rooms->firstItem(),
                    'to' => $rooms->lastItem(),
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
            $room->load('property'); // Load property relationship
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
            $room->load('property'); // Load property relationship
            return $this->success(new RoomResource($room->fresh(['property'])), 'Stanza aggiornata con successo');
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

    /**
     * Get all contracts for a room
     *
     * @param Room $room
     * @return \Illuminate\Http\JsonResponse
     */
    public function contracts(Room $room)
    {
        try {
            $contracts = $room->contracts()
                ->with(['client', 'property', 'condominium', 'secondaryClient'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($contracts, 'Contratti recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei contratti: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get all proposals for a room
     *
     * @param Room $room
     * @return \Illuminate\Http\JsonResponse
     */
    public function proposals(Room $room)
    {
        try {
            $proposals = $room->proposals()
                ->with(['client', 'property'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($proposals, 'Proposte recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle proposte: ' . $e->getMessage(), 500);
        }
    }
}
