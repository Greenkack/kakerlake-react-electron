import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import { Menubar } from 'primereact/menubar';
import './App.css';
// Import existing project state and components
import { ProjectProvider } from "./state/project";
import CustomerForm from "./routes/Project/CustomerForm";
import BuildingData from "./routes/Project/BuildingData";
import DemandAnalysis from "./routes/Project/DemandAnalysis";
import NeedsAnalysis from "./routes/Project/NeedsAnalysis";
import AdditionalOptions from "./routes/Project/AdditionalOptions";
import SolarCalculator from "./routes/SolarCalculator";
import HeatpumpSimulator from "./routes/HeatpumpSimulator";
import Results from "./routes/Results";
import ModeSelect from "./routes/Project/ModeSelect";
// Simple home component
const HomeComponent = () => (_jsxs("div", { className: "card", children: [_jsx("h1", { children: "\uD83C\uDFE0 Kakerlake PV/WP Tool" }), _jsx("p", { children: "Willkommen beim Photovoltaik und W\u00E4rmepumpen Planungstool" }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { children: "Starten Sie mit:" }), _jsxs("ul", { className: "list-disc ml-6 mt-2", children: [_jsx("li", { children: "Projekt \u2192 Anlagenmodus w\u00E4hlen" }), _jsx("li", { children: "Kundendaten erfassen" }), _jsx("li", { children: "Geb\u00E4ude und Verbrauch analysieren" }), _jsx("li", { children: "Technische Konfiguration" }), _jsx("li", { children: "Ergebnisse berechnen" })] })] })] }));
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
// Main App Component with Router
function App() {
    return (_jsx(ProjectProvider, { children: _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(AppLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "home", element: _jsx(HomeComponent, {}) }), _jsx(Route, { path: "project/mode", element: _jsx(ModeSelect, {}) }), _jsx(Route, { path: "project/customer", element: _jsx(CustomerForm, {}) }), _jsx(Route, { path: "project/building", element: _jsx(BuildingData, {}) }), _jsx(Route, { path: "project/demand", element: _jsx(DemandAnalysis, {}) }), _jsx(Route, { path: "project/needs", element: _jsx(NeedsAnalysis, {}) }), _jsx(Route, { path: "project/options", element: _jsx(AdditionalOptions, {}) }), _jsx(Route, { path: "calc/solar", element: _jsx(SolarCalculator, {}) }), _jsx(Route, { path: "calc/heatpump", element: _jsx(HeatpumpSimulator, {}) }), _jsx(Route, { path: "calc/results", element: _jsx(Results, {}) }), _jsx(Route, { path: "pdf/standard", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC4 Standard-PDF" }) }), _jsx(Route, { path: "pdf/extended", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCD1 Erweiterte PDFs" }) }), _jsx(Route, { path: "pdf/multi", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCDA Multi-PDF" }) }), _jsx(Route, { path: "pdf/preview", element: _jsx(PlaceholderPage, { title: "\uD83D\uDC41\uFE0F Vorschau" }) }), _jsx(Route, { path: "crm/dashboard", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC8 CRM Dashboard" }) }), _jsx(Route, { path: "crm/customers", element: _jsx(PlaceholderPage, { title: "\uD83D\uDC65 Kundenverwaltung" }) }), _jsx(Route, { path: "crm/pipeline", element: _jsx(PlaceholderPage, { title: "\uD83D\uDD04 Pipeline & Workflows" }) }), _jsx(Route, { path: "crm/calendar", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCC5 Kalender" }) }), _jsx(Route, { path: "crm/quick-calc", element: _jsx(PlaceholderPage, { title: "\u26A1 Schnellkalkulation" }) }), _jsx(Route, { path: "planning/info", element: _jsx(PlaceholderPage, { title: "\u2139\uFE0F Informationsportal" }) }), _jsx(Route, { path: "planning/documents", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCCB Dokumente" }) }), _jsx(Route, { path: "admin/login", element: _jsx(PlaceholderPage, { title: "\uD83D\uDD10 Login" }) }), _jsx(Route, { path: "admin/companies", element: _jsx(PlaceholderPage, { title: "\uD83C\uDFE2 Firmenverwaltung" }) }), _jsx(Route, { path: "admin/products", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCE6 Produktverwaltung" }) }), _jsx(Route, { path: "admin/price-matrix", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCB0 Preis-Matrix" }) }), _jsx(Route, { path: "admin/tariffs", element: _jsx(PlaceholderPage, { title: "\uD83D\uDCA1 Tarifverwaltung" }) }), _jsx(Route, { path: "admin/settings", element: _jsx(PlaceholderPage, { title: "\u2699\uFE0F Einstellungen" }) }), _jsx(Route, { path: "*", element: _jsx(PlaceholderPage, { title: "\u2753 Seite nicht gefunden" }) })] }) }) }) }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(_jsx(App, {}));
