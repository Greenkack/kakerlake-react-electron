// apps/renderer/src/routes/SolarCalculator.tsx
import React, { useMemo, useState } from "react";

/**
 * Minimaler Solar-Rechner-Screen:
 * - Eingaben: Anzahl Module, Leistung pro Modul (Wp)
 * - Ergebnis: kWp (Module * Wp / 1000)
 * 
 * Hinweis:
 * Später kannst du hier weitere Felder (WR, Speicher etc.) ergänzen
 * und/oder die Werte aus deinem globalen Project-Context beziehen.
 */

export default function SolarCalculator(): JSX.Element {
  const [modules, setModules] = useState<number>(20);
  const [moduleWp, setModuleWp] = useState<number>(440);

  const kWp = useMemo(() => {
    const m = Number.isFinite(modules) ? modules : 0;
    const w = Number.isFinite(moduleWp) ? moduleWp : 0;
    return (m * w) / 1000; // z.B. 20 * 440 / 1000 = 8.8 kWp
  }, [modules, moduleWp]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Solarkalkulator</h1>
        <p className="text-gray-600">
          Demo-Eingaben für kWp-Berechnung. Diese Ansicht bleibt bewusst schlank,
          damit wir zuerst die Navigation und Fehlerfreiheit sicherstellen.
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
    </div>
  );
}
