import { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Generic Proposals Tab Renderer
 *
 * Displays proposals related to any entity (client, property, room)
 * Supports different property types and proposal states
 *
 * @param {number} entityId - ID of the entity
 * @param {string} endpoint - API endpoint to fetch proposals (e.g., '/clients/1/proposals')
 * @param {object} rendererProps - Additional props from config
 * @returns {JSX.Element}
 */
export default function ProposalsTabRenderer({ entityId, endpoint, rendererProps = {} }) {
    const [proposals, setProposals] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    /**
     * Fetch proposals when entity changes
     */
    useEffect(() => {
        if (!entityId) {
            setProposals([]);
            return;
        }

        fetchProposals();
    }, [entityId, endpoint]);

    /**
     * Fetch all proposals for entity
     */
    const fetchProposals = async () => {
        setIsLoadingData(true);
        try {
            const response = await api.get(endpoint);

            // Extract data from API response (using success wrapper)
            setProposals(response.data.success ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching proposals:', error);
            setProposals([]);
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
    const getPropertyName = (proposal) => {
        if (proposal.property_type === 'property' && proposal.property) {
            return proposal.property.name || proposal.property.address || 'Proprietà';
        } else if (proposal.property_type === 'room' && proposal.room) {
            return `Camera ${proposal.room.room_number || proposal.room.id}`;
        }
        return 'Immobile non specificato';
    };

    /**
     * Get client name
     */
    const getClientName = (proposal) => {
        if (!proposal.client) return 'Cliente non specificato';

        if (proposal.client.type === 'business') {
            return proposal.client.company_name || 'Azienda';
        }

        const firstName = proposal.client.first_name || '';
        const lastName = proposal.client.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'Privato';
    };

    /**
     * Get status badge classes
     */
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
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
                <i className="material-icons text-6xl mb-4">assignment</i>
                <p className="text-lg">Nessuna proposta trovata</p>
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
    if (proposals.length === 0) {
        return renderEmptyState();
    }

    return (
        <div className="flex flex-col h-full">
            {/* Proposals List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                {proposals.map((proposal) => {
                    const propertyName = getPropertyName(proposal);
                    const clientName = getClientName(proposal);

                    return (
                        <div
                            key={proposal.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                        Proposta #{proposal.proposal_number || proposal.id}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {propertyName}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Cliente: {clientName}
                                    </div>
                                    {proposal.monthly_rent && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Canone proposto: €{parseFloat(proposal.monthly_rent).toFixed(2)}/mese
                                        </div>
                                    )}
                                    {proposal.proposed_start_date && (
                                        <div className="text-sm text-blue-600 mt-1">
                                            Inizio previsto: {formatDate(proposal.proposed_start_date)}
                                        </div>
                                    )}
                                    {proposal.notes && (
                                        <div className="text-sm text-gray-500 mt-2 line-clamp-2">
                                            {proposal.notes}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(proposal.status)}`}
                                    >
                                        {proposal.status || 'draft'}
                                    </span>
                                    {proposal.proposal_type && (
                                        <span className="text-xs text-gray-500">
                                            {proposal.proposal_type}
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
                    {proposals.length}{' '}
                    {proposals.length === 1 ? 'proposta' : 'proposte'}
                </span>
            </div>
        </div>
    );
}
