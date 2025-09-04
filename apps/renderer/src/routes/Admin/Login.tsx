import React from "react";
import { Link } from "react-router-dom";

export default function AdminLogin(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold text-gray-600">⚙️ Administration</h1>
        <p className="text-gray-600">
          Passwortgeschützter Bereich für System-Einstellungen und Konfiguration.
        </p>
      </header>

      <section className="rounded-xl bg-white p-4 shadow space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">🚧 In Entwicklung</h3>
          <p className="text-gray-700">
            Der Admin-Bereich wird bald mit Login-System und erweiterten Einstellungen verfügbar sein.
          </p>
        </div>
      </section>

      <div className="text-center">
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
