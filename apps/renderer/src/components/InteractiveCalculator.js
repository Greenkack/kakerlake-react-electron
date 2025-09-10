import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
export default function InteractiveCalculator({ initialSystemSize, annualConsumption, roofArea }) {
    const [systemSize, setSystemSize] = useState(initialSystemSize);
    const [batterySize, setBatterySize] = useState(10);
    const [electricityPrice, setElectricityPrice] = useState(0.35);
    const [includeWallbox, setIncludeWallbox] = useState(false);
    const [includePump, setIncludePump] = useState(false);
    // Berechnungen basierend auf aktuellen Einstellungen
    const calculations = useMemo(() => {
        const annualYield = systemSize * 950; // kWh pro kWp in Deutschland
        const systemCost = systemSize * 1800 + (batterySize * 800); // Systemkosten
        // Zusatzverbrauch
        let totalConsumption = annualConsumption;
        if (includeWallbox)
            totalConsumption += 3000; // ~3000 kWh für E-Auto
        if (includePump)
            totalConsumption += 4000; // ~4000 kWh für Wärmepumpe
        // Eigenverbrauch berechnen (komplexere Logik)
        const baseAutarky = 0.35 + (batterySize / 50) * 0.3; // 35-65% je nach Speicher
        const autarkyRate = Math.min(0.85, baseAutarky);
        const selfConsumption = Math.min(annualYield, totalConsumption * autarkyRate);
        const gridFeedIn = Math.max(0, annualYield - selfConsumption);
        const gridConsumption = Math.max(0, totalConsumption - selfConsumption);
        // Wirtschaftlichkeit
        const electricitySavings = selfConsumption * electricityPrice;
        const feedInRevenue = gridFeedIn * 0.08;
        const annualSavings = electricitySavings + feedInRevenue;
        const paybackTime = systemCost / annualSavings;
        // CO2-Einsparungen
        const co2Savings = annualYield * 0.4; // 400g CO2/kWh
        return {
            annualYield,
            systemCost,
            totalConsumption,
            selfConsumption,
            gridFeedIn,
            gridConsumption,
            autarkyRate: (selfConsumption / totalConsumption) * 100,
            selfConsumptionRate: (selfConsumption / annualYield) * 100,
            annualSavings,
            paybackTime,
            co2Savings,
            electricitySavings,
            feedInRevenue
        };
    }, [systemSize, batterySize, electricityPrice, includeWallbox, includePump, annualConsumption]);
    const maxSystemSize = roofArea ? Math.floor(roofArea * 0.17) : 30;
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 border", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-6", children: "\uD83E\uDDEE Interaktiver Rechner" }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-700", children: "Konfiguration" }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["PV-Anlagengr\u00F6\u00DFe: ", systemSize, " kWp"] }), _jsx("input", { type: "range", min: "3", max: maxSystemSize, step: "0.5", value: systemSize, onChange: (e) => setSystemSize(parseFloat(e.target.value)), title: `PV-Anlagengröße: ${systemSize} kWp`, "aria-label": "PV-Anlagengr\u00F6\u00DFe", placeholder: "PV-Anlagengr\u00F6\u00DFe", className: "w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer pv-slider" }), _jsxs("div", { className: "flex justify-between text-xs text-slate-500 mt-1", children: [_jsx("span", { children: "3 kWp" }), _jsxs("span", { children: [maxSystemSize, " kWp ", roofArea && "(max für Ihr Dach)"] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["Batteriegr\u00F6\u00DFe: ", batterySize, " kWh"] }), _jsx("input", { type: "range", min: "0", max: "25", step: "2.5", value: batterySize, onChange: (e) => setBatterySize(parseFloat(e.target.value)), title: `Batteriegröße: ${batterySize} kWh`, "aria-label": "Batteriegr\u00F6\u00DFe", placeholder: "Batteriegr\u00F6\u00DFe", className: "w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer battery-slider" }), _jsxs("div", { className: "flex justify-between text-xs text-slate-500 mt-1", children: [_jsx("span", { children: "0 kWh" }), _jsx("span", { children: "25 kWh" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["Strompreis: ", electricityPrice.toFixed(2), " \u20AC/kWh"] }), _jsx("input", { type: "range", min: "0.25", max: "0.50", step: "0.01", value: electricityPrice, onChange: (e) => setElectricityPrice(parseFloat(e.target.value)), title: `Strompreis: ${electricityPrice.toFixed(2)} €/kWh`, "aria-label": "Strompreis", placeholder: "Strompreis", className: "w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer price-slider" }), _jsxs("div", { className: "flex justify-between text-xs text-slate-500 mt-1", children: [_jsx("span", { children: "25 ct" }), _jsx("span", { children: "50 ct" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-slate-700", children: "Zus\u00E4tzliche Verbraucher" }), _jsxs("label", { className: "flex items-center space-x-3", children: [_jsx("input", { type: "checkbox", checked: includeWallbox, onChange: (e) => setIncludeWallbox(e.target.checked), className: "rounded border-slate-300" }), _jsx("span", { className: "text-sm", children: "\uD83D\uDE97 Wallbox (+3.000 kWh/Jahr)" })] }), _jsxs("label", { className: "flex items-center space-x-3", children: [_jsx("input", { type: "checkbox", checked: includePump, onChange: (e) => setIncludePump(e.target.checked), className: "rounded border-slate-300" }), _jsx("span", { className: "text-sm", children: "\uD83D\uDD25 W\u00E4rmepumpe (+4.000 kWh/Jahr)" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-700", children: "Live-Ergebnisse" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: calculations.annualYield.toLocaleString('de-DE') }), _jsx("div", { className: "text-sm text-slate-600", children: "kWh Ertrag/Jahr" })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [calculations.annualSavings.toLocaleString('de-DE'), " \u20AC"] }), _jsx("div", { className: "text-sm text-slate-600", children: "Einsparung/Jahr" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Autarkiegrad" }), _jsxs("span", { className: "text-sm font-medium", children: [calculations.autarkyRate.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full transition-all duration-700", style: { width: `${calculations.autarkyRate}%` } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Eigenverbrauchsquote" }), _jsxs("span", { className: "text-sm font-medium", children: [calculations.selfConsumptionRate.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-700", style: { width: `${calculations.selfConsumptionRate}%` } }) })] })] }), _jsx("div", { className: "bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200", children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-600", children: "Systemkosten:" }), _jsxs("div", { className: "font-bold", children: [calculations.systemCost.toLocaleString('de-DE'), " \u20AC"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-600", children: "Amortisation:" }), _jsxs("div", { className: "font-bold", children: [calculations.paybackTime.toFixed(1), " Jahre"] })] })] }) }), _jsx("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-green-600", children: [calculations.co2Savings.toLocaleString('de-DE'), " kg CO\u2082"] }), _jsx("div", { className: "text-sm text-slate-600", children: "Einsparung pro Jahr" })] }) })] })] })] }));
}
