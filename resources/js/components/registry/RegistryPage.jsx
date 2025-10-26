import { useState, useEffect } from 'react';
import api from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import RegistryList from './RegistryList';
import RegistryDetails from './RegistryDetails';
import RegistryRelatedData from './RegistryRelatedData';
import RegistryFormModal from './RegistryFormModal';

// Import existing client components for backward compatibility
import ClientDetails from '../clients/ClientDetails';
import ClientRelatedData from '../clients/ClientRelatedData';
import ClientFormModal from '../clients/ClientFormModal';

/**
 * Generic Registry Page Component
 *
 * Configuration-driven page that handles all registry data types:
 * - Clients
 * - Rooms
 * - Properties
 * - Condominiums
 *
 * Supports backward compatibility with existing specialized components.
 *
 * @param {object} config - Registry configuration object
 * @returns {JSX.Element}
 */
export default function RegistryPage({ config }) {
    // Entity state
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
        from: 0,
        to: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(() => {
        // Initialize filters with default values
        const initialFilters = {};
        config.list.filters?.forEach(filter => {
            initialFilters[filter.key] = filter.defaultValue || '';
        });
        return initialFilters;
    });

    // Debounce search to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    /**
     * Fetch items when page, search, or filters change
     */
    useEffect(() => {
        fetchItems(currentPage, debouncedSearchTerm, filters);
    }, [currentPage, debouncedSearchTerm, filters]);

    /**
     * Fetch items from API with pagination and filters
     */
    const fetchItems = async (page = 1, search = '', filterValues = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Build query parameters
            const params = { page };

            // Add search parameter if provided
            if (search && search.trim()) {
                params.search = search.trim();
            }

            // Add filter parameters (exclude default values)
            Object.entries(filterValues).forEach(([key, value]) => {
                const filterConfig = config.list.filters?.find(f => f.key === key);
                if (value && value !== filterConfig?.defaultValue) {
                    params[key] = value;
                }
            });

            const response = await api.get(config.apiEndpoint, { params });

            if (response.data.success) {
                const responseData = response.data.data;

                // Extract items array and pagination metadata
                if (responseData && typeof responseData === 'object') {
                    // Check for paginated response
                    if (Array.isArray(responseData[config.entityPlural])) {
                        setItems(responseData[config.entityPlural]);
                    } else if (Array.isArray(responseData.data)) {
                        setItems(responseData.data);
                    } else if (Array.isArray(responseData)) {
                        setItems(responseData);
                    } else {
                        setItems([]);
                        console.warn('Unexpected items format:', responseData);
                    }

                    // Set pagination metadata if available
                    if (responseData.pagination) {
                        setPagination(responseData.pagination);
                    }
                } else {
                    setItems([]);
                    console.warn('Unexpected response format:', responseData);
                }
            } else {
                throw new Error(response.data.message || `Errore nel caricamento dei ${config.title.toLowerCase()}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || `Errore nel caricamento dei ${config.title.toLowerCase()}`);
            console.error(`Error fetching ${config.entityPlural}:`, err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle page change
     */
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    /**
     * Handle search term change
     */
    const handleSearchChange = (search) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page on search
    };

    /**
     * Handle filter change
     */
    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    /**
     * Get selected item object
     */
    const getSelectedItem = () => {
        if (!Array.isArray(items)) {
            console.error('items is not an array:', items);
            return null;
        }
        return items.find((item) => item.id === selectedItemId) || null;
    };

    /**
     * Handle item selection from list
     */
    const handleItemSelect = (itemId) => {
        setSelectedItemId(itemId);
    };

    /**
     * Handle new item button
     */
    const handleNewItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    /**
     * Handle edit item button
     */
    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    /**
     * Handle delete item button
     */
    const handleDeleteItem = async (itemId) => {
        const item = items.find((i) => i.id === itemId);
        const itemName = config.list.getPrimaryText(item);

        if (
            !window.confirm(
                `Sei sicuro di voler eliminare ${config.titleSingular.toLowerCase()} "${itemName}"?\n\nQuesta azione non può essere annullata.`,
            )
        ) {
            return;
        }

        try {
            const response = await api.delete(`${config.apiEndpoint}/${itemId}`);

            if (response.data.success) {
                // Remove from local state
                setItems(items.filter((i) => i.id !== itemId));

                // Clear selection if deleted item was selected
                if (selectedItemId === itemId) {
                    setSelectedItemId(null);
                }

                alert(`${config.titleSingular} eliminato con successo`);
            } else {
                throw new Error(response.data.message || `Errore durante l'eliminazione del ${config.titleSingular.toLowerCase()}`);
            }
        } catch (err) {
            console.error(`Error deleting ${config.entity}:`, err);
            alert(`Errore durante l'eliminazione: ${err.response?.data?.message || err.message}`);
        }
    };

    /**
     * Handle save item (create or update)
     */
    const handleSaveItem = async (itemData) => {
        const isUpdate = !!editingItem;

        try {
            let response;
            if (isUpdate) {
                response = await api.put(`${config.apiEndpoint}/${editingItem.id}`, itemData);
            } else {
                response = await api.post(config.apiEndpoint, itemData);
            }

            if (response.data.success) {
                const savedItem = response.data.data;

                if (isUpdate) {
                    // Update in local state
                    setItems(items.map((i) => (i.id === savedItem.id ? savedItem : i)));
                } else {
                    // Add to local state
                    setItems([...items, savedItem]);
                    // Select newly created item
                    setSelectedItemId(savedItem.id);
                }

                setIsModalOpen(false);
                setEditingItem(null);

                alert(isUpdate ? `${config.titleSingular} aggiornato con successo` : `${config.titleSingular} creato con successo`);
            } else {
                throw new Error(response.data.message || 'Errore durante il salvataggio');
            }
        } catch (err) {
            console.error(`Error saving ${config.entity}:`, err);
            alert('Errore durante il salvataggio: ' + (err.response?.data?.message || err.message));
            throw err; // Re-throw to prevent modal from closing
        }
    };

    /**
     * Handle update item from details view (inline editing)
     * Supports complex data structures (meta_data, contacts_data, banking_data)
     *
     * @param {number} itemId - ID of item to update
     * @param {object} payload - Update payload (may contain meta_data, contacts_data, banking_data)
     */
    const handleUpdateItem = async (itemId, payload) => {
        try {
            const response = await api.put(`${config.apiEndpoint}/${itemId}`, payload);

            if (response.data.success) {
                const updatedItem = response.data.data;

                // Update in local state
                setItems(items.map((i) => (i.id === updatedItem.id ? updatedItem : i)));

                alert(`${config.titleSingular} aggiornato con successo`);
            } else {
                throw new Error(response.data.message || `Errore durante l'aggiornamento del ${config.titleSingular.toLowerCase()}`);
            }
        } catch (err) {
            console.error(`Error updating ${config.entity}:`, err);
            alert('Errore durante l\'aggiornamento: ' + (err.response?.data?.message || err.message));
            throw err; // Re-throw so RegistryDetails can handle the error
        }
    };

    // Determine which components to use (existing or generic)
    const DetailsComponent = config.useExistingDetailsComponent && config.existingDetailsComponent === 'ClientDetails'
        ? ClientDetails
        : RegistryDetails;

    const RelatedDataComponent = config.useExistingDetailsComponent && config.existingDetailsComponent === 'ClientDetails'
        ? ClientRelatedData
        : RegistryRelatedData;

    const FormModalComponent = config.useExistingFormComponent && config.existingFormComponent === 'ClientFormModal'
        ? ClientFormModal
        : RegistryFormModal;

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestione {config.title}</h1>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
                    <div className="flex items-center">
                        <i className="material-icons text-red-500 mr-3">error</i>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* 3-Column Layout */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-12 gap-0 h-full">
                    {/* Column 1: Item List (30%) */}
                    <div className="col-span-3 border-r border-gray-200 overflow-hidden">
                        <RegistryList
                            config={config}
                            items={items}
                            selectedItemId={selectedItemId}
                            onItemSelect={handleItemSelect}
                            onNewItem={handleNewItem}
                            loading={loading}
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* Column 2: Item Details (35%) */}
                    <div className="col-span-4 border-r border-gray-200 overflow-hidden">
                        <DetailsComponent
                            config={config}
                            item={getSelectedItem()}
                            client={getSelectedItem()} // For backward compatibility with ClientDetails
                            onEdit={() => handleEditItem(getSelectedItem())}
                            onDelete={handleDeleteItem}
                            onUpdate={handleUpdateItem}
                        />
                    </div>

                    {/* Column 3: Related Data (35%) */}
                    <div className="col-span-5 overflow-hidden">
                        <RelatedDataComponent
                            config={config}
                            item={getSelectedItem()}
                            client={getSelectedItem()} // For backward compatibility with ClientRelatedData
                        />
                    </div>
                </div>
            </div>

            {/* Item Form Modal */}
            <FormModalComponent
                config={config}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                }}
                onSave={handleSaveItem}
                item={editingItem}
                client={editingItem} // For backward compatibility with ClientFormModal
            />
        </div>
    );
}
