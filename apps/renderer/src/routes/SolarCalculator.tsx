import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../lib/projectContext';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Grid,
  GridItem,
  Badge,
  Divider,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';

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
  
  // Filtered Models für zusätzliche Komponenten
  const wallboxModels = wallboxProducts.filter((p: Product) => !config.wallboxBrand || p.hersteller === config.wallboxBrand);
  const emsModels = emsProducts.filter((p: Product) => !config.emsBrand || p.hersteller === config.emsBrand);
  const optimizerModels = optimizerProducts.filter((p: Product) => !config.optimizerBrand || p.hersteller === config.optimizerBrand);
  const carportModels = carportProducts.filter((p: Product) => !config.carportBrand || p.hersteller === config.carportBrand);
  const emergencyPowerModels = emergencyPowerProducts.filter((p: Product) => !config.emergencyPowerBrand || p.hersteller === config.emergencyPowerBrand);
  const animalProtectionModels = animalProtectionProducts.filter((p: Product) => !config.animalProtectionBrand || p.hersteller === config.animalProtectionBrand);

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
      // Konfiguration via Electron Bridge speichern
      const res = (window as any).solarAPI
        ? await (window as any).solarAPI.saveConfiguration(config)
        : { success: false };
      if (!res?.success) throw new Error('Fehler beim Speichern der Konfiguration');
      // Zusätzlich lokal persistieren für Dashboard/Progress-Page
      try {
        localStorage.setItem('kakerlake_solar_config', JSON.stringify(config));
      } catch (e) {
        console.warn('Konnte Konfiguration nicht im localStorage speichern:', e);
      }
      console.log('Solar Configuration gespeichert:', config);
      navigate('/calculation-progress'); // Zur Berechnungsseite navigieren
    } catch (error) {
      console.error('Speicherfehler:', error);
      alert('Konfiguration konnte nicht gespeichert werden');
    }
  }

  return (
    <div>
      <VStack spacing={6} align="stretch">
        <Card variant="outline" bg="darkBg.400" borderColor="neonGreen.500">
          <CardBody>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="neonGreen.300" textShadow="0 0 10px rgba(0, 255, 0, 0.8)">
                  ⚡ SOLAR KALKULATOR ⚡
                </Heading>
                <Text fontSize="sm" color="neonGreen.200">
                  Schritt {step} / 2 – Technik konfigurieren
                </Text>
              </VStack>
              <Badge colorScheme="green" variant="outline" fontSize="xs">
                Build SC-TS v1
              </Badge>
            </HStack>
          </CardBody>
        </Card>

        {step === 1 && (
          <Card bg="darkBg.400" borderColor="neonGreen.500" variant="outline">
            <CardBody p={6}>
              <VStack spacing={8} align="stretch">
                
                {/* DEMO-HINWEIS */}
                <Alert 
                  status="info" 
                  bg="neonGreen.900" 
                  color="neonGreen.100"
                  borderColor="neonGreen.500"
                  variant="left-accent"
                  borderRadius="lg"
                >
                  <AlertIcon color="neonGreen.400" />
                  <Box>
                    <AlertTitle>🚀 Demo-Konfiguration</AlertTitle>
                    <AlertDescription>
                      <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={2}>
                        <Text><Text as="span" fontWeight="bold">Anzahl Module:</Text> {config.moduleQty}</Text>
                        <Text><Text as="span" fontWeight="bold">Leistung pro Modul:</Text> {moduleWp} Wp</Text>
                        <Text><Text as="span" fontWeight="bold">Anlagengröße:</Text> {kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWp</Text>
                      </Grid>
                    </AlertDescription>
                  </Box>
                </Alert>

                {/* MODULE */}
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="neonGreen.300">
                    ⚡ PV Module
                  </Heading>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel color="gray.300" fontSize="sm">Anzahl PV Module</FormLabel>
                      <HStack>
                        <Button 
                          size="sm" 
                          bg="gray.600" 
                          color="white" 
                          _hover={{ bg: "gray.500" }}
                          onClick={() => setConfig(prev => ({...prev, moduleQty: Math.max(0, prev.moduleQty - 1)}))}
                        >
                          −
                        </Button>
                        <NumberInput
                          value={config.moduleQty}
                          onChange={(_, val) => setConfig(prev => ({...prev, moduleQty: val || 0}))}
                          min={0}
                          bg="gray.700"
                          color="white"
                          borderColor="neonGreen.500"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper color="neonGreen.400" />
                            <NumberDecrementStepper color="neonGreen.400" />
                          </NumberInputStepper>
                        </NumberInput>
                        <Button 
                          size="sm" 
                          bg="gray.600" 
                          color="white" 
                          _hover={{ bg: "gray.500" }}
                          onClick={() => setConfig(prev => ({...prev, moduleQty: prev.moduleQty + 1}))}
                        >
                          +
                        </Button>
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel color="gray.300" fontSize="sm">Hersteller</FormLabel>
                      <Select 
                        value={config.moduleBrand} 
                        onChange={e => setConfig(prev => ({...prev, moduleBrand: e.target.value, moduleModel: ''}))}
                        bg="gray.700"
                        color="white"
                        borderColor="neonGreen.500"
                      >
                        <option value="">-- wählen --</option>
                        {moduleBrands.map(b => <option key={b} value={b} style={{background: '#2D3748'}}>{b}</option>)}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel color="gray.300" fontSize="sm">Modell</FormLabel>
                      <Select 
                        value={config.moduleModel} 
                        onChange={e => setConfig(prev => ({...prev, moduleModel: e.target.value}))}
                        bg="gray.700"
                        color="white"
                        borderColor="neonGreen.500"
                      >
                        <option value="">-- wählen --</option>
                        {filteredModuleModels.map(m => <option key={m.id} value={m.produkt_modell} style={{background: '#2D3748'}}>{m.produkt_modell}</option>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <Card bg="gray.700" borderColor="gray.600" variant="outline">
                      <CardBody p={3}>
                        <Stat>
                          <StatLabel color="gray.300" fontSize="xs">Leistung pro Modul (Wp)</StatLabel>
                          <StatNumber color="white" fontSize="lg">{moduleWp || 0}</StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card bg="neonGreen.900" borderColor="neonGreen.500" variant="outline" 
                          boxShadow="0 0 15px rgba(57, 255, 20, 0.3)">
                      <CardBody p={3}>
                        <Stat>
                          <StatLabel color="neonGreen.200" fontSize="xs">Anlagengröße (kWp)</StatLabel>
                          <StatNumber color="neonGreen.300" fontSize="2xl" fontWeight="bold">
                            {kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card bg="green.900" borderColor="green.500" variant="outline">
                      <CardBody p={3}>
                        <Stat>
                          <StatLabel color="green.200" fontSize="xs">Jahresertrag (geschätzt)</StatLabel>
                          <StatNumber color="green.300" fontSize="lg" fontWeight="semibold">
                            {Math.round(kWp * 950).toLocaleString('de-DE')} kWh
                          </StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                  </Grid>
                </VStack>

                {/* WECHSELRICHTER */}
                <Box>
                  <Divider borderColor="neonGreen.500" mb={4} />
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="neonGreen.300">
                      🔌 Wechselrichter
                    </Heading>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <FormControl>
                        <FormLabel color="gray.300" fontSize="sm">Hersteller</FormLabel>
                        <Select 
                          value={config.invBrand} 
                          onChange={e => setConfig(prev => ({...prev, invBrand: e.target.value, invModel: ''}))}
                          bg="gray.700"
                          color="white"
                          borderColor="neonGreen.500"
                        >
                          <option value="">-- wählen --</option>
                          {inverterBrands.map(b => <option key={b} value={b} style={{background: '#2D3748'}}>{b}</option>)}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.300" fontSize="sm">Modell</FormLabel>
                        <Select 
                          value={config.invModel} 
                          onChange={e => setConfig(prev => ({...prev, invModel: e.target.value}))}
                          bg="gray.700"
                          color="white"
                          borderColor="neonGreen.500"
                        >
                          <option value="">-- wählen --</option>
                          {filteredInvModels.map(m => <option key={m.id} value={m.produkt_modell} style={{background: '#2D3748'}}>{m.produkt_modell}</option>)}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.300" fontSize="sm">Anzahl WR</FormLabel>
                        <NumberInput
                          value={config.invQty}
                          onChange={(_, val) => setConfig(prev => ({...prev, invQty: Math.max(1, val || 1)}))}
                          min={1}
                          bg="gray.700"
                          color="white"
                          borderColor="neonGreen.500"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper color="neonGreen.400" />
                            <NumberDecrementStepper color="neonGreen.400" />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </Grid>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Card bg="gray.700" borderColor="gray.600" variant="outline">
                        <CardBody p={3}>
                          <Stat>
                            <StatLabel color="gray.300" fontSize="xs">Leistung je WR (kW)</StatLabel>
                            <StatNumber color="white" fontSize="lg">{currentInv?.wr_leistung_kw ?? 0}</StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg="gray.700" borderColor="gray.600" variant="outline">
                        <CardBody p={3}>
                          <Stat>
                            <StatLabel color="gray.300" fontSize="xs">WR Gesamt (kW)</StatLabel>
                            <StatNumber color="white" fontSize="lg">
                              {totalInvPowerKW.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                    </Grid>
                  </VStack>
                </Box>

                {/* SPEICHER */}
                <Box>
                  <Divider borderColor="neonGreen.500" mb={4} />
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" gap={3}>
                      <Switch 
                        id="withStorage" 
                        isChecked={config.withStorage} 
                        onChange={e => setConfig(prev => ({...prev, withStorage: e.target.checked}))}
                        colorScheme="green"
                        size="lg"
                      />
                      <FormLabel htmlFor="withStorage" color="neonGreen.300" fontSize="md" fontWeight="medium" mb={0}>
                        🔋 Batteriespeicher einplanen
                      </FormLabel>
                    </FormControl>
                    {config.withStorage && (
                      <VStack spacing={4} align="stretch">
                        <Grid templateColumns="1fr 2fr 1fr" gap={4}>
                          <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Hersteller</FormLabel>
                            <Select 
                              value={config.storageBrand} 
                              onChange={e => setConfig(prev => ({...prev, storageBrand: e.target.value, storageModel: ''}))}
                              bg="gray.700"
                              color="white"
                              borderColor="neonGreen.500"
                            >
                              <option value="">-- wählen --</option>
                              {storageBrands.map(b => <option key={b} value={b} style={{background: '#2D3748'}}>{b}</option>)}
                            </Select>
                          </FormControl>
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm">Modell</FormLabel>
                  <Select 
                    value={config.storageModel} 
                    onChange={e => setConfig(prev => ({...prev, storageModel: e.target.value}))}
                    bg="gray.700"
                    color="white"
                    borderColor="neonGreen.500"
                  >
                    <option value="">-- wählen --</option>
                    {filteredStorageModels.map(m => <option key={m.id} value={m.produkt_modell} style={{background: '#2D3748'}}>{m.produkt_modell}</option>)}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm">Gewünschte Gesamtkapazität (kWh)</FormLabel>
                  <NumberInput
                    value={config.storageDesiredKWh}
                    onChange={(_, val) => setConfig(prev => ({...prev, storageDesiredKWh: val || 0}))}
                    min={0}
                    bg="gray.700"
                    color="white"
                    borderColor="neonGreen.500"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper color="neonGreen.400" />
                      <NumberDecrementStepper color="neonGreen.400" />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Grid>
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Card bg="gray.700" borderColor="gray.600" variant="outline" gridColumn="span 2 / span 2">
                  <CardBody p={3}>
                    <Stat>
                      <StatLabel color="gray.300" fontSize="xs">Kapazität Modell (kWh)</StatLabel>
                      <StatNumber color="white" fontSize="lg">{storageModelKWh || 0}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </Grid>
            </VStack>
          )}
          </VStack>

                </Box>

          {errors.length > 0 && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 space-y-1">
              {errors.map(e => <div key={e}>• {e}</div>)}
            </div>
          )}

        <div className="flex justify-end pt-4">
          <button onClick={goNext} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50" disabled={errors.length > 0}>Nächste Seite</button>
        </div>
            </VStack>
          </CardBody>
        </Card>
      )}

      {step === 2 && (
        <Card bg="darkBg.400" borderColor="neonGreen.500" variant="outline">
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <div className="rounded-xl bg-white p-5 shadow space-y-6">
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
                              {wallboxModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
                              {emsModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
                              {optimizerModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
                              {carportModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
                              {emergencyPowerModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
                              {animalProtectionModels.map(m => <option key={m.id} value={m.produkt_modell}>{m.produkt_modell}</option>)}
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
              </div>
            </VStack>
          </CardBody>
        </Card>
      )}

        <Center>
          <Button as={Link} to="/home" variant="ghost" size="sm" color="neonGreen.400">
            ← Zurück zur Startseite
          </Button>
        </Center>
      </VStack>
    </div>
  );
}
