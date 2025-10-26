import Button from '../ui/Button';
import Input from '../ui/Input';
import Pagination from '../ui/Pagination';

/**
 * ClientList Component
 * Left column - displays searchable/filterable client list with server-side pagination
 *
 * @param {Array} clients - Array of client objects
 * @param {number|null} selectedClientId - ID of selected client
 * @param {function} onClientSelect - Callback when client is selected
 * @param {function} onNewClient - Callback for new client button
 * @param {boolean} loading - Whether clients are loading
 * @param {string} searchTerm - Current search term (controlled by parent)
 * @param {function} onSearchChange - Callback when search changes
 * @param {string} filterType - Current filter type ('all', 'private', 'business')
 * @param {function} onFilterChange - Callback when filter changes
 * @param {object} pagination - Pagination metadata from API
 * @param {function} onPageChange - Callback when page changes
 * @returns {JSX.Element}
 */
export default function ClientList({
    clients,
    selectedClientId,
    onClientSelect,
    onNewClient,
    loading = false,
    searchTerm = '',
    onSearchChange,
    filterType = 'all',
    onFilterChange,
    pagination,
    onPageChange,
}) {

    /**
     * Get display name for client
     */
    const getClientName = (client) => {
        // Use full_name from API if available
        if (client.full_name) {
            return client.full_name;
        }

        // Fallback logic
        if (client.type === 'business') {
            return client.company_name || 'Azienda senza nome';
        }
        const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
        return fullName || 'Cliente senza nome';
    };

    /**
     * Get secondary info for client (address, city)
     */
    const getClientSecondaryInfo = (client) => {
        const parts = [];
        if (client.address) parts.push(client.address);
        if (client.city) parts.push(client.city);
        return parts.join(', ');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Clienti</h2>
                    <Button
                        onClick={onNewClient}
                        variant="primary"
                        className="flex items-center gap-2"
                    >
                        <i className="material-icons text-sm">person_add</i>
                        NUOVO
                    </Button>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cerca cliente"
                        className="w-full"
                        disabled={loading}
                    />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-gray-700">Tipo:</span>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="filter"
                            value="private"
                            checked={filterType === 'private'}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="mr-2"
                            disabled={loading}
                        />
                        <span>Clienti privati</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="filter"
                            value="business"
                            checked={filterType === 'business'}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="mr-2"
                            disabled={loading}
                        />
                        <span>Aziende</span>
                    </label>
                    {filterType !== 'all' && (
                        <button
                            onClick={() => onFilterChange('all')}
                            className="text-blue-500 text-xs underline"
                            disabled={loading}
                        >
                            Mostra tutti
                        </button>
                    )}
                </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <i className="material-icons text-4xl mb-2">person_off</i>
                        <p>Nessun cliente trovato</p>
                        {(searchTerm || filterType !== 'all') && (
                            <p className="text-sm mt-2">Prova a modificare i filtri di ricerca</p>
                        )}
                    </div>
                ) : (
                    clients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => onClientSelect(client.id)}
                            className={`border-b border-gray-200 p-4 cursor-pointer transition-colors ${
                                selectedClientId === client.id
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="font-medium">{getClientName(client)}</div>
                            {getClientSecondaryInfo(client) && (
                                <div
                                    className={`text-sm mt-1 ${
                                        selectedClientId === client.id
                                            ? 'text-blue-100'
                                            : 'text-blue-500'
                                    }`}
                                >
                                    {getClientSecondaryInfo(client)}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && pagination && (
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    loading={loading}
                />
            )}
        </div>
    );
}
