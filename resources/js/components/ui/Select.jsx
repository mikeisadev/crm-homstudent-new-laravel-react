import ReactSelect from 'react-select';

/**
 * Custom Select component wrapper for react-select
 * Provides consistent styling and Italian placeholders
 *
 * @param {Array} options - Array of {value, label} objects
 * @param {*} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} isDisabled - Whether select is disabled
 * @param {boolean} isClearable - Whether select is clearable
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function Select({
    options = [],
    value,
    onChange,
    placeholder = '-- Seleziona un valore --',
    isDisabled = false,
    isClearable = true,
    className = '',
    ...props
}) {
    // Custom styles for react-select to match our design
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            '&:hover': {
                borderColor: '#3b82f6',
            },
            minHeight: '42px',
            borderRadius: '0.375rem',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#3b82f6'
                : state.isFocused
                ? '#dbeafe'
                : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#dbeafe',
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
        }),
    };

    return (
        <ReactSelect
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isClearable={isClearable}
            styles={customStyles}
            className={className}
            noOptionsMessage={() => 'Nessuna opzione disponibile'}
            loadingMessage={() => 'Caricamento...'}
            {...props}
        />
    );
}
