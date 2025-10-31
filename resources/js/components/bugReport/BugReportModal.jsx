import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

/**
 * BugReportModal Component
 *
 * Modal for submitting bug reports with:
 * - Description textarea (min 10, max 5000 chars)
 * - Current date display
 * - Automatic capture of browser info and URL
 * - Toast notifications for feedback
 */
export default function BugReportModal({ isOpen, onClose }) {
    const [bugDescription, setBugDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [touched, setTouched] = useState(false);
    const toast = useToast();

    // Get current date formatted in Italian
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setBugDescription(value);
        setCharacterCount(value.length);

        // Mark field as touched after user starts typing
        if (!touched && value.length > 0) {
            setTouched(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark as touched to show validation errors
        setTouched(true);

        // Client-side validation
        if (bugDescription.trim().length < 10) {
            toast.error('La descrizione deve contenere almeno 10 caratteri');
            return;
        }

        if (bugDescription.length > 5000) {
            toast.error('La descrizione non può superare i 5000 caratteri');
            return;
        }

        setIsSubmitting(true);

        try {
            // Capture browser and environment information
            const browserInfo = navigator.userAgent;
            const url = window.location.href;
            const reportDate = new Date().toISOString();

            // Submit bug report
            const response = await api.post('/bug-reports', {
                bug_description: bugDescription.trim(),
                report_date: reportDate,
                browser_info: browserInfo,
                url: url
            });

            // Show success message
            toast.success('Bug report inviato con successo! Grazie per la segnalazione.');

            // Reset form and close modal
            setBugDescription('');
            setCharacterCount(0);
            setTouched(false);
            onClose();

        } catch (error) {
            console.error('Error submitting bug report:', error);

            // Handle specific error cases
            if (error.response?.status === 422) {
                toast.error('Errore di validazione: verifica i dati inseriti');
            } else if (error.response?.status === 401) {
                toast.error('Sessione scaduta. Effettua nuovamente il login');
            } else {
                toast.error('Errore nell\'invio del bug report. Riprova più tardi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setBugDescription('');
            setCharacterCount(0);
            setTouched(false);
            onClose();
        }
    };

    // Validation state
    const isDescriptionTooShort = touched && characterCount > 0 && characterCount < 10;
    const isDescriptionTooLong = characterCount > 5000;
    const hasValidationError = isDescriptionTooShort || isDescriptionTooLong;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Hai trovato un bug? Puoi segnarlarlo da qui"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Description */}
                <div className="text-sm text-gray-600 mb-4">
                    Segnala il bug tramite questo popup. Puoi descrivere il problema che hai riscontrato nell'area di testo qui sotto. Lo sviluppatore di questo progetto vedrà il tuo bug report.
                </div>

                {/* Textarea Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrivici il problema *
                    </label>
                    <textarea
                        value={bugDescription}
                        onChange={handleDescriptionChange}
                        onBlur={() => setTouched(true)}
                        rows={8}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 resize-none transition-colors ${
                            hasValidationError
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="Descrivi in dettaglio il bug che hai riscontrato..."
                        disabled={isSubmitting}
                        required
                    />

                    {/* Inline Validation Error Message */}
                    {hasValidationError && (
                        <div className="mt-2 flex items-start space-x-2 text-red-600">
                            <i className="material-icons text-sm mt-0.5">error</i>
                            <span className="text-sm font-medium">
                                {isDescriptionTooShort && 'La descrizione deve contenere almeno 10 caratteri'}
                                {isDescriptionTooLong && 'La descrizione non può superare i 5000 caratteri'}
                            </span>
                        </div>
                    )}

                    {/* Character Counter */}
                    <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${isDescriptionTooShort ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            Minimo 10 caratteri
                        </div>
                        <div className={`text-xs ${isDescriptionTooLong ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                            {characterCount} / 5000 caratteri
                        </div>
                    </div>
                </div>

                {/* Report Date */}
                <div className="text-xs text-gray-500 italic">
                    Data di segnalazione: {getCurrentDate()}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="secondary"
                        disabled={isSubmitting}
                    >
                        Annulla
                    </Button>
                    <Button
                        type="submit"
                        variant="danger"
                        loading={isSubmitting}
                        disabled={isSubmitting || bugDescription.trim().length < 10 || characterCount > 5000}
                    >
                        {isSubmitting ? 'Invio in corso...' : 'Invia report'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
