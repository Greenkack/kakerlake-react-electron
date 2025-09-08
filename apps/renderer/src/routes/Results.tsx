import React from 'react';
import { Link } from 'react-router-dom';

export default function Results(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">✅ Berechnungen abgeschlossen!</h1>
        <p className="text-green-100">
          Ihre Solar-Konfiguration wurde erfolgreich gespeichert und analysiert.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ergebnisse sind verfügbar</h2>
        <p className="text-gray-600 mb-8">
          Ihre Solar-Anlage wurde erfolgreich konfiguriert und alle wichtigen Kennzahlen wurden berechnet.
          Schauen Sie sich die detaillierten Ergebnisse im Dashboard an.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            📊 Dashboard anzeigen
            <span className="text-sm text-cyan-100 ml-2">(Alle Ergebnisse)</span>
          </Link>
          
          <Link
            to="/solar"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
          >
            ⚙️ Konfiguration ändern
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Link
            to="/home"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            🏠 Zum Hauptmenü
          </Link>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-blue-800 mb-2">Technische Daten</h3>
          <p className="text-blue-700 text-sm">
            Anlagenleistung, Jahresertrag, Module und Wechselrichter
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-green-800 mb-2">Wirtschaftlichkeit</h3>
          <p className="text-green-700 text-sm">
            Investition, Amortisation, Rendite und Einsparungen
          </p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="font-semibold text-purple-800 mb-2">Umwelt-Bilanz</h3>
          <p className="text-purple-700 text-sm">
            CO₂-Einsparung und Beitrag zum Klimaschutz
          </p>
        </div>
      </div>
    </div>
  );
}