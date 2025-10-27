<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\OwnerResource;
use App\Models\Owner;
use Illuminate\Http\Request;

class OwnerController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Owner::query();

            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('company_name', 'like', "%{$search}%");
                });
            }

            $owners = $query->orderBy('created_at', 'desc')->paginate(15);

            return $this->success([
                'owners' => OwnerResource::collection($owners->items()),
                'pagination' => [
                    'total' => $owners->total(),
                    'per_page' => $owners->perPage(),
                    'current_page' => $owners->currentPage(),
                    'last_page' => $owners->lastPage(),
                    'from' => $owners->firstItem(),
                    'to' => $owners->lastItem(),
                ],
            ], 'Proprietari recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei proprietari', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $owner = Owner::create($request->all());
            return $this->success(new OwnerResource($owner), 'Proprietario creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione del proprietario', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $owner = Owner::with('properties')->findOrFail($id);
            return $this->success(new OwnerResource($owner), 'Proprietario recuperato con successo');
        } catch (\Exception $e) {
            return $this->error('Proprietario non trovato', 404);
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $owner = Owner::findOrFail($id);
            $owner->update($request->all());
            return $this->success(new OwnerResource($owner->fresh()), 'Proprietario aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento del proprietario', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $owner = Owner::findOrFail($id);
            $owner->delete();
            return $this->success(null, 'Proprietario eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del proprietario', 500);
        }
    }
}
