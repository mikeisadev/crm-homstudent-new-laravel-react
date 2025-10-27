import { useState, useEffect, useRef, useMemo } from 'react';
import Button from '../../ui/Button';
import { getDocumentService } from '../../../services/genericDocumentService';

/**
 * Generic Document Manager Component
 *
 * Reusable document management with folder navigation for any entity type
 * Each entity (client, room, property, condominium) has its own isolated document storage
 *
 * Features:
 * - Folder creation and navigation
 * - Document upload (PDF, DOC, DOCX, JPG, PNG)
 * - Document viewing (authenticated blob URLs)
 * - Document download
 * - Delete documents and folders
 * - Breadcrumb navigation
 * - Upload progress tracking
 *
 * Security:
 * - Entity-specific document storage (no cross-entity access)
 * - Authenticated API requests
 * - Blob URLs for secure viewing (no direct file URLs)
 * - Server-side permission validation
 *
 * @param {number} entityId - ID of the entity
 * @param {string} entityType - Type of entity (from rendererProps)
 * @param {string} apiEndpoint - Base API endpoint (from rendererProps)
 * @param {object} rendererProps - Additional props from config (entityType, apiEndpoint)
 * @returns {JSX.Element}
 */
export default function DocumentManager({ entityId, entityType, apiEndpoint, rendererProps = {} }) {
    // Use props or fallback to rendererProps
    const type = entityType || rendererProps.entityType;
    const endpoint = apiEndpoint || rendererProps.apiEndpoint;

    // Get entity-specific document service
    const documentService = useMemo(() => {
        return getDocumentService(type);
    }, [type]);

    // Documents and folders state
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Navigation state
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);

    // Modal and UI state
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [folderError, setFolderError] = useState('');
    const fileInputRef = useRef(null);

    /**
     * Fetch documents and folders when entity or folder changes
     */
    useEffect(() => {
        if (entityId) {
            fetchDocumentsAndFolders();
        }
    }, [entityId, currentFolder]);

    /**
     * Reset state when entity changes
     */
    useEffect(() => {
        setDocuments([]);
        setFolders([]);
        setCurrentFolder(null);
        setBreadcrumbs([{ id: null, name: 'Home' }]);
    }, [entityId]);

    /**
     * Fetch documents and folders for current folder
     */
    const fetchDocumentsAndFolders = async () => {
        if (!entityId) return;

        setIsLoadingData(true);
        try {
            const folderId = currentFolder?.id || null;

            const [documentsData, foldersData] = await Promise.all([
                documentService.getDocuments(entityId, folderId),
                documentService.getFolders(entityId, folderId),
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
                entityId,
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
                entityId,
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
                await documentService.viewDocument(entityId, document.id);
            } else {
                // Download file with authenticated request
                await documentService.downloadDocument(entityId, document.id, document.name);
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
            await documentService.deleteFolder(entityId, folder.id);
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
            await documentService.deleteDocument(entityId, document.id);
            await fetchDocumentsAndFolders();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Errore durante l\'eliminazione del documento');
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
    const renderEmptyState = () => {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <i className="material-icons text-6xl mb-4">folder_open</i>
                <p className="text-lg">Nessun documento o cartella trovati</p>
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

    const isEmpty = folders.length === 0 && documents.length === 0;

    return (
        <div className="flex flex-col h-full">
            {/* Action Buttons - ALWAYS VISIBLE */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
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

            {/* Documents and Folders List */}
            <div className="flex-1 overflow-y-auto">
                {/* Show empty state if nothing exists */}
                {isEmpty && !currentFolder && (
                    renderEmptyState()
                )}

                {/* Show content when there are items OR in a subfolder */}
                {(!isEmpty || currentFolder) && (
                    <div className="divide-y divide-gray-200">
                        {/* Breadcrumb navigation */}
                        {breadcrumbs.length > 1 && (
                    <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm sticky top-0 z-10">
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
                )}
            </div>

            {/* Results count - only show when there's content or in a subfolder */}
            {(!isEmpty || currentFolder) && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                    <span>
                        {folders.length} {folders.length === 1 ? 'cartella' : 'cartelle'} • {' '}
                        {documents.length} {documents.length === 1 ? 'documento' : 'documenti'}
                    </span>
                </div>
            )}

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
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
