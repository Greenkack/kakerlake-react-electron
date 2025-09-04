import React from "react";
import { Link } from "react-router-dom";

export default function CRMMenu(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold text-indigo-600">👥 CRM – Kundenverwaltung</h1>
        <p className="text-gray-600">
          Kundenverwaltung, Workflows, Kalender und Projekt-Pipeline.
        </p>
      </header>

      <section className="rounded-xl bg-white p-4 shadow space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-800 mb-2">🚧 In Entwicklung</h3>
          <p className="text-indigo-700">
            Das CRM-System wird bald mit umfangreichen Kundenverwaltungs-Features erweitert.
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
