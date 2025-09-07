import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./index.css";
// Echte Module importieren
import ProjectWizard from "./routes/Project/index";
import SolarCalc from "./routes/SolarCalculator";
import HeatpumpSim from "./routes/HeatpumpSimulator";
import PdfHubReal from "./routes/PdfHub";
import CRMMenuReal from "./routes/CRM/Menu";
import AdminRouter from "./routes/Admin/index";
import { ProjectProvider } from "./lib/projectContext";
function App() {
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsxs("header", { className: "bg-white shadow p-4", children: [_jsx("h1", { className: "text-xl font-bold text-blue-600", children: "\uD83D\uDD27 Kakerlake PV/WP Tool" }), _jsx("p", { className: "text-sm text-gray-600", children: "Photovoltaik und W\u00E4rmepumpen Planungstool" })] }), _jsx("main", { className: "container mx-auto p-6", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/project/*", element: _jsx(ProjectWizard, {}) }), _jsx(Route, { path: "/solar", element: _jsx(SolarCalc, {}) }), _jsx(Route, { path: "/calc/solar", element: _jsx(SolarCalc, {}) }), _jsx(Route, { path: "/heatpump", element: _jsx(HeatpumpSim, {}) }), _jsx(Route, { path: "/pdf/*", element: _jsx(PdfHubReal, {}) }), _jsx(Route, { path: "/crm", element: _jsx(CRMMenuReal, {}) }), _jsx(Route, { path: "/admin/*", element: _jsx(AdminRouter, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) })] }));
}
function Home() {
    const navigate = useNavigate();
    const clearAllData = () => {
        if (confirm('⚠️ ACHTUNG: Alle gespeicherten Projektdaten löschen?\n\nDies löscht:\n- Kundendaten\n- Gebäudedaten\n- Verbrauchsdaten\n- Alle Projekteinstellungen\n\nDieser Vorgang kann nicht rückgängig gemacht werden!')) {
            // Lösche alle Kakerlake localStorage-Daten
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('kakerlake')) {
                    localStorage.removeItem(key);
                }
            });
            alert('✅ Alle Projektdaten wurden erfolgreich gelöscht!');
            window.location.reload(); // Seite neu laden für sauberen Zustand
        }
    };
    const menuItems = [
        {
            id: 'project',
            title: 'Neues Projekt',
            icon: '🏗️',
            color: 'text-blue-600',
            path: '/project',
            description: 'Starten Sie ein neues PV-Projekt mit vollständiger Bedarfsanalyse'
        },
        {
            id: 'solar',
            title: 'Solar-Rechner',
            icon: '☀️',
            color: 'text-green-600',
            path: '/solar',
            description: 'Schnelle Kalkulation für Photovoltaik-Anlagen'
        },
        {
            id: 'heatpump',
            title: 'Wärmepumpe',
            icon: '🔥',
            color: 'text-orange-600',
            path: '/heatpump',
            description: 'Wärmepumpen-Simulation und Dimensionierung'
        },
        {
            id: 'pdf',
            title: 'PDF-Generator',
            icon: '📄',
            color: 'text-purple-600',
            path: '/pdf',
            description: 'Professionelle Angebote und Dokumentationen'
        },
        {
            id: 'crm',
            title: 'CRM',
            icon: '👥',
            color: 'text-indigo-600',
            path: '/crm',
            description: 'Kundenverwaltung und Projekt-Pipeline'
        },
        {
            id: 'admin',
            title: 'Administration',
            icon: '⚙️',
            color: 'text-gray-600',
            path: '/admin',
            description: 'System-Einstellungen und Konfiguration'
        }
    ];
    const handleMenuClick = (path) => {
        console.log(`Navigating to: ${path}`);
        navigate(path);
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-2", children: "Willkommen bei Kakerlake" }), _jsx("p", { className: "text-gray-600", children: "Ihr professionelles Tool f\u00FCr PV- und W\u00E4rmepumpen-Projekte" })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: menuItems.map((item) => (_jsxs("div", { onClick: () => handleMenuClick(item.path), className: "bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95", children: [_jsx("div", { className: "text-2xl mb-3", children: item.icon }), _jsx("h3", { className: `font-semibold text-lg mb-2 ${item.color}`, children: item.title }), _jsx("p", { className: "text-gray-600", children: item.description })] }, item.id))) }), _jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6 mb-6", children: [_jsx("h3", { className: "font-semibold text-green-800 flex items-center mb-2", children: "\u2705 System Status" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-green-700", children: "App Status:" }), _jsx("span", { className: "text-green-800 font-medium", children: "L\u00E4uft erfolgreich" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-green-700", children: "Aktueller Pfad:" }), _jsx("span", { className: "text-green-800 font-mono", children: window.location.pathname })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-green-700", children: "Build-Zeit:" }), _jsx("span", { className: "text-green-800 font-mono", children: new Date().toLocaleString('de-DE') })] })] })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-semibold text-red-800 flex items-center mb-2", children: "\uD83D\uDEE0\uFE0F Entwickler-Tools" }), _jsx("p", { className: "text-red-700 text-sm mb-4", children: "Diese Funktionen sind f\u00FCr Entwicklung und Debugging gedacht." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: clearAllData, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2", children: "\uD83D\uDDD1\uFE0F Alle Projektdaten l\u00F6schen" }), _jsx("button", { onClick: () => {
                                    console.log('localStorage contents:', localStorage);
                                    alert('Siehe Browser-Konsole (F12) für localStorage-Inhalte');
                                }, className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2", children: "\uD83D\uDD0D localStorage anzeigen" })] })] })] }));
}
function NotFound() {
    return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h2", { className: "text-2xl font-bold text-red-600 mb-2", children: "Seite nicht gefunden" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Die angeforderte Seite existiert nicht." }), _jsx(Link, { to: "/home", className: "inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors", children: "\uD83C\uDFE0 Zur Startseite" })] }));
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(ProjectProvider, { children: _jsx(App, {}) }) }) }));
