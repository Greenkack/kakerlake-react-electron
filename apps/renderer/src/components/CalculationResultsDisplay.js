import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/renderer/src/components/CalculationResultsDisplay.tsx
// Umfassende Ergebnisanzeige für PV-Berechnungen mit TypeScript-Sicherheit
import { useState } from 'react';
import { Card } from 'primereact/card';
import { Knob } from 'primereact/knob';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import ChartContainer, { createAmortizationChart, createROIChart, createEnergyProductionChart } from './ChartContainer';
import { useCalculationResults, useNotifications } from '../context/AppContext';
// Hilfsfunktion für sichere Zahlenwerte
const safeNumber = (value, fallback = 0) => {
    return value !== undefined && !isNaN(value) ? value : fallback;
};
export const CalculationResultsDisplay = ({ results: propResults, showCharts = true, compactMode = false }) => {
    const { results: contextResults } = useCalculationResults();
    const { addNotification } = useNotifications();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    // Verwende Props oder Context Results
    const results = propResults || contextResults;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };
    const formatNumber = (num, decimals = 1) => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    };
    const getRoiSeverity = (roi) => {
        if (roi >= 8)
            return "success";
        if (roi >= 5)
            return "info";
        if (roi >= 3)
            return "warning";
        return "danger";
    };
    const getPaybackSeverity = (years) => {
        if (years <= 10)
            return "success";
        if (years <= 15)
            return "info";
        if (years <= 20)
            return "warning";
        return "danger";
    };
    if (!results) {
        return (_jsx(Card, { title: "\uD83D\uDCCA Berechnungsergebnisse", className: "calculation-results-placeholder", children: _jsxs("div", { className: "text-center p-4", children: [_jsx("i", { className: "pi pi-info-circle text-4xl text-gray-400 mb-3" }), _jsx("p", { className: "text-gray-600", children: "Keine Berechnungsergebnisse verf\u00FCgbar" }), _jsx("p", { className: "text-sm text-gray-500", children: "F\u00FChren Sie eine Berechnung durch, um die Ergebnisse hier zu sehen." })] }) }));
    }
    // Sichere Werte extrahieren
    const anlageKwp = safeNumber(results.anlage_kwp, 0);
    const totalInvestmentNetto = safeNumber(results.total_investment_netto, 0);
    const totalInvestmentBrutto = safeNumber(results.total_investment_brutto, 0);
    const paybackYears = safeNumber(results.payback_years, 0);
    const roiPercent = safeNumber(results.roi_percent, 0);
    const annualProduction = safeNumber(results.annual_pv_production_kwh, 0);
    const co2Savings = safeNumber(results.co2_savings_annual, 0);
    const autarkieGrad = safeNumber(results.autarkie_grad, 0);
    const eigenverbrauchPercent = safeNumber(results.eigenverbrauch_percent, 0);
    const annualSavings = safeNumber(results.annual_savings, 0);
    const einspeiseverguetung = safeNumber(results.einspeiseverguetung_annual, 0);
    const baseMatrixPrice = safeNumber(results.base_matrix_price_netto, 0);
    // Kostentabelle für Breakdown
    const costBreakdownData = [
        { component: 'PV-Module', cost_netto: baseMatrixPrice * 0.4, cost_brutto: baseMatrixPrice * 0.4 * 1.19 },
        { component: 'Wechselrichter', cost_netto: baseMatrixPrice * 0.15, cost_brutto: baseMatrixPrice * 0.15 * 1.19 },
        { component: 'Montagesystem', cost_netto: baseMatrixPrice * 0.2, cost_brutto: baseMatrixPrice * 0.2 * 1.19 },
        { component: 'Installation', cost_netto: baseMatrixPrice * 0.25, cost_brutto: baseMatrixPrice * 0.25 * 1.19 }
    ];
    // Chart-Daten generieren
    const amortizationData = results.yearly_cashflow?.length
        ? createAmortizationChart(Array.from({ length: results.yearly_cashflow.length }, (_, i) => i), results.yearly_cashflow)
        : null;
    const productionData = results.monthly_production?.length
        ? createEnergyProductionChart(['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], results.monthly_production)
        : null;
    const roiData = createROIChart(['Eigenverbrauch', 'Einspeisung', 'Steuervorteile', 'Wartung'], [eigenverbrauchPercent, 100 - eigenverbrauchPercent, 5, 3]);
    if (compactMode) {
        return (_jsxs("div", { className: "calculation-results-compact grid", children: [_jsx("div", { className: "col-4", children: _jsxs(Card, { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-primary", children: [formatNumber(anlageKwp), " kWp"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Anlagenleistung" })] }) }), _jsx("div", { className: "col-4", children: _jsxs(Card, { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-500", children: formatCurrency(totalInvestmentNetto) }), _jsx("div", { className: "text-sm text-gray-600", children: "Investition (netto)" })] }) }), _jsx("div", { className: "col-4", children: _jsxs(Card, { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-500", children: [formatNumber(paybackYears), " Jahre"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Amortisation" })] }) })] }));
    }
    return (_jsxs("div", { className: "calculation-results-display", children: [_jsxs(Card, { title: "\uD83D\uDCCA Berechnungsergebnisse", className: "mb-4", children: [_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6 lg:col-3", children: _jsxs("div", { className: "kpi-card text-center p-3", children: [_jsx(Knob, { value: anlageKwp, max: 20, size: 80, valueTemplate: "{value} kWp", className: "mb-2" }), _jsx("h4", { className: "m-0 text-primary", children: "Anlagenleistung" })] }) }), _jsx("div", { className: "col-12 md:col-6 lg:col-3", children: _jsxs("div", { className: "kpi-card text-center p-3", children: [_jsx("div", { className: "text-3xl font-bold text-green-500 mb-2", children: formatCurrency(totalInvestmentNetto) }), _jsx("h4", { className: "m-0", children: "Investition (netto)" }), _jsx(Badge, { value: `${formatCurrency(totalInvestmentBrutto)} brutto`, severity: "info", className: "mt-1" })] }) }), _jsx("div", { className: "col-12 md:col-6 lg:col-3", children: _jsxs("div", { className: "kpi-card text-center p-3", children: [_jsx("div", { className: "text-3xl font-bold text-blue-500 mb-2", children: formatNumber(paybackYears) }), _jsx("h4", { className: "m-0", children: "Amortisation (Jahre)" }), _jsx(Tag, { value: `ROI: ${formatNumber(roiPercent)}%`, severity: getRoiSeverity(roiPercent), className: "mt-1" })] }) }), _jsx("div", { className: "col-12 md:col-6 lg:col-3", children: _jsxs("div", { className: "kpi-card text-center p-3", children: [_jsxs("div", { className: "text-3xl font-bold text-orange-500 mb-2", children: [formatNumber(annualProduction / 1000), " MWh"] }), _jsx("h4", { className: "m-0", children: "Jahresertrag" }), _jsx(Badge, { value: `${formatNumber(co2Savings / 1000)} t CO₂`, severity: "success", className: "mt-1" })] }) })] }), _jsx(Divider, {}), _jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-6", children: [_jsx("h5", { children: "\uD83C\uDFE0 Autarkiegrad" }), _jsx(ProgressBar, { value: autarkieGrad, displayValueTemplate: () => `${formatNumber(autarkieGrad)}%`, className: "mb-2" })] }), _jsxs("div", { className: "col-6", children: [_jsx("h5", { children: "\u26A1 Eigenverbrauch" }), _jsx(ProgressBar, { value: eigenverbrauchPercent, displayValueTemplate: () => `${formatNumber(eigenverbrauchPercent)}%`, className: "mb-2" })] })] })] }), _jsxs(TabView, { activeIndex: activeTabIndex, onTabChange: (e) => setActiveTabIndex(e.index), children: [_jsx(TabPanel, { header: "\uD83D\uDCB0 Finanzen", leftIcon: "pi pi-euro", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 lg:col-8", children: _jsxs(Card, { title: "Kostenaufstellung", children: [_jsxs(DataTable, { value: costBreakdownData, responsiveLayout: "scroll", children: [_jsx(Column, { field: "component", header: "Komponente" }), _jsx(Column, { field: "cost_netto", header: "Netto", body: (data) => formatCurrency(data.cost_netto) }), _jsx(Column, { field: "cost_brutto", header: "Brutto", body: (data) => formatCurrency(data.cost_brutto) })] }), _jsx(Divider, {}), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("strong", { children: "Gesamt (netto):" }), _jsx("strong", { children: formatCurrency(totalInvestmentNetto) })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("strong", { children: "Gesamt (brutto):" }), _jsx("strong", { children: formatCurrency(totalInvestmentBrutto) })] })] }) }), _jsx("div", { className: "col-12 lg:col-4", children: _jsx(Card, { title: "J\u00E4hrliche Ersparnisse", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-500 mb-2", children: formatCurrency(annualSavings) }), _jsx("p", { className: "text-sm text-gray-600", children: "Gesch\u00E4tzte Ersparnis pro Jahr" }), _jsx(Divider, {}), _jsx("div", { className: "text-lg font-semibold mb-1", children: formatCurrency(einspeiseverguetung) }), _jsx("p", { className: "text-xs text-gray-500", children: "Einspeiseverg\u00FCtung" })] }) }) })] }) }), showCharts && (_jsx(TabPanel, { header: "\uD83D\uDCC8 Diagramme", leftIcon: "pi pi-chart-line", children: _jsxs("div", { className: "grid", children: [amortizationData && (_jsx("div", { className: "col-12", children: _jsx(ChartContainer, { chartType: "Amortisationsrechnung", chartData: amortizationData, title: "\uD83D\uDCB9 Cashflow \u00FCber 25 Jahre", height: 300 }) })), _jsx("div", { className: "col-12 md:col-6", children: _jsx(ChartContainer, { chartType: "ROI Verteilung", chartData: roiData, title: "\uD83E\uDD67 Ertragsverteilung", height: 250 }) }), productionData && (_jsx("div", { className: "col-12 md:col-6", children: _jsx(ChartContainer, { chartType: "Monatsproduktion", chartData: productionData, title: "\uD83D\uDCCA Monatliche Energieproduktion", height: 250 }) }))] }) })), _jsx(TabPanel, { header: "\uD83C\uDF31 Umwelt", leftIcon: "pi pi-globe", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-4", children: _jsxs(Card, { className: "text-center", children: [_jsx("i", { className: "pi pi-globe text-4xl text-green-500 mb-3" }), _jsxs("h3", { className: "text-green-500", children: [formatNumber(co2Savings / 1000, 2), " t"] }), _jsx("p", { children: "CO\u2082-Einsparung pro Jahr" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs(Card, { className: "text-center", children: [_jsx("i", { className: "pi pi-car text-4xl text-blue-500 mb-3" }), _jsxs("h3", { className: "text-blue-500", children: [formatNumber((co2Savings / 1000) * 25, 1), " t"] }), _jsx("p", { children: "CO\u2082-Einsparung \u00FCber 25 Jahre" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs(Card, { className: "text-center", children: [_jsx("i", { className: "pi pi-heart text-4xl text-red-500 mb-3" }), _jsx("h3", { className: "text-red-500", children: Math.round((co2Savings / 1000) * 0.5) }), _jsx("p", { children: "Entspricht gepflanzten B\u00E4umen" })] }) })] }) })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { label: "PDF erstellen", icon: "pi pi-file-pdf", onClick: () => addNotification({
                            type: 'info',
                            title: 'PDF-Erstellung',
                            message: 'PDF-Generierung wird vorbereitet...'
                        }) }), _jsx(Button, { label: "Daten exportieren", icon: "pi pi-download", outlined: true, onClick: () => addNotification({
                            type: 'info',
                            title: 'Export',
                            message: 'Datenexport wird vorbereitet...'
                        }) })] })] }));
};
export default CalculationResultsDisplay;
