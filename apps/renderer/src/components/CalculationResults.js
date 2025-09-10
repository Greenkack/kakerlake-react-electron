import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { Knob } from 'primereact/knob';
import LivePricingComponent from './LivePricing';
import './CalculationResults.css';
const CalculationResultsComponent = ({ results, isLoading = false, onRecalculate, showLivePricing = true }) => {
    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };
    // Format number with German locale
    const formatNumber = (value, decimals = 0) => {
        return new Intl.NumberFormat('de-DE', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals
        }).format(value);
    };
    // Format percentage
    const formatPercent = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'percent',
            maximumFractionDigits: 1
        }).format(value / 100);
    };
    // Get ROI severity for color coding
    const getROISeverity = (roi) => {
        if (roi >= 8)
            return 'success';
        if (roi >= 5)
            return 'warning';
        return 'danger';
    };
    // Get amortization severity
    const getAmortizationSeverity = (years) => {
        if (years <= 10)
            return 'success';
        if (years <= 15)
            return 'warning';
        return 'danger';
    };
    // Prepare chart data
    const monthlyChartData = {
        labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'PV-Erzeugung (kWh)',
                data: results.monthly_production_data,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true
            },
            {
                label: 'Verbrauch (kWh)',
                data: results.monthly_consumption_data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true
            },
            {
                label: 'Eigenverbrauch (kWh)',
                data: results.monthly_self_consumption_data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }
        ]
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatNumber(value) + ' kWh';
                    }
                }
            }
        }
    };
    // Cost breakdown data for table
    const costBreakdownData = [
        { category: 'Module', cost: results.cost_breakdown.modules_cost },
        { category: 'Wechselrichter', cost: results.cost_breakdown.inverters_cost },
        { category: 'Batteriespeicher', cost: results.cost_breakdown.batteries_cost },
        { category: 'Zusatzkomponenten', cost: results.cost_breakdown.additional_components_cost },
        { category: 'Installation', cost: results.cost_breakdown.installation_cost },
        { category: 'Planung', cost: results.cost_breakdown.planning_cost }
    ].filter(item => item.cost > 0);
    if (isLoading) {
        return (_jsx(Card, { title: "Berechnungen laufen...", className: "mb-4", children: _jsxs("div", { className: "text-center p-4", children: [_jsx(ProgressBar, { mode: "indeterminate", className: "mb-3" }), _jsx("p", { children: "PV-Anlagen werden berechnet..." })] }) }));
    }
    return (_jsxs("div", { className: "calculation-results", children: [_jsx(Card, { title: "\uD83C\uDFAF Wichtigste Kennzahlen", className: "mb-4", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-3", children: _jsxs("div", { className: "text-center", children: [_jsx(Knob, { value: results.self_supply_rate_percent, min: 0, max: 100, size: 120, readOnly: true, valueTemplate: '{value}%', valueColor: "#4CAF50" }), _jsx("h4", { className: "mt-2 mb-1", children: "Eigenverbrauch" }), _jsx("p", { className: "text-sm text-500", children: "Anteil selbst genutzter Strom" })] }) }), _jsx("div", { className: "col-12 md:col-3", children: _jsxs("div", { className: "text-center", children: [_jsx(Knob, { value: results.autarky_rate_percent, min: 0, max: 100, size: 120, readOnly: true, valueTemplate: '{value}%', valueColor: "#FF9800" }), _jsx("h4", { className: "mt-2 mb-1", children: "Autarkiegrad" }), _jsx("p", { className: "text-sm text-500", children: "Unabh\u00E4ngigkeit vom Netz" })] }) }), _jsx("div", { className: "col-12 md:col-3", children: _jsxs("div", { className: "text-center p-3 border-round surface-card", children: [_jsxs("h3", { className: "text-primary m-0", children: [formatNumber(results.amortization_time_years, 1), " Jahre"] }), _jsx("h4", { className: "mt-2 mb-1", children: "Amortisation" }), _jsx(Tag, { severity: getAmortizationSeverity(results.amortization_time_years), value: results.amortization_time_years <= 12 ? 'Sehr gut' : results.amortization_time_years <= 18 ? 'Gut' : 'Akzeptabel' })] }) }), _jsx("div", { className: "col-12 md:col-3", children: _jsxs("div", { className: "text-center p-3 border-round surface-card", children: [_jsx("h3", { className: "text-green-500 m-0", children: formatPercent(results.simple_roi_percent) }), _jsx("h4", { className: "mt-2 mb-1", children: "Rendite (ROI)" }), _jsx(Tag, { severity: getROISeverity(results.simple_roi_percent), value: results.simple_roi_percent >= 8 ? 'Sehr gut' : results.simple_roi_percent >= 5 ? 'Gut' : 'Niedrig' })] }) })] }) }), _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Card, { title: "\u26A1 Anlagen-Overview", className: "mb-4 h-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [_jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Anlagenleistung:" }), _jsx(Badge, { value: `${formatNumber(results.anlage_kwp, 2)} kWp`, severity: "info", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Module gesamt:" }), _jsx(Badge, { value: formatNumber(results.module_count_total), severity: "info", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Jahresertrag:" }), _jsx(Badge, { value: `${formatNumber(results.annual_pv_production_kwh)} kWh`, severity: "success", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Spez. Ertrag:" }), _jsx(Badge, { value: `${formatNumber(results.specific_yield_kwh_per_kwp)} kWh/kWp`, severity: "success", size: "large" })] }), results.storage_capacity_kwh && (_jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Speicherkapazit\u00E4t:" }), _jsx(Badge, { value: `${formatNumber(results.storage_capacity_kwh, 1)} kWh`, severity: "warning", size: "large" })] }))] }) }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Card, { title: "\uD83D\uDCB0 Investition & Kosten", className: "mb-4 h-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [_jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsx("span", { children: "Gesamtinvestition (netto):" }), _jsx("h4", { className: "m-0 text-primary", children: formatCurrency(results.total_investment_netto) })] }), _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsx("span", { children: "Inkl. MwSt. (19%):" }), _jsx("h4", { className: "m-0", children: formatCurrency(results.total_investment_brutto) })] }), _jsx(Divider, {}), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "J\u00E4hrlicher Nutzen:" }), _jsx(Badge, { value: formatCurrency(results.annual_financial_benefit_year1), severity: "success", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Kapitalwert (NPV):" }), _jsx(Badge, { value: formatCurrency(results.npv_value), severity: results.npv_value > 0 ? 'success' : 'danger', size: "large" })] })] }) }) })] }), _jsx(Card, { title: "\uD83D\uDCCA Kostenaufschl\u00FCsselung", className: "mb-4", children: _jsxs(DataTable, { value: costBreakdownData, responsiveLayout: "scroll", children: [_jsx(Column, { field: "category", header: "Kategorie" }), _jsx(Column, { field: "cost", header: "Kosten (netto)", body: (rowData) => formatCurrency(rowData.cost), className: "text-right" }), _jsx(Column, { field: "cost", header: "Anteil", body: (rowData) => formatPercent((rowData.cost / results.total_investment_netto) * 100), className: "text-right" })] }) }), _jsx(Card, { title: "\uD83D\uDCC8 Monatsertrag & Verbrauch", className: "mb-4", children: _jsx("div", { className: "chart-container", children: _jsx(Chart, { type: "line", data: monthlyChartData, options: chartOptions, className: "h-full" }) }) }), _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Card, { title: "\uD83C\uDF31 Umwelt-Impact", className: "mb-4 h-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [_jsxs("div", { className: "text-center", children: [_jsxs("h3", { className: "text-green-500 m-0", children: [formatNumber(results.annual_co2_savings_kg), " kg CO\u2082"] }), _jsx("p", { className: "text-sm text-500 mb-3", children: "J\u00E4hrliche CO\u2082-Einsparung" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("h4", { className: "text-green-600 m-0", children: [formatNumber(results.co2_savings_25_years_kg / 1000, 1), " Tonnen CO\u2082"] }), _jsx("p", { className: "text-sm text-500", children: "25-Jahres-Einsparung" })] })] }) }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Card, { title: "\u26A1 Energie & Einspeiseverg\u00FCtung", className: "mb-4 h-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [_jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Einspeiseverg\u00FCtung:" }), _jsx(Badge, { value: `${formatNumber(results.einspeiseverguetung_euro_per_kwh * 100, 2)} ct/kWh`, severity: "info", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Stromkostenersparnis Jahr 1:" }), _jsx(Badge, { value: formatCurrency(results.stromkostenersparnis_year1), severity: "success", size: "large" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Einspeiseerl\u00F6se Jahr 1:" }), _jsx(Badge, { value: formatCurrency(results.feed_in_revenue_year1), severity: "warning", size: "large" })] })] }) }) })] }), (results.calculation_warnings?.length || results.calculation_errors?.length) && (_jsxs(Card, { title: "\u26A0\uFE0F Hinweise & Warnungen", className: "mb-4", children: [results.calculation_errors?.map((error, index) => (_jsxs("div", { className: "p-3 mb-2 border-round bg-red-50 border-left-3 border-red-500", children: [_jsx("i", { className: "pi pi-times-circle text-red-500 mr-2" }), _jsx("span", { className: "text-red-700", children: error })] }, index))), results.calculation_warnings?.map((warning, index) => (_jsxs("div", { className: "p-3 mb-2 border-round bg-yellow-50 border-left-3 border-yellow-500", children: [_jsx("i", { className: "pi pi-exclamation-triangle text-yellow-600 mr-2" }), _jsx("span", { className: "text-yellow-800", children: warning })] }, index)))] })), showLivePricing && (_jsx(LivePricingComponent, { baseResults: results, onPricingUpdate: (newPricing) => {
                    console.log('Live pricing update:', newPricing);
                } }))] }));
};
export default CalculationResultsComponent;
