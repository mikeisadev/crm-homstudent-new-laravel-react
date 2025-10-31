<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Invoice Controller
 *
 * Manages all invoices across all properties (main listing)
 */
class InvoiceController extends Controller
{
    use ApiResponse;

    /**
     * Get all invoices with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Invoice::with(['property']);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('invoice_type', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('amount', 'like', "%{$search}%");
                });
            }

            // Respect per_page parameter (default: 10)
            $perPage = $request->input('per_page', 10);
            $invoices = $query->orderBy('issue_date', 'desc')->paginate($perPage);

            return $this->success([
                'invoices' => $invoices->items(),
                'pagination' => [
                    'total' => $invoices->total(),
                    'per_page' => $invoices->perPage(),
                    'current_page' => $invoices->currentPage(),
                    'last_page' => $invoices->lastPage(),
                    'from' => $invoices->firstItem(),
                    'to' => $invoices->lastItem(),
                ],
            ], 'Bollette recuperate con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero delle bollette', 500);
        }
    }

    /**
     * Store a new invoice
     */
    public function store(Request $request)
    {
        try {
            $data = $request->except(['file']);

            // Convert boolean string to actual boolean/integer
            if (isset($data['send_charge'])) {
                $data['send_charge'] = filter_var($data['send_charge'], FILTER_VALIDATE_BOOLEAN);
            }

            // Handle PDF file upload
            if ($request->hasFile('file')) {
                $data['file_path'] = $this->handleFileUpload($request->file('file'), $data['property_id']);
            }

            $invoice = Invoice::create($data);

            return $this->success($invoice->load('property'), 'Bolletta creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della bolletta: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get a specific invoice
     */
    public function show(int $id)
    {
        try {
            $invoice = Invoice::with('property')->findOrFail($id);
            return $this->success($invoice, 'Bolletta recuperata con successo');
        } catch (\Exception $e) {
            return $this->error('Bolletta non trovata', 404);
        }
    }

    /**
     * Update an invoice
     */
    public function update(Request $request, int $id)
    {
        try {
            $invoice = Invoice::findOrFail($id);
            $data = $request->except(['file']);

            // Convert boolean string to actual boolean/integer
            if (isset($data['send_charge'])) {
                $data['send_charge'] = filter_var($data['send_charge'], FILTER_VALIDATE_BOOLEAN);
            }

            // Handle PDF file upload (replace existing)
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($invoice->file_path && Storage::exists($invoice->file_path)) {
                    Storage::delete($invoice->file_path);
                }
                $data['file_path'] = $this->handleFileUpload($request->file('file'), $invoice->property_id);
            }

            $invoice->update($data);

            return $this->success($invoice->fresh('property'), 'Bolletta aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della bolletta: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete an invoice
     */
    public function destroy(int $id)
    {
        try {
            $invoice = Invoice::findOrFail($id);

            // Soft delete (file kept until permanent deletion)
            $invoice->delete();

            return $this->success(null, 'Bolletta eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della bolletta', 500);
        }
    }

    /**
     * View invoice PDF file (blob)
     */
    public function viewFile(int $id)
    {
        try {
            $invoice = Invoice::findOrFail($id);

            if (!$invoice->file_path || !Storage::exists($invoice->file_path)) {
                return $this->error('File non trovato', 404);
            }

            $fileContents = Storage::get($invoice->file_path);
            $filename = basename($invoice->file_path);
            $mimeType = 'application/pdf';

            return response($fileContents)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return $this->error('Errore nella visualizzazione del file', 500);
        }
    }

    /**
     * Download invoice PDF file
     */
    public function downloadFile(int $id)
    {
        try {
            $invoice = Invoice::findOrFail($id);

            if (!$invoice->file_path || !Storage::exists($invoice->file_path)) {
                return $this->error('File non trovato', 404);
            }

            $fileContents = Storage::get($invoice->file_path);
            $filename = basename($invoice->file_path);
            $mimeType = 'application/pdf';

            return response($fileContents)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return $this->error('Errore nel download del file', 500);
        }
    }

    /**
     * Handle file upload with proper folder structure
     * Stores in: storage/app/invoice_docs/{property_id}/
     */
    private function handleFileUpload($file, $propertyId)
    {
        $extension = $file->getClientOriginalExtension();
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($originalName) . '_' . Str::random(8) . '.' . $extension;

        // Create folder structure: invoice_docs/{property_id}/
        $path = "invoice_docs/{$propertyId}/" . $filename;

        // Store file in private storage
        Storage::put($path, file_get_contents($file), 'private');

        return $path;
    }
}
