/**
 * Reusable FormField component with centered label
 * Used for consistent form field styling across the application
 *
 * @param {string} label - Field label text
 * @param {ReactNode} children - Field input component
 * @param {string} error - Error message to display
 * @param {boolean} required - Whether field is required
 * @returns {JSX.Element}
 */
export default function FormField({ label, children, error, required = false }) {
    return (
        <div className="flex flex-col">
            {label && (
                <label className="text-sm font-medium text-gray-700 mb-2 text-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && (
                <span className="text-xs text-red-500 mt-1 text-center">{error}</span>
            )}
        </div>
    );
}
