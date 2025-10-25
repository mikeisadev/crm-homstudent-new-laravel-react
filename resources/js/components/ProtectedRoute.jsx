import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

/**
 * Componente per proteggere le rotte che richiedono autenticazione
 * Reindirizza alla pagina di login se l'utente non è autenticato
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Mostra loading durante il controllo dell'autenticazione
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner
                    size="lg"
                    message="Caricamento..."
                />
            </div>
        );
    }

    // Reindirizza a /login se non autenticato
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Renderizza i children se autenticato
    return children;
}
