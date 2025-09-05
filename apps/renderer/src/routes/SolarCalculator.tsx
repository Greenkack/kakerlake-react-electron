import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../lib/projectContext';

// Placeholder Product Type
interface Product { id: string; category: string; brand: string; model: string; capacity_w?: number; power_kw?: number; storage_kwh?: number; }

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
    // @todo: Backend Integration (Python Bridge) -> load products per category
    // Für jetzt: Erweiterte Mock-Daten basierend auf echter Produktdatenbank-Struktur
    const mock: Product[] = [
      // PV Module - Realistische Hersteller aus DB
      { id: 'm1', category: 'PV Modul', brand: 'ViessmannPV', model: 'Vitovolt 300-DG M440HC', capacity_w: 440 },
      { id: 'm2', category: 'PV Modul', brand: 'ViessmannPV', model: 'Vitovolt 300-DG M445HC', capacity_w: 445 },
      { id: 'm3', category: 'PV Modul', brand: 'ViessmannPV', model: 'Vitovolt 300-DG M450HC', capacity_w: 450 },
      { id: 'm4', category: 'PV Modul', brand: 'SolarfabrikPV', model: 'Mono S4 440W', capacity_w: 440 },
      { id: 'm5', category: 'PV Modul', brand: 'SolarfabrikPV', model: 'Mono S4 450W', capacity_w: 450 },
      { id: 'm6', category: 'PV Modul', brand: 'TrinaSolarPV', model: 'Vertex S+ 440W', capacity_w: 440 },
      { id: 'm7', category: 'PV Modul', brand: 'TrinaSolarPV', model: 'Vertex S+ 455W', capacity_w: 455 },
      { id: 'm8', category: 'PV Modul', brand: 'AikoSolarPV', model: 'A460-MAH54Mb', capacity_w: 460 },
      
      // Wechselrichter - Realistische Hersteller
      { id: 'wr1', category: 'Wechselrichter', brand: 'HuaweiWR', model: 'SUN2000-8KTL-M1', power_kw: 8 },
      { id: 'wr2', category: 'Wechselrichter', brand: 'HuaweiWR', model: 'SUN2000-10KTL-M1', power_kw: 10 },
      { id: 'wr3', category: 'Wechselrichter', brand: 'HuaweiWR', model: 'SUN2000-12KTL-M5', power_kw: 12 },
      { id: 'wr4', category: 'Wechselrichter', brand: 'GoodWeWR', model: 'GW8K-DT', power_kw: 8 },
      { id: 'wr5', category: 'Wechselrichter', brand: 'GoodWeWR', model: 'GW10K-DT', power_kw: 10 },
      { id: 'wr6', category: 'Wechselrichter', brand: 'FoxWR', model: 'FoxESS T8', power_kw: 8 },
      { id: 'wr7', category: 'Wechselrichter', brand: 'SungrowWR', model: 'SG8K-D', power_kw: 8 },
      
      // Batteriespeicher - Realistische Hersteller  
      { id: 's1', category: 'Batteriespeicher', brand: 'HuaweiSpeicher', model: 'LUNA2000-10-S0', storage_kwh: 10 },
      { id: 's2', category: 'Batteriespeicher', brand: 'HuaweiSpeicher', model: 'LUNA2000-15-S0', storage_kwh: 15 },
      { id: 's3', category: 'Batteriespeicher', brand: 'SungrowSpeicher', model: 'SBR096', storage_kwh: 9.6 },
      { id: 's4', category: 'Batteriespeicher', brand: 'SungrowSpeicher', model: 'SBR128', storage_kwh: 12.8 },
      { id: 's5', category: 'Batteriespeicher', brand: 'AlphaSpeicher', model: 'SMILE-B3', storage_kwh: 5.7 },
      { id: 's6', category: 'Batteriespeicher', brand: 'FoxSpeicher', model: 'ECS4100', storage_kwh: 10.2 },
      { id: 's7', category: 'Batteriespeicher', brand: 'GoodWeSpeicher', model: 'Lynx Home F G2', storage_kwh: 6.1 },
      { id: 's8', category: 'Batteriespeicher', brand: 'ViessmannSpeicher', model: 'Vitocharge VX3', storage_kwh: 7.7 },
    ];
    
    setData({
      modules: mock.filter(p => p.category === 'PV Modul'),
      inverters: mock.filter(p => p.category === 'Wechselrichter'),
      storages: mock.filter(p => p.category === 'Batteriespeicher'),
    });
    setLoaded(true);
  }, []);
  
  return { ...data, loaded };
}

export default function SolarCalculator(): JSX.Element {
  const navigate = useNavigate();
  const { state: projectState } = useProject();
  const { modules: moduleProducts, inverters, storages } = useProducts();

  // State für zusätzliche Komponenten
  const [wallboxProducts, setWallboxProducts] = useState<Product[]>([]);
  const [emsProducts, setEmsProducts] = useState<Product[]>([]);
  const [optimizerProducts, setOptimizerProducts] = useState<Product[]>([]);
  const [carportProducts, setCarportProducts] = useState<Product[]>([]);
  const [emergencyPowerProducts, setEmergencyPowerProducts] = useState<Product[]>([]);
  const [animalProtectionProducts, setAnimalProtectionProducts] = useState<Product[]>([]);

  // Schritt-Logik (2 Seiten: Technik Kern / Zusatz folgt später)
  const [step, setStep] = useState<number>(1);

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
  const roofArea = buildingData.freeAreaM2 || 0;
  const roofOrientation = buildingData.roofOrientation || 'Süd';
  const roofTilt = buildingData.tiltDeg || 35;

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
          const response = await fetch('/api/solar-calculator/manufacturers/wallbox');
          if (response.ok) {
            const data = await response.json();
            setWallboxProducts(data.products || []);
          }
        }

        // EMS
        if (config.emsEnabled && emsProducts.length === 0) {
          const response = await fetch('/api/solar-calculator/manufacturers/ems');
          if (response.ok) {
            const data = await response.json();
            setEmsProducts(data.products || []);
          }
        }

        // Optimizer
        if (config.optimizerEnabled && optimizerProducts.length === 0) {
          const response = await fetch('/api/solar-calculator/manufacturers/optimizers');
          if (response.ok) {
            const data = await response.json();
            setOptimizerProducts(data.products || []);
          }
        }

        // Carport
        if (config.carportEnabled && carportProducts.length === 0) {
          const response = await fetch('/api/solar-calculator/manufacturers/carports');
          if (response.ok) {
            const data = await response.json();
            setCarportProducts(data.products || []);
          }
        }

        // Emergency Power
        if (config.emergencyPowerEnabled && emergencyPowerProducts.length === 0) {
          const response = await fetch('/api/solar-calculator/manufacturers/emergency_power');
          if (response.ok) {
            const data = await response.json();
            setEmergencyPowerProducts(data.products || []);
          }
        }

        // Animal Protection
        if (config.animalProtectionEnabled && animalProtectionProducts.length === 0) {
          const response = await fetch('/api/solar-calculator/manufacturers/animal_protection');
          if (response.ok) {
            const data = await response.json();
            setAnimalProtectionProducts(data.products || []);
          }
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
  const filteredModuleModels = moduleProducts.filter(p => !config.moduleBrand || p.brand === config.moduleBrand);
  const currentModule = filteredModuleModels.find(p => p.model === config.moduleModel);
  const moduleWp = currentModule?.capacity_w || 0;
  const kWp = useMemo(() => (config.moduleQty * moduleWp) / 1000, [config.moduleQty, moduleWp]);

  const inverterBrands = Array.from(new Set(inverters.map(p => p.brand))).sort();
  const moduleBrands = Array.from(new Set(moduleProducts.map(p => p.brand))).sort();
  const storageBrands = Array.from(new Set(storages.map(p => p.brand))).sort();
  
  // Brands für zusätzliche Komponenten
  const wallboxBrands = Array.from(new Set(wallboxProducts.map((p: Product) => p.brand))).sort();
  const emsBrands = Array.from(new Set(emsProducts.map((p: Product) => p.brand))).sort();
  const optimizerBrands = Array.from(new Set(optimizerProducts.map((p: Product) => p.brand))).sort();
  const carportBrands = Array.from(new Set(carportProducts.map((p: Product) => p.brand))).sort();
  const emergencyPowerBrands = Array.from(new Set(emergencyPowerProducts.map((p: Product) => p.brand))).sort();
  const animalProtectionBrands = Array.from(new Set(animalProtectionProducts.map((p: Product) => p.brand))).sort();

  const filteredInvModels = inverters.filter(p => !config.invBrand || p.brand === config.invBrand);
  const currentInv = filteredInvModels.find(p => p.model === config.invModel);
  const totalInvPowerKW = (currentInv?.power_kw || 0) * config.invQty;

  const filteredStorageModels = storages.filter(p => !config.storageBrand || p.brand === config.storageBrand);
  const currentStorage = filteredStorageModels.find(p => p.model === config.storageModel);
  const storageModelKWh = currentStorage?.storage_kwh || 0;
  
  // Filtered Models für zusätzliche Komponenten
  const wallboxModels = wallboxProducts.filter((p: Product) => !config.wallboxBrand || p.brand === config.wallboxBrand);
  const emsModels = emsProducts.filter((p: Product) => !config.emsBrand || p.brand === config.emsBrand);
  const optimizerModels = optimizerProducts.filter((p: Product) => !config.optimizerBrand || p.brand === config.optimizerBrand);
  const carportModels = carportProducts.filter((p: Product) => !config.carportBrand || p.brand === config.carportBrand);
  const emergencyPowerModels = emergencyPowerProducts.filter((p: Product) => !config.emergencyPowerBrand || p.brand === config.emergencyPowerBrand);
  const animalProtectionModels = animalProtectionProducts.filter((p: Product) => !config.animalProtectionBrand || p.brand === config.animalProtectionBrand);

  // Validierung Kernschritt
  const errors: string[] = [];
  if (step === 1) {
    if (config.moduleQty <= 0) errors.push('Anzahl Module > 0 erforderlich');
    if (!config.moduleModel) errors.push('Modul-Modell wählen');
    if (!config.invModel) errors.push('Wechselrichter-Modell wählen');
    if (config.invQty <= 0) errors.push('Anzahl Wechselrichter > 0 erforderlich');
    if (config.withStorage && !config.storageModel) errors.push('Speicher-Modell wählen (wenn Speicher aktiviert)');
  }
  
  if (step === 2 && config.additionalComponents) {
    if (config.wallboxEnabled && !config.wallboxModel) errors.push('Wallbox-Modell wählen');
    if (config.emsEnabled && !config.emsModel) errors.push('EMS-Modell wählen');
    if (config.optimizerEnabled && !config.optimizerModel) errors.push('Optimizer-Modell wählen');
    if (config.carportEnabled && !config.carportModel) errors.push('Carport-Modell wählen');
    if (config.emergencyPowerEnabled && !config.emergencyPowerModel) errors.push('Notstrom-Modell wählen');
    if (config.animalProtectionEnabled && !config.animalProtectionModel) errors.push('Tierabwehr-Modell wählen');
  }

  function goNext() {
    if (errors.length === 0) {
      if (step === 1) setStep(2);
      // Schritt 2 ist letzter Schritt, führt direkt zu finishAndBack
    }
  }

  async function finishAndBack() {
    try {
      // Konfiguration im Backend speichern
      const response = await fetch('/api/solar-calculator/save-configuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) throw new Error('Fehler beim Speichern der Konfiguration');
      
      console.log('Solar Configuration gespeichert:', config);
      navigate('/results'); // Zu Ergebnissen navigieren
    } catch (error) {
      console.error('Speicherfehler:', error);
      alert('Konfiguration konnte nicht gespeichert werden');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-xl bg-white p-4 shadow flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Solarkalkulator</h1>
          <p className="text-gray-600 text-sm">Schritt {step} / 2 – Technik konfigurieren</p>
        </div>
        <span className="text-xs text-gray-400">Build SC-TS v1</span>
      </header>

      {step === 1 && (
        <section className="rounded-xl bg-white p-5 shadow space-y-8">
          
          {/* DEMO-HINWEIS */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">🚀 Demo-Konfiguration</span>
            </div>
            <div className="text-sm text-blue-700 grid gap-1 md:grid-cols-3">
              <div><strong>Anzahl Module:</strong> {config.moduleQty}</div>
              <div><strong>Leistung pro Modul:</strong> {moduleWp} Wp</div>
              <div><strong>Anlagengröße:</strong> {kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWp</div>
            </div>
          </div>

          {/* MODULE */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">PV Module</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm mb-1">Anzahl PV Module</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setConfig(prev => ({...prev, moduleQty: Math.max(0, prev.moduleQty - 1)}))} className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300">−</button>
                  <input type="number" className="w-full rounded border px-3 py-2" value={config.moduleQty} onChange={e => setConfig(prev => ({...prev, moduleQty: parseInt(e.target.value || '0', 10)}))} min={0} />
                  <button type="button" onClick={() => setConfig(prev => ({...prev, moduleQty: prev.moduleQty + 1}))} className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Hersteller</label>
                <select value={config.moduleBrand} onChange={e => { setConfig(prev => ({...prev, moduleBrand: e.target.value, moduleModel: ''})); }} className="w-full rounded border px-3 py-2">
                  <option value="">-- wählen --</option>
                  {moduleBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Modell</label>
                <select value={config.moduleModel} onChange={e => setConfig(prev => ({...prev, moduleModel: e.target.value}))} className="w-full rounded border px-3 py-2">
                  <option value="">-- wählen --</option>
                  {filteredModuleModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded border bg-gray-50 p-3 text-sm">
                <div className="text-gray-600">Leistung pro Modul (Wp)</div>
                <div className="font-semibold text-lg">{moduleWp || 0}</div>
              </div>
              <div className="rounded border bg-blue-50 p-3 text-sm border-blue-200">
                <div className="text-blue-700">Anlagengröße (kWp)</div>
                <div className="font-bold text-2xl text-blue-800">{kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="rounded border bg-green-50 p-3 text-sm border-green-200">
                <div className="text-green-700">Jahresertrag (geschätzt)</div>
                <div className="font-semibold text-lg text-green-800">{Math.round(kWp * 950).toLocaleString('de-DE')} kWh</div>
              </div>
            </div>
          </div>

          {/* WECHSELRICHTER */}
          <div className="space-y-4 pt-2 border-t">
            <h2 className="text-lg font-semibold">Wechselrichter</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm mb-1">Hersteller</label>
                <select value={config.invBrand} onChange={e => { setConfig(prev => ({...prev, invBrand: e.target.value, invModel: ''})); }} className="w-full rounded border px-3 py-2">
                  <option value="">-- wählen --</option>
                  {inverterBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Modell</label>
                <select value={config.invModel} onChange={e => setConfig(prev => ({...prev, invModel: e.target.value}))} className="w-full rounded border px-3 py-2">
                  <option value="">-- wählen --</option>
                  {filteredInvModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Anzahl WR</label>
                <input type="number" className="w-full rounded border px-3 py-2" value={config.invQty} onChange={e => setConfig(prev => ({...prev, invQty: Math.max(1, parseInt(e.target.value || '1', 10))}))} min={1} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded border bg-gray-50 p-3 text-sm">
                <div className="text-gray-600">Leistung je WR (kW)</div>
                <div className="font-semibold text-lg">{currentInv?.power_kw ?? 0}</div>
              </div>
              <div className="rounded border bg-gray-50 p-3 text-sm">
                <div className="text-gray-600">WR Gesamt (kW)</div>
                <div className="font-semibold text-lg">{totalInvPowerKW.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          {/* SPEICHER */}
          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center gap-3">
              <input id="withStorage" type="checkbox" checked={config.withStorage} onChange={e => setConfig(prev => ({...prev, withStorage: e.target.checked}))} />
              <label htmlFor="withStorage" className="text-sm font-medium">Batteriespeicher einplanen</label>
            </div>
            {config.withStorage && (
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm mb-1">Hersteller</label>
                  <select value={config.storageBrand} onChange={e => { setConfig(prev => ({...prev, storageBrand: e.target.value, storageModel: ''})); }} className="w-full rounded border px-3 py-2">
                    <option value="">-- wählen --</option>
                    {storageBrands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Modell</label>
                  <select value={config.storageModel} onChange={e => setConfig(prev => ({...prev, storageModel: e.target.value}))} className="w-full rounded border px-3 py-2">
                    <option value="">-- wählen --</option>
                    {filteredStorageModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Gewünschte Gesamtkapazität (kWh)</label>
                  <input type="number" className="w-full rounded border px-3 py-2" min={0} value={config.storageDesiredKWh} onChange={e => setConfig(prev => ({...prev, storageDesiredKWh: parseFloat(e.target.value || '0')}))} />
                </div>
                <div className="rounded border bg-gray-50 p-3 text-sm col-span-2">
                  <div className="text-gray-600">Kapazität Modell (kWh)</div>
                  <div className="font-semibold text-lg">{storageModelKWh || 0}</div>
                </div>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 space-y-1">
              {errors.map(e => <div key={e}>• {e}</div>)}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button onClick={goNext} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50" disabled={errors.length > 0}>Nächste Seite</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-xl bg-white p-5 shadow space-y-6">
          <h2 className="text-lg font-semibold">Zusätzliche Komponenten</h2>
          
          {/* Zusätzliche Komponenten aktivieren */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.additionalComponents}
                onChange={e => setConfig(prev => ({...prev, additionalComponents: e.target.checked}))}
              />
              <span>Zusätzliche Komponenten hinzufügen</span>
            </label>
          </div>

          {config.additionalComponents && (
            <div className="space-y-6">
              {/* Wallbox */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.wallboxEnabled}
                    onChange={e => setConfig(prev => ({...prev, wallboxEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Wallbox</span>
                </label>
                {config.wallboxEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.wallboxBrand}
                        onChange={e => setConfig(prev => ({...prev, wallboxBrand: e.target.value, wallboxModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {wallboxBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.wallboxModel}
                        onChange={e => setConfig(prev => ({...prev, wallboxModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {wallboxModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* EMS */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.emsEnabled}
                    onChange={e => setConfig(prev => ({...prev, emsEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Energie Management System (EMS)</span>
                </label>
                {config.emsEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.emsBrand}
                        onChange={e => setConfig(prev => ({...prev, emsBrand: e.target.value, emsModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {emsBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.emsModel}
                        onChange={e => setConfig(prev => ({...prev, emsModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {emsModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Optimizer */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.optimizerEnabled}
                    onChange={e => setConfig(prev => ({...prev, optimizerEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Optimizer</span>
                </label>
                {config.optimizerEnabled && (
                  <div className="grid gap-4 md:grid-cols-3 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.optimizerBrand}
                        onChange={e => setConfig(prev => ({...prev, optimizerBrand: e.target.value, optimizerModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {optimizerBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.optimizerModel}
                        onChange={e => setConfig(prev => ({...prev, optimizerModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {optimizerModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Anzahl</label>
                      <input
                        type="number"
                        value={config.optimizerQty}
                        onChange={e => setConfig(prev => ({...prev, optimizerQty: parseInt(e.target.value || '0', 10)}))}
                        className="w-full rounded border px-3 py-2"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Carport */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.carportEnabled}
                    onChange={e => setConfig(prev => ({...prev, carportEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Carport</span>
                </label>
                {config.carportEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.carportBrand}
                        onChange={e => setConfig(prev => ({...prev, carportBrand: e.target.value, carportModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {carportBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.carportModel}
                        onChange={e => setConfig(prev => ({...prev, carportModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {carportModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Notstrom */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.emergencyPowerEnabled}
                    onChange={e => setConfig(prev => ({...prev, emergencyPowerEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Notstrom</span>
                </label>
                {config.emergencyPowerEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.emergencyPowerBrand}
                        onChange={e => setConfig(prev => ({...prev, emergencyPowerBrand: e.target.value, emergencyPowerModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {emergencyPowerBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.emergencyPowerModel}
                        onChange={e => setConfig(prev => ({...prev, emergencyPowerModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {emergencyPowerModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Tierabwehr */}
              <div className="border rounded p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.animalProtectionEnabled}
                    onChange={e => setConfig(prev => ({...prev, animalProtectionEnabled: e.target.checked}))}
                  />
                  <span className="font-medium">Tierabwehr</span>
                </label>
                {config.animalProtectionEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 ml-6">
                    <div>
                      <label className="block text-sm mb-1">Hersteller</label>
                      <select
                        value={config.animalProtectionBrand}
                        onChange={e => setConfig(prev => ({...prev, animalProtectionBrand: e.target.value, animalProtectionModel: ''}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {animalProtectionBrands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Modell</label>
                      <select
                        value={config.animalProtectionModel}
                        onChange={e => setConfig(prev => ({...prev, animalProtectionModel: e.target.value}))}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">-- wählen --</option>
                        {animalProtectionModels.map(m => <option key={m.id} value={m.model}>{m.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Freitext */}
          <div>
            <label className="block text-sm mb-1">Sonstiges (frei)</label>
            <input
              value={config.otherComponentNote}
              onChange={e => setConfig(prev => ({ ...prev, otherComponentNote: e.target.value }))}
              maxLength={120}
              className="w-full rounded border px-3 py-2"
              placeholder="Freitext..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg">Zurück</button>
            <button onClick={finishAndBack} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">Berechnungen Starten</button>
          </div>
        </section>
      )}

      <div className="text-center">
        <Link to="/home" className="inline-block text-sm text-gray-500 hover:underline">← Zurück zur Startseite</Link>
      </div>
    </div>
  );
}
