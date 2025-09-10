import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import { Menubar } from 'primereact/menubar';
import './App.css';
// Import existing project state and components
import { ProjectProvider } from "./state/project";
import { AppProvider } from "./context/AppContext";
import CustomerForm from "./routes/Project/CustomerForm";
import BuildingData from "./routes/Project/BuildingData";
import DemandAnalysis from "./routes/Project/DemandAnalysis";
import AdditionalOptions from "./routes/Project/AdditionalOptions";
import SolarCalculator from "./routes/SolarCalculator";
import HeatpumpSimulator from "./routes/HeatpumpSimulator";
import Results from "./routes/Results";
import ModeSelect from "./routes/Project/ModeSelect";
import AdvancedCalculations from "./routes/AdvancedCalculations";
// Import PrimeReact Dashboard
import PVOfferExample from "./components/PVOfferExample";
import ComponentsDemo from "./routes/ComponentsDemo";
// Modern home dashboard component
const HomeComponent = () => (_jsxs("div", { className: "dashboard-grid", children: [_jsxs("div", { className: "card welcome-card", children: [_jsxs("div", { className: "card-header", children: [_jsxs("h1", { className: "card-title", children: [_jsx("i", { className: "pi pi-home icon-primary" }), "Willkommen bei Kakerlake"] }), _jsx("p", { className: "card-subtitle", children: "Professionelle PV & W\u00E4rmepumpen Planungsplattform" })] }), _jsx("div", { className: "card-content", children: _jsx("p", { children: "Ihre All-in-One L\u00F6sung f\u00FCr Photovoltaik- und W\u00E4rmepumpen-Projekte. Von der ersten Kundenanfrage bis zum fertigen Angebot." }) })] }), _jsxs("div", { className: "card action-card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { className: "card-title", children: [_jsx("i", { className: "pi pi-bolt icon-success" }), "Schnellstart"] }) }), _jsx("div", { className: "card-content", children: _jsxs("div", { className: "action-buttons", children: [_jsxs("a", { href: "/project/mode", className: "action-button", children: [_jsx("i", { className: "pi pi-plus" }), _jsx("span", { children: "Neues Projekt" })] }), _jsxs("a", { href: "/crm/dashboard", className: "action-button", children: [_jsx("i", { className: "pi pi-chart-line" }), _jsx("span", { children: "CRM Dashboard" })] }), _jsxs("a", { href: "/calc/solar", className: "action-button", children: [_jsx("i", { className: "pi pi-sun" }), _jsx("span", { children: "Solar Kalkulator" })] }), _jsxs("a", { href: "/calc/heatpump", className: "action-button", children: [_jsx("i", { className: "pi pi-cog" }), _jsx("span", { children: "W\u00E4rmepumpe" })] })] }) })] }), _jsxs("div", { className: "card workflow-card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { className: "card-title", children: [_jsx("i", { className: "pi pi-sitemap icon-warning" }), "Projekt-Workflow"] }) }), _jsx("div", { className: "card-content", children: _jsxs("div", { className: "workflow-steps", children: [_jsxs("div", { className: "workflow-step", children: [_jsx("div", { className: "step-number", children: "1" }), _jsxs("div", { className: "step-content", children: [_jsx("h3", { children: "Anlagenmodus w\u00E4hlen" }), _jsx("p", { children: "PV, W\u00E4rmepumpe oder Kombination" })] })] }), _jsxs("div", { className: "workflow-step", children: [_jsx("div", { className: "step-number", children: "2" }), _jsxs("div", { className: "step-content", children: [_jsx("h3", { children: "Kundendaten erfassen" }), _jsx("p", { children: "Kontakt und Geb\u00E4udeinformationen" })] })] }), _jsxs("div", { className: "workflow-step", children: [_jsx("div", { className: "step-number", children: "3" }), _jsxs("div", { className: "step-content", children: [_jsx("h3", { children: "Bedarfsanalyse" }), _jsx("p", { children: "Verbrauch und Anforderungen" })] })] }), _jsxs("div", { className: "workflow-step", children: [_jsx("div", { className: "step-number", children: "4" }), _jsxs("div", { className: "step-content", children: [_jsx("h3", { children: "Konfiguration & Berechnung" }), _jsx("p", { children: "Technische Auslegung und Wirtschaftlichkeit" })] })] })] }) })] }), _jsxs("div", { className: "card recent-card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { className: "card-title", children: [_jsx("i", { className: "pi pi-clock icon-purple" }), "Letzte Projekte"] }) }), _jsx("div", { className: "card-content", children: _jsxs("div", { className: "recent-projects", children: [_jsxs("div", { className: "project-item", children: [_jsxs("div", { className: "project-info", children: [_jsx("h4", { children: "Familie M\u00FCller - PV Anlage" }), _jsx("p", { children: "12.5 kWp \u2022 Bearbeitet vor 2 Stunden" })] }), _jsx("div", { className: "project-status status-draft", children: "Entwurf" })] }), _jsxs("div", { className: "project-item", children: [_jsxs("div", { className: "project-info", children: [_jsx("h4", { children: "Gewerbe Schmidt GmbH" }), _jsx("p", { children: "45.8 kWp + W\u00E4rmepumpe \u2022 Vor 1 Tag" })] }), _jsx("div", { className: "project-status status-ready", children: "Bereit" })] }), _jsxs("div", { className: "project-item", children: [_jsxs("div", { className: "project-info", children: [_jsx("h4", { children: "Einfamilienhaus Weber" }), _jsx("p", { children: "8.2 kWp \u2022 Vor 3 Tagen" })] }), _jsx("div", { className: "project-status status-sent", children: "Gesendet" })] })] }) })] })] }));
// Modern page wrapper for functional components
const ModernPageWrapper = ({ title, category, children }) => {
    const getCategoryIcon = (cat) => {
        const icons = {
            project: 'pi-file',
            calc: 'pi-calculator',
            pdf: 'pi-file-pdf',
            crm: 'pi-users',
            planning: 'pi-sitemap',
            admin: 'pi-cog'
        };
        return icons[cat] || 'pi-file';
    };
    return (_jsxs("div", { className: "modern-page-container", children: [_jsx("div", { className: `page-header page-header-${category || 'default'}`, children: _jsxs("div", { className: "page-header-content", children: [_jsx("div", { className: "page-icon", children: _jsx("i", { className: `pi ${getCategoryIcon(category || '')}` }) }), _jsxs("div", { className: "page-title-section", children: [_jsx("h1", { className: "page-title", children: title }), _jsx("p", { className: "page-subtitle", children: "Professionelle Datenerfassung & Konfiguration" })] })] }) }), _jsx("div", { className: "page-content", children: _jsx("div", { className: "card functional-content-card", children: children }) })] }));
};
// Enhanced placeholder page with category-specific designs
const PlaceholderPage = ({ title, category }) => {
    const getCategoryConfig = (cat) => {
        const configs = {
            pdf: { icon: 'pi-file-pdf', color: 'icon-warning', gradient: 'var(--gradient-secondary)' },
            crm: { icon: 'pi-users', color: 'icon-purple', gradient: 'var(--gradient-success)' },
            planning: { icon: 'pi-sitemap', color: 'icon-primary', gradient: 'var(--gradient-primary)' },
            admin: { icon: 'pi-cog', color: 'icon-warning', gradient: 'var(--gradient-secondary)' }
        };
        return configs[cat] || { icon: 'pi-wrench', color: 'icon-warning', gradient: 'var(--gradient-primary)' };
    };
    const config = getCategoryConfig(category || '');
    return (_jsxs("div", { className: "modern-page-container", children: [_jsx("div", { className: `page-header page-header-${category || 'default'}`, children: _jsxs("div", { className: "page-header-content", children: [_jsx("div", { className: "page-icon", children: _jsx("i", { className: `pi ${config.icon}` }) }), _jsxs("div", { className: "page-title-section", children: [_jsx("h1", { className: "page-title", children: title }), _jsx("p", { className: "page-subtitle", children: "Professioneller Bereich in Entwicklung" })] })] }) }), _jsxs("div", { className: "page-content", children: [_jsxs("div", { className: "feature-cards", children: [_jsxs("div", { className: "card feature-card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { className: "card-title", children: [_jsx("i", { className: "pi pi-star icon-warning" }), "Kommende Features"] }) }), _jsx("div", { className: "card-content", children: _jsxs("div", { className: "feature-list", children: [_jsxs("div", { className: "feature-item", children: [_jsx("i", { className: "pi pi-check-circle icon-success" }), _jsx("span", { children: "Moderne und intuitive Benutzeroberfl\u00E4che" })] }), _jsxs("div", { className: "feature-item", children: [_jsx("i", { className: "pi pi-check-circle icon-success" }), _jsx("span", { children: "Nahtlose Integration mit bestehenden Workflows" })] }), _jsxs("div", { className: "feature-item", children: [_jsx("i", { className: "pi pi-check-circle icon-success" }), _jsx("span", { children: "Erweiterte Funktionalit\u00E4ten und Automatisierung" })] }), _jsxs("div", { className: "feature-item", children: [_jsx("i", { className: "pi pi-check-circle icon-success" }), _jsx("span", { children: "Responsive Design f\u00FCr alle Ger\u00E4te" })] })] }) })] }), _jsxs("div", { className: "card status-card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { className: "card-title", children: [_jsx("i", { className: "pi pi-info-circle icon-primary" }), "Entwicklungsstatus"] }) }), _jsx("div", { className: "card-content", children: _jsxs("div", { className: "status-info", children: [_jsxs("div", { className: "status-item", children: [_jsx("span", { className: "status-label", children: "Fortschritt:" }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill" }) }), _jsx("span", { className: "status-value", children: "65%" })] }), _jsxs("div", { className: "status-item", children: [_jsx("span", { className: "status-label", children: "Gesch\u00E4tzte Fertigstellung:" }), _jsx("span", { className: "status-value", children: "Q4 2025" })] }), _jsxs("div", { className: "status-item", children: [_jsx("span", { className: "status-label", children: "Priorit\u00E4t:" }), _jsx("span", { className: "status-badge high", children: "Hoch" })] })] }) })] })] }), _jsx("div", { className: "card navigation-card", children: _jsx("div", { className: "card-content", children: _jsxs("div", { className: "navigation-buttons", children: [_jsxs("button", { className: "p-button p-button-outlined", onClick: () => window.history.back(), children: [_jsx("i", { className: "pi pi-arrow-left" }), "Zur\u00FCck zur vorherigen Seite"] }), _jsxs("a", { href: "/home", className: "p-button", children: [_jsx("i", { className: "pi pi-home" }), "Zur Startseite"] }), _jsxs("a", { href: "/project/mode", className: "p-button p-button-success", children: [_jsx("i", { className: "pi pi-plus" }), "Neues Projekt starten"] })] }) }) })] })] }));
};
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
                { label: 'Zusatzoptionen', url: '/project/options' }
            ]
        },
        {
            label: 'Kalkulation',
            icon: 'pi pi-fw pi-calculator',
            items: [
                { label: 'Solarkalkulator', url: '/calc/solar' },
                { label: 'Wärmepumpen-Sim', url: '/calc/heatpump' },
                { label: 'Ergebnisse & Dashboard', url: '/calc/results' },
                { label: 'Erweiterte Berechnungen', url: '/calc/advanced' }
            ]
        },
        {
            label: 'Demo',
            icon: 'pi pi-fw pi-star',
            items: [
                { label: 'Neue Komponenten', url: '/demo/components' }
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
    const start = (_jsxs("div", { className: "app-brand", children: [_jsx("i", { className: "pi pi-flash" }), _jsx("span", { children: "Kakerlake \u2013 PV/WP" })] }));
    return (_jsxs("div", { className: "kakerlake-app", children: [_jsx(Menubar, { model: menuItems, start: start, className: "mb-4" }), _jsx("main", { className: "p-4", children: _jsx(Outlet, {}) })] }));
}
// Main App Component with Router
function App() {
    return (_jsx(AppProvider, { children: _jsx(ProjectProvider, { children: _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(AppLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "home", element: _jsx(HomeComponent, {}) }), _jsx(Route, { path: "project/mode", element: _jsx(ModernPageWrapper, { title: "Anlagenmodus ausw\u00E4hlen", category: "project", children: _jsx(ModeSelect, {}) }) }), _jsx(Route, { path: "project/customer", element: _jsx(ModernPageWrapper, { title: "Kundendaten erfassen", category: "project", children: _jsx(CustomerForm, {}) }) }), _jsx(Route, { path: "project/building", element: _jsx(ModernPageWrapper, { title: "Geb\u00E4udedaten & Eigenschaften", category: "project", children: _jsx(BuildingData, {}) }) }), _jsx(Route, { path: "project/demand", element: _jsx(ModernPageWrapper, { title: "Bedarfsanalyse & Verbrauch", category: "project", children: _jsx(DemandAnalysis, {}) }) }), _jsx(Route, { path: "project/options", element: _jsx(ModernPageWrapper, { title: "Zusatzoptionen & Konfiguration", category: "project", children: _jsx(AdditionalOptions, {}) }) }), _jsx(Route, { path: "calc/solar", element: _jsx(SolarCalculator, {}) }), _jsx(Route, { path: "calc/heatpump", element: _jsx(ModernPageWrapper, { title: "W\u00E4rmepumpen-Simulator", category: "calc", children: _jsx(HeatpumpSimulator, {}) }) }), _jsx(Route, { path: "calc/results", element: _jsx(ModernPageWrapper, { title: "Ergebnisse & Dashboard", category: "calc", children: _jsx(Results, {}) }) }), _jsx(Route, { path: "calc/advanced", element: _jsx(AdvancedCalculations, {}) }), _jsx(Route, { path: "dashboard/modern", element: _jsx(PVOfferExample, {}) }), _jsx(Route, { path: "demo/components", element: _jsx(ComponentsDemo, {}) }), _jsx(Route, { path: "pdf/standard", element: _jsx(PlaceholderPage, { title: "Standard-PDF Erstellung", category: "pdf" }) }), _jsx(Route, { path: "pdf/extended", element: _jsx(PlaceholderPage, { title: "Erweiterte PDF-Funktionen", category: "pdf" }) }), _jsx(Route, { path: "pdf/multi", element: _jsx(PlaceholderPage, { title: "Multi-PDF Generator", category: "pdf" }) }), _jsx(Route, { path: "pdf/preview", element: _jsx(PlaceholderPage, { title: "PDF Vorschau & Editor", category: "pdf" }) }), _jsx(Route, { path: "crm/dashboard", element: _jsx(PlaceholderPage, { title: "CRM Dashboard & Analytics", category: "crm" }) }), _jsx(Route, { path: "crm/customers", element: _jsx(PlaceholderPage, { title: "Kundenverwaltung & Kontakte", category: "crm" }) }), _jsx(Route, { path: "crm/pipeline", element: _jsx(PlaceholderPage, { title: "Pipeline & Workflow Management", category: "crm" }) }), _jsx(Route, { path: "crm/calendar", element: _jsx(PlaceholderPage, { title: "Termin- & Kalenderverwaltung", category: "crm" }) }), _jsx(Route, { path: "crm/quick-calc", element: _jsx(PlaceholderPage, { title: "Schnellkalkulation & Angebote", category: "crm" }) }), _jsx(Route, { path: "planning/info", element: _jsx(PlaceholderPage, { title: "Informationsportal & Wissensbasis", category: "planning" }) }), _jsx(Route, { path: "planning/documents", element: _jsx(PlaceholderPage, { title: "Dokument- & Dateiverwaltung", category: "planning" }) }), _jsx(Route, { path: "admin/login", element: _jsx(PlaceholderPage, { title: "Administratoren Login", category: "admin" }) }), _jsx(Route, { path: "admin/companies", element: _jsx(PlaceholderPage, { title: "Firmen- & Unternehmensverwaltung", category: "admin" }) }), _jsx(Route, { path: "admin/products", element: _jsx(PlaceholderPage, { title: "Produkt- & Komponentenverwaltung", category: "admin" }) }), _jsx(Route, { path: "admin/price-matrix", element: _jsx(PlaceholderPage, { title: "Preis-Matrix & Kalkulation", category: "admin" }) }), _jsx(Route, { path: "admin/tariffs", element: _jsx(PlaceholderPage, { title: "Tarif- & Geb\u00FChrenverwaltung", category: "admin" }) }), _jsx(Route, { path: "admin/settings", element: _jsx(PlaceholderPage, { title: "System- & Anwendungseinstellungen", category: "admin" }) }), _jsx(Route, { path: "*", element: _jsx(PlaceholderPage, { title: "\u2753 Seite nicht gefunden" }) })] }) }) }) }) }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(_jsx(App, {}));
