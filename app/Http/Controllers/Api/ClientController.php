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
            $query = Client::query();

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
            $client = Client::create($request->validated());

            return $this->success(
                new ClientResource($client),
                'Cliente creato con successo',
                201
            );

        } catch (\Exception $e) {
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
            $client = Client::findOrFail($id);
            $client->update($request->validated());

            return $this->success(
                new ClientResource($client->fresh()),
                'Cliente aggiornato con successo'
            );

        } catch (ModelNotFoundException $e) {
            return $this->error('Cliente non trovato', 404);
        } catch (\Exception $e) {
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
