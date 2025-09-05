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
  invBrand: string;
  invModel: string;
  invQty: number;
  withStorage: boolean;
  storageBrand: string;
  storageModel: string;
  storageDesiredKWh: number;
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

  // Schritt-Logik (2 Seiten: Technik Kern / Zusatz folgt später)
  const [step, setStep] = useState<number>(1);

  // Solar Config State - initialisiert mit realistischen Demo-Werten aus echter DB
  const [config, setConfig] = useState<SolarConfig>(() => ({
    moduleQty: 20,
    moduleBrand: 'ViessmannPV',
    moduleModel: 'Vitovolt 300-DG M440HC',
    invBrand: '',
    invModel: '',
    invQty: 1,
    withStorage: false,
    storageBrand: '',
    storageModel: '',
    storageDesiredKWh: 0,
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

  // Ableitungen
  const filteredModuleModels = moduleProducts.filter(p => !config.moduleBrand || p.brand === config.moduleBrand);
  const currentModule = filteredModuleModels.find(p => p.model === config.moduleModel);
  const moduleWp = currentModule?.capacity_w || 0;
  const kWp = useMemo(() => (config.moduleQty * moduleWp) / 1000, [config.moduleQty, moduleWp]);

  const inverterBrands = Array.from(new Set(inverters.map(p => p.brand))).sort();
  const moduleBrands = Array.from(new Set(moduleProducts.map(p => p.brand))).sort();
  const storageBrands = Array.from(new Set(storages.map(p => p.brand))).sort();

  const filteredInvModels = inverters.filter(p => !config.invBrand || p.brand === config.invBrand);
  const currentInv = filteredInvModels.find(p => p.model === config.invModel);
  const totalInvPowerKW = (currentInv?.power_kw || 0) * config.invQty;

  const filteredStorageModels = storages.filter(p => !config.storageBrand || p.brand === config.storageBrand);
  const currentStorage = filteredStorageModels.find(p => p.model === config.storageModel);
  const storageModelKWh = currentStorage?.storage_kwh || 0;

  // Validierung Kernschritt
  const errors: string[] = [];
  if (step === 1) {
    if (config.moduleQty <= 0) errors.push('Anzahl Module > 0 erforderlich');
    if (!config.moduleModel) errors.push('Modul-Modell wählen');
  }

  function goNext() {
    if (step === 1) {
      if (errors.length === 0) setStep(2);
      return;
    }
  }

  function finishAndBack() {
    // @todo: Später Config in projektContext speichern oder Backend übertragen
    console.log('Solar Configuration:', config);
    navigate('/results'); // Direkt zu Ergebnissen statt Menu
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
          <h2 className="text-lg font-semibold">Zusätzliche Komponenten (demnächst)</h2>
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
