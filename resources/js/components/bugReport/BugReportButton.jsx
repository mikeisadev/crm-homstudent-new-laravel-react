import { useState } from 'react';
import BugReportModal from './BugReportModal';

/**
 * BugReportButton Component
 *
 * Floating button fixed to bottom-right corner
 * Opens bug report modal when clicked
 * Features:
 * - Smooth hover animations
 * - Proper z-index for visibility
 * - Responsive on all screen sizes
 * - Accessible with ARIA labels
 */
export default function BugReportButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Floating Bug Report Button - Perfectly Circular */}
            <button
                onClick={handleOpenModal}
                className="fixed bottom-6 right-6 z-[9998] w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 group"
                aria-label="Segnala un bug"
                title="Hai trovato un bug? Segnalalo qui!"
            >
                {/* Bug Icon - Centered */}
                <i className="material-icons text-3xl">bug_report</i>

                {/* Tooltip on hover (optional enhancement) */}
                <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                    Segnala un bug
                </span>

                {/* Notification dot (optional - can be used to indicate new features) */}
                {/* <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 border-2 border-white"></span> */}
            </button>

            {/* Bug Report Modal */}
            <BugReportModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
