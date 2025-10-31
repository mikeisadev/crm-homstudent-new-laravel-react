<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\CancellationResource;
use App\Models\Cancellation;
use Illuminate\Http\Request;

class CancellationController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of cancellations
     */
    public function index(Request $request)
    {
        try {
            $query = Cancellation::with(['contract']);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('notes', 'like', "%{$search}%")
                      ->orWhere('reason', 'like', "%{$search}%");
                });
            }

            // Respect per_page parameter (default: 10)
            $perPage = $request->input('per_page', 10);
            $cancellations = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return $this->success([
                'cancellations' => CancellationResource::collection($cancellations->items()),
                'pagination' => [
                    'total' => $cancellations->total(),
                    'per_page' => $cancellations->perPage(),
                    'current_page' => $cancellations->currentPage(),
                    'last_page' => $cancellations->lastPage(),
                    'from' => $cancellations->firstItem(),
                    'to' => $cancellations->lastItem(),
                ],
            ], 'Disdette recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle disdette', 500);
        }
    }

    /**
     * Store a newly created cancellation
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            $cancellation = Cancellation::create($data);

            return $this->success(
                new CancellationResource($cancellation->load(['contract'])),
                'Disdetta creata con successo',
                201
            );
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della disdetta: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified cancellation
     */
    public function show(int $id)
    {
        try {
            $cancellation = Cancellation::with(['contract'])->findOrFail($id);
            return $this->success(new CancellationResource($cancellation), 'Disdetta recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Disdetta non trovata', 404);
        }
    }

    /**
     * Update the specified cancellation
     */
    public function update(Request $request, int $id)
    {
        try {
            $cancellation = Cancellation::findOrFail($id);
            $data = $request->all();

            $cancellation->update($data);

            return $this->success(
                new CancellationResource($cancellation->fresh(['contract'])),
                'Disdetta aggiornata con successo'
            );
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della disdetta: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Soft delete the specified cancellation
     */
    public function destroy(int $id)
    {
        try {
            $cancellation = Cancellation::findOrFail($id);

            // Soft delete
            $cancellation->delete();

            return $this->success(null, 'Disdetta eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della disdetta', 500);
        }
    }
}
