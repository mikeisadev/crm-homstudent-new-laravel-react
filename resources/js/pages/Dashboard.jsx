import { useState, useEffect } from 'react';
import api from '../services/api';
import MMBrand from '../components/MMBrand';

/**
 * Dashboard Component
 *
 * Displays comprehensive CRM metrics:
 * - Overview: Entity counts (clients, properties, rooms, etc.)
 * - Financial: Invoices, deposits, penalties
 * - Recent Activity: Last 7 and 30 days
 * - Contracts: Active, completed, pending, expiring
 * - Calendar: Upcoming events (maintenances, check-ins, check-outs)
 */
export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/dashboard/metrics');
            setMetrics(response.data.data);
        } catch (err) {
            console.error('Error fetching dashboard metrics:', err);
            setError('Errore nel caricamento delle metriche. Riprova più tardi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <i className="material-icons text-6xl text-blue-600 animate-spin">refresh</i>
                    <p className="mt-4 text-gray-600 text-lg">Caricamento metriche...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md">
                    <i className="material-icons text-6xl text-red-600">error</i>
                    <p className="mt-4 text-gray-800 text-xl font-semibold">Errore</p>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <button
                        onClick={fetchMetrics}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="w-full">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-bold text-gray-900">Dashboard CRM</h1>
                    <p className="mt-3 text-lg text-gray-600">Panoramica completa delle metriche aziendali</p>
                </div>

                {/* Overview Metrics - Entity Counts */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="material-icons mr-3 text-blue-600 text-4xl">dashboard</i>
                        Panoramica Generale
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        <MetricCard
                            title="Clienti"
                            value={metrics.overview.total_clients}
                            icon="people"
                            color="blue"
                        />
                        <MetricCard
                            title="Immobili"
                            value={metrics.overview.total_properties}
                            icon="home"
                            color="green"
                        />
                        <MetricCard
                            title="Camere"
                            value={metrics.overview.total_rooms}
                            icon="meeting_room"
                            color="purple"
                        />
                        <MetricCard
                            title="Condomini"
                            value={metrics.overview.total_condominiums}
                            icon="apartment"
                            color="indigo"
                        />
                        <MetricCard
                            title="Contratti"
                            value={metrics.overview.total_contracts}
                            icon="description"
                            color="orange"
                        />
                        <MetricCard
                            title="Proposte"
                            value={metrics.overview.total_proposals}
                            icon="request_quote"
                            color="pink"
                        />
                        <MetricCard
                            title="Proprietari"
                            value={metrics.overview.total_owners}
                            icon="person"
                            color="teal"
                        />
                        <MetricCard
                            title="Fornitori"
                            value={metrics.overview.total_suppliers}
                            icon="business"
                            color="cyan"
                        />
                    </div>
                </section>

                {/* Financial Metrics */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="material-icons mr-3 text-green-600 text-4xl">payments</i>
                        Metriche Finanziarie
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FinancialCard
                            title="Fatture"
                            total={metrics.financial.invoices.total}
                            totalAmount={metrics.financial.invoices.total_amount}
                            pendingAmount={metrics.financial.invoices.pending_amount}
                            icon="receipt"
                            color="green"
                        />
                        <FinancialCard
                            title="Depositi"
                            total={metrics.financial.deposits.total}
                            totalAmount={metrics.financial.deposits.total_amount}
                            icon="account_balance"
                            color="blue"
                        />
                        <FinancialCard
                            title="Penali"
                            total={metrics.financial.penalties.total}
                            totalAmount={metrics.financial.penalties.total_amount}
                            icon="warning"
                            color="red"
                        />
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="material-icons mr-3 text-purple-600 text-4xl">trending_up</i>
                        Attività Recente
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ActivityCard
                            title="Ultimi 7 Giorni"
                            newClients={metrics.recent_activity.last_7_days.new_clients}
                            newContracts={metrics.recent_activity.last_7_days.new_contracts}
                            newProposals={metrics.recent_activity.last_7_days.new_proposals}
                            newProperties={metrics.recent_activity.last_7_days.new_properties}
                            color="purple"
                        />
                        <ActivityCard
                            title="Ultimi 30 Giorni"
                            newClients={metrics.recent_activity.last_30_days.new_clients}
                            newContracts={metrics.recent_activity.last_30_days.new_contracts}
                            newProposals={metrics.recent_activity.last_30_days.new_proposals}
                            newProperties={metrics.recent_activity.last_30_days.new_properties}
                            color="indigo"
                        />
                    </div>
                </section>

                {/* Contract Metrics */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="material-icons mr-3 text-orange-600 text-4xl">assignment</i>
                        Stato Contratti
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Attivi"
                            value={metrics.contracts.active}
                            icon="check_circle"
                            color="green"
                        />
                        <MetricCard
                            title="Completati"
                            value={metrics.contracts.completed}
                            icon="task_alt"
                            color="blue"
                        />
                        <MetricCard
                            title="In Attesa"
                            value={metrics.contracts.pending}
                            icon="pending"
                            color="yellow"
                        />
                        <MetricCard
                            title="In Scadenza (30gg)"
                            value={metrics.contracts.expiring_soon}
                            icon="schedule"
                            color="red"
                        />
                    </div>
                </section>

                {/* Calendar Events */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="material-icons mr-3 text-pink-600 text-4xl">event</i>
                        Eventi in Calendario
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CalendarCard
                            title="Prossimi 7 Giorni"
                            maintenances={metrics.calendar.next_7_days.maintenances}
                            checkins={metrics.calendar.next_7_days.checkins}
                            checkouts={metrics.calendar.next_7_days.checkouts}
                            color="pink"
                        />
                        <CalendarCard
                            title="Prossimi 30 Giorni"
                            maintenances={metrics.calendar.next_30_days.maintenances}
                            checkins={metrics.calendar.next_30_days.checkins}
                            checkouts={metrics.calendar.next_30_days.checkouts}
                            color="rose"
                        />
                    </div>
                </section>
            </div>
            <MMBrand />
        </div>
    );
}

/**
 * Simple metric card for displaying a single value
 */
function MetricCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 border-blue-200',
        green: 'text-green-600 bg-green-50 border-green-200',
        purple: 'text-purple-600 bg-purple-50 border-purple-200',
        orange: 'text-orange-600 bg-orange-50 border-orange-200',
        pink: 'text-pink-600 bg-pink-50 border-pink-200',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        teal: 'text-teal-600 bg-teal-50 border-teal-200',
        cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
        red: 'text-red-600 bg-red-50 border-red-200',
        yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-base text-gray-600 font-semibold mb-2 uppercase tracking-wide">{title}</p>
                    <p className={`text-4xl font-bold ${colorClasses[color].split(' ')[0]}`}>
                        {value.toLocaleString()}
                    </p>
                </div>
                <div className={`p-4 rounded-full ${colorClasses[color].split(' ')[1]}`}>
                    <i className={`material-icons text-5xl ${colorClasses[color].split(' ')[0]}`}>{icon}</i>
                </div>
            </div>
        </div>
    );
}

/**
 * Financial card showing total count and amounts
 */
function FinancialCard({ title, total, totalAmount, pendingAmount, icon, color }) {
    const colorClasses = {
        green: 'text-green-600 bg-green-50 border-green-200',
        blue: 'text-blue-600 bg-blue-50 border-blue-200',
        red: 'text-red-600 bg-red-50 border-red-200',
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
                <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[1]} mr-4`}>
                    <i className={`material-icons text-4xl ${colorClasses[color].split(' ')[0]}`}>{icon}</i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 font-medium">Totale:</span>
                    <span className="text-2xl font-bold text-gray-900">{total}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 font-medium">Importo totale:</span>
                    <span className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
                        €{totalAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                {pendingAmount !== undefined && (
                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                        <span className="text-base text-gray-600 font-medium">In attesa:</span>
                        <span className="text-2xl font-bold text-orange-600">
                            €{pendingAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Activity card showing recent activity metrics
 */
function ActivityCard({ title, newClients, newContracts, newProposals, newProperties, color }) {
    const colorClasses = {
        purple: 'text-purple-600 bg-purple-50 border-purple-200',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className={`text-2xl font-bold mb-6 ${colorClasses[color].split(' ')[0]} uppercase tracking-wide`}>{title}</h3>
            <div className="space-y-5">
                <ActivityRow icon="people" label="Nuovi Clienti" value={newClients} />
                <ActivityRow icon="description" label="Nuovi Contratti" value={newContracts} />
                <ActivityRow icon="request_quote" label="Nuove Proposte" value={newProposals} />
                <ActivityRow icon="home" label="Nuovi Immobili" value={newProperties} />
            </div>
        </div>
    );
}

/**
 * Activity row for displaying a single activity metric
 */
function ActivityRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center">
                <i className="material-icons text-gray-500 text-xl mr-3">{icon}</i>
                <span className="text-base text-gray-700 font-medium">{label}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
    );
}

/**
 * Calendar card showing upcoming events
 */
function CalendarCard({ title, maintenances, checkins, checkouts, color }) {
    const colorClasses = {
        pink: 'text-pink-600 bg-pink-50 border-pink-200',
        rose: 'text-rose-600 bg-rose-50 border-rose-200',
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className={`text-2xl font-bold mb-6 ${colorClasses[color].split(' ')[0]} uppercase tracking-wide`}>{title}</h3>
            <div className="space-y-5">
                <CalendarRow icon="build" label="Manutenzioni" value={maintenances} color="blue" />
                <CalendarRow icon="login" label="Check-in" value={checkins} color="green" />
                <CalendarRow icon="logout" label="Check-out" value={checkouts} color="red" />
            </div>
        </div>
    );
}

/**
 * Calendar row for displaying a single event type
 */
function CalendarRow({ icon, label, value, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
    };

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center">
                <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[1]} mr-3`}>
                    <i className={`material-icons text-xl ${colorClasses[color].split(' ')[0]}`}>{icon}</i>
                </div>
                <span className="text-base text-gray-700 font-medium">{label}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
    );
}
