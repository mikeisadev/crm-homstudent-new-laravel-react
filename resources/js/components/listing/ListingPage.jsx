import { useState, useEffect } from 'react';
import api from '../../services/api';
import RegistryFormModal from '../registry/RegistryFormModal';
import Pagination from '../ui/Pagination';

/**
 * Reusable Listing Page Component
 *
 * Simple table listing with CRUD operations
 * Configuration-driven design pattern
 *
 * Features:
 * - Header with title and "Nuovo" button
 * - Table listing with dynamic columns
 * - Comprehensive pagination with per-page selector
 * - Edit and Delete actions per row
 * - Reuses RegistryFormModal for create/edit
 * - File upload support
 * - Responsive design
 *
 * @param {object} config - Configuration object
 * @returns {JSX.Element}
 */
export default function ListingPage({ config }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [dynamicOptions, setDynamicOptions] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationMeta, setPaginationMeta] = useState(null);

    /**
     * Fetch data from API with pagination
     */
    const fetchData = async (page = currentPage, itemsPerPage = perPage) => {
        setLoading(true);
        try {
            const response = await api.get(config.apiEndpoint, {
                params: {
                    page: page,
                    per_page: itemsPerPage
                }
            });

            const items = response.data.data[config.entityPlural] || response.data.data || [];
            const pagination = response.data.data.pagination || null;

            setData(items);
            setPaginationMeta(pagination);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load dynamic options for select fields
     */
    const loadDynamicOptions = async () => {
        const optionsToLoad = {};

        for (const field of config.formFields) {
            if (field.dynamicOptions) {
                try {
                    const response = await api.get(field.dynamicOptions.endpoint);
                    const items = response.data.data[field.dynamicOptions.dataKey] || [];
                    optionsToLoad[field.key] = items.map(item => ({
                        value: item.id,
                        label: field.dynamicOptions.labelFormat
                            ? field.dynamicOptions.labelFormat(item)
                            : item[field.dynamicOptions.labelKey]
                    }));
                } catch (error) {
                    console.error(`Error loading options for ${field.key}:`, error);
                    optionsToLoad[field.key] = [];
                }
            }
        }

        setDynamicOptions(optionsToLoad);
    };

    useEffect(() => {
        fetchData();
        loadDynamicOptions();
    }, []);

    /**
     * Handle page change
     */
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, perPage);
    };

    /**
     * Handle per-page change
     */
    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page
        fetchData(1, newPerPage);
    };

    /**
     * Handle create/update
     */
    const handleSave = async (formData, uploadedFiles) => {
        try {
            // Transform data if config provides a transformer
            let dataToSend = formData;
            if (config.transformBeforeSave) {
                dataToSend = config.transformBeforeSave(formData);
            }

            // Create FormData for file uploads
            const formDataObj = new FormData();

            // Append all form fields
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] !== null && dataToSend[key] !== undefined && dataToSend[key] !== '') {
                    formDataObj.append(key, dataToSend[key]);
                }
            });

            // Append files if any
            if (uploadedFiles) {
                Object.keys(uploadedFiles).forEach(key => {
                    if (uploadedFiles[key]) {
                        formDataObj.append(key, uploadedFiles[key]);
                    }
                });
            }

            if (editingItem) {
                await api.post(`${config.apiEndpoint}/${editingItem.id}`, formDataObj, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: { _method: 'PUT' }
                });
            } else {
                await api.post(config.apiEndpoint, formDataObj, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchData();
            setIsModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving:', error);
            throw error;
        }
    };

    /**
     * Handle delete
     */
    const handleDelete = async (item) => {
        if (!confirm(`Sei sicuro di voler eliminare questo record?`)) {
            return;
        }

        try {
            await api.delete(`${config.apiEndpoint}/${item.id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Errore durante l\'eliminazione');
        }
    };

    /**
     * Handle edit
     */
    const handleEdit = (item) => {
        // Transform item for edit if config provides a transformer
        const itemToEdit = config.transformForEdit ? config.transformForEdit(item) : item;
        setEditingItem(itemToEdit);
        setIsModalOpen(true);
    };

    /**
     * Handle new item
     */
    const handleNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    /**
     * Handle file viewing with authenticated blob URL
     */
    const handleFileView = async (item, fileType) => {
        try {
            // Make authenticated request for the file
            const response = await api.get(
                `${config.apiEndpoint}/${item.id}/view/${fileType}`,
                {
                    responseType: 'blob' // Important: get response as blob
                }
            );

            // Create blob URL from response
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/pdf'
            });
            const blobUrl = URL.createObjectURL(blob);

            // Open in new tab
            const newWindow = window.open(blobUrl, '_blank');

            // Clean up blob URL after window loads (or after 1 minute as fallback)
            if (newWindow) {
                newWindow.onload = () => {
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                };
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Errore durante la visualizzazione del file');
        }
    };

    /**
     * Render cell content based on column configuration
     */
    const renderCellContent = (item, column) => {
        const value = column.getValue ? column.getValue(item) : item[column.key];

        // Handle file columns
        if (column.hasFile) {
            if (!value) return '-';
            return (
                <button
                    onClick={() => handleFileView(item, column.fileType)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="Visualizza file"
                >
                    <i className="material-icons text-base align-middle">
                        {column.fileType === 'invoice' ? 'description' : 'receipt'}
                    </i>
                </button>
            );
        }

        if (column.render) {
            return column.render(value, item);
        }

        if (value === null || value === undefined) {
            return '-';
        }

        return value;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">
                    <i className="material-icons align-middle mr-2">{config.icon}</i>
                    {config.title}
                </h1>
                <button
                    onClick={handleNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition"
                >
                    <i className="material-icons text-sm mr-1">add</i>
                    Nuovo
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <i className="material-icons text-4xl animate-spin">refresh</i>
                        <p className="mt-2">Caricamento...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <i className="material-icons text-4xl">inbox</i>
                        <p className="mt-2">Nessun record trovato</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {config.columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        {config.columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {renderCellContent(item, column)}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                title="Modifica"
                                            >
                                                <i className="material-icons text-base">edit</i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Elimina"
                                            >
                                                <i className="material-icons text-base">delete</i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && paginationMeta && (
                    <Pagination
                        pagination={paginationMeta}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        loading={loading}
                        entityName={config.titleSingular || 'elemento'}
                        entityNamePlural={config.title || 'elementi'}
                    />
                )}
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <RegistryFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSave={handleSave}
                    config={config}
                    item={editingItem}
                    dynamicOptions={dynamicOptions}
                />
            )}
        </div>
    );
}
