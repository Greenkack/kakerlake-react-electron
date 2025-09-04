/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Navigationskomponente für PDF-Seiten
function PdfNavigation() {
  const location = useLocation();
  
  return (
    <div className="bg-white border-b border-slate-200 mb-6">
      <div className="flex flex-wrap gap-2 p-4">
        <Link
          to="/pdf"
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/pdf' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📄 PDF-Hub
        </Link>
        <Link
          to="/pdf/standard"
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/pdf/standard' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📑 Standard
        </Link>
        <Link
          to="/pdf/extended"
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/pdf/extended' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📋 Erweitert
        </Link>
        <Link
          to="/pdf/multi"
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/pdf/multi' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📚 Multi-PDF
        </Link>
        <Link
          to="/pdf/preview"
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/pdf/preview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          👁️ Vorschau
        </Link>
        <Link
          to="/"
          className="ml-auto px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          ← Startseite
        </Link>
      </div>
    </div>
  );
}

function PdfStandard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PdfNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Standard-PDF (7 Seiten)</h3>
          <p className="text-slate-600 mb-6">
            Klassisches Angebot mit PV-Templates (nt_nt_01 bis nt_nt_07) oder 
            WP-Templates (hp_nt_01 bis hp_nt_07).
          </p>
          <div className="space-y-3">
            <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50 border-slate-200 shadow-sm">
              📑 PV-Standard-PDF generieren
            </button>
            <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50 border-slate-200 shadow-sm">
              🔥 WP-Standard-PDF generieren
            </button>
            <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50 border-slate-200 shadow-sm">
              ⚡ Kombiniertes PV+WP-PDF generieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfExtended() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PdfNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Erweiterte PDF-Ausgabe</h3>
          <p className="text-slate-600 mb-6">
            Standard-PDF plus zusätzliche Optionen wie Datenblätter, Diagramme, 
            Firmen-Dokumente und AGB.
          </p>
          <div className="grid gap-3 md:grid-cols-2 mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span>📋 Produkt-Datenblätter</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span>📊 Wirtschaftlichkeits-Diagramme</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span>🏢 Firmen-Logos & Zertifikate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span>📜 AGB & Vertragskonditionen</span>
            </label>
          </div>
          <button className="w-full rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors">
            📄 Erweiterte PDF generieren
          </button>
        </div>
      </div>
    </div>
  );
}

function PdfMulti() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PdfNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Multi-PDF Generation</h3>
          <p className="text-slate-600 mb-6">
            Erstellt mehrere Angebote verschiedener Firmen mit unterschiedlichen 
            Preisen und Brandings als ZIP-Download.
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Anzahl Firmen</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2">
                <option>2 Firmen</option>
                <option>3 Firmen</option>
                <option>5 Firmen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preis-Staffelung</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2">
                <option>Linear (-5%, -10%, -15%)</option>
                <option>Zufällig (±5-15%)</option>
                <option>Kategoriespezifisch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rotation</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2">
                <option>Linear</option>
                <option>Zufällig</option>
                <option>Nach Firmengröße</option>
              </select>
            </div>
          </div>
          <button className="w-full rounded bg-purple-600 px-4 py-3 text-white hover:bg-purple-700 transition-colors">
            📚 Multi-PDF erstellen (ZIP-Download)
          </button>
        </div>
      </div>
    </div>
  );
}

function PdfPreview() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PdfNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">PDF-Vorschau</h3>
          <p className="text-slate-600 mb-6">
            Schnellvorschau, vollständige Vorschau oder seitenweise Ansicht 
            mit Zoom und Debug-Overlay.
          </p>
          <div className="grid gap-3 md:grid-cols-3 mb-6">
            <button className="rounded border border-slate-300 bg-white p-3 hover:bg-slate-50 transition-colors">
              ⚡ Schnellvorschau (3 Sek.)
            </button>
            <button className="rounded border border-slate-300 bg-white p-3 hover:bg-slate-50 transition-colors">
              📋 Vollständige Vorschau
            </button>
            <button className="rounded border border-slate-300 bg-white p-3 hover:bg-slate-50 transition-colors">
              📄 Seitenweise durchblättern
            </button>
          </div>
          <div className="mt-4 border rounded p-8 bg-slate-50 border-slate-300">
            <div className="text-center text-slate-500">
              📄 PDF-Vorschau wird hier angezeigt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfHubMain() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PdfNavigation />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">📄 PDF-Generator Hub</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Erstellen Sie professionelle PV-Angebote in verschiedenen Varianten. 
            Von Standard-PDFs bis hin zu erweiterten Multi-Angeboten.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/pdf/standard"
            className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow border-slate-200"
          >
            <div className="text-4xl mb-4 text-center">📑</div>
            <h3 className="text-lg font-semibold mb-2 text-center">Standard-PDF</h3>
            <p className="text-sm text-slate-600 text-center">
              Klassische 7-seitige Angebote für PV oder Wärmepumpen
            </p>
          </Link>

          <Link
            to="/pdf/extended"
            className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow border-slate-200"
          >
            <div className="text-4xl mb-4 text-center">📋</div>
            <h3 className="text-lg font-semibold mb-2 text-center">Erweiterte PDF</h3>
            <p className="text-sm text-slate-600 text-center">
              Standard + Datenblätter, Diagramme und Zusatzdokumente
            </p>
          </Link>

          <Link
            to="/pdf/multi"
            className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow border-slate-200"
          >
            <div className="text-4xl mb-4 text-center">📚</div>
            <h3 className="text-lg font-semibold mb-2 text-center">Multi-PDF</h3>
            <p className="text-sm text-slate-600 text-center">
              Mehrere Angebote verschiedener Firmen als ZIP-Download
            </p>
          </Link>

          <Link
            to="/pdf/preview"
            className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow border-slate-200"
          >
            <div className="text-4xl mb-4 text-center">👁️</div>
            <h3 className="text-lg font-semibold mb-2 text-center">Vorschau</h3>
            <p className="text-sm text-slate-600 text-center">
              PDF-Vorschau mit Zoom und Debug-Funktionen
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PdfHub(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<PdfHubMain />} />
      <Route path="/standard" element={<PdfStandard />} />
      <Route path="/extended" element={<PdfExtended />} />
      <Route path="/multi" element={<PdfMulti />} />
      <Route path="/preview" element={<PdfPreview />} />
    </Routes>
  );
}
