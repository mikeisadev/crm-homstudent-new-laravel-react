import { useState, useEffect } from 'react';
import ClientList from '../components/clients/ClientList';
import ClientDetails from '../components/clients/ClientDetails';
import ClientRelatedData from '../components/clients/ClientRelatedData';
import ClientFormModal from '../components/clients/ClientFormModal';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';

/**
 * Clients Page
 * Main page with 3-column layout for client management
 *
 * Layout:
 * - Column 1 (30%): ClientList - searchable/filterable list
 * - Column 2 (35%): ClientDetails - accordion sections with client info
 * - Column 3 (35%): ClientRelatedData - tabs for contracts/proposals/documents
 *
 * @returns {JSX.Element}
 */
export default function Clients() {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
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
    const [filterType, setFilterType] = useState('all'); // 'all', 'private', 'business'

    // Debounce search to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    /**
     * Fetch clients when page, search, or filters change
     */
    useEffect(() => {
        fetchClients(currentPage, debouncedSearchTerm, filterType);
    }, [currentPage, debouncedSearchTerm, filterType]);

    /**
     * Fetch clients from API with pagination and filters
     *
     * @param {number} page - Page number to fetch
     * @param {string} search - Search term
     * @param {string} type - Filter by type ('all', 'private', 'business')
     */
    const fetchClients = async (page = 1, search = '', type = 'all') => {
        setLoading(true);
        setError(null);
        try {
            // Build query parameters
            const params = {
                page,
            };

            // Add search parameter if provided
            if (search && search.trim()) {
                params.search = search.trim();
            }

            // Add type filter if not 'all'
            if (type && type !== 'all') {
                params.type = type;
            }

            const response = await api.get('/clients', { params });

            if (response.data.success) {
                const responseData = response.data.data;

                // Extract clients array and pagination metadata
                if (responseData && typeof responseData === 'object') {
                    // Set clients
                    if (Array.isArray(responseData.clients)) {
                        setClients(responseData.clients);
                    } else {
                        setClients([]);
                        console.warn('Unexpected clients format:', responseData);
                    }

                    // Set pagination metadata
                    if (responseData.pagination) {
                        setPagination(responseData.pagination);
                    }
                } else {
                    setClients([]);
                    console.warn('Unexpected response format:', responseData);
                }
            } else {
                throw new Error(response.data.message || 'Errore nel caricamento dei clienti');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Errore nel caricamento dei clienti');
            console.error('Error fetching clients:', err);
            setClients([]);
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
     * Resets to page 1 when search changes
     */
    const handleSearchChange = (search) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page on search
    };

    /**
     * Handle filter type change
     * Resets to page 1 when filter changes
     */
    const handleFilterChange = (type) => {
        setFilterType(type);
        setCurrentPage(1); // Reset to first page on filter change
    };

    /**
     * Get selected client object
     */
    const getSelectedClient = () => {
        if (!Array.isArray(clients)) {
            console.error('clients is not an array:', clients);
            return null;
        }
        return clients.find((c) => c.id === selectedClientId) || null;
    };

    /**
     * Handle client selection from list
     */
    const handleClientSelect = (clientId) => {
        setSelectedClientId(clientId);
    };

    /**
     * Handle new client button
     */
    const handleNewClient = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    /**
     * Handle edit client button
     */
    const handleEditClient = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    /**
     * Handle delete client button
     */
    const handleDeleteClient = async (clientId) => {
        const client = clients.find((c) => c.id === clientId);
        const clientName = client.full_name ||
            (client.type === 'business'
                ? client.company_name
                : `${client.first_name || ''} ${client.last_name || ''}`.trim()) ||
            'Cliente';

        if (
            !window.confirm(
                `Sei sicuro di voler eliminare il cliente "${clientName}"?\n\nQuesta azione non può essere annullata.`,
            )
        ) {
            return;
        }

        try {
            const response = await api.delete(`/clients/${clientId}`);

            if (response.data.success) {
                // Remove from local state
                setClients(clients.filter((c) => c.id !== clientId));

                // Clear selection if deleted client was selected
                if (selectedClientId === clientId) {
                    setSelectedClientId(null);
                }

                // Show success message (you can replace with a toast notification)
                alert('Cliente eliminato con successo');
            } else {
                throw new Error(response.data.message || 'Errore durante l\'eliminazione del cliente');
            }
        } catch (err) {
            console.error('Error deleting client:', err);
            alert('Errore durante l\'eliminazione del cliente: ' + (err.response?.data?.message || err.message));
        }
    };

    /**
     * Handle save client (create or update)
     */
    const handleSaveClient = async (clientData) => {
        const isUpdate = !!editingClient;

        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/clients/${editingClient.id}`, clientData);
            } else {
                response = await api.post('/clients', clientData);
            }

            if (response.data.success) {
                const savedClient = response.data.data;

                if (isUpdate) {
                    // Update in local state
                    setClients(clients.map((c) => (c.id === savedClient.id ? savedClient : c)));
                } else {
                    // Add to local state
                    setClients([...clients, savedClient]);
                    // Select newly created client
                    setSelectedClientId(savedClient.id);
                }

                setIsModalOpen(false);
                setEditingClient(null);

                // Show success message
                alert(isUpdate ? 'Cliente aggiornato con successo' : 'Cliente creato con successo');
            } else {
                throw new Error(response.data.message || 'Errore durante il salvataggio');
            }
        } catch (err) {
            console.error('Error saving client:', err);
            alert('Errore durante il salvataggio: ' + (err.response?.data?.message || err.message));
            throw err; // Re-throw to prevent modal from closing
        }
    };

    /**
     * Handle update client from details view
     */
    const handleUpdateClient = async (clientData) => {
        try {
            const response = await api.put(`/clients/${clientData.id}`, clientData);

            if (response.data.success) {
                const updatedClient = response.data.data;

                // Update in local state
                setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));

                alert('Cliente aggiornato con successo');
            } else {
                throw new Error(response.data.message || 'Errore durante l\'aggiornamento del cliente');
            }
        } catch (err) {
            console.error('Error updating client:', err);
            alert('Errore durante l\'aggiornamento: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestione Clienti</h1>
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
                    {/* Column 1: Client List (30%) */}
                    <div className="col-span-3 border-r border-gray-200 overflow-hidden">
                        <ClientList
                            clients={clients}
                            selectedClientId={selectedClientId}
                            onClientSelect={handleClientSelect}
                            onNewClient={handleNewClient}
                            loading={loading}
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filterType={filterType}
                            onFilterChange={handleFilterChange}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* Column 2: Client Details (35%) */}
                    <div className="col-span-4 border-r border-gray-200 overflow-hidden">
                        <ClientDetails
                            client={getSelectedClient()}
                            onEdit={() => handleEditClient(getSelectedClient())}
                            onDelete={handleDeleteClient}
                            onUpdate={handleUpdateClient}
                        />
                    </div>

                    {/* Column 3: Related Data (35%) */}
                    <div className="col-span-5 overflow-hidden">
                        <ClientRelatedData client={getSelectedClient()} />
                    </div>
                </div>
            </div>

            {/* Client Form Modal */}
            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingClient(null);
                }}
                onSave={handleSaveClient}
                client={editingClient}
            />
        </div>
    );
}
