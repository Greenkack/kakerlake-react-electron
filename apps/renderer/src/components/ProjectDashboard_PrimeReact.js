import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useProject } from '../state/project';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
export default function ProjectDashboard() {
    const { state } = useProject();
    const { mode, customer, building, consumption, options } = state;
    // Fortschrittsanalyse
    const progress = useMemo(() => {
        let steps = 0;
        let completed = 0;
        // Kundendaten
        steps++;
        if (customer.vorname && customer.nachname && customer.strasse)
            completed++;
        // Gebäudedaten
        steps++;
        if (building.roofArea && building.roofOrientation)
            completed++;
        // Verbrauchsanalyse
        steps++;
        if (consumption.annualKWhHousehold && consumption.annualKWhHousehold > 0)
            completed++;
        // Optionen
        steps++;
        if (mode && (options.battery_interest !== undefined || options.hp_interest !== undefined))
            completed++;
        return {
            total: steps,
            completed,
            percentage: Math.round((completed / steps) * 100)
        };
    }, [customer, building, consumption, options, mode]);
    // Schnellübersicht der eingegebenen Daten
    const summary = useMemo(() => {
        const hasCustomer = customer.vorname && customer.nachname;
        const hasBuilding = building.roofArea && building.roofOrientation;
        const hasConsumption = consumption.annualKWhHousehold && consumption.annualKWhHousehold > 0;
        const hasOptions = Boolean(mode);
        // Geschätzte Systemgröße
        const estimatedSize = building.roofArea
            ? Math.min(building.roofArea * 0.15, 20)
            : consumption.annualKWhHousehold
                ? Math.min(consumption.annualKWhHousehold / 1000, 20)
                : 10;
        return {
            hasCustomer,
            hasBuilding,
            hasConsumption,
            hasOptions,
            estimatedSize: Math.round(estimatedSize * 10) / 10,
            isComplete: hasCustomer && hasBuilding && hasConsumption && hasOptions
        };
    }, [customer, building, consumption, mode]);
    // Steps Daten für bessere Darstellung
    const steps = [
        {
            id: 1,
            title: 'Kundendaten',
            icon: 'pi-user',
            completed: summary.hasCustomer,
            description: summary.hasCustomer
                ? `${customer.vorname} ${customer.nachname}`
                : 'Name und Adresse eingeben'
        },
        {
            id: 2,
            title: 'Gebäudedaten',
            icon: 'pi-home',
            completed: summary.hasBuilding,
            description: summary.hasBuilding
                ? `${building.roofArea}m² • ${building.roofOrientation}`
                : 'Dachfläche und Ausrichtung'
        },
        {
            id: 3,
            title: 'Verbrauchsdaten',
            icon: 'pi-bolt',
            completed: summary.hasConsumption,
            description: summary.hasConsumption
                ? `${consumption.annualKWhHousehold?.toLocaleString('de-DE')} kWh/Jahr`
                : 'Stromverbrauch eingeben'
        },
        {
            id: 4,
            title: 'Optionen',
            icon: 'pi-cog',
            completed: summary.hasOptions,
            description: summary.hasOptions
                ? `Modus: ${mode}`
                : 'Speicher & Wärmepumpe'
        }
    ];
    const stepRowTemplate = (step) => (_jsxs("div", { className: "flex align-items-center gap-3 py-2", children: [_jsx("div", { className: `flex align-items-center justify-content-center border-circle w-3rem h-3rem ${step.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`, children: _jsx("i", { className: `pi ${step.icon} text-lg` }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex align-items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold", children: step.title }), step.completed && _jsx("i", { className: "pi pi-check text-green-600" })] }), _jsx("p", { className: "text-sm text-600 m-0", children: step.description })] }), _jsx("div", { children: step.completed ? (_jsx(Tag, { severity: "success", value: "Fertig" })) : (_jsx(Tag, { severity: "warning", value: "Ausstehend" })) })] }));
    return (_jsxs("div", { className: "space-y-4 p-3", children: [_jsx(Card, { className: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none", children: _jsxs("div", { className: "text-center", children: [_jsxs("h1", { className: "text-3xl font-bold mb-3 flex align-items-center justify-content-center gap-2", children: [_jsx("i", { className: "pi pi-sun" }), "Willkommen bei der PV-Anlagenplanung!"] }), _jsx("p", { className: "text-blue-100 text-lg", children: "Erstellen Sie in wenigen Schritten ein individuelles Angebot f\u00FCr Ihre Photovoltaik-Anlage." })] }) }), _jsxs(Card, { title: "\uD83D\uDCCA Projektstatus", className: "w-full", children: [_jsxs("div", { className: "flex align-items-center justify-content-between mb-4", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex justify-content-between text-sm mb-2", children: [_jsx("span", { className: "text-600", children: "Projekterstellung" }), _jsx(Chip, { label: `${progress.completed}/${progress.total} Schritte`, className: "p-chip-outlined" })] }), _jsx(ProgressBar, { value: progress.percentage, className: "h-1rem", pt: {
                                            value: {
                                                className: progress.percentage === 100 ? 'bg-green-400' : 'bg-blue-400'
                                            }
                                        } })] }), _jsx("div", { className: "text-center", children: _jsx(Badge, { value: `${progress.percentage}%`, size: "large", severity: progress.percentage === 100 ? "success" : progress.percentage >= 50 ? "info" : "warning" }) })] }), _jsx(Divider, {}), _jsx("div", { className: "space-y-3", children: steps.map(step => (_jsx("div", { children: stepRowTemplate(step) }, step.id))) })] }), (summary.hasConsumption || summary.hasBuilding) && (_jsx(Card, { title: "\u26A1 Projekt-\u00DCbersicht", className: "bg-green-50 border-green-200", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [summary.hasCustomer && (_jsx(Panel, { header: "\uD83D\uDC64 Kunde", className: "h-full", children: _jsxs("p", { className: "text-sm text-600 m-0", children: [customer.vorname, " ", customer.nachname, customer.strasse && (_jsxs(_Fragment, { children: [_jsx("br", {}), customer.strasse, " ", customer.hausnummer, _jsx("br", {}), customer.plz, " ", customer.ort] }))] }) })), summary.hasBuilding && (_jsx(Panel, { header: "\uD83C\uDFE0 Geb\u00E4ude", className: "h-full", children: _jsxs("p", { className: "text-sm text-600 m-0", children: ["Dachfl\u00E4che: ", _jsxs("strong", { children: [building.roofArea, "m\u00B2"] }), _jsx("br", {}), "Ausrichtung: ", _jsx("strong", { children: building.roofOrientation }), _jsx("br", {}), building.roofTilt && `Neigung: ${building.roofTilt}°`, _jsx("br", {}), _jsx(Chip, { label: `~${summary.estimatedSize} kWp möglich`, className: "mt-2 p-chip-outlined" })] }) })), summary.hasConsumption && (_jsx(Panel, { header: "\u26A1 Verbrauch", className: "h-full", children: _jsxs("p", { className: "text-sm text-600 m-0", children: ["Haushalt: ", _jsxs("strong", { children: [consumption.annualKWhHousehold?.toLocaleString('de-DE'), " kWh/Jahr"] }), _jsx("br", {}), consumption.annualKWhHeating && (_jsxs(_Fragment, { children: ["Heizung: ", _jsxs("strong", { children: [consumption.annualKWhHeating?.toLocaleString('de-DE'), " kWh/Jahr"] }), _jsx("br", {})] })), consumption.homeOfficeHours && (_jsxs(_Fragment, { children: ["HomeOffice: ", _jsxs("strong", { children: [consumption.homeOfficeHours, "h/Tag"] })] }))] }) }))] }) })), _jsx(Card, { title: "\uD83D\uDE80 N\u00E4chste Schritte", className: "w-full", children: _jsxs("div", { className: "flex flex-wrap gap-3 justify-content-center", children: [!summary.hasCustomer && (_jsx(Link, { to: "/solar-calculator", children: _jsx(Button, { label: "Kundendaten eingeben", icon: "pi pi-user-plus", className: "p-button-outlined" }) })), !summary.hasBuilding && (_jsx(Link, { to: "/solar-calculator", children: _jsx(Button, { label: "Geb\u00E4udedaten erfassen", icon: "pi pi-home", className: "p-button-outlined" }) })), !summary.hasConsumption && (_jsx(Link, { to: "/solar-calculator", children: _jsx(Button, { label: "Verbrauch analysieren", icon: "pi pi-chart-line", className: "p-button-outlined" }) })), summary.isComplete && (_jsx(Link, { to: "/results", children: _jsx(Button, { label: "Ergebnisse anzeigen", icon: "pi pi-eye", className: "p-button-success" }) })), _jsx(Link, { to: "/solar-calculator", children: _jsx(Button, { label: "Rechner \u00F6ffnen", icon: "pi pi-calculator", className: "p-button-primary" }) })] }) })] }));
}
