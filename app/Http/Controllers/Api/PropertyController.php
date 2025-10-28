<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Property::query();

            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%")
                      ->orWhere('internal_code', 'like', "%{$search}%");
                });
            }

            if ($request->has('city')) {
                $query->where('city', $request->input('city'));
            }

            if ($request->has('property_type')) {
                $query->where('property_type', $request->input('property_type'));
            }

            if ($request->has('property_status')) {
                $query->where('property_status', $request->input('property_status'));
            }

            $query->orderBy('created_at', 'desc');

            // Respect per_page parameter for select field options (e.g., per_page=9999)
            // Default to 15 for listing pages
            $perPage = $request->input('per_page', 15);
            $properties = $query->paginate($perPage);

            return $this->success([
                'properties' => PropertyResource::collection($properties->items()),
                'pagination' => [
                    'total' => $properties->total(),
                    'per_page' => $properties->perPage(),
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ],
            ], 'Proprietà recuperate con successo');

        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle propriet\u00e0', 500);
        }
    }

    public function store(StorePropertyRequest $request)
    {
        try {
            $property = Property::create($request->validated());
            return $this->success(new PropertyResource($property), 'Propriet\u00e0 creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della propriet\u00e0', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $property = Property::with(['condominium', 'rooms', 'owners'])->findOrFail($id);
            return $this->success(new PropertyResource($property), 'Propriet\u00e0 recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Proprietà non trovata', 404);
        }
    }

    public function update(UpdatePropertyRequest $request, int $id)
    {
        try {
            $property = Property::findOrFail($id);
            $property->update($request->validated());
            return $this->success(new PropertyResource($property->fresh()), 'Propriet\u00e0 aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della propriet\u00e0', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $property = Property::findOrFail($id);
            $property->delete();
            return $this->success(null, 'Propriet\u00e0 eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della propriet\u00e0', 500);
        }
    }

    /**
     * Get all contracts for a property
     *
     * @param Property $property
     * @return \Illuminate\Http\JsonResponse
     */
    public function contracts(Property $property)
    {
        try {
            $contracts = $property->contracts()
                ->with(['client', 'room', 'condominium', 'secondaryClient'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($contracts, 'Contratti recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei contratti: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get all proposals for a property
     *
     * @param Property $property
     * @return \Illuminate\Http\JsonResponse
     */
    public function proposals(Property $property)
    {
        try {
            $proposals = $property->proposals()
                ->with(['client', 'room'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($proposals, 'Proposte recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle proposte: ' . $e->getMessage(), 500);
        }
    }
}
