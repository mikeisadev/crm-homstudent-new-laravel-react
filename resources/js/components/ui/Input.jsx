import { forwardRef } from 'react';

/**
 * Componente Input riutilizzabile con supporto per errori e label
 */
const Input = forwardRef(({
    label,
    error,
    type = 'text',
    id,
    name,
    placeholder,
    disabled = false,
    required = false,
    className = '',
    ...props
}, ref) => {
    const inputId = id || name;

    const baseClasses = 'block w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200';
    const normalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
    const disabledClasses = 'bg-gray-100 cursor-not-allowed';

    const inputClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${disabled ? disabledClasses : ''} ${className}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <input
                ref={ref}
                type={type}
                id={inputId}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={inputClasses}
                {...props}
            />

            {error && (
                <p className="mt-1.5 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
