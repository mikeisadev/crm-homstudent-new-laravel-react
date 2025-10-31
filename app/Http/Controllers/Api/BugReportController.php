<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\BugReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * BugReportController
 *
 * Handles bug report submissions from authenticated users
 * Captures comprehensive debugging information
 */
class BugReportController extends Controller
{
    use ApiResponse;

    /**
     * Store a new bug report
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate incoming request
            $validated = $request->validate([
                'bug_description' => 'required|string|min:10|max:5000',
                'report_date' => 'required|date',
                'browser_info' => 'nullable|string|max:1000',
                'url' => 'nullable|string|max:500',
            ]);

            // Add authenticated user ID
            $validated['user_id'] = Auth::id();

            // Add IP address (for security/abuse tracking)
            $validated['ip_address'] = $request->ip();

            // Set default status
            $validated['status'] = 'new';

            // Create bug report
            $bugReport = BugReport::create($validated);

            // Load user relationship for response
            $bugReport->load('user:id,name,email');

            return $this->success(
                $bugReport,
                'Bug report inviato con successo. Grazie per la segnalazione!',
                201
            );

        } catch (ValidationException $e) {
            return $this->error(
                'Errore di validazione: ' . implode(' ', $e->errors()['bug_description'] ?? ['Verifica i dati inseriti']),
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error('Bug report submission error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->error(
                'Errore nell\'invio del bug report. Riprova più tardi.',
                500
            );
        }
    }

    /**
     * Get all bug reports (for future admin panel)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = BugReport::with('user:id,name,email');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Order by most recent
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $perPage = $request->input('per_page', 25);
            $bugReports = $query->paginate($perPage);

            return $this->success([
                'bug_reports' => $bugReports->items(),
                'pagination' => [
                    'total' => $bugReports->total(),
                    'per_page' => $bugReports->perPage(),
                    'current_page' => $bugReports->currentPage(),
                    'last_page' => $bugReports->lastPage(),
                ],
            ], 'Bug reports recuperati con successo');

        } catch (\Exception $e) {
            return $this->error('Errore nel recupero dei bug reports', 500);
        }
    }
}
