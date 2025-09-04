import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SmartRecommendations({ data, buildingData }) {
    const generateRecommendations = () => {
        const recommendations = [];
        // PV-Anlagen-Größe Empfehlung
        if (data.totalConsumption > 0) {
            const recommendedPvSize = Math.round((data.futureConsumption * 1.2) / 1000); // 120% des Verbrauchs
            const maxRoofSize = buildingData?.roofArea ? Math.round(buildingData.roofArea * 0.065) : 10;
            const finalSize = Math.min(recommendedPvSize, maxRoofSize);
            recommendations.push({
                icon: '☀️',
                title: 'PV-Anlagen-Größe',
                description: `Empfohlene Leistung: ${finalSize} kWp`,
                details: `Basierend auf Ihrem ${data.hasSignificantIncrease ? 'zukünftigen' : 'aktuellen'} Verbrauch von ${data.hasSignificantIncrease ? data.futureConsumption : data.totalConsumption} kWh/Jahr`,
                priority: 'high'
            });
        }
        // Batteriespeicher Empfehlung
        if (data.totalConsumption > 3000) {
            const recommendedBatterySize = Math.round(data.totalConsumption / 2000); // Grobe Schätzung
            recommendations.push({
                icon: '🔋',
                title: 'Batteriespeicher',
                description: `Empfohlene Speichergröße: ${recommendedBatterySize * 5}-${recommendedBatterySize * 8} kWh`,
                details: 'Erhöht Eigenverbrauch von ~30% auf ~70%',
                priority: data.electricityPrice > 0.35 ? 'high' : 'medium'
            });
        }
        // Ausrichtungs-Optimierung
        if (buildingData?.roofOrientation && buildingData.roofOrientation !== 'Süd') {
            recommendations.push({
                icon: '🧭',
                title: 'Ausrichtungs-Hinweis',
                description: `${buildingData.roofOrientation}-Ausrichtung: 15-25% weniger Ertrag als Süd`,
                details: 'Ost-West-Aufständerung kann sinnvoll sein',
                priority: 'medium'
            });
        }
        // Neigungswinkel-Optimierung  
        if (buildingData?.roofTilt && (buildingData.roofTilt < 20 || buildingData.roofTilt > 50)) {
            recommendations.push({
                icon: '📐',
                title: 'Neigungswinkel',
                description: `${buildingData.roofTilt}° ist suboptimal für Deutschland`,
                details: 'Optimal: 30-40° für maximalen Ertrag',
                priority: 'low'
            });
        }
        // Einsparpotential Highlight
        if (data.potentialSavings > 1000) {
            recommendations.push({
                icon: '💰',
                title: 'Einsparpotential',
                description: `Bis zu ${data.potentialSavings.toLocaleString()}€/Jahr sparen`,
                details: 'Bei 70% Eigenverbrauchsanteil',
                priority: 'high'
            });
        }
        // Verbrauchsoptimierung
        if (data.consumptionCategory.includes('Hoch') || data.consumptionCategory.includes('Sehr hoch')) {
            recommendations.push({
                icon: '⚡',
                title: 'Verbrauchsoptimierung',
                description: 'Ihr Verbrauch liegt über dem Durchschnitt',
                details: 'Energieeffiziente Geräte können 20-30% sparen',
                priority: 'medium'
            });
        }
        return recommendations;
    };
    const recommendations = generateRecommendations();
    if (recommendations.length === 0)
        return null;
    return (_jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6", children: [_jsxs("h4", { className: "font-semibold text-purple-800 mb-4 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83C\uDFAF" }), "Intelligente Empfehlungen"] }), _jsx("div", { className: "space-y-4", children: recommendations.map((rec, index) => (_jsx("div", { className: `p-4 rounded-lg border ${rec.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : rec.priority === 'medium'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-blue-50 border-blue-200'}`, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("span", { className: "text-xl", children: rec.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-slate-800", children: rec.title }), _jsx("div", { className: "text-slate-700", children: rec.description }), _jsx("div", { className: "text-sm text-slate-600 mt-1", children: rec.details })] }), rec.priority === 'high' && (_jsx("span", { className: "bg-red-100 text-red-700 text-xs px-2 py-1 rounded", children: "Wichtig" }))] }) }, index))) }), _jsx("div", { className: "mt-4 p-3 bg-white/60 rounded-lg border border-purple-200", children: _jsxs("div", { className: "text-sm text-purple-700", children: [_jsx("strong", { children: "\uD83D\uDCA1 Hinweis:" }), " Diese Empfehlungen basieren auf Ihren Angaben und typischen Erfahrungswerten. Eine detaillierte Vor-Ort-Begehung kann weitere Optimierungsm\u00F6glichkeiten aufdecken."] }) })] }));
}
