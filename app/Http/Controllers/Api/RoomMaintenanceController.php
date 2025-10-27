<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Room;

class RoomMaintenanceController extends Controller
{
    use ApiResponse;

    /**
     * Get maintenances for a room
     */
    public function index(int $roomId)
    {
        try {
            $room = Room::findOrFail($roomId);
            $maintenances = $room->maintenances()
                ->orderBy('start_date', 'desc')
                ->get();

            return $this->success($maintenances, 'Manutenzioni recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle manutenzioni', 500);
        }
    }
}
