import axios from 'axios';

/**
 * Axios instance configurata per il backend API
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request interceptor - Aggiunge il token di autenticazione alle richieste
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Gestisce errori globali e redirect
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gestione errore 401 - Non autenticato
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Gestione errore 403 - Non autorizzato
        if (error.response && error.response.status === 403) {
            console.error('Accesso negato: non hai i permessi necessari');
        }

        // Gestione errore 404 - Risorsa non trovata
        if (error.response && error.response.status === 404) {
            console.error('Risorsa non trovata');
        }

        // Gestione errore 500 - Errore del server
        if (error.response && error.response.status >= 500) {
            console.error('Errore del server. Riprova più tardi.');
        }

        // Gestione errori di rete
        if (!error.response) {
            console.error('Errore di connessione. Verifica la tua connessione internet.');
        }

        return Promise.reject(error);
    }
);

export default api;
