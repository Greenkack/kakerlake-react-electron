import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
export default function SolarCalculator() {
    const [modules, setModules] = useState(20);
    const [moduleWp, setModuleWp] = useState(440);
    const kWp = useMemo(() => {
        const m = Number.isFinite(modules) ? modules : 0;
        const w = Number.isFinite(moduleWp) ? moduleWp : 0;
        return (m * w) / 1000;
    }, [modules, moduleWp]);
    return (_jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [_jsxs("header", { className: "rounded-xl bg-white p-4 shadow", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Solarkalkulator" }), _jsx("p", { className: "text-gray-600", children: "Demo-Eingaben f\u00FCr kWp-Berechnung. Sp\u00E4ter kommen WR, Speicher usw. dazu." })] }), _jsxs("section", { className: "rounded-xl bg-white p-4 shadow space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "mb-1 block text-sm", children: "Anzahl Module" }), _jsx("input", { type: "number", className: "w-full rounded border px-3 py-2", value: modules, onChange: (e) => setModules(parseInt(e.target.value || "0", 10)), min: 0 })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "mb-1 block text-sm", children: "Leistung pro Modul (Wp)" }), _jsx("input", { type: "number", className: "w-full rounded border px-3 py-2", value: moduleWp, onChange: (e) => setModuleWp(parseInt(e.target.value || "0", 10)), min: 0 })] })] }), _jsxs("div", { className: "rounded border bg-gray-50 p-3", children: [_jsx("div", { className: "text-sm text-gray-600", children: "Anlagengr\u00F6\u00DFe (kWp)" }), _jsx("div", { className: "text-2xl font-semibold tabular-nums", children: kWp.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 3 }) })] })] }), _jsx("div", { className: "text-center", children: _jsx(Link, { to: "/home", className: "inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors", children: "\u2190 Zur\u00FCck zur Startseite" }) })] }));
}
