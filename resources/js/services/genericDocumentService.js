import api from './api';

/**
 * Generic Document Service Factory
 *
 * Creates a document service for any entity type (clients, rooms, properties, condominiums)
 * Each entity has its own isolated document storage with folders
 *
 * Security:
 * - Documents are entity-specific (each room/property/etc has its own docs)
 * - Uses authenticated API requests
 * - Blob URLs for secure viewing (no direct file access)
 * - Server-side permission checks
 *
 * @param {string} entityType - Entity type (e.g., 'clients', 'rooms', 'properties', 'condominiums')
 * @returns {object} Document service with all operations
 */
export function createDocumentService(entityType) {
    return {
        // ==================== DOCUMENTS ====================

        /**
         * Get list of documents for an entity
         * @param {number|string} entityId - ID of the entity
         * @param {number|string|null} folderId - ID of folder (null for root)
         * @returns {Promise<Object>}
         */
        async getDocuments(entityId, folderId = null) {
            const params = folderId !== null ? { folder_id: folderId } : {};
            const response = await api.get(`/${entityType}/${entityId}/documents`, { params });
            return response.data;
        },

        /**
         * Upload a new document
         * @param {number|string} entityId - ID of the entity
         * @param {File} file - File to upload
         * @param {number|string|null} folderId - Target folder ID
         * @param {Function} onUploadProgress - Progress callback
         * @returns {Promise<Object>}
         */
        async uploadDocument(entityId, file, folderId = null, onUploadProgress = null) {
            const formData = new FormData();
            formData.append('file', file);

            if (folderId !== null) {
                formData.append('folder_id', folderId);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (onUploadProgress) {
                config.onUploadProgress = (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onUploadProgress(percentCompleted);
                };
            }

            const response = await api.post(
                `/${entityType}/${entityId}/documents`,
                formData,
                config
            );
            return response.data;
        },

        /**
         * Get details of a single document
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} documentId - ID of the document
         * @returns {Promise<Object>}
         */
        async getDocument(entityId, documentId) {
            const response = await api.get(`/${entityType}/${entityId}/documents/${documentId}`);
            return response.data;
        },

        /**
         * Download a document
         * Uses authenticated blob URL for security
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} documentId - ID of the document
         * @param {string} filename - Filename for download
         * @returns {Promise<void>}
         */
        async downloadDocument(entityId, documentId, filename) {
            try {
                const response = await api.get(
                    `/${entityType}/${entityId}/documents/${documentId}/download`,
                    { responseType: 'blob' }
                );

                // Create authenticated blob URL
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const blobUrl = window.URL.createObjectURL(blob);

                // Trigger download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up blob URL
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Error downloading document:', error);
                throw error;
            }
        },

        /**
         * View a document in browser (PDFs and images)
         * Uses authenticated blob URL for security
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} documentId - ID of the document
         * @returns {Promise<void>}
         */
        async viewDocument(entityId, documentId) {
            try {
                const response = await api.get(
                    `/${entityType}/${entityId}/documents/${documentId}/view`,
                    { responseType: 'blob' }
                );

                // Create authenticated blob URL
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const blobUrl = window.URL.createObjectURL(blob);
                const newWindow = window.open(blobUrl, '_blank');

                // Clean up blob URL after window loads
                if (newWindow) {
                    newWindow.onload = () => {
                        window.URL.revokeObjectURL(blobUrl);
                    };
                }
            } catch (error) {
                console.error('Error viewing document:', error);
                throw error;
            }
        },

        /**
         * Delete a document
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} documentId - ID of the document
         * @returns {Promise<Object>}
         */
        async deleteDocument(entityId, documentId) {
            const response = await api.delete(`/${entityType}/${entityId}/documents/${documentId}`);
            return response.data;
        },

        // ==================== FOLDERS ====================

        /**
         * Get list of folders for an entity
         * @param {number|string} entityId - ID of the entity
         * @param {number|string|null} parentId - Parent folder ID (null for root)
         * @returns {Promise<Object>}
         */
        async getFolders(entityId, parentId = null) {
            const params = parentId !== null ? { parent_id: parentId } : {};
            const response = await api.get(`/${entityType}/${entityId}/folders`, { params });
            return response.data;
        },

        /**
         * Create a new folder
         * @param {number|string} entityId - ID of the entity
         * @param {string} name - Folder name
         * @param {number|string|null} parentId - Parent folder ID
         * @returns {Promise<Object>}
         */
        async createFolder(entityId, name, parentId = null) {
            const data = { name };

            if (parentId !== null) {
                data.parent_folder_id = parentId;
            }

            const response = await api.post(`/${entityType}/${entityId}/folders`, data);
            return response.data;
        },

        /**
         * Get folder details
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} folderId - ID of the folder
         * @param {boolean} includeBreadcrumbs - Include breadcrumb path
         * @returns {Promise<Object>}
         */
        async getFolder(entityId, folderId, includeBreadcrumbs = false) {
            const params = includeBreadcrumbs ? { include_breadcrumbs: true } : {};
            const response = await api.get(
                `/${entityType}/${entityId}/folders/${folderId}`,
                { params }
            );
            return response.data;
        },

        /**
         * Delete a folder and all its contents
         * @param {number|string} entityId - ID of the entity
         * @param {number|string} folderId - ID of the folder
         * @returns {Promise<Object>}
         */
        async deleteFolder(entityId, folderId) {
            const response = await api.delete(`/${entityType}/${entityId}/folders/${folderId}`);
            return response.data;
        },

        // ==================== UTILITIES ====================

        /**
         * Validate file before upload
         * @param {File} file - File to validate
         * @returns {Object} { valid: boolean, error: string|null }
         */
        validateFile(file) {
            const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
            const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

            // Check file size
            if (file.size > maxSizeBytes) {
                return {
                    valid: false,
                    error: 'Il file supera il limite di 10 MB',
                };
            }

            // Check file extension
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return {
                    valid: false,
                    error: 'Tipo di file non supportato. Formati consentiti: PDF, DOC, DOCX, JPG, PNG',
                };
            }

            return { valid: true, error: null };
        },

        /**
         * Format file size for display
         * @param {number} bytes - Size in bytes
         * @returns {string}
         */
        formatFileSize(bytes) {
            if (bytes >= 1048576) {
                return `${(bytes / 1048576).toFixed(2)} MB`;
            }
            if (bytes >= 1024) {
                return `${(bytes / 1024).toFixed(2)} KB`;
            }
            return `${bytes} bytes`;
        },
    };
}

/**
 * Pre-configured document services for each entity type
 */
export const clientDocumentService = createDocumentService('clients');
export const roomDocumentService = createDocumentService('rooms');
export const propertyDocumentService = createDocumentService('properties');
export const condominiumDocumentService = createDocumentService('condominiums');

/**
 * Get document service for a specific entity type
 * @param {string} entityType - Entity type ('client', 'room', 'property', 'condominium')
 * @returns {object} Document service
 */
export function getDocumentService(entityType) {
    const pluralMap = {
        'client': 'clients',
        'room': 'rooms',
        'property': 'properties',
        'condominium': 'condominiums'
    };

    const pluralType = pluralMap[entityType] || `${entityType}s`;
    return createDocumentService(pluralType);
}

export default {
    createDocumentService,
    getDocumentService,
    clientDocumentService,
    roomDocumentService,
    propertyDocumentService,
    condominiumDocumentService
};
