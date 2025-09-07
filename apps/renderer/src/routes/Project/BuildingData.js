import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// PATCH: Wizard-Navigation entfernt, Save-Flow hinzugefügt
// ...bestehende Importe belassen...
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../state/project";
export default function BuildingData() {
    const nav = useNavigate();
    const { state, actions } = useProject();
    const initializedRef = useRef(false);
    const [saveStatus, setSaveStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [v, setV] = useState({
        buildingType: state.building.buildingType || "Einfamilienhaus",
        livingSpace: state.building.livingSpace?.toString() || "",
        floors: state.building.floors?.toString() || "",
        baujahr: state.building.constructionYear?.toString() || "",
        dachart: state.building.roofType || "Satteldach",
        ausrichtung: state.building.roofOrientation || "Süd",
        neigung: state.building.roofTilt?.toString() || "",
        flaeche: state.building.roofArea?.toString() || "",
        deckung: "Frankfurter Pfannen",
        verschattung: state.building.shadingFactors || "keine",
        dachzustand: "gut",
        statik_geprueft: false,
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
        elektricalConnection: state.building.electricalConnection || "Standardanschluss",
        heatingSystem: state.building.heatingSystem || "Gas",
    });
    useEffect(() => {
        if (initializedRef.current)
            return;
        initializedRef.current = true;
        const b = state.building;
        setV(prev => ({
            ...prev,
            buildingType: b.buildingType || prev.buildingType,
            livingSpace: b.livingSpace?.toString() || prev.livingSpace,
            floors: b.floors?.toString() || prev.floors,
            baujahr: b.constructionYear?.toString() || prev.baujahr,
            dachart: b.roofType || prev.dachart,
            ausrichtung: b.roofOrientation || prev.ausrichtung,
            neigung: b.roofTilt?.toString() || prev.neigung,
            flaeche: b.roofArea?.toString() || prev.flaeche,
            verschattung: b.shadingFactors || prev.verschattung,
            elektricalConnection: b.electricalConnection || prev.elektricalConnection,
            heatingSystem: b.heatingSystem || prev.heatingSystem,
        }));
    }, [state.building]);
    const calculations = useMemo(() => {
        const livingSpace = parseInt(v.livingSpace) || 0;
        const roofArea = parseInt(v.flaeche) || 0;
        const tilt = parseInt(v.neigung) || 0;
        const estimatedPvPower = roofArea > 0 ? Math.round((roofArea * 0.065) * 10) / 10 : 0;
        const usableRoofArea = Math.round(roofArea * 0.6);
        return {
            estimatedPvPower,
            usableRoofArea,
            optimalTilt: 35,
            solarHint: roofArea > 0
                ? (v.ausrichtung === "Süd" && tilt >= 25 && tilt <= 40
                    ? "🌟 Optimal"
                    : v.ausrichtung === "Süd"
                        ? "☀️ Sehr gut"
                        : (v.ausrichtung === "Ost" || v.ausrichtung === "West")
                            ? "✅ Gut"
                            : "⚠️ Mäßig")
                : ""
        };
    }, [v.ausrichtung, v.flaeche, v.neigung, v.livingSpace]);
    const lastSignatureRef = useRef("");
    useEffect(() => {
        const patch = {
            buildingType: v.buildingType,
            livingSpace: v.livingSpace.trim() ? parseInt(v.livingSpace) : undefined,
            floors: v.floors.trim() ? parseInt(v.floors) : undefined,
            constructionYear: v.baujahr.trim() ? parseInt(v.baujahr) : undefined,
            roofType: v.dachart,
            roofOrientation: v.ausrichtung,
            roofTilt: v.neigung.trim() ? parseInt(v.neigung) : undefined,
            roofArea: v.flaeche.trim() ? parseInt(v.flaeche) : undefined,
            shadingFactors: v.verschattung,
            electricalConnection: v.elektricalConnection,
            heatingSystem: v.heatingSystem,
        };
        const signature = JSON.stringify(patch);
        if (signature !== lastSignatureRef.current) {
            lastSignatureRef.current = signature;
            actions.updateBuilding(patch);
        }
    }, [
        v.buildingType,
        v.livingSpace,
        v.floors,
        v.baujahr,
        v.dachart,
        v.ausrichtung,
        v.neigung,
        v.flaeche,
        v.verschattung,
        v.elektricalConnection,
        v.heatingSystem,
        actions
    ]);
    const missingRequired = [];
    if (!v.baujahr.trim())
        missingRequired.push("Baujahr");
    if (!v.flaeche.trim())
        missingRequired.push("Dachfläche");
    if (!v.neigung.trim())
        missingRequired.push("Dachneigung");
    const requiredOk = missingRequired.length === 0;
    const handleSave = () => {
        setErrorMsg("");
        if (!requiredOk) {
            setErrorMsg("Bitte Pflichtfelder ausfüllen: " + missingRequired.join(", "));
            return;
        }
        try {
            setSaveStatus("saving");
            // Optional: Flag setzen
            actions.updateBuilding({ savedAt: Date.now() });
            setTimeout(() => {
                setSaveStatus("done");
                nav("/home");
            }, 300);
        }
        catch (e) {
            console.error(e);
            setSaveStatus("error");
            setErrorMsg("Speichern fehlgeschlagen.");
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-32", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Geb\u00E4udedaten erfassen" }), _jsx("p", { className: "text-slate-600", children: "Bitte Geb\u00E4udedaten eingeben und anschlie\u00DFend \u201EDaten speichern\u201C klicken. Danach w\u00E4hlen Sie im Hauptmen\u00FC den Solar Calculator oder W\u00E4rmepumpe Simulator." }), calculations.estimatedPvPower > 0 && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Gesch\u00E4tzte PV-Leistung:" }), " ", calculations.estimatedPvPower, " kWp"] }), _jsxs("div", { children: [_jsx("strong", { children: "Nutzbare Dachfl\u00E4che:" }), " ~", calculations.usableRoofArea, " m\u00B2"] }), _jsxs("div", { children: [_jsx("strong", { children: "Bewertung:" }), " ", calculations.solarHint] })] })), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Grunddaten" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(FieldSelect, { label: "Geb\u00E4udetyp", value: v.buildingType, onChange: buildingType => setV({ ...v, buildingType }), options: ["Einfamilienhaus", "Zweifamilienhaus", "Reihenhaus", "Doppelhaushälfte", "Bungalow"] }), _jsx(FieldInput, { label: "Wohnfl\u00E4che (m\u00B2)", value: v.livingSpace, onChange: livingSpace => setV({ ...v, livingSpace }), placeholder: "z.B. 150" }), _jsx(FieldInput, { label: "Baujahr *", value: v.baujahr, onChange: baujahr => setV({ ...v, baujahr }), placeholder: "z.B. 1995" })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Dach-Spezifikationen" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(FieldSelect, { label: "Dachart", value: v.dachart, onChange: dachart => setV({ ...v, dachart }), options: ["Satteldach", "Walmdach", "Flachdach", "Pultdach", "Mansarddach"] }), _jsx(FieldSelect, { label: "Dachausrichtung", value: v.ausrichtung, onChange: ausrichtung => setV({ ...v, ausrichtung }), options: ["Süd", "Südost", "Südwest", "Ost", "West", "Nord"] }), _jsx(FieldInput, { label: "Dachneigung (\u00B0) *", value: v.neigung, onChange: neigung => setV({ ...v, neigung }), placeholder: "z.B. 35" })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 mt-4", children: [_jsx(FieldInput, { label: "Dachfl\u00E4che (m\u00B2) *", value: v.flaeche, onChange: flaeche => setV({ ...v, flaeche }), placeholder: "z.B. 120" }), _jsx(FieldSelect, { label: "Verschattung", value: v.verschattung, onChange: verschattung => setV({ ...v, verschattung }), options: ["keine", "gering", "mittel", "stark"] }), _jsx(FieldSelect, { label: "Dachdeckung", value: v.deckung, onChange: deckung => setV({ ...v, deckung }), options: ["Frankfurter Pfannen", "Biberschwanz", "Schiefer", "Blech", "Andere"] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-4", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Technische Anschl\u00FCsse" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldSelect, { label: "Elektrischer Anschluss", value: v.elektricalConnection, onChange: elektricalConnection => setV({ ...v, elektricalConnection }), options: ["Standardanschluss", "Verstärkter Anschluss", "Industrieanschluss"] }), _jsx(FieldSelect, { label: "Heizungssystem", value: v.heatingSystem, onChange: heatingSystem => setV({ ...v, heatingSystem }), options: ["Gas", "Öl", "Wärmepumpe", "Fernwärme", "Pellets", "Andere"] })] })] }), errorMsg && (_jsx("div", { className: "p-3 rounded bg-red-50 border border-red-300 text-red-700 text-sm", children: errorMsg })), !requiredOk && !errorMsg && (_jsxs("div", { className: "p-3 rounded bg-amber-50 border border-amber-300 text-amber-800 text-sm", children: ["Fehlende Pflichtfelder: ", missingRequired.join(", ")] })), _jsxs("div", { className: "flex flex-wrap gap-4 items-center border-t pt-6", children: [_jsx("button", { type: "button", onClick: handleSave, disabled: saveStatus === "saving", className: "px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60", children: saveStatus === "saving" ? "Speichern..." : "Daten speichern" }), _jsx("button", { type: "button", onClick: () => nav("/home"), className: "px-5 py-3 rounded bg-slate-200 hover:bg-slate-300", children: "Abbrechen / Zur\u00FCck" }), saveStatus === "done" && (_jsx("span", { className: "text-green-700 text-sm", children: "Gespeichert \u2013 zur\u00FCck zum Men\u00FC..." })), saveStatus === "error" && (_jsx("span", { className: "text-red-600 text-sm", children: "Fehler beim Speichern." }))] }), _jsxs("div", { className: "mt-4 text-xs text-slate-500", children: ["Debug: signature=", lastSignatureRef.current] })] }));
}
function FieldInput({ label, value, onChange, placeholder }) {
    return (_jsxs("label", { className: "block text-sm", children: [_jsx("span", { className: "block font-medium mb-1", children: label }), _jsx("input", { className: "w-full border rounded px-3 py-2", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder })] }));
}
function FieldSelect({ label, value, onChange, options }) {
    return (_jsxs("label", { className: "block text-sm", children: [_jsx("span", { className: "block font-medium mb-1", children: label }), _jsx("select", { className: "w-full border rounded px-3 py-2", value: value, onChange: (e) => onChange(e.target.value), children: options.map(o => _jsx("option", { value: o, children: o }, o)) })] }));
}
