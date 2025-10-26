import { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import api from '../../services/api';
import documentService from '../../services/documentService';

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
    const [folders, setFolders] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Documents tab state
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [folderError, setFolderError] = useState('');
    const fileInputRef = useRef(null);

    /**
     * Togglers.
     *
     * By Michele Mincone
     */
    const showProposalActionButtons = false;
    const showContractActionButtons = false;

    /**
     * Fetch related data when client changes
     */
    useEffect(() => {
        if (!client) {
            setContracts([]);
            setProposals([]);
            setDocuments([]);
            setFolders([]);
            setCurrentFolder(null);
            setBreadcrumbs([{ id: null, name: 'Home' }]);
            return;
        }

        fetchRelatedData();
    }, [client]);

    /**
     * Fetch documents and folders when current folder changes
     */
    useEffect(() => {
        if (client && activeTab === 'documents') {
            fetchDocumentsAndFolders();
        }
    }, [currentFolder, client, activeTab]);

    /**
     * Fetch all related data for client
     */
    const fetchRelatedData = async () => {
        setIsLoadingData(true);
        try {
            // Fetch all related data in parallel
            const [contractsRes, proposalsRes] = await Promise.all([
                api.get(`/clients/${client.id}/contracts`).catch(() => ({ data: { success: false, data: [] } })),
                api.get(`/clients/${client.id}/proposals`).catch(() => ({ data: { success: false, data: [] } })),
            ]);

            setContracts(contractsRes.data.success ? contractsRes.data.data : []);
            setProposals(proposalsRes.data.success ? proposalsRes.data.data : []);

            // Fetch documents and folders if on documents tab
            if (activeTab === 'documents') {
                await fetchDocumentsAndFolders();
            }
        } catch (error) {
            console.error('Error fetching related data:', error);
            setContracts([]);
            setProposals([]);
        } finally {
            setIsLoadingData(false);
        }
    };

    /**
     * Fetch documents and folders for current folder
     */
    const fetchDocumentsAndFolders = async () => {
        if (!client) return;

        setIsLoadingData(true);
        try {
            const folderId = currentFolder?.id || null;

            const [documentsData, foldersData] = await Promise.all([
                documentService.getDocuments(client.id, folderId),
                documentService.getFolders(client.id, folderId),
            ]);

            setDocuments(documentsData.data || []);
            setFolders(foldersData.data || []);
        } catch (error) {
            console.error('Error fetching documents and folders:', error);
            setDocuments([]);
            setFolders([]);
        } finally {
            setIsLoadingData(false);
        }
    };

    /**
     * Navigate into a folder
     */
    const handleFolderClick = (folder) => {
        setCurrentFolder(folder);
        setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    };

    /**
     * Navigate using breadcrumbs
     */
    const handleBreadcrumbClick = (index) => {
        const clickedCrumb = breadcrumbs[index];
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));

        if (clickedCrumb.id === null) {
            setCurrentFolder(null);
        } else {
            setCurrentFolder({ id: clickedCrumb.id, name: clickedCrumb.name });
        }
    };

    /**
     * Open create folder modal
     */
    const handleCreateFolder = () => {
        setShowCreateFolderModal(true);
        setNewFolderName('');
        setFolderError('');
    };

    /**
     * Submit folder creation
     */
    const handleSubmitFolder = async (e) => {
        e.preventDefault();
        setFolderError('');

        if (!newFolderName.trim()) {
            setFolderError('Il nome della cartella è obbligatorio');
            return;
        }

        if (newFolderName.length > 100) {
            setFolderError('Il nome della cartella non può superare i 100 caratteri');
            return;
        }

        if (!/^[\w\s\-]+$/u.test(newFolderName)) {
            setFolderError('Il nome della cartella può contenere solo lettere, numeri, spazi, trattini e underscore');
            return;
        }

        setIsCreatingFolder(true);
        try {
            await documentService.createFolder(
                client.id,
                newFolderName,
                currentFolder?.id || null
            );

            // Refresh folders
            await fetchDocumentsAndFolders();

            // Close modal
            setShowCreateFolderModal(false);
            setNewFolderName('');
        } catch (error) {
            console.error('Error creating folder:', error);
            setFolderError(
                error.response?.data?.message ||
                error.response?.data?.errors?.name?.[0] ||
                'Errore durante la creazione della cartella'
            );
        } finally {
            setIsCreatingFolder(false);
        }
    };

    /**
     * Trigger file input
     */
    const handleAddDocument = () => {
        fileInputRef.current?.click();
    };

    /**
     * Handle file selection
     */
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = documentService.validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            e.target.value = '';
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            await documentService.uploadDocument(
                client.id,
                file,
                currentFolder?.id || null,
                (progress) => setUploadProgress(progress)
            );

            // Refresh documents
            await fetchDocumentsAndFolders();
        } catch (error) {
            console.error('Error uploading document:', error);
            alert(
                error.response?.data?.message ||
                error.response?.data?.errors?.file?.[0] ||
                'Errore durante il caricamento del documento'
            );
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            e.target.value = '';
        }
    };

    /**
     * Handle document click (view or download)
     */
    const handleDocumentClick = async (document) => {
        try {
            if (document.is_viewable) {
                // View in new tab with authenticated request
                await documentService.viewDocument(client.id, document.id);
            } else {
                // Download file with authenticated request
                await documentService.downloadDocument(client.id, document.id, document.name);
            }
        } catch (error) {
            console.error('Error opening document:', error);
            alert('Errore durante l\'apertura del documento');
        }
    };

    /**
     * Delete folder with confirmation
     */
    const handleDeleteFolder = async (folder, e) => {
        e.stopPropagation();

        if (!confirm(`Sei sicuro di voler eliminare la cartella "${folder.name}"? Verranno eliminati anche tutti i contenuti.`)) {
            return;
        }

        try {
            await documentService.deleteFolder(client.id, folder.id);
            await fetchDocumentsAndFolders();
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert('Errore durante l\'eliminazione della cartella');
        }
    };

    /**
     * Delete document with confirmation
     */
    const handleDeleteDocument = async (document, e) => {
        e.stopPropagation();

        if (!confirm(`Sei sicuro di voler eliminare il documento "${document.name}"?`)) {
            return;
        }

        try {
            await documentService.deleteDocument(client.id, document.id);
            await fetchDocumentsAndFolders();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Errore durante l\'eliminazione del documento');
        }
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
     * Get icon for document type
     */
    const getDocumentIcon = (document) => {
        if (document.is_pdf) return 'picture_as_pdf';
        if (document.is_image) return 'image';
        return 'description';
    };

    /**
     * Get icon color for document type
     */
    const getDocumentIconColor = (document) => {
        if (document.is_pdf) return 'text-red-500';
        if (document.is_image) return 'text-blue-500';
        return 'text-gray-500';
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
     * Render documents tab with folders and breadcrumbs
     */
    const renderDocumentsTab = () => {
        if (isLoadingData) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        const isEmpty = folders.length === 0 && documents.length === 0;

        if (isEmpty && !currentFolder) {
            return renderEmptyState('folder_open', 'Nessun documento o cartella trovati');
        }

        return (
            <div className="divide-y divide-gray-200">
                {/* Breadcrumb navigation */}
                {breadcrumbs.length > 1 && (
                    <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <i className="material-icons text-xs text-gray-400">
                                        chevron_right
                                    </i>
                                )}
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`hover:text-blue-500 transition-colors ${
                                        index === breadcrumbs.length - 1
                                            ? 'text-gray-900 font-medium'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {index === 0 ? (
                                        <i className="material-icons text-sm">home</i>
                                    ) : (
                                        crumb.name
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Folders */}
                {folders.map((folder) => (
                    <div
                        key={`folder-${folder.id}`}
                        onClick={() => handleFolderClick(folder)}
                        className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <i className="material-icons text-yellow-500 text-3xl">folder</i>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                    {folder.name}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {folder.documents_count || 0} documenti, {folder.subfolders_count || 0} cartelle
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteFolder(folder, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded"
                                title="Elimina cartella"
                            >
                                <i className="material-icons text-red-500 text-sm">delete</i>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Documents */}
                {documents.map((document) => (
                    <div
                        key={`doc-${document.id}`}
                        onClick={() => handleDocumentClick(document)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <i className={`material-icons text-3xl ${getDocumentIconColor(document)}`}>
                                {getDocumentIcon(document)}
                            </i>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                    {document.name}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {document.formatted_size} • {formatDate(document.created_at)}
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteDocument(document, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded"
                                title="Elimina documento"
                            >
                                <i className="material-icons text-red-500 text-sm">delete</i>
                            </button>
                        </div>
                    </div>
                ))}

                {isEmpty && currentFolder && (
                    <div className="p-8 text-center text-gray-400">
                        Questa cartella è vuota
                    </div>
                )}
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
                {showContractActionButtons && activeTab === 'contracts' && (
                    <Button onClick={handleCreateContract} variant="primary" className="w-full">
                        <i className="material-icons text-sm mr-2">add</i>
                        Crea contratto
                    </Button>
                )}
                {showProposalActionButtons && activeTab === 'proposals' && (
                    <Button onClick={handleCreateProposal} variant="primary" className="w-full">
                        <i className="material-icons text-sm mr-2">add</i>
                        Crea proposta
                    </Button>
                )}
                {activeTab === 'documents' && (
                    <div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={handleCreateFolder}
                                variant="secondary"
                                disabled={isUploading || isCreatingFolder}
                            >
                                <i className="material-icons text-sm mr-2">create_new_folder</i>
                                Crea cartella
                            </Button>
                            <Button
                                onClick={handleAddDocument}
                                variant="primary"
                                disabled={isUploading || isCreatingFolder}
                            >
                                <i className="material-icons text-sm mr-2">upload_file</i>
                                Aggiungi documento
                            </Button>
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600">Caricamento in corso...</span>
                                    <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                        />
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
                            {folders.length} {folders.length === 1 ? 'cartella' : 'cartelle'} • {' '}
                            {documents.length} {documents.length === 1 ? 'documento' : 'documenti'}
                        </span>
                    )}
                </div>
            )}

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Crea nuova cartella
                            </h3>

                            <form onSubmit={handleSubmitFolder}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome cartella
                                    </label>
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Es: Documenti legali"
                                        maxLength={100}
                                        autoFocus
                                        disabled={isCreatingFolder}
                                    />
                                    {folderError && (
                                        <p className="mt-2 text-sm text-red-600">{folderError}</p>
                                    )}
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setShowCreateFolderModal(false)}
                                        variant="secondary"
                                        disabled={isCreatingFolder}
                                    >
                                        Annulla
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isCreatingFolder}
                                    >
                                        {isCreatingFolder ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creazione...
                                            </>
                                        ) : (
                                            'Crea'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
