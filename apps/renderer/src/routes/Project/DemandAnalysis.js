import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import WizardNav from '../../components/WizardNav';
// Mock useProjectData hook until context is available
const useProjectData = () => ({
    projectData: {
        consumption: {
            annualKWhHousehold: undefined,
            monthlyCostHouseholdEuro: undefined,
            annualKWhHeating: undefined,
            monthlyCostHeatingEuro: undefined,
            currentHeatingType: undefined,
            heatingAge: undefined,
            fuelType: undefined,
            householdSize: undefined,
            homeOfficeHours: undefined,
            electricAppliances: undefined,
            zukunft_epump: undefined,
            zukunft_wallbox: undefined,
            zukunft_pool: undefined,
            zukunft_sauna: undefined,
            zukunft_klima: undefined,
            zukunft_erweiterung: undefined,
            epump_verbrauch_schaetzung: undefined,
            wallbox_verbrauch_schaetzung: undefined,
            pool_verbrauch_schaetzung: undefined,
            eigenverbrauch_maximieren: undefined,
            netzeinspeisung_begrenzen: undefined,
            backup_wichtig: undefined,
            umwelt_prioritaet: undefined
        }
    },
    updateProjectData: (data) => console.log('Update project data:', data)
});
const toNumberOrNull = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
};
export default function DemandAnalysis() {
    const { projectData, updateProjectData } = useProjectData();
    // Energieverbrauch - Haushalt
    const [annualKWhHousehold, setAnnualKWhHousehold] = useState(projectData.consumption?.annualKWhHousehold?.toString() || '');
    const [monthlyCostHouseholdEuro, setMonthlyCostHouseholdEuro] = useState(projectData.consumption?.monthlyCostHouseholdEuro?.toString() || '');
    // Energieverbrauch - Heizung
    const [annualKWhHeating, setAnnualKWhHeating] = useState(projectData.consumption?.annualKWhHeating?.toString() || '');
    const [monthlyCostHeatingEuro, setMonthlyCostHeatingEuro] = useState(projectData.consumption?.monthlyCostHeatingEuro?.toString() || '');
    // Heizungsdetails
    const [currentHeatingType, setCurrentHeatingType] = useState(projectData.consumption?.currentHeatingType || '');
    const [heatingAge, setHeatingAge] = useState(projectData.consumption?.heatingAge?.toString() || '');
    const [fuelType, setFuelType] = useState(projectData.consumption?.fuelType || '');
    // Haushaltsdaten
    const [householdSize, setHouseholdSize] = useState(projectData.consumption?.householdSize?.toString() || '');
    const [homeOfficeHours, setHomeOfficeHours] = useState(projectData.consumption?.homeOfficeHours?.toString() || '');
    const [electricAppliances, setElectricAppliances] = useState(projectData.consumption?.electricAppliances || '');
    // Zukunftsplanung
    const [zukunft_epump, setZukunftEpump] = useState(projectData.consumption?.zukunft_epump || false);
    const [zukunft_wallbox, setZukunftWallbox] = useState(projectData.consumption?.zukunft_wallbox || false);
    const [zukunft_pool, setZukunftPool] = useState(projectData.consumption?.zukunft_pool || false);
    const [zukunft_sauna, setZukunftSauna] = useState(projectData.consumption?.zukunft_sauna || false);
    const [zukunft_klima, setZukunftKlima] = useState(projectData.consumption?.zukunft_klima || false);
    const [zukunft_erweiterung, setZukunftErweiterung] = useState(projectData.consumption?.zukunft_erweiterung || false);
    // Verbrauchsschätzungen für Zukunftsplanung
    const [epump_verbrauch_schaetzung, setEpumpVerbrauch] = useState(projectData.consumption?.epump_verbrauch_schaetzung?.toString() || '');
    const [wallbox_verbrauch_schaetzung, setWallboxVerbrauch] = useState(projectData.consumption?.wallbox_verbrauch_schaetzung?.toString() || '');
    const [pool_verbrauch_schaetzung, setPoolVerbrauch] = useState(projectData.consumption?.pool_verbrauch_schaetzung?.toString() || '');
    // Prioritäten
    const [eigenverbrauch_maximieren, setEigenverbrauch] = useState(projectData.consumption?.eigenverbrauch_maximieren || false);
    const [netzeinspeisung_begrenzen, setNetzeinspeisung] = useState(projectData.consumption?.netzeinspeisung_begrenzen || false);
    const [backup_wichtig, setBackupWichtig] = useState(projectData.consumption?.backup_wichtig || false);
    const [umwelt_prioritaet, setUmweltPrioritaet] = useState(projectData.consumption?.umwelt_prioritaet || false);
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
        const monthlyCostHH = toNumberOrNull(monthlyCostHouseholdEuro) || 0;
        const annCostHH = monthlyCostHH * 12;
        const monthlyCostHeat = toNumberOrNull(monthlyCostHeatingEuro) || 0;
        const annCostHeat = monthlyCostHeat * 12;
        const annualCostTotal = annCostHH + annCostHeat;
        const annualKWhTotal = (toNumberOrNull(annualKWhHousehold) || 0) + (toNumberOrNull(annualKWhHeating) || 0);
        const euroPerKWh = annualKWhTotal > 0 ? annualCostTotal / annualKWhTotal : 0;
        setAnnCostHH(annCostHH);
        setAnnCostHeat(annCostHeat);
        setAnnualCostTotal(annualCostTotal);
        setAnnualKWhTotal(annualKWhTotal);
        setEuroPerKWh(euroPerKWh);
    }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro]);
    // Beim Verlassen/Weiter speichern wir in den Context
    useEffect(() => {
        updateProjectData({
            consumption: {
                annualKWhHousehold: toNumberOrNull(annualKWhHousehold),
                monthlyCostHouseholdEuro: toNumberOrNull(monthlyCostHouseholdEuro),
                annualKWhHeating: toNumberOrNull(annualKWhHeating),
                monthlyCostHeatingEuro: toNumberOrNull(monthlyCostHeatingEuro),
                currentHeatingType,
                heatingAge: toNumberOrNull(heatingAge),
                fuelType,
                householdSize: toNumberOrNull(householdSize),
                homeOfficeHours: toNumberOrNull(homeOfficeHours),
                electricAppliances,
                zukunft_epump,
                zukunft_wallbox,
                zukunft_pool,
                zukunft_sauna,
                zukunft_klima,
                zukunft_erweiterung,
                epump_verbrauch_schaetzung: toNumberOrNull(epump_verbrauch_schaetzung),
                wallbox_verbrauch_schaetzung: toNumberOrNull(wallbox_verbrauch_schaetzung),
                pool_verbrauch_schaetzung: toNumberOrNull(pool_verbrauch_schaetzung),
                eigenverbrauch_maximieren,
                netzeinspeisung_begrenzen,
                backup_wichtig,
                umwelt_prioritaet
            }
        });
    }, [
        annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
        currentHeatingType, heatingAge, fuelType, householdSize, homeOfficeHours, electricAppliances,
        zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima, zukunft_erweiterung,
        epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
        eigenverbrauch_maximieren, netzeinspeisung_begrenzen, backup_wichtig, umwelt_prioritaet,
        updateProjectData
    ]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "Bedarfsanalyse" }), _jsx("p", { className: "text-slate-600", children: "Energieverbrauch und zuk\u00FCnftige Planungen erfassen" })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Haushaltsstrom" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "J\u00E4hrlicher Verbrauch (kWh/Jahr) *", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: annualKWhHousehold, onChange: (e) => setAnnualKWhHousehold(e.target.value), placeholder: "z.B. 4500", required: true }) }), _jsx(Field, { label: "Monatliche Kosten (\u20AC/Monat) *", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: monthlyCostHouseholdEuro, onChange: (e) => setMonthlyCostHouseholdEuro(e.target.value), placeholder: "z.B. 120", required: true }) })] }), annualKWhHousehold && monthlyCostHouseholdEuro && (_jsxs("div", { className: "mt-4 p-3 bg-blue-50 rounded border text-sm", children: [_jsx("strong", { children: "Haushaltsstrom:" }), " ", annCostHH.toFixed(0), " \u20AC/Jahr"] }))] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Heizung & Warmwasser" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "J\u00E4hrlicher Verbrauch (kWh/Jahr)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: annualKWhHeating, onChange: (e) => setAnnualKWhHeating(e.target.value), placeholder: "z.B. 15000" }) }), _jsx(Field, { label: "Monatliche Kosten (\u20AC/Monat)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: monthlyCostHeatingEuro, onChange: (e) => setMonthlyCostHeatingEuro(e.target.value), placeholder: "z.B. 180" }) }), _jsx(Field, { label: "Heizungstyp", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: currentHeatingType, onChange: (e) => setCurrentHeatingType(e.target.value), children: [_jsx("option", { value: "", children: "Bitte w\u00E4hlen" }), _jsx("option", { value: "gas", children: "Gasheizung" }), _jsx("option", { value: "oil", children: "\u00D6lheizung" }), _jsx("option", { value: "electric", children: "Elektroheizung" }), _jsx("option", { value: "district", children: "Fernw\u00E4rme" }), _jsx("option", { value: "wood", children: "Holz/Pellets" }), _jsx("option", { value: "heatpump", children: "W\u00E4rmepumpe" }), _jsx("option", { value: "other", children: "Sonstiges" })] }) }), _jsx(Field, { label: "Alter der Heizung (Jahre)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: heatingAge, onChange: (e) => setHeatingAge(e.target.value), placeholder: "z.B. 15" }) }), _jsx(Field, { label: "Brennstoff/Energietr\u00E4ger", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: fuelType, onChange: (e) => setFuelType(e.target.value), children: [_jsx("option", { value: "", children: "Bitte w\u00E4hlen" }), _jsx("option", { value: "gas", children: "Erdgas" }), _jsx("option", { value: "propane", children: "Fl\u00FCssiggas" }), _jsx("option", { value: "oil", children: "Heiz\u00F6l" }), _jsx("option", { value: "electric", children: "Strom" }), _jsx("option", { value: "wood", children: "Holz" }), _jsx("option", { value: "pellets", children: "Pellets" }), _jsx("option", { value: "district", children: "Fernw\u00E4rme" }), _jsx("option", { value: "other", children: "Sonstiges" })] }) })] }), annualKWhHeating && monthlyCostHeatingEuro && (_jsxs("div", { className: "mt-4 p-3 bg-orange-50 rounded border text-sm", children: [_jsx("strong", { children: "Heizung:" }), " ", annCostHeat.toFixed(0), " \u20AC/Jahr"] }))] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Haushaltsdaten" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(Field, { label: "Anzahl Personen", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: householdSize, onChange: (e) => setHouseholdSize(e.target.value), placeholder: "z.B. 4" }) }), _jsx(Field, { label: "Homeoffice-Stunden/Woche", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: homeOfficeHours, onChange: (e) => setHomeOfficeHours(e.target.value), placeholder: "z.B. 20" }) }), _jsx(Field, { label: "Gro\u00DFe Stromverbraucher", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: electricAppliances, onChange: (e) => setElectricAppliances(e.target.value), children: [_jsx("option", { value: "", children: "Keine besonderen" }), _jsx("option", { value: "pool", children: "Pool-Pumpe" }), _jsx("option", { value: "sauna", children: "Sauna" }), _jsx("option", { value: "workshop", children: "Werkstatt" }), _jsx("option", { value: "server", children: "Server/IT" }), _jsx("option", { value: "multiple", children: "Mehrere" })] }) })] })] }), annualCostTotal > 0 && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Energiekosten-\u00DCbersicht" }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-slate-800", children: annualKWhTotal.toFixed(0) }), _jsx("div", { className: "text-sm text-slate-600", children: "kWh/Jahr gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [annualCostTotal.toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/Jahr gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [(annualCostTotal / 12).toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/Monat gesamt" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-50 rounded", children: [_jsxs("div", { className: "text-2xl font-bold text-slate-800", children: [euroPerKWh.toFixed(2), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "\u20AC/kWh Durchschnitt" })] })] })] })), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Zuk\u00FCnftige Verbraucher" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-slate-700", children: "Geplante Anschaffungen" }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_epump, onChange: (e) => setZukunftEpump(e.target.checked) }), _jsx("span", { children: "W\u00E4rmepumpe geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_wallbox, onChange: (e) => setZukunftWallbox(e.target.checked) }), _jsx("span", { children: "Wallbox/E-Auto geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_pool, onChange: (e) => setZukunftPool(e.target.checked) }), _jsx("span", { children: "Pool geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_sauna, onChange: (e) => setZukunftSauna(e.target.checked) }), _jsx("span", { children: "Sauna geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_klima, onChange: (e) => setZukunftKlima(e.target.checked) }), _jsx("span", { children: "Klimaanlage geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: zukunft_erweiterung, onChange: (e) => setZukunftErweiterung(e.target.checked) }), _jsx("span", { children: "Geb\u00E4udeerweiterung geplant" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-slate-700", children: "Gesch\u00E4tzte Zusatzverbr\u00E4uche (kWh/Jahr)" }), _jsx(Field, { label: "W\u00E4rmepumpe (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: epump_verbrauch_schaetzung, onChange: (e) => setEpumpVerbrauch(e.target.value), placeholder: "z.B. 3000", disabled: !zukunft_epump }) }), _jsx(Field, { label: "Wallbox/E-Auto (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: wallbox_verbrauch_schaetzung, onChange: (e) => setWallboxVerbrauch(e.target.value), placeholder: "z.B. 2500", disabled: !zukunft_wallbox }) }), _jsx(Field, { label: "Pool/Sauna (gesch\u00E4tzt)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: pool_verbrauch_schaetzung, onChange: (e) => setPoolVerbrauch(e.target.value), placeholder: "z.B. 1500", disabled: !zukunft_pool && !zukunft_sauna }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Spezielle Anforderungen & Priorit\u00E4ten" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: eigenverbrauch_maximieren, onChange: (e) => setEigenverbrauch(e.target.checked) }), _jsx("span", { children: "Eigenverbrauch maximieren" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: netzeinspeisung_begrenzen, onChange: (e) => setNetzeinspeisung(e.target.checked) }), _jsx("span", { children: "Netzeinspeisung begrenzen" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: backup_wichtig, onChange: (e) => setBackupWichtig(e.target.checked) }), _jsx("span", { children: "Notstromf\u00E4higkeit wichtig" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: umwelt_prioritaet, onChange: (e) => setUmweltPrioritaet(e.target.checked) }), _jsx("span", { children: "Umweltschutz hat Priorit\u00E4t" })] })] })] })] }), _jsx(WizardNav, { backTo: "/project/building", nextTo: "/project/needs", nextDisabled: !requiredOk })] }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-slate-700 mb-1", children: label }), children] }));
}
