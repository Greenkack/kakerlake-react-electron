// apps/renderer/src/routes/ComponentsDemo.tsx
// Demo-Seite für ChartContainer und LivePricingSidebar

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';

import ChartContainer, { 
  createAmortizationChart, 
  createROIChart, 
  createEnergyProductionChart 
} from '../components/ChartContainer';
import LivePricingSidebar from '../components/LivePricingSidebar';
import CalculationResultsDisplay from '../components/CalculationResultsDisplay';
import { useAppContext, usePricing } from '../context/AppContext';

const ComponentsDemo: React.FC = () => {
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
  const amortizationData = createAmortizationChart(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [-25000, -22900, -20700, -18400, -16000, -13500, -10900, -8200, -5400, -2500, 400, 3400, 6900]
  );

  const roiData = createROIChart(
    ['Eigenverbrauch', 'Einspeisung', 'Förderungen', 'Wartung'],
    [65, 25, 7, 3]
  );

  const productionData = createEnergyProductionChart(
    ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    [420, 580, 750, 920, 1050, 1100, 1080, 950, 780, 620, 450, 380]
  );

  return (
    <div className="components-demo p-4">
      <div className="demo-header mb-4">
        <h1 className="text-3xl font-bold text-primary mb-2">
          <i className="pi pi-star mr-3"></i>
          Neue Komponenten Demo
        </h1>
        <p className="text-gray-600 mb-4">
          Demonstration der integrierten ChartContainer, AppContext und LivePricingSidebar Komponenten
        </p>
        <div className="flex gap-2">
          <Badge value="ChartContainer.tsx" severity="success" />
          <Badge value="AppContext.tsx" severity="info" />
          <Badge value="LivePricingSidebar.tsx" severity="warning" />
          <Badge value="CalculationResultsDisplay.tsx" severity="danger" />
        </div>
      </div>

      <Splitter style={{ height: '600px' }} className="mb-4">
        <SplitterPanel size={75} minSize={60}>
          <TabView>
            <TabPanel header="📊 Charts Demo" leftIcon="pi pi-chart-line">
              <div className="grid">
                <div className="col-12">
                  <ChartContainer
                    chartType="Amortisationsrechnung"
                    chartData={amortizationData}
                    title="📈 Cashflow über 12 Jahre"
                    height={300}
                  />
                </div>
                
                <div className="col-6">
                  <ChartContainer
                    chartType="ROI Verteilung"
                    chartData={roiData}
                    title="🥧 Ertragsaufteilung"
                    height={250}
                  />
                </div>
                
                <div className="col-6">
                  <ChartContainer
                    chartType="Monatsproduktion"
                    chartData={productionData}
                    title="📊 Jährliche Energieproduktion"
                    height={250}
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel header="🎛️ Context Demo" leftIcon="pi pi-cog">
              <Card title="AppContext State Übersicht">
                <div className="grid">
                  <div className="col-6">
                    <h4>📋 Projekt Daten</h4>
                    <pre className="bg-gray-100 p-3 border-round text-sm">
                      {JSON.stringify(state.projectData, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="col-6">
                    <h4>💰 Pricing State</h4>
                    <pre className="bg-gray-100 p-3 border-round text-sm">
                      {JSON.stringify(state.pricing, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="col-12">
                    <h4>📊 Calculation Results</h4>
                    <pre className="bg-gray-100 p-3 border-round text-sm max-h-20rem overflow-auto">
                      {JSON.stringify(state.calculationResults, null, 2)}
                    </pre>
                  </div>
                </div>
              </Card>
            </TabPanel>

            <TabPanel header="� Results Display" leftIcon="pi pi-chart-pie">
              <CalculationResultsDisplay 
                results={{
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
                }}
                showCharts={true}
                compactMode={false}
              />
            </TabPanel>

            <TabPanel header="�🔧 Integration Test" leftIcon="pi pi-wrench">
              <Card title="Komponenten Integration Test">
                <div className="mb-4">
                  <h4>🧪 Test Actions</h4>
                  <div className="flex gap-2 mb-3">
                    <Button
                      label="Projekt Daten setzen"
                      icon="pi pi-plus"
                      onClick={() => dispatch({
                        type: 'SET_PROJECT_DATA',
                        payload: {
                          moduleQuantity: 20,
                          systemPower: 8.0,
                          customerName: 'Max Mustermann',
                          location: 'München'
                        }
                      })}
                      size="small"
                    />
                    
                    <Button
                      label="Neue Berechnung"
                      icon="pi pi-refresh"
                      onClick={() => dispatch({
                        type: 'SET_CALCULATION_RESULTS',
                        payload: {
                          total_investment_netto: Math.floor(Math.random() * 50000) + 20000,
                          annual_pv_production_kwh: Math.floor(Math.random() * 5000) + 7000,
                          payback_years: Math.round((Math.random() * 10 + 8) * 10) / 10
                        }
                      })}
                      severity="secondary"
                      size="small"
                    />
                    
                    <Button
                      label="State zurücksetzen"
                      icon="pi pi-trash"
                      onClick={() => dispatch({ type: 'RESET_STATE' })}
                      severity="danger"
                      size="small"
                    />
                  </div>
                </div>

                <div className="grid">
                  <div className="col-6">
                    <Panel header="📊 Live Chart Update">
                      <ChartContainer
                        chartType="Live Demo Chart"
                        chartData={{
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
                        }}
                        height={200}
                        showCard={false}
                      />
                    </Panel>
                  </div>
                  
                  <div className="col-6">
                    <Panel header="💰 Current Pricing">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(state.pricing.finalPrice)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Basis: {state.pricing.baseCost.toLocaleString('de-DE')} €
                        </div>
                        <div className="text-sm text-gray-600">
                          Rabatt: {state.pricing.discountPercent}% | 
                          Aufschlag: {state.pricing.surchargePercent}%
                        </div>
                      </div>
                    </Panel>
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabView>
        </SplitterPanel>

        <SplitterPanel size={25} minSize={20}>
          <div className="p-3">
            <LivePricingSidebar 
              showTitle={true}
              compact={false}
            />
          </div>
        </SplitterPanel>
      </Splitter>

      <Card title="✅ Integration Status" className="mt-4">
        <div className="grid">
          <div className="col-4">
            <div className="text-center">
              <i className="pi pi-check-circle text-green-500 text-4xl mb-2"></i>
              <h4>ChartContainer</h4>
              <p className="text-sm text-gray-600">
                PrimeReact Chart.js Integration<br/>
                Responsive & Template-basiert
              </p>
            </div>
          </div>
          
          <div className="col-4">
            <div className="text-center">
              <i className="pi pi-check-circle text-green-500 text-4xl mb-2"></i>
              <h4>AppContext</h4>
              <p className="text-sm text-gray-600">
                Globales State Management<br/>
                useReducer & Custom Hooks
              </p>
            </div>
          </div>
          
          <div className="col-4">
            <div className="text-center">
              <i className="pi pi-check-circle text-green-500 text-4xl mb-2"></i>
              <h4>LivePricingSidebar</h4>
              <p className="text-sm text-gray-600">
                Context-integrierte Sidebar<br/>
                Live-Preisberechnung
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComponentsDemo;
