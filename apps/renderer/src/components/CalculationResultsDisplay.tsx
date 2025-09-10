// apps/renderer/src/components/CalculationResultsDisplay.tsx
// Umfassende Ergebnisanzeige für PV-Berechnungen mit TypeScript-Sicherheit

import React, { FC, useState } from 'react';
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
import ChartContainer, { 
  createAmortizationChart, 
  createROIChart, 
  createEnergyProductionChart 
} from './ChartContainer';
import { useCalculationResults, useNotifications } from '../context/AppContext';

export interface CalculationResults {
  anlage_kwp: number;
  total_investment_netto: number;
  total_investment_brutto: number;
  annual_pv_production_kwh: number;
  annual_savings: number;
  payback_years: number;
  roi_percent: number;
  co2_savings_annual: number;
  einspeiseverguetung_annual: number;
  eigenverbrauch_percent: number;
  autarkie_grad: number;
  base_matrix_price_netto: number;
  monthly_production?: number[];
  yearly_cashflow?: number[];
  cost_breakdown?: any[];
  [key: string]: any;
}

// Hilfsfunktion für sichere Zahlenwerte
const safeNumber = (value: number | undefined, fallback: number = 0): number => {
  return value !== undefined && !isNaN(value) ? value : fallback;
};

interface CalculationResultsDisplayProps {
  results?: CalculationResults;
  showCharts?: boolean;
  compactMode?: boolean;
}

export const CalculationResultsDisplay: FC<CalculationResultsDisplayProps> = ({
  results: propResults,
  showCharts = true,
  compactMode = false
}) => {
  const { results: contextResults } = useCalculationResults();
  const { addNotification } = useNotifications();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Verwende Props oder Context Results
  const results = propResults || contextResults;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getRoiSeverity = (roi: number): "success" | "info" | "warning" | "danger" => {
    if (roi >= 8) return "success";
    if (roi >= 5) return "info"; 
    if (roi >= 3) return "warning";
    return "danger";
  };

  const getPaybackSeverity = (years: number): "success" | "info" | "warning" | "danger" => {
    if (years <= 10) return "success";
    if (years <= 15) return "info";
    if (years <= 20) return "warning";
    return "danger";
  };

  if (!results) {
    return (
      <Card title="📊 Berechnungsergebnisse" className="calculation-results-placeholder">
        <div className="text-center p-4">
          <i className="pi pi-info-circle text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-600">Keine Berechnungsergebnisse verfügbar</p>
          <p className="text-sm text-gray-500">
            Führen Sie eine Berechnung durch, um die Ergebnisse hier zu sehen.
          </p>
        </div>
      </Card>
    );
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
    ? createAmortizationChart(
        Array.from({length: results.yearly_cashflow.length}, (_, i) => i),
        results.yearly_cashflow
      )
    : null;

  const productionData = results.monthly_production?.length
    ? createEnergyProductionChart(
        ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        results.monthly_production
      )
    : null;

  const roiData = createROIChart(
    ['Eigenverbrauch', 'Einspeisung', 'Steuervorteile', 'Wartung'],
    [eigenverbrauchPercent, 100 - eigenverbrauchPercent, 5, 3]
  );

  if (compactMode) {
    return (
      <div className="calculation-results-compact grid">
        <div className="col-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(anlageKwp)} kWp</div>
            <div className="text-sm text-gray-600">Anlagenleistung</div>
          </Card>
        </div>
        <div className="col-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalInvestmentNetto)}</div>
            <div className="text-sm text-gray-600">Investition (netto)</div>
          </Card>
        </div>
        <div className="col-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-500">{formatNumber(paybackYears)} Jahre</div>
            <div className="text-sm text-gray-600">Amortisation</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="calculation-results-display">
      {/* Header mit wichtigsten KPIs */}
      <Card title="📊 Berechnungsergebnisse" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <div className="kpi-card text-center p-3">
              <Knob 
                value={anlageKwp} 
                max={20} 
                size={80}
                valueTemplate="{value} kWp"
                className="mb-2"
              />
              <h4 className="m-0 text-primary">Anlagenleistung</h4>
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="kpi-card text-center p-3">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {formatCurrency(totalInvestmentNetto)}
              </div>
              <h4 className="m-0">Investition (netto)</h4>
              <Badge 
                value={`${formatCurrency(totalInvestmentBrutto)} brutto`} 
                severity="info" 
                className="mt-1"
              />
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="kpi-card text-center p-3">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {formatNumber(paybackYears)}
              </div>
              <h4 className="m-0">Amortisation (Jahre)</h4>
              <Tag 
                value={`ROI: ${formatNumber(roiPercent)}%`}
                severity={getRoiSeverity(roiPercent)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="kpi-card text-center p-3">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {formatNumber(annualProduction / 1000)} MWh
              </div>
              <h4 className="m-0">Jahresertrag</h4>
              <Badge 
                value={`${formatNumber(co2Savings / 1000)} t CO₂`} 
                severity="success" 
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Fortschrittsbalken für Autarkie */}
        <Divider />
        <div className="grid">
          <div className="col-6">
            <h5>🏠 Autarkiegrad</h5>
            <ProgressBar 
              value={autarkieGrad} 
              displayValueTemplate={() => `${formatNumber(autarkieGrad)}%`}
              className="mb-2"
            />
          </div>
          <div className="col-6">
            <h5>⚡ Eigenverbrauch</h5>
            <ProgressBar 
              value={eigenverbrauchPercent} 
              displayValueTemplate={() => `${formatNumber(eigenverbrauchPercent)}%`}
              className="mb-2"
            />
          </div>
        </div>
      </Card>

      {/* Detaillierte Tabs */}
      <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
        
        {/* Tab 1: Finanzen */}
        <TabPanel header="💰 Finanzen" leftIcon="pi pi-euro">
          <div className="grid">
            <div className="col-12 lg:col-8">
              <Card title="Kostenaufstellung">
                <DataTable value={costBreakdownData} responsiveLayout="scroll">
                  <Column field="component" header="Komponente" />
                  <Column 
                    field="cost_netto" 
                    header="Netto" 
                    body={(data) => formatCurrency(data.cost_netto)}
                  />
                  <Column 
                    field="cost_brutto" 
                    header="Brutto" 
                    body={(data) => formatCurrency(data.cost_brutto)}
                  />
                </DataTable>
                
                <Divider />
                <div className="flex justify-content-between">
                  <strong>Gesamt (netto):</strong>
                  <strong>{formatCurrency(totalInvestmentNetto)}</strong>
                </div>
                <div className="flex justify-content-between">
                  <strong>Gesamt (brutto):</strong>
                  <strong>{formatCurrency(totalInvestmentBrutto)}</strong>
                </div>
              </Card>
            </div>

            <div className="col-12 lg:col-4">
              <Card title="Jährliche Ersparnisse">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-2">
                    {formatCurrency(annualSavings)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Geschätzte Ersparnis pro Jahr
                  </p>
                  <Divider />
                  <div className="text-lg font-semibold mb-1">
                    {formatCurrency(einspeiseverguetung)}
                  </div>
                  <p className="text-xs text-gray-500">Einspeisevergütung</p>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        {/* Tab 2: Charts */}
        {showCharts && (
          <TabPanel header="📈 Diagramme" leftIcon="pi pi-chart-line">
            <div className="grid">
              {amortizationData && (
                <div className="col-12">
                  <ChartContainer
                    chartType="Amortisationsrechnung"
                    chartData={amortizationData}
                    title="💹 Cashflow über 25 Jahre"
                    height={300}
                  />
                </div>
              )}
              
              <div className="col-12 md:col-6">
                <ChartContainer
                  chartType="ROI Verteilung"
                  chartData={roiData}
                  title="🥧 Ertragsverteilung"
                  height={250}
                />
              </div>
              
              {productionData && (
                <div className="col-12 md:col-6">
                  <ChartContainer
                    chartType="Monatsproduktion"
                    chartData={productionData}
                    title="📊 Monatliche Energieproduktion"
                    height={250}
                  />
                </div>
              )}
            </div>
          </TabPanel>
        )}

        {/* Tab 3: Umwelt */}
        <TabPanel header="🌱 Umwelt" leftIcon="pi pi-globe">
          <div className="grid">
            <div className="col-12 md:col-4">
              <Card className="text-center">
                <i className="pi pi-globe text-4xl text-green-500 mb-3"></i>
                <h3 className="text-green-500">{formatNumber(co2Savings / 1000, 2)} t</h3>
                <p>CO₂-Einsparung pro Jahr</p>
              </Card>
            </div>
            
            <div className="col-12 md:col-4">
              <Card className="text-center">
                <i className="pi pi-car text-4xl text-blue-500 mb-3"></i>
                <h3 className="text-blue-500">{formatNumber((co2Savings / 1000) * 25, 1)} t</h3>
                <p>CO₂-Einsparung über 25 Jahre</p>
              </Card>
            </div>
            
            <div className="col-12 md:col-4">
              <Card className="text-center">
                <i className="pi pi-heart text-4xl text-red-500 mb-3"></i>
                <h3 className="text-red-500">{Math.round((co2Savings / 1000) * 0.5)}</h3>
                <p>Entspricht gepflanzten Bäumen</p>
              </Card>
            </div>
          </div>
        </TabPanel>

      </TabView>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button 
          label="PDF erstellen" 
          icon="pi pi-file-pdf" 
          onClick={() => addNotification({
            type: 'info',
            title: 'PDF-Erstellung',
            message: 'PDF-Generierung wird vorbereitet...'
          })}
        />
        <Button 
          label="Daten exportieren" 
          icon="pi pi-download" 
          outlined
          onClick={() => addNotification({
            type: 'info',
            title: 'Export',
            message: 'Datenexport wird vorbereitet...'
          })}
        />
      </div>
    </div>
  );
};

export default CalculationResultsDisplay;
