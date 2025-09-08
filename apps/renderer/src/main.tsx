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
import Dashboard from "./routes/Dashboard";
import { ProjectProvider } from "./lib/projectContext";

// TEMPORÄR: CalculationProgress direkt hier definieren bis die externe Datei funktioniert
function CalculationProgress() {
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("Initialisiere Berechnungen...");
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    // Simuliere Berechnungsfortschritt
    const steps = [
      { progress: 10, status: "Lade Konfiguration..." },
      { progress: 25, status: "Berechne PV-Produktion..." },
      { progress: 40, status: "Analysiere Eigenverbrauch..." },
      { progress: 55, status: "Optimiere Speichernutzung..." },
      { progress: 70, status: "Berechne Wirtschaftlichkeit..." },
      { progress: 85, status: "Erstelle Visualisierungen..." },
      { progress: 100, status: "Berechnungen abgeschlossen!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        
        try {
          // Lade gespeicherte Konfiguration
          const savedConfig = localStorage.getItem('kakerlake_solar_config');
          const config = savedConfig ? JSON.parse(savedConfig) : {
            moduleQty: 20,
            withStorage: true,
            storageDesiredKWh: 10
          };
          
          // Berechne realistische Werte basierend auf der Konfiguration
          const moduleWp = 440; // Standard Viessmann Modul
          const moduleQty = config.moduleQty || 20;
          const anlage_kwp = (moduleQty * moduleWp) / 1000;
          const sonnenstunden = 950; // kWh/kWp/Jahr in Deutschland
          const annual_pv_production_kwh = anlage_kwp * sonnenstunden;
          const eigenverbrauch_anteil = config.withStorage ? 0.65 : 0.35;
          const eigenverbrauch_kwh = annual_pv_production_kwh * eigenverbrauch_anteil;
          const einspeisung_kwh = annual_pv_production_kwh - eigenverbrauch_kwh;
          const jahresverbrauch_kwh = 4500; // Standard Haushalt
          const autarkiegrad = Math.min((eigenverbrauch_kwh / jahresverbrauch_kwh) * 100, 100);
          const strompreis_cent = 35;
          const einspeiseverguetung_cent = 8.2;
          const invest_per_kwp = config.withStorage ? 1800 : 1400;
          const total_investment = anlage_kwp * invest_per_kwp;
          const jaehrliche_ersparnis = (eigenverbrauch_kwh * strompreis_cent + einspeisung_kwh * einspeiseverguetung_cent) / 100;
          const amortisation = total_investment / jaehrliche_ersparnis;
          const co2_ersparnis_kg = annual_pv_production_kwh * 0.4;
          
          // Speichere realistische Ergebnisse für Dashboard
          const results = {
            config: config,
            results: {
              anlage_kwp: anlage_kwp,
              annual_pv_production_kwh: Math.round(annual_pv_production_kwh),
              specific_yield_kwh_per_kwp: sonnenstunden,
              performance_ratio_percent: 85,
              self_consumption_rate_percent: eigenverbrauch_anteil * 100,
              autarky_rate_percent: autarkiegrad,
              annual_grid_feed_kwh: Math.round(einspeisung_kwh),
              annual_grid_consumption_kwh: Math.round(jahresverbrauch_kwh - eigenverbrauch_kwh),
              total_investment_netto: total_investment,
              total_investment_brutto: total_investment * 1.19,
              payback_time_years: amortisation,
              npv_25_years: jaehrliche_ersparnis * 25 - total_investment,
              irr_percent: (jaehrliche_ersparnis / total_investment) * 100,
              lcoe_cent_per_kwh: (total_investment / (annual_pv_production_kwh * 25)) * 100,
              annual_savings_euro: jaehrliche_ersparnis,
              annual_co2_savings_kg: co2_ersparnis_kg,
              tree_equivalent: Math.round(co2_ersparnis_kg / 12.5),
              car_km_equivalent: Math.round(co2_ersparnis_kg / 0.12),
              storage_capacity_kwh: config.withStorage ? (config.storageDesiredKWh || 10) : 0,
              storage_cycles_per_year: config.withStorage ? 250 : 0,
              storage_efficiency_percent: config.withStorage ? 95 : 0,
            },
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem('kakerlake_solar_calculations', JSON.stringify(results));
          console.log('Berechnungsergebnisse gespeichert:', results);
        } catch (error) {
          console.error('Fehler beim Speichern der Berechnungen:', error);
        }
        
        setIsComplete(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Berechnungen</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/solar')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>←</span>
                <span>Zurück</span>
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <span>🏠</span>
                <span>Hauptmenü</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isComplete ? '✅ Berechnung abgeschlossen!' : '🔄 Berechnung läuft...'}
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{status}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isComplete && (
            <div className="border-t pt-6">
              <p className="text-gray-600 mb-6 text-center">
                Die Berechnungen wurden erfolgreich abgeschlossen und gespeichert.
                Sie können nun die Ergebnisse im Dashboard einsehen oder zur Konfiguration zurückkehren.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>📊</span>
                  <span>Zum Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Zum Hauptmenü
                </button>
              </div>
            </div>
          )}
          
          {!isComplete && (
            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Bitte warten Sie, während wir Ihre Solaranlage optimieren...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder Results component um den Fehler zu vermeiden
function Results() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ergebnisse</h1>
          <p className="text-gray-600">Diese Seite wird noch entwickelt...</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderNav />
      <main className="container mx-auto p-6">
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/project/*" element={<ProjectWizard />} />
          <Route path="/solar" element={<SolarCalc />} />
          <Route path="/calculation-progress" element={<CalculationProgress />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          
          {/* Alias für Menü-Links */}
          <Route path="/calc/solar" element={<SolarCalc />} />
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

function HeaderNav() {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">🔧 Kakerlake PV/WP Tool</h1>
          <p className="text-sm text-gray-600">Photovoltaik und Wärmepumpen Planungstool</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">← Zurück</button>
          <Link to="/home" className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">🏠 Hauptmenü</Link>
        </div>
      </div>
    </header>
  );
}

function Home() {
  const navigate = useNavigate();

  const clearAllData = () => {
    if (confirm('⚠️ ACHTUNG: Alle gespeicherten Projektdaten löschen?\n\nDies löscht:\n- Kundendaten\n- Gebäudedaten\n- Verbrauchsdaten\n- Alle Projekteinstellungen\n\nDieser Vorgang kann nicht rückgängig gemacht werden!')) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('kakerlake')) {
          localStorage.removeItem(key);
        }
      });
      alert('✅ Alle Projektdaten wurden erfolgreich gelöscht!');
      window.location.reload();
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
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: '📊', 
      color: 'text-cyan-600', 
      path: '/dashboard',
      description: 'Berechnungsergebnisse und KPI-Visualisierungen' 
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
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
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

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-800 flex items-center mb-2">
          🛠️ Entwickler-Tools
        </h3>
        <p className="text-red-700 text-sm mb-4">
          Diese Funktionen sind für Entwicklung und Debugging gedacht.
        </p>
        <div className="flex gap-3">
          <button
            onClick={clearAllData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            🗑️ Alle Projektdaten löschen
          </button>
          <button
            onClick={() => {
              console.log('localStorage contents:', localStorage);
              alert('Siehe Browser-Konsole (F12) für localStorage-Inhalte');
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            🔍 localStorage anzeigen
          </button>
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
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </BrowserRouter>
  </React.StrictMode>
);
