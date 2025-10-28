import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Button from '../../ui/Button';

/**
 * Equipment Tab Renderer
 * Multi-select interface for room equipment
 * Equipment items are predefined in the database
 */
const EquipmentTabRenderer = ({ entityId, entityType = 'room' }) => {
    const [allEquipment, setAllEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, [entityId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all available equipment items
            // IMPORTANT: Using per_page=9999 to get ALL equipment for selection
            const equipmentResponse = await api.get('/equipment?per_page=9999');

            // Fetch room's current equipment
            const roomEquipmentResponse = await api.get(`/rooms/${entityId}/equipment`);

            setAllEquipment(equipmentResponse.data.data || []);
            setSelectedEquipment(roomEquipmentResponse.data.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching equipment data:', err);
            setError('Errore nel caricamento delle dotazioni');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEquipment = (equipmentId) => {
        setSelectedEquipment(prev => {
            const isSelected = prev.some(eq => eq.id === equipmentId);

            if (isSelected) {
                return prev.filter(eq => eq.id !== equipmentId);
            } else {
                const equipment = allEquipment.find(eq => eq.id === equipmentId);
                return [...prev, equipment];
            }
        });

        // Clear success message when user makes changes
        setSuccessMessage(null);
    };

    const isSelected = (equipmentId) => {
        return selectedEquipment.some(eq => eq.id === equipmentId);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            const equipmentIds = selectedEquipment.map(eq => eq.id);

            await api.post(`/rooms/${entityId}/equipment/sync`, {
                equipment_ids: equipmentIds
            });

            setSuccessMessage('Dotazioni salvate con successo');

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            console.error('Error saving equipment:', err);
            setError(err.response?.data?.message || 'Errore nel salvataggio delle dotazioni');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento dotazioni...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header with Save Button */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Seleziona le dotazioni presenti in questa stanza
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                >
                    <i className="material-icons text-sm">save</i>
                    {saving ? 'Salvataggio...' : 'Salva dotazioni'}
                </Button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center gap-2">
                    <i className="material-icons text-sm">check_circle</i>
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {error}
                </div>
            )}

            {/* Equipment Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allEquipment.map((equipment) => {
                        const selected = isSelected(equipment.id);

                        return (
                            <button
                                key={equipment.id}
                                onClick={() => handleToggleEquipment(equipment.id)}
                                className={`
                                    relative p-4 rounded-lg border-2 text-left transition-all
                                    ${selected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }
                                `}
                            >
                                {/* Checkbox */}
                                <div className="absolute top-2 right-2">
                                    <div className={`
                                        w-5 h-5 rounded border-2 flex items-center justify-center
                                        ${selected
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'bg-white border-gray-300'
                                        }
                                    `}>
                                        {selected && (
                                            <i className="material-icons text-white text-sm">check</i>
                                        )}
                                    </div>
                                </div>

                                {/* Equipment Icon */}
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                                    ${selected ? 'bg-blue-100' : 'bg-gray-100'}
                                `}>
                                    <i className={`material-icons ${selected ? 'text-blue-600' : 'text-gray-600'}`}>
                                        inventory_2
                                    </i>
                                </div>

                                {/* Equipment Name */}
                                <div className={`text-sm font-medium ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {equipment.name}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        {selectedEquipment.length} di {allEquipment.length} dotazioni selezionate
                    </span>
                    {selectedEquipment.length > 0 && (
                        <button
                            onClick={() => setSelectedEquipment([])}
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            Deseleziona tutto
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EquipmentTabRenderer;
