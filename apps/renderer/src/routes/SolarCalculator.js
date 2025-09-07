import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../lib/projectContext';
// Mock-Ladefunktion – später ersetzen durch echte Bridge (IPC/fetch)
function useProducts() {
    const [data, setData] = useState({ modules: [], inverters: [], storages: [] });
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        let cancelled = false;
        async function loadReal() {
            try {
                const api = window.solarAPI;
                if (!api) {
                    setLoaded(true);
                    return;
                }
                // Lade alle Hersteller und deren Modelle
                const [pvBrands, invBrands, storBrands] = await Promise.all([
                    api.getPVManufacturers(),
                    api.getInverterManufacturers(),
                    api.getStorageManufacturers(),
                ]);
                const [pvModelsArr, invModelsArr, storModelsArr] = await Promise.all([
                    Promise.all((pvBrands || []).map((b) => api.getPVModelsByManufacturer(b))),
                    Promise.all((invBrands || []).map((b) => api.getInverterModelsByManufacturer(b))),
                    Promise.all((storBrands || []).map((b) => api.getStorageModelsByManufacturer(b))),
                ]);
                if (cancelled)
                    return;
                const pvModels = pvModelsArr.flat();
                const invModels = invModelsArr.flat();
                const stModels = storModelsArr.flat();
                setData({
                    modules: (pvModels || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.kategorie,
                        hersteller: m.hersteller,
                        produkt_modell: m.produkt_modell,
                        pv_modul_leistung: m.pv_modul_leistung,
                    })),
                    inverters: (invModels || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.kategorie,
                        hersteller: m.hersteller,
                        produkt_modell: m.produkt_modell,
                        wr_leistung_kw: m.wr_leistung_kw,
                    })),
                    storages: (stModels || []).map((m) => ({
                        id: String(m.id),
                        kategorie: m.kategorie,
                        hersteller: m.hersteller,
                        produkt_modell: m.produkt_modell,
                        kapazitaet_speicher_kwh: m.kapazitaet_speicher_kwh,
                    })),
                });
                setLoaded(true);
            }
            catch (e) {
                console.error('Echt-Daten Laden fehlgeschlagen, fallback Mock', e);
                setLoaded(true);
            }
        }
        loadReal();
        return () => { cancelled = true; };
    }, []);
    return { ...data, loaded };
}
export default function SolarCalculator() {
    const navigate = useNavigate();
    const { state: projectState } = useProject();
    const { modules: moduleProducts, inverters, storages } = useProducts();
    // State für zusätzliche Komponenten
    const [wallboxProducts, setWallboxProducts] = useState([]);
    const [emsProducts, setEmsProducts] = useState([]);
    const [optimizerProducts, setOptimizerProducts] = useState([]);
    const [carportProducts, setCarportProducts] = useState([]);
    const [emergencyPowerProducts, setEmergencyPowerProducts] = useState([]);
    const [animalProtectionProducts, setAnimalProtectionProducts] = useState([]);
    // Schritt-Logik (2 Seiten: Technik Kern / Zusatz folgt später)
    const [step, setStep] = useState(1);
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
    // Filtered Models für zusätzliche Komponenten
    const wallboxModels = wallboxProducts.filter((p) => !config.wallboxBrand || p.hersteller === config.wallboxBrand);
    const emsModels = emsProducts.filter((p) => !config.emsBrand || p.hersteller === config.emsBrand);
    const optimizerModels = optimizerProducts.filter((p) => !config.optimizerBrand || p.hersteller === config.optimizerBrand);
    const carportModels = carportProducts.filter((p) => !config.carportBrand || p.hersteller === config.carportBrand);
    const emergencyPowerModels = emergencyPowerProducts.filter((p) => !config.emergencyPowerBrand || p.hersteller === config.emergencyPowerBrand);
    const animalProtectionModels = animalProtectionProducts.filter((p) => !config.animalProtectionBrand || p.hersteller === config.animalProtectionBrand);
    // Validierung Kernschritt
    const errors = [];
    if (step === 1) {
        if (config.moduleQty <= 0)
            errors.push('Anzahl Module > 0 erforderlich');
        if (!config.moduleModel)
            errors.push('Modul-Modell wählen');
        if (!config.invModel)
            errors.push('Wechselrichter-Modell wählen');
        if (config.invQty <= 0)
            errors.push('Anzahl Wechselrichter > 0 erforderlich');
        if (config.withStorage && !config.storageModel)
            errors.push('Speicher-Modell wählen (wenn Speicher aktiviert)');
    }
    if (step === 2 && config.additionalComponents) {
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
    function goNext() {
        if (errors.length === 0) {
            if (step === 1)
                setStep(2);
            // Schritt 2 ist letzter Schritt, führt direkt zu finishAndBack
        }
    }
    async function finishAndBack() {
        try {
            // Konfiguration via Electron Bridge speichern
            const res = window.solarAPI
                ? await window.solarAPI.saveConfiguration(config)
                : { success: false };
            if (!res?.success)
                throw new Error('Fehler beim Speichern der Konfiguration');
            console.log('Solar Configuration gespeichert:', config);
            navigate('/results'); // Zu Ergebnissen navigieren
        }
        catch (error) {
            console.error('Speicherfehler:', error);
            alert('Konfiguration konnte nicht gespeichert werden');
        }
    }
    return (_jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [_jsxs("header", { className: "rounded-xl bg-white p-4 shadow flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Solarkalkulator" }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["Schritt ", step, " / 2 \u2013 Technik konfigurieren"] })] }), _jsx("span", { className: "text-xs text-gray-400", children: "Build SC-TS v1" })] }), step === 1 && (_jsxs("section", { className: "rounded-xl bg-white p-5 shadow space-y-8", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-blue-600 font-medium", children: "\uD83D\uDE80 Demo-Konfiguration" }) }), _jsxs("div", { className: "text-sm text-blue-700 grid gap-1 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("strong", { children: "Anzahl Module:" }), " ", config.moduleQty] }), _jsxs("div", { children: [_jsx("strong", { children: "Leistung pro Modul:" }), " ", moduleWp, " Wp"] }), _jsxs("div", { children: [_jsx("strong", { children: "Anlagengr\u00F6\u00DFe:" }), " ", kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " kWp"] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "PV Module" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Anzahl PV Module" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => setConfig(prev => ({ ...prev, moduleQty: Math.max(0, prev.moduleQty - 1) })), className: "rounded bg-gray-200 px-3 py-2 hover:bg-gray-300", children: "\u2212" }), _jsx("input", { type: "number", className: "w-full rounded border px-3 py-2", value: config.moduleQty, onChange: e => setConfig(prev => ({ ...prev, moduleQty: parseInt(e.target.value || '0', 10) })), min: 0 }), _jsx("button", { type: "button", onClick: () => setConfig(prev => ({ ...prev, moduleQty: prev.moduleQty + 1 })), className: "rounded bg-gray-200 px-3 py-2 hover:bg-gray-300", children: "+" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.moduleBrand, onChange: e => { setConfig(prev => ({ ...prev, moduleBrand: e.target.value, moduleModel: '' })); }, className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), moduleBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.moduleModel, onChange: e => setConfig(prev => ({ ...prev, moduleModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), filteredModuleModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "rounded border bg-gray-50 p-3 text-sm", children: [_jsx("div", { className: "text-gray-600", children: "Leistung pro Modul (Wp)" }), _jsx("div", { className: "font-semibold text-lg", children: moduleWp || 0 })] }), _jsxs("div", { className: "rounded border bg-blue-50 p-3 text-sm border-blue-200", children: [_jsx("div", { className: "text-blue-700", children: "Anlagengr\u00F6\u00DFe (kWp)" }), _jsx("div", { className: "font-bold text-2xl text-blue-800", children: kWp.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })] }), _jsxs("div", { className: "rounded border bg-green-50 p-3 text-sm border-green-200", children: [_jsx("div", { className: "text-green-700", children: "Jahresertrag (gesch\u00E4tzt)" }), _jsxs("div", { className: "font-semibold text-lg text-green-800", children: [Math.round(kWp * 950).toLocaleString('de-DE'), " kWh"] })] })] })] }), _jsxs("div", { className: "space-y-4 pt-2 border-t", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Wechselrichter" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.invBrand, onChange: e => { setConfig(prev => ({ ...prev, invBrand: e.target.value, invModel: '' })); }, className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), inverterBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.invModel, onChange: e => setConfig(prev => ({ ...prev, invModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), filteredInvModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Anzahl WR" }), _jsx("input", { type: "number", className: "w-full rounded border px-3 py-2", value: config.invQty, onChange: e => setConfig(prev => ({ ...prev, invQty: Math.max(1, parseInt(e.target.value || '1', 10)) })), min: 1 })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "rounded border bg-gray-50 p-3 text-sm", children: [_jsx("div", { className: "text-gray-600", children: "Leistung je WR (kW)" }), _jsx("div", { className: "font-semibold text-lg", children: currentInv?.wr_leistung_kw ?? 0 })] }), _jsxs("div", { className: "rounded border bg-gray-50 p-3 text-sm", children: [_jsx("div", { className: "text-gray-600", children: "WR Gesamt (kW)" }), _jsx("div", { className: "font-semibold text-lg", children: totalInvPowerKW.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })] })] })] }), _jsxs("div", { className: "space-y-4 pt-2 border-t", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { id: "withStorage", type: "checkbox", checked: config.withStorage, onChange: e => setConfig(prev => ({ ...prev, withStorage: e.target.checked })) }), _jsx("label", { htmlFor: "withStorage", className: "text-sm font-medium", children: "Batteriespeicher einplanen" })] }), config.withStorage && (_jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.storageBrand, onChange: e => { setConfig(prev => ({ ...prev, storageBrand: e.target.value, storageModel: '' })); }, className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), storageBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.storageModel, onChange: e => setConfig(prev => ({ ...prev, storageModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), filteredStorageModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Gew\u00FCnschte Gesamtkapazit\u00E4t (kWh)" }), _jsx("input", { type: "number", className: "w-full rounded border px-3 py-2", min: 0, value: config.storageDesiredKWh, onChange: e => setConfig(prev => ({ ...prev, storageDesiredKWh: parseFloat(e.target.value || '0') })) })] }), _jsxs("div", { className: "rounded border bg-gray-50 p-3 text-sm col-span-2", children: [_jsx("div", { className: "text-gray-600", children: "Kapazit\u00E4t Modell (kWh)" }), _jsx("div", { className: "font-semibold text-lg", children: storageModelKWh || 0 })] })] }))] }), errors.length > 0 && (_jsx("div", { className: "rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 space-y-1", children: errors.map(e => _jsxs("div", { children: ["\u2022 ", e] }, e)) })), _jsx("div", { className: "flex justify-end pt-4", children: _jsx("button", { onClick: goNext, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50", disabled: errors.length > 0, children: "N\u00E4chste Seite" }) })] })), step === 2 && (_jsxs("section", { className: "rounded-xl bg-white p-5 shadow space-y-6", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Zus\u00E4tzliche Komponenten" }), _jsx("div", { children: _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.additionalComponents, onChange: e => setConfig(prev => ({ ...prev, additionalComponents: e.target.checked })) }), _jsx("span", { children: "Zus\u00E4tzliche Komponenten hinzuf\u00FCgen" })] }) }), config.additionalComponents && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.wallboxEnabled, onChange: e => setConfig(prev => ({ ...prev, wallboxEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Wallbox" })] }), config.wallboxEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.wallboxBrand, onChange: e => setConfig(prev => ({ ...prev, wallboxBrand: e.target.value, wallboxModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), wallboxBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.wallboxModel, onChange: e => setConfig(prev => ({ ...prev, wallboxModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), wallboxModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }))] }), _jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.emsEnabled, onChange: e => setConfig(prev => ({ ...prev, emsEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Energie Management System (EMS)" })] }), config.emsEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.emsBrand, onChange: e => setConfig(prev => ({ ...prev, emsBrand: e.target.value, emsModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), emsBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.emsModel, onChange: e => setConfig(prev => ({ ...prev, emsModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), emsModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }))] }), _jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.optimizerEnabled, onChange: e => setConfig(prev => ({ ...prev, optimizerEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Optimizer" })] }), config.optimizerEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-3 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.optimizerBrand, onChange: e => setConfig(prev => ({ ...prev, optimizerBrand: e.target.value, optimizerModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), optimizerBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.optimizerModel, onChange: e => setConfig(prev => ({ ...prev, optimizerModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), optimizerModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Anzahl" }), _jsx("input", { type: "number", value: config.optimizerQty, onChange: e => setConfig(prev => ({ ...prev, optimizerQty: parseInt(e.target.value || '0', 10) })), className: "w-full rounded border px-3 py-2", min: "0" })] })] }))] }), _jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.carportEnabled, onChange: e => setConfig(prev => ({ ...prev, carportEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Carport" })] }), config.carportEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.carportBrand, onChange: e => setConfig(prev => ({ ...prev, carportBrand: e.target.value, carportModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), carportBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.carportModel, onChange: e => setConfig(prev => ({ ...prev, carportModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), carportModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }))] }), _jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.emergencyPowerEnabled, onChange: e => setConfig(prev => ({ ...prev, emergencyPowerEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Notstrom" })] }), config.emergencyPowerEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.emergencyPowerBrand, onChange: e => setConfig(prev => ({ ...prev, emergencyPowerBrand: e.target.value, emergencyPowerModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), emergencyPowerBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.emergencyPowerModel, onChange: e => setConfig(prev => ({ ...prev, emergencyPowerModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), emergencyPowerModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }))] }), _jsxs("div", { className: "border rounded p-4 space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.animalProtectionEnabled, onChange: e => setConfig(prev => ({ ...prev, animalProtectionEnabled: e.target.checked })) }), _jsx("span", { className: "font-medium", children: "Tierabwehr" })] }), config.animalProtectionEnabled && (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 ml-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Hersteller" }), _jsxs("select", { value: config.animalProtectionBrand, onChange: e => setConfig(prev => ({ ...prev, animalProtectionBrand: e.target.value, animalProtectionModel: '' })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), animalProtectionBrands.map(b => _jsx("option", { value: b, children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Modell" }), _jsxs("select", { value: config.animalProtectionModel, onChange: e => setConfig(prev => ({ ...prev, animalProtectionModel: e.target.value })), className: "w-full rounded border px-3 py-2", children: [_jsx("option", { value: "", children: "-- w\u00E4hlen --" }), animalProtectionModels.map(m => _jsx("option", { value: m.produkt_modell, children: m.produkt_modell }, m.id))] })] })] }))] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Sonstiges (frei)" }), _jsx("input", { value: config.otherComponentNote, onChange: e => setConfig(prev => ({ ...prev, otherComponentNote: e.target.value })), maxLength: 120, className: "w-full rounded border px-3 py-2", placeholder: "Freitext..." })] }), _jsxs("div", { className: "flex justify-between pt-4", children: [_jsx("button", { onClick: () => setStep(1), className: "bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg", children: "Zur\u00FCck" }), _jsx("button", { onClick: finishAndBack, className: "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg", children: "Berechnungen Starten" })] })] })), _jsx("div", { className: "text-center", children: _jsx(Link, { to: "/home", className: "inline-block text-sm text-gray-500 hover:underline", children: "\u2190 Zur\u00FCck zur Startseite" }) })] }));
}
