import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Management Contracts Tab Renderer
 * Displays management contracts (Contratti di gestione) for a property
 */
const ManagementContractsTabRenderer = ({ entityId, endpoint }) => {
    const [contracts, setContracts] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        fetchContracts();
    }, [entityId]);

    const fetchContracts = async () => {
        try {
            setIsLoadingData(true);
            const response = await api.get(endpoint(entityId));
            setContracts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching management contracts:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento contratti di gestione...</div>
            </div>
        );
    }

    if (contracts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <i className="material-icons text-6xl mb-4">business_center</i>
                <p>Nessun contratto di gestione presente</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Attivo' },
            expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Scaduto' },
            terminated: { bg: 'bg-red-100', text: 'text-red-800', label: 'Terminato' }
        };

        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Numero Contratto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data Inizio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data Fine
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Canone Mensile
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Commissione
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stato
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {contract.contract_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {contract.start_date || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {contract.end_date || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {contract.monthly_fee ? `€${parseFloat(contract.monthly_fee).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {contract.commission_percentage ? `${contract.commission_percentage}%` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {getStatusBadge(contract.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                    <span className="font-semibold">{contracts.length}</span> contratto{contracts.length !== 1 ? 'i' : ''} di gestione
                </p>
            </div>
        </div>
    );
};

export default ManagementContractsTabRenderer;
