<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    use ApiResponse;

    /**
     * Get all equipment items
     *
     * Query parameters:
     * - for_entity: Filter by entity type ('room' or 'property')
     */
    public function index(\Illuminate\Http\Request $request)
    {
        try {
            $query = Equipment::orderBy('sort_order', 'asc');

            // Filter by for_entity if provided
            if ($request->has('for_entity')) {
                $forEntity = $request->input('for_entity');
                if (in_array($forEntity, ['room', 'property'])) {
                    $query->where('for_entity', $forEntity);
                }
            }

            $equipment = $query->get();

            return $this->success($equipment, 'Equipment recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero degli equipment', 500);
        }
    }
}
