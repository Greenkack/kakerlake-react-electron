import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Willkommen bei Kakerlake</h2>
        <p className="text-gray-600">Ihr professionelles Tool für PV- und Wärmepumpen-Projekte</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">🏗️</div>
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Neues Projekt</h3>
          <p className="text-gray-600">Starten Sie ein neues PV-Projekt mit vollständiger Bedarfsanalyse</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">☀️</div>
          <h3 className="font-semibold text-lg mb-2 text-green-600">Solar-Rechner</h3>
          <p className="text-gray-600">Schnelle Kalkulation für Photovoltaik-Anlagen</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">🔥</div>
          <h3 className="font-semibold text-lg mb-2 text-orange-600">Wärmepumpe</h3>
          <p className="text-gray-600">Wärmepumpen-Simulation und Dimensionierung</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">📄</div>
          <h3 className="font-semibold text-lg mb-2 text-purple-600">PDF-Generator</h3>
          <p className="text-gray-600">Professionelle Angebote und Dokumentationen</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">👥</div>
          <h3 className="font-semibold text-lg mb-2 text-indigo-600">CRM</h3>
          <p className="text-gray-600">Kundenverwaltung und Projekt-Pipeline</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">⚙️</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-600">Administration</h3>
          <p className="text-gray-600">System-Einstellungen und Konfiguration</p>
        </div>
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
      <a 
        href="/home" 
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        🏠 Zur Startseite
      </a>
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
