import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const toast = useToast();

    // Reindirizza alla dashboard se già autenticato
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    /**
     * Validazione client-side del form
     */
    const validateForm = () => {
        const newErrors = {};

        // Validazione email
        if (!email) {
            newErrors.email = 'L\'email è obbligatoria';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Inserisci un\'email valida';
        }

        // Validazione password
        if (!password) {
            newErrors.password = 'La password è obbligatoria';
        } else if (password.length < 6) {
            newErrors.password = 'La password deve essere di almeno 6 caratteri';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Gestione submit del form
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        // Validazione
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                toast.success('Accesso effettuato con successo!');
                navigate('/dashboard', { replace: true });
            } else {
                setGeneralError(result.message || 'Credenziali non valide');
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
            setGeneralError('Si è verificato un errore. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">CRM Homstudent</h2>
                    <p className="text-gray-600 mt-2">Accedi al tuo account</p>
                </div>

                {/* Alert per errori generali */}
                {generalError && (
                    <div className="mb-6">
                        <Alert
                            type="error"
                            dismissible
                            onDismiss={() => setGeneralError('')}
                        >
                            {generalError}
                        </Alert>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="nome@esempio.it"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        disabled={isLoading}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Inserisci la password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        disabled={isLoading}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Accedi
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Accesso riservato al personale autorizzato</p>
                </div>
            </div>

            <div className="p4 mt-[50px]">
                <img src="https://michelemincone.com/wp-content/uploads/2025/10/michelemincone_new_logo_alphachannel.png" alt="Michele Mincone Logo" className="h-6 mx-auto mb-2" style={{height: 40}} />
                <p className='mt-4 w-full text-center'>Software CRM realizzato da <b className="font-bold">Michele Mincone</b>.<br/>Stack software: <em>PHP 8.4</em>, <em>Laravel 11</em>, <em>React 18</em>, <em>Tailwind CSS 3</em>, <em>MariaDB 10.6</em></p>
            </div>
        </div>
    );
}
