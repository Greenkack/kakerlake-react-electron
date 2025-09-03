/* ==== DEF BLOCK: PriceMatrix Parser & Lookup =========================== */

import type { PriceMatrixTable, PriceMatrixRow } from "../types/pricematrix";

/** Deutsche Preis-Strings robust nach Zahl (Euro) parsen: 23.040,50 € -> 23040.50 */
export function parseEuroLoose(input: unknown): number | null {
  if (input == null) return null;
  const s = String(input)
    .replace(/\s/g, "")
    .replace(/€|EUR?/gi, "");
  if (!s) return null;

  // Fälle:
  // - "23.040,50" (DE) -> "23040.50"
  // - "23040.50" (EN) bleibt gleich
  // - "23040" -> 23040
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  let norm = s;

  if (hasComma && hasDot) {
    // Annahme: Punkt = Tausender, Komma = Dezimal
    norm = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma && !hasDot) {
    // Nur Komma -> Dezimaltrenner
    norm = s.replace(",", ".");
  } else {
    // Nur Punkt oder nichts -> schon ok
  }

  const num = Number(norm);
  return Number.isFinite(num) ? num : null;
}

/** Sauberes Trimmen + doppelte/Leere raus */
function normalizeHeaders(headers: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of headers) {
    const key = (h ?? "").toString().trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

/**
 * XLSX Sheet -> PriceMatrixTable
 * Erwartung:
 *   - Zeile 1:   [leer/Label, Speicher1, Speicher2, ..., "Kein Speicher"]
 *   - Zeile 2+:  [Module,    Preis(Speicher1), Preis(Speicher2), ..., Preis(Kein Speicher)]
 */
export async function parseXlsxToMatrix(file: File): Promise<PriceMatrixTable> {
  // Dynamischer Import (damit Renderer erst lädt, wenn benötigt)
  const XLSX = await import("xlsx");

  const arrayBuf = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuf, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("Leere Arbeitsmappe.");
  const ws = wb.Sheets[sheetName];

  // In 2D-Array umwandeln
  const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
  if (!data.length) throw new Error("Leeres Blatt.");

  // Kopfzeile
  const headerRow = (data[0] ?? []) as unknown[];
  // Header ab Spalte 2 (Index 1) sind die Speichermodelle
  const rawHeaders = headerRow.slice(1).map((v) => String(v ?? "").trim());
  const storages = normalizeHeaders(rawHeaders);
  if (storages.length === 0) {
    throw new Error("Keine Speichermodelle in der Kopfzeile gefunden (Zeile 1).");
  }

  // Datenzeilen
  const rows: PriceMatrixRow[] = [];
  for (let r = 1; r < data.length; r++) {
    const row = (data[r] ?? []) as unknown[];
    if (!row.length) continue;

    // Spalte A: Modulanzahl
    const modVal = row[0];
    const modules = Number(modVal);
    if (!Number.isFinite(modules)) continue; // Skip ungültig/leere Zeilen

    // Danach folgen Preise in der Reihenfolge der Header
    const pricesEuro: Record<string, number> = {};
    for (let i = 0; i < storages.length; i++) {
      const cell = row[i + 1];
      const parsed = parseEuroLoose(cell);
      if (parsed != null) pricesEuro[storages[i]] = parsed;
    }

    rows.push({ modules, pricesEuro });
  }

  if (rows.length === 0) {
    throw new Error("Keine gültigen Datenzeilen gefunden (ab Zeile 2).");
  }

  return {
    storages,
    rows,
    sourceName: file.name,
  };
}

/**
 * Exaktes Lookup (Excel: INDEX/MATCH mit Vergleichstyp 0):
 *   - modules: exakte Modulanzahl muss existieren
 *   - storageModel: exakt einer der Header aus Zeile 1
 */
export function lookupPriceEuro(
  table: PriceMatrixTable,
  modules: number,
  storageModel: string
): number {
  if (!table?.rows?.length) {
    throw new Error("PriceMatrix: Tabelle leer.");
  }
  if (!table.storages.includes(storageModel)) {
    throw new Error(`Speichermodell nicht gefunden: "${storageModel}"`);
  }

  const row = table.rows.find((r) => r.modules === modules);
  if (!row) {
    throw new Error(`Keine Zeile für Modulanzahl ${modules} gefunden.`);
  }

  const price = row.pricesEuro[storageModel];
  if (price == null) {
    throw new Error(
      `Kein Preis für Speichermodell "${storageModel}" in Zeile (Module=${modules}).`
    );
  }
  return price;
}

/** Komfort: "Kein Speicher" als Fallback-Key ermitteln (falls vorhanden) */
export function getNoStorageKey(table: PriceMatrixTable): string | null {
  const candidates = ["Kein Speicher", "kein Speicher", "Ohne Speicher", "ohne Speicher"];
  return table.storages.find((s) => candidates.includes(s)) ?? null;
}
