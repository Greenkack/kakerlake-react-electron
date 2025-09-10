import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../state/project';

// PrimeReact Core Imports
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import CalculationResultsComponent, { CalculationResults } from '../components/CalculationResults';
import CalculationDashboardComponent from '../components/CalculationDashboard';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// PrimeReact Styles
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Produkt-Typ mit deutschen, standardisierten Keys
interface Product {
  id: string;
  kategorie: string;
  hersteller: string;
  produkt_modell: string;
  pv_modul_leistung?: number;
  wr_leistung_kw?: number;
  kapazitaet_speicher_kwh?: number;
}

// Solar Calculator State Interface
interface SolarConfig {
  moduleQty: number;
  moduleBrand: string;
  moduleModel: string;
  moduleProductId: number;
  invBrand: string;
  invModel: string;
  invProductId: number;
  invQty: number;
  withStorage: boolean;
  storageBrand: string;
  storageModel: string;
  storageProductId: number;
  storageDesiredKWh: number;
  
  // Zusätzliche Komponenten
  additionalComponents: boolean;
  wallboxEnabled: boolean;
  wallboxBrand: string;
  wallboxModel: string;
  wallboxProductId: number;
  emsEnabled: boolean;
  emsBrand: string;
  emsModel: string;
  emsProductId: number;
  optimizerEnabled: boolean;
  optimizerBrand: string;
  optimizerModel: string;
  optimizerProductId: number;
  optimizerQty: number;
  carportEnabled: boolean;
  carportBrand: string;
  carportModel: string;
  carportProductId: number;
  emergencyPowerEnabled: boolean;
  emergencyPowerBrand: string;
  emergencyPowerModel: string;
  emergencyPowerProductId: number;
  animalProtectionEnabled: boolean;
  animalProtectionBrand: string;
  animalProtectionModel: string;
  animalProtectionProductId: number;
  
  otherComponentNote: string;
}

// Mock-Ladefunktion – später ersetzen durch echte Bridge (IPC/fetch)
function useProducts(): { modules: Product[]; inverters: Product[]; storages: Product[]; loaded: boolean } {
  const [data, setData] = useState<{ modules: Product[]; inverters: Product[]; storages: Product[]}>({ modules: [], inverters: [], storages: [] });
  const [loaded, setLoaded] = useState<boolean>(false);
  
    
    useEffect(() => {
      let cancelled = false;
      async function loadReal() {
        try {
          const api = (window as any).solarAPI;
          if (!api) { setLoaded(true); return; }
          // Lade alle Hersteller und deren Modelle
          const [pvBrands, invBrands, storBrands] = await Promise.all([
            api.getPVManufacturers(),
            api.getInverterManufacturers(),
            api.getStorageManufacturers(),
          ]);
          const [pvModelsArr, invModelsArr, storModelsArr] = await Promise.all([
            Promise.all((pvBrands || []).map((b: string) => api.getPVModelsByManufacturer(b))),
            Promise.all((invBrands || []).map((b: string) => api.getInverterModelsByManufacturer(b))),
            Promise.all((storBrands || []).map((b: string) => api.getStorageModelsByManufacturer(b))),
          ]);
          if (cancelled) return;
          const pvModels = pvModelsArr.flat();
          const invModels = invModelsArr.flat();
          const stModels = storModelsArr.flat();
          setData({
            modules: (pvModels || []).map((m: any) => ({
              id: String(m.id),
              kategorie: m.kategorie,
              hersteller: m.hersteller,
              produkt_modell: m.produkt_modell,
              pv_modul_leistung: m.pv_modul_leistung,
            })),
            inverters: (invModels || []).map((m: any) => ({
              id: String(m.id),
              kategorie: m.kategorie,
              hersteller: m.hersteller,
              produkt_modell: m.produkt_modell,
              wr_leistung_kw: m.wr_leistung_kw,
            })),
            storages: (stModels || []).map((m: any) => ({
              id: String(m.id),
              kategorie: m.kategorie,
              hersteller: m.hersteller,
              produkt_modell: m.produkt_modell,
              kapazitaet_speicher_kwh: m.kapazitaet_speicher_kwh,
            })),
          });
          setLoaded(true);
        } catch (e) {
          console.error('Echt-Daten Laden fehlgeschlagen, fallback Mock', e);
          setLoaded(true);
        }
      }
      loadReal();
      return () => { cancelled = true; };
    }, []);
  
  return { ...data, loaded };
}

export default function SolarCalculator(): JSX.Element {
  const navigate = useNavigate();
  const { state: projectState } = useProject();
  const { modules: moduleProducts, inverters, storages } = useProducts();
  const toast = useRef<Toast>(null);

  // Wizard Steps
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: 'Module', icon: 'pi pi-th-large' },
    { label: 'Wechselrichter', icon: 'pi pi-bolt' },
    { label: 'Speicher', icon: 'pi pi-battery-2' },
    { label: 'Zusatzkomponenten', icon: 'pi pi-cog' },
    { label: 'Ergebnisse', icon: 'pi pi-chart-line' }
  ];

  // Calculation State
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // State für zusätzliche Komponenten
  const [wallboxProducts, setWallboxProducts] = useState<Product[]>([]);
  const [emsProducts, setEmsProducts] = useState<Product[]>([]);
  const [optimizerProducts, setOptimizerProducts] = useState<Product[]>([]);
  const [carportProducts, setCarportProducts] = useState<Product[]>([]);
  const [emergencyPowerProducts, setEmergencyPowerProducts] = useState<Product[]>([]);
  const [animalProtectionProducts, setAnimalProtectionProducts] = useState<Product[]>([]);

  // Removed legacy step system - now using activeStep only

  // Solar Config State - initialisiert mit realistischen Demo-Werten aus echter DB
  const [config, setConfig] = useState<SolarConfig>(() => ({
    moduleQty: 20,
    moduleBrand: 'ViessmannPV',
    moduleModel: 'Vitovolt 300-DG M440HC',
    moduleProductId: 0,
    invBrand: '',
    invModel: '',
    invProductId: 0,
    invQty: 1,
    withStorage: false,
    storageBrand: '',
    storageModel: '',
    storageProductId: 0,
    storageDesiredKWh: 0,
    
    // Zusätzliche Komponenten
    additionalComponents: false,
    wallboxEnabled: false,
    wallboxBrand: '',
    wallboxModel: '',
    wallboxProductId: 0,
    emsEnabled: false,
    emsBrand: '',
    emsModel: '',
    emsProductId: 0,
    optimizerEnabled: false,
    optimizerBrand: '',
    optimizerModel: '',
    optimizerProductId: 0,
    optimizerQty: 1,
    carportEnabled: false,
    carportBrand: '',
    carportModel: '',
    carportProductId: 0,
    emergencyPowerEnabled: false,
    emergencyPowerBrand: '',
    emergencyPowerModel: '',
    emergencyPowerProductId: 0,
    animalProtectionEnabled: false,
    animalProtectionBrand: '',
    animalProtectionModel: '',
    animalProtectionProductId: 0,
    
    otherComponentNote: '',
  }));

  // Gebäudedaten für intelligente Vorschläge
  const buildingData = projectState.building;
  const roofArea = buildingData?.roofArea || 0;
  const roofOrientation = buildingData?.roofOrientation || 'Süd';
  const roofTilt = buildingData?.roofTilt || 35;

  // Intelligente Vorschläge basierend auf Gebäudedaten
  const suggestions = useMemo(() => {
    if (roofArea > 0) {
      const estimatedModules = Math.floor(roofArea / 2); // ~2m² pro Modul
      const suggestedQty = Math.min(Math.max(estimatedModules, 12), 50); // 12-50 Module
      return {
        moduleQty: suggestedQty,
        hint: `Für ${roofArea}m² Dachfläche (${roofOrientation}, ${roofTilt}°) werden ca. ${suggestedQty} Module empfohlen`,
      };
    }
    return { moduleQty: 20, hint: 'Standard-Empfehlung für mittleres Einfamilienhaus' };
  }, [roofArea, roofOrientation, roofTilt]);

  // Perform Calculations using IPC Bridge
  const performCalculations = async () => {
    setIsCalculating(true);
    try {
      // Convert configuration to calculation format
      const selectedModule = moduleProducts.find(m => m.hersteller === config.moduleBrand && m.produkt_modell === config.moduleModel);
      const selectedInverter = inverters.find(i => i.hersteller === config.invBrand && i.produkt_modell === config.invModel);
      const selectedStorage = storages.find(s => s.hersteller === config.storageBrand && s.produkt_modell === config.storageModel);

      if (!selectedModule) {
        toast.current?.show({severity:'error', summary: 'Fehler', detail: 'Bitte wählen Sie ein Modul aus'});
        return;
      }

      if (!selectedInverter) {
        toast.current?.show({severity:'error', summary: 'Fehler', detail: 'Bitte wählen Sie einen Wechselrichter aus'});
        return;
      }

      const calculationConfig = {
        selectedModules: [{
          id: selectedModule.id,
          name: selectedModule.produkt_modell,
          manufacturer: selectedModule.hersteller,
          power_wp: selectedModule.pv_modul_leistung || 440,
          price_netto: 300, // Mock price - later from real database
          count: config.moduleQty
        }],
        selectedInverters: [{
          id: selectedInverter.id,
          name: selectedInverter.produkt_modell,
          manufacturer: selectedInverter.hersteller,
          power_kw: selectedInverter.wr_leistung_kw || 10,
          price_netto: 2000, // Mock price
          count: config.invQty
        }],
        selectedBatteries: config.withStorage && selectedStorage ? [{
          id: selectedStorage.id,
          name: selectedStorage.produkt_modell,
          manufacturer: selectedStorage.hersteller,
          capacity_kwh: selectedStorage.kapazitaet_speicher_kwh || 10,
          price_netto: 8000, // Mock price
          count: 1
        }] : [],
        additionalComponents: [],
        locationData: {
          city: 'Berlin', // Default or from project state
          coordinates: { lat: 52.52, lng: 13.405 }
        },
        consumptionData: {
          annual_consumption_kwh: 4000, // Default consumption
          consumption_profile: 'residential'
        },
        technicalParams: {
          roof_azimuth: 180, // South
          roof_inclination: 35,
          shading_factor: 1.0,
          installation_type: 'roof'
        }
      };

      // Call IPC calculation handler
      const calculationAPI = (window as any).calculationAPI;
      if (!calculationAPI) {
        throw new Error('Calculation API not available');
      }

      const result = await calculationAPI.performCalculations(calculationConfig);

      if (result.success) {
        setCalculationResults(result.results);
        setActiveStep(4); // Navigate to results step
        toast.current?.show({severity:'success', summary: 'Erfolg', detail: 'Berechnungen abgeschlossen'});
      } else {
        throw new Error(result.error || 'Unknown calculation error');
      }

    } catch (error) {
      console.error('Calculation error:', error);
      toast.current?.show({severity:'error', summary: 'Berechnungsfehler', detail: error instanceof Error ? error.message : 'Unbekannter Fehler'});
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-Vorschlag beim ersten Laden
  useEffect(() => {
    if (config.moduleQty === 20 && suggestions.moduleQty !== 20) {
      setConfig(prev => ({ ...prev, moduleQty: suggestions.moduleQty }));
    }
  }, [suggestions.moduleQty, config.moduleQty]);

  // Lade zusätzliche Komponenten per Python Bridge
  useEffect(() => {
    async function loadAdditionalComponents() {
      if (!config.additionalComponents) return;

      try {
        // Wallbox
        if (config.wallboxEnabled && wallboxProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getWallboxManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getWallboxModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setWallboxProducts(allModels);
        }

        // EMS
        if (config.emsEnabled && emsProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getEMSManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getEMSModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setEmsProducts(allModels);
        }

        // Optimizer
        if (config.optimizerEnabled && optimizerProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getOptimizerManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getOptimizerModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setOptimizerProducts(allModels);
        }

        // Carport
        if (config.carportEnabled && carportProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getCarportManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getCarportModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setCarportProducts(allModels);
        }

        // Emergency Power
        if (config.emergencyPowerEnabled && emergencyPowerProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getEmergencyPowerManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getEmergencyPowerModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setEmergencyPowerProducts(allModels);
        }

        // Animal Protection
        if (config.animalProtectionEnabled && animalProtectionProducts.length === 0) {
          const brands: string[] = (window as any).solarAPI ? await (window as any).solarAPI.getAnimalProtectionManufacturers() : [];
          const allModels = (await Promise.all(
            brands.map(async (b: string) => {
              const models = await (window as any).solarAPI.getAnimalProtectionModelsByManufacturer(b);
              return models.map((m: any) => ({
                id: String(m.id),
                kategorie: m.kategorie,
                hersteller: m.hersteller,
                produkt_modell: m.produkt_modell,
              } as Product));
            })
          )).flat();
          setAnimalProtectionProducts(allModels);
        }
      } catch (error) {
        console.error('Fehler beim Laden der zusätzlichen Komponenten:', error);
      }
    }

    loadAdditionalComponents();
  }, [config.additionalComponents, config.wallboxEnabled, config.emsEnabled, config.optimizerEnabled, 
      config.carportEnabled, config.emergencyPowerEnabled, config.animalProtectionEnabled,
      wallboxProducts.length, emsProducts.length, optimizerProducts.length, carportProducts.length,
      emergencyPowerProducts.length, animalProtectionProducts.length]);

  // Ableitungen
  const filteredModuleModels = moduleProducts.filter(p => !config.moduleBrand || p.hersteller === config.moduleBrand);
  const currentModule = filteredModuleModels.find(p => p.produkt_modell === config.moduleModel);
  const moduleWp = currentModule?.pv_modul_leistung || 0;
  const kWp = useMemo(() => (config.moduleQty * moduleWp) / 1000, [config.moduleQty, moduleWp]);

  const inverterBrands = Array.from(new Set(inverters.map(p => p.hersteller))).sort();
  const moduleBrands = Array.from(new Set(moduleProducts.map(p => p.hersteller))).sort();
  const storageBrands = Array.from(new Set(storages.map(p => p.hersteller))).sort();
  
  // Brands für zusätzliche Komponenten
  const wallboxBrands = Array.from(new Set(wallboxProducts.map((p: Product) => p.hersteller))).sort();
  const emsBrands = Array.from(new Set(emsProducts.map((p: Product) => p.hersteller))).sort();
  const optimizerBrands = Array.from(new Set(optimizerProducts.map((p: Product) => p.hersteller))).sort();
  const carportBrands = Array.from(new Set(carportProducts.map((p: Product) => p.hersteller))).sort();
  const emergencyPowerBrands = Array.from(new Set(emergencyPowerProducts.map((p: Product) => p.hersteller))).sort();
  const animalProtectionBrands = Array.from(new Set(animalProtectionProducts.map((p: Product) => p.hersteller))).sort();

  const filteredInvModels = inverters.filter(p => !config.invBrand || p.hersteller === config.invBrand);
  const currentInv = filteredInvModels.find(p => p.produkt_modell === config.invModel);
  const totalInvPowerKW = (currentInv?.wr_leistung_kw || 0) * config.invQty;

  const filteredStorageModels = storages.filter(p => !config.storageBrand || p.hersteller === config.storageBrand);
  const currentStorage = filteredStorageModels.find(p => p.produkt_modell === config.storageModel);
  const storageModelKWh = currentStorage?.kapazitaet_speicher_kwh || 0;
  
  // Data processing for all dropdowns
  const moduleModels = moduleProducts.filter((p: Product) => !config.moduleBrand || p.hersteller === config.moduleBrand);
  const inverterModels = inverters.filter((p: Product) => !config.invBrand || p.hersteller === config.invBrand);
  const storageModels = storages.filter((p: Product) => !config.storageBrand || p.hersteller === config.storageBrand);
  const wallboxModels = wallboxProducts.filter((p: Product) => !config.wallboxBrand || p.hersteller === config.wallboxBrand);
  const emsModels = emsProducts.filter((p: Product) => !config.emsBrand || p.hersteller === config.emsBrand);
  const optimizerModels = optimizerProducts.filter((p: Product) => !config.optimizerBrand || p.hersteller === config.optimizerBrand);
  const carportModels = carportProducts.filter((p: Product) => !config.carportBrand || p.hersteller === config.carportBrand);
  const emergencyPowerModels = emergencyPowerProducts.filter((p: Product) => !config.emergencyPowerBrand || p.hersteller === config.emergencyPowerBrand);
  const animalProtectionModels = animalProtectionProducts.filter((p: Product) => !config.animalProtectionBrand || p.hersteller === config.animalProtectionBrand);

  // Validierung basierend auf activeStep (für PrimeReact Navigation)
  const errors: string[] = [];
  if (activeStep === 0) { // Module Step
    if (config.moduleQty <= 0) errors.push('Anzahl Module > 0 erforderlich');
    if (!config.moduleModel) errors.push('Modul-Modell wählen');
    if (!config.invModel) errors.push('Wechselrichter-Modell wählen');
    if (config.invQty <= 0) errors.push('Anzahl Wechselrichter > 0 erforderlich');
    if (config.withStorage && !config.storageModel) errors.push('Speicher-Modell wählen (wenn Speicher aktiviert)');
  }
  
  if (activeStep === 1 && config.additionalComponents) { // Additional Components Step
    if (config.wallboxEnabled && !config.wallboxModel) errors.push('Wallbox-Modell wählen');
    if (config.emsEnabled && !config.emsModel) errors.push('EMS-Modell wählen');
    if (config.optimizerEnabled && !config.optimizerModel) errors.push('Optimizer-Modell wählen');
    if (config.carportEnabled && !config.carportModel) errors.push('Carport-Modell wählen');
    if (config.emergencyPowerEnabled && !config.emergencyPowerModel) errors.push('Notstrom-Modell wählen');
    if (config.animalProtectionEnabled && !config.animalProtectionModel) errors.push('Tierabwehr-Modell wählen');
  }

  async function finishAndBack() {
    try {
      // Start calculations instead of navigating away
      await performCalculations();
    } catch (error) {
      console.error('Calculation error:', error);
      toast.current?.show({severity:'error', summary: 'Fehler', detail: 'Berechnungen konnten nicht gestartet werden'});
    }
  }

  // Navigation functions
  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Step content renderers
  const renderModuleStep = () => (
    <Card title="🔆 PV-Module konfigurieren">
      <div className="grid">
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Anzahl Module</label>
          <InputNumber
            value={config.moduleQty}
            onValueChange={(e) => setConfig(prev => ({...prev, moduleQty: e.value || 0}))}
            min={1}
            max={100}
            showButtons
            className="w-full"
          />
        </div>
        
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Hersteller</label>
          <Dropdown
            value={config.moduleBrand}
            onChange={(e) => setConfig(prev => ({...prev, moduleBrand: e.value, moduleModel: ''}))}
            options={moduleBrands.map(brand => ({ label: brand, value: brand }))}
            placeholder="Hersteller wählen"
            className="w-full"
            filter
          />
        </div>
        
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Modell</label>
          <Dropdown
            value={config.moduleModel}
            onChange={(e) => setConfig(prev => ({...prev, moduleModel: e.value}))}
            options={moduleModels.map(product => ({ 
              label: `${product.produkt_modell} (${product.pv_modul_leistung}W)`, 
              value: product.produkt_modell 
            }))}
            placeholder="Modell wählen"
            className="w-full"
            disabled={!config.moduleBrand}
            filter
          />
        </div>
      </div>
      
      {config.moduleModel && (
        <Message 
          severity="success" 
          text={`Ausgewählt: ${config.moduleQty} × ${config.moduleModel}`}
          className="mt-3"
        />
      )}
    </Card>
  );

  const renderInverterStep = () => (
    <Card title="⚡ Wechselrichter konfigurieren">
      <div className="grid">
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Anzahl Wechselrichter</label>
          <InputNumber
            value={config.invQty}
            onValueChange={(e) => setConfig(prev => ({...prev, invQty: Math.max(1, e.value || 1)}))}
            min={1}
            max={10}
            showButtons
            className="w-full"
          />
        </div>
        
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Hersteller</label>
          <Dropdown
            value={config.invBrand}
            onChange={(e) => setConfig(prev => ({...prev, invBrand: e.value, invModel: ''}))}
            options={inverterBrands.map(brand => ({ label: brand, value: brand }))}
            placeholder="Hersteller wählen"
            className="w-full"
            filter
          />
        </div>
        
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Modell</label>
          <Dropdown
            value={config.invModel}
            onChange={(e) => setConfig(prev => ({...prev, invModel: e.value}))}
            options={inverterModels.map(product => ({ 
              label: `${product.produkt_modell} (${product.wr_leistung_kw}kW)`, 
              value: product.produkt_modell 
            }))}
            placeholder="Modell wählen"
            className="w-full"
            disabled={!config.invBrand}
            filter
          />
        </div>
      </div>
      
      {config.invModel && (
        <Message 
          severity="success" 
          text={`Ausgewählt: ${config.invQty} × ${config.invModel}`}
          className="mt-3"
        />
      )}
    </Card>
  );

  const renderStorageStep = () => (
    <Card title="🔋 Batteriespeicher (optional)">
      <div className="mb-4">
        <Checkbox
          inputId="storage-checkbox"
          checked={config.withStorage}
          onChange={(e) => setConfig(prev => ({...prev, withStorage: !!e.checked}))}
        />
        <label htmlFor="storage-checkbox" className="ml-2 text-900 font-medium">
          Batteriespeicher hinzufügen
        </label>
      </div>
      
      {config.withStorage && (
        <div className="grid">
          <div className="col-12 md:col-4">
            <label className="block text-900 font-medium mb-2">Gewünschte Kapazität (kWh)</label>
            <InputNumber
              value={config.storageDesiredKWh}
              onValueChange={(e) => setConfig(prev => ({...prev, storageDesiredKWh: e.value || 0}))}
              min={0}
              max={100}
              suffix=" kWh"
              className="w-full"
            />
          </div>
          
          <div className="col-12 md:col-4">
            <label className="block text-900 font-medium mb-2">Hersteller</label>
            <Dropdown
              value={config.storageBrand}
              onChange={(e) => setConfig(prev => ({...prev, storageBrand: e.value, storageModel: ''}))}
              options={storageBrands.map(brand => ({ label: brand, value: brand }))}
              placeholder="Hersteller wählen"
              className="w-full"
              filter
            />
          </div>
          
          <div className="col-12 md:col-4">
            <label className="block text-900 font-medium mb-2">Modell</label>
            <Dropdown
              value={config.storageModel}
              onChange={(e) => setConfig(prev => ({...prev, storageModel: e.value}))}
              options={storageModels.map(product => ({ 
                label: `${product.produkt_modell} (${product.kapazitaet_speicher_kwh}kWh)`, 
                value: product.produkt_modell 
              }))}
              placeholder="Modell wählen"
              className="w-full"
              disabled={!config.storageBrand}
              filter
            />
          </div>
        </div>
      )}
    </Card>
  );

  const renderAdditionalStep = () => (
    <Card title="🔧 Zusatzkomponenten (optional)">
      <div className="mb-4">
        <Checkbox
          inputId="additional-checkbox"
          checked={config.additionalComponents}
          onChange={(e) => setConfig(prev => ({...prev, additionalComponents: !!e.checked}))}
        />
        <label htmlFor="additional-checkbox" className="ml-2 text-900 font-medium">
          Zusatzkomponenten konfigurieren
        </label>
      </div>
      
      {config.additionalComponents && (
        <Accordion multiple>
          <AccordionTab header="🚗 Wallbox">
            <div className="mb-3">
              <Checkbox
                inputId="wallbox-checkbox"
                checked={config.wallboxEnabled}
                onChange={(e) => setConfig(prev => ({...prev, wallboxEnabled: !!e.checked}))}
              />
              <label htmlFor="wallbox-checkbox" className="ml-2">Wallbox hinzufügen</label>
            </div>
            {config.wallboxEnabled && (
              <div className="grid">
                <div className="col-12 md:col-6">
                  <Dropdown
                    value={config.wallboxBrand}
                    onChange={(e) => setConfig(prev => ({...prev, wallboxBrand: e.value, wallboxModel: ''}))}
                    options={wallboxBrands.map(brand => ({ label: brand, value: brand }))}
                    placeholder="Hersteller wählen"
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <Dropdown
                    value={config.wallboxModel}
                    onChange={(e) => setConfig(prev => ({...prev, wallboxModel: e.value}))}
                    options={wallboxModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell }))}
                    placeholder="Modell wählen"
                    className="w-full"
                    disabled={!config.wallboxBrand}
                  />
                </div>
              </div>
            )}
          </AccordionTab>
        </Accordion>
      )}
    </Card>
  );

  const renderResultsStep = () => (
    <div>
      {/* Configuration Summary Header */}
      <Card title="� Anlagenkonfiguration" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4">
            <Panel header="⚡ PV-Module" className="h-full">
              <div className="flex flex-column gap-2">
                <Badge value={`${config.moduleQty} Stück`} severity="info" size="large" />
                <p className="m-0"><strong>Hersteller:</strong> {config.moduleBrand}</p>
                <p className="m-0"><strong>Modell:</strong> {config.moduleModel}</p>
              </div>
            </Panel>
          </div>
          <div className="col-12 md:col-4">
            <Panel header="🔄 Wechselrichter" className="h-full">
              <div className="flex flex-column gap-2">
                <Badge value={`${config.invQty} Stück`} severity="warning" size="large" />
                <p className="m-0"><strong>Hersteller:</strong> {config.invBrand}</p>
                <p className="m-0"><strong>Modell:</strong> {config.invModel}</p>
              </div>
            </Panel>
          </div>
          <div className="col-12 md:col-4">
            <Panel header="🔋 Speicher" className="h-full">
              {config.withStorage ? (
                <div className="flex flex-column gap-2">
                  <Badge value={`${config.storageDesiredKWh} kWh`} severity="success" size="large" />
                  <p className="m-0"><strong>Hersteller:</strong> {config.storageBrand}</p>
                  <p className="m-0"><strong>Modell:</strong> {config.storageModel}</p>
                </div>
              ) : (
                <Message severity="info" text="Kein Speicher konfiguriert" />
              )}
            </Panel>
          </div>
        </div>
      </Card>

      {/* Calculation Results */}
      {calculationResults ? (
        <CalculationResultsComponent 
          results={calculationResults}
          isLoading={isCalculating}
          onRecalculate={performCalculations}
        />
      ) : (
        <Card title="� Berechnungen starten">
          <div className="text-center p-6">
            <div className="mb-4">
              <i className="pi pi-calculator text-6xl text-primary"></i>
            </div>
            <h3>Bereit für die Berechnung</h3>
            <p className="text-600 mb-4">
              Ihre Anlagenkonfiguration ist vollständig. Starten Sie jetzt die detaillierte Berechnung 
              mit Ertrag, Kosten und Amortisation.
            </p>
            <Button 
              label={isCalculating ? "Berechnung läuft..." : "Berechnungen starten"}
              icon={isCalculating ? "pi pi-spin pi-spinner" : "pi pi-play"}
              size="large"
              severity="success"
              onClick={performCalculations}
              loading={isCalculating}
              disabled={isCalculating}
              className="mb-2"
            />
            <div className="text-sm text-500">
              Die Berechnung dauert ca. 10-30 Sekunden
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="mt-4">
        <div className="flex justify-content-between">
          <Button 
            label="Zurück zur Konfiguration"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => setActiveStep(3)}
          />
          {calculationResults && (
            <Button 
              label="PDF erstellen"
              icon="pi pi-file-pdf"
              severity="success"
              onClick={() => {
                // TODO: Implement PDF generation
                toast.current?.show({severity:'info', summary: 'PDF', detail: 'PDF-Erstellung wird implementiert...'});
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderModuleStep();
      case 1: return renderInverterStep();
      case 2: return renderStorageStep();
      case 3: return renderAdditionalStep();
      case 4: return renderResultsStep();
      default: return null;
    }
  };

  return (
    <div className="solar-calculator-container min-h-screen bg-gray-50 p-4">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4">
        <Card>
          <div className="flex align-items-center justify-content-between">
            <div>
              <h1 className="text-3xl font-bold text-900 m-0">
                ☀️ Solarkalkulator
              </h1>
              <p className="text-600 m-0 mt-2">
                Konfigurieren Sie Ihre Photovoltaikanlage in 5 einfachen Schritten
              </p>
            </div>
            <Button 
              icon="pi pi-arrow-left" 
              label="Zurück"
              className="p-button-outlined"
              onClick={() => navigate(-1)}
            />
          </div>
        </Card>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto mb-4">
        <Card>
          <Steps 
            model={steps} 
            activeIndex={activeStep}
            onSelect={(e) => setActiveStep(e.index)}
            readOnly={false}
          />
          
          <div className="mt-3">
            <ProgressBar 
              value={((activeStep + 1) / steps.length) * 100} 
              showValue={false}
              className="h-1rem"
            />
            <div className="text-center mt-2 text-600">
              Schritt {activeStep + 1} von {steps.length}: {steps[activeStep].label}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mb-4">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      {activeStep < 4 && (
        <div className="max-w-7xl mx-auto">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <Button 
                label="Zurück"
                icon="pi pi-arrow-left"
                className="p-button-outlined"
                onClick={prevStep}
                disabled={activeStep === 0}
              />
              
              <div className="text-center">
                <small className="text-500">
                  {errors.length > 0 ? `${errors.length} Fehler beheben` : 'Bereit für nächsten Schritt'}
                </small>
              </div>
              
              <Button 
                label="Weiter"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={nextStep}
                disabled={errors.length > 0}
              />
            </div>
          </Card>
        </div>
      )}
      
      <style>{`
        .solar-calculator-container .p-steps .p-steps-item.p-highlight .p-steps-number {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          border-color: #FF6B35;
        }
        
        .solar-calculator-container .p-progressbar .p-progressbar-value {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        }
      `}</style>
    </div>
  );
}
