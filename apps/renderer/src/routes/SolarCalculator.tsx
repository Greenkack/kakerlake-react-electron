import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function SolarCalculator(): JSX.Element {
  const [modules, setModules] = useState<number>(20);
  const [moduleWp, setModuleWp] = useState<number>(440);

  const kWp = useMemo(() => {
    const m = Number.isFinite(modules) ? modules : 0;
    const w = Number.isFinite(moduleWp) ? moduleWp : 0;
    return (m * w) / 1000;
  }, [modules, moduleWp]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Solarkalkulator</h1>
        <p className="text-gray-600">
          Demo-Eingaben für kWp-Berechnung. Später kommen WR, Speicher usw. dazu.
        </p>
      </header>

      <section className="rounded-xl bg-white p-4 shadow space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm">Anzahl Module</span>
            <input
              type="number"
              className="w-full rounded border px-3 py-2"
              value={modules}
              onChange={(e) => setModules(parseInt(e.target.value || "0", 10))}
              min={0}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm">Leistung pro Modul (Wp)</span>
            <input
              type="number"
              className="w-full rounded border px-3 py-2"
              value={moduleWp}
              onChange={(e) => setModuleWp(parseInt(e.target.value || "0", 10))}
              min={0}
            />
          </label>
        </div>

        <div className="rounded border bg-gray-50 p-3">
          <div className="text-sm text-gray-600">Anlagengröße (kWp)</div>
          <div className="text-2xl font-semibold tabular-nums">
            {kWp.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
          </div>
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
