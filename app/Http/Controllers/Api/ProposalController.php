<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\ProposalResource;
use App\Models\Proposal;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Proposal::query();

            if ($request->has('client_id')) {
                $query->where('client_id', $request->input('client_id'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            $query->orderBy('created_at', 'desc');

            // Respect per_page parameter for select field options (e.g., per_page=9999)
            // Default to 15 for listing pages
            $perPage = $request->input('per_page', 15);
            $proposals = $query->paginate($perPage);

            return $this->success([
                'proposals' => ProposalResource::collection($proposals->items()),
                'pagination' => [
                    'total' => $proposals->total(),
                    'per_page' => $proposals->perPage(),
                    'current_page' => $proposals->currentPage(),
                    'last_page' => $proposals->lastPage(),
                    'from' => $proposals->firstItem(),
                    'to' => $proposals->lastItem(),
                ],
            ], 'Proposte recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle proposte', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $proposal = Proposal::create($request->all());
            return $this->success(new ProposalResource($proposal), 'Proposta creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della proposta', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $proposal = Proposal::with(['client', 'property', 'room'])->findOrFail($id);
            return $this->success(new ProposalResource($proposal), 'Proposta recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Proposta non trovata', 404);
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $proposal = Proposal::findOrFail($id);
            $proposal->update($request->all());
            return $this->success(new ProposalResource($proposal->fresh()), 'Proposta aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della proposta', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $proposal = Proposal::findOrFail($id);
            $proposal->delete();
            return $this->success(null, 'Proposta eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della proposta', 500);
        }
    }
}
