<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Resources\FolderResource;
use App\Models\Client;
use App\Models\ClientFolder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    /**
     * Display a listing of folders for a client
     *
     * @param Client $client
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Client $client, Request $request)
    {
        $parentId = $request->query('parent_id');

        $query = $client->folders();

        // Filter by parent folder if specified
        if ($parentId !== null) {
            $query->where('parent_folder_id', $parentId);
        } else {
            // Root level folders (no parent)
            $query->whereNull('parent_folder_id');
        }

        $folders = $query
            ->withCount(['documents', 'children as subfolders_count'])
            ->orderBy('name', 'asc')
            ->get();

        return FolderResource::collection($folders);
    }

    /**
     * Create a new folder with security validation
     *
     * @param StoreFolderRequest $request
     * @param Client $client
     * @return FolderResource
     */
    public function store(StoreFolderRequest $request, Client $client)
    {
        // Generate folder path
        $path = $request->name;

        if ($request->parent_folder_id) {
            $parentFolder = $client->folders()->findOrFail($request->parent_folder_id);
            $path = $parentFolder->path . '/' . $request->name;
        }

        // Create folder record (physical folder created by model boot)
        $folder = $client->folders()->create([
            'name' => $request->name,
            'path' => $path,
            'parent_folder_id' => $request->parent_folder_id,
        ]);

        return new FolderResource($folder->loadCount(['documents', 'children as subfolders_count']));
    }

    /**
     * Display the specified folder with its contents
     *
     * @param Client $client
     * @param ClientFolder $folder
     * @return FolderResource
     */
    public function show(Client $client, ClientFolder $folder)
    {
        // Security: Verify folder belongs to client
        if ($folder->client_id !== $client->id) {
            abort(403, 'Accesso negato alla cartella');
        }

        $folder->loadCount(['documents', 'children as subfolders_count']);
        $folder->load(['parent']);

        return new FolderResource($folder);
    }

    /**
     * Remove the specified folder (soft delete with cascade)
     *
     * @param Client $client
     * @param ClientFolder $folder
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Client $client, ClientFolder $folder)
    {
        // Security: Verify folder belongs to client
        if ($folder->client_id !== $client->id) {
            abort(403, 'Accesso negato alla cartella');
        }

        // Soft delete (cascade handled by model boot method)
        $folder->delete();

        return response()->json([
            'message' => 'Cartella eliminata con successo',
        ]);
    }
}
