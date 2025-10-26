import api from './api';

/**
 * Servizio per la gestione dei documenti e cartelle dei clienti
 */
const documentService = {
    // ==================== DOCUMENTI ====================

    /**
     * Ottiene la lista dei documenti di un cliente
     * @param {number|string} clientId - ID del cliente
     * @param {number|string|null} folderId - ID della cartella (null per root)
     * @returns {Promise<Object>}
     */
    async getDocuments(clientId, folderId = null) {
        const params = folderId !== null ? { folder_id: folderId } : {};
        const response = await api.get(`/clients/${clientId}/documents`, { params });
        return response.data;
    },

    /**
     * Carica un nuovo documento per un cliente
     * @param {number|string} clientId - ID del cliente
     * @param {File} file - File da caricare
     * @param {number|string|null} folderId - ID della cartella di destinazione
     * @param {Function} onUploadProgress - Callback per il progresso del caricamento
     * @returns {Promise<Object>}
     */
    async uploadDocument(clientId, file, folderId = null, onUploadProgress = null) {
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
            `/clients/${clientId}/documents`,
            formData,
            config
        );
        return response.data;
    },

    /**
     * Ottiene i dettagli di un singolo documento
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} documentId - ID del documento
     * @returns {Promise<Object>}
     */
    async getDocument(clientId, documentId) {
        const response = await api.get(`/clients/${clientId}/documents/${documentId}`);
        return response.data;
    },

    /**
     * Scarica un documento
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} documentId - ID del documento
     * @param {string} filename - Nome del file per il download
     * @returns {Promise<void>}
     */
    async downloadDocument(clientId, documentId, filename) {
        try {
            const response = await api.get(
                `/clients/${clientId}/documents/${documentId}/download`,
                { responseType: 'blob' }
            );

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);

            // Create temporary anchor to trigger download
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
     * Visualizza un documento nel browser (PDFs e immagini)
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} documentId - ID del documento
     * @returns {Promise<void>}
     */
    async viewDocument(clientId, documentId) {
        try {
            const response = await api.get(
                `/clients/${clientId}/documents/${documentId}/view`,
                { responseType: 'blob' }
            );

            // Create a blob URL and open in new tab
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
     * Elimina un documento
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} documentId - ID del documento
     * @returns {Promise<Object>}
     */
    async deleteDocument(clientId, documentId) {
        const response = await api.delete(`/clients/${clientId}/documents/${documentId}`);
        return response.data;
    },

    // ==================== CARTELLE ====================

    /**
     * Ottiene la lista delle cartelle di un cliente
     * @param {number|string} clientId - ID del cliente
     * @param {number|string|null} parentId - ID della cartella padre (null per root)
     * @returns {Promise<Object>}
     */
    async getFolders(clientId, parentId = null) {
        const params = parentId !== null ? { parent_id: parentId } : {};
        const response = await api.get(`/clients/${clientId}/folders`, { params });
        return response.data;
    },

    /**
     * Crea una nuova cartella per un cliente
     * @param {number|string} clientId - ID del cliente
     * @param {string} name - Nome della cartella
     * @param {number|string|null} parentId - ID della cartella padre
     * @returns {Promise<Object>}
     */
    async createFolder(clientId, name, parentId = null) {
        const data = { name };

        if (parentId !== null) {
            data.parent_folder_id = parentId;
        }

        const response = await api.post(`/clients/${clientId}/folders`, data);
        return response.data;
    },

    /**
     * Ottiene i dettagli di una singola cartella
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} folderId - ID della cartella
     * @param {boolean} includeBreadcrumbs - Include il percorso breadcrumb
     * @returns {Promise<Object>}
     */
    async getFolder(clientId, folderId, includeBreadcrumbs = false) {
        const params = includeBreadcrumbs ? { include_breadcrumbs: true } : {};
        const response = await api.get(
            `/clients/${clientId}/folders/${folderId}`,
            { params }
        );
        return response.data;
    },

    /**
     * Elimina una cartella (e tutto il suo contenuto)
     * @param {number|string} clientId - ID del cliente
     * @param {number|string} folderId - ID della cartella
     * @returns {Promise<Object>}
     */
    async deleteFolder(clientId, folderId) {
        const response = await api.delete(`/clients/${clientId}/folders/${folderId}`);
        return response.data;
    },

    // ==================== UTILITÀ ====================

    /**
     * Valida un file prima del caricamento
     * @param {File} file - File da validare
     * @returns {Object} { valid: boolean, error: string|null }
     */
    validateFile(file) {
        const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        const maxSizeBytes = 2560 * 1024; // 2.5 MB in bytes

        // Check file size
        if (file.size > maxSizeBytes) {
            return {
                valid: false,
                error: 'Il file supera il limite di 2.5 MB',
            };
        }

        // Check file extension
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            return {
                valid: false,
                error: 'Tipo di file non supportato. Usa PDF, DOC, DOCX, JPG o PNG',
            };
        }

        return { valid: true, error: null };
    },

    /**
     * Formatta la dimensione del file in formato leggibile
     * @param {number} bytes - Dimensione in bytes
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

export default documentService;
