/**
 * Pagination Component
 * Comprehensive pagination controls with:
 * - Page numbers with smart ellipsis display
 * - Previous/Next navigation
 * - Per-page selector
 * - Results information display
 * - Responsive design for mobile and desktop
 * - Loading states
 *
 * @param {object} pagination - Pagination metadata from API
 * @param {number} pagination.current_page - Current page number
 * @param {number} pagination.last_page - Total number of pages
 * @param {number} pagination.per_page - Items per page
 * @param {number} pagination.total - Total number of items
 * @param {number} pagination.from - First item number on current page
 * @param {number} pagination.to - Last item number on current page
 * @param {function} onPageChange - Callback when page changes (page: number)
 * @param {function} onPerPageChange - Callback when per-page changes (perPage: number)
 * @param {boolean} loading - Whether data is loading
 * @param {array} perPageOptions - Available per-page options (default: [10, 25, 50, 100])
 * @param {string} entityName - Name of entity (singular) for display text
 * @param {string} entityNamePlural - Name of entity (plural) for display text
 * @returns {JSX.Element}
 */
export default function Pagination({
    pagination,
    onPageChange,
    onPerPageChange = null,
    loading = false,
    perPageOptions = [10, 25, 50, 100],
    entityName = 'elemento',
    entityNamePlural = 'elementi'
}) {
    // Don't render if no data
    if (!pagination || pagination.total === 0) {
        return null;
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

    /**
     * Handle per-page change
     */
    const handlePerPageChange = (e) => {
        if (!onPerPageChange || loading) return;

        const newPerPage = parseInt(e.target.value, 10);
        if (newPerPage !== pagination.per_page) {
            onPerPageChange(newPerPage);
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Results Info + Per-Page Selector */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{from || 0}</span> a{' '}
                        <span className="font-medium">{to || 0}</span> di{' '}
                        <span className="font-medium">{total}</span> {total === 1 ? entityName : entityNamePlural}
                    </div>

                    {/* Per Page Selector */}
                    {onPerPageChange && pagination.per_page && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="per-page" className="text-sm text-gray-700">
                                Per pagina:
                            </label>
                            <select
                                id="per-page"
                                value={pagination.per_page}
                                onChange={handlePerPageChange}
                                disabled={loading}
                                className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {perPageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Right: Pagination Controls */}
                <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1 || loading}
                    className={`
                        px-3 py-1 rounded text-sm font-medium transition-colors
                        ${
                            current_page === 1 || loading
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                        }
                    `}
                    title="Pagina precedente"
                >
                    <i className="material-icons text-sm">chevron_left</i>
                </button>

                {/* Page Numbers - Hidden on small screens */}
                <div className="hidden sm:flex items-center gap-1">
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
                                            ? 'bg-blue-600 text-white border border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                                    }
                                    ${loading ? 'cursor-not-allowed opacity-50' : ''}
                                `}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile: Current Page Display */}
                <div className="sm:hidden px-3 py-1 text-sm text-gray-700 font-medium">
                    Pagina {current_page} di {last_page}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page || loading}
                    className={`
                        px-3 py-1 rounded text-sm font-medium transition-colors
                        ${
                            current_page === last_page || loading
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                        }
                    `}
                    title="Pagina successiva"
                >
                    <i className="material-icons text-sm">chevron_right</i>
                </button>
                </div>
            </div>
        </div>
    );
}
