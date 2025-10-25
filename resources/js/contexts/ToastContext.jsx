import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Context per la gestione delle notifiche toast
 */
const ToastContext = createContext(null);

let toastId = 0;

/**
 * Provider per il contesto toast
 * Gestisce la visualizzazione delle notifiche
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    /**
     * Mostra una notifica toast
     * @param {string} message - Messaggio da visualizzare
     * @param {('success'|'error'|'warning'|'info')} type - Tipo di notifica
     * @param {number} duration - Durata in millisecondi (0 per permanente)
     * @returns {number} ID del toast
     */
    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = ++toastId;

        const toast = {
            id,
            message,
            type,
            timestamp: Date.now(),
        };

        setToasts(prev => [...prev, toast]);

        // Rimuovi automaticamente il toast dopo la durata specificata
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    /**
     * Mostra una notifica di successo
     * @param {string} message - Messaggio da visualizzare
     * @param {number} duration - Durata in millisecondi
     */
    const success = useCallback((message, duration = 5000) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    /**
     * Mostra una notifica di errore
     * @param {string} message - Messaggio da visualizzare
     * @param {number} duration - Durata in millisecondi
     */
    const error = useCallback((message, duration = 5000) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    /**
     * Mostra una notifica di warning
     * @param {string} message - Messaggio da visualizzare
     * @param {number} duration - Durata in millisecondi
     */
    const warning = useCallback((message, duration = 5000) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    /**
     * Mostra una notifica informativa
     * @param {string} message - Messaggio da visualizzare
     * @param {number} duration - Durata in millisecondi
     */
    const info = useCallback((message, duration = 5000) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    /**
     * Rimuove un toast specifico
     * @param {number} id - ID del toast da rimuovere
     */
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    /**
     * Rimuove tutti i toast
     */
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value = {
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
        clearAll,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
}

/**
 * Hook per utilizzare il contesto toast
 * @returns {Object} Contesto toast
 * @throws {Error} Se utilizzato fuori da ToastProvider
 */
export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast deve essere utilizzato all\'interno di un ToastProvider');
    }

    return context;
}

export default ToastContext;
