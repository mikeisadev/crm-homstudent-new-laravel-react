import { useOnboarding } from '../../hooks/useOnboarding';

/**
 * RestartOnboardingButton Component
 *
 * Floating button to restart onboarding experience
 * Features:
 * - Positioned left of bug report button
 * - Circular arrow icon (refresh/restart)
 * - Resets localStorage and triggers onboarding
 * - Confirmation dialog before restart
 * - Tooltip on hover
 * - Perfectly circular design
 */
export default function RestartOnboardingButton() {
    const { resetOnboarding } = useOnboarding();

    const handleRestart = () => {
        // Confirm before restarting
        const confirmed = window.confirm(
            'Vuoi riavviare il tour di onboarding?\n\n' +
            'Questo ti mostrerà nuovamente la presentazione del CRM.'
        );

        if (confirmed) {
            // Reset onboarding state
            resetOnboarding();

            // Reload page to trigger onboarding
            window.location.reload();
        }
    };

    return (
        <button
            onClick={handleRestart}
            className="fixed bottom-6 right-24 z-[9998] w-16 h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 group"
            aria-label="Riavvia onboarding"
            title="Riavvia il tour di onboarding"
        >
            {/* Refresh/Restart Icon */}
            <i className="material-icons text-3xl">refresh</i>

            {/* Tooltip on hover */}
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                Riavvia onboarding
            </span>
        </button>
    );
}
