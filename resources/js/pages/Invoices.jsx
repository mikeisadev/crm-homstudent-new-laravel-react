import { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import InvoiceModal from '../components/invoices/InvoiceModal';
import { INVOICE_TYPES } from '../data/invoiceConstants';

/**
 * Invoices (Bollette) Main Listing Page
 *
 * Shows all invoices across all properties
 * Features:
 * - Paginated table listing
 * - Create, edit, delete invoices
 * - View PDF files
 * - Search functionality
 */
export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationMeta, setPaginationMeta] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, [currentPage, perPage, searchQuery]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/invoices', {
                params: {
                    page: currentPage,
                    per_page: perPage,
                    search: searchQuery || undefined
                }
            });

            setInvoices(response.data.data.invoices || []);
            setPaginationMeta(response.data.data.pagination || null);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInvoice = () => {
        setSelectedInvoice(null);
        setShowModal(true);
    };

    const handleEditInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    const handleSaveInvoice = async (formData, isEdit) => {
        try {
            if (isEdit && selectedInvoice) {
                await api.put(`/invoices/${selectedInvoice.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/invoices', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            await fetchInvoices();
            setShowModal(false);
            setSelectedInvoice(null);
        } catch (error) {
            console.error('Error saving invoice:', error);
            throw error;
        }
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (!confirm('Sei sicuro di voler eliminare questa bolletta?')) {
            return;
        }

        try {
            await api.delete(`/invoices/${invoiceId}`);
            await fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Errore nell\'eliminazione della bolletta');
        }
    };

    const handleViewPdf = async (invoice) => {
        if (!invoice.file_path) {
            alert('Nessun file disponibile per questa bolletta');
            return;
        }

        try {
            const response = await api.get(`/invoices/${invoice.id}/view`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, '_blank');

            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
            console.error('Error viewing PDF:', error);
            alert('Errore nella visualizzazione del file');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <i className="material-icons text-blue-600 text-3xl">receipt</i>
                        <h1 className="text-2xl font-bold text-gray-900">Bollette</h1>
                    </div>
                    <Button
                        onClick={handleAddInvoice}
                        className="flex items-center gap-2"
                    >
                        <i className="material-icons text-sm">add</i>
                        Carica bolletta
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <i className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                search
                            </i>
                            <input
                                type="text"
                                placeholder="Cerca bollette..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto px-6 py-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Caricamento bollette...</div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
                        <i className="material-icons text-6xl text-gray-300 mb-4">receipt</i>
                        <p className="text-lg text-gray-500">
                            {searchQuery ? 'Nessuna bolletta trovata' : 'Nessuna bolletta presente'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            {searchQuery ? 'Prova a modificare i criteri di ricerca' : 'Carica la prima bolletta'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Immobile
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data Ricezione
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Importo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Da Addebitare
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Scadenza
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            File
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {invoice.property?.internal_code || '-'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {invoice.property?.name || invoice.property?.address || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {INVOICE_TYPES[invoice.invoice_type] || invoice.invoice_type || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('it-IT') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {invoice.amount ? `€ ${parseFloat(invoice.amount).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.amount_to_charge ? `€ ${parseFloat(invoice.amount_to_charge).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('it-IT') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {invoice.file_path ? (
                                                    <button
                                                        onClick={() => handleViewPdf(invoice)}
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <i className="material-icons text-sm">picture_as_pdf</i>
                                                        Visualizza
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditInvoice(invoice)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Modifica"
                                                    >
                                                        <i className="material-icons text-sm">edit</i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInvoice(invoice.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Elimina"
                                                    >
                                                        <i className="material-icons text-sm">delete</i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && paginationMeta && (
                <div className="bg-white border-t border-gray-200 px-6 py-3">
                    <Pagination
                        pagination={paginationMeta}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        loading={loading}
                        entityName="bolletta"
                        entityNamePlural="bollette"
                    />
                </div>
            )}

            {/* Invoice Modal */}
            {showModal && (
                <InvoiceModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedInvoice(null);
                    }}
                    onSave={handleSaveInvoice}
                    invoice={selectedInvoice}
                    propertyId={null}  // No propertyId - will show property selector
                />
            )}
        </div>
    );
}
