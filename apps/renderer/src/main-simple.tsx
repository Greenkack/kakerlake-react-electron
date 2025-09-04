import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Minimal App Component
function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Kakerlake PV/WP Tool</h1>
      </header>
      <main className="p-4">
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// Home Component
function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Willkommen</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold text-lg mb-2">🏗️ Neues Projekt</h3>
          <p className="text-gray-600">Starten Sie ein neues PV-Projekt</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold text-lg mb-2">☀️ Solar-Rechner</h3>
          <p className="text-gray-600">Schnelle PV-Kalkulation</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold text-lg mb-2">🔥 Wärmepumpe</h3>
          <p className="text-gray-600">Wärmepumpen-Simulation</p>
        </div>
      </div>
      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800">✅ Die App läuft erfolgreich!</p>
        <p className="text-green-600 text-sm mt-1">
          Aktueller Pfad: {window.location.pathname}
        </p>
      </div>
    </div>
  );
}

// NotFound Component
function NotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-red-600">Seite nicht gefunden</h2>
      <p className="text-gray-600 mt-2">Die angeforderte Seite existiert nicht.</p>
      <a href="/home" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Zur Startseite
      </a>
    </div>
  );
}

// Error Boundary
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean; error: Error | null }> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-lg">
            <h1 className="text-xl font-bold text-red-600 mb-4">Anwendungsfehler</h1>
            <p className="text-gray-700 mb-4">Ein Fehler ist aufgetreten:</p>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// CSS Import
import "./index.css";

// Render App
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
