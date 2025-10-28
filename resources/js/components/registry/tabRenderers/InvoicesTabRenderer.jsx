import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

/**
 * Invoices Tab Renderer
 * Simple list view of property invoices/bills
 */
const InvoicesTabRenderer = ({ entityId, endpoint }) => {
    const [invoices, setInvoices] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [entityId]);

    const fetchInvoices = async () => {
        try {
            setIsLoadingData(true);
            const response = await api.get(endpoint(entityId));
            setInvoices(response.data.data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento bollette...</div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <i className="material-icons text-6xl mb-4">receipt</i>
                <p>Nessuna bolletta presente</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrizione
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Importo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stato
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {invoice.date || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {invoice.type || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {invoice.description || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {invoice.amount ? `€${parseFloat(invoice.amount).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {invoice.status || 'pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesTabRenderer;
