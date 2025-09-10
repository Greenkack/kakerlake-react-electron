// apps/renderer/src/components/CalculationDashboard.tsx
// Quick overview dashboard for calculation status and actions

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';

interface QuickEstimate {
  anlage_kwp: number;
  annual_pv_production_kwh: number;
  total_investment_netto: number;
  estimated_savings_year1: number;
  amortization_estimate_years: number;
  is_quick_estimate: boolean;
}

interface CalculationDashboardProps {
  moduleCount?: number;
  moduleWatts?: number;
  annualConsumption?: number;
  onStartFullCalculation?: () => void;
  isCalculating?: boolean;
}

const CalculationDashboardComponent: React.FC<CalculationDashboardProps> = ({
  moduleCount = 0,
  moduleWatts = 440,
  annualConsumption = 4000,
  onStartFullCalculation,
  isCalculating = false
}) => {
  const [quickEstimate, setQuickEstimate] = useState<QuickEstimate | null>(null);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Format number with German locale
  const formatNumber = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat('de-DE', { 
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    }).format(value);
  };

  // Calculate quick estimate
  const calculateQuickEstimate = async () => {
    if (moduleCount === 0) return;

    setIsLoadingEstimate(true);
    try {
      const basicParams = {
        modules_kwp: (moduleCount * moduleWatts) / 1000,
        annual_consumption_kwh: annualConsumption
      };

      const calculationAPI = (window as any).calculationAPI;
      if (calculationAPI) {
        const result = await calculationAPI.quickEstimate(basicParams);
        if (result.success) {
          setQuickEstimate(result.results);
        }
      }
    } catch (error) {
      console.error('Quick estimate error:', error);
    } finally {
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

  return (
    <div className="calculation-dashboard">
      {/* System Status Overview */}
      <Card title="🎯 System-Status" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-8">
            <div className="mb-3">
              <div className="flex justify-content-between align-items-center mb-2">
                <span className="font-medium">Konfiguration vollständig</span>
                <Badge value={`${completedChecks}/${checks.length}`} severity={completenessPercent >= 75 ? 'success' : 'warning'} />
              </div>
              <ProgressBar value={completenessPercent} className="mb-2" />
            </div>

            <div className="grid gap-2">
              {checks.map((check, index) => (
                <div key={index} className="col-6 md:col-3">
                  <div className="flex align-items-center gap-2 p-2 border-round surface-card">
                    <i className={`pi ${check.completed ? 'pi-check-circle text-green-500' : 'pi-circle text-300'}`}></i>
                    <span className={`text-sm ${check.completed ? 'text-900' : 'text-500'}`}>{check.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 md:col-4">
            <Panel header="Aktuelle Konfiguration" className="h-full">
              <div className="flex flex-column gap-2">
                <div className="flex justify-content-between">
                  <span>Module:</span>
                  <Chip label={`${moduleCount} x ${moduleWatts}Wp`} className="p-chip-outlined" />
                </div>
                <div className="flex justify-content-between">
                  <span>Gesamtleistung:</span>
                  <Chip label={`${formatNumber((moduleCount * moduleWatts) / 1000, 2)} kWp`} />
                </div>
                <div className="flex justify-content-between">
                  <span>Jahresverbrauch:</span>
                  <Chip label={`${formatNumber(annualConsumption)} kWh`} className="p-chip-outlined" />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </Card>

      {/* Quick Estimate Results */}
      {quickEstimate && (
        <Card title="⚡ Schnelle Übersicht" subTitle="Ungefähre Werte zur Orientierung" className="mb-4">
          <DataTable value={overviewData} responsiveLayout="scroll">
            <Column 
              field="icon" 
              header=""
              body={(rowData) => <span className="text-xl">{rowData.icon}</span>}
              style={{ width: '60px' }}
            />
            <Column field="metric" header="Kennzahl" className="font-medium" />
            <Column field="value" header="Wert" className="text-right font-bold" />
          </DataTable>

          <div className="flex align-items-center gap-2 mt-3 p-3 bg-blue-50 border-round">
            <i className="pi pi-info-circle text-blue-600"></i>
            <div className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Dies sind Richtwerte. Für genaue Berechnungen mit PVGIS-Wetterdaten, 
              Preismatrizen und 25-Jahres-Simulation starten Sie die detaillierte Berechnung.
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoadingEstimate && (
        <Card title="🔄 Berechnung läuft..." className="mb-4">
          <div className="text-center p-4">
            <ProgressBar mode="indeterminate" className="mb-3" />
            <p className="text-600">Schnelle Schätzung wird berechnet...</p>
          </div>
        </Card>
      )}

      {/* Action Panel */}
      <Card>
        <div className="grid">
          <div className="col-12 md:col-8">
            <h3 className="mt-0 mb-2">🚀 Nächste Schritte</h3>
            <p className="text-600 mb-0">
              Ihre Basiskonfiguration ist {completenessPercent >= 75 ? 'bereit' : 'noch nicht vollständig'}. 
              {completenessPercent >= 75 
                ? ' Starten Sie die detaillierte Berechnung für genaue Ergebnisse.' 
                : ' Vervollständigen Sie die Konfiguration und starten Sie dann die Berechnung.'}
            </p>
          </div>
          <div className="col-12 md:col-4 flex align-items-center justify-content-end">
            <Button 
              label={isCalculating ? "Berechnung läuft..." : "Detaillierte Berechnung starten"}
              icon={isCalculating ? "pi pi-spin pi-spinner" : "pi pi-calculator"}
              size="large"
              severity="success"
              onClick={onStartFullCalculation}
              loading={isCalculating}
              disabled={isCalculating || completenessPercent < 50}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalculationDashboardComponent;
