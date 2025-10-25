<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\CalendarMaintenance;
use App\Models\CalendarCheckin;
use App\Models\CalendarCheckout;
use App\Models\CalendarReport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Calendar Controller
 * Handles all calendar-related operations (maintenances, check-ins, check-outs, reports)
 */
class CalendarController extends Controller
{
    use ApiResponse;

    /**
     * Get all calendar events
     * Returns all events from all calendar types for FullCalendar
     *
     * @return JsonResponse
     */
    public function getAllEvents(): JsonResponse
    {
        try {
            $events = [];

            // Get all maintenances
            $maintenances = CalendarMaintenance::with(['property', 'room', 'client', 'supplier'])->get();
            foreach ($maintenances as $maintenance) {
                $events[] = [
                    'id' => 'maintenance_' . $maintenance->id,
                    'type' => 'maintenance',
                    'title' => 'Manutenzione: ' . ($maintenance->property->name ?? 'N/A'),
                    'start' => $maintenance->start_date,
                    'end' => $maintenance->end_date,
                    'backgroundColor' => '#3b82f6', // Blue
                    'borderColor' => '#3b82f6',
                    'data' => $maintenance,
                ];
            }

            // Get all check-ins
            $checkins = CalendarCheckin::with(['client', 'contract'])->get();
            foreach ($checkins as $checkin) {
                $events[] = [
                    'id' => 'checkin_' . $checkin->id,
                    'type' => 'checkin',
                    'title' => 'Check-in: ' . ($checkin->client->full_name ?? 'N/A'),
                    'start' => $checkin->checkin_date,
                    'backgroundColor' => '#10b981', // Green
                    'borderColor' => '#10b981',
                    'data' => $checkin,
                ];
            }

            // Get all check-outs
            $checkouts = CalendarCheckout::with(['client', 'contract'])->get();
            foreach ($checkouts as $checkout) {
                $events[] = [
                    'id' => 'checkout_' . $checkout->id,
                    'type' => 'checkout',
                    'title' => 'Check-out: ' . ($checkout->client->full_name ?? 'N/A'),
                    'start' => $checkout->checkout_date,
                    'backgroundColor' => '#ef4444', // Red
                    'borderColor' => '#ef4444',
                    'data' => $checkout,
                ];
            }

            // Get all reports
            $reports = CalendarReport::with(['property', 'room'])->get();
            foreach ($reports as $report) {
                $events[] = [
                    'id' => 'report_' . $report->id,
                    'type' => 'report',
                    'title' => 'Segnalazione: ' . ($report->property->name ?? 'N/A'),
                    'start' => $report->start_date,
                    'end' => $report->end_date,
                    'backgroundColor' => '#f59e0b', // Yellow
                    'borderColor' => '#f59e0b',
                    'data' => $report,
                ];
            }

            return $this->success($events, 'Eventi calendario recuperati con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nel recupero degli eventi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a new maintenance event
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeMaintenance(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'property_id' => 'required|exists:properties,id',
                'room_id' => 'required|exists:rooms,id',
                'maintenance_name' => 'required|string',
                'urgency_type' => 'required|in:urgent,medium,not_urgent',
                'maintenance_type' => 'required|in:ordinary,extraordinary',
                'report_date' => 'nullable|date',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'supplier_id' => 'nullable|exists:suppliers,id',
                'report_source' => 'nullable|string',
                'client_id' => 'nullable|exists:clients,id',
                'responsible' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $maintenance = CalendarMaintenance::create($validated);
            $maintenance->load(['property', 'room', 'client', 'supplier']);

            return $this->success($maintenance, 'Manutenzione creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della manutenzione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a new check-in event
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeCheckin(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'checkin_date' => 'required|date',
                'location' => 'required|string',
                'client_id' => 'nullable|exists:clients,id',
                'contract_id' => 'nullable|exists:contracts,id',
                'description' => 'nullable|string',
            ]);

            $checkin = CalendarCheckin::create($validated);
            $checkin->load(['client', 'contract']);

            return $this->success($checkin, 'Check-in creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione del check-in: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a new check-out event
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeCheckout(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'checkout_date' => 'required|date',
                'location' => 'required|string',
                'client_id' => 'nullable|exists:clients,id',
                'contract_id' => 'nullable|exists:contracts,id',
                'description' => 'nullable|string',
            ]);

            $checkout = CalendarCheckout::create($validated);
            $checkout->load(['client', 'contract']);

            return $this->success($checkout, 'Check-out creato con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione del check-out: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a new report event
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'property_id' => 'nullable|exists:properties,id',
                'room_id' => 'nullable|exists:rooms,id',
                'activity_name' => 'required|string',
                'urgency_type' => 'required|in:urgent,medium,not_urgent',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'responsible' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $report = CalendarReport::create($validated);
            $report->load(['property', 'room']);

            return $this->success($report, 'Segnalazione creata con successo', 201);
        } catch (\Exception $e) {
            return $this->error('Errore nella creazione della segnalazione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a maintenance event
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateMaintenance(Request $request, int $id): JsonResponse
    {
        try {
            $maintenance = CalendarMaintenance::findOrFail($id);

            $validated = $request->validate([
                'property_id' => 'nullable|exists:properties,id',
                'room_id' => 'nullable|exists:rooms,id',
                'maintenance_name' => 'required|string',
                'urgency_type' => 'required|in:urgent,medium,not_urgent',
                'maintenance_type' => 'required|in:ordinary,extraordinary',
                'report_date' => 'nullable|date',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'supplier_id' => 'nullable|exists:suppliers,id',
                'report_source' => 'nullable|string',
                'client_id' => 'nullable|exists:clients,id',
                'responsible' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $maintenance->update($validated);
            $maintenance->load(['property', 'room', 'client', 'supplier']);

            return $this->success($maintenance, 'Manutenzione aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della manutenzione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a check-in event
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateCheckin(Request $request, int $id): JsonResponse
    {
        try {
            $checkin = CalendarCheckin::findOrFail($id);

            $validated = $request->validate([
                'checkin_date' => 'required|date',
                'location' => 'required|string',
                'client_id' => 'nullable|exists:clients,id',
                'contract_id' => 'nullable|exists:contracts,id',
                'description' => 'nullable|string',
            ]);

            $checkin->update($validated);
            $checkin->load(['client', 'contract']);

            return $this->success($checkin, 'Check-in aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento del check-in: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a check-out event
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateCheckout(Request $request, int $id): JsonResponse
    {
        try {
            $checkout = CalendarCheckout::findOrFail($id);

            $validated = $request->validate([
                'checkout_date' => 'required|date',
                'location' => 'required|string',
                'client_id' => 'nullable|exists:clients,id',
                'contract_id' => 'nullable|exists:contracts,id',
                'description' => 'nullable|string',
            ]);

            $checkout->update($validated);
            $checkout->load(['client', 'contract']);

            return $this->success($checkout, 'Check-out aggiornato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento del check-out: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a report event
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateReport(Request $request, int $id): JsonResponse
    {
        try {
            $report = CalendarReport::findOrFail($id);

            $validated = $request->validate([
                'property_id' => 'nullable|exists:properties,id',
                'room_id' => 'nullable|exists:rooms,id',
                'activity_name' => 'required|string',
                'urgency_type' => 'required|in:urgent,medium,not_urgent',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'responsible' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $report->update($validated);
            $report->load(['property', 'room']);

            return $this->success($report, 'Segnalazione aggiornata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'aggiornamento della segnalazione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a maintenance event
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deleteMaintenance(int $id): JsonResponse
    {
        try {
            $maintenance = CalendarMaintenance::findOrFail($id);
            $maintenance->delete();

            return $this->success(null, 'Manutenzione eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della manutenzione: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a check-in event
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deleteCheckin(int $id): JsonResponse
    {
        try {
            $checkin = CalendarCheckin::findOrFail($id);
            $checkin->delete();

            return $this->success(null, 'Check-in eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del check-in: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a check-out event
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deleteCheckout(int $id): JsonResponse
    {
        try {
            $checkout = CalendarCheckout::findOrFail($id);
            $checkout->delete();

            return $this->success(null, 'Check-out eliminato con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione del check-out: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a report event
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deleteReport(int $id): JsonResponse
    {
        try {
            $report = CalendarReport::findOrFail($id);
            $report->delete();

            return $this->success(null, 'Segnalazione eliminata con successo');
        } catch (\Exception $e) {
            return $this->error('Errore nell\'eliminazione della segnalazione: ' . $e->getMessage(), 500);
        }
    }
}
