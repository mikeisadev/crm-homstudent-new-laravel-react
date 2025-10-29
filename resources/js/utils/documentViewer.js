import api from '../services/api';

/**
 * Document Viewer Utility
 *
 * Handles secure viewing and downloading of documents with authentication
 * Uses Blob URLs for proper file handling in new tabs
 */

/**
 * View a document in a new tab
 *
 * @param {string} entityType - Type of entity (e.g., 'management-contracts', 'properties')
 * @param {number} entityId - ID of the entity
 * @param {number} documentId - ID of the document
 * @param {string} filename - Optional filename for better UX
 */
export async function viewDocument(entityType, entityId, documentId, filename = 'document.pdf') {
    try {
        // Make authenticated request for the document
        const response = await api.get(
            `/${entityType}/${entityId}/documents/${documentId}/view`,
            {
                responseType: 'blob' // Important: get response as blob
            }
        );

        // Create blob URL from response
        const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Open in new tab
        const newWindow = window.open(blobUrl, '_blank');

        // Clean up blob URL after window loads (or after 1 minute as fallback)
        if (newWindow) {
            newWindow.onload = () => {
                // Revoke after a delay to ensure the document is loaded
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            };
        }

        // Fallback cleanup after 1 minute
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

        return true;
    } catch (error) {
        console.error('Error viewing document:', error);

        // User-friendly error messages
        if (error.response?.status === 404) {
            alert('Documento non trovato');
        } else if (error.response?.status === 403) {
            alert('Non hai i permessi per visualizzare questo documento');
        } else {
            alert('Errore durante il caricamento del documento');
        }

        return false;
    }
}

/**
 * Download a document
 *
 * @param {string} entityType - Type of entity (e.g., 'management-contracts', 'properties')
 * @param {number} entityId - ID of the entity
 * @param {number} documentId - ID of the document
 * @param {string} filename - Filename for the download
 */
export async function downloadDocument(entityType, entityId, documentId, filename = 'document.pdf') {
    try {
        // Make authenticated request for the document
        const response = await api.get(
            `/${entityType}/${entityId}/documents/${documentId}/download`,
            {
                responseType: 'blob'
            }
        );

        // Create blob URL
        const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Create temporary download link and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        return true;
    } catch (error) {
        console.error('Error downloading document:', error);

        if (error.response?.status === 404) {
            alert('Documento non trovato');
        } else if (error.response?.status === 403) {
            alert('Non hai i permessi per scaricare questo documento');
        } else {
            alert('Errore durante il download del documento');
        }

        return false;
    }
}

/**
 * Get the entity type slug from config
 * Converts entity name to API endpoint format
 *
 * @param {object} config - Entity configuration
 * @returns {string} Entity type slug for API
 */
export function getEntityTypeSlug(config) {
    // Use apiEndpoint from config, removing leading slash
    return config.apiEndpoint?.replace(/^\//, '') || config.entityPlural;
}
