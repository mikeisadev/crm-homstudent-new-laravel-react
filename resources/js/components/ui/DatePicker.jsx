import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Italian } from 'flatpickr/dist/l10n/it.js';

/**
 * Custom DatePicker component wrapper for react-flatpickr
 * Supports both date-only and datetime modes with Italian localization
 *
 * @param {*} value - Selected date/datetime value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} enableTime - Whether to enable time selection
 * @param {string} dateFormat - Date format string
 * @param {boolean} disabled - Whether picker is disabled
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function DatePicker({
    value,
    onChange,
    placeholder = 'Seleziona una data',
    enableTime = false,
    dateFormat,
    disabled = false,
    className = '',
    ...props
}) {
    // Default date formats
    const defaultFormat = enableTime ? 'd/m/Y H:i' : 'd/m/Y';
    const finalFormat = dateFormat || defaultFormat;

    // Flatpickr options
    const options = {
        locale: Italian,
        enableTime,
        dateFormat: finalFormat,
        time_24hr: true,
        allowInput: true,
        minuteIncrement: 5,
        ...props,
    };

    return (
        <Flatpickr
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${className}`}
        />
    );
}
