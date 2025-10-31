<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\PenaltyResource;
use App\Models\Penalty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PenaltyController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of penalties
     */
    public function index(Request $request)
    {
        try {
            $query = Penalty::with(['client', 'penaltyable']);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('amount', 'like', "%{$search}%");
                });
            }

            // Respect per_page parameter (default: 10)
            $perPage = $request->input('per_page', 10);
            $penalties = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return $this->success([
                'penalties' => PenaltyResource::collection($penalties->items()),
                'pagination' => [
                    'total' => $penalties->total(),
                    'per_page' => $penalties->perPage(),
                    'current_page' => $penalties->currentPage(),
                    'last_page' => $penalties->lastPage(),
                    'from' => $penalties->firstItem(),
                    'to' => $penalties->lastItem(),
                ],
            ], 'Sanzioni recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle sanzioni', 500);
        }
    }

    /**
     * Store a newly created penalty
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            // Handle invoice file upload
            if ($request->hasFile('invoice_file')) {
                $data['invoice_file'] = $this->handleFileUpload($request->file('invoice_file'), 'invoice');
            }

            // Handle payment document file upload
            if ($request->hasFile('payment_document_file')) {
                $data['payment_document_file'] = $this->handleFileUpload($request->file('payment_document_file'), 'payment');
            }

            $penalty = Penalty::create($data);

            return $this->success(
                new PenaltyResource($penalty->load(['client', 'penaltyable'])),
                'Sanzione creata con successo',
                201
            );
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della sanzione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified penalty
     */
    public function show(int $id)
    {
        try {
            $penalty = Penalty::with(['client', 'penaltyable'])->findOrFail($id);
            return $this->success(new PenaltyResource($penalty), 'Sanzione recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Sanzione non trovata', 404);
        }
    }

    /**
     * Update the specified penalty
     */
    public function update(Request $request, int $id)
    {
        try {
            $penalty = Penalty::findOrFail($id);
            $data = $request->all();

            // Handle invoice file upload
            if ($request->hasFile('invoice_file')) {
                // Delete old file if exists
                if ($penalty->invoice_file && Storage::exists($penalty->invoice_file)) {
                    Storage::delete($penalty->invoice_file);
                }
                $data['invoice_file'] = $this->handleFileUpload($request->file('invoice_file'), 'invoice');
            }

            // Handle payment document file upload
            if ($request->hasFile('payment_document_file')) {
                // Delete old file if exists
                if ($penalty->payment_document_file && Storage::exists($penalty->payment_document_file)) {
                    Storage::delete($penalty->payment_document_file);
                }
                $data['payment_document_file'] = $this->handleFileUpload($request->file('payment_document_file'), 'payment');
            }

            $penalty->update($data);

            return $this->success(
                new PenaltyResource($penalty->fresh(['client', 'penaltyable'])),
                'Sanzione aggiornata con successo'
            );
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della sanzione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Soft delete the specified penalty
     * Files are kept until permanent deletion
     */
    public function destroy(int $id)
    {
        try {
            $penalty = Penalty::findOrFail($id);

            // Soft delete - files remain in storage
            $penalty->delete();

            return $this->success(null, 'Sanzione eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della sanzione', 500);
        }
    }

    /**
     * Handle file upload
     * Stores files in private storage with unique names
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $type (invoice or payment)
     * @return string File path
     */
    private function handleFileUpload($file, $type)
    {
        $extension = $file->getClientOriginalExtension();
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($originalName) . '_' . Str::random(8) . '.' . $extension;

        // Store in penalties/{type}/{filename}
        $path = "penalties/{$type}/" . $filename;
        Storage::put($path, file_get_contents($file), 'private');

        return $path;
    }

    /**
     * View penalty file (inline - opens in browser)
     */
    public function viewFile(int $id, string $fileType)
    {
        try {
            $penalty = Penalty::findOrFail($id);

            $filePath = $fileType === 'invoice' ? $penalty->invoice_file : $penalty->payment_document_file;

            if (!$filePath || !Storage::exists($filePath)) {
                return $this->error('File non trovato', 404);
            }

            // Get file contents and metadata
            $fileContents = Storage::get($filePath);
            $filename = basename($filePath);

            // Determine MIME type
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            $mimeType = $extension === 'pdf' ? 'application/pdf' : 'application/octet-stream';

            // Return file with inline disposition (opens in browser)
            return response($fileContents)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return $this->error('Errore nella visualizzazione del file', 500);
        }
    }

    /**
     * Download penalty file (attachment - triggers download)
     */
    public function downloadFile(int $id, string $fileType)
    {
        try {
            $penalty = Penalty::findOrFail($id);

            $filePath = $fileType === 'invoice' ? $penalty->invoice_file : $penalty->payment_document_file;

            if (!$filePath || !Storage::exists($filePath)) {
                return $this->error('File non trovato', 404);
            }

            // Get file contents and metadata
            $fileContents = Storage::get($filePath);
            $filename = basename($filePath);

            // Determine MIME type
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            $mimeType = $extension === 'pdf' ? 'application/pdf' : 'application/octet-stream';

            // Return file with attachment disposition (triggers download)
            return response($fileContents)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return $this->error('Errore nel download del file', 500);
        }
    }
}
