/**
 * Componente Card riutilizzabile per contenere contenuto
 */
export default function Card({
    children,
    title,
    subtitle,
    footer,
    padding = true,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = '',
}) {
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
    const paddingClasses = padding ? 'p-6' : '';

    return (
        <div className={`${baseClasses} ${className}`}>
            {(title || subtitle) && (
                <div className={`border-b border-gray-200 pb-4 mb-4 ${padding ? 'px-6 pt-6' : ''} ${headerClassName}`}>
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className={`${paddingClasses} ${bodyClassName}`}>
                {children}
            </div>

            {footer && (
                <div className={`border-t border-gray-200 pt-4 mt-4 ${padding ? 'px-6 pb-6' : ''} ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
}
