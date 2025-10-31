<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Resources\DepositResource;
use App\Models\Deposit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DepositController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of deposits
     */
    public function index(Request $request)
    {
        try {
            $query = Deposit::with(['client', 'depositable']);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('amount', 'like', "%{$search}%");
                });
            }

            // Respect per_page parameter (default: 10)
            $perPage = $request->input('per_page', 10);
            $deposits = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return $this->success([
                'deposits' => DepositResource::collection($deposits->items()),
                'pagination' => [
                    'total' => $deposits->total(),
                    'per_page' => $deposits->perPage(),
                    'current_page' => $deposits->currentPage(),
                    'last_page' => $deposits->lastPage(),
                    'from' => $deposits->firstItem(),
                    'to' => $deposits->lastItem(),
                ],
            ], 'Caparre recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle caparre', 500);
        }
    }

    /**
     * Store a newly created deposit
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            // Handle payment document file upload
            if ($request->hasFile('payment_document_file')) {
                $data['payment_document_file'] = $this->handleFileUpload($request->file('payment_document_file'));
            }

            $deposit = Deposit::create($data);

            return $this->success(
                new DepositResource($deposit->load(['client', 'depositable'])),
                'Caparra creata con successo',
                201
            );
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della caparra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified deposit
     */
    public function show(int $id)
    {
        try {
            $deposit = Deposit::with(['client', 'depositable'])->findOrFail($id);
            return $this->success(new DepositResource($deposit), 'Caparra recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Caparra non trovata', 404);
        }
    }

    /**
     * Update the specified deposit
     */
    public function update(Request $request, int $id)
    {
        try {
            $deposit = Deposit::findOrFail($id);
            $data = $request->all();

            // Handle payment document file upload
            if ($request->hasFile('payment_document_file')) {
                // Delete old file if exists
                if ($deposit->payment_document_file && Storage::exists($deposit->payment_document_file)) {
                    Storage::delete($deposit->payment_document_file);
                }
                $data['payment_document_file'] = $this->handleFileUpload($request->file('payment_document_file'));
            }

            $deposit->update($data);

            return $this->success(
                new DepositResource($deposit->fresh(['client', 'depositable'])),
                'Caparra aggiornata con successo'
            );
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della caparra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Soft delete the specified deposit
     * Files are kept until permanent deletion
     */
    public function destroy(int $id)
    {
        try {
            $deposit = Deposit::findOrFail($id);

            // Soft delete - files remain in storage
            $deposit->delete();

            return $this->success(null, 'Caparra eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della caparra', 500);
        }
    }

    /**
     * Handle file upload
     * Stores files in private storage with unique names
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string File path
     */
    private function handleFileUpload($file)
    {
        $extension = $file->getClientOriginalExtension();
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($originalName) . '_' . Str::random(8) . '.' . $extension;

        // Store in deposits/payment/{filename}
        $path = "deposits/payment/" . $filename;
        Storage::put($path, file_get_contents($file), 'private');

        return $path;
    }

    /**
     * View deposit file (inline - opens in browser)
     */
    public function viewFile(int $id)
    {
        try {
            $deposit = Deposit::findOrFail($id);

            if (!$deposit->payment_document_file || !Storage::exists($deposit->payment_document_file)) {
                return $this->error('File non trovato', 404);
            }

            // Get file contents and metadata
            $fileContents = Storage::get($deposit->payment_document_file);
            $filename = basename($deposit->payment_document_file);

            // Determine MIME type
            $extension = pathinfo($deposit->payment_document_file, PATHINFO_EXTENSION);
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
     * Download deposit file (attachment - triggers download)
     */
    public function downloadFile(int $id)
    {
        try {
            $deposit = Deposit::findOrFail($id);

            if (!$deposit->payment_document_file || !Storage::exists($deposit->payment_document_file)) {
                return $this->error('File non trovato', 404);
            }

            // Get file contents and metadata
            $fileContents = Storage::get($deposit->payment_document_file);
            $filename = basename($deposit->payment_document_file);

            // Determine MIME type
            $extension = pathinfo($deposit->payment_document_file, PATHINFO_EXTENSION);
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
