<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Property;
use Illuminate\Http\Request;

/**
 * Property Equipment Controller
 * Manages equipment assignments for properties
 */
class PropertyEquipmentController extends Controller
{
    use ApiResponse;

    /**
     * Get equipment for a property
     */
    public function index(int $propertyId)
    {
        try {
            $property = Property::findOrFail($propertyId);
            $equipment = $property->equipment()->orderBy('sort_order', 'asc')->get();

            return $this->success($equipment, 'Equipment dell\'immobile recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero degli equipment dell\'immobile', 500);
        }
    }

    /**
     * Sync equipment for a property
     * Replaces all current equipment with the provided list
     */
    public function sync(Request $request, int $propertyId)
    {
        $request->validate([
            'equipment_ids' => 'required|array',
            'equipment_ids.*' => 'exists:equipment,id',
        ]);

        try {
            $property = Property::findOrFail($propertyId);

            // Sync equipment (this will add new ones, remove old ones)
            $property->equipment()->sync($request->input('equipment_ids'));

            // Get updated equipment
            $equipment = $property->equipment()->orderBy('sort_order', 'asc')->get();

            return $this->success(
                $equipment,
                'Equipment dell\'immobile aggiornati con successo'
            );
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento degli equipment: ' . $e->getMessage(), 500);
        }
    }
}
