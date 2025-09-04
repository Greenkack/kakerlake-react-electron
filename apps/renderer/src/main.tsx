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

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-blue-600">🔧 Kakerlake PV/WP Tool</h1>
        <p className="text-sm text-gray-600">Photovoltaik und Wärmepumpen Planungstool</p>
      </header>
      <main className="container mx-auto p-6">
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/project/*" element={<ProjectWizard />} />
          <Route path="/solar" element={<SolarCalc />} />
          <Route path="/heatpump" element={<HeatpumpSim />} />
          <Route path="/pdf/*" element={<PdfHubReal />} />
          <Route path="/crm" element={<CRMMenuReal />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

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

  const handleMenuClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Willkommen bei Kakerlake</h2>
        <p className="text-gray-600">Ihr professionelles Tool für PV- und Wärmepumpen-Projekte</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className={`font-semibold text-lg mb-2 ${item.color}`}>{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 flex items-center mb-2">
          ✅ System Status
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-700">App Status:</span>
            <span className="text-green-800 font-medium">Läuft erfolgreich</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Aktueller Pfad:</span>
            <span className="text-green-800 font-mono">{window.location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Build-Zeit:</span>
            <span className="text-green-800 font-mono">{new Date().toLocaleString('de-DE')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">Seite nicht gefunden</h2>
      <p className="text-gray-600 mb-6">Die angeforderte Seite existiert nicht.</p>
      <Link 
        to="/home" 
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        🏠 Zur Startseite
      </Link>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
