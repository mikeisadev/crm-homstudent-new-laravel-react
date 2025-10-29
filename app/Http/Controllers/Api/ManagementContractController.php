<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ManagementContract;
use App\Http\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ManagementContractResource;
use App\Services\DocumentService;
use Illuminate\Support\Str;

class ManagementContractController extends Controller
{
    use ApiResponse;

    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Get all management contracts
     */
    public function index(Request $request)
    {
        try {
            $query = ManagementContract::query()
                ->with(['property', 'owners', 'documents']);

            $query->orderBy('created_at', 'desc');

            return $this->success([
                'management_contracts' => ManagementContractResource::collection($query->get())
            ], 'Contratti di gestione recuperati con successo');
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }

    /**
     * Create a new management contract
     */
    public function store(Request $request)
    {
        $request->validate([
            'property_id' => 'required|exists:properties,id',
            'contract_type' => 'nullable|string',
            'manager' => 'nullable|string',
            'current_date' => 'nullable|date',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'notice_months' => 'nullable|integer',
            'status' => 'required|in:draft,active,ongoing,expired,terminated',
            'commission_percentage' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'early_termination_notes' => 'nullable|string',
            'owner_ids' => 'nullable|array',
            'owner_ids.*' => 'exists:owners,id',
        ]);

        try {
            // Generate unique contract number
            $year = date('Y');
            $lastContract = ManagementContract::whereYear('created_at', $year)->latest()->first();
            $sequential = $lastContract ? intval(substr($lastContract->contract_number, -4)) + 1 : 1;
            $contractNumber = 'MC-' . $year . '-' . str_pad($sequential, 4, '0', STR_PAD_LEFT);

            // Create contract
            $contract = ManagementContract::create([
                'property_id' => $request->property_id,
                'contract_number' => $contractNumber,
                'contract_type' => $request->contract_type,
                'manager' => $request->manager,
                'current_date' => $request->current_date,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'notice_months' => $request->notice_months ?? 0,
                'status' => $request->status,
                'commission_percentage' => $request->commission_percentage,
                'notes' => $request->notes,
                'early_termination_notes' => $request->early_termination_notes,
            ]);

            // Attach owners if provided
            if ($request->has('owner_ids') && is_array($request->owner_ids)) {
                $contract->owners()->sync($request->owner_ids);
            }

            // Handle PDF file upload
            if ($request->hasFile('pdf_document')) {
                $file = $request->file('pdf_document');
                $this->documentService->uploadDocument($contract, $file, null);
            }

            // Load relationships
            $contract->load(['property', 'owners', 'documents']);

            return $this->success([
                'data' => new ManagementContractResource($contract)
            ], 'Contratto di gestione creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }

    /**
     * Get a specific management contract
     */
    public function show($id)
    {
        try {
            $contract = ManagementContract::with(['property', 'owners', 'documents'])->findOrFail($id);

            return $this->success([
                'data' => new ManagementContractResource($contract)
            ], 'Contratto di gestione recuperato con successo');
        } catch (\Exception $e) {
            return $this->error($e, 404);
        }
    }

    /**
     * Update a management contract
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'property_id' => 'sometimes|exists:properties,id',
            'contract_type' => 'nullable|string',
            'manager' => 'nullable|string',
            'current_date' => 'nullable|date',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'notice_months' => 'nullable|integer',
            'status' => 'sometimes|in:draft,active,ongoing,expired,terminated',
            'commission_percentage' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'early_termination_notes' => 'nullable|string',
            'owner_ids' => 'nullable|array',
            'owner_ids.*' => 'exists:owners,id',
        ]);

        try {
            $contract = ManagementContract::findOrFail($id);

            // Update contract
            $contract->update($request->only([
                'property_id',
                'contract_type',
                'manager',
                'current_date',
                'start_date',
                'end_date',
                'notice_months',
                'status',
                'commission_percentage',
                'notes',
                'early_termination_notes',
            ]));

            // Update owners if provided
            if ($request->has('owner_ids')) {
                $contract->owners()->sync($request->owner_ids ?? []);
            }

            // Handle PDF file upload
            if ($request->hasFile('pdf_document')) {
                $file = $request->file('pdf_document');
                $this->documentService->uploadDocument($contract, $file, null);
            }

            // Load relationships
            $contract->load(['property', 'owners', 'documents']);

            return $this->success([
                'data' => new ManagementContractResource($contract)
            ], 'Contratto di gestione aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }

    /**
     * Delete a management contract
     */
    public function destroy($id)
    {
        try {
            $contract = ManagementContract::findOrFail($id);
            $contract->delete();

            return $this->success([], 'Contratto di gestione eliminato con successo');
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }
}
