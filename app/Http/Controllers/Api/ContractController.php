<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\StoreContractRequest;
use App\Http\Requests\UpdateContractRequest;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Contract::with(['client', 'secondaryClient', 'property', 'room', 'condominium']);

            if ($request->has('client_id')) {
                $query->where('client_id', $request->input('client_id'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->has('contract_type')) {
                $query->where('contract_type', $request->input('contract_type'));
            }

            if ($request->has('property_type')) {
                $query->where('property_type', $request->input('property_type'));
            }

            $query->orderBy('created_at', 'desc');

            // Respect per_page parameter for select field options (e.g., per_page=9999)
            // Default to 15 for listing pages
            $perPage = $request->input('per_page', 15);
            $contracts = $query->paginate($perPage);

            return $this->success([
                'contracts' => ContractResource::collection($contracts->items()),
                'pagination' => [
                    'total' => $contracts->total(),
                    'per_page' => $contracts->perPage(),
                    'current_page' => $contracts->currentPage(),
                    'last_page' => $contracts->lastPage(),
                    'from' => $contracts->firstItem(),
                    'to' => $contracts->lastItem(),
                ],
            ], 'Contratti recuperati con successo');

        } catch (\Exception $e) {
            \Log::error('Error fetching contracts: ' . $e->getMessage());
            return $this->error('Errore nel recupero dei contratti', 500);
        }
    }

    public function store(StoreContractRequest $request)
    {
        try {
            $data = $request->validated();

            // Generate contract number if not provided
            if (empty($data['contract_number'])) {
                $year = date('Y');
                $lastContract = Contract::where('year', $year)->orderBy('sequential_number', 'desc')->first();
                $sequentialNumber = $lastContract ? $lastContract->sequential_number + 1 : 1;

                $data['year'] = $year;
                $data['sequential_number'] = $sequentialNumber;
                $data['contract_number'] = sprintf('%d-%04d', $year, $sequentialNumber);
            }

            // Create contract with all data including installments_json
            // Laravel will automatically cast installments_json array to JSON
            $contract = Contract::create($data);

            // Load relationships for response
            $contract->load(['client', 'secondaryClient', 'property', 'room', 'condominium']);

            return $this->success(new ContractResource($contract), 'Contratto creato con successo', 201);
        } catch (\Exception $e) {
            \Log::error('Error creating contract: ' . $e->getMessage());
            return $this->error('Errore nella creazione del contratto: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $contract = Contract::with([
                'client',
                'secondaryClient',
                'property',
                'room',
                'condominium',
                'payments'
            ])->findOrFail($id);

            return $this->success(new ContractResource($contract), 'Contratto recuperato con successo');
        } catch (\Exception $e) {
            return $this->error('Contratto non trovato', 404);
        }
    }

    public function update(UpdateContractRequest $request, int $id)
    {
        try {
            $contract = Contract::findOrFail($id);

            // Update contract with all data including installments_json
            // Laravel will automatically cast installments_json array to JSON
            $contract->update($request->validated());

            // Reload with relationships
            $contract->load(['client', 'secondaryClient', 'property', 'room', 'condominium']);

            return $this->success(new ContractResource($contract->fresh(['client', 'secondaryClient', 'property', 'room', 'condominium'])), 'Contratto aggiornato con successo');
        } catch (\Exception $e) {
            \Log::error('Error updating contract: ' . $e->getMessage());
            return $this->error('Errore nell\'aggiornamento del contratto', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $contract = Contract::findOrFail($id);
            $contract->delete();
            return $this->success(null, 'Contratto eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del contratto', 500);
        }
    }
}
