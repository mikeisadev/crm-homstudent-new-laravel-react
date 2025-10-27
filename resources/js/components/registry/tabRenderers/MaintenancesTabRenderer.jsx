import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Maintenances Tab Renderer
 * Displays maintenances related to a specific room
 * Data comes from calendar_maintenances table
 */
const MaintenancesTabRenderer = ({ entityId, entityType = 'room' }) => {
    const [maintenances, setMaintenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMaintenances();
    }, [entityId]);

    const fetchMaintenances = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/rooms/${entityId}/maintenances`);
            const data = response.data.data || [];
            // Ensure data is an array (defensive programming)
            setMaintenances(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching maintenances:', err);
            setError('Errore nel caricamento delle manutenzioni');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-gray-100 text-gray-800',
        };

        const statusLabels = {
            'pending': 'In attesa',
            'in_progress': 'In corso',
            'completed': 'Completata',
            'cancelled': 'Annullata',
        };

        const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
        const label = statusLabels[status] || status;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento manutenzioni...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    const isEmpty = maintenances.length === 0;

    return (
        <div className="flex flex-col h-full">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <i className="material-icons text-6xl mb-4">build</i>
                        <p className="text-lg">Nessuna manutenzione presente</p>
                        <p className="text-sm mt-2">Le manutenzioni per questa stanza appariranno qui</p>
                        <p className="text-xs mt-2 text-gray-500">
                            Aggiungi manutenzioni dalla sezione <strong>Calendario</strong>
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {maintenances.map((maintenance) => (
                            <div
                                key={maintenance.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Title and Status */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-medium text-gray-900">
                                                {maintenance.title || 'Manutenzione senza titolo'}
                                            </h3>
                                            {maintenance.status && getStatusBadge(maintenance.status)}
                                        </div>

                                        {/* Description */}
                                        {maintenance.description && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                {maintenance.description}
                                            </p>
                                        )}

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Data inizio:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {formatDate(maintenance.start_date)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Data fine:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {formatDate(maintenance.end_date)}
                                                </span>
                                            </div>
                                            {maintenance.cost && (
                                                <div>
                                                    <span className="text-gray-500">Costo:</span>
                                                    <span className="ml-2 text-gray-900">
                                                        €{parseFloat(maintenance.cost).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {maintenance.technician_name && (
                                                <div>
                                                    <span className="text-gray-500">Tecnico:</span>
                                                    <span className="ml-2 text-gray-900">
                                                        {maintenance.technician_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className="ml-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                            <i className="material-icons text-blue-600">build</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {!isEmpty && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                    <span>
                        {maintenances.length} {maintenances.length === 1 ? 'manutenzione' : 'manutenzioni'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MaintenancesTabRenderer;
