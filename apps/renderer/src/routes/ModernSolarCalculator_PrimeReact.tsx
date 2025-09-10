import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Fallback für useProject - verwende beide mögliche Implementierungen
let useProject: any;
try {
  useProject = require('../state/project').useProject;
} catch {
  try {
    useProject = require('../lib/projectContext').useProject;
  } catch {
    // Fallback wenn beide fehlschlagen
    useProject = () => ({ 
      state: { 
        building: { roofArea: 50 } 
      } 
    });
  }
}

// ===== VOLLSTÄNDIGE PRIMEREACT INTEGRATION =====
// PrimeReact Core Components
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Messages } from 'primereact/messages';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Skeleton } from 'primereact/skeleton';
import { BlockUI } from 'primereact/blockui';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { SpeedDial } from 'primereact/speeddial';
import { Rating } from 'primereact/rating';
import { Knob } from 'primereact/knob';

// PrimeReact Icons
import 'primeicons/primeicons.css';

// PrimeReact Theme
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

// Produkt-Interface
interface Product {
  id: string;
  kategorie: string;
  hersteller: string;
  produkt_modell: string;
  pv_modul_leistung?: number;
  wr_leistung_kw?: number;
  kapazitaet_speicher_kwh?: number;
  price_euro?: number;
  efficiency_percent?: number;
  warranty_years?: number;
  origin_country?: string;
  description?: string;
  rating?: number;
  popularity?: number;
}

// Mock-Produkte Hook mit erweiterten Daten
function useProducts() {
  const [data, setData] = useState<{
    modules: Product[];
    inverters: Product[];
    storages: Product[];
    loaded: boolean;
  }>({
    modules: [],
    inverters: [],
    storages: [],
    loaded: false
  });

  useEffect(() => {
    // Simuliere API-Aufruf mit realistischen Daten
    const mockData = {
      modules: [
        {
          id: 'mod1',
          kategorie: 'Photovoltaik Modul',
          hersteller: 'JA Solar',
          produkt_modell: 'JAM72S30-545/MR',
          pv_modul_leistung: 545,
          price_euro: 245,
          efficiency_percent: 21.2,
          warranty_years: 25,
          origin_country: 'China',
          description: 'Hocheffizientes Monosilizium-Modul mit PERC-Technologie',
          rating: 4.7,
          popularity: 95
        },
        {
          id: 'mod2',
          kategorie: 'Photovoltaik Modul',
          hersteller: 'Longi Solar',
          produkt_modell: 'LR5-72HIH-550M',
          pv_modul_leistung: 550,
          price_euro: 265,
          efficiency_percent: 21.5,
          warranty_years: 25,
          origin_country: 'China',
          description: 'Premium Modul mit Hi-MO 5 Technologie',
          rating: 4.8,
          popularity: 88
        },
        {
          id: 'mod3',
          kategorie: 'Photovoltaik Modul',
          hersteller: 'Trina Solar',
          produkt_modell: 'TSM-545NEG20C.20',
          pv_modul_leistung: 545,
          price_euro: 235,
          efficiency_percent: 21.0,
          warranty_years: 25,
          origin_country: 'China',
          description: 'Vertex Serie mit hoher Leistung und Zuverlässigkeit',
          rating: 4.6,
          popularity: 82
        }
      ],
      inverters: [
        {
          id: 'inv1',
          kategorie: 'Wechselrichter',
          hersteller: 'SMA',
          produkt_modell: 'Sunny Boy 15000TL-30',
          wr_leistung_kw: 15,
          price_euro: 2850,
          efficiency_percent: 98.2,
          warranty_years: 10,
          origin_country: 'Deutschland',
          description: 'Bewährter String-Wechselrichter mit hohem Wirkungsgrad',
          rating: 4.9,
          popularity: 92
        },
        {
          id: 'inv2',
          kategorie: 'Wechselrichter',
          hersteller: 'Fronius',
          produkt_modell: 'Symo 15.0-3-M',
          wr_leistung_kw: 15,
          price_euro: 3150,
          efficiency_percent: 98.1,
          warranty_years: 12,
          origin_country: 'Österreich',
          description: 'Premium Wechselrichter mit erweiterten Monitoring-Funktionen',
          rating: 4.8,
          popularity: 87
        }
      ],
      storages: [
        {
          id: 'stor1',
          kategorie: 'Batteriespeicher',
          hersteller: 'BYD',
          produkt_modell: 'Battery-Box Premium HVS 10.2',
          kapazitaet_speicher_kwh: 10.24,
          price_euro: 6800,
          efficiency_percent: 95.0,
          warranty_years: 10,
          origin_country: 'China',
          description: 'Hochvolt-Batteriespeicher mit LiFePO4-Technologie',
          rating: 4.5,
          popularity: 78
        },
        {
          id: 'stor2',
          kategorie: 'Batteriespeicher',
          hersteller: 'Tesla',
          produkt_modell: 'Powerwall 2',
          kapazitaet_speicher_kwh: 13.5,
          price_euro: 8900,
          efficiency_percent: 90.0,
          warranty_years: 10,
          origin_country: 'USA',
          description: 'Integrierter AC-Batteriespeicher mit App-Steuerung',
          rating: 4.6,
          popularity: 85
        }
      ],
      loaded: true
    };

    setTimeout(() => setData(mockData), 1000);
  }, []);

  return data;
}

// Hauptkomponente mit vollständiger PrimeReact Integration
export default function ModernSolarCalculator() {
  const navigate = useNavigate();
  const { state: projectState } = useProject();
  const { modules, inverters, storages, loaded } = useProducts();
  
  // Toast für Benachrichtigungen
  const toast = useRef<Toast>(null);
  const messagesRef = useRef<Messages>(null);

  // State Management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModule, setSelectedModule] = useState<Product | null>(null);
  const [moduleQuantity, setModuleQuantity] = useState(20);
  const [selectedInverter, setSelectedInverter] = useState<Product | null>(null);
  const [inverterQuantity, setInverterQuantity] = useState(1);
  const [withStorage, setWithStorage] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<Product | null>(null);
  const [storageQuantity, setStorageQuantity] = useState(1);
  const [additionalComponents, setAdditionalComponents] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // UI State
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productDetailsVisible, setProductDetailsVisible] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Erweiterte Schritte-Konfiguration
  const steps = [
    {
      label: 'PV-Module',
      icon: 'pi pi-sun',
      description: 'Wählen Sie passende Solarmodule',
      command: () => setActiveStep(0)
    },
    {
      label: 'Wechselrichter',
      icon: 'pi pi-cog',
      description: 'Konfigurieren Sie den Wechselrichter',
      command: () => setActiveStep(1)
    },
    {
      label: 'Speicher',
      icon: 'pi pi-battery-3',
      description: 'Optional: Batteriespeicher hinzufügen',
      command: () => setActiveStep(2)
    },
    {
      label: 'Komponenten',
      icon: 'pi pi-plus-circle',
      description: 'Zusätzliche Ausrüstung',
      command: () => setActiveStep(3)
    },
    {
      label: 'Zusammenfassung',
      icon: 'pi pi-check-circle',
      description: 'Finale Konfiguration prüfen',
      command: () => setActiveStep(4)
    }
  ];

  // Berechnungen
  const calculations = useMemo(() => {
    const totalKWp = selectedModule ? (moduleQuantity * (selectedModule.pv_modul_leistung || 0)) / 1000 : 0;
    const totalInverterKW = selectedInverter ? inverterQuantity * (selectedInverter.wr_leistung_kw || 0) : 0;
    const totalStorageKWh = selectedStorage && withStorage ? storageQuantity * (selectedStorage.kapazitaet_speicher_kwh || 0) : 0;
    const estimatedYield = Math.round(totalKWp * 950);
    
    let totalPrice = 0;
    if (selectedModule?.price_euro) totalPrice += selectedModule.price_euro * moduleQuantity;
    if (selectedInverter?.price_euro) totalPrice += selectedInverter.price_euro * inverterQuantity;
    if (selectedStorage?.price_euro && withStorage) totalPrice += selectedStorage.price_euro * storageQuantity;

    return { totalKWp, totalInverterKW, totalStorageKWh, estimatedYield, totalPrice };
  }, [selectedModule, selectedInverter, selectedStorage, moduleQuantity, inverterQuantity, storageQuantity, withStorage]);

  // Zusätzliche Komponenten Optionen
  const additionalOptions = [
    { name: 'Monitoring System', key: 'monitoring', price: 450 },
    { name: 'Optimierer', key: 'optimizer', price: 1200 },
    { name: 'Blitzschutz', key: 'lightning', price: 350 },
    { name: 'Notstromfunktion', key: 'emergency', price: 800 },
    { name: 'Wallbox', key: 'wallbox', price: 1500 },
    { name: 'Smart Home Integration', key: 'smarthome', price: 600 }
  ];

  // Toolbar Komponenten
  const toolbarStartContent = (
    <div className="flex gap-2 align-items-center">
      <Avatar icon="pi pi-sun" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
      <span className="font-bold text-xl">Solar Konfigurator</span>
      <Badge value="PRO" severity="success" />
    </div>
  );

  const toolbarEndContent = (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-list" 
        className="p-button-outlined" 
        onClick={() => setSidebarVisible(true)}
        tooltip="Produktliste anzeigen"
        tooltipOptions={{position: 'bottom'}}
      />
      <Button 
        icon="pi pi-chart-line" 
        className="p-button-outlined"
        tooltip="Berechnungen anzeigen"
        tooltipOptions={{position: 'bottom'}}
      />
      <Button 
        icon="pi pi-cog" 
        className="p-button-outlined"
        tooltip="Einstellungen"
        tooltipOptions={{position: 'bottom'}}
      />
    </div>
  );

  // Speed Dial Aktionen
  const speedDialItems = [
    {
      label: 'Neu starten',
      icon: 'pi pi-refresh',
      command: () => {
        setSelectedModule(null);
        setSelectedInverter(null);
        setSelectedStorage(null);
        setActiveStep(0);
        toast.current?.show({severity:'info', summary: 'Zurückgesetzt', detail:'Konfiguration wurde zurückgesetzt'});
      }
    },
    {
      label: 'Speichern',
      icon: 'pi pi-save',
      command: () => {
        toast.current?.show({severity:'success', summary: 'Gespeichert', detail:'Konfiguration wurde gespeichert'});
      }
    },
    {
      label: 'Exportieren',
      icon: 'pi pi-download',
      command: () => {
        toast.current?.show({severity:'info', summary: 'Export', detail:'PDF wird generiert...'});
      }
    },
    {
      label: 'Hilfe',
      icon: 'pi pi-question-circle',
      command: () => {
        messagesRef.current?.show({
          severity: 'info',
          summary: 'Hilfe',
          detail: 'Wählen Sie zunächst PV-Module aus, dann Wechselrichter und optional einen Speicher.',
          life: 5000
        });
      }
    }
  ];

  // Produktkarte Template für DataTable
  const productCardTemplate = (product: Product) => (
    <Card className="mb-3 surface-border">
      <div className="flex flex-column lg:flex-row gap-3">
        <div className="flex-1">
          <div className="flex justify-content-between align-items-start mb-2">
            <div>
              <h3 className="m-0 font-bold text-primary">{product.hersteller}</h3>
              <p className="m-0 text-600">{product.produkt_modell}</p>
            </div>
            <div className="flex gap-2">
              <Tag value={product.origin_country} icon="pi pi-flag" />
              {product.rating && <Rating value={product.rating} readOnly cancel={false} />}
            </div>
          </div>
          
          <div className="grid">
            {product.pv_modul_leistung && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Leistung</div>
                <div className="font-bold">{product.pv_modul_leistung} Wp</div>
              </div>
            )}
            {product.wr_leistung_kw && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Leistung</div>
                <div className="font-bold">{product.wr_leistung_kw} kW</div>
              </div>
            )}
            {product.kapazitaet_speicher_kwh && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Kapazität</div>
                <div className="font-bold">{product.kapazitaet_speicher_kwh} kWh</div>
              </div>
            )}
            {product.efficiency_percent && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Wirkungsgrad</div>
                <div className="font-bold">{product.efficiency_percent}%</div>
              </div>
            )}
            {product.price_euro && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Preis</div>
                <div className="font-bold text-primary">{product.price_euro.toLocaleString('de-DE')} €</div>
              </div>
            )}
            {product.warranty_years && (
              <div className="col-6 lg:col-3">
                <div className="text-500 text-sm">Garantie</div>
                <div className="font-bold">{product.warranty_years} Jahre</div>
              </div>
            )}
          </div>
          
          {product.description && (
            <p className="mt-2 text-600 line-height-3">{product.description}</p>
          )}
        </div>
        
        <div className="flex flex-column gap-2" style={{minWidth: '120px'}}>
          <Button 
            label="Auswählen" 
            className="p-button-primary"
            onClick={() => {
              if (product.kategorie.includes('Modul')) setSelectedModule(product);
              else if (product.kategorie.includes('Wechselrichter')) setSelectedInverter(product);
              else if (product.kategorie.includes('Speicher')) setSelectedStorage(product);
              
              toast.current?.show({
                severity: 'success',
                summary: 'Ausgewählt',
                detail: `${product.produkt_modell} wurde ausgewählt`
              });
            }}
          />
          <Button 
            label="Details" 
            className="p-button-outlined"
            onClick={() => {
              setSelectedDetailProduct(product);
              setProductDetailsVisible(true);
            }}
          />
          <Button 
            icon="pi pi-heart" 
            className="p-button-outlined p-button-secondary"
            tooltip="Zu Favoriten hinzufügen"
          />
        </div>
      </div>
    </Card>
  );

  if (!loaded) {
    return (
      <div className="flex flex-column gap-3 p-4">
        <Skeleton width="100%" height="4rem" />
        <Skeleton width="100%" height="20rem" />
        <Skeleton width="100%" height="15rem" />
      </div>
    );
  }

  return (
    <div className="min-h-screen surface-50">
      <Toast ref={toast} />
      <Messages ref={messagesRef} />
      
      {/* Haupttoolbar */}
      <Toolbar start={toolbarStartContent} end={toolbarEndContent} className="shadow-2 border-noround" />
      
      <div className="p-4">
        {/* KPI Dashboard Cards */}
        <div className="grid mb-4">
          <div className="col-12 lg:col-3">
            <Card className="text-center border-left-3 border-blue-500">
              <div className="text-blue-600 font-medium text-sm">Gesamtleistung</div>
              <div className="text-4xl font-bold text-blue-800 mt-2">
                {calculations.totalKWp.toFixed(2)} 
                <span className="text-lg ml-1">kWp</span>
              </div>
              <ProgressBar value={(calculations.totalKWp / 15) * 100} showValue={false} className="mt-2" />
            </Card>
          </div>
          
          <div className="col-12 lg:col-3">
            <Card className="text-center border-left-3 border-green-500">
              <div className="text-green-600 font-medium text-sm">Jahresertrag</div>
              <div className="text-4xl font-bold text-green-800 mt-2">
                {(calculations.estimatedYield / 1000).toFixed(1)}
                <span className="text-lg ml-1">MWh</span>
              </div>
              <ProgressBar value={(calculations.estimatedYield / 20000) * 100} showValue={false} className="mt-2" color="#22c55e" />
            </Card>
          </div>
          
          <div className="col-12 lg:col-3">
            <Card className="text-center border-left-3 border-orange-500">
              <div className="text-orange-600 font-medium text-sm">Speicher</div>
              <div className="text-4xl font-bold text-orange-800 mt-2">
                {calculations.totalStorageKWh.toFixed(1)}
                <span className="text-lg ml-1">kWh</span>
              </div>
              <ProgressBar value={withStorage ? 100 : 0} showValue={false} className="mt-2" color="#f97316" />
            </Card>
          </div>
          
          <div className="col-12 lg:col-3">
            <Card className="text-center border-left-3 border-purple-500">
              <div className="text-purple-600 font-medium text-sm">Investition</div>
              <div className="text-4xl font-bold text-purple-800 mt-2">
                {(calculations.totalPrice / 1000).toFixed(0)}
                <span className="text-lg ml-1">T€</span>
              </div>
              <ProgressBar value={(calculations.totalPrice / 50000) * 100} showValue={false} className="mt-2" color="#a855f7" />
            </Card>
          </div>
        </div>

        {/* Hauptinhalt mit Splitter */}
        <Splitter style={{height: 'calc(100vh - 300px)'}} className="shadow-2">
          {/* Linke Seite: Schritte und Navigation */}
          <SplitterPanel size={30} minSize={25}>
            <ScrollPanel style={{width: '100%', height: '100%'}}>
              <Card className="h-full">
                <h3 className="mt-0 mb-4 flex align-items-center gap-2">
                  <i className="pi pi-list text-primary"></i>
                  Konfigurationsschritte
                </h3>
                
                <Steps 
                  model={steps} 
                  activeIndex={activeStep}
                  onSelect={(e) => setActiveStep(e.index)}
                  orientation="vertical"
                  readOnly={false}
                />
                
                <Divider />
                
                <div className="mt-4">
                  <h4 className="mb-3">Aktuelle Auswahl</h4>
                  
                  {selectedModule && (
                    <div className="mb-3 p-3 surface-100 border-round">
                      <div className="flex justify-content-between align-items-center">
                        <div>
                          <div className="font-bold text-sm">{selectedModule.hersteller}</div>
                          <div className="text-600 text-xs">{selectedModule.produkt_modell}</div>
                        </div>
                        <Chip label={`${moduleQuantity}x`} className="bg-blue-500 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {selectedInverter && (
                    <div className="mb-3 p-3 surface-100 border-round">
                      <div className="flex justify-content-between align-items-center">
                        <div>
                          <div className="font-bold text-sm">{selectedInverter.hersteller}</div>
                          <div className="text-600 text-xs">{selectedInverter.produkt_modell}</div>
                        </div>
                        <Chip label={`${inverterQuantity}x`} className="bg-orange-500 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {selectedStorage && withStorage && (
                    <div className="mb-3 p-3 surface-100 border-round">
                      <div className="flex justify-content-between align-items-center">
                        <div>
                          <div className="font-bold text-sm">{selectedStorage.hersteller}</div>
                          <div className="text-600 text-xs">{selectedStorage.produkt_modell}</div>
                        </div>
                        <Chip label={`${storageQuantity}x`} className="bg-green-500 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </ScrollPanel>
          </SplitterPanel>
          
          {/* Rechte Seite: Hauptinhalt */}
          <SplitterPanel size={70}>
            <ScrollPanel style={{width: '100%', height: '100%'}}>
              <div className="p-4">
                {/* Schritt 0: PV-Module */}
                {activeStep === 0 && (
                  <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                      <h2 className="m-0 flex align-items-center gap-2">
                        <i className="pi pi-sun text-primary"></i>
                        PV-Module auswählen
                      </h2>
                      <div className="flex gap-2">
                        <InputNumber
                          value={moduleQuantity}
                          onValueChange={(e) => setModuleQuantity(e.value || 1)}
                          showButtons
                          buttonLayout="horizontal"
                          step={1}
                          min={1}
                          max={100}
                          decrementButtonIcon="pi pi-minus"
                          incrementButtonIcon="pi pi-plus"
                          suffix=" Module"
                        />
                        <Button 
                          icon="pi pi-filter" 
                          className="p-button-outlined"
                          tooltip="Filter anzeigen"
                        />
                      </div>
                    </div>
                    
                    <div className="grid">
                      {modules.map(product => (
                        <div key={product.id} className="col-12">
                          {productCardTemplate(product)}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Schritt 1: Wechselrichter */}
                {activeStep === 1 && (
                  <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                      <h2 className="m-0 flex align-items-center gap-2">
                        <i className="pi pi-cog text-primary"></i>
                        Wechselrichter auswählen
                      </h2>
                      <InputNumber
                        value={inverterQuantity}
                        onValueChange={(e) => setInverterQuantity(e.value || 1)}
                        showButtons
                        buttonLayout="horizontal"
                        step={1}
                        min={1}
                        max={10}
                        suffix=" WR"
                      />
                    </div>
                    
                    <div className="grid">
                      {inverters.map(product => (
                        <div key={product.id} className="col-12">
                          {productCardTemplate(product)}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Schritt 2: Batteriespeicher */}
                {activeStep === 2 && (
                  <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                      <h2 className="m-0 flex align-items-center gap-2">
                        <i className="pi pi-battery-3 text-primary"></i>
                        Batteriespeicher (Optional)
                      </h2>
                      <div className="flex align-items-center gap-3">
                        <Checkbox 
                          inputId="storage-checkbox" 
                          checked={withStorage} 
                          onChange={(e) => setWithStorage(e.checked || false)} 
                        />
                        <label htmlFor="storage-checkbox" className="ml-2">Speicher hinzufügen</label>
                        {withStorage && (
                          <InputNumber
                            value={storageQuantity}
                            onValueChange={(e) => setStorageQuantity(e.value || 1)}
                            showButtons
                            buttonLayout="horizontal"
                            step={1}
                            min={1}
                            max={5}
                            suffix=" Speicher"
                          />
                        )}
                      </div>
                    </div>
                    
                    {withStorage ? (
                      <div className="grid">
                        {storages.map(product => (
                          <div key={product.id} className="col-12">
                            {productCardTemplate(product)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Panel header="Warum einen Batteriespeicher?" className="mt-4">
                        <div className="grid">
                          <div className="col-12 md:col-4">
                            <div className="text-center p-3">
                              <i className="pi pi-shield text-primary text-4xl mb-3"></i>
                              <h4>Unabhängigkeit</h4>
                              <p className="text-600">Reduzieren Sie Ihre Abhängigkeit vom Stromnetz</p>
                            </div>
                          </div>
                          <div className="col-12 md:col-4">
                            <div className="text-center p-3">
                              <i className="pi pi-euro text-primary text-4xl mb-3"></i>
                              <h4>Kosteneinsparung</h4>
                              <p className="text-600">Senken Sie Ihre Stromkosten langfristig</p>
                            </div>
                          </div>
                          <div className="col-12 md:col-4">
                            <div className="text-center p-3">
                              <i className="pi pi-bolt text-primary text-4xl mb-3"></i>
                              <h4>Notstrom</h4>
                              <p className="text-600">Bleiben Sie auch bei Stromausfällen versorgt</p>
                            </div>
                          </div>
                        </div>
                      </Panel>
                    )}
                  </Card>
                )}

                {/* Schritt 3: Zusätzliche Komponenten */}
                {activeStep === 3 && (
                  <Card>
                    <h2 className="mt-0 mb-4 flex align-items-center gap-2">
                      <i className="pi pi-plus-circle text-primary"></i>
                      Zusätzliche Komponenten
                    </h2>
                    
                    <div className="grid">
                      {additionalOptions.map(option => (
                        <div key={option.key} className="col-12 md:col-6 lg:col-4">
                          <Card className="h-full hover:shadow-4 transition-all transition-duration-200">
                            <div className="flex flex-column h-full">
                              <div className="flex justify-content-between align-items-start mb-3">
                                <h4 className="m-0">{option.name}</h4>
                                <Checkbox 
                                  checked={additionalComponents.includes(option.key)}
                                  onChange={(e) => {
                                    if (e.checked) {
                                      setAdditionalComponents([...additionalComponents, option.key]);
                                    } else {
                                      setAdditionalComponents(additionalComponents.filter(c => c !== option.key));
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex-1"></div>
                              <div className="text-primary font-bold text-xl">
                                +{option.price.toLocaleString('de-DE')} €
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                    
                    <Divider />
                    
                    <Fieldset legend="Anmerkungen" className="mt-4">
                      <InputTextarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full"
                        placeholder="Zusätzliche Wünsche, Anmerkungen oder spezielle Anforderungen..."
                      />
                    </Fieldset>
                  </Card>
                )}

                {/* Schritt 4: Zusammenfassung */}
                {activeStep === 4 && (
                  <Card>
                    <h2 className="mt-0 mb-4 flex align-items-center gap-2">
                      <i className="pi pi-check-circle text-primary"></i>
                      Konfiguration Zusammenfassung
                    </h2>
                    
                    <TabView>
                      <TabPanel header="Komponenten" leftIcon="pi pi-list">
                        <DataTable value={[
                          ...(selectedModule ? [{...selectedModule, qty: moduleQuantity, total: (selectedModule.price_euro || 0) * moduleQuantity}] : []),
                          ...(selectedInverter ? [{...selectedInverter, qty: inverterQuantity, total: (selectedInverter.price_euro || 0) * inverterQuantity}] : []),
                          ...(selectedStorage && withStorage ? [{...selectedStorage, qty: storageQuantity, total: (selectedStorage.price_euro || 0) * storageQuantity}] : [])
                        ]}>
                          <Column field="kategorie" header="Kategorie" />
                          <Column field="hersteller" header="Hersteller" />
                          <Column field="produkt_modell" header="Modell" />
                          <Column field="qty" header="Anzahl" />
                          <Column 
                            field="total" 
                            header="Summe" 
                            body={(rowData) => `${rowData.total.toLocaleString('de-DE')} €`}
                          />
                        </DataTable>
                      </TabPanel>
                      
                      <TabPanel header="Leistungsdaten" leftIcon="pi pi-chart-line">
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <Panel header="Anlagenleistung">
                              <div className="flex align-items-center justify-content-center">
                                <Knob 
                                  value={calculations.totalKWp} 
                                  max={50}
                                  valueTemplate="{value} kWp"
                                  readOnly
                                  size={150}
                                />
                              </div>
                            </Panel>
                          </div>
                          <div className="col-12 md:col-6">
                            <Panel header="Jahresertrag">
                              <div className="flex align-items-center justify-content-center">
                                <Knob 
                                  value={calculations.estimatedYield / 1000} 
                                  max={50}
                                  valueTemplate="{value} MWh"
                                  readOnly
                                  size={150}
                                  strokeWidth={8}
                                />
                              </div>
                            </Panel>
                          </div>
                        </div>
                      </TabPanel>
                      
                      <TabPanel header="Kostenaufstellung" leftIcon="pi pi-euro">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-primary mb-4">
                            {calculations.totalPrice.toLocaleString('de-DE')} €
                          </div>
                          <div className="text-xl text-600">Gesamtinvestition (netto)</div>
                          
                          <Divider />
                          
                          <div className="grid">
                            <div className="col-12 md:col-4">
                              <div className="text-center p-3">
                                <div className="text-2xl font-bold text-blue-600">
                                  {((calculations.totalPrice * 0.7) / 20).toFixed(0)} €
                                </div>
                                <div className="text-600">Monatliche Rate (20 Jahre, 70% Finanzierung)</div>
                              </div>
                            </div>
                            <div className="col-12 md:col-4">
                              <div className="text-center p-3">
                                <div className="text-2xl font-bold text-green-600">
                                  {(calculations.estimatedYield * 0.08).toFixed(0)} €
                                </div>
                                <div className="text-600">Jährliche Stromkosteneinsparung</div>
                              </div>
                            </div>
                            <div className="col-12 md:col-4">
                              <div className="text-center p-3">
                                <div className="text-2xl font-bold text-orange-600">
                                  {Math.round(calculations.totalPrice / (calculations.estimatedYield * 0.08))} Jahre
                                </div>
                                <div className="text-600">Amortisationsdauer</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </TabView>
                    
                    <Divider />
                    
                    <div className="flex gap-3 justify-content-end">
                      <Button 
                        label="PDF generieren" 
                        icon="pi pi-file-pdf" 
                        className="p-button-outlined"
                      />
                      <Button 
                        label="Angebot erstellen" 
                        icon="pi pi-send" 
                        onClick={() => {
                          toast.current?.show({
                            severity: 'success',
                            summary: 'Angebot erstellt',
                            detail: 'Das Angebot wurde erfolgreich generiert'
                          });
                          navigate('/offers');
                        }}
                      />
                    </div>
                  </Card>
                )}
              </div>
            </ScrollPanel>
          </SplitterPanel>
        </Splitter>
      </div>

      {/* Sidebar für Produktliste */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{width: '40rem'}}>
        <h3>Alle Produkte</h3>
        <TabView>
          <TabPanel header="Module">
            {modules.map(product => (
              <div key={product.id} className="mb-3">
                {productCardTemplate(product)}
              </div>
            ))}
          </TabPanel>
          <TabPanel header="Wechselrichter">
            {inverters.map(product => (
              <div key={product.id} className="mb-3">
                {productCardTemplate(product)}
              </div>
            ))}
          </TabPanel>
          <TabPanel header="Speicher">
            {storages.map(product => (
              <div key={product.id} className="mb-3">
                {productCardTemplate(product)}
              </div>
            ))}
          </TabPanel>
        </TabView>
      </Sidebar>

      {/* Dialog für Produktdetails */}
      <Dialog 
        visible={productDetailsVisible} 
        onHide={() => setProductDetailsVisible(false)}
        header="Produktdetails"
        style={{width: '50rem'}}
      >
        {selectedDetailProduct && (
          <div>
            <h2>{selectedDetailProduct.hersteller} {selectedDetailProduct.produkt_modell}</h2>
            <p>{selectedDetailProduct.description}</p>
            {/* Weitere Produktdetails hier */}
          </div>
        )}
      </Dialog>

      {/* Speed Dial für schnelle Aktionen */}
      <SpeedDial 
        model={speedDialItems}
        radius={80}
        type="circle"
        buttonClassName="p-button-help"
        style={{position: 'fixed', bottom: '20px', right: '20px'}}
      />
    </div>
  );
}
