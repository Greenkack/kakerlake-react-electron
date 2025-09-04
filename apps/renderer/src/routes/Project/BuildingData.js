import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/renderer/src/routes/Project/BuildingData.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WizardNav from "../../components/WizardNav";
import { useProject } from "../../state/project";
// Intelligente Berechnungshilfen
const calculateOptimalTilt = (latitude) => {
    // Optimale Dachneigung basierend auf Breitengrad Deutschland (47-55°N)
    return Math.round(latitude * 0.7 + 5);
};
const estimateRoofArea = (buildingType, livingSpace) => {
    const factors = {
        'Einfamilienhaus': 0.8,
        'Zweifamilienhaus': 0.9,
        'Reihenhaus': 0.6,
        'Doppelhaushälfte': 0.7,
        'Bungalow': 1.2,
    };
    return Math.round((livingSpace * (factors[buildingType] || 0.8)));
};
const getSolarIrradiationHint = (orientation, tilt) => {
    if (orientation === 'Süd' && tilt >= 25 && tilt <= 40) {
        return '🌟 Optimal: Beste Sonneneinstrahlung erwartet!';
    }
    else if (orientation === 'Süd') {
        return '☀️ Sehr gut: Südausrichtung ist ideal';
    }
    else if (orientation === 'Ost' || orientation === 'West') {
        return '✅ Gut: Noch sehr rentabel';
    }
    else {
        return '⚠️ Bedingt: Eventuell geringere Erträge';
    }
};
export default function BuildingData() {
    const nav = useNavigate();
    const { state, actions } = useProject();
    const [v, setV] = useState({
        // Erweiterte Gebäudedaten
        buildingType: state.building.buildingType || "Einfamilienhaus",
        livingSpace: state.building.livingSpace?.toString() || "",
        floors: state.building.floors?.toString() || "",
        baujahr: state.building.constructionYear?.toString() || "",
        // Dach-Grunddaten
        dachart: state.building.roofType || "Satteldach",
        ausrichtung: state.building.roofOrientation || "Süd",
        neigung: state.building.roofTilt?.toString() || "",
        flaeche: state.building.roofArea?.toString() || "",
        // Erweiterte Dach-Details
        deckung: "Frankfurter Pfannen",
        verschattung: state.building.shadingFactors || "keine",
        dachzustand: "gut",
        statik_geprueft: false,
        // Besonderheiten und Details
        denkmalschutz: false,
        kamin_vorhanden: false,
        kamin_position: "",
        gauben_anzahl: "",
        dachfenster_anzahl: "",
        solar_vorhanden: false,
        solar_typ: "",
        koordinaten: "",
        hoehe: "",
        hoeheUeber7m: false,
        brandschutz_beachten: false,
        dachrinne_zustand: "gut",
        blitzschutz_vorhanden: false,
        // Technische Details
        elektricalConnection: state.building.electricalConnection || "Standardanschluss",
        heatingSystem: state.building.heatingSystem || "Gas",
    });
    // Intelligente Berechnungen
    const calculations = useMemo(() => {
        const livingSpace = parseInt(v.livingSpace) || 0;
        const roofArea = parseInt(v.flaeche) || 0;
        const tilt = parseInt(v.neigung) || 0;
        const estimatedArea = livingSpace > 0 ? estimateRoofArea(v.buildingType, livingSpace) : 0;
        const optimalTilt = 35; // Deutschland-Durchschnitt
        const solarHint = roofArea > 0 ? getSolarIrradiationHint(v.ausrichtung, tilt) : '';
        // Geschätzte PV-Leistung (grob: 6-7 kWp pro 100m² nutzbarer Dachfläche)
        const estimatedPvPower = roofArea > 0 ? Math.round((roofArea * 0.065) * 10) / 10 : 0;
        return {
            estimatedRoofArea: estimatedArea,
            optimalTilt,
            solarHint,
            estimatedPvPower,
            usableRoofArea: Math.round(roofArea * 0.6) // 60% der Dachfläche meist nutzbar
        };
    }, [v.buildingType, v.livingSpace, v.flaeche, v.ausrichtung, v.neigung]);
    // Synchronisiere mit Project State
    useEffect(() => {
        actions.updateBuilding({
            buildingType: v.buildingType,
            livingSpace: parseInt(v.livingSpace) || undefined,
            floors: parseInt(v.floors) || undefined,
            constructionYear: parseInt(v.baujahr) || undefined,
            roofType: v.dachart,
            roofOrientation: v.ausrichtung,
            roofTilt: parseInt(v.neigung) || undefined,
            roofArea: parseInt(v.flaeche) || undefined,
            shadingFactors: v.verschattung,
            electricalConnection: v.elektricalConnection,
            heatingSystem: v.heatingSystem,
        });
    }, [Object.values(v), actions]);
    const requiredOk = v.baujahr.trim().length > 0 && v.flaeche.trim().length > 0 && v.neigung.trim().length > 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Projekt \u2013 Geb\u00E4udedaten" }), _jsx("p", { className: "text-slate-600", children: "Detaillierte Angaben zum Geb\u00E4ude f\u00FCr die optimale Anlagenplanung." }), calculations.estimatedPvPower > 0 && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-blue-800 mb-2", children: "\uD83E\uDDE0 Intelligente Analyse" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Gesch\u00E4tzte PV-Leistung:" }), " ", calculations.estimatedPvPower, " kWp"] }), _jsxs("div", { children: [_jsx("strong", { children: "Nutzbare Dachfl\u00E4che:" }), " ~", calculations.usableRoofArea, " m\u00B2"] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("strong", { children: "Bewertung:" }), " ", calculations.solarHint] })] }), v.neigung && parseInt(v.neigung) !== calculations.optimalTilt && (_jsxs("div", { className: "mt-2 text-blue-700", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Tipp:" }), " Optimale Dachneigung f\u00FCr Deutschland: ", calculations.optimalTilt, "\u00B0"] }))] })), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Grunddaten des Geb\u00E4udes" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Geb\u00E4udetyp" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.buildingType, onChange: (e) => setV({ ...v, buildingType: e.target.value }), children: [_jsx("option", { value: "Einfamilienhaus", children: "Einfamilienhaus" }), _jsx("option", { value: "Zweifamilienhaus", children: "Zweifamilienhaus" }), _jsx("option", { value: "Reihenhaus", children: "Reihenhaus" }), _jsx("option", { value: "Doppelhaush\u00E4lfte", children: "Doppelhaush\u00E4lfte" }), _jsx("option", { value: "Bungalow", children: "Bungalow" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Wohnfl\u00E4che (m\u00B2)" }), _jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-2", value: v.livingSpace, onChange: (e) => setV({ ...v, livingSpace: e.target.value }), placeholder: "z.B. 150" }), calculations.estimatedRoofArea > 0 && (_jsxs("div", { className: "text-xs text-slate-500 mt-1", children: ["Gesch\u00E4tzte Dachfl\u00E4che: ~", calculations.estimatedRoofArea, " m\u00B2"] }))] }), _jsx(Txt, { label: "Baujahr *", value: v.baujahr, onChange: (x) => setV({ ...v, baujahr: x }), placeholder: "z.B. 1995" })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Dach-Spezifikationen" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Dachtyp" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.dachart, onChange: (e) => setV({ ...v, dachart: e.target.value }), children: [_jsx("option", { value: "Satteldach", children: "Satteldach" }), _jsx("option", { value: "Pultdach", children: "Pultdach" }), _jsx("option", { value: "Flachdach", children: "Flachdach" }), _jsx("option", { value: "Walmdach", children: "Walmdach" }), _jsx("option", { value: "Mansardendach", children: "Mansardendach" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Dachfl\u00E4che verf\u00FCgbar (m\u00B2) *" }), _jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-2", value: v.flaeche, onChange: (e) => setV({ ...v, flaeche: e.target.value }), placeholder: "z.B. 80" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Dachausrichtung" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.ausrichtung, onChange: (e) => setV({ ...v, ausrichtung: e.target.value }), children: [_jsx("option", { value: "S\u00FCd", children: "S\u00FCd (optimal)" }), _jsx("option", { value: "S\u00FCd-West", children: "S\u00FCd-West" }), _jsx("option", { value: "S\u00FCd-Ost", children: "S\u00FCd-Ost" }), _jsx("option", { value: "West", children: "West" }), _jsx("option", { value: "Ost", children: "Ost" }), _jsx("option", { value: "Nord", children: "Nord" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Dachneigung (\u00B0) *" }), _jsx("input", { type: "text", className: "w-full rounded border border-slate-300 px-3 py-2", value: v.neigung, onChange: (e) => setV({ ...v, neigung: e.target.value }), placeholder: "z.B. 35" }), _jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Optimal: 25-40\u00B0 f\u00FCr Deutschland" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Verschattung" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.verschattung, onChange: (e) => setV({ ...v, verschattung: e.target.value }), children: [_jsx("option", { value: "keine", children: "Keine Verschattung" }), _jsx("option", { value: "gering", children: "Geringe Verschattung" }), _jsx("option", { value: "mittel", children: "Mittlere Verschattung" }), _jsx("option", { value: "stark", children: "Starke Verschattung" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Dachzustand" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.dachzustand, onChange: (e) => setV({ ...v, dachzustand: e.target.value }), children: [_jsx("option", { value: "sehr gut", children: "Sehr gut (0-5 Jahre)" }), _jsx("option", { value: "gut", children: "Gut (5-15 Jahre)" }), _jsx("option", { value: "befriedigend", children: "Befriedigend (15-25 Jahre)" }), _jsx("option", { value: "renovierungsbed\u00FCrftig", children: "Renovierungsbed\u00FCrftig (>25 Jahre)" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Technische Anschl\u00FCsse" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Elektroanschluss" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.elektricalConnection, onChange: (e) => setV({ ...v, elektricalConnection: e.target.value }), children: [_jsx("option", { value: "Standardanschluss", children: "Standardanschluss (3-phasig)" }), _jsx("option", { value: "Starkstromanschluss", children: "Starkstromanschluss vorhanden" }), _jsx("option", { value: "Erweiterung n\u00F6tig", children: "Erweiterung erforderlich" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Heizsystem" }), _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: v.heatingSystem, onChange: (e) => setV({ ...v, heatingSystem: e.target.value }), children: [_jsx("option", { value: "Gas", children: "Gas-Heizung" }), _jsx("option", { value: "\u00D6l", children: "\u00D6l-Heizung" }), _jsx("option", { value: "Strom", children: "Elektro-Heizung" }), _jsx("option", { value: "W\u00E4rmepumpe", children: "W\u00E4rmepumpe" }), _jsx("option", { value: "Fernw\u00E4rme", children: "Fernw\u00E4rme" }), _jsx("option", { value: "Holz/Pellets", children: "Holz/Pellets" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Dachspezifikationen" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(Sel, { label: "Dachart", value: v.dachart, onChange: (x) => setV({ ...v, dachart: x }), options: [
                                    "Satteldach", "Satteldach mit Gaube", "Pultdach", "Flachdach", "Walmdach", "Krüppelwalmdach", "Zeltdach", "Mansardendach", "Tonnendach", "Sonstiges"
                                ] }), _jsx(Sel, { label: "Dachdeckungsart", value: v.deckung, onChange: (x) => setV({ ...v, deckung: x }), options: [
                                    "Frankfurter Pfannen", "Trapezblech", "Tonziegel", "Biberschwanz", "Schiefer", "Bitumen", "Eternit", "Schindeln", "Reet", "Sonstiges"
                                ] }), _jsx(Txt, { label: "Dachneigung (Grad) *", value: v.neigung, onChange: (x) => setV({ ...v, neigung: x }), placeholder: "z.B. 35" }), _jsx(Sel, { label: "Dachausrichtung", value: v.ausrichtung, onChange: (x) => setV({ ...v, ausrichtung: x }), options: [
                                    "Süd", "Südost", "Ost", "Südwest", "West", "Nordwest", "Nord", "Nordost", "Flachdach Süd", "Flachdach Ost-West"
                                ] }), _jsx(Sel, { label: "Dachzustand", value: v.dachzustand, onChange: (x) => setV({ ...v, dachzustand: x }), options: [
                                    "sehr gut", "gut", "befriedigend", "renovierungsbedürftig", "schlecht"
                                ] }), _jsx(Sel, { label: "Verschattung", value: v.verschattung, onChange: (x) => setV({ ...v, verschattung: x }), options: [
                                    "keine", "gering (< 10%)", "mittel (10-25%)", "stark (> 25%)"
                                ] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Dachaufbauten & Besonderheiten" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(Txt, { label: "Anzahl Gauben", value: v.gauben_anzahl, onChange: (x) => setV({ ...v, gauben_anzahl: x }), placeholder: "z.B. 2" }), _jsx(Txt, { label: "Anzahl Dachfenster", value: v.dachfenster_anzahl, onChange: (x) => setV({ ...v, dachfenster_anzahl: x }), placeholder: "z.B. 4" }), _jsx(Txt, { label: "Kamin-Position", value: v.kamin_position, onChange: (x) => setV({ ...v, kamin_position: x }), placeholder: "z.B. Mittig, Seite links" }), _jsx(Sel, { label: "Dachrinne Zustand", value: v.dachrinne_zustand, onChange: (x) => setV({ ...v, dachrinne_zustand: x }), options: [
                                    "sehr gut", "gut", "renovierungsbedürftig", "defekt"
                                ] }), _jsx(Txt, { label: "Bestehende Solaranlage", value: v.solar_typ, onChange: (x) => setV({ ...v, solar_typ: x }), placeholder: "z.B. Solarthermie, PV 5kWp" }), _jsx(Txt, { label: "Koordinaten (optional)", value: v.koordinaten, onChange: (x) => setV({ ...v, koordinaten: x }), placeholder: "z.B. 51.1657, 10.4515" })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Spezielle Anforderungen & Gegebenheiten" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.hoeheUeber7m, onChange: (e) => setV({ ...v, hoeheUeber7m: e.target.checked }) }), _jsx("span", { children: "Geb\u00E4udeh\u00F6he > 7 m (Ger\u00FCstkosten ber\u00FCcksichtigen)" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.statik_geprueft, onChange: (e) => setV({ ...v, statik_geprueft: e.target.checked }) }), _jsx("span", { children: "Statik bereits gepr\u00FCft" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.denkmalschutz, onChange: (e) => setV({ ...v, denkmalschutz: e.target.checked }) }), _jsx("span", { children: "Denkmalschutz zu beachten" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.brandschutz_beachten, onChange: (e) => setV({ ...v, brandschutz_beachten: e.target.checked }) }), _jsx("span", { children: "Besondere Brandschutzauflagen" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.kamin_vorhanden, onChange: (e) => setV({ ...v, kamin_vorhanden: e.target.checked }) }), _jsx("span", { children: "Kamin vorhanden" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.solar_vorhanden, onChange: (e) => setV({ ...v, solar_vorhanden: e.target.checked }) }), _jsx("span", { children: "Bestehende Solaranlage vorhanden" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: v.blitzschutz_vorhanden, onChange: (e) => setV({ ...v, blitzschutz_vorhanden: e.target.checked }) }), _jsx("span", { children: "Blitzschutzanlage vorhanden" })] })] })] })] }), _jsx(WizardNav, { backTo: "/project/customer", nextTo: "/project/demand", nextDisabled: !requiredOk })] }));
}
function Txt({ label, value, onChange, placeholder }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-slate-700 mb-1", children: label }), _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder })] }));
}
function Sel({ label, value, options, onChange }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-slate-700 mb-1", children: label }), _jsx("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: value, onChange: (e) => onChange(e.target.value), children: options.map(o => _jsx("option", { value: o, children: o }, o)) })] }));
}
