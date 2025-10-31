import { useEffect } from 'react';

/**
 * WelcomeScreen Component
 *
 * Final welcome overlay showing tech stack used
 * Auto-closes after 5 seconds or manual click
 */
export default function WelcomeScreen({ onComplete }) {
    const AUTO_CLOSE_DURATION = 5000; // 5 seconds

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, AUTO_CLOSE_DURATION);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Tech stack items as per requirements
    const techStack = [
        'PHP 8.4',
        'Laravel 11',
        'MariaDB (latest)',
        'React',
        'React Query',
        'React Router',
        'Tailwind CSS',
        'Laravel Sanctum API'
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm cursor-pointer"
            onClick={onComplete}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 px-12 py-16 text-center animate-fadeIn">
                {/* Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-xl mb-6">
                        <i className="material-icons text-white text-5xl">celebration</i>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Benvenuto su CRM Homstudent remastered
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-lg mb-8">
                        Il tuo sistema di gestione è stato completamente rinnovato
                    </p>
                </div>

                {/* Tech Stack List */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl px-8 py-6 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-4">
                        Stack Tecnologico
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {techStack.map((tech, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200"
                            >
                                <i className="material-icons text-blue-600 text-sm mr-2">check_circle</i>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Close hint */}
                <div className="mt-8">
                    <p className="text-gray-400 text-sm">
                        Clicca ovunque per iniziare o attendi 5 secondi
                    </p>
                </div>
            </div>
        </div>
    );
}
