import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/renderer/src/components/CalculationDashboard.tsx
// Quick overview dashboard for calculation status and actions
import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Chip } from 'primereact/chip';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
const CalculationDashboardComponent = ({ moduleCount = 0, moduleWatts = 440, annualConsumption = 4000, onStartFullCalculation, isCalculating = false }) => {
    const [quickEstimate, setQuickEstimate] = useState(null);
    const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
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
    // Calculate quick estimate
    const calculateQuickEstimate = async () => {
        if (moduleCount === 0)
            return;
        setIsLoadingEstimate(true);
        try {
            const basicParams = {
                modules_kwp: (moduleCount * moduleWatts) / 1000,
                annual_consumption_kwh: annualConsumption
            };
            const calculationAPI = window.calculationAPI;
            if (calculationAPI) {
                const result = await calculationAPI.quickEstimate(basicParams);
                if (result.success) {
                    setQuickEstimate(result.results);
                }
            }
        }
        catch (error) {
            console.error('Quick estimate error:', error);
        }
        finally {
            setIsLoadingEstimate(false);
        }
    };
    // Update estimate when configuration changes
    useEffect(() => {
        if (moduleCount > 0) {
            const debounceTimer = setTimeout(calculateQuickEstimate, 500);
            return () => clearTimeout(debounceTimer);
        }
    }, [moduleCount, moduleWatts, annualConsumption]);
    // System completeness check
    const getSystemCompleteness = () => {
        const checks = [
            { label: 'Module ausgewählt', completed: moduleCount > 0 },
            { label: 'Anlagenleistung >3kWp', completed: (moduleCount * moduleWatts) >= 3000 },
            { label: 'Verbrauch angegeben', completed: annualConsumption > 0 },
            { label: 'Realistisch dimensioniert', completed: quickEstimate?.anlage_kwp ? quickEstimate.anlage_kwp <= annualConsumption / 800 : true }
        ];
        const completedChecks = checks.filter(c => c.completed).length;
        const completenessPercent = (completedChecks / checks.length) * 100;
        return { checks, completenessPercent, completedChecks };
    };
    const { checks, completenessPercent, completedChecks } = getSystemCompleteness();
    // Quick overview data for table
    const overviewData = quickEstimate ? [
        { metric: 'Anlagenleistung', value: `${formatNumber(quickEstimate.anlage_kwp, 2)} kWp`, icon: '⚡' },
        { metric: 'Jahresertrag', value: `${formatNumber(quickEstimate.annual_pv_production_kwh)} kWh`, icon: '☀️' },
        { metric: 'Investition (ca.)', value: formatCurrency(quickEstimate.total_investment_netto), icon: '💰' },
        { metric: 'Ersparnis Jahr 1 (ca.)', value: formatCurrency(quickEstimate.estimated_savings_year1), icon: '💚' },
        { metric: 'Amortisation (ca.)', value: `${formatNumber(quickEstimate.amortization_estimate_years, 1)} Jahre`, icon: '📊' }
    ] : [];
    return (_jsxs("div", { className: "calculation-dashboard", children: [_jsx(Card, { title: "\uD83C\uDFAF System-Status", className: "mb-4", children: _jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-12 md:col-8", children: [_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "font-medium", children: "Konfiguration vollst\u00E4ndig" }), _jsx(Badge, { value: `${completedChecks}/${checks.length}`, severity: completenessPercent >= 75 ? 'success' : 'warning' })] }), _jsx(ProgressBar, { value: completenessPercent, className: "mb-2" })] }), _jsx("div", { className: "grid gap-2", children: checks.map((check, index) => (_jsx("div", { className: "col-6 md:col-3", children: _jsxs("div", { className: "flex align-items-center gap-2 p-2 border-round surface-card", children: [_jsx("i", { className: `pi ${check.completed ? 'pi-check-circle text-green-500' : 'pi-circle text-300'}` }), _jsx("span", { className: `text-sm ${check.completed ? 'text-900' : 'text-500'}`, children: check.label })] }) }, index))) })] }), _jsx("div", { className: "col-12 md:col-4", children: _jsx(Panel, { header: "Aktuelle Konfiguration", className: "h-full", children: _jsxs("div", { className: "flex flex-column gap-2", children: [_jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Module:" }), _jsx(Chip, { label: `${moduleCount} x ${moduleWatts}Wp`, className: "p-chip-outlined" })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Gesamtleistung:" }), _jsx(Chip, { label: `${formatNumber((moduleCount * moduleWatts) / 1000, 2)} kWp` })] }), _jsxs("div", { className: "flex justify-content-between", children: [_jsx("span", { children: "Jahresverbrauch:" }), _jsx(Chip, { label: `${formatNumber(annualConsumption)} kWh`, className: "p-chip-outlined" })] })] }) }) })] }) }), quickEstimate && (_jsxs(Card, { title: "\u26A1 Schnelle \u00DCbersicht", subTitle: "Ungef\u00E4hre Werte zur Orientierung", className: "mb-4", children: [_jsxs(DataTable, { value: overviewData, responsiveLayout: "scroll", children: [_jsx(Column, { field: "icon", header: "", body: (rowData) => _jsx("span", { className: "text-xl", children: rowData.icon }), style: { width: '60px' } }), _jsx(Column, { field: "metric", header: "Kennzahl", className: "font-medium" }), _jsx(Column, { field: "value", header: "Wert", className: "text-right font-bold" })] }), _jsxs("div", { className: "flex align-items-center gap-2 mt-3 p-3 bg-blue-50 border-round", children: [_jsx("i", { className: "pi pi-info-circle text-blue-600" }), _jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Hinweis:" }), " Dies sind Richtwerte. F\u00FCr genaue Berechnungen mit PVGIS-Wetterdaten, Preismatrizen und 25-Jahres-Simulation starten Sie die detaillierte Berechnung."] })] })] })), isLoadingEstimate && (_jsx(Card, { title: "\uD83D\uDD04 Berechnung l\u00E4uft...", className: "mb-4", children: _jsxs("div", { className: "text-center p-4", children: [_jsx(ProgressBar, { mode: "indeterminate", className: "mb-3" }), _jsx("p", { className: "text-600", children: "Schnelle Sch\u00E4tzung wird berechnet..." })] }) })), _jsx(Card, { children: _jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-12 md:col-8", children: [_jsx("h3", { className: "mt-0 mb-2", children: "\uD83D\uDE80 N\u00E4chste Schritte" }), _jsxs("p", { className: "text-600 mb-0", children: ["Ihre Basiskonfiguration ist ", completenessPercent >= 75 ? 'bereit' : 'noch nicht vollständig', ".", completenessPercent >= 75
                                            ? ' Starten Sie die detaillierte Berechnung für genaue Ergebnisse.'
                                            : ' Vervollständigen Sie die Konfiguration und starten Sie dann die Berechnung.'] })] }), _jsx("div", { className: "col-12 md:col-4 flex align-items-center justify-content-end", children: _jsx(Button, { label: isCalculating ? "Berechnung läuft..." : "Detaillierte Berechnung starten", icon: isCalculating ? "pi pi-spin pi-spinner" : "pi pi-calculator", size: "large", severity: "success", onClick: onStartFullCalculation, loading: isCalculating, disabled: isCalculating || completenessPercent < 50, className: "w-full md:w-auto" }) })] }) })] }));
};
export default CalculationDashboardComponent;
