import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Minimal App Component
function App() {
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("header", { className: "bg-white shadow p-4", children: _jsx("h1", { className: "text-xl font-bold", children: "Kakerlake PV/WP Tool" }) }), _jsx("main", { className: "p-4", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) })] }));
}
// Home Component
function Home() {
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Willkommen" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow border", children: [_jsx("h3", { className: "font-semibold text-lg mb-2", children: "\uD83C\uDFD7\uFE0F Neues Projekt" }), _jsx("p", { className: "text-gray-600", children: "Starten Sie ein neues PV-Projekt" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow border", children: [_jsx("h3", { className: "font-semibold text-lg mb-2", children: "\u2600\uFE0F Solar-Rechner" }), _jsx("p", { className: "text-gray-600", children: "Schnelle PV-Kalkulation" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow border", children: [_jsx("h3", { className: "font-semibold text-lg mb-2", children: "\uD83D\uDD25 W\u00E4rmepumpe" }), _jsx("p", { className: "text-gray-600", children: "W\u00E4rmepumpen-Simulation" })] })] }), _jsxs("div", { className: "mt-8 p-4 bg-green-50 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-green-800", children: "\u2705 Die App l\u00E4uft erfolgreich!" }), _jsxs("p", { className: "text-green-600 text-sm mt-1", children: ["Aktueller Pfad: ", window.location.pathname] })] })] }));
}
// NotFound Component
function NotFound() {
    return (_jsxs("div", { className: "text-center py-12", children: [_jsx("h2", { className: "text-xl font-bold text-red-600", children: "Seite nicht gefunden" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Die angeforderte Seite existiert nicht." }), _jsx("a", { href: "/home", className: "mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded", children: "Zur Startseite" })] }));
}
// Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-red-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow max-w-lg", children: [_jsx("h1", { className: "text-xl font-bold text-red-600 mb-4", children: "Anwendungsfehler" }), _jsx("p", { className: "text-gray-700 mb-4", children: "Ein Fehler ist aufgetreten:" }), _jsx("pre", { className: "text-xs bg-gray-100 p-2 rounded overflow-auto mb-4", children: this.state.error?.toString() }), _jsx("button", { onClick: () => window.location.reload(), className: "bg-blue-500 text-white px-4 py-2 rounded", children: "Neu laden" })] }) }));
        }
        return this.props.children;
    }
}
// CSS Import
import "./index.css";
// Render App
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
