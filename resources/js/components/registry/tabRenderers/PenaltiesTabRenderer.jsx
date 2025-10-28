import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Penalties Tab Renderer
 * Simple list view of property penalties
 */
const PenaltiesTabRenderer = ({ entityId, endpoint }) => {
    const [penalties, setPenalties] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        fetchPenalties();
    }, [entityId]);

    const fetchPenalties = async () => {
        try {
            setIsLoadingData(true);
            const response = await api.get(endpoint(entityId));
            setPenalties(response.data.data || []);
        } catch (error) {
            console.error('Error fetching penalties:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento sanzioni...</div>
            </div>
        );
    }

    if (penalties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <i className="material-icons text-6xl mb-4">gavel</i>
                <p>Nessuna sanzione presente</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrizione
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Importo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stato
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {penalties.map((penalty) => (
                            <tr key={penalty.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {penalty.date || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {penalty.description || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {penalty.amount ? `€${parseFloat(penalty.amount).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        penalty.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {penalty.status || 'pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PenaltiesTabRenderer;
