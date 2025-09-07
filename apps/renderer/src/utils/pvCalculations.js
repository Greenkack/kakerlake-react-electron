import { calculateComprehensivePvAnalysis } from "./pvCalculationsAdvanced";
// Hilfsfunktionen
const safe = (v, def = 0) => {
    const n = Number(v);
    return isFinite(n) ? n : def;
};
export function deriveCalcInputFromState(state) {
    const c = state.consumption;
    const o = state.options;
    const b = state.building;
    const gesamt = safe(c?.annualKWhHousehold) +
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
function autarkiegrad(eigen, gesamt) {
    if (!gesamt)
        return 0;
    return (eigen / gesamt) * 100;
}
function stromkostenersparnis(eigen, strompreis) {
    return eigen * strompreis;
}
function kumulierte_ersparnis(jaehrliche, laufzeit) {
    return jaehrliche * laufzeit;
}
function break_even_jahr(invest, jaehrliche_ersparnis) {
    if (!jaehrliche_ersparnis)
        return undefined;
    return Math.ceil(invest / jaehrliche_ersparnis);
}
function effektiver_pv_strompreis(gesamt_kosten, gesamtertrag_kwh) {
    if (!gesamtertrag_kwh)
        return 0;
    return (gesamt_kosten / gesamtertrag_kwh) * 100; // ct/kWh
}
function performance_ratio(ertrag_kwh, globalstrahlung_kwh_kwp, kWp) {
    if (!globalstrahlung_kwh_kwp || !kWp)
        return 0;
    return ertrag_kwh / (globalstrahlung_kwh_kwp * kWp);
}
function speichergrad(gespeichert, eigen) {
    if (!eigen)
        return 0;
    return (gespeichert / eigen) * 100;
}
function optimale_speichergröße(tagesverbrauch, verluste = 0.1) {
    return tagesverbrauch * (1 - verluste);
}
function pv_deckung_wp(pv_ueberschuss, wp) {
    if (!wp || pv_ueberschuss === undefined)
        return 0;
    return (pv_ueberschuss / wp) * 100;
}
function notstrom_kapazitaet(speicher_kwh, nutzungsgrad) {
    return safe(speicher_kwh) * safe(nutzungsgrad, 0.9);
}
function batterie_lebensdauer(max_zyklen, zyklen_pro_jahr) {
    if (!max_zyklen || !zyklen_pro_jahr)
        return 0;
    return max_zyklen / zyklen_pro_jahr;
}
function restwert(invest, abschreibung, jahre) {
    return invest * Math.pow(1 - abschreibung, jahre);
}
function afa_linear(invest, jahre) {
    if (!jahre)
        return 0;
    return invest / jahre;
}
function wert_nach_inflation(wert, inflationsrate, jahre) {
    return wert / Math.pow(1 + inflationsrate, jahre);
}
export function computePvResults(input) {
    const laufzeit = input.laufzeit_jahre || 20;
    const eigen = input.eigenverbrauch_kwh;
    const jahresertrag = input.jahresertrag_kwh;
    const jahresErsparnis = stromkostenersparnis(eigen, input.strompreis_eur_kwh) +
        Math.max(jahresertrag - eigen, 0) * (input.einspeiseverguetung_eur_kwh || 0);
    const gesamtNachFoerder = input.invest_brutto - safe(input.foerderung);
    const speicherKapNutzen = input.speicher_kwh
        ? Math.min(eigen * 0.25, input.speicher_kwh * 365 * 0.2)
        : 0;
    const baseResults = {
        autarkiegrad_prozent: autarkiegrad(eigen, input.gesamtverbrauch_kwh),
        jahres_ersparnis_eur: jahresErsparnis,
        kumulierte_ersparnis_20a_eur: kumulierte_ersparnis(jahresErsparnis, laufzeit),
        break_even_jahr: break_even_jahr(gesamtNachFoerder, jahresErsparnis),
        pv_strompreis_ct_kwh: effektiver_pv_strompreis(gesamtNachFoerder, jahresertrag),
        performance_ratio: performance_ratio(jahresertrag, input.globalstrahlung_kwh_kwp, input.pv_kwp),
        speichergrad_prozent: speichergrad(speicherKapNutzen, eigen),
        optimale_speicher_kwh: optimale_speichergröße(input.gesamtverbrauch_kwh / 365),
        pv_deckung_wp_prozent: pv_deckung_wp(input.pv_ueberschuss_kwh, input.wp_verbrauch_kwh),
        notstrom_kapazitaet_kwh_tag: notstrom_kapazitaet(input.speicher_kwh, input.speicher_nutzungsgrad),
        batterie_lebensdauer_jahre: batterie_lebensdauer(input.max_zyklen_speicher, input.zyklen_pro_jahr),
        restwert_nach_laufzeit_eur: restwert(gesamtNachFoerder, 1 / safe(input.abschreibung_linear_jahre, 20), laufzeit),
        afa_linear_jahr_eur: afa_linear(gesamtNachFoerder, safe(input.abschreibung_linear_jahre, 20)),
        foerder_abzugte_kosten_eur: gesamtNachFoerder,
        inflationsbereinigter_wert_20a_eur: wert_nach_inflation(jahresErsparnis * laufzeit, safe(input.inflationsrate, 0.02), laufzeit),
    };
    // Erweiterte Berechnungen hinzufügen
    try {
        const advancedInput = {
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
    }
    catch (error) {
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
