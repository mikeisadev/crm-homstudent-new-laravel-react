import { clientDocumentService } from './genericDocumentService';

/**
 * Client-specific document service
 * This is a wrapper around the generic document service for backward compatibility
 * All new code should use genericDocumentService directly
 */
const documentService = {
    // ==================== DOCUMENTS ====================

    /**
     * Get list of documents for a client
     * @param {number|string} clientId - Client ID
     * @param {number|string|null} folderId - Folder ID (null for root)
     * @returns {Promise<Object>}
     */
    async getDocuments(clientId, folderId = null) {
        return clientDocumentService.getDocuments(clientId, folderId);
    },

    /**
     * Upload a new document
     * @param {number|string} clientId - Client ID
     * @param {File} file - File to upload
     * @param {number|string|null} folderId - Target folder ID
     * @param {Function} onUploadProgress - Progress callback
     * @returns {Promise<Object>}
     */
    async uploadDocument(clientId, file, folderId = null, onUploadProgress = null) {
        return clientDocumentService.uploadDocument(clientId, file, folderId, onUploadProgress);
    },

    /**
     * Get document details
     * @param {number|string} clientId - Client ID
     * @param {number|string} documentId - Document ID
     * @returns {Promise<Object>}
     */
    async getDocument(clientId, documentId) {
        return clientDocumentService.getDocument(clientId, documentId);
    },

    /**
     * Download a document
     * @param {number|string} clientId - Client ID
     * @param {number|string} documentId - Document ID
     * @param {string} filename - Filename for download
     * @returns {Promise<void>}
     */
    async downloadDocument(clientId, documentId, filename) {
        return clientDocumentService.downloadDocument(clientId, documentId, filename);
    },

    /**
     * View a document in browser
     * @param {number|string} clientId - Client ID
     * @param {number|string} documentId - Document ID
     * @returns {Promise<void>}
     */
    async viewDocument(clientId, documentId) {
        return clientDocumentService.viewDocument(clientId, documentId);
    },

    /**
     * Delete a document
     * @param {number|string} clientId - Client ID
     * @param {number|string} documentId - Document ID
     * @returns {Promise<Object>}
     */
    async deleteDocument(clientId, documentId) {
        return clientDocumentService.deleteDocument(clientId, documentId);
    },

    // ==================== FOLDERS ====================

    /**
     * Get list of folders
     * @param {number|string} clientId - Client ID
     * @param {number|string|null} parentId - Parent folder ID (null for root)
     * @returns {Promise<Object>}
     */
    async getFolders(clientId, parentId = null) {
        return clientDocumentService.getFolders(clientId, parentId);
    },

    /**
     * Create a new folder
     * @param {number|string} clientId - Client ID
     * @param {string} name - Folder name
     * @param {number|string|null} parentId - Parent folder ID
     * @returns {Promise<Object>}
     */
    async createFolder(clientId, name, parentId = null) {
        return clientDocumentService.createFolder(clientId, name, parentId);
    },

    /**
     * Get folder details
     * @param {number|string} clientId - Client ID
     * @param {number|string} folderId - Folder ID
     * @param {boolean} includeBreadcrumbs - Include breadcrumb path
     * @returns {Promise<Object>}
     */
    async getFolder(clientId, folderId, includeBreadcrumbs = false) {
        return clientDocumentService.getFolder(clientId, folderId, includeBreadcrumbs);
    },

    /**
     * Delete a folder and all contents
     * @param {number|string} clientId - Client ID
     * @param {number|string} folderId - Folder ID
     * @returns {Promise<Object>}
     */
    async deleteFolder(clientId, folderId) {
        return clientDocumentService.deleteFolder(clientId, folderId);
    },

    // ==================== UTILITIES ====================

    /**
     * Validate file before upload
     * @param {File} file - File to validate
     * @returns {Object} { valid: boolean, error: string|null }
     */
    validateFile(file) {
        return clientDocumentService.validateFile(file);
    },

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string}
     */
    formatFileSize(bytes) {
        return clientDocumentService.formatFileSize(bytes);
    },
};

export default documentService;
