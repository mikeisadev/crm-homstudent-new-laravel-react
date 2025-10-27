<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Supplier::query();
            if ($request->has('search')) {
                $query->where('name', 'like', "%{$request->input('search')}%");
            }
            $suppliers = $query->orderBy('created_at', 'desc')->paginate(15);
            return $this->success([
                'suppliers' => SupplierResource::collection($suppliers->items()),
                'pagination' => [
                    'total' => $suppliers->total(),
                    'per_page' => $suppliers->perPage(),
                    'current_page' => $suppliers->currentPage(),
                    'last_page' => $suppliers->lastPage(),
                    'from' => $suppliers->firstItem(),
                    'to' => $suppliers->lastItem(),
                ],
            ], 'Fornitori recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei fornitori', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $supplier = Supplier::create($request->all());
            return $this->success(new SupplierResource($supplier), 'Fornitore creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione del fornitore', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            return $this->success(new SupplierResource($supplier), 'Fornitore recuperato con successo');
        } catch (\Exception $e) {
            return $this->error('Fornitore non trovato', 404);
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->update($request->all());
            return $this->success(new SupplierResource($supplier->fresh()), 'Fornitore aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento del fornitore', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();
            return $this->success(null, 'Fornitore eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del fornitore', 500);
        }
    }
}
