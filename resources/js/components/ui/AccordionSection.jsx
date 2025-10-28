import { useState } from 'react';

/**
 * AccordionSection Component
 * Reusable collapsible section with smooth animations
 *
 * @param {string} title - Section title
 * @param {boolean} defaultOpen - Whether section is open by default
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function AccordionSection({ title, defaultOpen = false, children, hideOverflow = true, className = '' }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`border-b border-gray-200 ${className}`}>
            {/* Accordion Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 px-2 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-gray-700 font-semibold text-base">{title}</span>
                <i
                    className={`material-icons text-blue-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                >
                    arrow_drop_up
                </i>
            </button>

            {/* Accordion Content */}
            <div
                className={`transition-all duration-300 ease-in-out 
                    ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                    ${hideOverflow ? `overflow-hidden` : '' }`}
            >
                <div className="pb-4">{children}</div>
            </div>
        </div>
    );
}
