<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ClientController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of clients
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Client::with(['meta', 'contacts', 'banking']);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('company_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('mobile', 'like', "%{$search}%");
                });
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->input('type'));
            }

            // Filter by city
            if ($request->has('city')) {
                $query->where('city', $request->input('city'));
            }

            // Filter by province
            if ($request->has('province')) {
                $query->where('province', $request->input('province'));
            }

            // Order by
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $clients = $query->paginate(15);

            return $this->success([
                'clients' => ClientResource::collection($clients->items()),
                'pagination' => [
                    'total' => $clients->total(),
                    'per_page' => $clients->perPage(),
                    'current_page' => $clients->currentPage(),
                    'last_page' => $clients->lastPage(),
                    'from' => $clients->firstItem(),
                    'to' => $clients->lastItem(),
                ],
            ], 'Clienti recuperati con successo');

        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei clienti: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created client
     *
     * @param StoreClientRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreClientRequest $request)
    {
        try {
            \DB::beginTransaction();

            $validated = $request->validated();

            // Extract main client data
            $clientData = collect($validated)->except(['meta_data', 'contacts_data', 'banking_data'])->toArray();

            // Create client
            $client = Client::create($clientData);

            // Handle meta data
            if (isset($validated['meta_data']) && is_array($validated['meta_data'])) {
                foreach ($validated['meta_data'] as $key => $value) {
                    if ($value !== null && $value !== '') {
                        $client->setMeta($key, $value);
                    }
                }
            }

            // Handle contacts data
            if (isset($validated['contacts_data']) && is_array($validated['contacts_data'])) {
                $contactTypes = [
                    'phone_secondary' => 'Telefono secondario',
                    'email_secondary' => 'Email secondaria',
                    'fax' => 'Fax',
                    'pec' => 'PEC',
                    'facebook' => 'Facebook',
                    'linkedin' => 'LinkedIn',
                ];

                foreach ($validated['contacts_data'] as $type => $value) {
                    if ($value !== null && $value !== '' && isset($contactTypes[$type])) {
                        $client->contacts()->create([
                            'type' => $type,
                            'value' => $value,
                            'label' => $contactTypes[$type],
                            'is_primary' => false,
                        ]);
                    }
                }
            }

            // Handle banking data
            if (isset($validated['banking_data']) && is_array($validated['banking_data'])) {
                $bankingData = $validated['banking_data'];
                if (!empty(array_filter($bankingData))) {
                    $client->banking()->create([
                        'bank_name' => $bankingData['bank_name'] ?? null,
                        'iban' => $bankingData['iban'] ?? null,
                        'payment_method' => $bankingData['payment_method'] ?? null,
                        'is_primary' => true,
                    ]);
                }
            }

            \DB::commit();

            // Load relationships for response
            $client->load(['meta', 'contacts', 'banking']);

            return $this->success(
                new ClientResource($client),
                'Cliente creato con successo',
                201
            );

        } catch (\Exception $e) {
            \DB::rollBack();
            return $this->error('Errore nella creazione del cliente: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified client
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id)
    {
        try {
            $client = Client::with([
                'meta',
                'addresses',
                'contacts',
                'banking',
                'proposals',
                'contracts'
            ])->findOrFail($id);

            return $this->success(
                new ClientResource($client),
                'Cliente recuperato con successo'
            );

        } catch (ModelNotFoundException $e) {
            return $this->error('Cliente non trovato', 404);
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero del cliente: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified client
     *
     * @param UpdateClientRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateClientRequest $request, int $id)
    {
        try {
            \DB::beginTransaction();

            $client = Client::findOrFail($id);
            $validated = $request->validated();

            // Extract main client data
            $clientData = collect($validated)->except(['meta_data', 'contacts_data', 'banking_data'])->toArray();

            // Update client
            $client->update($clientData);

            // Handle meta data
            if (isset($validated['meta_data']) && is_array($validated['meta_data'])) {
                foreach ($validated['meta_data'] as $key => $value) {
                    if ($value !== null && $value !== '') {
                        $client->setMeta($key, $value);
                    } else {
                        // Remove meta if value is empty
                        $client->meta()->where('meta_key', $key)->delete();
                    }
                }
            }

            // Handle contacts data
            if (isset($validated['contacts_data']) && is_array($validated['contacts_data'])) {
                $contactTypes = [
                    'phone_secondary' => 'Telefono secondario',
                    'email_secondary' => 'Email secondaria',
                    'fax' => 'Fax',
                    'pec' => 'PEC',
                    'facebook' => 'Facebook',
                    'linkedin' => 'LinkedIn',
                ];

                foreach ($validated['contacts_data'] as $type => $value) {
                    if ($value !== null && $value !== '' && isset($contactTypes[$type])) {
                        $client->contacts()->updateOrCreate(
                            ['type' => $type],
                            [
                                'value' => $value,
                                'label' => $contactTypes[$type],
                                'is_primary' => false,
                            ]
                        );
                    } else {
                        // Remove contact if value is empty
                        $client->contacts()->where('type', $type)->delete();
                    }
                }
            }

            // Handle banking data
            if (isset($validated['banking_data']) && is_array($validated['banking_data'])) {
                $bankingData = $validated['banking_data'];

                if (!empty(array_filter($bankingData))) {
                    // Update or create primary banking record
                    $primaryBanking = $client->banking()->where('is_primary', true)->first();

                    if ($primaryBanking) {
                        $primaryBanking->update([
                            'bank_name' => $bankingData['bank_name'] ?? null,
                            'iban' => $bankingData['iban'] ?? null,
                            'payment_method' => $bankingData['payment_method'] ?? null,
                        ]);
                    } else {
                        $client->banking()->create([
                            'bank_name' => $bankingData['bank_name'] ?? null,
                            'iban' => $bankingData['iban'] ?? null,
                            'payment_method' => $bankingData['payment_method'] ?? null,
                            'is_primary' => true,
                        ]);
                    }
                } else {
                    // Remove banking if all values are empty
                    $client->banking()->where('is_primary', true)->delete();
                }
            }

            \DB::commit();

            // Load relationships for response
            $client->load(['meta', 'contacts', 'banking']);

            return $this->success(
                new ClientResource($client->fresh(['meta', 'contacts', 'banking'])),
                'Cliente aggiornato con successo'
            );

        } catch (ModelNotFoundException $e) {
            \DB::rollBack();
            return $this->error('Cliente non trovato', 404);
        } catch (\Exception $e) {
            \DB::rollBack();
            return $this->error('Errore nell\'aggiornamento del cliente: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified client (soft delete)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();

            return $this->success(null, 'Cliente eliminato con successo');

        } catch (ModelNotFoundException $e) {
            return $this->error('Cliente non trovato', 404);
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del cliente: ' . $e->getMessage(), 500);
        }
    }
}
