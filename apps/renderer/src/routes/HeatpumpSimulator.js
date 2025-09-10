import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
export default function HeatpumpSimulator() {
    const header = (_jsxs("div", { className: "flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-bolt text-orange-500" }), _jsx("span", { children: "W\u00E4rmepumpen-Simulator" }), _jsx(Badge, { value: "Beta", severity: "warning" })] }));
    // Mock-Daten für Demonstration
    const buildingTypes = [
        { label: 'Einfamilienhaus', value: 'efh' },
        { label: 'Mehrfamilienhaus', value: 'mfh' },
        { label: 'Gewerbe', value: 'commercial' }
    ];
    const heatpumpTypes = [
        { label: 'Luft-Wasser', value: 'air_water' },
        { label: 'Sole-Wasser', value: 'ground_water' },
        { label: 'Wasser-Wasser', value: 'water_water' }
    ];
    const mockResults = [
        { parameter: 'Heizleistung', wert: '12 kW', einheit: 'kW' },
        { parameter: 'COP (Jahresarbeitszahl)', wert: '4.2', einheit: '-' },
        { parameter: 'Stromverbrauch', wert: '3.500', einheit: 'kWh/Jahr' },
        { parameter: 'Heizkosten/Jahr', wert: '1.200', einheit: '€' },
        { parameter: 'CO2-Einsparung', wert: '2.8', einheit: 't/Jahr' }
    ];
    return (_jsx("div", { className: "mx-auto max-w-6xl p-3", children: _jsxs(Card, { title: header, className: "mb-3", pt: {
                body: { className: 'p-4' },
                content: { className: 'p-0' }
            }, children: [_jsx("p", { className: "text-700 mb-4", children: "Hier kommen sp\u00E4ter Geb\u00E4udedaten, WP-Leistung, COP, Stromtarif, Lastprofile usw." }), _jsx(Message, { severity: "warn", text: "\uD83D\uDEA7 Dieses Modul wird bald mit umfangreichen W\u00E4rmepumpen-Berechnungen erweitert.", className: "mb-4" }), _jsx(Divider, {}), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(Panel, { header: "Geb\u00E4ude- und Systemdaten", className: "w-full", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Geb\u00E4udetyp" }), _jsx(Dropdown, { options: buildingTypes, placeholder: "Geb\u00E4udetyp w\u00E4hlen", className: "w-full" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Wohnfl\u00E4che (m\u00B2)" }), _jsx(InputNumber, { placeholder: "150", className: "w-full", suffix: " m\u00B2" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "W\u00E4rmepumpentyp" }), _jsx(Dropdown, { options: heatpumpTypes, placeholder: "WP-Typ w\u00E4hlen", className: "w-full" })] }), _jsxs("div", { className: "field", children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Heizleistung: ", _jsx("span", { className: "font-bold", children: "12 kW" })] }), _jsx(Slider, { value: 12, min: 5, max: 25, className: "w-full" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Strompreis (ct/kWh)" }), _jsx(InputNumber, { placeholder: "35", className: "w-full", suffix: " ct/kWh" })] })] }) }), _jsxs(Panel, { header: "Berechnungsergebnisse", className: "w-full", children: [_jsxs(DataTable, { value: mockResults, size: "small", pt: {
                                        wrapper: { className: 'border-round' }
                                    }, children: [_jsx(Column, { field: "parameter", header: "Parameter", style: { width: '50%' } }), _jsx(Column, { field: "wert", header: "Wert", style: { width: '30%' }, body: (rowData) => (_jsx("span", { className: "font-medium text-primary", children: rowData.wert })) }), _jsx(Column, { field: "einheit", header: "Einheit", style: { width: '20%' }, body: (rowData) => (_jsx("span", { className: "text-600", children: rowData.einheit })) })] }), _jsxs("div", { className: "mt-4 p-3 bg-green-50 border-round", children: [_jsxs("div", { className: "flex align-items-center gap-2 text-green-700", children: [_jsx("i", { className: "pi pi-check-circle" }), _jsx("span", { className: "font-medium", children: "Wirtschaftlichkeit: Sehr gut" })] }), _jsx("p", { className: "text-sm text-green-600 mt-2", children: "Amortisation nach ca. 8-10 Jahren bei aktuellen Energiepreisen." })] })] })] }), _jsx(Divider, {}), _jsx("div", { className: "flex justify-content-center", children: _jsx(Link, { to: "/home", children: _jsx(Button, { label: "Zur\u00FCck zur Startseite", icon: "pi pi-arrow-left", className: "p-button-outlined" }) }) })] }) }));
}
