import { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import Input from './Input';
import DateUtil from '../../utils/date';

/**
 * Installments Field Group Component
 *
 * Displays 12 monthly installments (Rateizzazione) in a 4-column grid
 * Each installment has:
 * - Date field (flatpickr)
 * - Amount field (number)
 * - Hidden is_payment_completed boolean
 *
 * Data is stored as JSON in the backend
 *
 * @param {Array} value - Array of 12 installment objects
 * @param {function} onChange - Callback when any installment changes
 * @param {boolean} disabled - Whether fields are disabled
 * @returns {JSX.Element}
 */
export default function InstallmentsFieldGroup({ value = [], onChange, disabled = false }) {
    // Initialize with 12 empty installments if not provided
    const [installments, setInstallments] = useState(() => {
        if (value && value.length === 12) {
            return value;
        }
        // Generate default 12 installments
        return Array.from({ length: 12 }, (_, index) => ({
            number: index + 1,
            date: '',
            amount: '',
            is_payment_completed: false
        }));
    });

    // Update local state when value prop changes (for edit mode)
    useEffect(() => {
        if (value && value.length === 12) {
            setInstallments(value);
        }
    }, [value]);

    /**
     * Handle date change for a specific installment
     */
    const handleDateChange = (index, date) => {
        const newInstallments = [...installments];
        newInstallments[index] = {
            ...newInstallments[index],
            date: date ? DateUtil.formatDate(date) : ''
        };
        setInstallments(newInstallments);
        onChange(newInstallments);
    };

    /**
     * Handle amount change for a specific installment
     */
    const handleAmountChange = (index, amount) => {
        const newInstallments = [...installments];
        newInstallments[index] = {
            ...newInstallments[index],
            amount: amount
        };
        setInstallments(newInstallments);
        onChange(newInstallments);
    };

    return (
        <div className="installments-field-group">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-1">
                    Rateizzazione
                </h3>
                <p className="text-xs text-gray-500">
                    Inserisci la data di scadenza e l'importo per ciascuna delle 12 rate mensili
                </p>
            </div>

            {/* Grid of 12 installments (4 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {installments.map((installment, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors"
                    >
                        {/* Installment header */}
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
                            <span>Rata {installment.number}</span>
                            {installment.is_payment_completed && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    ✓
                                </span>
                            )}
                        </div>

                        {/* Date field */}
                        <div className="mb-2">
                            <label className="block text-xs text-gray-600 mb-1">
                                Data scadenza
                            </label>
                            <DatePicker
                                value={installment.date ? new Date(installment.date) : ''}
                                onChange={([date]) => handleDateChange(index, date)}
                                placeholder="gg/mm/aaaa"
                                disabled={disabled}
                                className="text-sm"
                            />
                        </div>

                        {/* Amount field */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Importo (€)
                            </label>
                            <Input
                                type="number"
                                value={installment.amount || ''}
                                onChange={(e) => handleAmountChange(index, e.target.value)}
                                placeholder="0.00"
                                disabled={disabled}
                                step="0.01"
                                min="0"
                                className="text-sm"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Totale rate compilate:</span>
                    <span className="font-semibold text-gray-900">
                        {installments.filter(inst => inst.date && inst.amount).length} / 12
                    </span>
                </div>
                {installments.some(inst => inst.date && inst.amount) && (
                    <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Totale importo:</span>
                        <span className="font-semibold text-blue-600">
                            €{' '}
                            {installments
                                .reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0)
                                .toFixed(2)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
