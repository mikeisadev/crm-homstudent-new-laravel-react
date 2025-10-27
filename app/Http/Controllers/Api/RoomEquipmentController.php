<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomEquipmentController extends Controller
{
    use ApiResponse;

    /**
     * Get equipment for a room
     */
    public function index(int $roomId)
    {
        try {
            $room = Room::findOrFail($roomId);
            $equipment = $room->equipment()->orderBy('sort_order', 'asc')->get();

            return $this->success($equipment, 'Equipment della stanza recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero degli equipment della stanza', 500);
        }
    }

    /**
     * Sync equipment for a room
     */
    public function sync(Request $request, int $roomId)
    {
        $request->validate([
            'equipment_ids' => 'required|array',
            'equipment_ids.*' => 'exists:equipment,id',
        ]);

        try {
            $room = Room::findOrFail($roomId);

            // Sync equipment (this will add new ones, remove old ones)
            $room->equipment()->sync($request->input('equipment_ids'));

            // Get updated equipment
            $equipment = $room->equipment()->orderBy('sort_order', 'asc')->get();

            return $this->success(
                $equipment,
                'Equipment della stanza aggiornati con successo'
            );
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento degli equipment: ' . $e->getMessage(), 500);
        }
    }
}
