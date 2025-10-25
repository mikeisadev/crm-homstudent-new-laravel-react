import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Context per la gestione dell'autenticazione
 */
const AuthContext = createContext(null);

/**
 * Provider per il contesto di autenticazione
 * Gestisce lo stato dell'utente e le operazioni di login/logout
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Verifica se l'utente è autenticato al caricamento
     */
    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getToken();

            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    if (response.success && response.data) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    } else {
                        authService.removeToken();
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Errore durante il recupero dei dati utente:', error);
                    authService.removeToken();
                    localStorage.removeItem('user');
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Effettua il login dell'utente
     * @param {string} email - Email dell'utente
     * @param {string} password - Password dell'utente
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            if (response.success && response.data) {
                const { token, user: userData } = response.data;

                // Salva il token e i dati utente
                authService.setToken(token);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);

                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.message || 'Credenziali non valide'
                };
            }
        } catch (error) {
            console.error('Errore durante il login:', error);

            let message = 'Errore durante il login. Riprova.';

            if (error.response) {
                if (error.response.status === 401) {
                    message = 'Credenziali non valide';
                } else if (error.response.status === 422) {
                    message = 'Dati non validi. Controlla email e password.';
                } else if (error.response.data && error.response.data.message) {
                    message = error.response.data.message;
                }
            } else if (error.request) {
                message = 'Impossibile connettersi al server. Verifica la connessione.';
            }

            return { success: false, message };
        }
    };

    /**
     * Effettua il logout dell'utente
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Errore durante il logout:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    /**
     * Aggiorna i dati dell'utente corrente
     */
    const refreshUser = async () => {
        try {
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento dei dati utente:', error);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook per utilizzare il contesto di autenticazione
 * @returns {Object} Contesto di autenticazione
 * @throws {Error} Se utilizzato fuori da AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
    }

    return context;
}

export default AuthContext;
