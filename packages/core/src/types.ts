// DEF: Zentrale Typen für PV/WP-Rechenkerne (UI-unabhängig)
export type AnlageMode = 'pv' | 'wp' | 'pv_wp';

export interface CustomerBasics {
  anlagentyp: 'Neuanlage' | 'Bestandsanlage';
  einspeisetyp: 'Teileinspeisung' | 'Volleinspeisung';
  kundentyp: 'Privat' | 'Gewerblich';
  bundesland?: string;
  einkommensteuerSatz?: number; // in %
  strompreisEuroProKWh?: number; // optional: falls direkt gesetzt
  jahresverbrauchHaushaltKWh: number;
  jahresverbrauchHeizungKWh?: number;
}

export interface PVSetup {
  moduleCount: number;          // Anzahl Module
  moduleWp: number;            // Wp pro Modul, z.B. 440
  inverterModelId?: string;
  inverterCount?: number;
  batteryModelId?: string;     // Speichermodell (Name/ID exakt wie in Produkt-DB/Matrix)
  batteryCapacityKWh?: number; // wird i.d.R. aus DB abgeleitet
}

export interface Tariffs {
  feedInEuroPerKWh: number;        // z.B. 0.0786
  strompreisEuroProKWh?: number;   // wird ggf. aus Kosten/Verbr. berechnet
  strompreisJaehrlichEuro?: number;
}

export interface PVResultEnergy {
  kWp: number;
  annualProductionKWh: number;
  directUseKWh: number;
  toBatteryKWh: number;
  fromBatteryKWh: number;
  batterySurplusKWh: number;
  feedInFromProductionKWh: number;
  gridExportTotalKWh: number;
}

export interface PVResultMoney {
  savingsDirectEuro: number;
  savingsFromBatteryEuro: number;
  revenueFeedInEuro: number;
  revenueBatteryExportEuro: number;
  totalAnnualBenefitEuro: number;
}

export interface PVResultTotals {
  energy: PVResultEnergy;
  money: PVResultMoney;
}

export interface PriceMatrixLookupInput {
  moduleCount: number;
  batteryModelKey: string;  // exakt wie Spaltenkopf in Matrix (oder 'kein Speicher')
}

export interface PriceMatrixLookupOutput {
  turnkeyPriceEuro: number; // schlüsselfertiger Betrag aus Matrix
}
