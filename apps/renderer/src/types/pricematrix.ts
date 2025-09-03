/* ==== DEF BLOCK: PriceMatrix Types ===================================== */

export type PriceMatrixRow = {
  /** Anzahl PV-Module (Zeilenüberschrift in Spalte A) */
  modules: number;
  /** Preise pro Speichermodell (Header aus Zeile 1), in Euro */
  pricesEuro: Record<string, number>;
};

export type PriceMatrixTable = {
  /** Speichermodelle aus Kopfzeile, z.B. ["PowerOcean 10,2", "Kein Speicher"] */
  storages: string[];
  /** Tabellenzeilen mit Modulanzahl und Preis je Speicher */
  rows: PriceMatrixRow[];
  /** Originaldateiname (optional) */
  sourceName?: string;
};

export type MatrixFileState = {
  table: PriceMatrixTable | null;
  storageOptions: string[];
  error?: string | null;
};
