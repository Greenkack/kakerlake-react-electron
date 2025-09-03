// DEF: Preis-Matrix Parser + Lookup (INDEX/MATCH Äquivalent)
import type { PriceMatrixLookupInput, PriceMatrixLookupOutput } from './types';

/**
 * Interne Repräsentation:
 * - rows: Set<number>   -> vorhandene Modulanzahlen (Zeilen)
 * - cols: Set<string>   -> vorhandene Speichermodelle (Spalten)
 * - map:  Map<string, number> mit Key `${moduleCount}|||${batteryKey}`
 */
export class PriceMatrix {
  private rows = new Set<number>();
  private cols = new Set<string>();
  private map = new Map<string, number>();

  static fromTable(table: Array<Array<string | number>>): PriceMatrix {
    // Erwartung: table[0] = Headerzeile (erste Zelle beliebig/„Module“), dann Spaltenköpfe (Battery Keys inkl. „kein Speicher“)
    // Ab Zeile 1: erste Spalte = Modulanzahl (integer), Rest = Preise (Euro)
    const pm = new PriceMatrix();
    if (!table.length) throw new Error('Leere Matrix');
    const header = table[0].map(v => String(v).trim());
    const colKeys = header.slice(1); // ohne linke Ecke
    colKeys.forEach(k => pm.cols.add(k));

    for (let r = 1; r < table.length; r++) {
      const row = table[r];
      if (!row || !row.length) continue;
      const modCount = Number(row[0]);
      if (!Number.isFinite(modCount)) continue;
      pm.rows.add(modCount);
      for (let c = 1; c < header.length; c++) {
        const key = `${modCount}|||${colKeys[c - 1]}`;
        const val = Number(row[c]);
        if (Number.isFinite(val)) {
          pm.map.set(key, val);
        }
      }
    }
    return pm;
  }

  hasModuleCount(n: number) { return this.rows.has(n); }
  hasBatteryKey(k: string) { return this.cols.has(k); }

  lookup(input: PriceMatrixLookupInput): PriceMatrixLookupOutput {
    const k = `${input.moduleCount}|||${input.batteryModelKey}`;
    if (!this.map.has(k)) {
      // Fallback: „kein Speicher“, falls angeforderter Key fehlt
      const fallback = `${input.moduleCount}|||kein Speicher`;
      if (this.map.has(fallback)) {
        return { turnkeyPriceEuro: this.map.get(fallback)! };
      }
      // Wenn auch das fehlt: harte Fehlermeldung, damit man den Admin-Datensatz korrigiert
      const knownCols = Array.from(this.cols).join(', ');
      throw new Error(`Preis nicht gefunden: Module=${input.moduleCount}, Speicher='${input.batteryModelKey}'. Bekannte Speicher: ${knownCols}`);
    }
    return { turnkeyPriceEuro: this.map.get(k)! };
  }
}
