// apps/renderer/src/components/CalculationResults.tsx
// PrimeReact component for displaying calculation results

import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Fieldset } from 'primereact/fieldset';
import { Chart } from 'primereact/chart';
import { Panel } from 'primereact/panel';
import { Knob } from 'primereact/knob';
import LivePricingComponent from './LivePricing';
import './CalculationResults.css';

export interface CalculationResults {
  // Basic System Data
  anlage_kwp: number;
  annual_pv_production_kwh: number;
  module_count_total: number;
  
  // Financial Core Data
  base_matrix_price_netto: number;
  total_additional_costs_netto: number;
  subtotal_netto: number;
  total_investment_netto: number;
  total_investment_brutto: number;
  
  // Performance Metrics
  self_supply_rate_percent: number;
  autarky_rate_percent: number;
  specific_yield_kwh_per_kwp: number;
  
  // Economic Analysis
  annual_financial_benefit_year1: number;
  amortization_time_years: number;
  simple_roi_percent: number;
  npv_value: number;
  
  // Environmental Impact
  annual_co2_savings_kg: number;
  co2_savings_25_years_kg: number;
  
  // Advanced Analysis
  einspeiseverguetung_euro_per_kwh: number;
  stromkostenersparnis_year1: number;
  feed_in_revenue_year1: number;
  
  // Storage Analysis (if applicable)
  storage_capacity_kwh?: number;
  storage_efficiency_percent?: number;
  battery_cycles_per_year?: number;
  
  // Chart Data
  monthly_production_data: number[];
  monthly_consumption_data: number[];
  monthly_self_consumption_data: number[];
  cash_flow_25_years: number[];
  
  // Cost Breakdown
  cost_breakdown: {
    modules_cost: number;
    inverters_cost: number;
    batteries_cost: number;
    additional_components_cost: number;
    installation_cost: number;
    planning_cost: number;
  };
  
  // Error Handling
  calculation_warnings?: string[];
  calculation_errors?: string[];
}

interface CalculationResultsProps {
  results: CalculationResults;
  isLoading?: boolean;
  onRecalculate?: () => void;
  showLivePricing?: boolean;
}

const CalculationResultsComponent: React.FC<CalculationResultsProps> = ({ 
  results, 
  isLoading = false, 
  onRecalculate,
  showLivePricing = true
}) => {
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

  // Format percentage
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'percent',
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  // Get ROI severity for color coding
  const getROISeverity = (roi: number) => {
    if (roi >= 8) return 'success';
    if (roi >= 5) return 'warning';
    return 'danger';
  };

  // Get amortization severity
  const getAmortizationSeverity = (years: number) => {
    if (years <= 10) return 'success';
    if (years <= 15) return 'warning';
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
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
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
    return (
      <Card title="Berechnungen laufen..." className="mb-4">
        <div className="text-center p-4">
          <ProgressBar mode="indeterminate" className="mb-3" />
          <p>PV-Anlagen werden berechnet...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="calculation-results">
      {/* Header with Key Metrics */}
      <Card title="🎯 Wichtigste Kennzahlen" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="text-center">
              <Knob 
                value={results.self_supply_rate_percent} 
                min={0} 
                max={100}
                size={120}
                readOnly
                valueTemplate={'{value}%'}
                valueColor="#4CAF50"
              />
              <h4 className="mt-2 mb-1">Eigenverbrauch</h4>
              <p className="text-sm text-500">Anteil selbst genutzter Strom</p>
            </div>
          </div>
          
          <div className="col-12 md:col-3">
            <div className="text-center">
              <Knob 
                value={results.autarky_rate_percent} 
                min={0} 
                max={100}
                size={120}
                readOnly
                valueTemplate={'{value}%'}
                valueColor="#FF9800"
              />
              <h4 className="mt-2 mb-1">Autarkiegrad</h4>
              <p className="text-sm text-500">Unabhängigkeit vom Netz</p>
            </div>
          </div>
          
          <div className="col-12 md:col-3">
            <div className="text-center p-3 border-round surface-card">
              <h3 className="text-primary m-0">{formatNumber(results.amortization_time_years, 1)} Jahre</h3>
              <h4 className="mt-2 mb-1">Amortisation</h4>
              <Tag 
                severity={getAmortizationSeverity(results.amortization_time_years)}
                value={results.amortization_time_years <= 12 ? 'Sehr gut' : results.amortization_time_years <= 18 ? 'Gut' : 'Akzeptabel'}
              />
            </div>
          </div>
          
          <div className="col-12 md:col-3">
            <div className="text-center p-3 border-round surface-card">
              <h3 className="text-green-500 m-0">{formatPercent(results.simple_roi_percent)}</h3>
              <h4 className="mt-2 mb-1">Rendite (ROI)</h4>
              <Tag 
                severity={getROISeverity(results.simple_roi_percent)}
                value={results.simple_roi_percent >= 8 ? 'Sehr gut' : results.simple_roi_percent >= 5 ? 'Gut' : 'Niedrig'}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* System Overview */}
      <div className="grid">
        <div className="col-12 md:col-6">
          <Card title="⚡ Anlagen-Overview" className="mb-4 h-full">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between">
                <span>Anlagenleistung:</span>
                <Badge value={`${formatNumber(results.anlage_kwp, 2)} kWp`} severity="info" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Module gesamt:</span>
                <Badge value={formatNumber(results.module_count_total)} severity="info" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Jahresertrag:</span>
                <Badge value={`${formatNumber(results.annual_pv_production_kwh)} kWh`} severity="success" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Spez. Ertrag:</span>
                <Badge value={`${formatNumber(results.specific_yield_kwh_per_kwp)} kWh/kWp`} severity="success" size="large" />
              </div>
              {results.storage_capacity_kwh && (
                <div className="flex justify-content-between">
                  <span>Speicherkapazität:</span>
                  <Badge value={`${formatNumber(results.storage_capacity_kwh, 1)} kWh`} severity="warning" size="large" />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="💰 Investition & Kosten" className="mb-4 h-full">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between align-items-center">
                <span>Gesamtinvestition (netto):</span>
                <h4 className="m-0 text-primary">{formatCurrency(results.total_investment_netto)}</h4>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span>Inkl. MwSt. (19%):</span>
                <h4 className="m-0">{formatCurrency(results.total_investment_brutto)}</h4>
              </div>
              <Divider />
              <div className="flex justify-content-between">
                <span>Jährlicher Nutzen:</span>
                <Badge value={formatCurrency(results.annual_financial_benefit_year1)} severity="success" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Kapitalwert (NPV):</span>
                <Badge value={formatCurrency(results.npv_value)} severity={results.npv_value > 0 ? 'success' : 'danger'} size="large" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <Card title="📊 Kostenaufschlüsselung" className="mb-4">
        <DataTable value={costBreakdownData} responsiveLayout="scroll">
          <Column field="category" header="Kategorie" />
          <Column 
            field="cost" 
            header="Kosten (netto)" 
            body={(rowData) => formatCurrency(rowData.cost)}
            className="text-right"
          />
          <Column 
            field="cost" 
            header="Anteil" 
            body={(rowData) => formatPercent((rowData.cost / results.total_investment_netto) * 100)}
            className="text-right"
          />
        </DataTable>
      </Card>

      {/* Monthly Production Chart */}
      <Card title="📈 Monatsertrag & Verbrauch" className="mb-4">
        <div className="chart-container">
          <Chart type="line" data={monthlyChartData} options={chartOptions} className="h-full" />
        </div>
      </Card>

      {/* Environmental Impact */}
      <div className="grid">
        <div className="col-12 md:col-6">
          <Card title="🌱 Umwelt-Impact" className="mb-4 h-full">
            <div className="flex flex-column gap-3">
              <div className="text-center">
                <h3 className="text-green-500 m-0">{formatNumber(results.annual_co2_savings_kg)} kg CO₂</h3>
                <p className="text-sm text-500 mb-3">Jährliche CO₂-Einsparung</p>
              </div>
              <div className="text-center">
                <h4 className="text-green-600 m-0">{formatNumber(results.co2_savings_25_years_kg / 1000, 1)} Tonnen CO₂</h4>
                <p className="text-sm text-500">25-Jahres-Einsparung</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="⚡ Energie & Einspeisevergütung" className="mb-4 h-full">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between">
                <span>Einspeisevergütung:</span>
                <Badge value={`${formatNumber(results.einspeiseverguetung_euro_per_kwh * 100, 2)} ct/kWh`} severity="info" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Stromkostenersparnis Jahr 1:</span>
                <Badge value={formatCurrency(results.stromkostenersparnis_year1)} severity="success" size="large" />
              </div>
              <div className="flex justify-content-between">
                <span>Einspeiseerlöse Jahr 1:</span>
                <Badge value={formatCurrency(results.feed_in_revenue_year1)} severity="warning" size="large" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Warnings and Errors */}
      {(results.calculation_warnings?.length || results.calculation_errors?.length) && (
        <Card title="⚠️ Hinweise & Warnungen" className="mb-4">
          {results.calculation_errors?.map((error, index) => (
            <div key={index} className="p-3 mb-2 border-round bg-red-50 border-left-3 border-red-500">
              <i className="pi pi-times-circle text-red-500 mr-2"></i>
              <span className="text-red-700">{error}</span>
            </div>
          ))}
          {results.calculation_warnings?.map((warning, index) => (
            <div key={index} className="p-3 mb-2 border-round bg-yellow-50 border-left-3 border-yellow-500">
              <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
              <span className="text-yellow-800">{warning}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Live Pricing Component */}
      {showLivePricing && (
        <LivePricingComponent 
          baseResults={results}
          onPricingUpdate={(newPricing) => {
            console.log('Live pricing update:', newPricing);
          }}
        />
      )}
    </div>
  );
};

export default CalculationResultsComponent;
