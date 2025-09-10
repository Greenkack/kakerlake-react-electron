import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDynamicData } from '../lib/dynamicDataSystem';
export const ScenarioCalculation = ({ onScenarioChange }) => {
    const { setData, getData, getAllCategories } = useDynamicData();
    const [scenarios, setScenarios] = useState([]);
    const [activeScenario, setActiveScenario] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationProgress, setCalculationProgress] = useState(0);
    // Basis-Berechnungsregeln für PV-Anlagen
    const [calculationRules] = useState([
        {
            key: 'annual_yield_kwh',
            label: 'Jahresertrag kWh',
            formula: 'pv_power_kWp * specific_yield_kwh_per_kwp',
            dependencies: ['pv_power_kWp', 'specific_yield_kwh_per_kwp'],
            category: 'energy_production',
            priority: 'high'
        },
        {
            key: 'annual_savings_euro',
            label: 'Jährliche Einsparung €',
            formula: 'annual_yield_kwh * electricity_price_per_kwh',
            dependencies: ['annual_yield_kwh', 'electricity_price_per_kwh'],
            category: 'financial',
            priority: 'high'
        },
        {
            key: 'payback_period_years',
            label: 'Amortisationszeit Jahre',
            formula: 'total_investment_euro / annual_savings_euro',
            dependencies: ['total_investment_euro', 'annual_savings_euro'],
            category: 'financial',
            priority: 'high'
        },
        {
            key: 'roi_percentage',
            label: 'ROI Prozent',
            formula: '(annual_savings_euro / total_investment_euro) * 100',
            dependencies: ['annual_savings_euro', 'total_investment_euro'],
            category: 'financial',
            priority: 'high'
        },
        {
            key: 'co2_savings_kg_per_year',
            label: 'CO2-Einsparung kg/Jahr',
            formula: 'annual_yield_kwh * co2_factor_kg_per_kwh',
            dependencies: ['annual_yield_kwh', 'co2_factor_kg_per_kwh'],
            category: 'environmental',
            priority: 'medium'
        },
        {
            key: 'lifetime_savings_euro',
            label: 'Lebenszeitgewinn €',
            formula: '(annual_savings_euro * system_lifetime_years) - total_investment_euro',
            dependencies: ['annual_savings_euro', 'system_lifetime_years', 'total_investment_euro'],
            category: 'financial',
            priority: 'high'
        },
        {
            key: 'monthly_savings_euro',
            label: 'Monatliche Einsparung €',
            formula: 'annual_savings_euro / 12',
            dependencies: ['annual_savings_euro'],
            category: 'financial',
            priority: 'medium'
        },
        {
            key: 'specific_cost_euro_per_kwp',
            label: 'Spezifische Kosten €/kWp',
            formula: 'total_investment_euro / pv_power_kWp',
            dependencies: ['total_investment_euro', 'pv_power_kWp'],
            category: 'financial',
            priority: 'medium'
        }
    ]);
    useEffect(() => {
        loadSavedScenarios();
    }, []);
    const loadSavedScenarios = () => {
        const savedScenarios = localStorage.getItem('scenario_calculations');
        if (savedScenarios) {
            const parsed = JSON.parse(savedScenarios);
            setScenarios(parsed.map((s) => ({
                ...s,
                createdAt: new Date(s.createdAt),
                lastCalculated: s.lastCalculated ? new Date(s.lastCalculated) : undefined
            })));
        }
    };
    const saveScenarios = (newScenarios) => {
        localStorage.setItem('scenario_calculations', JSON.stringify(newScenarios));
        setScenarios(newScenarios);
        if (onScenarioChange) {
            onScenarioChange(newScenarios);
        }
    };
    const createNewScenario = () => {
        const newScenario = {
            id: `scenario_${Date.now()}`,
            name: `Szenario ${scenarios.length + 1}`,
            description: 'Neues Berechnungsszenario',
            enabled: true,
            parameters: getDefaultParameters(),
            results: {},
            createdAt: new Date()
        };
        const updatedScenarios = [...scenarios, newScenario];
        saveScenarios(updatedScenarios);
        setActiveScenario(newScenario.id);
    };
    const getDefaultParameters = () => {
        return {
            pv_power_kWp: 10.0,
            specific_yield_kwh_per_kwp: 950,
            electricity_price_per_kwh: 0.30,
            total_investment_euro: 15000,
            co2_factor_kg_per_kwh: 0.4,
            system_lifetime_years: 25,
            annual_degradation_percent: 0.5,
            maintenance_cost_percent: 1.0,
            electricity_price_increase_percent: 3.0
        };
    };
    const executeCalculation = async (scenario) => {
        setIsCalculating(true);
        setCalculationProgress(0);
        try {
            const results = {};
            const totalRules = calculationRules.length;
            // Basis-Parameter in dynamisches System einfügen
            Object.entries(scenario.parameters).forEach(([key, value]) => {
                setData(key, value, {
                    category: 'scenario_parameters',
                    label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    dataType: typeof value,
                    priority: 'medium',
                    description: `Szenario-Parameter für ${scenario.name}`
                });
            });
            // Berechnungsregeln ausführen
            for (let i = 0; i < calculationRules.length; i++) {
                const rule = calculationRules[i];
                setCalculationProgress(((i + 1) / totalRules) * 100);
                try {
                    const result = calculateRule(rule, scenario.parameters, results);
                    results[rule.key] = result;
                    // Ergebnis in dynamisches System einfügen
                    setData(rule.key, result, {
                        category: `calculated_${rule.category}`,
                        label: rule.label,
                        dataType: typeof result,
                        priority: rule.priority,
                        description: `Berechnetes Ergebnis: ${rule.formula}`
                    });
                    // Kurze Pause für UI-Update
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                catch (error) {
                    console.error(`Fehler bei Berechnung ${rule.key}:`, error);
                    results[rule.key] = null;
                }
            }
            // Erweiterte Berechnungen
            const extendedResults = calculateExtendedMetrics(scenario.parameters, results);
            Object.assign(results, extendedResults);
            // Szenario aktualisieren
            const updatedScenario = {
                ...scenario,
                results,
                lastCalculated: new Date()
            };
            const updatedScenarios = scenarios.map(s => s.id === scenario.id ? updatedScenario : s);
            saveScenarios(updatedScenarios);
            // Szenario-Ergebnisse speichern
            setData(`scenario_${scenario.id}_results`, results, {
                category: 'scenario_results',
                label: `Ergebnisse ${scenario.name}`,
                dataType: 'object',
                priority: 'high',
                description: `Vollständige Berechnungsergebnisse für ${scenario.name}`
            });
        }
        catch (error) {
            console.error('Fehler bei Szenario-Berechnung:', error);
        }
        finally {
            setIsCalculating(false);
            setCalculationProgress(0);
        }
    };
    const calculateRule = (rule, parameters, previousResults) => {
        const context = { ...parameters, ...previousResults };
        // Einfache Formel-Evaluation (sicherheitshalber nur bekannte Operationen)
        const formula = rule.formula;
        try {
            // Variablen durch Werte ersetzen
            let evaluationFormula = formula;
            Object.keys(context).forEach(key => {
                const value = context[key];
                if (typeof value === 'number') {
                    evaluationFormula = evaluationFormula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
                }
            });
            // Sichere Evaluation (nur Grundrechenarten)
            const result = Function(`"use strict"; return (${evaluationFormula})`)();
            return typeof result === 'number' ? Math.round(result * 100) / 100 : result;
        }
        catch (error) {
            console.error(`Formel-Fehler in ${rule.key}:`, error);
            return 0;
        }
    };
    const calculateExtendedMetrics = (parameters, basicResults) => {
        const extended = {};
        try {
            // Cashflow über Lebensdauer
            const cashflow = [];
            for (let year = 1; year <= parameters.system_lifetime_years; year++) {
                const degradationFactor = Math.pow(1 - parameters.annual_degradation_percent / 100, year - 1);
                const priceIncreaseFactor = Math.pow(1 + parameters.electricity_price_increase_percent / 100, year - 1);
                const yearlyYield = basicResults.annual_yield_kwh * degradationFactor;
                const yearlySavings = yearlyYield * parameters.electricity_price_per_kwh * priceIncreaseFactor;
                const maintenanceCost = parameters.total_investment_euro * (parameters.maintenance_cost_percent / 100);
                const netCashflow = yearlySavings - maintenanceCost;
                cashflow.push({
                    year,
                    yield: Math.round(yearlyYield),
                    savings: Math.round(yearlySavings),
                    maintenance: Math.round(maintenanceCost),
                    net: Math.round(netCashflow)
                });
            }
            extended.cashflow_analysis = cashflow;
            // NPV Berechnung (5% Diskontierungssatz)
            const discountRate = 0.05;
            let npv = -parameters.total_investment_euro;
            cashflow.forEach(cf => {
                npv += cf.net / Math.pow(1 + discountRate, cf.year);
            });
            extended.npv_euro = Math.round(npv);
            // IRR Näherung (vereinfacht)
            extended.irr_percent = Math.round(((basicResults.annual_savings_euro / parameters.total_investment_euro) * 100) * 100) / 100;
            // Umwelt-Metriken
            extended.lifetime_co2_savings_kg = Math.round(basicResults.co2_savings_kg_per_year * parameters.system_lifetime_years);
            extended.co2_savings_tons = Math.round(extended.lifetime_co2_savings_kg / 1000 * 100) / 100;
        }
        catch (error) {
            console.error('Fehler bei erweiterten Berechnungen:', error);
        }
        return extended;
    };
    const deleteScenario = (scenarioId) => {
        const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
        saveScenarios(updatedScenarios);
        if (activeScenario === scenarioId) {
            setActiveScenario(null);
        }
    };
    const updateScenarioParameter = (scenarioId, paramKey, value) => {
        const updatedScenarios = scenarios.map(scenario => {
            if (scenario.id === scenarioId) {
                return {
                    ...scenario,
                    parameters: {
                        ...scenario.parameters,
                        [paramKey]: value
                    }
                };
            }
            return scenario;
        });
        saveScenarios(updatedScenarios);
    };
    const formatNumber = (value, decimals = 2) => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };
    return (_jsxs("div", { className: "scenario-calculation p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Szenario-Berechnungen" }), _jsx("p", { className: "text-gray-600", children: "Erstellen und vergleichen Sie verschiedene Berechnungsszenarien f\u00FCr PV-Anlagen." })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800", children: ["Verf\u00FCgbare Szenarien (", scenarios.length, ")"] }), _jsx("button", { onClick: createNewScenario, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Neues Szenario" })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: scenarios.map(scenario => (_jsxs("div", { className: `p-4 border rounded-lg cursor-pointer transition-all ${activeScenario === scenario.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'}`, onClick: () => setActiveScenario(scenario.id), children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: scenario.name }), _jsx("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                deleteScenario(scenario.id);
                                            }, className: "text-red-500 hover:text-red-700 text-sm", children: "\u2715" })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: scenario.description }), Object.keys(scenario.results).length > 0 && (_jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "ROI:" }), _jsxs("span", { className: "font-medium", children: [scenario.results.roi_percentage, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Amortisation:" }), _jsxs("span", { className: "font-medium", children: [scenario.results.payback_period_years, " Jahre"] })] })] })), _jsxs("div", { className: "mt-3 flex justify-between", children: [_jsx("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                executeCalculation(scenario);
                                            }, disabled: isCalculating, className: "px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400", children: "Berechnen" }), _jsx("span", { className: "text-xs text-gray-500", children: scenario.lastCalculated
                                                ? scenario.lastCalculated.toLocaleString('de-DE')
                                                : 'Noch nicht berechnet' })] })] }, scenario.id))) })] }), isCalculating && (_jsxs("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-blue-800 font-medium", children: "Berechnung l\u00E4uft..." }), _jsxs("span", { className: "text-blue-600", children: [Math.round(calculationProgress), "%"] })] }), _jsx("div", { className: "calculation-progress-bar", children: _jsx("div", { className: "calculation-progress-fill", "data-progress": Math.round(calculationProgress / 10) * 10 }) })] })), activeScenario && (_jsx("div", { className: "space-y-6", children: (() => {
                    const scenario = scenarios.find(s => s.id === activeScenario);
                    if (!scenario)
                        return null;
                    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("h4", { className: "text-lg font-medium text-gray-900 mb-4", children: ["Parameter f\u00FCr: ", scenario.name] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Object.entries(scenario.parameters).map(([key, value]) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }), _jsx("input", { type: "number", step: "0.01", value: value, title: `Wert für ${key.replace(/_/g, ' ')}`, onChange: (e) => updateScenarioParameter(scenario.id, key, parseFloat(e.target.value) || 0), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }, key))) })] }), Object.keys(scenario.results).length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("h4", { className: "text-lg font-medium text-gray-900", children: "Berechnungsergebnisse" }) }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "font-medium text-gray-800 border-b pb-1", children: "Finanzielle Kennzahlen" }), ['annual_savings_euro', 'payback_period_years', 'roi_percentage', 'lifetime_savings_euro', 'npv_euro'].map(key => (scenario.results[key] !== undefined && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [calculationRules.find(r => r.key === key)?.label || key, ":"] }), _jsx("span", { className: "font-medium", children: key.includes('euro') ? formatCurrency(scenario.results[key]) :
                                                                            key.includes('percentage') || key.includes('percent') ? `${formatNumber(scenario.results[key])}%` :
                                                                                formatNumber(scenario.results[key]) })] }, key))))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "font-medium text-gray-800 border-b pb-1", children: "Energetische Kennzahlen" }), ['annual_yield_kwh', 'specific_cost_euro_per_kwp'].map(key => (scenario.results[key] !== undefined && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [calculationRules.find(r => r.key === key)?.label || key, ":"] }), _jsxs("span", { className: "font-medium", children: [formatNumber(scenario.results[key]), " ", key.includes('kwh') ? 'kWh' : '€/kWp'] })] }, key))))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "font-medium text-gray-800 border-b pb-1", children: "Umwelt-Kennzahlen" }), ['co2_savings_kg_per_year', 'co2_savings_tons', 'lifetime_co2_savings_kg'].map(key => (scenario.results[key] !== undefined && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), ":"] }), _jsxs("span", { className: "font-medium", children: [formatNumber(scenario.results[key]), " ", key.includes('tons') ? 't' : 'kg'] })] }, key))))] })] }), scenario.results.cashflow_analysis && (_jsxs("div", { className: "mt-6", children: [_jsx("h5", { className: "font-medium text-gray-800 border-b pb-2 mb-4", children: "Cashflow-Analyse (ersten 10 Jahre)" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left", children: "Jahr" }), _jsx("th", { className: "px-3 py-2 text-right", children: "Ertrag kWh" }), _jsx("th", { className: "px-3 py-2 text-right", children: "Einsparung \u20AC" }), _jsx("th", { className: "px-3 py-2 text-right", children: "Wartung \u20AC" }), _jsx("th", { className: "px-3 py-2 text-right", children: "Netto \u20AC" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: scenario.results.cashflow_analysis.slice(0, 10).map((cf) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-3 py-2", children: cf.year }), _jsx("td", { className: "px-3 py-2 text-right", children: formatNumber(cf.yield, 0) }), _jsx("td", { className: "px-3 py-2 text-right", children: formatCurrency(cf.savings) }), _jsx("td", { className: "px-3 py-2 text-right", children: formatCurrency(cf.maintenance) }), _jsx("td", { className: "px-3 py-2 text-right font-medium", children: formatCurrency(cf.net) })] }, cf.year))) })] }) })] }))] })] }))] }));
                })() })), scenarios.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-500 mb-4", children: _jsx("svg", { className: "mx-auto h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Keine Szenarien vorhanden" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Erstellen Sie Ihr erstes Berechnungsszenario, um verschiedene PV-Konfigurationen zu vergleichen." }), _jsx("button", { onClick: createNewScenario, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Erstes Szenario erstellen" })] }))] }));
};
export default ScenarioCalculation;
