import { useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Pagination from '../ui/Pagination';

/**
 * Generic Registry List Component
 *
 * Displays searchable/filterable list with server-side pagination
 * Configuration-driven to work with any entity type
 *
 * @param {object} config - Registry configuration
 * @param {Array} items - Array of entity objects
 * @param {number|null} selectedItemId - ID of selected item
 * @param {function} onItemSelect - Callback when item is selected
 * @param {function} onNewItem - Callback for new item button
 * @param {boolean} loading - Whether items are loading
 * @param {string} searchTerm - Current search term (controlled by parent)
 * @param {function} onSearchChange - Callback when search changes
 * @param {object} filters - Current filter values
 * @param {function} onFilterChange - Callback when filter changes
 * @param {object} pagination - Pagination metadata from API
 * @param {function} onPageChange - Callback when page changes
 * @returns {JSX.Element}
 */
export default function RegistryList({
    config,
    items,
    selectedItemId,
    onItemSelect,
    onNewItem,
    loading = false,
    searchTerm = '',
    onSearchChange,
    filters = {},
    onFilterChange,
    pagination,
    onPageChange,
}) {
    // Ref for search input to maintain focus
    const searchInputRef = useRef(null);
    const shouldMaintainFocus = useRef(false);
    const cursorPosition = useRef(0);

    // Handle input changes and track that we should maintain focus
    const handleSearchInputChange = (e) => {
        shouldMaintainFocus.current = true;
        cursorPosition.current = e.target.selectionStart;
        onSearchChange(e.target.value);
    };

    // Handle when user clicks away from search input
    const handleSearchInputBlur = () => {
        shouldMaintainFocus.current = false;
    };

    // Restore focus after items update if user was typing
    useEffect(() => {
        if (shouldMaintainFocus.current && searchInputRef.current) {
            // Use setTimeout to ensure DOM has updated
            setTimeout(() => {
                if (searchInputRef.current && shouldMaintainFocus.current) {
                    searchInputRef.current.focus();
                    searchInputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
                }
            }, 0);
        }
    }, [items, loading]);

    /**
     * Render filter controls based on configuration
     */
    const renderFilters = () => {
        if (!config.list.filters || config.list.filters.length === 0) {
            return null;
        }

        return config.list.filters.map((filter) => {
            if (filter.type === 'radio') {
                return (
                    <div key={filter.key} className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-gray-700">{filter.label}:</span>
                        {filter.options.map((option) => (
                            <label key={option.value} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={filter.key}
                                    value={option.value}
                                    checked={filters[filter.key] === option.value}
                                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                    className="mr-2"
                                    disabled={loading}
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                        {filters[filter.key] !== filter.defaultValue && (
                            <button
                                onClick={() => onFilterChange(filter.key, filter.defaultValue)}
                                className="text-blue-500 text-xs underline"
                                disabled={loading}
                            >
                                Mostra tutti
                            </button>
                        )}
                    </div>
                );
            }

            // Add more filter types here (select, checkbox, etc.) as needed
            return null;
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{config.title}</h2>
                    <Button
                        onClick={onNewItem}
                        variant="primary"
                        className="flex items-center gap-2"
                    >
                        <i className="material-icons text-sm">{config.icon}</i>
                        NUOVO
                    </Button>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <Input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onBlur={handleSearchInputBlur}
                        placeholder={config.list.searchPlaceholder}
                        className="w-full"
                        disabled={loading}
                    />
                </div>

                {/* Filters */}
                {renderFilters()}
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <i className="material-icons text-4xl mb-2">{config.icon}_off</i>
                        <p>Nessun {config.titleSingular.toLowerCase()} trovato</p>
                        {(searchTerm || Object.values(filters).some(v => v)) && (
                            <p className="text-sm mt-2">Prova a modificare i filtri di ricerca</p>
                        )}
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onItemSelect(item.id)}
                            className={`border-b border-gray-200 p-4 cursor-pointer transition-colors ${
                                selectedItemId === item.id
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="font-medium">
                                {config.list.getPrimaryText(item)}
                            </div>
                            {config.list.getSecondaryText(item) && (
                                <div
                                    className={`text-sm mt-1 ${
                                        selectedItemId === item.id
                                            ? 'text-blue-100'
                                            : 'text-blue-500'
                                    }`}
                                >
                                    {config.list.getSecondaryText(item)}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && pagination && (
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    loading={loading}
                    entityName={config.titleSingular.toLowerCase()}
                    entityNamePlural={config.title.toLowerCase()}
                />
            )}
        </div>
    );
}
