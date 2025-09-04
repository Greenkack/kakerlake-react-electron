/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

function PdfStandard() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Standard-PDF (7 Seiten)</h3>
      <p className="text-slate-600">
        Klassisches Angebot mit PV-Templates (nt_nt_01 bis nt_nt_07) oder 
        WP-Templates (hp_nt_01 bis hp_nt_07).
      </p>
      <div className="space-y-3">
        <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50">
          PV-Standard-PDF generieren
        </button>
        <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50">
          WP-Standard-PDF generieren
        </button>
        <button className="block w-full rounded border bg-white p-3 text-left hover:bg-slate-50">
          Kombiniertes PV+WP-PDF generieren
        </button>
      </div>
    </div>
  );
}

function PdfExtended() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Erweiterte PDF-Ausgabe</h3>
      <p className="text-slate-600">
        Standard-PDF plus zusätzliche Optionen wie Datenblätter, Diagramme, 
        Firmen-Dokumente und AGB.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Produkt-Datenblätter</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Wirtschaftlichkeits-Diagramme</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Firmen-Logos & Zertifikate</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>AGB & Vertragskonditionen</span>
        </label>
      </div>
      <button className="w-full rounded bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
        Erweiterte PDF generieren
      </button>
    </div>
  );
}

function PdfMulti() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Multi-PDF Generation</h3>
      <p className="text-slate-600">
        Erstellt mehrere Angebote verschiedener Firmen mit unterschiedlichen 
        Preisen und Brandings als ZIP-Download.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Anzahl Firmen</label>
          <select className="w-full rounded border px-3 py-2">
            <option>2 Firmen</option>
            <option>3 Firmen</option>
            <option>5 Firmen</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preis-Staffelung</label>
          <select className="w-full rounded border px-3 py-2">
            <option>Linear (-5%, -10%, -15%)</option>
            <option>Zufällig (±5-15%)</option>
            <option>Kategoriespezifisch</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rotation</label>
          <select className="w-full rounded border px-3 py-2">
            <option>Linear</option>
            <option>Zufällig</option>
            <option>Nach Firmengröße</option>
          </select>
        </div>
      </div>
      <button className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
        Multi-PDF erstellen (ZIP-Download)
      </button>
    </div>
  );
}

function PdfPreview() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">PDF-Vorschau</h3>
      <p className="text-slate-600">
        Schnellvorschau, vollständige Vorschau oder seitenweise Ansicht 
        mit Zoom und Debug-Overlay.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <button className="rounded border bg-white p-3 hover:bg-slate-50">
          Schnellvorschau (3 Sek.)
        </button>
        <button className="rounded border bg-white p-3 hover:bg-slate-50">
          Vollständige Vorschau
        </button>
        <button className="rounded border bg-white p-3 hover:bg-slate-50">
          Seitenweise durchblättern
        </button>
      </div>
      <div className="mt-4 border rounded p-4 bg-slate-50">
        <div className="text-center text-slate-500">
          📄 PDF-Vorschau wird hier angezeigt
        </div>
      </div>
    </div>
  );
}

export default function PdfHub() {
  const location = useLocation();
  const isSubRoute = location.pathname !== '/pdf';

  if (isSubRoute) {
    return (
      <Routes>
        <Route path="/standard" element={<PdfStandard />} />
        <Route path="/extended" element={<PdfExtended />} />
        <Route path="/multi" element={<PdfMulti />} />
        <Route path="/preview" element={<PdfPreview />} />
      </Routes>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">PDF-Angebotsausgabe</h2>
      <p className="text-slate-600">
        Wählen Sie die gewünschte PDF-Ausgabe-Option aus.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/pdf/standard"
          className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Standard-PDF</h3>
          <p className="text-sm text-slate-600">
            7-seitiges Standardangebot mit Templates (PV: nt_nt_*, WP: hp_nt_*)
          </p>
        </Link>

        <Link
          to="/pdf/extended"
          className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Erweiterte PDFs</h3>
          <p className="text-sm text-slate-600">
            Standard + Datenblätter, Logos, Diagramme, Verträge, AGB
          </p>
        </Link>

        <Link
          to="/pdf/multi"
          className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Multi-PDF</h3>
          <p className="text-sm text-slate-600">
            Mehrere Firmenangebote mit Rotation, Staffelung und verschiedenem Branding
          </p>
        </Link>

        <Link
          to="/pdf/preview"
          className="block rounded-lg border bg-white p-6 shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Vorschau</h3>
          <p className="text-sm text-slate-600">
            Schnell/Komplett/Seitenweise mit Zoom und Layer-Overlay Debug
          </p>
        </Link>
      </div>
      
      <div className="text-center pt-6">
        <Link 
          to="/home" 
          className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
