import { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import RegistryFormModal from '../registry/RegistryFormModal';
import api from '../../services/api';

/**
 * Reusable Kanban Board Component
 *
 * Displays items in a kanban-style board with status columns
 * Supports drag-and-drop, creating, editing, and deleting items
 * Status pills are clickable to scroll to corresponding column
 *
 * @param {object} config - Kanban configuration (from fluxKanbanConfig.js)
 * @param {function} onRefresh - Optional callback when data changes
 */
export default function KanbanBoard({ config, onRefresh }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    // Refs for scrolling functionality
    const scrollContainerRef = useRef(null);
    const columnRefs = useRef({});

    /**
     * Handle horizontal scroll with mouse wheel
     * Converts vertical wheel events to horizontal scroll
     */
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e) => {
            // Only handle wheel events when there's horizontal overflow
            if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                // Prevent default vertical scroll
                e.preventDefault();

                // Apply horizontal scroll
                // deltaY is the vertical scroll amount, we convert it to horizontal
                scrollContainer.scrollLeft += e.deltaY;
            }
        };

        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    /**
     * Load kanban items from API
     */
    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await api.get(config.apiEndpoint);
            const data = response.data.data;

            // Extract items based on endpoint structure
            const entityKey = config.entityPlural;
            const itemsArray = data[entityKey] || data || [];

            setItems(itemsArray);
        } catch (error) {
            console.error('Error loading kanban items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [config.apiEndpoint]);

    /**
     * Handle opening modal for new item
     */
    const handleNew = () => {
        setSelectedItem(null);
        setModalOpen(true);
    };

    /**
     * Handle opening modal for editing item
     */
    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    /**
     * Handle closing modal
     */
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    /**
     * Handle saving item (create or update)
     */
    const handleSave = async () => {
        await loadItems();
        if (onRefresh) onRefresh();
        handleCloseModal();
    };

    /**
     * Handle deleting an item
     */
    const handleDelete = async (item) => {
        if (!confirm(`Sei sicuro di voler eliminare questo ${config.titleSingular.toLowerCase()}?`)) {
            return;
        }

        try {
            await api.delete(`${config.apiEndpoint}/${item.id}`);
            await loadItems();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Errore durante l\'eliminazione');
        }
    };

    /**
     * Handle drag start
     */
    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    /**
     * Handle drag over (allow drop)
     */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    /**
     * Handle drop - update item status
     */
    const handleDrop = async (e, status) => {
        e.preventDefault();

        if (!draggedItem) return;

        // Don't update if dropped in same status
        if (draggedItem.status === status) {
            setDraggedItem(null);
            return;
        }

        try {
            // Update item status via API
            await api.put(`${config.apiEndpoint}/${draggedItem.id}`, {
                ...draggedItem,
                status: status
            });

            // Reload items
            await loadItems();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Errore durante l\'aggiornamento dello stato');
        } finally {
            setDraggedItem(null);
        }
    };

    /**
     * Get items for a specific status
     */
    const getItemsByStatus = (status) => {
        return items.filter(item => item.status === status);
    };

    /**
     * Get count for a specific status
     */
    const getStatusCount = (status) => {
        return getItemsByStatus(status).length;
    };

    /**
     * Scroll to a specific status column
     * Triggered when clicking status pill in header
     */
    const scrollToColumn = (statusKey) => {
        const columnElement = columnRefs.current[statusKey];
        if (columnElement && scrollContainerRef.current) {
            // Smooth scroll to column
            columnElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                {/* Left: Title + New Button */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-blue-600">{config.title}</h1>
                    <Button
                        onClick={handleNew}
                        variant="primary"
                        size="sm"
                    >
                        {config.newButtonLabel}
                    </Button>
                </div>

                {/* Right: Status Pills - Clickable to scroll to column */}
                <div className="flex items-center gap-2">
                    {config.statuses.map((status) => (
                        <button
                            key={status.key}
                            onClick={() => scrollToColumn(status.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor} hover:opacity-90 transition-opacity cursor-pointer`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Kanban Columns - Horizontally scrollable */}
            <div ref={scrollContainerRef} className="flex-1 overflow-x-auto">
                <div className="h-full p-4 flex gap-4" style={{ minWidth: 'max-content' }}>
                    {config.statuses.map((status) => (
                        <KanbanColumn
                            key={status.key}
                            status={status}
                            items={getItemsByStatus(status.key)}
                            count={getStatusCount(status.key)}
                            config={config}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isBeingDraggedOver={draggedItem?.status !== status.key}
                            columnRef={(el) => columnRefs.current[status.key] = el}
                        />
                    ))}
                </div>
            </div>

            {/* Modal for create/edit */}
            <RegistryFormModal
                config={config}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                item={selectedItem}
            />

            {/* Loading state */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-gray-600">Caricamento...</div>
                </div>
            )}
        </div>
    );
}

/**
 * Kanban Column Component
 */
function KanbanColumn({
    status,
    items,
    count,
    config,
    onDragStart,
    onDragOver,
    onDrop,
    onEdit,
    onDelete,
    isBeingDraggedOver,
    columnRef
}) {
    // Get status color for circle indicator
    const getStatusColorClass = () => {
        switch (status.color) {
            case 'red':
                return 'bg-red-500';
            case 'orange':
                return 'bg-orange-500';
            case 'green':
                return 'bg-green-500';
            case 'yellow':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div
            ref={columnRef}
            className="flex-shrink-0 w-80 bg-gray-100 rounded-lg"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status.key)}
        >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColorClass()}`}></div>
                    <h3 className="font-medium text-gray-900">
                        {status.label} ({count})
                    </h3>
                </div>
            </div>

            {/* Column Body - Scrollable */}
            <div className="p-3 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                {items.map((item) => (
                    <KanbanCard
                        key={item.id}
                        item={item}
                        config={config}
                        onDragStart={onDragStart}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}

                {items.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        Nessun elemento
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Kanban Card Component
 */
function KanbanCard({ item, config, onDragStart, onEdit, onDelete }) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onClick={() => onEdit(item)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200 relative group"
        >
            {/* Card Title */}
            <div className="font-medium text-gray-900 mb-3">
                {config.card.getTitle(item)}
            </div>

            {/* Card Fields */}
            <div className="space-y-2 text-sm text-gray-600">
                {config.card.fields.map((field, index) => (
                    <div key={index}>
                        {field.label && <span className="font-medium">{field.label}: </span>}
                        {field.format(item[field.key], item)}
                    </div>
                ))}
            </div>

            {/* Delete Button - Shows on hover */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1.5 rounded"
            >
                <span className="material-icons text-sm">delete</span>
            </button>
        </div>
    );
}
