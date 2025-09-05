import { ProjectState } from "../state/project";
import { 
  calculateComprehensivePvAnalysis,
  PvCalculationInput as AdvancedPvInput,
  useAdvancedPvCalculations 
} from "./pvCalculationsAdvanced";

// Hilfsfunktionen
const safe = (v: unknown, def = 0) => {
  const n = Number(v);
  return isFinite(n) ? n : def;
};

export interface PvCalcInput {
  gesamtverbrauch_kwh: number;      // Gesamtstromverbrauch Haushalt+Heizung+Sonstiges
  eigenverbrauch_kwh: number;       // Anteil PV-Strom der direkt genutzt wird
  jahresertrag_kwh: number;         // PV Jahresproduktion
  pv_kwp: number;                   // Installierte Leistung
  globalstrahlung_kwh_kwp?: number; // Standort-spezifisch (kWh/kWp)
  invest_brutto: number;            // Gesamte Investitionskosten
  strompreis_eur_kwh: number;       // Aktueller Bezugspreis
  einspeiseverguetung_eur_kwh?: number;
  speicher_kwh?: number;
  speicher_nutzungsgrad?: number;   // 0–1
  wp_verbrauch_kwh?: number;
  foerderung?: number;
  zinssatz?: number;                // z.B. 0.03
  inflationsrate?: number;          // z.B. 0.02
  laufzeit_jahre?: number;          // Standard 20
  abschreibung_linear_jahre?: number; // z.B. 20
  eigenverbrauchsquote?: number;    // optional falls separat berechnet
  pv_ueberschuss_kwh?: number;      // getrennt für WP-Deckung
  max_zyklen_speicher?: number;
  zyklen_pro_jahr?: number;
}

export interface PvCalcResult {
  autarkiegrad_prozent?: number;
  jahres_ersparnis_eur?: number;
  kumulierte_ersparnis_20a_eur?: number;
  break_even_jahr?: number;
  pv_strompreis_ct_kwh?: number;
  performance_ratio?: number;
  speichergrad_prozent?: number;
  optimale_speicher_kwh?: number;
  pv_deckung_wp_prozent?: number;
  notstrom_kapazitaet_kwh_tag?: number;
  batterie_lebensdauer_jahre?: number;
  restwert_nach_laufzeit_eur?: number;
  afa_linear_jahr_eur?: number;
  foerder_abzugte_kosten_eur?: number;
  inflationsbereinigter_wert_20a_eur?: number;
  
  // Erweiterte Ergebnisse aus pvCalculationsAdvanced
  extended_analysis?: any;
  monte_carlo_success_probability?: number;
  co2_total_savings_lifetime_tons?: number;
  optimization_suggestions_count?: number;
}

export function deriveCalcInputFromState(state: ProjectState): PvCalcInput {
  const c = state.consumption;
  const o = state.options;
  const b = state.building;

  const gesamt =
    safe(c?.annualKWhHousehold) +
    safe(c?.annualKWhHeating) +
    safe(c?.annualKWhOther);

  const jahresertrag = safe(o?.annualYieldKWh);
  const pv_kwp = safe(o?.systemSizeKWp) || (jahresertrag ? jahresertrag / 950 : 0);

  return {
    gesamtverbrauch_kwh: gesamt,
    eigenverbrauch_kwh: safe(o?.selfConsumptionKWh) || Math.min(jahresertrag * 0.4, gesamt),
    jahresertrag_kwh: jahresertrag,
    pv_kwp,
    globalstrahlung_kwh_kwp: safe(b?.irradiationKWhPerKwp, 1050),
    invest_brutto: safe(o?.investmentTotal),
    strompreis_eur_kwh: safe(c?.weightedTarifEURPerKWh, 0.35),
    einspeiseverguetung_eur_kwh: safe(o?.feedInTarifEurPerKWh, 0.082),
    speicher_kwh: safe(o?.batteryCapacityKWh),
    speicher_nutzungsgrad: safe(o?.batteryUsableFactor, 0.9),
    wp_verbrauch_kwh: safe(c?.heatingAnnualKWh),
    foerderung: safe(o?.subsidyTotal),
    zinssatz: safe(o?.financeInterestRate, 0.03),
    inflationsrate: safe(o?.inflationRate, 0.02),
    laufzeit_jahre: safe(o?.analysisYears, 20),
    abschreibung_linear_jahre: safe(o?.depreciationYears, 20),
    eigenverbrauchsquote: safe(o?.selfConsumptionRatePct) / 100,
    pv_ueberschuss_kwh: Math.max(jahresertrag - safe(o?.calculatedEigenverbrauchKWh), 0),
    max_zyklen_speicher: safe(o?.batteryCycleLife, 6000),
    zyklen_pro_jahr: safe(o?.batteryCyclesPerYear, 250),
  };
}

// Einzelberechnungen (portiert)
function autarkiegrad(eigen: number, gesamt: number) {
  if (!gesamt) return 0;
  return (eigen / gesamt) * 100;
}
function stromkostenersparnis(eigen: number, strompreis: number) {
  return eigen * strompreis;
}
function kumulierte_ersparnis(jaehrliche: number, laufzeit: number) {
  return jaehrliche * laufzeit;
}
function break_even_jahr(invest: number, jaehrliche_ersparnis: number): number | undefined {
  if (!jaehrliche_ersparnis) return undefined;
  return Math.ceil(invest / jaehrliche_ersparnis);
}
function effektiver_pv_strompreis(gesamt_kosten: number, gesamtertrag_kwh: number) {
  if (!gesamtertrag_kwh) return 0;
  return (gesamt_kosten / gesamtertrag_kwh) * 100; // ct/kWh
}
function performance_ratio(ertrag_kwh: number, globalstrahlung_kwh_kwp: number | undefined, kWp: number) {
  if (!globalstrahlung_kwh_kwp || !kWp) return 0;
  return ertrag_kwh / (globalstrahlung_kwh_kwp * kWp);
}
function speichergrad(gespeichert: number, eigen: number) {
  if (!eigen) return 0;
  return (gespeichert / eigen) * 100;
}
function optimale_speichergröße(tagesverbrauch: number, verluste = 0.1) {
  return tagesverbrauch * (1 - verluste);
}
function pv_deckung_wp(pv_ueberschuss: number | undefined, wp: number | undefined) {
  if (!wp || pv_ueberschuss === undefined) return 0;
  return (pv_ueberschuss / wp) * 100;
}
function notstrom_kapazitaet(speicher_kwh: unknown, nutzungsgrad: unknown) {
  return safe(speicher_kwh) * safe(nutzungsgrad, 0.9);
}
function batterie_lebensdauer(max_zyklen: number | undefined, zyklen_pro_jahr: number | undefined) {
  if (!max_zyklen || !zyklen_pro_jahr) return 0;
  return max_zyklen / zyklen_pro_jahr;
}
function restwert(invest: number, abschreibung: number, jahre: number) {
  return invest * Math.pow(1 - abschreibung, jahre);
}
function afa_linear(invest: number, jahre: number) {
  if (!jahre) return 0;
  return invest / jahre;
}
function wert_nach_inflation(wert: number, inflationsrate: number, jahre: number) {
  return wert / Math.pow(1 + inflationsrate, jahre);
}

export function computePvResults(input: PvCalcInput): PvCalcResult {
  const laufzeit = input.laufzeit_jahre || 20;
  const eigen = input.eigenverbrauch_kwh;
  const jahresertrag = input.jahresertrag_kwh;

  const jahresErsparnis =
    stromkostenersparnis(eigen, input.strompreis_eur_kwh) +
    Math.max(jahresertrag - eigen, 0) * (input.einspeiseverguetung_eur_kwh || 0);

  const gesamtNachFoerder = input.invest_brutto - safe(input.foerderung);
  const speicherKapNutzen = input.speicher_kwh
    ? Math.min(eigen * 0.25, input.speicher_kwh * 365 * 0.2)
    : 0;

  const baseResults: PvCalcResult = {
    autarkiegrad_prozent: autarkiegrad(eigen, input.gesamtverbrauch_kwh),
    jahres_ersparnis_eur: jahresErsparnis,
    kumulierte_ersparnis_20a_eur: kumulierte_ersparnis(jahresErsparnis, laufzeit),
    break_even_jahr: break_even_jahr(gesamtNachFoerder, jahresErsparnis),
    pv_strompreis_ct_kwh: effektiver_pv_strompreis(gesamtNachFoerder, jahresertrag),
    performance_ratio: performance_ratio(
      jahresertrag,
      input.globalstrahlung_kwh_kwp,
      input.pv_kwp
    ),
    speichergrad_prozent: speichergrad(speicherKapNutzen, eigen),
    optimale_speicher_kwh: optimale_speichergröße(input.gesamtverbrauch_kwh / 365),
    pv_deckung_wp_prozent: pv_deckung_wp(input.pv_ueberschuss_kwh, input.wp_verbrauch_kwh),
    notstrom_kapazitaet_kwh_tag: notstrom_kapazitaet(
      input.speicher_kwh,
      input.speicher_nutzungsgrad
    ),
    batterie_lebensdauer_jahre: batterie_lebensdauer(
      input.max_zyklen_speicher,
      input.zyklen_pro_jahr
    ),
    restwert_nach_laufzeit_eur: restwert(
      gesamtNachFoerder,
      1 / safe(input.abschreibung_linear_jahre, 20),
      laufzeit
    ),
    afa_linear_jahr_eur: afa_linear(gesamtNachFoerder, safe(input.abschreibung_linear_jahre, 20)),
    foerder_abzugte_kosten_eur: gesamtNachFoerder,
    inflationsbereinigter_wert_20a_eur: wert_nach_inflation(
      jahresErsparnis * laufzeit,
      safe(input.inflationsrate, 0.02),
      laufzeit
    ),
  };

  // Erweiterte Berechnungen hinzufügen
  try {
    const advancedInput: AdvancedPvInput = {
      pv_power_kwp: input.pv_kwp,
      annual_production_kwh: input.jahresertrag_kwh,
      annual_consumption_kwh: input.gesamtverbrauch_kwh,
      self_consumption_kwh: input.eigenverbrauch_kwh,
      investment_costs_eur: gesamtNachFoerder,
      electricity_price_eur_kwh: input.strompreis_eur_kwh,
      feed_in_tariff_eur_kwh: input.einspeiseverguetung_eur_kwh || 0.08,
      storage_capacity_kwh: input.speicher_kwh,
      simulation_years: laufzeit,
      discount_rate: input.zinssatz,
      electricity_price_increase_rate: input.inflationsrate
    };

    const extendedAnalysis = calculateComprehensivePvAnalysis(advancedInput);
    
    // Erweiterte Ergebnisse zu den Basis-Ergebnissen hinzufügen
    baseResults.extended_analysis = extendedAnalysis;
    baseResults.monte_carlo_success_probability = extendedAnalysis.monte_carlo_analysis?.success_probability;
    baseResults.co2_total_savings_lifetime_tons = extendedAnalysis.detailed_co2_analysis?.total_co2_savings;
    baseResults.optimization_suggestions_count = extendedAnalysis.optimization_suggestions?.length || 0;
    
  } catch (error) {
    console.warn('Erweiterte PV-Berechnungen fehlgeschlagen:', error);
  }

  return baseResults;
}

// Hook
import { useMemo } from "react";
import { useProject } from "../state/project";

export function usePvCalculations() {
  const { state } = useProject();
  const input = useMemo(() => deriveCalcInputFromState(state), [state]);
  const results = useMemo(() => computePvResults(input), [input]);
  return { input, results };
}