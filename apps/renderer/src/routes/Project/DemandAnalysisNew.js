import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import WizardNav from '../../components/WizardNav';
import { useProject } from '../../state/project';
import { formatGermanCurrency, formatGermanKWh, formatGermanElectricityPrice, parseGermanNumber } from '../../utils/germanFormat';
const toNumberOrUndefined = (value) => {
    const num = parseGermanNumber(value);
    return isNaN(num || 0) ? undefined : num;
};
// Intelligente Verbrauchsanalyse-Funktionen
const estimateAnnualConsumption = (householdSize, livingSpace) => {
    // Durchschnittliche Verbrauchswerte für Deutschland
    const baseConsumption = householdSize * 1500; // 1500 kWh pro Person
    const spaceConsumption = livingSpace * 20; // 20 kWh pro m² Wohnfläche
    return Math.round((baseConsumption + spaceConsumption) / 2);
};
const calculateElectricityPrice = (annualKWh, monthlyCost) => {
    if (annualKWh > 0 && monthlyCost > 0) {
        const annualCost = monthlyCost * 12;
        return Math.round((annualCost / annualKWh) * 10000) / 10000; // 4 Dezimalstellen
    }
    return 0.32; // Durchschnittspreis Deutschland
};
const getConsumptionCategory = (consumption, householdSize) => {
    const averagePerPerson = consumption / (householdSize || 1);
    if (averagePerPerson < 1200)
        return 'Sehr niedrig (sparsam)';
    if (averagePerPerson < 1800)
        return 'Niedrig (effizient)';
    if (averagePerPerson < 2500)
        return 'Durchschnittlich';
    if (averagePerPerson < 3500)
        return 'Hoch';
    return 'Sehr hoch (Einsparpotential!)';
};
const calculatePotentialSavings = (currentConsumption, electricityPrice) => {
    // Geschätztes Einsparpotential durch PV-Anlage (60-80% Eigenverbrauch möglich)
    const savingsPotential = currentConsumption * 0.7; // 70% durchschnittliches Einsparpotential
    return Math.round(savingsPotential * electricityPrice);
};
export default function DemandAnalysis() {
    const { state, actions } = useProject();
    // Energieverbrauch - Haushalt
    const [annualKWhHousehold, setAnnualKWhHousehold] = useState(state.consumption?.annualKWhHousehold?.toString() || '');
    const [monthlyCostHouseholdEuro, setMonthlyCostHouseholdEuro] = useState(state.consumption?.monthlyCostHouseholdEuro?.toString() || '');
    // Energieverbrauch - Heizung
    const [annualKWhHeating, setAnnualKWhHeating] = useState(state.consumption?.annualKWhHeating?.toString() || '');
    const [monthlyCostHeatingEuro, setMonthlyCostHeatingEuro] = useState(state.consumption?.monthlyCostHeatingEuro?.toString() || '');
    // Energieverbrauch - Sonstiges
    const [annualKWhOther, setAnnualKWhOther] = useState(state.consumption?.annualKWhOther?.toString() || '');
    const [monthlyCostOtherEuro, setMonthlyCostOtherEuro] = useState(state.consumption?.monthlyCostOtherEuro?.toString() || '');
    // Heizungsdetails
    const [currentHeatingType, setCurrentHeatingType] = useState(state.consumption?.currentHeatingType || '');
    const [heatingAge, setHeatingAge] = useState(state.consumption?.heatingAge?.toString() || '');
    const [fuelType, setFuelType] = useState(state.consumption?.fuelType || '');
    // Haushaltsdaten
    const [householdSize, setHouseholdSize] = useState(state.consumption?.householdSize?.toString() || '');
    const [homeOfficeHours, setHomeOfficeHours] = useState(state.consumption?.homeOfficeHours?.toString() || '');
    const [electricAppliances, setElectricAppliances] = useState(state.consumption?.electricAppliances || '');
    // Zukunftsplanung
    const [zukunft_epump, setZukunftEpump] = useState(state.consumption?.zukunft_epump || false);
    const [zukunft_wallbox, setZukunftWallbox] = useState(state.consumption?.zukunft_wallbox || false);
    const [zukunft_pool, setZukunftPool] = useState(state.consumption?.zukunft_pool || false);
    const [zukunft_sauna, setZukunftSauna] = useState(state.consumption?.zukunft_sauna || false);
    const [zukunft_klima, setZukunftKlima] = useState(state.consumption?.zukunft_klima || false);
    const [zukunft_erweiterung, setZukunftErweiterung] = useState(state.consumption?.zukunft_erweiterung || false);
    // Verbrauchsschätzungen für Zukunftsplanung
    const [epump_verbrauch_schaetzung, setEpumpVerbrauch] = useState(state.consumption?.epump_verbrauch_schaetzung?.toString() || '');
    const [wallbox_verbrauch_schaetzung, setWallboxVerbrauch] = useState(state.consumption?.wallbox_verbrauch_schaetzung?.toString() || '');
    const [pool_verbrauch_schaetzung, setPoolVerbrauch] = useState(state.consumption?.pool_verbrauch_schaetzung?.toString() || '');
    // Prioritäten
    const [eigenverbrauch_maximieren, setEigenverbrauch] = useState(state.consumption?.eigenverbrauch_maximieren || false);
    const [netzeinspeisung_begrenzen, setNetzeinspeisung] = useState(state.consumption?.netzeinspeisung_begrenzen || false);
    const [backup_wichtig, setBackupWichtig] = useState(state.consumption?.backup_wichtig || false);
    const [umwelt_prioritaet, setUmweltPrioritaet] = useState(state.consumption?.umwelt_prioritaet || false);
    // Intelligente Verbrauchsanalyse
    const analysisData = useMemo(() => {
        const householdConsumption = toNumberOrUndefined(annualKWhHousehold) || 0;
        const householdCostMonthly = toNumberOrUndefined(monthlyCostHouseholdEuro) || 0;
        const heatingConsumption = toNumberOrUndefined(annualKWhHeating) || 0;
        const heatingCostMonthly = toNumberOrUndefined(monthlyCostHeatingEuro) || 0;
        const otherConsumption = toNumberOrUndefined(annualKWhOther) || 0;
        const otherCostMonthly = toNumberOrUndefined(monthlyCostOtherEuro) || 0;
        const householdSizeNum = toNumberOrUndefined(householdSize) || 1;
        const livingSpace = state.building?.livingSpace || 150;
        // Berechnungen
        const totalConsumption = householdConsumption + heatingConsumption + otherConsumption;
        const totalMonthlyCost = householdCostMonthly + heatingCostMonthly + otherCostMonthly;
        const totalAnnualCost = totalMonthlyCost * 12;
        const electricityPrice = totalConsumption > 0 ? totalAnnualCost / totalConsumption : 0.32;
        // Einzeltarife berechnen
        const householdElectricityPrice = householdConsumption > 0 ? (householdCostMonthly * 12) / householdConsumption : 0;
        const heatingElectricityPrice = heatingConsumption > 0 ? (heatingCostMonthly * 12) / heatingConsumption : 0;
        const otherElectricityPrice = otherConsumption > 0 ? (otherCostMonthly * 12) / otherConsumption : 0;
        // Schätzungen und Empfehlungen
        const estimatedConsumption = estimateAnnualConsumption(householdSizeNum, livingSpace);
        const consumptionCategory = householdConsumption > 0 ? getConsumptionCategory(householdConsumption, householdSizeNum) : '';
        const potentialSavings = householdConsumption > 0 ? calculatePotentialSavings(householdConsumption, electricityPrice) : 0;
        // Zukunftspläne Verbrauchsschätzungen
        const futureConsumption = totalConsumption +
            (zukunft_epump ? (toNumberOrUndefined(epump_verbrauch_schaetzung) || 3000) : 0) +
            (zukunft_wallbox ? (toNumberOrUndefined(wallbox_verbrauch_schaetzung) || 2500) : 0) +
            (zukunft_pool ? (toNumberOrUndefined(pool_verbrauch_schaetzung) || 1500) : 0) +
            (zukunft_sauna ? 1200 : 0) +
            (zukunft_klima ? 800 : 0);
        return {
            totalConsumption,
            totalAnnualCost,
            electricityPrice,
            householdElectricityPrice,
            heatingElectricityPrice,
            otherElectricityPrice,
            estimatedConsumption,
            consumptionCategory,
            potentialSavings,
            futureConsumption,
            hasSignificantIncrease: futureConsumption > totalConsumption * 1.5
        };
    }, [
        annualKWhHousehold, monthlyCostHouseholdEuro,
        annualKWhHeating, monthlyCostHeatingEuro,
        annualKWhOther, monthlyCostOtherEuro,
        annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
        householdSize, zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima,
        epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
        state.building?.livingSpace
    ]);
    // Berechnete Werte anzeigen
    const [annCostHH, setAnnCostHH] = useState(0);
    const [annCostHeat, setAnnCostHeat] = useState(0);
    const [annualCostTotal, setAnnualCostTotal] = useState(0);
    const [annualKWhTotal, setAnnualKWhTotal] = useState(0);
    const [euroPerKWh, setEuroPerKWh] = useState(0);
    // Validierung für "Weiter"-Button
    const requiredOk = annualKWhHousehold !== '' && monthlyCostHouseholdEuro !== '';
    // Live-Berechnung der Gesamtkosten und kWh
    useEffect(() => {
        const monthlyCostHH = toNumberOrUndefined(monthlyCostHouseholdEuro) || 0;
        const annCostHH = monthlyCostHH * 12;
        const monthlyCostHeat = toNumberOrUndefined(monthlyCostHeatingEuro) || 0;
        const annCostHeat = monthlyCostHeat * 12;
        const annualCostTotal = annCostHH + annCostHeat;
        const annualKWhTotal = (toNumberOrUndefined(annualKWhHousehold) || 0) + (toNumberOrUndefined(annualKWhHeating) || 0);
        const euroPerKWh = annualKWhTotal > 0 ? annualCostTotal / annualKWhTotal : 0;
        setAnnCostHH(annCostHH);
        setAnnCostHeat(annCostHeat);
        setAnnualCostTotal(annualCostTotal);
        setAnnualKWhTotal(annualKWhTotal);
        setEuroPerKWh(euroPerKWh);
    }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro]);
    // Beim Verlassen/Weiter speichern wir in den Context
    useEffect(() => {
        actions.updateConsumption({
            annualKWhHousehold: toNumberOrUndefined(annualKWhHousehold),
            monthlyCostHouseholdEuro: toNumberOrUndefined(monthlyCostHouseholdEuro),
            annualKWhHeating: toNumberOrUndefined(annualKWhHeating),
            monthlyCostHeatingEuro: toNumberOrUndefined(monthlyCostHeatingEuro),
            currentHeatingType,
            heatingAge: toNumberOrUndefined(heatingAge),
            fuelType,
            householdSize: toNumberOrUndefined(householdSize),
            homeOfficeHours: toNumberOrUndefined(homeOfficeHours),
            electricAppliances,
            zukunft_epump,
            zukunft_wallbox,
            zukunft_pool,
            zukunft_sauna,
            zukunft_klima,
            zukunft_erweiterung,
            epump_verbrauch_schaetzung: toNumberOrUndefined(epump_verbrauch_schaetzung),
            wallbox_verbrauch_schaetzung: toNumberOrUndefined(wallbox_verbrauch_schaetzung),
            pool_verbrauch_schaetzung: toNumberOrUndefined(pool_verbrauch_schaetzung),
            eigenverbrauch_maximieren,
            netzeinspeisung_begrenzen,
            backup_wichtig,
            umwelt_prioritaet
        });
    }, [
        annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
        currentHeatingType, heatingAge, fuelType, householdSize, homeOfficeHours, electricAppliances,
        zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima, zukunft_erweiterung,
        epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
        eigenverbrauch_maximieren, netzeinspeisung_begrenzen, backup_wichtig, umwelt_prioritaet,
        actions
    ]);
    // Speichern der Daten beim Verlassen der Seite
    const handleSave = () => {
        actions.updateConsumption({
            annualKWhHousehold: toNumberOrUndefined(annualKWhHousehold),
            monthlyCostHouseholdEuro: toNumberOrUndefined(monthlyCostHouseholdEuro),
            annualKWhHeating: toNumberOrUndefined(annualKWhHeating),
            monthlyCostHeatingEuro: toNumberOrUndefined(monthlyCostHeatingEuro),
            annualKWhOther: toNumberOrUndefined(annualKWhOther),
            monthlyCostOtherEuro: toNumberOrUndefined(monthlyCostOtherEuro),
            currentHeatingType,
            heatingAge: toNumberOrUndefined(heatingAge),
            fuelType,
            householdSize: toNumberOrUndefined(householdSize),
            homeOfficeHours: toNumberOrUndefined(homeOfficeHours),
            electricAppliances,
            zukunft_epump,
            zukunft_wallbox,
            zukunft_pool,
            zukunft_sauna,
            zukunft_klima,
            zukunft_erweiterung,
            epump_verbrauch_schaetzung: toNumberOrUndefined(epump_verbrauch_schaetzung),
            wallbox_verbrauch_schaetzung: toNumberOrUndefined(wallbox_verbrauch_schaetzung),
            pool_verbrauch_schaetzung: toNumberOrUndefined(pool_verbrauch_schaetzung),
            eigenverbrauch_maximieren,
            netzeinspeisung_begrenzen,
            backup_wichtig,
            umwelt_prioritaet,
        });
    };
    // Auto-Save bei wichtigen Änderungen
    useEffect(() => {
        if (annualKWhHousehold || monthlyCostHouseholdEuro) {
            handleSave();
        }
    }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro, annualKWhOther, monthlyCostOtherEuro]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "\u26A1 Bedarfsanalyse" }), _jsx("p", { className: "text-slate-600", children: "Analysieren Sie Ihren Stromverbrauch und planen Sie f\u00FCr die Zukunft" })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-blue-800 mb-4", children: "\uD83D\uDCCA Ihr aktueller Stromverbrauch" }), _jsx("p", { className: "text-blue-700 mb-6", children: "Geben Sie Ihren Jahresverbrauch und monatliche Kosten ein. Wir berechnen automatisch Ihren Strompreis und Einsparpotential." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "J\u00E4hrlicher Stromverbrauch (kWh) *" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: annualKWhHousehold, onChange: (e) => setAnnualKWhHousehold(e.target.value), placeholder: "z.B. 4500", required: true }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "kWh/Jahr" })] }), !annualKWhHousehold && analysisData.estimatedConsumption > 0 && (_jsxs("div", { className: "mt-3 p-3 bg-blue-50 rounded border border-blue-200", children: [_jsxs("div", { className: "text-sm text-blue-800", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Intelligente Sch\u00E4tzung:" }), " ~", formatGermanKWh(analysisData.estimatedConsumption), " f\u00FCr Ihren Haushalt"] }), _jsx("button", { className: "text-xs text-blue-600 hover:underline mt-1", onClick: () => setAnnualKWhHousehold(analysisData.estimatedConsumption.toString()), children: "Sch\u00E4tzung \u00FCbernehmen" })] })), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: [_jsx("div", { children: "Richtewerte:" }), _jsx("div", { children: "\u2022 1-2 Personen: 1.500-3.000 kWh" }), _jsx("div", { children: "\u2022 3-4 Personen: 3.000-5.000 kWh" }), _jsx("div", { children: "\u2022 5+ Personen: 5.000+ kWh" })] })] }), _jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Monatliche Stromkosten (\u20AC) *" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: monthlyCostHouseholdEuro, onChange: (e) => setMonthlyCostHouseholdEuro(e.target.value), placeholder: "z.B. 120", required: true }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "\u20AC/Monat" })] }), analysisData.electricityPrice > 0 && (_jsxs("div", { className: "mt-3 p-3 bg-green-50 rounded border border-green-200", children: [_jsxs("div", { className: "text-sm text-green-800", children: ["\u26A1 ", _jsx("strong", { children: "Ihr Strompreis:" }), " ", formatGermanElectricityPrice(analysisData.electricityPrice)] }), _jsxs("div", { className: "text-xs text-green-600 mt-1", children: ["J\u00E4hrliche Kosten: ", formatGermanCurrency(analysisData.totalAnnualCost, 0)] })] })), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: [_jsx("div", { children: "Deutschland Durchschnitt: 0,35 \u20AC/kWh" }), _jsx("div", { children: "Typische Bandbreite: 0,28-0,45 \u20AC/kWh" })] })] })] }), (annualKWhHousehold || monthlyCostHouseholdEuro || annualKWhHeating || monthlyCostHeatingEuro || annualKWhOther || monthlyCostOtherEuro) && (_jsxs("div", { className: "mt-6 p-4 bg-white rounded-lg border border-slate-200", children: [_jsx("h4", { className: "font-medium text-slate-700 mb-3", children: "\uD83E\uDDEE Live-Analyse" }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4 text-center", children: [_jsxs("div", { className: "p-3 bg-blue-50 rounded border border-blue-200", children: [_jsx("div", { className: "text-lg font-bold text-blue-600", children: formatGermanKWh(analysisData.totalConsumption) }), _jsx("div", { className: "text-xs text-slate-600", children: "pro Jahr Gesamt" })] }), _jsxs("div", { className: "p-3 bg-green-50 rounded border border-green-200", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: formatGermanCurrency(analysisData.totalAnnualCost, 0) }), _jsx("div", { className: "text-xs text-slate-600", children: "pro Jahr" })] }), _jsxs("div", { className: "p-3 bg-orange-50 rounded border border-orange-200", children: [_jsxs("div", { className: "text-lg font-bold text-orange-600", children: ["\u2300 ", formatGermanElectricityPrice(analysisData.electricityPrice)] }), _jsx("div", { className: "text-xs text-slate-600", children: "Durchschnitt" })] }), _jsxs("div", { className: "p-3 bg-purple-50 rounded border border-purple-200", children: [_jsx("div", { className: "text-lg font-bold text-purple-600", children: formatGermanCurrency(analysisData.potentialSavings, 0) }), _jsx("div", { className: "text-xs text-slate-600", children: "Sparpotential" })] })] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("div", { className: "inline-block px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700", children: analysisData.consumptionCategory }) })] }))] }), _jsxs("div", { className: "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-orange-800 mb-4", children: "\uD83D\uDD25 Heizungs-Stromverbrauch (optional)" }), _jsx("p", { className: "text-orange-700 mb-6", children: "Falls Sie eine elektrische Heizung oder W\u00E4rmepumpe haben, tragen Sie hier die zus\u00E4tzlichen Kosten ein." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "J\u00E4hrlicher Stromverbrauch Heizung (kWh)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: annualKWhHeating, onChange: (e) => setAnnualKWhHeating(e.target.value), placeholder: "z.B. 3000" }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "kWh/Jahr" })] }), analysisData.heatingElectricityPrice > 0 && (_jsx("div", { className: "mt-3 p-3 bg-orange-50 rounded border border-orange-200", children: _jsxs("div", { className: "text-sm text-orange-800", children: ["\uD83D\uDD25 ", _jsx("strong", { children: "Heizstrom-Tarif:" }), " ", formatGermanElectricityPrice(analysisData.heatingElectricityPrice)] }) }))] }), _jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Monatliche Heizstrom-Kosten (\u20AC)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: monthlyCostHeatingEuro, onChange: (e) => setMonthlyCostHeatingEuro(e.target.value), placeholder: "z.B. 80" }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "\u20AC/Monat" })] }), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: [_jsx("div", { children: "Heizstrom-Tarife: meist 0,25-0,35 \u20AC/kWh" }), _jsx("div", { children: "W\u00E4rmepumpe: typisch 2.000-4.000 kWh/Jahr" })] })] })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-purple-800 mb-4", children: "\u26A1 Sonstiger Stromverbrauch (optional)" }), _jsx("p", { className: "text-purple-700 mb-6", children: "E-Auto, Pool, Werkstatt oder andere gro\u00DFe Stromverbraucher separat erfassen." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "J\u00E4hrlicher sonstiger Stromverbrauch (kWh)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: annualKWhOther, onChange: (e) => setAnnualKWhOther(e.target.value), placeholder: "z.B. 2500" }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "kWh/Jahr" })] }), analysisData.otherElectricityPrice > 0 && (_jsx("div", { className: "mt-3 p-3 bg-purple-50 rounded border border-purple-200", children: _jsxs("div", { className: "text-sm text-purple-800", children: ["\u26A1 ", _jsx("strong", { children: "Sonstiger Tarif:" }), " ", formatGermanElectricityPrice(analysisData.otherElectricityPrice)] }) })), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: [_jsx("div", { children: "Beispiele:" }), _jsx("div", { children: "\u2022 E-Auto: 2.000-3.500 kWh/Jahr" }), _jsx("div", { children: "\u2022 Pool: 1.000-2.500 kWh/Jahr" }), _jsx("div", { children: "\u2022 Werkstatt: 500-1.500 kWh/Jahr" })] })] }), _jsxs("div", { className: "bg-white rounded-lg p-5 shadow-sm", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Monatliche Kosten sonstiger Verbrauch (\u20AC)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium", value: monthlyCostOtherEuro, onChange: (e) => setMonthlyCostOtherEuro(e.target.value), placeholder: "z.B. 60" }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 font-medium", children: "\u20AC/Monat" })] }), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: [_jsx("div", { children: "Spezial-Tarife m\u00F6glich:" }), _jsx("div", { children: "\u2022 Nachtstrom: 0,20-0,28 \u20AC/kWh" }), _jsx("div", { children: "\u2022 Gewerbestrom: 0,25-0,40 \u20AC/kWh" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Heizung & Warmwasser" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "J\u00E4hrlicher Verbrauch (kWh/Jahr)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: annualKWhHeating, onChange: (e) => setAnnualKWhHeating(e.target.value), placeholder: "z.B. 15000" }) }), _jsx(Field, { label: "Monatliche Kosten (\u20AC/Monat)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: monthlyCostHeatingEuro, onChange: (e) => setMonthlyCostHeatingEuro(e.target.value), placeholder: "z.B. 180" }) }), _jsx(Field, { label: "Heizungstyp", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: currentHeatingType, onChange: (e) => setCurrentHeatingType(e.target.value), children: [_jsx("option", { value: "", children: "Bitte w\u00E4hlen" }), _jsx("option", { value: "gas", children: "Gasheizung" }), _jsx("option", { value: "oil", children: "\u00D6lheizung" }), _jsx("option", { value: "electric", children: "Elektroheizung" }), _jsx("option", { value: "district", children: "Fernw\u00E4rme" }), _jsx("option", { value: "wood", children: "Holz/Pellets" }), _jsx("option", { value: "heatpump", children: "W\u00E4rmepumpe" }), _jsx("option", { value: "other", children: "Sonstiges" })] }) }), _jsx(Field, { label: "Alter der Heizung (Jahre)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: heatingAge, onChange: (e) => setHeatingAge(e.target.value), placeholder: "z.B. 15" }) }), _jsx(Field, { label: "Brennstoff/Energietr\u00E4ger", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: fuelType, onChange: (e) => setFuelType(e.target.value), children: [_jsx("option", { value: "", children: "Bitte w\u00E4hlen" }), _jsx("option", { value: "gas", children: "Erdgas" }), _jsx("option", { value: "propane", children: "Fl\u00FCssiggas" }), _jsx("option", { value: "oil", children: "Heiz\u00F6l" }), _jsx("option", { value: "electric", children: "Strom" }), _jsx("option", { value: "wood", children: "Holz" }), _jsx("option", { value: "pellets", children: "Pellets" }), _jsx("option", { value: "district", children: "Fernw\u00E4rme" }), _jsx("option", { value: "other", children: "Sonstiges" })] }) })] }), annualKWhHeating && monthlyCostHeatingEuro && (_jsxs("div", { className: "mt-4 p-3 bg-orange-50 rounded border text-sm", children: [_jsx("strong", { children: "Heizung:" }), " ", annCostHeat.toFixed(0), " \u20AC/Jahr"] }))] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Haushaltsdaten" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(Field, { label: "Anzahl Personen", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: householdSize, onChange: (e) => setHouseholdSize(e.target.value), placeholder: "z.B. 4" }) }), _jsx(Field, { label: "Homeoffice-Stunden/Woche", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: homeOfficeHours, onChange: (e) => setHomeOfficeHours(e.target.value), placeholder: "z.B. 20" }) }), _jsx(Field, { label: "Gro\u00DFe Stromverbraucher", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: electricAppliances, onChange: (e) => setElectricAppliances(e.target.value), children: [_jsx("option", { value: "", children: "Keine besonderen" }), _jsx("option", { value: "pool", children: "Pool-Pumpe" }), _jsx("option", { value: "sauna", children: "Sauna" }), _jsx("option", { value: "workshop", children: "Werkstatt" }), _jsx("option", { value: "server", children: "Server/IT" }), _jsx("option", { value: "multiple", children: "Mehrere" })] }) })] })] }), annualCostTotal > 0 && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Energiekosten-\u00DCbersicht" }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-slate-800", children: annualKWhTotal.toFixed(0) }), _jsx("div", { className: "text-sm text-slate-600", children: "kWh/Jahr gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [annualCostTotal.toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/Jahr gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [(annualCostTotal / 12).toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/Monat gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [euroPerKWh.toFixed(2), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/kWh Durchschnitt" })] })] })] })), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Zuk\u00FCnftige Verbraucher" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-slate-700", children: "Geplante Anschaffungen" }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_epump, onChange: (e) => setZukunftEpump(e.target.checked) }), _jsx("span", { children: "W\u00E4rmepumpe geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_wallbox, onChange: (e) => setZukunftWallbox(e.target.checked) }), _jsx("span", { children: "Wallbox/E-Auto geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_pool, onChange: (e) => setZukunftPool(e.target.checked) }), _jsx("span", { children: "Pool geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_sauna, onChange: (e) => setZukunftSauna(e.target.checked) }), _jsx("span", { children: "Sauna geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_klima, onChange: (e) => setZukunftKlima(e.target.checked) }), _jsx("span", { children: "Klimaanlage geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_erweiterung, onChange: (e) => setZukunftErweiterung(e.target.checked) }), _jsx("span", { children: "Geb\u00E4udeerweiterung geplant" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-slate-700", children: "Gesch\u00E4tzte Zusatzverbr\u00E4uche (kWh/Jahr)" }), _jsx(Field, { label: "W\u00E4rmepumpe (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: epump_verbrauch_schaetzung, onChange: (e) => setEpumpVerbrauch(e.target.value), placeholder: "z.B. 3000", disabled: !zukunft_epump }) }), _jsx(Field, { label: "Wallbox/E-Auto (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: wallbox_verbrauch_schaetzung, onChange: (e) => setWallboxVerbrauch(e.target.value), placeholder: "z.B. 2500", disabled: !zukunft_wallbox }) }), _jsx(Field, { label: "Pool/Sauna (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: pool_verbrauch_schaetzung, onChange: (e) => setPoolVerbrauch(e.target.value), placeholder: "z.B. 1500", disabled: !zukunft_pool && !zukunft_sauna }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Spezielle Anforderungen & Priorit\u00E4ten" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: eigenverbrauch_maximieren, onChange: (e) => setEigenverbrauch(e.target.checked) }), _jsx("span", { children: "Eigenverbrauch maximieren" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: netzeinspeisung_begrenzen, onChange: (e) => setNetzeinspeisung(e.target.checked) }), _jsx("span", { children: "Netzeinspeisung begrenzen" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: backup_wichtig, onChange: (e) => setBackupWichtig(e.target.checked) }), _jsx("span", { children: "Notstromf\u00E4higkeit wichtig" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: umwelt_prioritaet, onChange: (e) => setUmweltPrioritaet(e.target.checked) }), _jsx("span", { children: "Umweltschutz hat Priorit\u00E4t" })] })] })] })] }), _jsx(WizardNav, { backTo: "/project/customer", nextTo: "/project/building", nextDisabled: !requiredOk })] }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-slate-700 mb-1", children: label }), children] }));
}
