import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import { Menubar } from 'primereact/menubar';
import './App.css';
// Create a mock project provider for now
const ProjectProvider = ({ children }) => _jsx(_Fragment, { children: children });
// Simple placeholder components for testing
const HomeComponent = () => (_jsxs("div", { className: "card", children: [_jsx("h1", { children: "\uD83C\uDFE0 Kakerlake PV/WP Tool" }), _jsx("p", { children: "Willkommen beim Photovoltaik und W\u00E4rmepumpen Planungstool" })] }));
const PlaceholderPage = ({ title }) => (_jsxs("div", { className: "card", children: [_jsx("h1", { children: title }), _jsx("p", { children: "Diese Seite ist noch in Entwicklung..." })] }));
// App Layout Component
function AppLayout() {
    const menuItems = [
        {
            label: 'Projekt',
            icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Anlagenmodus', url: '/project/mode' },
                { label: 'Kundendaten', url: '/project/customer' },
                { label: 'Gebäudedaten', url: '/project/building' },
                { label: 'Bedarfsanalyse', url: '/project/demand' },
                { label: 'Bedürfnisse', url: '/project/needs' },
                { label: 'Zusatzoptionen', url: '/project/options' }
            ]
        },
        {
            label: 'Kalkulation',
            icon: 'pi pi-fw pi-calculator',
            items: [
                { label: 'Solarkalkulator', url: '/calc/solar' },
                { label: 'Wärmepumpen-Sim', url: '/calc/heatpump' },
                { label: 'Ergebnisse & Dashboard', url: '/calc/results' }
            ]
        },
        {
            label: 'PDF-Hub',
            icon: 'pi pi-fw pi-file-pdf',
            items: [
                { label: 'Standard-PDF', url: '/pdf/standard' },
                { label: 'Erweiterte PDFs', url: '/pdf/extended' },
                { label: 'Multi-PDF', url: '/pdf/multi' },
                { label: 'Vorschau', url: '/pdf/preview' }
            ]
        },
        {
            label: 'CRM',
            icon: 'pi pi-fw pi-users',
            items: [
                { label: 'Dashboard', url: '/crm/dashboard' },
                { label: 'Kundenverwaltung', url: '/crm/customers' },
                { label: 'Pipeline & Workflows', url: '/crm/pipeline' },
                { label: 'Kalender', url: '/crm/calendar' },
                { label: 'Schnellkalkulation', url: '/crm/quick-calc' }
            ]
        },
        {
            label: 'Planung',
            icon: 'pi pi-fw pi-sitemap',
            items: [
                { label: 'Informationsportal', url: '/planning/info' },
                { label: 'Dokumente', url: '/planning/documents' }
            ]
        },
        {
            label: 'Admin',
            icon: 'pi pi-fw pi-cog',
            items: [
                { label: 'Login', url: '/admin/login' },
                { label: 'Firmenverwaltung', url: '/admin/companies' },
                { label: 'Produktverwaltung', url: '/admin/products' },
                { label: 'Preis-Matrix', url: '/admin/price-matrix' },
                { label: 'Tarifverwaltung', url: '/admin/tariffs' },
                { label: 'Einstellungen', url: '/admin/settings' }
            ]
        }
    ];
    const start = _jsx("div", { className: "font-bold text-primary", children: "Kakerlake \u2013 PV/WP" });
    return (_jsxs("div", { className: "kakerlake-app", children: [_jsx(Menubar, { model: menuItems, start: start, className: "mb-4" }), _jsx("main", { className: "p-4", children: _jsx(Outlet, {}) })] }));
}
// Mock Results component - simple version for testing
const ResultsPage = () => (_jsxs("div", { className: "card", children: [_jsx("h1", { children: "\uD83D\uDCCA Projektergebnisse" }), _jsx("p", { children: "Hier werden die Berechnungsergebnisse angezeigt..." }), _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsxs("div", { className: "card", children: [_jsx("h3", { children: "System-Info" }), _jsx("p", { children: "10 kWp Anlage" })] }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Jahresertrag" }), _jsx("p", { children: "12.000 kWh/Jahr" })] }) })] })] }));
// Main App Component with Router
function App() {
    return (_jsx(ProjectProvider, { children: _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(AppLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "home", element: _jsx(HomeComponent, {}) }), _jsx(Route, { path: "project/mode", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCCA Anlagenmodus" }) }), _jsx(Route, { path: "project/customer", element: _jsx(PlaceholderPage, { title: "\uD83D\uDC64 Kundendaten" }) }), _jsx(Route, { path: "project/building", element: _jsx(PlaceholderPage, { title: "\uD83C\uDFE2 Geb\u00E4udedaten" }) }), _jsx(Route, { path: "project/demand", element: _jsx(PlaceholderPage, { title: "\u26A1 Bedarfsanalyse" }) }), _jsx(Route, { path: "project/needs", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCAD Bed\u00FCrfnisse" }) }), _jsx(Route, { path: "project/options", element: _jsx(PlaceholderPage, { title: "\u2699\uFE0F Zusatzoptionen" }) }), _jsx(Route, { path: "calc/solar", element: _jsx(PlaceholderPage, { title: "\u2600\uFE0F Solarkalkulator" }) }), _jsx(Route, { path: "calc/heatpump", element: _jsx(PlaceholderPage, { title: "\uD83D\uDD25 W\u00E4rmepumpen-Sim" }) }), _jsx(Route, { path: "calc/results", element: _jsx(ResultsPage, {}) }), _jsx(Route, { path: "pdf/standard", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC4 Standard-PDF" }) }), _jsx(Route, { path: "pdf/extended", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCD1 Erweiterte PDFs" }) }), _jsx(Route, { path: "pdf/multi", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCDA Multi-PDF" }) }), _jsx(Route, { path: "pdf/preview", element: _jsx(PlaceholderPage, { title: "\uD83D\uDC41\uFE0F Vorschau" }) }), _jsx(Route, { path: "crm/dashboard", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC8 CRM Dashboard" }) }), _jsx(Route, { path: "crm/customers", element: _jsx(PlaceholderPage, { title: "\uD83D\uDC65 Kundenverwaltung" }) }), _jsx(Route, { path: "crm/pipeline", element: _jsx(PlaceholderPage, { title: "\uD83D\uDD04 Pipeline & Workflows" }) }), _jsx(Route, { path: "crm/calendar", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC5 Kalender" }) }), _jsx(Route, { path: "crm/quick-calc", element: _jsx(PlaceholderPage, { title: "\u26A1 Schnellkalkulation" }) }), _jsx(Route, { path: "planning/info", element: _jsx(PlaceholderPage, { title: "\u2139\uFE0F Informationsportal" }) }), _jsx(Route, { path: "planning/documents", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCCB Dokumente" }) }), _jsx(Route, { path: "admin/login", element: _jsx(PlaceholderPage, { title: "\uD83D\uDD10 Login" }) }), _jsx(Route, { path: "admin/companies", element: _jsx(PlaceholderPage, { title: "\uD83C\uDFE2 Firmenverwaltung" }) }), _jsx(Route, { path: "admin/products", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCE6 Produktverwaltung" }) }), _jsx(Route, { path: "admin/price-matrix", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCB0 Preis-Matrix" }) }), _jsx(Route, { path: "admin/tariffs", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCA1 Tarifverwaltung" }) }), _jsx(Route, { path: "admin/settings", element: _jsx(PlaceholderPage, { title: "\u2699\uFE0F Einstellungen" }) }), _jsx(Route, { path: "*", element: _jsx(PlaceholderPage, { title: "\u2753 Seite nicht gefunden" }) })] }) }) }) }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(_jsx(App, {}));
