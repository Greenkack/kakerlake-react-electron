// DEF: Public API von @kakerlake/core
// - Exportiert calcKwp und computePVFlow (für Renderer)
// - Enthält nur deterministische, seiteneffektfreie Berechnungen
// - Rundungen/Formatierungen macht die UI (Renderer), nicht das Core-Paket

// ---------- Typen ----------
export type ProjectBasics = {
  /** jährlicher Haushaltsverbrauch in kWh */
  annualConsumptionHouseholdKWh: number;
  /** optional: jährlicher Heizstromverbrauch in kWh (zweiter Zähler) */
  annualConsumptionHeatingKWh?: number;
  /** Stromtarif des Kunden in €/kWh (z. B. 0.27) */
  tariffEuroPerKWh: number;
	anlagentyp: 'neuanlage' | 'bestandsanlage';
  einspeisetyp: 'teileinspeisung' | 'volleinspeisung';
  kundentyp: 'privat' | 'gewerblich';
  bundesland?: string;
};

export type PVSetup = {
  /** Anzahl PV-Module (Stück) */
  modules: number;
  /** Modul-Nennleistung in Wp (z. B. 440) */
  moduleWp: number;
  /** nutzbare Speicherkapazität in kWh (z. B. 10.2) */
  batteryCapacityKWh?: number;
  storageModel?: string | null; // Name/Key des Speichermodells (z.B. "PowerOcean 10,2")
};

export type Tariffs = {
  /** Einspeisevergütung in €/kWh (z. B. 0.0786) */
	pricePerKWhEuro?: number; // Kundenstrompreis (optional hier)
  feedInEuroPerKWh: number;
};

export type PVFlowOptionalOverrides = {
  /**
   * Optionaler Override für Jahresproduktion (kWh).
   * Wenn nicht gesetzt, wird 0 angesetzt (keine Heuristik hier im Core).
   * Die realistische Produktionsberechnung (PVGIS etc.) kann später als
   * eigene Funktion ergänzt und hier reingereicht werden.
   */
  annualProductionOverrideKWh?: number;

  /**
   * Optionaler Override, wie viel davon direkt im Haushalt verbraucht wird (kWh).
   * Wenn nicht gesetzt, wird min(Produktion, Verbrauch) benutzt.
   */
  directUseOverrideKWh?: number;
};

export type PVFlowInput = {
  basics: ProjectBasics;
  setup: PVSetup;
  tariffs: Tariffs;
} & PVFlowOptionalOverrides;

// ---------- Preis-Matrix (INDEX/VERGLEICH) ----------

/**
 * Repräsentation einer „aufbereiteten“ Matrix:
 * header[0] = "" (leere Ecke oben links),
 * header[1..] = Speichermodelle inkl. "kein Speicher"
 * rows: jede Zeile = [moduleCount, priceForModel1, priceForModel2, ...]
 */
export interface PriceMatrixTable {
  header: string[];      // z.B. ["", "PowerOcean 10,2", "PowerOcean 13,6", "kein Speicher"]
  rows: (number | string)[][]; // erste Spalte: Module (Zahl), danach Preise (Zahl)
}

/**
 * Sucht in der Matrix den Preis basierend auf (moduleCount, storageModel).
 * storageModel-Comparison ist case-insensitive und trimmt.
 * Wird nichts gefunden, kommt null zurück.
 */
export function lookupPriceFromMatrix(
  table: PriceMatrixTable,
  moduleCount: number,
  storageModelRaw: string | null | undefined
): number | null {
  if (!table || !Array.isArray(table.header) || table.header.length < 2) return null;
  if (!Array.isArray(table.rows) || table.rows.length === 0) return null;

  const wantModel = (storageModelRaw ?? 'kein Speicher').toString().trim().toLowerCase();

  // Spalte finden
  let col = -1;
  for (let i = 1; i < table.header.length; i++) {
    const colName = String(table.header[i] ?? '').trim().toLowerCase();
    if (colName === wantModel) {
      col = i;
      break;
    }
  }
  if (col === -1) return null;

  // Zeile über exakten Modulwert finden
  const row = table.rows.find(r => Number(r[0]) === Number(moduleCount));
  if (!row) return null;

  const priceCell = row[col];
  const price = typeof priceCell === 'string' ? Number(priceCell.replace(/[^\d.,-]/g, '').replace(',', '.')) : Number(priceCell);
  return Number.isFinite(price) ? price : null;
}

export type PVFlowResult = {
  // Größen
  kWp: number;
  annualProductionKWh: number;

  // Flüsse (Jahreswerte)
  directUseKWh: number;
  toBatteryKWh: number;
  fromBatteryKWh: number;
  batterySurplusKWh: number; // aus Speicher ins Netz
  feedInFromProductionKWh: number; // direkte Überschüsse aus Produktion
  gridExportTotalKWh: number; // Summe Einspeisungen (Produktion + Speicher)

  // Geldwerte
  savingsDirectEuro: number;
  savingsFromBatteryEuro: number;
  revenueFeedInEuro: number;
  revenueBatteryExportEuro: number;
  totalAnnualBenefitEuro: number;
};

// ---------- Helper ----------
/** kWp aus (Module * Wp) */
export function calcKwp(modules: number, moduleWp: number): number {
  const m = Math.max(0, modules | 0);
  const wp = Math.max(0, +moduleWp);
  return (m * wp) / 1000; // Wp → kWp
  if (!Number.isFinite(modules) || !Number.isFinite(moduleWp)) return 0;
  if (modules <= 0 || moduleWp <= 0) return 0;
  return +(modules * (moduleWp / 1000)).toFixed(3);
}

function sumAnnualConsumption(b: ProjectBasics): number {
  return Math.max(0, (b.annualConsumptionHouseholdKWh ?? 0) + (b.annualConsumptionHeatingKWh ?? 0));
}

/**
 * Reine Flusslogik auf Jahresbasis – exakt nach deiner Beschreibung:
 * - Batterie „Ladebudget“ = batteryCapacityKWh * 300
 * - directUse = min(Produktion, Verbrauch) (falls kein Override)
 * - toBattery = min(Produktion - directUse, Ladebudget)
 * - fromBattery = min(toBattery, Verbrauch - directUse)
 * - batterySurplus = toBattery - fromBattery
 * - feedInFromProduction = max(Produktion - directUse - toBattery, 0)
 * - gridExportTotal = feedInFromProduction + batterySurplus
 * - Ersparnisse/Einnahmen per Tarif/Einspeise
 */
export function computePVFlow(input: PVFlowInput): PVFlowResult {
  const { basics, setup, tariffs } = input;

  const kWp = calcKwp(setup.modules, setup.moduleWp);

  const consumption = sumAnnualConsumption(basics);
  const annualProduction = Math.max(0, input.annualProductionOverrideKWh ?? 0);

  const directUse = Math.min(
    annualProduction,
    Math.max(0, input.directUseOverrideKWh ?? consumption)
  );

  const chargeBudget = Math.max(0, (setup.batteryCapacityKWh ?? 0) * 300);
  const remainingAfterDirect = Math.max(0, annualProduction - directUse);

  const toBattery = Math.min(remainingAfterDirect, chargeBudget);
  const fromBattery = Math.min(toBattery, Math.max(0, consumption - directUse));
  const batterySurplus = Math.max(0, toBattery - fromBattery);

  const feedInFromProduction = Math.max(0, annualProduction - directUse - toBattery);
  const gridExportTotal = feedInFromProduction + batterySurplus;

  const tGrid = Math.max(0, basics.tariffEuroPerKWh);
  const tFeed = Math.max(0, tariffs.feedInEuroPerKWh);

  const savingsDirectEuro = directUse * tGrid;
  const savingsFromBatteryEuro = fromBattery * tGrid;
  const revenueFeedInEuro = feedInFromProduction * tFeed;
  const revenueBatteryExportEuro = batterySurplus * tFeed;
  const totalAnnualBenefitEuro =
    savingsDirectEuro + savingsFromBatteryEuro + revenueFeedInEuro + revenueBatteryExportEuro;

  return {
    kWp,
    annualProductionKWh: annualProduction,
    directUseKWh: directUse,
    toBatteryKWh: toBattery,
    fromBatteryKWh: fromBattery,
    batterySurplusKWh: batterySurplus,
    feedInFromProductionKWh: feedInFromProduction,
    gridExportTotalKWh: gridExportTotal,
    savingsDirectEuro,
    savingsFromBatteryEuro,
    revenueFeedInEuro,
    revenueBatteryExportEuro,
    totalAnnualBenefitEuro
  };
}
