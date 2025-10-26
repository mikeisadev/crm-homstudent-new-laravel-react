<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Client;
use App\Models\ClientDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents for a client
     *
     * @param Client $client
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Client $client, Request $request)
    {
        $folderId = $request->query('folder_id');

        $query = $client->documents();

        // Filter by folder if specified
        if ($folderId !== null) {
            $query->where('folder_id', $folderId);
        } else {
            // Root level documents (no folder)
            $query->whereNull('folder_id');
        }

        $documents = $query->with('folder')->orderBy('created_at', 'desc')->get();

        return DocumentResource::collection($documents);
    }

    /**
     * Upload a new document with security features
     *
     * @param StoreDocumentRequest $request
     * @param Client $client
     * @return DocumentResource
     */
    public function upload(StoreDocumentRequest $request, Client $client)
    {
        $file = $request->file('file');

        // Generate secure stored filename using hash
        $uuid = Str::uuid();
        $originalName = $file->getClientOriginalName();
        $timestamp = now()->timestamp;
        $extension = $file->getClientOriginalExtension();

        // Hash: SHA256(uuid + original_name + timestamp)
        $hash = hash('sha256', $uuid . $originalName . $timestamp);
        $storedName = $hash . '.' . $extension;

        // Determine relative path within client's folder
        $relativePath = $storedName;

        if ($request->folder_id) {
            $folder = $client->folders()->findOrFail($request->folder_id);
            $relativePath = $folder->path . '/' . $storedName;
        }

        // Full disk path: client_documents/{uuid}/{relativePath}
        $fullDiskPath = 'client_documents/' . $client->documents_folder_uuid . '/' . $relativePath;

        // Store file with proper permissions
        Storage::put($fullDiskPath, file_get_contents($file), 'private');

        // Create database record
        $document = $client->documents()->create([
            'folder_id' => $request->folder_id,
            'name' => $originalName,
            'stored_name' => $storedName,
            'extension' => $extension,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $relativePath,
        ]);

        return new DocumentResource($document->load('folder'));
    }

    /**
     * Display the specified document metadata
     *
     * @param Client $client
     * @param ClientDocument $document
     * @return DocumentResource
     */
    public function show(Client $client, ClientDocument $document)
    {
        // Security: Verify document belongs to client
        if ($document->client_id !== $client->id) {
            abort(403, 'Accesso negato al documento');
        }

        return new DocumentResource($document->load('folder'));
    }

    /**
     * Download document securely
     *
     * @param Client $client
     * @param ClientDocument $document
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download(Client $client, ClientDocument $document)
    {
        // Security: Verify document belongs to client
        if ($document->client_id !== $client->id) {
            abort(403, 'Accesso negato al documento');
        }

        $fullPath = $document->getFullDiskPath();

        if (!Storage::exists($fullPath)) {
            abort(404, 'File non trovato');
        }

        return Storage::download($fullPath, $document->name);
    }

    /**
     * View document in browser (PDFs and images)
     *
     * @param Client $client
     * @param ClientDocument $document
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function view(Client $client, ClientDocument $document)
    {
        // Security: Verify document belongs to client
        if ($document->client_id !== $client->id) {
            abort(403, 'Accesso negato al documento');
        }

        // Only allow viewing of PDFs and images
        if (!$document->isViewable()) {
            abort(400, 'Tipo di file non visualizzabile. Scarica il file invece.');
        }

        $fullPath = $document->getFullDiskPath();

        if (!Storage::exists($fullPath)) {
            abort(404, 'File non trovato');
        }

        return response()->file(Storage::path($fullPath), [
            'Content-Type' => $document->mime_type,
            'Content-Disposition' => 'inline; filename="' . $document->name . '"',
        ]);
    }

    /**
     * Remove the specified document (soft delete)
     *
     * @param Client $client
     * @param ClientDocument $document
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Client $client, ClientDocument $document)
    {
        // Security: Verify document belongs to client
        if ($document->client_id !== $client->id) {
            abort(403, 'Accesso negato al documento');
        }

        $document->delete();

        return response()->json([
            'message' => 'Documento eliminato con successo',
        ]);
    }
}
