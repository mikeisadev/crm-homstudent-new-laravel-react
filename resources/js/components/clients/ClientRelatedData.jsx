import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import api from '../../services/api';

/**
 * ClientRelatedData Component
 * Right column - displays client related data in tabs
 *
 * @param {Object|null} client - Selected client object
 * @param {boolean} loading - Whether data is loading
 * @returns {JSX.Element}
 */
export default function ClientRelatedData({ client, loading = false }) {
    const [activeTab, setActiveTab] = useState('contracts'); // 'contracts', 'proposals', 'documents'
    const [contracts, setContracts] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    /**
     * Fetch related data when client changes
     */
    useEffect(() => {
        if (!client) {
            setContracts([]);
            setProposals([]);
            setDocuments([]);
            return;
        }

        fetchRelatedData();
    }, [client]);

    /**
     * Fetch all related data for client
     */
    const fetchRelatedData = async () => {
        setIsLoadingData(true);
        try {
            // Fetch all related data in parallel
            const [contractsRes, proposalsRes, documentsRes] = await Promise.all([
                api.get(`/clients/${client.id}/contracts`).catch(() => ({ data: { success: false, data: [] } })),
                api.get(`/clients/${client.id}/proposals`).catch(() => ({ data: { success: false, data: [] } })),
                api.get(`/clients/${client.id}/documents`).catch(() => ({ data: { success: false, data: [] } })),
            ]);

            setContracts(contractsRes.data.success ? contractsRes.data.data : []);
            setProposals(proposalsRes.data.success ? proposalsRes.data.data : []);
            setDocuments(documentsRes.data.success ? documentsRes.data.data : []);
        } catch (error) {
            console.error('Error fetching related data:', error);
            setContracts([]);
            setProposals([]);
            setDocuments([]);
        } finally {
            setIsLoadingData(false);
        }
    };

    /**
     * Handle create folder button
     */
    const handleCreateFolder = () => {
        // TODO: Implement folder creation
        console.log('Create folder for client:', client?.id);
    };

    /**
     * Handle add document button
     */
    const handleAddDocument = () => {
        // TODO: Implement document upload
        console.log('Add document for client:', client?.id);
    };

    /**
     * Handle create contract button
     */
    const handleCreateContract = () => {
        // TODO: Implement contract creation
        console.log('Create contract for client:', client?.id);
    };

    /**
     * Handle create proposal button
     */
    const handleCreateProposal = () => {
        // TODO: Implement proposal creation
        console.log('Create proposal for client:', client?.id);
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    /**
     * Render empty state
     */
    const renderEmptyState = (icon, message) => {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <i className="material-icons text-6xl mb-4">{icon}</i>
                <p className="text-lg">{message}</p>
            </div>
        );
    };

    /**
     * Render contracts tab
     */
    const renderContractsTab = () => {
        if (isLoadingData) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (contracts.length === 0) {
            return renderEmptyState('description', 'Nessun contratto trovato');
        }

        return (
            <div className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                    <div
                        key={contract.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Contratto #{contract.contract_number || contract.id}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {contract.property_type || 'Tipo immobile non specificato'}
                                </div>
                                <div className="text-sm text-blue-500 mt-1">
                                    Inizio: {formatDate(contract.start_date)}
                                </div>
                            </div>
                            <div className="ml-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        contract.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : contract.status === 'ended'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {contract.status || 'draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /**
     * Render proposals tab
     */
    const renderProposalsTab = () => {
        if (isLoadingData) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (proposals.length === 0) {
            return renderEmptyState('assignment', 'Nessuna proposta trovata');
        }

        return (
            <div className="divide-y divide-gray-200">
                {proposals.map((proposal) => (
                    <div
                        key={proposal.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Proposta #{proposal.proposal_number || proposal.id}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {proposal.notes || 'Nessuna nota'}
                                </div>
                                <div className="text-sm text-blue-500 mt-1">
                                    Data: {formatDate(proposal.created_at)}
                                </div>
                            </div>
                            <div className="ml-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        proposal.status === 'accepted'
                                            ? 'bg-green-100 text-green-800'
                                            : proposal.status === 'rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {proposal.status || 'draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /**
     * Render documents tab
     */
    const renderDocumentsTab = () => {
        if (isLoadingData) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (documents.length === 0) {
            return renderEmptyState('folder_open', 'Nessun documento trovato');
        }

        return (
            <div className="divide-y divide-gray-200">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <i className="material-icons text-red-500 text-3xl">picture_as_pdf</i>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {document.name || 'Documento senza nome'}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {document.folder || 'Cartella principale'}
                                </div>
                                <div className="text-sm text-blue-500 mt-1">
                                    Caricato: {formatDate(document.created_at)}
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {document.size
                                    ? `${(document.size / 1024).toFixed(2)} KB`
                                    : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400 bg-white">
                <i className="material-icons text-6xl mb-4">folder_open</i>
                <p className="text-lg">Seleziona un cliente per vedere i dati correlati</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('contracts')}
                        className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                            activeTab === 'contracts'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Lista contratti
                    </button>
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                            activeTab === 'proposals'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Proposte
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                            activeTab === 'documents'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Documenti
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                {activeTab === 'contracts' && (
                    <Button onClick={handleCreateContract} variant="primary" className="w-full">
                        <i className="material-icons text-sm mr-2">add</i>
                        Crea contratto
                    </Button>
                )}
                {activeTab === 'proposals' && (
                    <Button onClick={handleCreateProposal} variant="primary" className="w-full">
                        <i className="material-icons text-sm mr-2">add</i>
                        Crea proposta
                    </Button>
                )}
                {activeTab === 'documents' && (
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleCreateFolder} variant="secondary">
                            <i className="material-icons text-sm mr-2">create_new_folder</i>
                            Crea cartella
                        </Button>
                        <Button onClick={handleAddDocument} variant="primary">
                            <i className="material-icons text-sm mr-2">upload_file</i>
                            Aggiungi documento
                        </Button>
                    </div>
                )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'contracts' && renderContractsTab()}
                {activeTab === 'proposals' && renderProposalsTab()}
                {activeTab === 'documents' && renderDocumentsTab()}
            </div>

            {/* Results count */}
            {!isLoadingData && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                    {activeTab === 'contracts' && (
                        <span>
                            {contracts.length}{' '}
                            {contracts.length === 1 ? 'contratto' : 'contratti'}
                        </span>
                    )}
                    {activeTab === 'proposals' && (
                        <span>
                            {proposals.length}{' '}
                            {proposals.length === 1 ? 'proposta' : 'proposte'}
                        </span>
                    )}
                    {activeTab === 'documents' && (
                        <span>
                            {documents.length}{' '}
                            {documents.length === 1 ? 'documento' : 'documenti'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
