import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { ProgressBar } from 'primereact/progressbar';
import { Knob } from 'primereact/knob';

interface HeatpumpData {
  type: string;
  power: number;
  cop: number;
  price: number;
  efficiency: number;
  heatOutput: number;
  electricConsumption: number;
  annualCosts: number;
  co2Savings: number;
}

const HeatpumpSimulator: React.FC = () => {
  const [houseArea, setHouseArea] = useState<number>(150);
  const [insulation, setInsulation] = useState<string>('good');
  const [currentHeating, setCurrentHeating] = useState<string>('gas');
  const [targetTemperature, setTargetTemperature] = useState<number>(21);
  const [selectedHeatpump, setSelectedHeatpump] = useState<HeatpumpData | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const insulationOptions = [
    { label: 'Sehr gut (Neubau)', value: 'excellent' },
    { label: 'Gut (Saniert)', value: 'good' },
    { label: 'Mittel', value: 'medium' },
    { label: 'Schlecht (Altbau)', value: 'poor' }
  ];

  const currentHeatingOptions = [
    { label: 'Gasheizung', value: 'gas' },
    { label: 'Ölheizung', value: 'oil' },
    { label: 'Elektroheizung', value: 'electric' },
    { label: 'Fernwärme', value: 'district' }
  ];

  const heatpumpOptions: HeatpumpData[] = [
    {
      type: 'Luft/Wasser',
      power: 8,
      cop: 4.2,
      price: 15000,
      efficiency: 85,
      heatOutput: 8.5,
      electricConsumption: 2.0,
      annualCosts: 1200,
      co2Savings: 3500
    },
    {
      type: 'Erdwärme',
      power: 10,
      cop: 4.8,
      price: 25000,
      efficiency: 95,
      heatOutput: 10.2,
      electricConsumption: 2.1,
      annualCosts: 950,
      co2Savings: 4200
    },
    {
      type: 'Wasser/Wasser',
      power: 12,
      cop: 5.2,
      price: 30000,
      efficiency: 98,
      heatOutput: 12.1,
      electricConsumption: 2.3,
      annualCosts: 850,
      co2Savings: 4800
    }
  ];

  useEffect(() => {
    calculateSimulation();
  }, [houseArea, insulation, currentHeating, targetTemperature, selectedHeatpump]);

  const calculateSimulation = () => {
    if (!selectedHeatpump) return;

    // Berechnung basierend auf Parametern
    const baseConsumption = houseArea * 0.08; // kWh/m²
    const insulationFactor = {
      excellent: 0.7,
      good: 1.0,
      medium: 1.3,
      poor: 1.6
    }[insulation] || 1.0;

    const annualHeatDemand = baseConsumption * insulationFactor * houseArea;
    const electricConsumption = annualHeatDemand / selectedHeatpump.cop;
    const annualCosts = electricConsumption * 0.32; // €/kWh
    
    // Vergleich mit alter Heizung
    const oldSystemCosts = {
      gas: annualHeatDemand * 0.08,
      oil: annualHeatDemand * 0.09,
      electric: annualHeatDemand * 0.32,
      district: annualHeatDemand * 0.10
    }[currentHeating] || 0;

    const savings = oldSystemCosts - annualCosts;
    const paybackTime = selectedHeatpump.price / savings;

    setSimulationResults({
      annualHeatDemand,
      electricConsumption,
      annualCosts,
      oldSystemCosts,
      savings,
      paybackTime,
      co2Reduction: selectedHeatpump.co2Savings,
      efficiency: selectedHeatpump.efficiency
    });
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Wärmebedarf (kWh)',
        data: [850, 720, 640, 420, 220, 150, 120, 140, 280, 450, 650, 780],
        borderColor: '#00D2FF',
        backgroundColor: 'rgba(0, 210, 255, 0.1)',
        tension: 0.4
      },
      {
        label: 'Stromverbrauch WP (kWh)',
        data: [200, 170, 150, 100, 50, 35, 28, 33, 65, 105, 155, 185],
        borderColor: '#00FF88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      x: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      },
      y: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      }
    }
  };

  return (
    <div className="heatpump-simulator p-4">
      {/* Header */}
      <Panel header="Wärmepumpen Simulator" className="mb-4">
        <div className="flex align-items-center gap-3">
          <Avatar icon="pi pi-bolt" size="large" className="bg-primary-100 text-primary-600" />
          <div>
            <h3 className="m-0 text-primary">Wärmepumpen-Simulation</h3>
            <p className="m-0 text-color-secondary">Berechnen Sie Einsparungen und Effizienz verschiedener Wärmepumpen</p>
          </div>
        </div>
      </Panel>

      <div className="grid">
        {/* Eingabeparameter */}
        <div className="col-12 lg:col-4">
          <Card title="Parameter" className="h-full">
            <div className="p-fluid">
              <div className="field">
                <label htmlFor="area">Wohnfläche (m²)</label>
                <InputNumber
                  id="area"
                  value={houseArea}
                  onValueChange={(e) => setHouseArea(e.value || 150)}
                  min={50}
                  max={500}
                  suffix=" m²"
                />
                <Slider
                  value={houseArea}
                  onChange={(e) => setHouseArea(e.value as number)}
                  min={50}
                  max={500}
                  className="mt-2"
                />
              </div>

              <div className="field">
                <label htmlFor="insulation">Dämmstandard</label>
                <Dropdown
                  id="insulation"
                  value={insulation}
                  options={insulationOptions}
                  onChange={(e) => setInsulation(e.value)}
                  placeholder="Dämmung auswählen"
                />
              </div>

              <div className="field">
                <label htmlFor="current">Aktuelle Heizung</label>
                <Dropdown
                  id="current"
                  value={currentHeating}
                  options={currentHeatingOptions}
                  onChange={(e) => setCurrentHeating(e.value)}
                  placeholder="Heizung auswählen"
                />
              </div>

              <div className="field">
                <label htmlFor="temp">Zieltemperatur (°C)</label>
                <InputNumber
                  id="temp"
                  value={targetTemperature}
                  onValueChange={(e) => setTargetTemperature(e.value || 21)}
                  min={18}
                  max={24}
                  suffix=" °C"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Wärmepumpen Auswahl */}
        <div className="col-12 lg:col-8">
          <Card title="Wärmepumpen-Optionen" className="h-full">
            <div className="grid">
              {heatpumpOptions.map((hp, index) => (
                <div key={index} className="col-12 md:col-4">
                  <Card 
                    className={`cursor-pointer transition-all transition-duration-300 h-full ${
                      selectedHeatpump?.type === hp.type ? 'border-2 border-primary' : 'hover:shadow-4'
                    }`}
                    onClick={() => setSelectedHeatpump(hp)}
                  >
                    <div className="text-center">
                      <Avatar 
                        icon="pi pi-bolt" 
                        size="large" 
                        className="mb-3 bg-success-100 text-success-600" 
                      />
                      <h4 className="text-900 font-semibold mb-2">{hp.type}</h4>
                      <Badge value={`COP ${hp.cop}`} className="mb-3" severity="success" />
                      
                      <div className="text-left">
                        <div className="flex justify-content-between mb-2">
                          <span>Leistung:</span>
                          <strong>{hp.power} kW</strong>
                        </div>
                        <div className="flex justify-content-between mb-2">
                          <span>Preis:</span>
                          <strong>{hp.price.toLocaleString('de-DE')} €</strong>
                        </div>
                        <div className="flex justify-content-between">
                          <span>Effizienz:</span>
                          <strong>{hp.efficiency}%</strong>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Simulationsergebnisse */}
      {simulationResults && selectedHeatpump && (
        <div className="mt-4">
          <TabView>
            <TabPanel header="Übersicht" leftIcon="pi pi-chart-line">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <Card className="text-center">
                    <Knob 
                      value={Math.round(simulationResults.efficiency)} 
                      readOnly 
                      size={120}
                      valueColor="#00D2FF"
                      rangeColor="#e0e0e0"
                    />
                    <h4 className="mt-3 mb-1">Effizienz</h4>
                    <p className="text-600">der Wärmepumpe</p>
                  </Card>
                </div>
                
                <div className="col-12 md:col-9">
                  <Card>
                    <div className="grid">
                      <div className="col-6 md:col-3 text-center">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {Math.round(simulationResults.annualHeatDemand).toLocaleString('de-DE')}
                        </div>
                        <div className="text-600">kWh/Jahr Wärmebedarf</div>
                      </div>
                      <div className="col-6 md:col-3 text-center">
                        <div className="text-2xl font-bold text-success mb-2">
                          {Math.round(simulationResults.electricConsumption).toLocaleString('de-DE')}
                        </div>
                        <div className="text-600">kWh/Jahr Strom</div>
                      </div>
                      <div className="col-6 md:col-3 text-center">
                        <div className="text-2xl font-bold text-info mb-2">
                          {Math.round(simulationResults.annualCosts).toLocaleString('de-DE')} €
                        </div>
                        <div className="text-600">Jährliche Kosten</div>
                      </div>
                      <div className="col-6 md:col-3 text-center">
                        <div className="text-2xl font-bold text-warning mb-2">
                          {Math.round(simulationResults.paybackTime)} Jahre
                        </div>
                        <div className="text-600">Amortisation</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Diagramme" leftIcon="pi pi-chart-bar">
              <Card title="Jahresverlauf Wärmebedarf & Stromverbrauch">
                <Chart type="line" data={chartData} options={chartOptions} height="400px" />
              </Card>
            </TabPanel>

            <TabPanel header="Vergleich" leftIcon="pi pi-comparison">
              <Card title="Kostenvergleich">
                <DataTable value={[
                  {
                    system: 'Aktuelle Heizung',
                    costs: Math.round(simulationResults.oldSystemCosts),
                    co2: '-',
                    efficiency: '-'
                  },
                  {
                    system: selectedHeatpump.type + ' Wärmepumpe',
                    costs: Math.round(simulationResults.annualCosts),
                    co2: simulationResults.co2Reduction,
                    efficiency: simulationResults.efficiency + '%'
                  }
                ]}>
                  <Column field="system" header="Heizsystem" />
                  <Column field="costs" header="Jährliche Kosten (€)" />
                  <Column field="co2" header="CO₂-Einsparung (kg/Jahr)" />
                  <Column field="efficiency" header="Effizienz" />
                </DataTable>
                
                <div className="mt-4 p-4 bg-success-50 border-round">
                  <div className="flex align-items-center gap-3">
                    <i className="pi pi-check-circle text-success text-xl"></i>
                    <div>
                      <strong className="text-success">
                        Jährliche Einsparung: {Math.round(simulationResults.savings).toLocaleString('de-DE')} €
                      </strong>
                      <div className="text-600">
                        Über 20 Jahre: {Math.round(simulationResults.savings * 20).toLocaleString('de-DE')} €
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabView>
        </div>
      )}
    </div>
  );
};

export default HeatpumpSimulator;
