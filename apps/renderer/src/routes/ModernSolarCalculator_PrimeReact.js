import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Fallback für useProject - verwende beide mögliche Implementierungen
let useProject;
try {
    useProject = require('../state/project').useProject;
}
catch {
    try {
        useProject = require('../lib/projectContext').useProject;
    }
    catch {
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
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from 'primereact/avatar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Skeleton } from 'primereact/skeleton';
import { SpeedDial } from 'primereact/speeddial';
import { Rating } from 'primereact/rating';
import { Knob } from 'primereact/knob';
// PrimeReact Icons
import 'primeicons/primeicons.css';
// PrimeReact Theme
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
// Mock-Produkte Hook mit erweiterten Daten
function useProducts() {
    const [data, setData] = useState({
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
    const toast = useRef(null);
    const messagesRef = useRef(null);
    // State Management
    const [activeStep, setActiveStep] = useState(0);
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleQuantity, setModuleQuantity] = useState(20);
    const [selectedInverter, setSelectedInverter] = useState(null);
    const [inverterQuantity, setInverterQuantity] = useState(1);
    const [withStorage, setWithStorage] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [storageQuantity, setStorageQuantity] = useState(1);
    const [additionalComponents, setAdditionalComponents] = useState([]);
    const [notes, setNotes] = useState('');
    // UI State
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [productDetailsVisible, setProductDetailsVisible] = useState(false);
    const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [compareProducts, setCompareProducts] = useState([]);
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
        if (selectedModule?.price_euro)
            totalPrice += selectedModule.price_euro * moduleQuantity;
        if (selectedInverter?.price_euro)
            totalPrice += selectedInverter.price_euro * inverterQuantity;
        if (selectedStorage?.price_euro && withStorage)
            totalPrice += selectedStorage.price_euro * storageQuantity;
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
    const toolbarStartContent = (_jsxs("div", { className: "flex gap-2 align-items-center", children: [_jsx(Avatar, { icon: "pi pi-sun", className: "mr-2", style: { backgroundColor: '#2196F3', color: '#ffffff' } }), _jsx("span", { className: "font-bold text-xl", children: "Solar Konfigurator" }), _jsx(Badge, { value: "PRO", severity: "success" })] }));
    const toolbarEndContent = (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { icon: "pi pi-list", className: "p-button-outlined", onClick: () => setSidebarVisible(true), tooltip: "Produktliste anzeigen", tooltipOptions: { position: 'bottom' } }), _jsx(Button, { icon: "pi pi-chart-line", className: "p-button-outlined", tooltip: "Berechnungen anzeigen", tooltipOptions: { position: 'bottom' } }), _jsx(Button, { icon: "pi pi-cog", className: "p-button-outlined", tooltip: "Einstellungen", tooltipOptions: { position: 'bottom' } })] }));
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
                toast.current?.show({ severity: 'info', summary: 'Zurückgesetzt', detail: 'Konfiguration wurde zurückgesetzt' });
            }
        },
        {
            label: 'Speichern',
            icon: 'pi pi-save',
            command: () => {
                toast.current?.show({ severity: 'success', summary: 'Gespeichert', detail: 'Konfiguration wurde gespeichert' });
            }
        },
        {
            label: 'Exportieren',
            icon: 'pi pi-download',
            command: () => {
                toast.current?.show({ severity: 'info', summary: 'Export', detail: 'PDF wird generiert...' });
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
    const productCardTemplate = (product) => (_jsx(Card, { className: "mb-3 surface-border", children: _jsxs("div", { className: "flex flex-column lg:flex-row gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-content-between align-items-start mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "m-0 font-bold text-primary", children: product.hersteller }), _jsx("p", { className: "m-0 text-600", children: product.produkt_modell })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Tag, { value: product.origin_country, icon: "pi pi-flag" }), product.rating && _jsx(Rating, { value: product.rating, readOnly: true, cancel: false })] })] }), _jsxs("div", { className: "grid", children: [product.pv_modul_leistung && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Leistung" }), _jsxs("div", { className: "font-bold", children: [product.pv_modul_leistung, " Wp"] })] })), product.wr_leistung_kw && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Leistung" }), _jsxs("div", { className: "font-bold", children: [product.wr_leistung_kw, " kW"] })] })), product.kapazitaet_speicher_kwh && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Kapazit\u00E4t" }), _jsxs("div", { className: "font-bold", children: [product.kapazitaet_speicher_kwh, " kWh"] })] })), product.efficiency_percent && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Wirkungsgrad" }), _jsxs("div", { className: "font-bold", children: [product.efficiency_percent, "%"] })] })), product.price_euro && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Preis" }), _jsxs("div", { className: "font-bold text-primary", children: [product.price_euro.toLocaleString('de-DE'), " \u20AC"] })] })), product.warranty_years && (_jsxs("div", { className: "col-6 lg:col-3", children: [_jsx("div", { className: "text-500 text-sm", children: "Garantie" }), _jsxs("div", { className: "font-bold", children: [product.warranty_years, " Jahre"] })] }))] }), product.description && (_jsx("p", { className: "mt-2 text-600 line-height-3", children: product.description }))] }), _jsxs("div", { className: "flex flex-column gap-2 min-w-120", children: [_jsx(Button, { label: "Ausw\u00E4hlen", className: "p-button-primary", onClick: () => {
                                if (product.kategorie.includes('Modul'))
                                    setSelectedModule(product);
                                else if (product.kategorie.includes('Wechselrichter'))
                                    setSelectedInverter(product);
                                else if (product.kategorie.includes('Speicher'))
                                    setSelectedStorage(product);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Ausgewählt',
                                    detail: `${product.produkt_modell} wurde ausgewählt`
                                });
                            } }), _jsx(Button, { label: "Details", className: "p-button-outlined", onClick: () => {
                                setSelectedDetailProduct(product);
                                setProductDetailsVisible(true);
                            } }), _jsx(Button, { icon: "pi pi-heart", className: "p-button-outlined p-button-secondary", tooltip: "Zu Favoriten hinzuf\u00FCgen" })] })] }) }));
    if (!loaded) {
        return (_jsxs("div", { className: "flex flex-column gap-3 p-4", children: [_jsx(Skeleton, { width: "100%", height: "4rem" }), _jsx(Skeleton, { width: "100%", height: "20rem" }), _jsx(Skeleton, { width: "100%", height: "15rem" })] }));
    }
    return (_jsxs("div", { className: "min-h-screen surface-50", children: [_jsx(Toast, { ref: toast }), _jsx(Messages, { ref: messagesRef }), _jsx(Toolbar, { start: toolbarStartContent, end: toolbarEndContent, className: "shadow-2 border-noround" }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "grid mb-4", children: [_jsx("div", { className: "col-12 lg:col-3", children: _jsxs(Card, { className: "text-center border-left-3 border-blue-500", children: [_jsx("div", { className: "text-blue-600 font-medium text-sm", children: "Gesamtleistung" }), _jsxs("div", { className: "text-4xl font-bold text-blue-800 mt-2", children: [calculations.totalKWp.toFixed(2), _jsx("span", { className: "text-lg ml-1", children: "kWp" })] }), _jsx(ProgressBar, { value: (calculations.totalKWp / 15) * 100, showValue: false, className: "mt-2" })] }) }), _jsx("div", { className: "col-12 lg:col-3", children: _jsxs(Card, { className: "text-center border-left-3 border-green-500", children: [_jsx("div", { className: "text-green-600 font-medium text-sm", children: "Jahresertrag" }), _jsxs("div", { className: "text-4xl font-bold text-green-800 mt-2", children: [(calculations.estimatedYield / 1000).toFixed(1), _jsx("span", { className: "text-lg ml-1", children: "MWh" })] }), _jsx(ProgressBar, { value: (calculations.estimatedYield / 20000) * 100, showValue: false, className: "mt-2", color: "#22c55e" })] }) }), _jsx("div", { className: "col-12 lg:col-3", children: _jsxs(Card, { className: "text-center border-left-3 border-orange-500", children: [_jsx("div", { className: "text-orange-600 font-medium text-sm", children: "Speicher" }), _jsxs("div", { className: "text-4xl font-bold text-orange-800 mt-2", children: [calculations.totalStorageKWh.toFixed(1), _jsx("span", { className: "text-lg ml-1", children: "kWh" })] }), _jsx(ProgressBar, { value: withStorage ? 100 : 0, showValue: false, className: "mt-2", color: "#f97316" })] }) }), _jsx("div", { className: "col-12 lg:col-3", children: _jsxs(Card, { className: "text-center border-left-3 border-purple-500", children: [_jsx("div", { className: "text-purple-600 font-medium text-sm", children: "Investition" }), _jsxs("div", { className: "text-4xl font-bold text-purple-800 mt-2", children: [(calculations.totalPrice / 1000).toFixed(0), _jsx("span", { className: "text-lg ml-1", children: "T\u20AC" })] }), _jsx(ProgressBar, { value: (calculations.totalPrice / 50000) * 100, showValue: false, className: "mt-2", color: "#a855f7" })] }) })] }), _jsxs(Splitter, { style: { height: 'calc(100vh - 300px)' }, className: "shadow-2", children: [_jsx(SplitterPanel, { size: 30, minSize: 25, children: _jsx(ScrollPanel, { style: { width: '100%', height: '100%' }, children: _jsxs(Card, { className: "h-full", children: [_jsxs("h3", { className: "mt-0 mb-4 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-list text-primary" }), "Konfigurationsschritte"] }), _jsx(Steps, { model: steps, activeIndex: activeStep, onSelect: (e) => setActiveStep(e.index), readOnly: false }), _jsx(Divider, {}), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "mb-3", children: "Aktuelle Auswahl" }), selectedModule && (_jsx("div", { className: "mb-3 p-3 surface-100 border-round", children: _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm", children: selectedModule.hersteller }), _jsx("div", { className: "text-600 text-xs", children: selectedModule.produkt_modell })] }), _jsx(Chip, { label: `${moduleQuantity}x`, className: "bg-blue-500 text-white" })] }) })), selectedInverter && (_jsx("div", { className: "mb-3 p-3 surface-100 border-round", children: _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm", children: selectedInverter.hersteller }), _jsx("div", { className: "text-600 text-xs", children: selectedInverter.produkt_modell })] }), _jsx(Chip, { label: `${inverterQuantity}x`, className: "bg-orange-500 text-white" })] }) })), selectedStorage && withStorage && (_jsx("div", { className: "mb-3 p-3 surface-100 border-round", children: _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm", children: selectedStorage.hersteller }), _jsx("div", { className: "text-600 text-xs", children: selectedStorage.produkt_modell })] }), _jsx(Chip, { label: `${storageQuantity}x`, className: "bg-green-500 text-white" })] }) }))] })] }) }) }), _jsx(SplitterPanel, { size: 70, children: _jsx(ScrollPanel, { style: { width: '100%', height: '100%' }, children: _jsxs("div", { className: "p-4", children: [activeStep === 0 && (_jsxs(Card, { children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-4", children: [_jsxs("h2", { className: "m-0 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-sun text-primary" }), "PV-Module ausw\u00E4hlen"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(InputNumber, { value: moduleQuantity, onValueChange: (e) => setModuleQuantity(e.value || 1), showButtons: true, buttonLayout: "horizontal", step: 1, min: 1, max: 100, decrementButtonIcon: "pi pi-minus", incrementButtonIcon: "pi pi-plus", suffix: " Module" }), _jsx(Button, { icon: "pi pi-filter", className: "p-button-outlined", tooltip: "Filter anzeigen" })] })] }), _jsx("div", { className: "grid", children: modules.map(product => (_jsx("div", { className: "col-12", children: productCardTemplate(product) }, product.id))) })] })), activeStep === 1 && (_jsxs(Card, { children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-4", children: [_jsxs("h2", { className: "m-0 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-cog text-primary" }), "Wechselrichter ausw\u00E4hlen"] }), _jsx(InputNumber, { value: inverterQuantity, onValueChange: (e) => setInverterQuantity(e.value || 1), showButtons: true, buttonLayout: "horizontal", step: 1, min: 1, max: 10, suffix: " WR" })] }), _jsx("div", { className: "grid", children: inverters.map(product => (_jsx("div", { className: "col-12", children: productCardTemplate(product) }, product.id))) })] })), activeStep === 2 && (_jsxs(Card, { children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-4", children: [_jsxs("h2", { className: "m-0 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-battery-3 text-primary" }), "Batteriespeicher (Optional)"] }), _jsxs("div", { className: "flex align-items-center gap-3", children: [_jsx(Checkbox, { inputId: "storage-checkbox", checked: withStorage, onChange: (e) => setWithStorage(e.checked || false) }), _jsx("label", { htmlFor: "storage-checkbox", className: "ml-2", children: "Speicher hinzuf\u00FCgen" }), withStorage && (_jsx(InputNumber, { value: storageQuantity, onValueChange: (e) => setStorageQuantity(e.value || 1), showButtons: true, buttonLayout: "horizontal", step: 1, min: 1, max: 5, suffix: " Speicher" }))] })] }), withStorage ? (_jsx("div", { className: "grid", children: storages.map(product => (_jsx("div", { className: "col-12", children: productCardTemplate(product) }, product.id))) })) : (_jsx(Panel, { header: "Warum einen Batteriespeicher?", className: "mt-4", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsx("i", { className: "pi pi-shield text-primary text-4xl mb-3" }), _jsx("h4", { children: "Unabh\u00E4ngigkeit" }), _jsx("p", { className: "text-600", children: "Reduzieren Sie Ihre Abh\u00E4ngigkeit vom Stromnetz" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsx("i", { className: "pi pi-euro text-primary text-4xl mb-3" }), _jsx("h4", { children: "Kosteneinsparung" }), _jsx("p", { className: "text-600", children: "Senken Sie Ihre Stromkosten langfristig" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsx("i", { className: "pi pi-bolt text-primary text-4xl mb-3" }), _jsx("h4", { children: "Notstrom" }), _jsx("p", { className: "text-600", children: "Bleiben Sie auch bei Stromausf\u00E4llen versorgt" })] }) })] }) }))] })), activeStep === 3 && (_jsxs(Card, { children: [_jsxs("h2", { className: "mt-0 mb-4 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-plus-circle text-primary" }), "Zus\u00E4tzliche Komponenten"] }), _jsx("div", { className: "grid", children: additionalOptions.map(option => (_jsx("div", { className: "col-12 md:col-6 lg:col-4", children: _jsx(Card, { className: "h-full hover:shadow-4 transition-all transition-duration-200", children: _jsxs("div", { className: "flex flex-column h-full", children: [_jsxs("div", { className: "flex justify-content-between align-items-start mb-3", children: [_jsx("h4", { className: "m-0", children: option.name }), _jsx(Checkbox, { checked: additionalComponents.includes(option.key), onChange: (e) => {
                                                                                        if (e.checked) {
                                                                                            setAdditionalComponents([...additionalComponents, option.key]);
                                                                                        }
                                                                                        else {
                                                                                            setAdditionalComponents(additionalComponents.filter(c => c !== option.key));
                                                                                        }
                                                                                    } })] }), _jsx("div", { className: "flex-1" }), _jsxs("div", { className: "text-primary font-bold text-xl", children: ["+", option.price.toLocaleString('de-DE'), " \u20AC"] })] }) }) }, option.key))) }), _jsx(Divider, {}), _jsx(Fieldset, { legend: "Anmerkungen", className: "mt-4", children: _jsx(InputTextarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 4, className: "w-full", placeholder: "Zus\u00E4tzliche W\u00FCnsche, Anmerkungen oder spezielle Anforderungen..." }) })] })), activeStep === 4 && (_jsxs(Card, { children: [_jsxs("h2", { className: "mt-0 mb-4 flex align-items-center gap-2", children: [_jsx("i", { className: "pi pi-check-circle text-primary" }), "Konfiguration Zusammenfassung"] }), _jsxs(TabView, { children: [_jsx(TabPanel, { header: "Komponenten", leftIcon: "pi pi-list", children: _jsxs(DataTable, { value: [
                                                                        ...(selectedModule ? [{ ...selectedModule, qty: moduleQuantity, total: (selectedModule.price_euro || 0) * moduleQuantity }] : []),
                                                                        ...(selectedInverter ? [{ ...selectedInverter, qty: inverterQuantity, total: (selectedInverter.price_euro || 0) * inverterQuantity }] : []),
                                                                        ...(selectedStorage && withStorage ? [{ ...selectedStorage, qty: storageQuantity, total: (selectedStorage.price_euro || 0) * storageQuantity }] : [])
                                                                    ], children: [_jsx(Column, { field: "kategorie", header: "Kategorie" }), _jsx(Column, { field: "hersteller", header: "Hersteller" }), _jsx(Column, { field: "produkt_modell", header: "Modell" }), _jsx(Column, { field: "qty", header: "Anzahl" }), _jsx(Column, { field: "total", header: "Summe", body: (rowData) => `${rowData.total.toLocaleString('de-DE')} €` })] }) }), _jsx(TabPanel, { header: "Leistungsdaten", leftIcon: "pi pi-chart-line", children: _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Panel, { header: "Anlagenleistung", children: _jsx("div", { className: "flex align-items-center justify-content-center", children: _jsx(Knob, { value: calculations.totalKWp, max: 50, valueTemplate: "{value} kWp", readOnly: true, size: 150 }) }) }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Panel, { header: "Jahresertrag", children: _jsx("div", { className: "flex align-items-center justify-content-center", children: _jsx(Knob, { value: calculations.estimatedYield / 1000, max: 50, valueTemplate: "{value} MWh", readOnly: true, size: 150, strokeWidth: 8 }) }) }) })] }) }), _jsx(TabPanel, { header: "Kostenaufstellung", leftIcon: "pi pi-euro", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-6xl font-bold text-primary mb-4", children: [calculations.totalPrice.toLocaleString('de-DE'), " \u20AC"] }), _jsx("div", { className: "text-xl text-600", children: "Gesamtinvestition (netto)" }), _jsx(Divider, {}), _jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [((calculations.totalPrice * 0.7) / 20).toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-600", children: "Monatliche Rate (20 Jahre, 70% Finanzierung)" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [(calculations.estimatedYield * 0.08).toFixed(0), " \u20AC"] }), _jsx("div", { className: "text-600", children: "J\u00E4hrliche Stromkosteneinsparung" })] }) }), _jsx("div", { className: "col-12 md:col-4", children: _jsxs("div", { className: "text-center p-3", children: [_jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [Math.round(calculations.totalPrice / (calculations.estimatedYield * 0.08)), " Jahre"] }), _jsx("div", { className: "text-600", children: "Amortisationsdauer" })] }) })] })] }) })] }), _jsx(Divider, {}), _jsxs("div", { className: "flex gap-3 justify-content-end", children: [_jsx(Button, { label: "PDF generieren", icon: "pi pi-file-pdf", className: "p-button-outlined" }), _jsx(Button, { label: "Angebot erstellen", icon: "pi pi-send", onClick: () => {
                                                                    toast.current?.show({
                                                                        severity: 'success',
                                                                        summary: 'Angebot erstellt',
                                                                        detail: 'Das Angebot wurde erfolgreich generiert'
                                                                    });
                                                                    navigate('/offers');
                                                                } })] })] }))] }) }) })] })] }), _jsxs(Sidebar, { visible: sidebarVisible, onHide: () => setSidebarVisible(false), position: "right", style: { width: '40rem' }, children: [_jsx("h3", { children: "Alle Produkte" }), _jsxs(TabView, { children: [_jsx(TabPanel, { header: "Module", children: modules.map(product => (_jsx("div", { className: "mb-3", children: productCardTemplate(product) }, product.id))) }), _jsx(TabPanel, { header: "Wechselrichter", children: inverters.map(product => (_jsx("div", { className: "mb-3", children: productCardTemplate(product) }, product.id))) }), _jsx(TabPanel, { header: "Speicher", children: storages.map(product => (_jsx("div", { className: "mb-3", children: productCardTemplate(product) }, product.id))) })] })] }), _jsx(Dialog, { visible: productDetailsVisible, onHide: () => setProductDetailsVisible(false), header: "Produktdetails", style: { width: '50rem' }, children: selectedDetailProduct && (_jsxs("div", { children: [_jsxs("h2", { children: [selectedDetailProduct.hersteller, " ", selectedDetailProduct.produkt_modell] }), _jsx("p", { children: selectedDetailProduct.description })] })) }), _jsx(SpeedDial, { model: speedDialItems, radius: 80, type: "circle", buttonClassName: "p-button-help", style: { position: 'fixed', bottom: '20px', right: '20px' } })] }));
}
