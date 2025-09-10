import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/renderer/src/routes/ComponentsDemo.tsx
// Demo-Seite für ChartContainer und LivePricingSidebar
import { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';
import ChartContainer, { createAmortizationChart, createROIChart, createEnergyProductionChart } from '../components/ChartContainer';
import LivePricingSidebar from '../components/LivePricingSidebar';
import CalculationResultsDisplay from '../components/CalculationResultsDisplay';
import { useAppContext, usePricing } from '../context/AppContext';
const ComponentsDemo = () => {
    const { state, dispatch } = useAppContext();
    const { updatePricing } = usePricing();
    // Sample data for demonstrations
    useEffect(() => {
        // Simuliere Calculation Results
        dispatch({
            type: 'SET_CALCULATION_RESULTS',
            payload: {
                total_investment_netto: 25000,
                total_investment_brutto: 29750,
                annual_pv_production_kwh: 8500,
                annual_savings: 2100,
                payback_years: 11.9,
                roi_percent: 8.4,
                co2_savings_annual: 3400,
                monthly_production: [420, 580, 750, 920, 1050, 1100, 1080, 950, 780, 620, 450, 380],
                yearly_cashflow: [-25000, -22900, -20700, -18400, -16000, -13500, -10900, -8200, -5400, -2500, 400, 3400]
            }
        });
        // Setze Basispreis für Pricing
        updatePricing({ baseCost: 25000 });
    }, [dispatch, updatePricing]);
    // Chart-Daten generieren
    const amortizationData = createAmortizationChart([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [-25000, -22900, -20700, -18400, -16000, -13500, -10900, -8200, -5400, -2500, 400, 3400, 6900]);
    const roiData = createROIChart(['Eigenverbrauch', 'Einspeisung', 'Förderungen', 'Wartung'], [65, 25, 7, 3]);
    const productionData = createEnergyProductionChart(['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], [420, 580, 750, 920, 1050, 1100, 1080, 950, 780, 620, 450, 380]);
    return (_jsxs("div", { className: "components-demo p-4", children: [_jsxs("div", { className: "demo-header mb-4", children: [_jsxs("h1", { className: "text-3xl font-bold text-primary mb-2", children: [_jsx("i", { className: "pi pi-star mr-3" }), "Neue Komponenten Demo"] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Demonstration der integrierten ChartContainer, AppContext und LivePricingSidebar Komponenten" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { value: "ChartContainer.tsx", severity: "success" }), _jsx(Badge, { value: "AppContext.tsx", severity: "info" }), _jsx(Badge, { value: "LivePricingSidebar.tsx", severity: "warning" }), _jsx(Badge, { value: "CalculationResultsDisplay.tsx", severity: "danger" })] })] }), _jsxs(Splitter, { style: { height: '600px' }, className: "mb-4", children: [_jsx(SplitterPanel, { size: 75, minSize: 60, children: _jsxs(TabView, { children: [_jsx(TabPanel, { header: "\uD83D\uDCCA Charts Demo", leftIcon: "pi pi-chart-line", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12", children: _jsx(ChartContainer, { chartType: "Amortisationsrechnung", chartData: amortizationData, title: "\uD83D\uDCC8 Cashflow \u00FCber 12 Jahre", height: 300 }) }), _jsx("div", { className: "col-6", children: _jsx(ChartContainer, { chartType: "ROI Verteilung", chartData: roiData, title: "\uD83E\uDD67 Ertragsaufteilung", height: 250 }) }), _jsx("div", { className: "col-6", children: _jsx(ChartContainer, { chartType: "Monatsproduktion", chartData: productionData, title: "\uD83D\uDCCA J\u00E4hrliche Energieproduktion", height: 250 }) })] }) }), _jsx(TabPanel, { header: "\uD83C\uDF9B\uFE0F Context Demo", leftIcon: "pi pi-cog", children: _jsx(Card, { title: "AppContext State \u00DCbersicht", children: _jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-6", children: [_jsx("h4", { children: "\uD83D\uDCCB Projekt Daten" }), _jsx("pre", { className: "bg-gray-100 p-3 border-round text-sm", children: JSON.stringify(state.projectData, null, 2) })] }), _jsxs("div", { className: "col-6", children: [_jsx("h4", { children: "\uD83D\uDCB0 Pricing State" }), _jsx("pre", { className: "bg-gray-100 p-3 border-round text-sm", children: JSON.stringify(state.pricing, null, 2) })] }), _jsxs("div", { className: "col-12", children: [_jsx("h4", { children: "\uD83D\uDCCA Calculation Results" }), _jsx("pre", { className: "bg-gray-100 p-3 border-round text-sm max-h-20rem overflow-auto", children: JSON.stringify(state.calculationResults, null, 2) })] })] }) }) }), _jsx(TabPanel, { header: "\uFFFD Results Display", leftIcon: "pi pi-chart-pie", children: _jsx(CalculationResultsDisplay, { results: {
                                            anlage_kwp: 9.2,
                                            total_investment_netto: 13800,
                                            total_investment_brutto: 16422,
                                            annual_pv_production_kwh: 9200,
                                            annual_savings: 2850,
                                            payback_years: 12.5,
                                            roi_percent: 8.2,
                                            co2_savings_annual: 4600,
                                            einspeiseverguetung_annual: 754,
                                            eigenverbrauch_percent: 65,
                                            autarkie_grad: 72,
                                            base_matrix_price_netto: 13800,
                                            monthly_production: [420, 580, 750, 920, 1050, 1100, 1080, 950, 780, 620, 450, 380]
                                        }, showCharts: true, compactMode: false }) }), _jsx(TabPanel, { header: "\uFFFD\uD83D\uDD27 Integration Test", leftIcon: "pi pi-wrench", children: _jsxs(Card, { title: "Komponenten Integration Test", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h4", { children: "\uD83E\uDDEA Test Actions" }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx(Button, { label: "Projekt Daten setzen", icon: "pi pi-plus", onClick: () => dispatch({
                                                                    type: 'SET_PROJECT_DATA',
                                                                    payload: {
                                                                        moduleQuantity: 20,
                                                                        systemPower: 8.0,
                                                                        customerName: 'Max Mustermann',
                                                                        location: 'München'
                                                                    }
                                                                }), size: "small" }), _jsx(Button, { label: "Neue Berechnung", icon: "pi pi-refresh", onClick: () => dispatch({
                                                                    type: 'SET_CALCULATION_RESULTS',
                                                                    payload: {
                                                                        total_investment_netto: Math.floor(Math.random() * 50000) + 20000,
                                                                        annual_pv_production_kwh: Math.floor(Math.random() * 5000) + 7000,
                                                                        payback_years: Math.round((Math.random() * 10 + 8) * 10) / 10
                                                                    }
                                                                }), severity: "secondary", size: "small" }), _jsx(Button, { label: "State zur\u00FCcksetzen", icon: "pi pi-trash", onClick: () => dispatch({ type: 'RESET_STATE' }), severity: "danger", size: "small" })] })] }), _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-6", children: _jsx(Panel, { header: "\uD83D\uDCCA Live Chart Update", children: _jsx(ChartContainer, { chartType: "Live Demo Chart", chartData: {
                                                                    type: 'bar',
                                                                    data: {
                                                                        labels: ['Investition', 'Ertrag/Jahr', 'Amortisation'],
                                                                        datasets: [{
                                                                                label: 'Werte',
                                                                                data: [
                                                                                    state.calculationResults?.total_investment_netto || 0,
                                                                                    state.calculationResults?.annual_pv_production_kwh || 0,
                                                                                    (state.calculationResults?.payback_years || 0) * 1000
                                                                                ],
                                                                                backgroundColor: ['#dc3545', '#28a745', '#007bff']
                                                                            }]
                                                                    }
                                                                }, height: 200, showCard: false }) }) }), _jsx("div", { className: "col-6", children: _jsx(Panel, { header: "\uD83D\uDCB0 Current Pricing", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary mb-2", children: new Intl.NumberFormat('de-DE', {
                                                                            style: 'currency',
                                                                            currency: 'EUR'
                                                                        }).format(state.pricing.finalPrice) }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Basis: ", state.pricing.baseCost.toLocaleString('de-DE'), " \u20AC"] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Rabatt: ", state.pricing.discountPercent, "% | Aufschlag: ", state.pricing.surchargePercent, "%"] })] }) }) })] })] }) })] }) }), _jsx(SplitterPanel, { size: 25, minSize: 20, children: _jsx("div", { className: "p-3", children: _jsx(LivePricingSidebar, { showTitle: true, compact: false }) }) })] }), _jsx(Card, { title: "\u2705 Integration Status", className: "mt-4", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-4", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-check-circle text-green-500 text-4xl mb-2" }), _jsx("h4", { children: "ChartContainer" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["PrimeReact Chart.js Integration", _jsx("br", {}), "Responsive & Template-basiert"] })] }) }), _jsx("div", { className: "col-4", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-check-circle text-green-500 text-4xl mb-2" }), _jsx("h4", { children: "AppContext" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Globales State Management", _jsx("br", {}), "useReducer & Custom Hooks"] })] }) }), _jsx("div", { className: "col-4", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-check-circle text-green-500 text-4xl mb-2" }), _jsx("h4", { children: "LivePricingSidebar" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Context-integrierte Sidebar", _jsx("br", {}), "Live-Preisberechnung"] })] }) })] }) })] }));
};
export default ComponentsDemo;
