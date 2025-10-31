import { useState, useEffect } from 'react';

/**
 * OnboardingLoader Component
 *
 * Displays a full-screen loading animation with progress bar
 * and sequential status messages over 4.5 seconds
 */
export default function OnboardingLoader({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    // Loading messages as per requirements
    const loadingSteps = [
        'Caricamento in corso dei dati del CRM',
        'Caricamento degli eventi del calendario',
        'Caricamento delle anagrafiche con condomini, immobili, stanze e clienti',
        'Caricamento del flusso dei contratti',
        'Caricamento dei proprietari e dei fornitori',
        'Caricamento dei dati di gestione: caparre, disdette, bollette e sanzioni'
    ];

    const TOTAL_DURATION = 4500; // 4.5 seconds
    const STEP_DURATION = TOTAL_DURATION / loadingSteps.length; // ~750ms per step

    useEffect(() => {
        // Progress bar animation (smooth continuous progress)
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (100 / (TOTAL_DURATION / 50)); // Update every 50ms
                if (next >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return next;
            });
        }, 50);

        // Step-by-step message updates
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (next >= loadingSteps.length) {
                    clearInterval(stepInterval);
                    return prev;
                }
                return next;
            });
        }, STEP_DURATION);

        // Complete loading after 4.5 seconds
        const completeTimer = setTimeout(() => {
            onComplete();
        }, TOTAL_DURATION);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="w-full max-w-2xl px-8">
                {/* Logo or Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                        <i className="material-icons text-blue-600 text-4xl">business</i>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        CRM HomStudent
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Caricamento in corso...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="bg-blue-900 bg-opacity-50 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-100 ease-linear shadow-lg"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Current Status Message */}
                <div className="text-center min-h-[60px] flex items-center justify-center">
                    <p className="text-white text-lg font-medium animate-pulse">
                        {loadingSteps[currentStep]}
                    </p>
                </div>

                {/* Progress Percentage */}
                <div className="text-center mt-4">
                    <p className="text-blue-100 text-sm">
                        {Math.round(progress)}%
                    </p>
                </div>
            </div>
        </div>
    );
}
