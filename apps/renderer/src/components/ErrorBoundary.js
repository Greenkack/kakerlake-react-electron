import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-red-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg border border-red-200 p-6 max-w-lg w-full", children: [_jsx("h1", { className: "text-xl font-bold text-red-600 mb-4", children: "Anwendungsfehler" }), _jsx("p", { className: "text-gray-700 mb-4", children: "Ein Fehler ist aufgetreten beim Laden der Anwendung." }), _jsxs("details", { className: "mb-4", children: [_jsx("summary", { className: "cursor-pointer text-sm text-gray-600", children: "Fehlerdetails anzeigen" }), _jsxs("pre", { className: "mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto", children: [this.state.error?.toString(), this.state.error?.stack] })] }), _jsx("button", { onClick: () => window.location.reload(), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Seite neu laden" })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
