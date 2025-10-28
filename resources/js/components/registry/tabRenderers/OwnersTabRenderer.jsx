import { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Owners Tab Renderer
 *
 * Displays owners related to a property with their ownership percentages
 *
 * @param {number} entityId - ID of the property
 * @param {string} endpoint - API endpoint to fetch owners (e.g., '/properties/1/owners')
 * @param {object} rendererProps - Additional props from config
 * @returns {JSX.Element}
 */
export default function OwnersTabRenderer({ entityId, endpoint, rendererProps = {} }) {
    const [owners, setOwners] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    /**
     * Fetch owners when entity changes
     */
    useEffect(() => {
        if (!entityId) {
            setOwners([]);
            return;
        }

        fetchOwners();
    }, [entityId, endpoint]);

    /**
     * Fetch all owners for the property
     */
    const fetchOwners = async () => {
        setIsLoadingData(true);
        try {
            const response = await api.get(endpoint);

            // Extract data from API response (using success wrapper)
            const data = response.data.success ? response.data.data : [];
            // Ensure data is an array
            setOwners(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching owners:', error);
            setOwners([]);
        } finally {
            setIsLoadingData(false);
        }
    };

    /**
     * Get owner display name
     */
    const getOwnerName = (owner) => {
        if (owner.type === 'business' && owner.company_name) {
            return owner.company_name;
        }
        const fullName = `${owner.first_name || ''} ${owner.last_name || ''}`.trim();
        return fullName || 'Proprietario senza nome';
    };

    /**
     * Loading state
     */
    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento proprietari...</div>
            </div>
        );
    }

    /**
     * Empty state
     */
    if (owners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Nessun proprietario associato a questo immobile</p>
            </div>
        );
    }

    /**
     * Owners list
     */
    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Proprietari ({owners.length})
            </h3>

            <div className="space-y-4">
                {owners.map((owner) => (
                    <div
                        key={owner.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {/* Owner name */}
                                <h4 className="text-base font-semibold text-gray-900">
                                    {getOwnerName(owner)}
                                    {owner.pivot?.is_primary && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Principale
                                        </span>
                                    )}
                                </h4>

                                {/* Owner details */}
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    {owner.type === 'business' && owner.vat_number && (
                                        <p><span className="font-medium">P.IVA:</span> {owner.vat_number}</p>
                                    )}
                                    {owner.tax_code && (
                                        <p><span className="font-medium">CF:</span> {owner.tax_code}</p>
                                    )}
                                    {owner.email && (
                                        <p><span className="font-medium">Email:</span> {owner.email}</p>
                                    )}
                                    {owner.phone && (
                                        <p><span className="font-medium">Tel:</span> {owner.phone}</p>
                                    )}
                                    {owner.address && (
                                        <p><span className="font-medium">Indirizzo:</span> {owner.address}, {owner.city}</p>
                                    )}
                                </div>
                            </div>

                            {/* Ownership percentage */}
                            {owner.pivot?.ownership_percentage && (
                                <div className="ml-4 text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {owner.pivot.ownership_percentage}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Quota
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
