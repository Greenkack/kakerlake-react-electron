import React, { useState, useEffect } from 'react';
import { useDynamicData } from '../lib/dynamicDataSystem';

interface ScenarioCalculationProps {
  onScenarioChange?: (scenarios: any[]) => void;
}

interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, any>;
  results: Record<string, any>;
  createdAt: Date;
  lastCalculated?: Date;
}

interface CalculationRule {
  key: string;
  label: string;
  formula: string;
  dependencies: string[];
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export const ScenarioCalculation: React.FC<ScenarioCalculationProps> = ({ onScenarioChange }) => {
  const {
    setData,
    getData,
    getAllCategories
  } = useDynamicData();

  const [scenarios, setScenarios] = useState<ScenarioConfig[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);

  // Basis-Berechnungsregeln für PV-Anlagen
  const [calculationRules] = useState<CalculationRule[]>([
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
      setScenarios(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastCalculated: s.lastCalculated ? new Date(s.lastCalculated) : undefined
      })));
    }
  };

  const saveScenarios = (newScenarios: ScenarioConfig[]) => {
    localStorage.setItem('scenario_calculations', JSON.stringify(newScenarios));
    setScenarios(newScenarios);
    if (onScenarioChange) {
      onScenarioChange(newScenarios);
    }
  };

  const createNewScenario = () => {
    const newScenario: ScenarioConfig = {
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

  const executeCalculation = async (scenario: ScenarioConfig) => {
    setIsCalculating(true);
    setCalculationProgress(0);

    try {
      const results: Record<string, any> = {};
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
        } catch (error) {
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

      const updatedScenarios = scenarios.map(s => 
        s.id === scenario.id ? updatedScenario : s
      );
      saveScenarios(updatedScenarios);

      // Szenario-Ergebnisse speichern
      setData(`scenario_${scenario.id}_results`, results, {
        category: 'scenario_results',
        label: `Ergebnisse ${scenario.name}`,
        dataType: 'object',
        priority: 'high',
        description: `Vollständige Berechnungsergebnisse für ${scenario.name}`
      });

    } catch (error) {
      console.error('Fehler bei Szenario-Berechnung:', error);
    } finally {
      setIsCalculating(false);
      setCalculationProgress(0);
    }
  };

  const calculateRule = (rule: CalculationRule, parameters: Record<string, any>, previousResults: Record<string, any>) => {
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
    } catch (error) {
      console.error(`Formel-Fehler in ${rule.key}:`, error);
      return 0;
    }
  };

  const calculateExtendedMetrics = (parameters: Record<string, any>, basicResults: Record<string, any>) => {
    const extended: Record<string, any> = {};

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

    } catch (error) {
      console.error('Fehler bei erweiterten Berechnungen:', error);
    }

    return extended;
  };

  const deleteScenario = (scenarioId: string) => {
    const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
    saveScenarios(updatedScenarios);
    if (activeScenario === scenarioId) {
      setActiveScenario(null);
    }
  };

  const updateScenarioParameter = (scenarioId: string, paramKey: string, value: any) => {
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

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="scenario-calculation p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Szenario-Berechnungen
        </h2>
        <p className="text-gray-600">
          Erstellen und vergleichen Sie verschiedene Berechnungsszenarien für PV-Anlagen.
        </p>
      </div>

      {/* Szenario-Übersicht */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Verfügbare Szenarien ({scenarios.length})
          </h3>
          <button
            onClick={createNewScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Neues Szenario
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                activeScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveScenario(scenario.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScenario(scenario.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              
              {Object.keys(scenario.results).length > 0 && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ROI:</span>
                    <span className="font-medium">
                      {scenario.results.roi_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amortisation:</span>
                    <span className="font-medium">
                      {scenario.results.payback_period_years} Jahre
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-3 flex justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    executeCalculation(scenario);
                  }}
                  disabled={isCalculating}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Berechnen
                </button>
                <span className="text-xs text-gray-500">
                  {scenario.lastCalculated
                    ? scenario.lastCalculated.toLocaleString('de-DE')
                    : 'Noch nicht berechnet'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fortschrittsanzeige */}
      {isCalculating && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">Berechnung läuft...</span>
            <span className="text-blue-600">{Math.round(calculationProgress)}%</span>
          </div>
          <div className="calculation-progress-bar">
            <div 
              className="calculation-progress-fill"
              data-progress={Math.round(calculationProgress / 10) * 10}
            ></div>
          </div>
        </div>
      )}

      {/* Aktives Szenario Details */}
      {activeScenario && (
        <div className="space-y-6">
          {(() => {
            const scenario = scenarios.find(s => s.id === activeScenario);
            if (!scenario) return null;

            return (
              <>
                {/* Parameter-Eingabe */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Parameter für: {scenario.name}
                  </h4>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(scenario.parameters).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={value}
                          title={`Wert für ${key.replace(/_/g, ' ')}`}
                          onChange={(e) => updateScenarioParameter(scenario.id, key, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Berechnungsergebnisse */}
                {Object.keys(scenario.results).length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900">
                        Berechnungsergebnisse
                      </h4>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Finanzielle Kennzahlen */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-800 border-b pb-1">Finanzielle Kennzahlen</h5>
                          {['annual_savings_euro', 'payback_period_years', 'roi_percentage', 'lifetime_savings_euro', 'npv_euro'].map(key => (
                            scenario.results[key] !== undefined && (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {calculationRules.find(r => r.key === key)?.label || key}:
                                </span>
                                <span className="font-medium">
                                  {key.includes('euro') ? formatCurrency(scenario.results[key]) :
                                   key.includes('percentage') || key.includes('percent') ? `${formatNumber(scenario.results[key])}%` :
                                   formatNumber(scenario.results[key])}
                                </span>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Energetische Kennzahlen */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-800 border-b pb-1">Energetische Kennzahlen</h5>
                          {['annual_yield_kwh', 'specific_cost_euro_per_kwp'].map(key => (
                            scenario.results[key] !== undefined && (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {calculationRules.find(r => r.key === key)?.label || key}:
                                </span>
                                <span className="font-medium">
                                  {formatNumber(scenario.results[key])} {key.includes('kwh') ? 'kWh' : '€/kWp'}
                                </span>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Umwelt-Kennzahlen */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-800 border-b pb-1">Umwelt-Kennzahlen</h5>
                          {['co2_savings_kg_per_year', 'co2_savings_tons', 'lifetime_co2_savings_kg'].map(key => (
                            scenario.results[key] !== undefined && (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                </span>
                                <span className="font-medium">
                                  {formatNumber(scenario.results[key])} {key.includes('tons') ? 't' : 'kg'}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Cashflow-Analyse */}
                      {scenario.results.cashflow_analysis && (
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-800 border-b pb-2 mb-4">
                            Cashflow-Analyse (ersten 10 Jahre)
                          </h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left">Jahr</th>
                                  <th className="px-3 py-2 text-right">Ertrag kWh</th>
                                  <th className="px-3 py-2 text-right">Einsparung €</th>
                                  <th className="px-3 py-2 text-right">Wartung €</th>
                                  <th className="px-3 py-2 text-right">Netto €</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {scenario.results.cashflow_analysis.slice(0, 10).map((cf: any) => (
                                  <tr key={cf.year} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{cf.year}</td>
                                    <td className="px-3 py-2 text-right">{formatNumber(cf.yield, 0)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(cf.savings)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(cf.maintenance)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(cf.net)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {scenarios.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Szenarien vorhanden
          </h3>
          <p className="text-gray-600 mb-4">
            Erstellen Sie Ihr erstes Berechnungsszenario, um verschiedene PV-Konfigurationen zu vergleichen.
          </p>
          <button
            onClick={createNewScenario}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Erstes Szenario erstellen
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenarioCalculation;
