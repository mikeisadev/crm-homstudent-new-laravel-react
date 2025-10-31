import { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

/**
 * Componente Toast Container per visualizzare le notifiche
 */
export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[10000] space-y-2 max-w-md">
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onDismiss={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

/**
 * Singolo Toast Item
 */
function ToastItem({ toast, onDismiss }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animazione di entrata
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onDismiss();
        }, 300);
    };

    const typeClasses = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconPaths = {
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };

    const animationClasses = isLeaving
        ? 'opacity-0 translate-x-full'
        : isVisible
        ? 'opacity-100 translate-x-0'
        : 'opacity-0 translate-x-full';

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out ${animationClasses} rounded-lg border p-4 shadow-lg ${typeClasses[toast.type]}`}
            role="alert"
        >
            <div className="flex items-start">
                <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d={iconPaths[toast.type]}></path>
                </svg>

                <div className="flex-1 text-sm font-medium">
                    {toast.message}
                </div>

                <button
                    type="button"
                    onClick={handleDismiss}
                    className="ml-3 -mr-1 flex-shrink-0 rounded-lg p-1.5 inline-flex hover:bg-black hover:bg-opacity-10 focus:outline-none"
                >
                    <span className="sr-only">Chiudi</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
