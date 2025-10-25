import api from './api';

/**
 * Servizio per la gestione dell'autenticazione
 */
const authService = {
    /**
     * Effettua il login dell'utente
     * @param {string} email - Email dell'utente
     * @param {string} password - Password dell'utente
     * @returns {Promise<{token: string, user: Object}>}
     */
    async login(email, password) {
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    /**
     * Effettua il logout dell'utente
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await api.post('/logout');
        } finally {
            this.removeToken();
            localStorage.removeItem('user');
        }
    },

    /**
     * Ottiene i dati dell'utente corrente
     * @returns {Promise<Object>}
     */
    async getCurrentUser() {
        const response = await api.get('/me');
        return response.data;
    },

    /**
     * Ottiene il token dal localStorage
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('auth_token');
    },

    /**
     * Salva il token nel localStorage
     * @param {string} token - Token di autenticazione
     */
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    /**
     * Rimuove il token dal localStorage
     */
    removeToken() {
        localStorage.removeItem('auth_token');
    },

    /**
     * Verifica se l'utente è autenticato
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;
