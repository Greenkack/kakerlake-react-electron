// apps/renderer/src/App.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "./components/FooterNav";

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-10 bg-white/90 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <h1 className="text-lg font-semibold">
            PV / Wärmepumpe – Kalkulationssuite
          </h1>
          <p className="text-sm text-slate-600">
            Navigation ist überall sichtbar (unten).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <FooterNav />
    </div>
  );
}
