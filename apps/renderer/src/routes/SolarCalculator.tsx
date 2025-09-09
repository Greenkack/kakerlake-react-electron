import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useProject } from '../state/project';

interface Product {
  id: string;
  kategorie: string;
  hersteller: string;
  produkt_modell: string;
  preis_stueck: number;
  pv_modul_leistung?: number;
  kapazitaet_speicher_kwh?: number;
  wr_leistung_kw?: number;
  garantie_zeit: number;
  wirkungsgrad_prozent?: number;
}

interface Config {
  moduleQty: number;
  moduleModel: string;
  moduleModelId: string;
  invModel: string;
  invModelId: string;
  withStorage: boolean;
  storageModel: string;
  storageModelId: string;
  annualConsumption: number;
  electricityPrice: number;
  feedInTariff: number;
  roofOrientation: string;
  roofTilt: number;
  shadingFactor: number;
  withWallbox: boolean;
  wallboxModel: string;
  wallboxModelId: string;
  location: string;
}

interface Results {
  anlage_kwp: number;
  annual_pv_production_kwh: number;
  self_consumption_rate_percent: number;
  autarky_rate_percent: number;
  annual_savings_euro: number;
  payback_time_years: number;
  total_investment_brutto: number;
  total_investment_netto: number;
  annual_co2_savings_kg: number;
  tree_equivalent: number;
  car_km_equivalent: number;
  [key: string]: any;
}

function SolarCalculator() {
  const navigate = useNavigate();
  const { state, actions } = useProject();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<Config>({
    moduleQty: 20,
    moduleModel: '',
    moduleModelId: '',
    invModel: '',
    invModelId: '',
    withStorage: false,
    storageModel: '',
    storageModelId: '',
    annualConsumption: 4500,
    electricityPrice: 0.32,
    feedInTariff: 0.082,
    roofOrientation: 'Süd',
    roofTilt: 35,
    shadingFactor: 0.95,
    withWallbox: false,
    wallboxModel: '',
    wallboxModelId: '',
    location: 'Deutschland'
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState<any>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call to load products
      const mockProducts: Product[] = [
        {
          id: '1',
          kategorie: 'PV Modul',
          hersteller: 'Viessmann',
          produkt_modell: 'Vitovolt 300 M440HC',
          preis_stueck: 180,
          pv_modul_leistung: 440,
          garantie_zeit: 25,
          wirkungsgrad_prozent: 22.1
        },
        {
          id: '2',
          kategorie: 'PV Modul',
          hersteller: 'SunPower',
          produkt_modell: 'P-Series SPR-P440',
          preis_stueck: 185,
          pv_modul_leistung: 440,
          garantie_zeit: 25,
          wirkungsgrad_prozent: 22.4
        },
        {
          id: '3',
          kategorie: 'Wechselrichter',
          hersteller: 'SMA',
          produkt_modell: 'Sunny Boy 5.0',
          preis_stueck: 800,
          wr_leistung_kw: 5,
          garantie_zeit: 10,
          wirkungsgrad_prozent: 97.1
        },
        {
          id: '4',
          kategorie: 'Batteriespeicher',
          hersteller: 'BYD',
          produkt_modell: 'Battery-Box Premium LVS',
          preis_stueck: 3500,
          kapazitaet_speicher_kwh: 10,
          garantie_zeit: 10,
          wirkungsgrad_prozent: 95.0
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      if (toast) {
        toast.show({ severity: 'error', summary: 'Fehler', detail: 'Produkte konnten nicht geladen werden' });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculate = () => {
    setLoading(true);
    
    // Simulate calculation
    setTimeout(() => {
      const selectedModule = products.find(p => p.id === config.moduleModelId);
      const moduleWattage = selectedModule?.pv_modul_leistung || 400;
      
      const systemCapacity = (config.moduleQty * moduleWattage) / 1000; // kWp
      const annualProduction = systemCapacity * 1000 * config.shadingFactor; // kWh
      const selfConsumption = Math.min(annualProduction, config.annualConsumption) / annualProduction * 100;
      const autarky = Math.min(annualProduction, config.annualConsumption) / config.annualConsumption * 100;
      
      const totalCost = config.moduleQty * (selectedModule?.preis_stueck || 200);
      const annualSavings = (config.annualConsumption * config.electricityPrice) - 
                           ((config.annualConsumption - Math.min(annualProduction, config.annualConsumption)) * config.electricityPrice) +
                           (Math.max(0, annualProduction - config.annualConsumption) * config.feedInTariff);

      const calculationResults: Results = {
        anlage_kwp: systemCapacity,
        annual_pv_production_kwh: annualProduction,
        self_consumption_rate_percent: selfConsumption,
        autarky_rate_percent: autarky,
        annual_savings_euro: annualSavings,
        payback_time_years: totalCost / annualSavings,
        total_investment_brutto: totalCost * 1.19,
        total_investment_netto: totalCost,
        annual_co2_savings_kg: annualProduction * 0.4,
        tree_equivalent: Math.round(annualProduction * 0.4 / 22),
        car_km_equivalent: Math.round(annualProduction * 0.4 * 5)
      };

      setResults(calculationResults);
      setShowResults(true);
      setLoading(false);
      
      // Save to Project Context via updateOptions
      actions.updateOptions({
        pv_interest: true,
        system_size_preference: systemCapacity > 15 ? 'large' : systemCapacity > 10 ? 'medium' : 'small',
        module_type_preference: config.moduleModel
      });

      localStorage.setItem('kakerlake_solar_calculations', JSON.stringify({
        config,
        results: calculationResults,
        timestamp: new Date().toISOString()
      }));

      if (toast) {
        toast.show({ 
          severity: 'success', 
          summary: 'Berechnung abgeschlossen', 
          detail: `Anlagenleistung: ${systemCapacity.toFixed(1)} kWp` 
        });
      }

      // Navigate to results after calculation
      setTimeout(() => {
        navigate('/project/results');
      }, 1500);
    }, 2000);
  };

  const moduleOptions = products
    .filter(p => p.kategorie === 'PV Modul')
    .map(p => ({ 
      label: `${p.hersteller} ${p.produkt_modell} (${p.pv_modul_leistung}W)`, 
      value: p.id 
    }));

  const inverterOptions = products
    .filter(p => p.kategorie === 'Wechselrichter')
    .map(p => ({ 
      label: `${p.hersteller} ${p.produkt_modell} (${p.wr_leistung_kw}kW)`, 
      value: p.id 
    }));

  const storageOptions = products
    .filter(p => p.kategorie === 'Batteriespeicher')
    .map(p => ({ 
      label: `${p.hersteller} ${p.produkt_modell} (${p.kapazitaet_speicher_kwh}kWh)`, 
      value: p.id 
    }));

  const roofOrientationOptions = [
    { label: 'Süd', value: 'Süd' },
    { label: 'Südost', value: 'Südost' },
    { label: 'Südwest', value: 'Südwest' },
    { label: 'Ost', value: 'Ost' },
    { label: 'West', value: 'West' }
  ];

  const stepperItems = [
    { label: 'Module & Wechselrichter' },
    { label: 'Speicher & Wallbox' },
    { label: 'Standort & Verbrauch' },
    { label: 'Berechnung & Ergebnisse' }
  ];

  return (
    <div className="solar-calculator p-4 fade-in">
      <Toast ref={(el) => setToast(el)} />
      
      {/* Header */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center flex-wrap gap-3 p-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 flex align-items-center gap-2">
              <i className="pi pi-sun"></i>
              Solar Kalkulator
            </h1>
            <p className="text-color-secondary">
              Professionelle PV-Anlagen Berechnung
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Dashboard"
              icon="pi pi-chart-bar"
              className="p-button-outlined"
              onClick={() => navigate('/dashboard')}
            />
            <Button
              label="Hauptmenü"
              icon="pi pi-home"
              className="p-button-success"
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      </Card>

      {/* Configuration Stepper */}
      <div className="grid">
        <div className="col-12">
          <Panel header="⚙️ Anlagenkonfiguration" className="mb-4">
            <div className="mb-4">
              <Stepper activeStep={currentStep}>
                {stepperItems.map((item, index) => (
                  <StepperPanel key={index} header={item.label}>
                    {/* Step Content */}
                  </StepperPanel>
                ))}
              </Stepper>
            </div>

            <TabView activeIndex={currentStep} onTabChange={(e) => setCurrentStep(e.index)}>
              {/* Step 1: Module & Inverter */}
              <TabPanel header="🔆 Module & Wechselrichter">
                <div className="grid gap-4">
                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-th-large mr-2"></i>
                      PV-Module
                    </label>
                    <Dropdown
                      value={config.moduleModelId}
                      options={moduleOptions}
                      onChange={(e) => {
                        const selectedProduct = products.find(p => p.id === e.value);
                        setConfig({
                          ...config,
                          moduleModelId: e.value,
                          moduleModel: selectedProduct?.produkt_modell || ''
                        });
                      }}
                      placeholder="Modul wählen..."
                      className="w-full"
                      filter
                      showClear
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-hashtag mr-2"></i>
                      Anzahl Module
                    </label>
                    <InputNumber
                      value={config.moduleQty}
                      onValueChange={(e) => setConfig({ ...config, moduleQty: e.value || 0 })}
                      min={1}
                      max={100}
                      className="w-full"
                      showButtons
                      buttonLayout="horizontal"
                      step={1}
                    />
                  </div>

                  <div className="col-12">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-cog mr-2"></i>
                      Wechselrichter
                    </label>
                    <Dropdown
                      value={config.invModelId}
                      options={inverterOptions}
                      onChange={(e) => {
                        const selectedProduct = products.find(p => p.id === e.value);
                        setConfig({
                          ...config,
                          invModelId: e.value,
                          invModel: selectedProduct?.produkt_modell || ''
                        });
                      }}
                      placeholder="Wechselrichter wählen..."
                      className="w-full"
                      filter
                      showClear
                    />
                  </div>

                  {/* Live Preview */}
                  <div className="col-12">
                    <Card className="bg-primary-50 border-primary">
                      <h4 className="text-primary mb-3">
                        <i className="pi pi-eye mr-2"></i>
                        Live Vorschau
                      </h4>
                      <div className="grid text-center">
                        <div className="col-4">
                          <div className="text-2xl font-bold text-primary">
                            {((config.moduleQty * (products.find(p => p.id === config.moduleModelId)?.pv_modul_leistung || 0)) / 1000).toFixed(1)}
                          </div>
                          <div className="text-sm text-color-secondary">kWp Gesamtleistung</div>
                        </div>
                        <div className="col-4">
                          <div className="text-2xl font-bold text-success">
                            {Math.round((config.moduleQty * (products.find(p => p.id === config.moduleModelId)?.pv_modul_leistung || 0)) * config.shadingFactor)}
                          </div>
                          <div className="text-sm text-color-secondary">kWh Jahresertrag</div>
                        </div>
                        <div className="col-4">
                          <div className="text-2xl font-bold text-warning">
                            {((config.moduleQty * (products.find(p => p.id === config.moduleModelId)?.preis_stueck || 0)) * 1.19).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </div>
                          <div className="text-sm text-color-secondary">Investition (brutto)</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabPanel>

              {/* Step 2: Storage & Wallbox */}
              <TabPanel header="🔋 Speicher & Wallbox">
                <div className="grid gap-4">
                  <div className="col-12">
                    <div className="flex align-items-center gap-3 mb-4">
                      <ToggleButton
                        checked={config.withStorage}
                        onChange={(e) => setConfig({ ...config, withStorage: e.value })}
                        onLabel="Mit Speicher"
                        offLabel="Ohne Speicher"
                        onIcon="pi pi-battery"
                        offIcon="pi pi-times"
                        className="w-auto"
                      />
                      <Badge 
                        value="Empfohlen" 
                        severity="success" 
                        className={config.withStorage ? '' : 'opacity-50'}
                      />
                    </div>
                  </div>

                  {config.withStorage && (
                    <div className="col-12">
                      <label className="block text-sm font-medium mb-2">
                        <i className="pi pi-battery mr-2"></i>
                        Batteriespeicher
                      </label>
                      <Dropdown
                        value={config.storageModelId}
                        options={storageOptions}
                        onChange={(e) => {
                          const selectedProduct = products.find(p => p.id === e.value);
                          setConfig({
                            ...config,
                            storageModelId: e.value,
                            storageModel: selectedProduct?.produkt_modell || ''
                          });
                        }}
                        placeholder="Speicher wählen..."
                        className="w-full"
                        filter
                        showClear
                      />
                    </div>
                  )}

                  <div className="col-12">
                    <div className="flex align-items-center gap-3 mb-4">
                      <ToggleButton
                        checked={config.withWallbox}
                        onChange={(e) => setConfig({ ...config, withWallbox: e.value })}
                        onLabel="Mit Wallbox"
                        offLabel="Ohne Wallbox"
                        onIcon="pi pi-car"
                        offIcon="pi pi-times"
                        className="w-auto"
                      />
                      <Badge 
                        value="Optional" 
                        severity="info"
                        className={config.withWallbox ? '' : 'opacity-50'}
                      />
                    </div>
                  </div>

                  {config.withWallbox && (
                    <div className="col-12">
                      <Message 
                        severity="info" 
                        text="Wallbox-Integration erhöht den Eigenverbrauch und die Wirtschaftlichkeit der PV-Anlage."
                        className="mb-3"
                      />
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Step 3: Location & Consumption */}
              <TabPanel header="📍 Standort & Verbrauch">
                <div className="grid gap-4">
                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-bolt mr-2"></i>
                      Jährlicher Stromverbrauch (kWh)
                    </label>
                    <InputNumber
                      value={config.annualConsumption}
                      onValueChange={(e) => setConfig({ ...config, annualConsumption: e.value || 0 })}
                      min={1000}
                      max={20000}
                      className="w-full"
                      showButtons
                      step={500}
                    />
                    <small className="text-color-secondary">
                      Durchschnitt 4-Personen-Haushalt: 4.500 kWh
                    </small>
                  </div>

                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-euro mr-2"></i>
                      Strompreis (€/kWh)
                    </label>
                    <InputNumber
                      value={config.electricityPrice}
                      onValueChange={(e) => setConfig({ ...config, electricityPrice: e.value || 0 })}
                      min={0.1}
                      max={1}
                      minFractionDigits={3}
                      maxFractionDigits={3}
                      className="w-full"
                      step={0.001}
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-compass mr-2"></i>
                      Dachausrichtung
                    </label>
                    <Dropdown
                      value={config.roofOrientation}
                      options={roofOrientationOptions}
                      onChange={(e) => setConfig({ ...config, roofOrientation: e.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-angle-up mr-2"></i>
                      Dachneigung: {config.roofTilt}°
                    </label>
                    <Slider
                      value={config.roofTilt}
                      onChange={(e) => setConfig({ ...config, roofTilt: Array.isArray(e.value) ? e.value[0] : e.value })}
                      min={0}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-content-between text-sm text-color-secondary mt-1">
                      <span>0° (Flach)</span>
                      <span>30° (Optimal)</span>
                      <span>60° (Steil)</span>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="block text-sm font-medium mb-2">
                      <i className="pi pi-cloud mr-2"></i>
                      Verschattungsfaktor: {(config.shadingFactor * 100).toFixed(0)}%
                    </label>
                    <Slider
                      value={config.shadingFactor}
                      onChange={(e) => setConfig({ ...config, shadingFactor: Array.isArray(e.value) ? e.value[0] : e.value })}
                      min={0.7}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="flex justify-content-between text-sm text-color-secondary mt-1">
                      <span>70% (Starke Verschattung)</span>
                      <span>95% (Optimal)</span>
                      <span>100% (Keine Verschattung)</span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Step 4: Calculation & Results */}
              <TabPanel header="📊 Berechnung & Ergebnisse">
                <div className="text-center mb-4">
                  {!showResults ? (
                    <div>
                      <Button
                        label={loading ? "Berechnung läuft..." : "Berechnung starten"}
                        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-calculator"}
                        className="p-button-success p-button-lg"
                        onClick={calculate}
                        disabled={loading || !config.moduleModelId || !config.invModelId}
                        loading={loading}
                      />
                      <p className="text-color-secondary mt-3">
                        Klicken Sie auf "Berechnung starten" um die Wirtschaftlichkeit zu analysieren
                      </p>
                      
                      {loading && (
                        <div className="mt-4">
                          <ProgressBar mode="indeterminate" className="h-0-5rem" />
                          <p className="text-sm text-color-secondary mt-2">
                            Berechne Ertrag, Eigenverbrauch und Wirtschaftlichkeit...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    results && (
                      <div className="grid">
                        {/* Key Results Cards */}
                        <div className="col-12 mb-4">
                          <h3 className="text-2xl font-bold text-primary mb-4">
                            <i className="pi pi-check-circle mr-2"></i>
                            Berechnungsergebnisse
                          </h3>
                        </div>

                        <div className="col-12 md:col-4">
                          <Card className="text-center h-full">
                            <i className="pi pi-bolt text-5xl text-primary mb-3"></i>
                            <h4 className="text-xl font-bold text-primary">
                              {results.anlage_kwp.toFixed(1)} kWp
                            </h4>
                            <p className="text-color-secondary">Anlagenleistung</p>
                          </Card>
                        </div>

                        <div className="col-12 md:col-4">
                          <Card className="text-center h-full">
                            <i className="pi pi-sun text-5xl text-yellow-400 mb-3"></i>
                            <h4 className="text-xl font-bold text-success">
                              {results.annual_pv_production_kwh.toLocaleString('de-DE')} kWh
                            </h4>
                            <p className="text-color-secondary">Jahresertrag</p>
                          </Card>
                        </div>

                        <div className="col-12 md:col-4">
                          <Card className="text-center h-full">
                            <i className="pi pi-euro text-5xl text-green-400 mb-3"></i>
                            <h4 className="text-xl font-bold text-success">
                              {results.annual_savings_euro.toLocaleString('de-DE', { 
                                style: 'currency', 
                                currency: 'EUR' 
                              })}
                            </h4>
                            <p className="text-color-secondary">Jährliche Ersparnis</p>
                          </Card>
                        </div>

                        {/* Detailed Results */}
                        <div className="col-12 mt-4">
                          <Panel header="📈 Detaillierte Ergebnisse">
                            <DataTable 
                              value={[
                                { label: 'Eigenverbrauchsquote', value: `${results.self_consumption_rate_percent.toFixed(1)}%`, icon: 'pi-home' },
                                { label: 'Autarkiegrad', value: `${results.autarky_rate_percent.toFixed(1)}%`, icon: 'pi-battery' },
                                { label: 'Amortisationszeit', value: `${results.payback_time_years.toFixed(1)} Jahre`, icon: 'pi-chart-line' },
                                { label: 'Investition (netto)', value: results.total_investment_netto.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), icon: 'pi-credit-card' },
                                { label: 'Investition (brutto)', value: results.total_investment_brutto.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), icon: 'pi-credit-card' },
                                { label: 'CO₂-Einsparung/Jahr', value: `${(results.annual_co2_savings_kg / 1000).toFixed(1)} t`, icon: 'pi-globe' }
                              ]} 
                              className="p-datatable-sm"
                            >
                              <Column 
                                field="label" 
                                header="Kennzahl"
                                body={(rowData: any) => (
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

                        {/* Action Buttons */}
                        <div className="col-12 mt-4 text-center">
                          <div className="flex gap-3 justify-content-center flex-wrap">
                            <Button
                              label="Zum Dashboard"
                              icon="pi pi-chart-bar"
                              className="p-button-success"
                              onClick={() => navigate('/dashboard')}
                            />
                            <Button
                              label="PDF Erstellen"
                              icon="pi pi-file-pdf"
                              className="p-button-warning"
                              onClick={() => navigate('/pdf/standard')}
                            />
                            <Button
                              label="Neue Berechnung"
                              icon="pi pi-refresh"
                              className="p-button-outlined"
                              onClick={() => {
                                setShowResults(false);
                                setResults(null);
                                setCurrentStep(0);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </TabPanel>
            </TabView>

            {/* Navigation Buttons */}
            <Divider className="my-4" />
            <div className="flex justify-content-between">
              <Button
                label="Zurück"
                icon="pi pi-chevron-left"
                className="p-button-outlined"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              />
              <Button
                label={currentStep === 3 ? "Berechnen" : "Weiter"}
                icon={currentStep === 3 ? "pi pi-calculator" : "pi pi-chevron-right"}
                iconPos={currentStep === 3 ? "left" : "right"}
                onClick={() => {
                  if (currentStep === 3) {
                    if (!showResults) calculate();
                  } else {
                    setCurrentStep(Math.min(3, currentStep + 1));
                  }
                }}
                disabled={currentStep < 3 && (!config.moduleModelId || !config.invModelId)}
              />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default SolarCalculator;
