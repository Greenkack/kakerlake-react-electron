import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../state/project';
// PrimeReact Core Imports
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import CalculationResultsComponent from '../components/CalculationResults';
import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Accordion, AccordionTab } from 'primereact/accordion';
// PrimeReact Styles
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
// Database-Integration für Produktliste
function useProducts() {
    const [data, setData] = useState({ 
        modules: [], 
        inverters: [], 
        storages: [],
        wallboxes: [],
        emsSystems: [],
        optimizers: [],
        backupPower: [],
        animalProtection: []
    });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                console.log('🚀 DEBUG: SolarCalculator - Starting product load');
                const dbAPI = window.databaseAPI;
                console.log('🔍 DEBUG: Database API available?', !!dbAPI);
                
                if (!dbAPI) {
                    console.error('❌ Database API not available!');
                    alert('Database API nicht verfügbar! Bitte starten Sie die App neu.');
                    setLoaded(true);
                    return;
                }

                // Module laden - WICHTIG: Kategorie muss genau "modul" sein (kleingeschrieben!)
                console.log('📦 Loading modules with category: "modul"');
                const modulesResult = await dbAPI.listProducts('modul');
                console.log('✅ Modules loaded:', modulesResult);
                
                // Wechselrichter laden - WICHTIG: "Wechselrichter" mit großem W!
                console.log('📦 Loading inverters with category: "Wechselrichter"');
                const invertersResult = await dbAPI.listProducts('Wechselrichter');
                console.log('✅ Inverters loaded:', invertersResult);
                
                // Batteriespeicher laden
                console.log('📦 Loading batteries with category: "Batteriespeicher"');
                const batteriesResult = await dbAPI.listProducts('Batteriespeicher');
                console.log('✅ Batteries loaded:', batteriesResult);
                
                // Wallbox laden
                console.log('📦 Loading wallboxes with category: "Wallbox"');
                const wallboxResult = await dbAPI.listProducts('Wallbox');
                console.log('✅ Wallboxes loaded:', wallboxResult);
                
                // Energiemanagementsystem laden
                console.log('📦 Loading EMS with category: "Energiemanagementsystem"');
                const emsResult = await dbAPI.listProducts('Energiemanagementsystem');
                console.log('✅ EMS loaded:', emsResult);
                
                // Leistungsoptimierer laden
                console.log('📦 Loading optimizers with category: "Leistungsoptimierer"');
                const optimizerResult = await dbAPI.listProducts('Leistungsoptimierer');
                console.log('✅ Optimizers loaded:', optimizerResult);
                
                // Notstromversorgung laden
                console.log('📦 Loading backup power with category: "Notstromversorgung"');
                const backupResult = await dbAPI.listProducts('Notstromversorgung');
                console.log('✅ Backup power loaded:', backupResult);
                
                // Tierabwehrschutz laden
                console.log('📦 Loading animal protection with category: "Tierabwehrschutz"');
                const animalResult = await dbAPI.listProducts('Tierabwehrschutz');
                console.log('✅ Animal protection loaded:', animalResult);

                if (cancelled) return;

                // Daten verarbeiten und in State setzen
                const processProducts = (result) => {
                    if (Array.isArray(result)) return result;
                    if (result?.data && Array.isArray(result.data)) return result.data;
                    if (result?.success && result?.data) return result.data;
                    return [];
                };

                const modules = processProducts(modulesResult);
                const inverters = processProducts(invertersResult);
                const batteries = processProducts(batteriesResult);
                const wallboxes = processProducts(wallboxResult);
                const emsSystems = processProducts(emsResult);
                const optimizers = processProducts(optimizerResult);
                const backupPower = processProducts(backupResult);
                const animalProtection = processProducts(animalResult);

                console.log('📊 Final product counts:', {
                    modules: modules.length,
                    inverters: inverters.length,
                    batteries: batteries.length,
                    wallboxes: wallboxes.length,
                    emsSystems: emsSystems.length,
                    optimizers: optimizers.length,
                    backupPower: backupPower.length,
                    animalProtection: animalProtection.length
                });

                // Daten für Dropdowns formatieren
                setData({
                    modules: (modules || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'modul',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        pv_modul_leistung: m.capacity_w,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years,
                        efficiency_percent: m.efficiency_percent
                    })),
                    inverters: (inverters || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Wechselrichter',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        wr_leistung_kw: m.power_kw,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years,
                        efficiency_percent: m.efficiency_percent
                    })),
                    storages: (batteries || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Batteriespeicher',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        speicher_kapazitaet_kwh: m.storage_power_kw,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years,
                        max_cycles: m.max_cycles
                    })),
                    wallboxes: (wallboxes || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Wallbox',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        power_kw: m.power_kw,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years
                    })),
                    emsSystems: (emsSystems || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Energiemanagementsystem',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years
                    })),
                    optimizers: (optimizers || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Leistungsoptimierer',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years
                    })),
                    backupPower: (backupPower || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Notstromversorgung',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years
                    })),
                    animalProtection: (animalProtection || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.category || 'Tierabwehrschutz',
                        hersteller: m.brand || m.manufacturer,
                        produkt_modell: m.model_name,
                        price_euro: m.price_euro,
                        warranty_years: m.warranty_years
                    }))
                });

                console.log('✅ DEBUG: All products loaded successfully');
                setLoaded(true);

            } catch (error) {
                console.error('❌ CRITICAL ERROR loading products:', error);
                console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
                // NICHT stillschweigend fehlschlagen - User informieren!
                alert(`Fehler beim Laden der Produkte: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
                
                // Fallback mit leeren Daten
                setData({
                    modules: [],
                    inverters: [],
                    storages: [],
                    wallboxes: [],
                    emsSystems: [],
                    optimizers: [],
                    backupPower: [],
                    animalProtection: []
                });
                setLoaded(true);
            }
        };

        loadProducts();
        return () => { cancelled = true; };
    }, []);

    return { ...data, loaded };
}
export default function SolarCalculator() {
    const navigate = useNavigate();
    const { state: projectState } = useProject();
    const { modules: moduleProducts, inverters, storages, wallboxes, emsSystems, optimizers, backupPower, animalProtection } = useProducts();
    const toast = useRef(null);
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
    const [calculationResults, setCalculationResults] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    // State für zusätzliche Komponenten
    const [wallboxProducts, setWallboxProducts] = useState([]);
    const [emsProducts, setEmsProducts] = useState([]);
    const [optimizerProducts, setOptimizerProducts] = useState([]);
    const [carportProducts, setCarportProducts] = useState([]);
    const [emergencyPowerProducts, setEmergencyPowerProducts] = useState([]);
    const [animalProtectionProducts, setAnimalProtectionProducts] = useState([]);
    // Removed legacy step system - now using activeStep only
    // Solar Config State - initialisiert mit realistischen Demo-Werten aus echter DB
    const [config, setConfig] = useState(() => ({
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
                toast.current?.show({ severity: 'error', summary: 'Fehler', detail: 'Bitte wählen Sie ein Modul aus' });
                return;
            }
            if (!selectedInverter) {
                toast.current?.show({ severity: 'error', summary: 'Fehler', detail: 'Bitte wählen Sie einen Wechselrichter aus' });
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
            const calculationAPI = window.calculationAPI;
            if (!calculationAPI) {
                throw new Error('Calculation API not available');
            }
            const result = await calculationAPI.performCalculations(calculationConfig);
            if (result.success) {
                setCalculationResults(result.results);
                toast.current?.show({ severity: 'success', summary: 'Erfolg', detail: 'Berechnungen abgeschlossen' });
                
                // Navigate to Results page with calculation data
                console.log('🎯 DEBUG: Navigating to Results page with:', result.results);
                navigate('/results', { 
                    state: { 
                        results: result.results,
                        configuration: config 
                    } 
                });
            }
            else {
                throw new Error(result.error || 'Unknown calculation error');
            }
        }
        catch (error) {
            console.error('Calculation error:', error);
            toast.current?.show({ severity: 'error', summary: 'Berechnungsfehler', detail: error instanceof Error ? error.message : 'Unbekannter Fehler' });
        }
        finally {
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
            if (!config.additionalComponents)
                return;
            try {
                // Wallbox
                if (config.wallboxEnabled && wallboxProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getWallboxManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getWallboxModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setWallboxProducts(allModels);
                }
                // EMS
                if (config.emsEnabled && emsProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getEMSManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getEMSModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setEmsProducts(allModels);
                }
                // Optimizer
                if (config.optimizerEnabled && optimizerProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getOptimizerManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getOptimizerModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setOptimizerProducts(allModels);
                }
                // Carport
                if (config.carportEnabled && carportProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getCarportManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getCarportModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setCarportProducts(allModels);
                }
                // Emergency Power
                if (config.emergencyPowerEnabled && emergencyPowerProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getEmergencyPowerManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getEmergencyPowerModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setEmergencyPowerProducts(allModels);
                }
                // Animal Protection
                if (config.animalProtectionEnabled && animalProtectionProducts.length === 0) {
                    const brands = window.solarAPI ? await window.solarAPI.getAnimalProtectionManufacturers() : [];
                    const allModels = (await Promise.all(brands.map(async (b) => {
                        const models = await window.solarAPI.getAnimalProtectionModelsByManufacturer(b);
                        return models.map((m) => ({
                            id: String(m.id),
                            kategorie: m.kategorie,
                            hersteller: m.hersteller,
                            produkt_modell: m.produkt_modell,
                        }));
                    }))).flat();
                    setAnimalProtectionProducts(allModels);
                }
            }
            catch (error) {
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
    const wallboxBrands = Array.from(new Set(wallboxProducts.map((p) => p.hersteller))).sort();
    const emsBrands = Array.from(new Set(emsProducts.map((p) => p.hersteller))).sort();
    const optimizerBrands = Array.from(new Set(optimizerProducts.map((p) => p.hersteller))).sort();
    const carportBrands = Array.from(new Set(carportProducts.map((p) => p.hersteller))).sort();
    const emergencyPowerBrands = Array.from(new Set(emergencyPowerProducts.map((p) => p.hersteller))).sort();
    const animalProtectionBrands = Array.from(new Set(animalProtectionProducts.map((p) => p.hersteller))).sort();
    const filteredInvModels = inverters.filter(p => !config.invBrand || p.hersteller === config.invBrand);
    const currentInv = filteredInvModels.find(p => p.produkt_modell === config.invModel);
    const totalInvPowerKW = (currentInv?.wr_leistung_kw || 0) * config.invQty;
    const filteredStorageModels = storages.filter(p => !config.storageBrand || p.hersteller === config.storageBrand);
    const currentStorage = filteredStorageModels.find(p => p.produkt_modell === config.storageModel);
    const storageModelKWh = currentStorage?.kapazitaet_speicher_kwh || 0;
    // Data processing for all dropdowns
    const moduleModels = moduleProducts.filter((p) => !config.moduleBrand || p.hersteller === config.moduleBrand);
    const inverterModels = inverters.filter((p) => !config.invBrand || p.hersteller === config.invBrand);
    const storageModels = storages.filter((p) => !config.storageBrand || p.hersteller === config.storageBrand);
    const wallboxModels = wallboxProducts.filter((p) => !config.wallboxBrand || p.hersteller === config.wallboxBrand);
    const emsModels = emsProducts.filter((p) => !config.emsBrand || p.hersteller === config.emsBrand);
    const optimizerModels = optimizerProducts.filter((p) => !config.optimizerBrand || p.hersteller === config.optimizerBrand);
    const carportModels = carportProducts.filter((p) => !config.carportBrand || p.hersteller === config.carportBrand);
    const emergencyPowerModels = emergencyPowerProducts.filter((p) => !config.emergencyPowerBrand || p.hersteller === config.emergencyPowerBrand);
    const animalProtectionModels = animalProtectionProducts.filter((p) => !config.animalProtectionBrand || p.hersteller === config.animalProtectionBrand);
    // Validierung basierend auf activeStep (für PrimeReact Navigation)
    const errors = [];
    if (activeStep === 0) { // Module Step
        if (config.moduleQty <= 0)
            errors.push('Anzahl Module > 0 erforderlich');
        if (!config.moduleBrand)
            errors.push('Modul-Hersteller wählen');
        if (!config.moduleModel)
            errors.push('Modul-Modell wählen');
    }
    if (activeStep === 1) { // Inverter Step
        if (!config.invBrand)
            errors.push('Wechselrichter-Hersteller wählen');
        if (!config.invModel)
            errors.push('Wechselrichter-Modell wählen');
        if (config.invQty <= 0)
            errors.push('Anzahl Wechselrichter > 0 erforderlich');
    }
    if (activeStep === 2) { // Storage Step
        if (config.withStorage && !config.storageBrand)
            errors.push('Speicher-Hersteller wählen');
        if (config.withStorage && !config.storageModel)
            errors.push('Speicher-Modell wählen');
        if (config.withStorage && config.storageDesiredKWh <= 0)
            errors.push('Speicherkapazität > 0 erforderlich');
    }
    if (activeStep === 3 && config.additionalComponents) { // Additional Components Step
        if (config.wallboxEnabled && !config.wallboxModel)
            errors.push('Wallbox-Modell wählen');
        if (config.emsEnabled && !config.emsModel)
            errors.push('EMS-Modell wählen');
        if (config.optimizerEnabled && !config.optimizerModel)
            errors.push('Optimizer-Modell wählen');
        if (config.carportEnabled && !config.carportModel)
            errors.push('Carport-Modell wählen');
        if (config.emergencyPowerEnabled && !config.emergencyPowerModel)
            errors.push('Notstrom-Modell wählen');
        if (config.animalProtectionEnabled && !config.animalProtectionModel)
            errors.push('Tierabwehr-Modell wählen');
    }
    async function finishAndBack() {
        try {
            // Start calculations instead of navigating away
            await performCalculations();
        }
        catch (error) {
            console.error('Calculation error:', error);
            toast.current?.show({ severity: 'error', summary: 'Fehler', detail: 'Berechnungen konnten nicht gestartet werden' });
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
    const renderModuleStep = () => (_jsxs(Card, { title: "\uD83D\uDD06 PV-Module konfigurieren", children: [_jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Anzahl Module" }), _jsx(InputNumber, { value: config.moduleQty, onValueChange: (e) => setConfig(prev => ({ ...prev, moduleQty: e.value || 0 })), min: 1, max: 100, showButtons: true, className: "w-full" })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Hersteller" }), _jsx(Dropdown, { value: config.moduleBrand, onChange: (e) => setConfig(prev => ({ ...prev, moduleBrand: e.value, moduleModel: '' })), options: moduleBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full", filter: true })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Modell" }), _jsx(Dropdown, { value: config.moduleModel, onChange: (e) => setConfig(prev => ({ ...prev, moduleModel: e.value })), options: moduleModels.map(product => ({
                                    label: `${product.produkt_modell} (${product.pv_modul_leistung}W)`,
                                    value: product.produkt_modell
                                })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.moduleBrand, filter: true })] })] }), config.moduleModel && (_jsx(Message, { severity: "success", text: `Ausgewählt: ${config.moduleQty} × ${config.moduleModel}`, className: "mt-3" }))] }));
    const renderInverterStep = () => (_jsxs(Card, { title: "\u26A1 Wechselrichter konfigurieren", children: [_jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Anzahl Wechselrichter" }), _jsx(InputNumber, { value: config.invQty, onValueChange: (e) => setConfig(prev => ({ ...prev, invQty: Math.max(1, e.value || 1) })), min: 1, max: 10, showButtons: true, className: "w-full" })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Hersteller" }), _jsx(Dropdown, { value: config.invBrand, onChange: (e) => setConfig(prev => ({ ...prev, invBrand: e.value, invModel: '' })), options: inverterBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full", filter: true })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Modell" }), _jsx(Dropdown, { value: config.invModel, onChange: (e) => setConfig(prev => ({ ...prev, invModel: e.value })), options: inverterModels.map(product => ({
                                    label: `${product.produkt_modell} (${product.wr_leistung_kw}kW)`,
                                    value: product.produkt_modell
                                })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.invBrand, filter: true })] })] }), config.invModel && (_jsx(Message, { severity: "success", text: `Ausgewählt: ${config.invQty} × ${config.invModel}`, className: "mt-3" }))] }));
    const renderStorageStep = () => (_jsxs(Card, { title: "\uD83D\uDD0B Batteriespeicher (optional)", children: [_jsxs("div", { className: "mb-4", children: [_jsx(Checkbox, { inputId: "storage-checkbox", checked: config.withStorage, onChange: (e) => setConfig(prev => ({ ...prev, withStorage: !!e.checked })) }), _jsx("label", { htmlFor: "storage-checkbox", className: "ml-2 text-900 font-medium", children: "Batteriespeicher hinzuf\u00FCgen" })] }), config.withStorage && (_jsxs("div", { className: "grid", children: [_jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Gew\u00FCnschte Kapazit\u00E4t (kWh)" }), _jsx(InputNumber, { value: config.storageDesiredKWh, onValueChange: (e) => setConfig(prev => ({ ...prev, storageDesiredKWh: e.value || 0 })), min: 0, max: 100, suffix: " kWh", className: "w-full" })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Hersteller" }), _jsx(Dropdown, { value: config.storageBrand, onChange: (e) => setConfig(prev => ({ ...prev, storageBrand: e.value, storageModel: '' })), options: storageBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full", filter: true })] }), _jsxs("div", { className: "col-12 md:col-4", children: [_jsx("label", { className: "block text-900 font-medium mb-2", children: "Modell" }), _jsx(Dropdown, { value: config.storageModel, onChange: (e) => setConfig(prev => ({ ...prev, storageModel: e.value })), options: storageModels.map(product => ({
                                    label: `${product.produkt_modell} (${product.kapazitaet_speicher_kwh}kWh)`,
                                    value: product.produkt_modell
                                })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.storageBrand, filter: true })] })] }))] }));
    const renderAdditionalStep = () => (_jsxs(Card, { title: "\uD83D\uDD27 Zusatzkomponenten (optional)", children: [_jsxs("div", { className: "mb-4", children: [_jsx(Checkbox, { inputId: "additional-checkbox", checked: config.additionalComponents, onChange: (e) => setConfig(prev => ({ ...prev, additionalComponents: !!e.checked })) }), _jsx("label", { htmlFor: "additional-checkbox", className: "ml-2 text-900 font-medium", children: "Zusatzkomponenten konfigurieren" })] }), config.additionalComponents && (_jsxs(Accordion, { multiple: true, children: [_jsxs(AccordionTab, { header: "\uD83D\uDE97 Wallbox", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "wallbox-checkbox", checked: config.wallboxEnabled, onChange: (e) => setConfig(prev => ({ ...prev, wallboxEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "wallbox-checkbox", className: "ml-2", children: "Wallbox hinzuf\u00FCgen" })] }), config.wallboxEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.wallboxBrand, onChange: (e) => setConfig(prev => ({ ...prev, wallboxBrand: e.value, wallboxModel: '' })), options: wallboxBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.wallboxModel, onChange: (e) => setConfig(prev => ({ ...prev, wallboxModel: e.value })), options: wallboxModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.wallboxBrand }) })] }))] }), _jsxs(AccordionTab, { header: "\u26A1 Energiemanagementsystem", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "ems-checkbox", checked: config.emsEnabled, onChange: (e) => setConfig(prev => ({ ...prev, emsEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "ems-checkbox", className: "ml-2", children: "Energiemanagementsystem hinzuf\u00FCgen" })] }), config.emsEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.emsBrand, onChange: (e) => setConfig(prev => ({ ...prev, emsBrand: e.value, emsModel: '' })), options: emsBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.emsModel, onChange: (e) => setConfig(prev => ({ ...prev, emsModel: e.value })), options: emsModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.emsBrand }) })] }))] }), _jsxs(AccordionTab, { header: "\uD83D\uDCC8 Leistungsoptimierer", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "optimizer-checkbox", checked: config.optimizerEnabled, onChange: (e) => setConfig(prev => ({ ...prev, optimizerEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "optimizer-checkbox", className: "ml-2", children: "Leistungsoptimierer hinzuf\u00FCgen" })] }), config.optimizerEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-4", children: _jsx(Dropdown, { value: config.optimizerBrand, onChange: (e) => setConfig(prev => ({ ...prev, optimizerBrand: e.value, optimizerModel: '' })), options: optimizerBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsx(Dropdown, { value: config.optimizerModel, onChange: (e) => setConfig(prev => ({ ...prev, optimizerModel: e.value })), options: optimizerModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.optimizerBrand }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsx(InputNumber, { value: config.optimizerQty, onValueChange: (e) => setConfig(prev => ({ ...prev, optimizerQty: e.value || 1 })), placeholder: "Anzahl", className: "w-full", min: 1, max: 100 }) })] }))] }), _jsxs(AccordionTab, { header: "\uD83C\uDFE0 Solar Carport", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "carport-checkbox", checked: config.carportEnabled, onChange: (e) => setConfig(prev => ({ ...prev, carportEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "carport-checkbox", className: "ml-2", children: "Solar Carport hinzuf\u00FCgen" })] }), config.carportEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.carportBrand, onChange: (e) => setConfig(prev => ({ ...prev, carportBrand: e.value, carportModel: '' })), options: carportBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.carportModel, onChange: (e) => setConfig(prev => ({ ...prev, carportModel: e.value })), options: carportModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.carportBrand }) })] }))] }), _jsxs(AccordionTab, { header: "\uD83D\uDD0B Notstromversorgung", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "emergency-power-checkbox", checked: config.emergencyPowerEnabled, onChange: (e) => setConfig(prev => ({ ...prev, emergencyPowerEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "emergency-power-checkbox", className: "ml-2", children: "Notstromversorgung hinzuf\u00FCgen" })] }), config.emergencyPowerEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.emergencyPowerBrand, onChange: (e) => setConfig(prev => ({ ...prev, emergencyPowerBrand: e.value, emergencyPowerModel: '' })), options: emergencyPowerBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.emergencyPowerModel, onChange: (e) => setConfig(prev => ({ ...prev, emergencyPowerModel: e.value })), options: emergencyPowerModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.emergencyPowerBrand }) })] }))] }), _jsxs(AccordionTab, { header: "\uD83D\uDC26 Tierabwehrschutz", children: [_jsxs("div", { className: "mb-3", children: [_jsx(Checkbox, { inputId: "animal-protection-checkbox", checked: config.animalProtectionEnabled, onChange: (e) => setConfig(prev => ({ ...prev, animalProtectionEnabled: !!e.checked })) }), _jsx("label", { htmlFor: "animal-protection-checkbox", className: "ml-2", children: "Tierabwehrschutz hinzuf\u00FCgen" })] }), config.animalProtectionEnabled && (_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.animalProtectionBrand, onChange: (e) => setConfig(prev => ({ ...prev, animalProtectionBrand: e.value, animalProtectionModel: '' })), options: animalProtectionBrands.map(brand => ({ label: brand, value: brand })), placeholder: "Hersteller w\u00E4hlen", className: "w-full" }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Dropdown, { value: config.animalProtectionModel, onChange: (e) => setConfig(prev => ({ ...prev, animalProtectionModel: e.value })), options: animalProtectionModels.map(product => ({ label: product.produkt_modell, value: product.produkt_modell })), placeholder: "Modell w\u00E4hlen", className: "w-full", disabled: !config.animalProtectionBrand }) })] }))] }), _jsx(AccordionTab, { header: "\uD83D\uDCDD Sonstige Anmerkungen", children: _jsx(InputText, { value: config.otherComponentNote, onChange: (e) => setConfig(prev => ({ ...prev, otherComponentNote: e.target.value })), placeholder: "Weitere Anmerkungen zu Zusatzkomponenten...", className: "w-full" }) })] }))] }));
    const renderResultsStep = () => (_jsxs("div", { children: [_jsx(Card, { title: "\uFFFD Anlagenkonfiguration", className: "mb-4", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-4", children: _jsx(Panel, { header: "\u26A1 PV-Module", className: "h-full", children: _jsxs("div", { className: "flex flex-column gap-2", children: [_jsx(Badge, { value: `${config.moduleQty} Stück`, severity: "info", size: "large" }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Hersteller:" }), " ", config.moduleBrand] }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Modell:" }), " ", config.moduleModel] })] }) }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsx(Panel, { header: "\uD83D\uDD04 Wechselrichter", className: "h-full", children: _jsxs("div", { className: "flex flex-column gap-2", children: [_jsx(Badge, { value: `${config.invQty} Stück`, severity: "warning", size: "large" }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Hersteller:" }), " ", config.invBrand] }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Modell:" }), " ", config.invModel] })] }) }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsx(Panel, { header: "\uD83D\uDD0B Speicher", className: "h-full", children: config.withStorage ? (_jsxs("div", { className: "flex flex-column gap-2", children: [_jsx(Badge, { value: `${config.storageDesiredKWh} kWh`, severity: "success", size: "large" }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Hersteller:" }), " ", config.storageBrand] }), _jsxs("p", { className: "m-0", children: [_jsx("strong", { children: "Modell:" }), " ", config.storageModel] })] })) : (_jsx(Message, { severity: "info", text: "Kein Speicher konfiguriert" })) }) })] }) }), calculationResults ? (_jsx(CalculationResultsComponent, { results: calculationResults, isLoading: isCalculating, onRecalculate: performCalculations })) : (_jsx(Card, { title: "\uFFFD Berechnungen starten", children: _jsxs("div", { className: "text-center p-6", children: [_jsx("div", { className: "mb-4", children: _jsx("i", { className: "pi pi-calculator text-6xl text-primary" }) }), _jsx("h3", { children: "Bereit f\u00FCr die Berechnung" }), _jsx("p", { className: "text-600 mb-4", children: "Ihre Anlagenkonfiguration ist vollst\u00E4ndig. Starten Sie jetzt die detaillierte Berechnung mit Ertrag, Kosten und Amortisation." }), _jsx(Button, { label: isCalculating ? "Berechnung läuft..." : "Berechnungen starten", icon: isCalculating ? "pi pi-spin pi-spinner" : "pi pi-play", size: "large", severity: "success", onClick: performCalculations, loading: isCalculating, disabled: isCalculating, className: "mb-2" }), _jsx("div", { className: "text-sm text-500", children: "Die Berechnung dauert ca. 10-30 Sekunden" })] }) })), _jsx(Card, { className: "mt-4", children: _jsxs("div", { className: "flex justify-content-between", children: [_jsx(Button, { label: "Zur\u00FCck zur Konfiguration", icon: "pi pi-arrow-left", className: "p-button-outlined", onClick: () => setActiveStep(3) }), calculationResults && (_jsx(Button, { label: "PDF erstellen", icon: "pi pi-file-pdf", severity: "success", onClick: () => {
                                // TODO: Implement PDF generation
                                toast.current?.show({ severity: 'info', summary: 'PDF', detail: 'PDF-Erstellung wird implementiert...' });
                            } }))] }) })] }));
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
    return (_jsxs("div", { className: "solar-calculator-container min-h-screen bg-gray-50 p-4", children: [_jsx(Toast, { ref: toast }), _jsx("div", { className: "max-w-7xl mx-auto mb-4", children: _jsx(Card, { children: _jsxs("div", { className: "flex align-items-center justify-content-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-900 m-0", children: "\u2600\uFE0F Solarkalkulator" }), _jsx("p", { className: "text-600 m-0 mt-2", children: "Konfigurieren Sie Ihre Photovoltaikanlage in 5 einfachen Schritten" })] }), _jsx(Button, { icon: "pi pi-arrow-left", label: "Zur\u00FCck", className: "p-button-outlined", onClick: () => navigate(-1) })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto mb-4", children: _jsxs(Card, { children: [_jsx(Steps, { model: steps, activeIndex: activeStep, onSelect: (e) => setActiveStep(e.index), readOnly: false }), _jsxs("div", { className: "mt-3", children: [_jsx(ProgressBar, { value: ((activeStep + 1) / steps.length) * 100, showValue: false, className: "h-1rem" }), _jsxs("div", { className: "text-center mt-2 text-600", children: ["Schritt ", activeStep + 1, " von ", steps.length, ": ", steps[activeStep].label] })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto mb-4", children: renderStepContent() }), activeStep < 4 && (_jsx("div", { className: "max-w-7xl mx-auto", children: _jsx(Card, { children: _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsx(Button, { label: "Zur\u00FCck", icon: "pi pi-arrow-left", className: "p-button-outlined", onClick: prevStep, disabled: activeStep === 0 }), _jsx("div", { className: "text-center", children: _jsx("small", { className: "text-500", children: errors.length > 0 ? `${errors.length} Fehler beheben` : 'Bereit für nächsten Schritt' }) }), _jsx(Button, { label: "Weiter", icon: "pi pi-arrow-right", iconPos: "right", onClick: nextStep, disabled: errors.length > 0 })] }) }) })), _jsx("style", { children: `
        .solar-calculator-container .p-steps .p-steps-item.p-highlight .p-steps-number {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          border-color: #FF6B35;
        }
        
        .solar-calculator-container .p-progressbar .p-progressbar-value {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        }
      ` })] }));
}
