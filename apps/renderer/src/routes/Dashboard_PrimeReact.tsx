import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { Skeleton } from 'primereact/skeleton';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Dashboard() {
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});

  useEffect(() => {
    // Lade gespeicherte Berechnungen aus localStorage
    const savedCalcs = localStorage.getItem('kakerlake_solar_calculations');
    if (savedCalcs) {
      try {
        const data = JSON.parse(savedCalcs);
        setCalculations(data);
        console.log('Dashboard: Berechnungen geladen', data);
        
        // Setup Chart Data
        setupChartData(data.results);
      } catch (error) {
        console.error('Dashboard: Fehler beim Laden der Berechnungen:', error);
      }
    } else {
      console.log('Dashboard: Keine gespeicherten Berechnungen gefunden');
    }
    setLoading(false);
  }, []);

  const setupChartData = (results: any) => {
    // Monthly Production Chart
    const monthlyData = {
      labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      datasets: [
        {
          label: 'PV-Produktion (kWh)',
          data: Array.from({length: 12}, (_, i) => 
            Math.round((results.annual_pv_production_kwh || 0) * (0.6 + 0.8 * Math.sin((i + 3) * Math.PI / 6)) / 12)
          ),
          backgroundColor: 'rgba(0, 255, 0, 0.6)',
          borderColor: '#00ff00',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            color: '#e0ffe0'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#b3ffb3'
          },
          grid: {
            color: 'rgba(0, 255, 0, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#b3ffb3'
          },
          grid: {
            color: 'rgba(0, 255, 0, 0.1)'
          }
        }
      },
      backgroundColor: 'rgba(26, 26, 26, 0.9)'
    };

    setChartData(monthlyData);
    setChartOptions(options);
  };

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-6xl text-primary mb-3"></i>
          <p className="text-xl text-primary">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!calculations || !calculations.results) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen p-4">
        <Card className="max-w-30rem text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-3xl font-bold text-primary mb-4">Keine Berechnungen vorhanden</h2>
          <p className="text-color-secondary mb-4">
            Bitte führen Sie zuerst eine Berechnung im Solar-Rechner durch.
          </p>
          <Button
            label="Zum Solar-Rechner"
            icon="pi pi-arrow-right"
            className="p-button-success"
            onClick={() => navigate('/solar')}
          />
        </Card>
      </div>
    );
  }

  const { config, results } = calculations;

  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Anlagenleistung',
      value: `${results.anlage_kwp?.toFixed(1) || 0} kWp`,
      icon: 'pi-bolt',
      color: 'primary',
      background: 'bg-blue-500'
    },
    {
      title: 'Jahresertrag',
      value: `${results.annual_pv_production_kwh?.toLocaleString('de-DE') || 0} kWh`,
      icon: 'pi-sun',
      color: 'success',
      background: 'bg-green-500'
    },
    {
      title: 'Eigenverbrauch',
      value: `${results.self_consumption_rate_percent?.toFixed(0) || 0}%`,
      icon: 'pi-home',
      color: 'info',
      background: 'bg-indigo-500'
    },
    {
      title: 'Autarkiegrad',
      value: `${results.autarky_rate_percent?.toFixed(0) || 0}%`,
      icon: 'pi-battery',
      color: 'warning',
      background: 'bg-purple-500'
    },
    {
      title: 'Jährliche Ersparnis',
      value: `${results.annual_savings_euro?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}`,
      icon: 'pi-euro',
      color: 'success',
      background: 'bg-yellow-500'
    },
    {
      title: 'Amortisation',
      value: `${results.payback_time_years?.toFixed(1) || 0} Jahre`,
      icon: 'pi-chart-line',
      color: 'danger',
      background: 'bg-red-500'
    },
    {
      title: 'CO₂-Ersparnis',
      value: `${((results.annual_co2_savings_kg || 0) / 1000).toFixed(1)} t/Jahr`,
      icon: 'pi-globe',
      color: 'success',
      background: 'bg-teal-500'
    },
    {
      title: 'Investition',
      value: `${results.total_investment_brutto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}`,
      icon: 'pi-credit-card',
      color: 'secondary',
      background: 'bg-gray-600'
    }
  ];

  // Energy Balance Data for DataTable
  const energyData = [
    {
      label: 'PV-Produktion',
      value: `${results.annual_pv_production_kwh?.toLocaleString('de-DE') || 0} kWh`,
      icon: 'pi-sun'
    },
    {
      label: 'Eigenverbrauch',
      value: `${Math.round((results.annual_pv_production_kwh || 0) * (results.self_consumption_rate_percent || 0) / 100).toLocaleString('de-DE')} kWh`,
      icon: 'pi-home'
    },
    {
      label: 'Netzeinspeisung',
      value: `${results.annual_grid_feed_kwh?.toLocaleString('de-DE') || 0} kWh`,
      icon: 'pi-upload'
    },
    {
      label: 'Netzbezug',
      value: `${results.annual_grid_consumption_kwh?.toLocaleString('de-DE') || 0} kWh`,
      icon: 'pi-download'
    }
  ];

  return (
    <div className="dashboard-container p-4">
      {/* Header */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 flex align-items-center gap-2">
              <i className="pi pi-chart-bar"></i>
              Dashboard
            </h1>
            <p className="text-color-secondary">
              <i className="pi pi-calendar mr-2"></i>
              Berechnung vom {new Date(calculations.timestamp).toLocaleString('de-DE')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Neue Berechnung"
              icon="pi pi-plus"
              className="p-button-outlined"
              onClick={() => navigate('/solar')}
            />
            <Button
              label="Hauptmenü"
              icon="pi pi-home"
              className="p-button-success"
              onClick={() => navigate('/home')}
            />
          </div>
        </div>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid mb-4">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card className="h-full hover:scale-105 transition-transform transition-duration-300">
              <div className="flex align-items-center gap-3">
                <div className={`w-4rem h-4rem border-round flex align-items-center justify-content-center ${kpi.background}`}>
                  <i className={`pi ${kpi.icon} text-3xl text-white`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-color-secondary text-sm mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-primary mb-0">{kpi.value}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Detailed Results Grid */}
      <div className="grid">
        {/* Energy Balance */}
        <div className="col-12 lg:col-6">
          <Panel header="⚡ Energiebilanz" className="h-full">
            <DataTable value={energyData} className="p-datatable-sm">
              <Column 
                field="label" 
                header="Kategorie"
                body={(rowData) => (
                  <div className="flex align-items-center gap-2">
                    <i className={`pi ${rowData.icon} text-primary`}></i>
                    <span>{rowData.label}</span>
                  </div>
                )}
              />
              <Column field="value" header="Wert" className="text-right font-semibold" />
            </DataTable>
          </Panel>
        </div>

        {/* Economic Analysis */}
        <div className="col-12 lg:col-6">
          <Panel header="💰 Wirtschaftlichkeit" className="h-full">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between align-items-center">
                <span className="text-color-secondary">Investition (netto)</span>
                <span className="font-semibold">{results.total_investment_netto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</span>
              </div>
              <Divider />
              <div className="flex justify-content-between align-items-center">
                <span className="text-color-secondary">Investition (brutto)</span>
                <span className="font-semibold">{results.total_investment_brutto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</span>
              </div>
              <Divider />
              <div className="flex justify-content-between align-items-center">
                <span className="text-color-secondary">Jährliche Ersparnis</span>
                <span className="font-semibold text-green-400">{results.annual_savings_euro?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</span>
              </div>
              <Divider />
              <div className="flex justify-content-between align-items-center">
                <span className="text-color-secondary">Amortisationszeit</span>
                <span className="font-semibold">{results.payback_time_years?.toFixed(1) || 0} Jahre</span>
              </div>
              
              {/* ROI Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-content-between mb-2">
                  <span className="text-sm text-color-secondary">ROI Progress</span>
                  <span className="text-sm font-semibold">{((100 / (results.payback_time_years || 1)) * Math.min(5, results.payback_time_years || 1)).toFixed(1)}%</span>
                </div>
                <ProgressBar 
                  value={Math.min(100, (100 / (results.payback_time_years || 1)) * 5)} 
                  className="h-1rem"
                />
              </div>
            </div>
          </Panel>
        </div>

        {/* Environmental Impact */}
        <div className="col-12 lg:col-6">
          <Panel header="🌍 Umweltbilanz" className="h-full">
            <div className="flex flex-column gap-4">
              <div className="p-3 border-round surface-ground text-center">
                <i className="pi pi-globe text-6xl text-green-400 mb-3"></i>
                <p className="text-sm text-color-secondary mb-1">CO₂-Einsparung pro Jahr</p>
                <p className="text-2xl font-bold text-green-400">{((results.annual_co2_savings_kg || 0) / 1000).toFixed(1)} t</p>
              </div>
              
              <div className="p-3 border-round surface-ground text-center">
                <i className="pi pi-car text-4xl text-blue-400 mb-2"></i>
                <p className="text-sm text-color-secondary mb-1">Eingesparte Autokilometer</p>
                <p className="text-xl font-bold text-blue-400">{results.car_km_equivalent?.toLocaleString('de-DE') || 0} km</p>
              </div>

              <div className="p-3 border-round surface-ground text-center">
                <i className="pi pi-heart text-4xl text-red-400 mb-2"></i>
                <p className="text-sm text-color-secondary mb-1">Entspricht gepflanzten Bäumen</p>
                <p className="text-xl font-bold text-red-400">{results.tree_equivalent || 0}</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Monthly Production Chart */}
        <div className="col-12 lg:col-6">
          <Panel header="📊 Monatliche PV-Produktion" className="h-full">
            <Chart type="line" data={chartData} options={chartOptions} className="w-full h-20rem" />
          </Panel>
        </div>

        {/* System Configuration */}
        <div className="col-12">
          <Panel header="⚙️ Anlagenkonfiguration" className="mb-4">
            <div className="grid">
              <div className="col-12 md:col-4">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-th-large text-4xl text-primary mb-2"></i>
                  <p className="text-sm text-color-secondary mb-1">Module</p>
                  <p className="font-semibold">{config?.moduleQty || 0} × {config?.moduleModel || 'Standard'}</p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-battery text-4xl text-yellow-400 mb-2"></i>
                  <p className="text-sm text-color-secondary mb-1">Speicher</p>
                  <p className="font-semibold">
                    {config?.withStorage ? `${results.storage_capacity_kwh || 0} kWh` : 'Ohne Speicher'}
                  </p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-cog text-4xl text-orange-400 mb-2"></i>
                  <p className="text-sm text-color-secondary mb-1">Wechselrichter</p>
                  <p className="font-semibold">{config?.invModel || 'Standard'}</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
