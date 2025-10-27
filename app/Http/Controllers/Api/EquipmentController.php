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
     */
    public function index()
    {
        try {
            $equipment = Equipment::orderBy('sort_order', 'asc')->get();

            return $this->success($equipment, 'Equipment recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero degli equipment', 500);
        }
    }
}
