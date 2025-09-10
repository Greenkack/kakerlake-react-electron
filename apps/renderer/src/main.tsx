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
import AdvancedCalculations from "./routes/AdvancedCalculations";

// Import PrimeReact Dashboard
import PVOfferExample from "./components/PVOfferExample";

// Modern home dashboard component
const HomeComponent = () => (
  <div className="dashboard-grid">
    {/* Welcome Card */}
    <div className="card welcome-card">
      <div className="card-header">
        <h1 className="card-title">
          <i className="pi pi-home icon-primary"></i>
          Willkommen bei Kakerlake
        </h1>
        <p className="card-subtitle">Professionelle PV & Wärmepumpen Planungsplattform</p>
      </div>
      <div className="card-content">
        <p>Ihre All-in-One Lösung für Photovoltaik- und Wärmepumpen-Projekte. Von der ersten Kundenanfrage bis zum fertigen Angebot.</p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="card action-card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="pi pi-bolt icon-success"></i>
          Schnellstart
        </h2>
      </div>
      <div className="card-content">
        <div className="action-buttons">
          <a href="/project/mode" className="action-button">
            <i className="pi pi-plus"></i>
            <span>Neues Projekt</span>
          </a>
          <a href="/crm/dashboard" className="action-button">
            <i className="pi pi-chart-line"></i>
            <span>CRM Dashboard</span>
          </a>
          <a href="/calc/solar" className="action-button">
            <i className="pi pi-sun"></i>
            <span>Solar Kalkulator</span>
          </a>
          <a href="/calc/heatpump" className="action-button">
            <i className="pi pi-cog"></i>
            <span>Wärmepumpe</span>
          </a>
        </div>
      </div>
    </div>

    {/* Project Workflow */}
    <div className="card workflow-card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="pi pi-sitemap icon-warning"></i>
          Projekt-Workflow
        </h2>
      </div>
      <div className="card-content">
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Anlagenmodus wählen</h3>
              <p>PV, Wärmepumpe oder Kombination</p>
            </div>
          </div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Kundendaten erfassen</h3>
              <p>Kontakt und Gebäudeinformationen</p>
            </div>
          </div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Bedarfsanalyse</h3>
              <p>Verbrauch und Anforderungen</p>
            </div>
          </div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Konfiguration & Berechnung</h3>
              <p>Technische Auslegung und Wirtschaftlichkeit</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Projects (Placeholder) */}
    <div className="card recent-card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="pi pi-clock icon-purple"></i>
          Letzte Projekte
        </h2>
      </div>
      <div className="card-content">
        <div className="recent-projects">
          <div className="project-item">
            <div className="project-info">
              <h4>Familie Müller - PV Anlage</h4>
              <p>12.5 kWp • Bearbeitet vor 2 Stunden</p>
            </div>
            <div className="project-status status-draft">Entwurf</div>
          </div>
          <div className="project-item">
            <div className="project-info">
              <h4>Gewerbe Schmidt GmbH</h4>
              <p>45.8 kWp + Wärmepumpe • Vor 1 Tag</p>
            </div>
            <div className="project-status status-ready">Bereit</div>
          </div>
          <div className="project-item">
            <div className="project-info">
              <h4>Einfamilienhaus Weber</h4>
              <p>8.2 kWp • Vor 3 Tagen</p>
            </div>
            <div className="project-status status-sent">Gesendet</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Modern page wrapper for functional components
const ModernPageWrapper = ({ 
  title, 
  category, 
  children 
}: { 
  title: string; 
  category?: string; 
  children: React.ReactNode 
}) => {
  const getCategoryIcon = (cat: string) => {
    const icons = {
      project: 'pi-file',
      calc: 'pi-calculator', 
      pdf: 'pi-file-pdf',
      crm: 'pi-users',
      planning: 'pi-sitemap',
      admin: 'pi-cog'
    };
    return icons[cat as keyof typeof icons] || 'pi-file';
  };

  return (
    <div className="modern-page-container">
      <div className={`page-header page-header-${category || 'default'}`}>
        <div className="page-header-content">
          <div className="page-icon">
            <i className={`pi ${getCategoryIcon(category || '')}`}></i>
          </div>
          <div className="page-title-section">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">Professionelle Datenerfassung & Konfiguration</p>
          </div>
        </div>
      </div>
      
      <div className="page-content">
        <div className="card functional-content-card">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced placeholder page with category-specific designs
const PlaceholderPage = ({ title, category }: { title: string; category?: string }) => {
  const getCategoryConfig = (cat: string) => {
    const configs = {
      pdf: { icon: 'pi-file-pdf', color: 'icon-warning', gradient: 'var(--gradient-secondary)' },
      crm: { icon: 'pi-users', color: 'icon-purple', gradient: 'var(--gradient-success)' },
      planning: { icon: 'pi-sitemap', color: 'icon-primary', gradient: 'var(--gradient-primary)' },
      admin: { icon: 'pi-cog', color: 'icon-warning', gradient: 'var(--gradient-secondary)' }
    };
    return configs[cat as keyof typeof configs] || { icon: 'pi-wrench', color: 'icon-warning', gradient: 'var(--gradient-primary)' };
  };

  const config = getCategoryConfig(category || '');
  
  return (
    <div className="modern-page-container">
      <div className={`page-header page-header-${category || 'default'}`}>
        <div className="page-header-content">
          <div className="page-icon">
            <i className={`pi ${config.icon}`}></i>
          </div>
          <div className="page-title-section">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">Professioneller Bereich in Entwicklung</p>
          </div>
        </div>
      </div>
      
      <div className="page-content">
        <div className="feature-cards">
          <div className="card feature-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="pi pi-star icon-warning"></i>
                Kommende Features
              </h2>
            </div>
            <div className="card-content">
              <div className="feature-list">
                <div className="feature-item">
                  <i className="pi pi-check-circle icon-success"></i>
                  <span>Moderne und intuitive Benutzeroberfläche</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-check-circle icon-success"></i>
                  <span>Nahtlose Integration mit bestehenden Workflows</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-check-circle icon-success"></i>
                  <span>Erweiterte Funktionalitäten und Automatisierung</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-check-circle icon-success"></i>
                  <span>Responsive Design für alle Geräte</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card status-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="pi pi-info-circle icon-primary"></i>
                Entwicklungsstatus
              </h2>
            </div>
            <div className="card-content">
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Fortschritt:</span>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="status-value">65%</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Geschätzte Fertigstellung:</span>
                  <span className="status-value">Q4 2025</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Priorität:</span>
                  <span className="status-badge high">Hoch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card navigation-card">
          <div className="card-content">
            <div className="navigation-buttons">
              <button className="p-button p-button-outlined" onClick={() => window.history.back()}>
                <i className="pi pi-arrow-left"></i>
                Zurück zur vorherigen Seite
              </button>
              <a href="/home" className="p-button">
                <i className="pi pi-home"></i>
                Zur Startseite
              </a>
              <a href="/project/mode" className="p-button p-button-success">
                <i className="pi pi-plus"></i>
                Neues Projekt starten
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const start = (
    <div className="app-brand">
      <i className="pi pi-flash"></i>
      <span>Kakerlake – PV/WP</span>
    </div>
  );

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
            
            {/* Project Routes - Real Components with Modern Layout */}
            <Route path="project/mode" element={<ModernPageWrapper title="Anlagenmodus auswählen" category="project"><ModeSelect /></ModernPageWrapper>} />
            <Route path="project/customer" element={<ModernPageWrapper title="Kundendaten erfassen" category="project"><CustomerForm /></ModernPageWrapper>} />
            <Route path="project/building" element={<ModernPageWrapper title="Gebäudedaten & Eigenschaften" category="project"><BuildingData /></ModernPageWrapper>} />
            <Route path="project/demand" element={<ModernPageWrapper title="Bedarfsanalyse & Verbrauch" category="project"><DemandAnalysis /></ModernPageWrapper>} />
            <Route path="project/options" element={<ModernPageWrapper title="Zusatzoptionen & Konfiguration" category="project"><AdditionalOptions /></ModernPageWrapper>} />
            
            {/* Calculation Routes - Real Components with Modern Layout */}
            <Route path="calc/solar" element={<SolarCalculator />} />
            <Route path="calc/heatpump" element={<ModernPageWrapper title="Wärmepumpen-Simulator" category="calc"><HeatpumpSimulator /></ModernPageWrapper>} />
            <Route path="calc/results" element={<ModernPageWrapper title="Ergebnisse & Dashboard" category="calc"><Results /></ModernPageWrapper>} />
            <Route path="calc/advanced" element={<AdvancedCalculations />} />
            
            {/* Modern Dashboard Route */}
            <Route path="dashboard/modern" element={<PVOfferExample />} />
            
            {/* PDF Routes */}
            <Route path="pdf/standard" element={<PlaceholderPage title="Standard-PDF Erstellung" category="pdf" />} />
            <Route path="pdf/extended" element={<PlaceholderPage title="Erweiterte PDF-Funktionen" category="pdf" />} />
            <Route path="pdf/multi" element={<PlaceholderPage title="Multi-PDF Generator" category="pdf" />} />
            <Route path="pdf/preview" element={<PlaceholderPage title="PDF Vorschau & Editor" category="pdf" />} />
            
            {/* CRM Routes */}
            <Route path="crm/dashboard" element={<PlaceholderPage title="CRM Dashboard & Analytics" category="crm" />} />
            <Route path="crm/customers" element={<PlaceholderPage title="Kundenverwaltung & Kontakte" category="crm" />} />
            <Route path="crm/pipeline" element={<PlaceholderPage title="Pipeline & Workflow Management" category="crm" />} />
            <Route path="crm/calendar" element={<PlaceholderPage title="Termin- & Kalenderverwaltung" category="crm" />} />
            <Route path="crm/quick-calc" element={<PlaceholderPage title="Schnellkalkulation & Angebote" category="crm" />} />
            
            {/* Planning Routes */}
            <Route path="planning/info" element={<PlaceholderPage title="Informationsportal & Wissensbasis" category="planning" />} />
            <Route path="planning/documents" element={<PlaceholderPage title="Dokument- & Dateiverwaltung" category="planning" />} />
            
            {/* Admin Routes */}
            <Route path="admin/login" element={<PlaceholderPage title="Administratoren Login" category="admin" />} />
            <Route path="admin/companies" element={<PlaceholderPage title="Firmen- & Unternehmensverwaltung" category="admin" />} />
            <Route path="admin/products" element={<PlaceholderPage title="Produkt- & Komponentenverwaltung" category="admin" />} />
            <Route path="admin/price-matrix" element={<PlaceholderPage title="Preis-Matrix & Kalkulation" category="admin" />} />
            <Route path="admin/tariffs" element={<PlaceholderPage title="Tarif- & Gebührenverwaltung" category="admin" />} />
            <Route path="admin/settings" element={<PlaceholderPage title="System- & Anwendungseinstellungen" category="admin" />} />
            
            <Route path="*" element={<PlaceholderPage title="❓ Seite nicht gefunden" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
