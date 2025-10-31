import { useState } from 'react';

/**
 * OnboardingModal Component
 *
 * Multi-step modal showcasing the new CRM features and migration
 * 3 slides with navigation buttons
 */
export default function OnboardingModal({ onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slide content as per requirements
    const slides = [
        {
            title: 'CRM HomStudent è stato migrato a un nuovo stack tecnologico',
            description: 'CRM Homstudent è stato ridisegnato e risviluppato su PHP 8.4 con Laravel 11. Il suo database è stato riscritto e ristrutturato usando le "migrations" di Laravel e tutte le relazioni tra entità sono state ridefinite. Ad esempio i clienti hanno correlazioni dirette sui propri contratti, proposte o documenti. Lo stesso vale per tutte le altre entità presenti: stanze, immobili, condomini eccetera.',
            icon: 'upgrade'
        },
        {
            title: 'Nuova architettura e maggiore sicurezza',
            description: 'Il CRM è stato rifatto in Laravel seguendo l\'architettura MVC per le web app. Sono state seguite tutte le best practices possibili per garantire maggiore sicurezza, scalabilità, manutenibilità del codice e modularità. Questo consente di rendere questo software sostenibile e mantenibile nel lungo termine.',
            icon: 'security'
        },
        {
            title: 'Frontend migrato a React e Tailwind',
            description: 'Il vecchio frontend del CRM HomStudent è stato ridefinito come una moderna SPA (Single Page Application) o Web App. Questo è stato fatto utilizzando React, React Routing, React Query e Tailwind. Inoltre la user interface e il layout sono stati rinfrescati per quanto possibile e recuperabile rispetto al vecchio progetto.',
            icon: 'design_services'
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === slides.length - 1;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-fadeIn">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <i className="material-icons text-white text-2xl">
                                    {slides[currentSlide].icon}
                                </i>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-medium">
                                    Novità {currentSlide + 1} di {slides.length}
                                </p>
                                <h2 className="text-2xl font-bold text-white">
                                    {slides[currentSlide].title}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="px-8 py-8">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-2 pb-6">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'w-8 bg-blue-600'
                                    : 'w-2 bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Modal Footer - Navigation Buttons */}
                <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-200">
                    <button
                        onClick={handleBack}
                        disabled={isFirstSlide}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isFirstSlide
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <i className="material-icons text-xl">arrow_back</i>
                        <span>Indietro</span>
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <span>{isLastSlide ? 'Inizia' : 'Avanti'}</span>
                        <i className="material-icons text-xl">
                            {isLastSlide ? 'done' : 'arrow_forward'}
                        </i>
                    </button>
                </div>
            </div>
        </div>
    );
}
