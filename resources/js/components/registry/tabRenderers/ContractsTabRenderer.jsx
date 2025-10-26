import { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Generic Contracts Tab Renderer
 *
 * Displays contracts related to any entity (client, property, room, condominium)
 * Supports different property types and contract states
 *
 * @param {number} entityId - ID of the entity
 * @param {string} endpoint - API endpoint to fetch contracts (e.g., '/clients/1/contracts')
 * @param {object} rendererProps - Additional props from config
 * @returns {JSX.Element}
 */
export default function ContractsTabRenderer({ entityId, endpoint, rendererProps = {} }) {
    const [contracts, setContracts] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    /**
     * Fetch contracts when entity changes
     */
    useEffect(() => {
        if (!entityId) {
            setContracts([]);
            return;
        }

        fetchContracts();
    }, [entityId, endpoint]);

    /**
     * Fetch all contracts for entity
     */
    const fetchContracts = async () => {
        setIsLoadingData(true);
        try {
            const response = await api.get(endpoint);

            // Extract data from API response (using success wrapper)
            setContracts(response.data.success ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setContracts([]);
        } finally {
            setIsLoadingData(false);
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    /**
     * Get property name based on property type
     */
    const getPropertyName = (contract) => {
        if (contract.property_type === 'condominium' && contract.condominium) {
            return contract.condominium.name || 'Condominio';
        } else if (contract.property_type === 'property' && contract.property) {
            return contract.property.name || contract.property.address || 'Proprietà';
        } else if (contract.property_type === 'room' && contract.room) {
            return `Camera ${contract.room.room_number || contract.room.id}`;
        }
        return 'Immobile non specificato';
    };

    /**
     * Get client name
     */
    const getClientName = (contract) => {
        if (!contract.client) return 'Cliente non specificato';

        if (contract.client.type === 'business') {
            return contract.client.company_name || 'Azienda';
        }

        const firstName = contract.client.first_name || '';
        const lastName = contract.client.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'Privato';
    };

    /**
     * Get status badge classes
     */
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'ended':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    /**
     * Render empty state
     */
    const renderEmptyState = () => {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <i className="material-icons text-6xl mb-4">description</i>
                <p className="text-lg">Nessun contratto trovato</p>
            </div>
        );
    };

    // Loading state
    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Empty state
    if (contracts.length === 0) {
        return renderEmptyState();
    }

    return (
        <div className="flex flex-col h-full">
            {/* Contracts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                {contracts.map((contract) => {
                    const propertyName = getPropertyName(contract);
                    const clientName = getClientName(contract);

                    return (
                        <div
                            key={contract.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                        Contratto #{contract.contract_number || contract.id}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {propertyName}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Cliente: {clientName}
                                    </div>
                                    {contract.monthly_rent && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Canone: €{parseFloat(contract.monthly_rent).toFixed(2)}/mese
                                        </div>
                                    )}
                                    <div className="text-sm text-blue-600 mt-1">
                                        {contract.start_date && `Dal ${formatDate(contract.start_date)}`}
                                        {contract.end_date && ` al ${formatDate(contract.end_date)}`}
                                    </div>
                                </div>
                                <div className="ml-4 flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(contract.status)}`}
                                    >
                                        {contract.status || 'draft'}
                                    </span>
                                    {contract.contract_type && (
                                        <span className="text-xs text-gray-500">
                                            {contract.contract_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Results count */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                <span>
                    {contracts.length}{' '}
                    {contracts.length === 1 ? 'contratto' : 'contratti'}
                </span>
            </div>
        </div>
    );
}
