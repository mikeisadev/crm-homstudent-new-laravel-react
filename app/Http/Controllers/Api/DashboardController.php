<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Client;
use App\Models\Property;
use App\Models\Room;
use App\Models\Condominium;
use App\Models\Contract;
use App\Models\Proposal;
use App\Models\Owner;
use App\Models\Supplier;
use App\Models\Invoice;
use App\Models\Penalty;
use App\Models\Deposit;
use App\Models\Cancellation;
use App\Models\CalendarMaintenance;
use App\Models\CalendarCheckin;
use App\Models\CalendarCheckout;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * DashboardController
 *
 * Provides comprehensive metrics for the CRM dashboard
 * Including: entity counts, financial data, recent activity, upcoming events
 */
class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get comprehensive dashboard metrics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $metrics = [
                'overview' => $this->getOverviewMetrics(),
                'financial' => $this->getFinancialMetrics(),
                'recent_activity' => $this->getRecentActivity(),
                'contracts' => $this->getContractMetrics(),
                'calendar' => $this->getCalendarMetrics(),
            ];

            return $this->success($metrics, 'Dashboard metrics recuperati con successo');

        } catch (\Exception $e) {
            \Log::error('Dashboard metrics error: ' . $e->getMessage());
            return $this->error('Errore nel recupero delle metriche', 500);
        }
    }

    /**
     * Get overview metrics (entity counts)
     *
     * @return array
     */
    private function getOverviewMetrics()
    {
        return [
            'total_clients' => Client::count(),
            'total_properties' => Property::count(),
            'total_rooms' => Room::count(),
            'total_condominiums' => Condominium::count(),
            'total_contracts' => Contract::count(),
            'total_proposals' => Proposal::count(),
            'total_owners' => Owner::count(),
            'total_suppliers' => Supplier::count(),
        ];
    }

    /**
     * Get financial metrics
     *
     * @return array
     */
    private function getFinancialMetrics()
    {
        $totalInvoices = Invoice::count();
        $totalInvoiceAmount = Invoice::sum('amount') ?? 0;
        $pendingInvoiceAmount = Invoice::whereNull('payment_date')
            ->sum('amount_to_charge') ?? 0;

        $totalDeposits = Deposit::count();
        $totalDepositAmount = Deposit::sum('amount') ?? 0;

        $totalPenalties = Penalty::count();
        $totalPenaltyAmount = Penalty::sum('amount') ?? 0;

        return [
            'invoices' => [
                'total' => $totalInvoices,
                'total_amount' => round($totalInvoiceAmount, 2),
                'pending_amount' => round($pendingInvoiceAmount, 2),
            ],
            'deposits' => [
                'total' => $totalDeposits,
                'total_amount' => round($totalDepositAmount, 2),
            ],
            'penalties' => [
                'total' => $totalPenalties,
                'total_amount' => round($totalPenaltyAmount, 2),
            ],
        ];
    }

    /**
     * Get recent activity (last 7 days and last 30 days)
     *
     * @return array
     */
    private function getRecentActivity()
    {
        $last7Days = Carbon::now()->subDays(7);
        $last30Days = Carbon::now()->subDays(30);

        return [
            'last_7_days' => [
                'new_clients' => Client::where('created_at', '>=', $last7Days)->count(),
                'new_contracts' => Contract::where('created_at', '>=', $last7Days)->count(),
                'new_proposals' => Proposal::where('created_at', '>=', $last7Days)->count(),
                'new_properties' => Property::where('created_at', '>=', $last7Days)->count(),
            ],
            'last_30_days' => [
                'new_clients' => Client::where('created_at', '>=', $last30Days)->count(),
                'new_contracts' => Contract::where('created_at', '>=', $last30Days)->count(),
                'new_proposals' => Proposal::where('created_at', '>=', $last30Days)->count(),
                'new_properties' => Property::where('created_at', '>=', $last30Days)->count(),
            ],
        ];
    }

    /**
     * Get contract metrics (active, expiring, completed)
     *
     * @return array
     */
    private function getContractMetrics()
    {
        $now = Carbon::now();
        $next30Days = Carbon::now()->addDays(30);

        // Count contracts by status
        $activeContracts = Contract::where('status', 'active')->count();
        $completedContracts = Contract::where('status', 'completed')->count();
        $pendingContracts = Contract::where('status', 'pending')->count();

        // Expiring contracts (end_date within next 30 days and status is active)
        $expiringContracts = Contract::where('status', 'active')
            ->whereBetween('end_date', [$now, $next30Days])
            ->count();

        return [
            'active' => $activeContracts,
            'completed' => $completedContracts,
            'pending' => $pendingContracts,
            'expiring_soon' => $expiringContracts, // Next 30 days
        ];
    }

    /**
     * Get calendar metrics (upcoming events)
     *
     * @return array
     */
    private function getCalendarMetrics()
    {
        $now = Carbon::now();
        $next7Days = Carbon::now()->addDays(7);
        $next30Days = Carbon::now()->addDays(30);

        // Upcoming maintenances (next 7 days)
        $upcomingMaintenances = CalendarMaintenance::whereBetween('start_date', [$now, $next7Days])
            ->count();

        // Upcoming check-ins (next 7 days)
        $upcomingCheckins = CalendarCheckin::whereBetween('checkin_date', [$now, $next7Days])
            ->count();

        // Upcoming check-outs (next 7 days)
        $upcomingCheckouts = CalendarCheckout::whereBetween('checkout_date', [$now, $next7Days])
            ->count();

        // Next 30 days
        $maintenancesNext30 = CalendarMaintenance::whereBetween('start_date', [$now, $next30Days])
            ->count();
        $checkinsNext30 = CalendarCheckin::whereBetween('checkin_date', [$now, $next30Days])
            ->count();
        $checkoutsNext30 = CalendarCheckout::whereBetween('checkout_date', [$now, $next30Days])
            ->count();

        return [
            'next_7_days' => [
                'maintenances' => $upcomingMaintenances,
                'checkins' => $upcomingCheckins,
                'checkouts' => $upcomingCheckouts,
            ],
            'next_30_days' => [
                'maintenances' => $maintenancesNext30,
                'checkins' => $checkinsNext30,
                'checkouts' => $checkoutsNext30,
            ],
        ];
    }
}
