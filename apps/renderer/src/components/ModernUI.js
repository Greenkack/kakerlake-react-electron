import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ModernCard = ({ children, className = '', title, subtitle, icon, variant = 'default', size = 'md', interactive = false, loading = false }) => {
    const baseClasses = "rounded-xl transition-all duration-300 ease-out";
    const variantClasses = {
        default: "bg-white shadow-lg border border-gray-100 hover:shadow-xl",
        gradient: "bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg border border-blue-100 hover:shadow-xl hover:from-blue-100 hover:to-indigo-100",
        glass: "bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20 hover:bg-white/90",
        bordered: "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
    };
    const sizeClasses = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
    };
    const interactiveClasses = interactive
        ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1"
        : "";
    const loadingOverlay = loading && (_jsx("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "text-gray-600 font-medium", children: "Laden..." })] }) }));
    return (_jsxs("div", { className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${interactiveClasses} ${className} relative`, children: [loadingOverlay, (title || subtitle || icon) && (_jsx("div", { className: "mb-4 pb-4 border-b border-gray-100", children: _jsxs("div", { className: "flex items-start space-x-3", children: [icon && (_jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx("i", { className: `${icon} text-blue-600 text-lg` }) })), _jsxs("div", { className: "flex-1 min-w-0", children: [title && (_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: title })), subtitle && (_jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: subtitle }))] })] }) })), _jsx("div", { className: "relative z-0", children: children })] }));
};
export const ModernButton = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, icon, iconPosition = 'left', fullWidth = false, className = '' }) => {
    const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 focus:ring-blue-500 active:scale-95",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md focus:ring-gray-500",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-green-500 active:scale-95",
        danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-red-500 active:scale-95",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-amber-500 active:scale-95",
        outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
    };
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl"
    };
    const widthClasses = fullWidth ? "w-full" : "";
    const iconElement = icon && (_jsx("i", { className: `${icon} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}` }));
    const loadingSpinner = loading && (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" }));
    return (_jsxs("button", { onClick: onClick, disabled: disabled || loading, className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`, children: [loading && loadingSpinner, icon && iconPosition === 'left' && iconElement, children, icon && iconPosition === 'right' && iconElement] }));
};
export const ModernInput = ({ label, placeholder, value, onChange, type = 'text', disabled = false, error, icon, iconPosition = 'left', size = 'md', fullWidth = false, className = '' }) => {
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    const baseClasses = "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed";
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg"
    };
    const errorClasses = error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 hover:border-gray-400";
    const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
    const widthClasses = fullWidth ? "w-full" : "";
    return (_jsxs("div", { className: `${fullWidth ? 'w-full' : ''} ${className}`, children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-semibold text-gray-700 mb-2", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: `absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`, children: _jsx("i", { className: `${icon} text-gray-400` }) })), _jsx("input", { id: inputId, type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, disabled: disabled, className: `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${iconClasses} ${widthClasses}` })] }), error && (_jsxs("p", { className: "mt-1 text-sm text-red-600 flex items-center", children: [_jsx("i", { className: "pi pi-exclamation-triangle mr-1" }), error] }))] }));
};
export const ModernSelect = ({ label, value, onChange, options, placeholder = "Bitte wählen...", disabled = false, error, size = 'md', fullWidth = false, className = '' }) => {
    const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
    const baseClasses = "border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed";
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg"
    };
    const errorClasses = error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 hover:border-gray-400";
    const widthClasses = fullWidth ? "w-full" : "";
    return (_jsxs("div", { className: `${fullWidth ? 'w-full' : ''} ${className}`, children: [label && (_jsx("label", { htmlFor: selectId, className: "block text-sm font-semibold text-gray-700 mb-2", children: label })), _jsxs("select", { id: selectId, value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, className: `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${widthClasses}`, children: [_jsx("option", { value: "", children: placeholder }), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), error && (_jsxs("p", { className: "mt-1 text-sm text-red-600 flex items-center", children: [_jsx("i", { className: "pi pi-exclamation-triangle mr-1" }), error] }))] }));
};
export default { ModernCard, ModernButton, ModernInput, ModernSelect };
