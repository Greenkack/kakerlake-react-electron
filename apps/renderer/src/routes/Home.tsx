// apps/renderer/src/routes/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home(): JSX.Element {
  const nav = useNavigate();
  return (
    <div className="grid gap-6">
      <div className="text-sm text-slate-500">
        Mainscreen: Wähle deinen Bereich.
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => nav("/calc/menu")}
          className="rounded-xl border bg-white p-6 text-left shadow hover:shadow-md"
        >
          <div className="text-xl font-semibold mb-2">Berechnungen</div>
          <div className="text-slate-600">
            PV, Wärmepumpe, Ergebnisse, Dashboard, PDF.
          </div>
        </button>

        <button
          type="button"
          onClick={() => nav("/crm/menu")}
          className="rounded-xl border bg-white p-6 text-left shadow hover:shadow-md"
        >
          <div className="text-xl font-semibold mb-2">CRM</div>
          <div className="text-slate-600">Kunden, Workflows (später).</div>
        </button>

        <button
          type="button"
          onClick={() => nav("/planning/menu")}
          className="rounded-xl border bg-white p-6 text-left shadow hover:shadow-md"
        >
          <div className="text-xl font-semibold mb-2">Planungen</div>
          <div className="text-slate-600">Kommt in Zukunft.</div>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => nav("/admin/login")}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Adminbereich (Passwort)
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm("App beenden?")) window.close();
          }}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Beenden
        </button>
      </div>
    </div>
  );
}
