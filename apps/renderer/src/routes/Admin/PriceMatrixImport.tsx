/* ==== DEF BLOCK: PriceMatrix Import Route ============================== */

import React, { useMemo, useState } from "react";
import { usePriceMatrix } from "../../hooks/usePriceMatrix";
import { lookupPriceEuro, getNoStorageKey } from "../../lib/pricematrix";
import type { PriceMatrixTable } from "../../types/pricematrix";

function PreviewTable({ table }: { table: PriceMatrixTable }) {
  return (
    <div className="overflow-auto rounded border bg-white">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Module</th>
            {table.storages.map((s) => (
              <th key={s} className="px-3 py-2 text-left font-semibold">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r) => (
            <tr key={r.modules} className="odd:bg-gray-50">
              <td className="px-3 py-1 font-medium">{r.modules}</td>
              {table.storages.map((s) => (
                <td key={s} className="px-3 py-1 tabular-nums">
                  {r.pricesEuro[s]?.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                  }) ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PriceMatrixImport(): JSX.Element {
  const { state, hasTable, loadFile, reset } = usePriceMatrix();
  const [modules, setModules] = useState<number>(20);
  const [storage, setStorage] = useState<string>("");

  const defaultStorage = useMemo(() => {
    if (!state.table) return "";
    return getNoStorageKey(state.table) ?? state.storageOptions[0] ?? "";
  }, [state.table, state.storageOptions]);

  const effectiveStorage = storage || defaultStorage;

  const pricePreview = useMemo(() => {
    if (!state.table) return null;
    try {
      const p = lookupPriceEuro(state.table, modules, effectiveStorage);
      return p.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
    } catch {
      return null;
    }
  }, [state.table, modules, effectiveStorage]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Preis-Matrix (XLSX) importieren</h1>
        <p className="text-gray-600">
          Excel-Aufbau: Erste Zeile = Speichermodelle (Spalte A leer/Label), erste Spalte = Modulanzahl,
          Zellen = Festpreise (schlüsselfertig) in EUR.
        </p>
      </header>

      <section className="rounded-xl bg-white p-4 shadow space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (f) loadFile(f);
            }}
            className="block"
          />
          {hasTable && (
            <button onClick={reset} className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200">
              Zurücksetzen
            </button>
          )}
        </div>
        {state.error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800">
            <strong>Fehler:</strong> {state.error}
          </div>
        )}
        {hasTable && (
          <div className="text-sm text-gray-600">
            Quelle: <span className="font-medium">{state.table?.sourceName}</span>
          </div>
        )}
      </section>

      {hasTable && state.table && (
        <>
          <section className="rounded-xl bg-white p-4 shadow space-y-4">
            <h2 className="text-lg font-semibold">Vorschau</h2>
            <PreviewTable table={state.table} />
          </section>

          <section className="rounded-xl bg-white p-4 shadow space-y-4">
            <h2 className="text-lg font-semibold">Index/MATCH-Probe</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-sm">Modulanzahl</span>
                <input
                  type="number"
                  className="w-full rounded border px-2 py-2"
                  value={modules}
                  onChange={(e) => setModules(parseInt(e.target.value || "0", 10))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm">Speichermodell</span>
                <select
                  className="w-full rounded border px-2 py-2"
                  value={effectiveStorage}
                  onChange={(e) => setStorage(e.target.value)}
                >
                  {(state.table?.storages ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded border bg-gray-50 p-3">
              <div className="text-sm text-gray-600">Ermittelter Pauschalbetrag</div>
              <div className="text-2xl font-semibold">
                {pricePreview ?? "— (kein Treffer für diese Kombination)"}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
