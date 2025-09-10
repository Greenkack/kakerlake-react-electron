import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
export const ModernCard = ({ children, variant = 'default', size = 'md', className = '', title, subtitle, header, footer, loading = false, hoverable = true }) => {
    const getCardClassName = () => {
        let classes = 'modern-card';
        if (hoverable) {
            classes += ' transition-all duration-300 hover:shadow-4';
        }
        switch (variant) {
            case 'elevated':
                classes += ' shadow-4';
                break;
            case 'outlined':
                classes += ' surface-border border-1';
                break;
            case 'subtle':
                classes += ' surface-50';
                break;
            default:
                classes += ' surface-card';
        }
        switch (size) {
            case 'sm':
                classes += ' p-2';
                break;
            case 'lg':
                classes += ' p-4';
                break;
            default:
                classes += ' p-3';
        }
        return `${classes} ${className}`;
    };
    if (loading) {
        return (_jsx(Card, { className: getCardClassName(), children: _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { width: "100%", height: "2rem" }), _jsx(Skeleton, { width: "80%", height: "1rem" }), _jsx(Skeleton, { width: "60%", height: "1rem" })] }) }));
    }
    return (_jsx(Card, { title: title, subTitle: subtitle, header: header, footer: footer, className: getCardClassName(), children: children }));
};
export const ModernButton = ({ children, variant = 'primary', size, severity, outlined = false, text = false, raised = false, rounded = false, icon, iconPos = 'left', loading = false, disabled = false, className = '', onClick, type = 'button' }) => {
    return (_jsx(Button, { label: typeof children === 'string' ? children : undefined, severity: severity || (variant !== 'primary' ? variant : undefined), size: size, outlined: outlined, text: text, raised: raised, rounded: rounded, icon: icon, iconPos: iconPos, loading: loading, disabled: disabled, className: `modern-button ${className}`, onClick: onClick, type: type, children: typeof children !== 'string' ? children : undefined }));
};
export const ModernInput = ({ value, placeholder, type = 'text', size, disabled = false, invalid = false, className = '', onChange, onBlur, onFocus, label, helpText, errorText, icon, iconPosition = 'left' }) => {
    const inputId = React.useId();
    const InputComponent = (_jsx(InputText, { id: inputId, value: value, placeholder: placeholder, type: type, size: size, disabled: disabled, invalid: invalid || !!errorText, className: `modern-input w-full ${className}`, onChange: onChange, onBlur: onBlur, onFocus: onFocus }));
    return (_jsxs("div", { className: "field", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-900 font-medium mb-2", children: label })), icon ? (_jsxs("div", { className: `p-inputgroup ${iconPosition === 'right' ? 'flex-row-reverse' : ''}`, children: [_jsx("span", { className: "p-inputgroup-addon", children: _jsx("i", { className: icon }) }), InputComponent] })) : (InputComponent), helpText && !errorText && (_jsx("small", { className: "block text-600 mt-1", children: helpText })), errorText && (_jsx("small", { className: "block text-red-500 mt-1", children: errorText }))] }));
};
export const ModernSelect = ({ value, options, placeholder = 'Bitte wählen...', disabled = false, filter = false, showClear = true, invalid = false, className = '', onChange, label, helpText, errorText, emptyMessage = 'Keine Optionen verfügbar', loading = false }) => {
    const selectId = React.useId();
    return (_jsxs("div", { className: "field", children: [label && (_jsx("label", { htmlFor: selectId, className: "block text-900 font-medium mb-2", children: label })), _jsx(Dropdown, { inputId: selectId, value: value, options: options, optionLabel: "label", optionValue: "value", placeholder: placeholder, disabled: disabled, filter: filter, showClear: showClear, invalid: invalid || !!errorText, className: `modern-select w-full ${className}`, onChange: onChange, emptyMessage: emptyMessage, loading: loading }), helpText && !errorText && (_jsx("small", { className: "block text-600 mt-1", children: helpText })), errorText && (_jsx("small", { className: "block text-red-500 mt-1", children: errorText }))] }));
};
// CSS Styles für die Komponenten
export const modernUIStyles = `
.modern-card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.modern-button {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.modern-input {
  border-radius: 0.5rem;
}

.modern-select {
  border-radius: 0.5rem;
}

/* Hover-Effekte */
.modern-card:hover {
  transform: translateY(-2px);
}

.modern-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
`;
// Style-Tag für die Komponenten
if (typeof document !== 'undefined' && !document.getElementById('modern-ui-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'modern-ui-styles';
    styleElement.textContent = modernUIStyles;
    document.head.appendChild(styleElement);
}
