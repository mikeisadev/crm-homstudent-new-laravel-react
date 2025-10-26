/**
 * Pagination Component
 * Reusable pagination controls with page numbers and navigation
 *
 * @param {object} pagination - Pagination metadata from API
 * @param {number} pagination.current_page - Current page number
 * @param {number} pagination.last_page - Total number of pages
 * @param {number} pagination.total - Total number of items
 * @param {number} pagination.from - First item number on current page
 * @param {number} pagination.to - Last item number on current page
 * @param {function} onPageChange - Callback when page changes
 * @param {boolean} loading - Whether data is loading
 * @returns {JSX.Element}
 */
export default function Pagination({ pagination, onPageChange, loading = false }) {
    if (!pagination || pagination.last_page <= 1) {
        return null; // Don't show pagination if only 1 page or less
    }

    const { current_page, last_page, total, from, to } = pagination;

    /**
     * Generate array of page numbers to display
     * Shows: [1] ... [4] [5] [6] ... [10]
     * Always show first, last, current, and 2 pages around current
     */
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7; // Maximum page buttons to show

        if (last_page <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate range around current page
            let startPage = Math.max(2, current_page - 1);
            let endPage = Math.min(last_page - 1, current_page + 1);

            // Adjust range if at the beginning
            if (current_page <= 3) {
                endPage = 4;
            }

            // Adjust range if at the end
            if (current_page >= last_page - 2) {
                startPage = last_page - 3;
            }

            // Add ellipsis if needed
            if (startPage > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (endPage < last_page - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(last_page);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
            {/* Info: showing X-Y of Z */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">
                    Mostrando <span className="font-medium">{from}</span> - <span className="font-medium">{to}</span> di{' '}
                    <span className="font-medium">{total}</span> {total === 1 ? 'cliente' : 'clienti'}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1 || loading}
                    className={`
                        px-3 py-1 rounded text-sm font-medium transition-colors
                        ${
                            current_page === 1 || loading
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-300'
                        }
                    `}
                >
                    <i className="material-icons text-sm">chevron_left</i>
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-1 text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={loading}
                            className={`
                                px-3 py-1 rounded text-sm font-medium transition-colors min-w-[32px]
                                ${
                                    page === current_page
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-300'
                                }
                                ${loading ? 'cursor-not-allowed opacity-50' : ''}
                            `}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page || loading}
                    className={`
                        px-3 py-1 rounded text-sm font-medium transition-colors
                        ${
                            current_page === last_page || loading
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-300'
                        }
                    `}
                >
                    <i className="material-icons text-sm">chevron_right</i>
                </button>
            </div>
        </div>
    );
}
