import api from './api';

/**
 * Servizio per la gestione dei clienti
 */
const clientService = {
    /**
     * Ottiene la lista dei clienti con filtri opzionali
     * @param {Object} params - Parametri di ricerca (page, per_page, search, etc.)
     * @returns {Promise<Object>}
     */
    async getClients(params = {}) {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    /**
     * Ottiene i dettagli di un singolo cliente
     * @param {number|string} id - ID del cliente
     * @returns {Promise<Object>}
     */
    async getClient(id) {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    /**
     * Crea un nuovo cliente
     * @param {Object} data - Dati del cliente
     * @returns {Promise<Object>}
     */
    async createClient(data) {
        const response = await api.post('/clients', data);
        return response.data;
    },

    /**
     * Aggiorna un cliente esistente
     * @param {number|string} id - ID del cliente
     * @param {Object} data - Dati aggiornati del cliente
     * @returns {Promise<Object>}
     */
    async updateClient(id, data) {
        const response = await api.put(`/clients/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un cliente
     * @param {number|string} id - ID del cliente
     * @returns {Promise<void>}
     */
    async deleteClient(id) {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    /**
     * Ottiene le statistiche sui clienti
     * @returns {Promise<Object>}
     */
    async getClientStats() {
        const response = await api.get('/clients/stats');
        return response.data;
    },
};

export default clientService;
