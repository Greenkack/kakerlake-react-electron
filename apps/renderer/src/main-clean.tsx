import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
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
const HomeComponent = () => (
  <div className="card">
    <h1>🏠 Kakerlake PV/WP Tool</h1>
    <p>Willkommen beim Photovoltaik und Wärmepumpen Planungstool</p>
    <div className="mt-4">
      <p>Starten Sie mit:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Projekt → Anlagenmodus wählen</li>
        <li>Kundendaten erfassen</li>
        <li>Gebäude und Verbrauch analysieren</li>
        <li>Technische Konfiguration</li>
        <li>Ergebnisse berechnen</li>
      </ul>
    </div>
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="card">
    <h1>{title}</h1>
    <p>Diese Seite ist noch in Entwicklung...</p>
  </div>
);

// App Layout Component
function AppLayout() {
  const menuItems: MenuItem[] = [
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

  const start = <div className="font-bold text-primary">Kakerlake – PV/WP</div>;

  return (
    <div className="kakerlake-app">
      <Menubar model={menuItems} start={start} className="mb-4" />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

// Main App Component with Router
function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomeComponent />} />
            
            {/* Project Routes - Real Components */}
            <Route path="project/mode" element={<ModeSelect />} />
            <Route path="project/customer" element={<CustomerForm />} />
            <Route path="project/building" element={<BuildingData />} />
            <Route path="project/demand" element={<DemandAnalysis />} />
            <Route path="project/needs" element={<NeedsAnalysis />} />
            <Route path="project/options" element={<AdditionalOptions />} />
            
            {/* Calculation Routes - Real Components */}
            <Route path="calc/solar" element={<SolarCalculator />} />
            <Route path="calc/heatpump" element={<HeatpumpSimulator />} />
            <Route path="calc/results" element={<Results />} />
            
            {/* PDF Routes */}
            <Route path="pdf/standard" element={<PlaceholderPage title="📄 Standard-PDF" />} />
            <Route path="pdf/extended" element={<PlaceholderPage title="📑 Erweiterte PDFs" />} />
            <Route path="pdf/multi" element={<PlaceholderPage title="📚 Multi-PDF" />} />
            <Route path="pdf/preview" element={<PlaceholderPage title="👁️ Vorschau" />} />
            
            {/* CRM Routes */}
            <Route path="crm/dashboard" element={<PlaceholderPage title="📈 CRM Dashboard" />} />
            <Route path="crm/customers" element={<PlaceholderPage title="👥 Kundenverwaltung" />} />
            <Route path="crm/pipeline" element={<PlaceholderPage title="🔄 Pipeline & Workflows" />} />
            <Route path="crm/calendar" element={<PlaceholderPage title="📅 Kalender" />} />
            <Route path="crm/quick-calc" element={<PlaceholderPage title="⚡ Schnellkalkulation" />} />
            
            {/* Planning Routes */}
            <Route path="planning/info" element={<PlaceholderPage title="ℹ️ Informationsportal" />} />
            <Route path="planning/documents" element={<PlaceholderPage title="📋 Dokumente" />} />
            
            {/* Admin Routes */}
            <Route path="admin/login" element={<PlaceholderPage title="🔐 Login" />} />
            <Route path="admin/companies" element={<PlaceholderPage title="🏢 Firmenverwaltung" />} />
            <Route path="admin/products" element={<PlaceholderPage title="📦 Produktverwaltung" />} />
            <Route path="admin/price-matrix" element={<PlaceholderPage title="💰 Preis-Matrix" />} />
            <Route path="admin/tariffs" element={<PlaceholderPage title="💡 Tarifverwaltung" />} />
            <Route path="admin/settings" element={<PlaceholderPage title="⚙️ Einstellungen" />} />
            
            <Route path="*" element={<PlaceholderPage title="❓ Seite nicht gefunden" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
