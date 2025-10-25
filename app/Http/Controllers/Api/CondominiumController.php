<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\CondominiumResource;
use App\Models\Condominium;
use Illuminate\Http\Request;

class CondominiumController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Condominium::query();
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%")->orWhere('address', 'like', "%{$search}%");
            }
            $condominiums = $query->orderBy('created_at', 'desc')->paginate(15);
            return $this->success([
                'condominiums' => CondominiumResource::collection($condominiums->items()),
                'pagination' => ['total' => $condominiums->total(), 'per_page' => $condominiums->perPage(), 'current_page' => $condominiums->currentPage(), 'last_page' => $condominiums->lastPage()],
            ], 'Condomini recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei condomini', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $condominium = Condominium::create($request->all());
            return $this->success(new CondominiumResource($condominium), 'Condominio creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione del condominio', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $condominium = Condominium::findOrFail($id);
            return $this->success(new CondominiumResource($condominium), 'Condominio recuperato con successo');
        } catch (\Exception $e) {
            return $this->error('Condominio non trovato', 404);
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $condominium = Condominium::findOrFail($id);
            $condominium->update($request->all());
            return $this->success(new CondominiumResource($condominium->fresh()), 'Condominio aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento del condominio', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $condominium = Condominium::findOrFail($id);
            $condominium->delete();
            return $this->success(null, 'Condominio eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del condominium', 500);
        }
    }
}
