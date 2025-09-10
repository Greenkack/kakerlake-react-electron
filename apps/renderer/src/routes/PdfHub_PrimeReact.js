import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Message } from 'primereact/message';
// Navigationskomponente für PDF-Seiten
function PdfNavigation() {
    const location = useLocation();
    const navItems = [
        { path: '/pdf', label: 'PDF-Hub', icon: 'pi-file' },
        { path: '/pdf/standard', label: 'Standard', icon: 'pi-file-pdf' },
        { path: '/pdf/extended', label: 'Erweitert', icon: 'pi-list' },
        { path: '/pdf/multi', label: 'Multi-PDF', icon: 'pi-copy' },
        { path: '/pdf/preview', label: 'Vorschau', icon: 'pi-eye' }
    ];
    return (_jsx(Card, { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [navItems.map(item => (_jsx(Link, { to: item.path, children: _jsx(Button, { label: item.label, icon: item.icon, className: `p-button-sm ${location.pathname === item.path
                            ? 'p-button-raised'
                            : 'p-button-outlined'}` }) }, item.path))), _jsx("div", { className: "ml-auto", children: _jsx(Link, { to: "/home", children: _jsx(Button, { label: "Zur\u00FCck", icon: "pi pi-arrow-left", className: "p-button-text p-button-sm" }) }) })] }) }));
}
// Standard-PDF Seite
function StandardPdf() {
    const [isGenerating, setIsGenerating] = useState(false);
    const templateOptions = [
        { label: 'Template A (Standard)', value: 'template_a' },
        { label: 'Template B (Modern)', value: 'template_b' },
        { label: 'Template C (Kompakt)', value: 'template_c' }
    ];
    return (_jsxs("div", { className: "p-3", children: [_jsx(PdfNavigation, {}), _jsxs(Card, { title: "\uD83D\uDCD1 Standard-PDF (7 Seiten)", className: "w-full", pt: {
                    body: { className: 'p-4' },
                    content: { className: 'p-0' }
                }, children: [_jsx("p", { className: "text-600 mb-4", children: "Generieren Sie ein standardisiertes 7-seitiges PV-Angebot mit allen wichtigen Informationen." }), _jsx(Divider, {}), _jsxs("div", { className: "space-y-4", children: [_jsx(Panel, { header: "Template-Auswahl", className: "w-full", children: _jsx(Dropdown, { options: templateOptions, placeholder: "W\u00E4hlen Sie ein Template", className: "w-full" }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsx(Button, { label: "PDF erstellen", icon: "pi pi-file-pdf", className: "p-button-success", loading: isGenerating, onClick: () => {
                                            setIsGenerating(true);
                                            setTimeout(() => setIsGenerating(false), 2000);
                                        } }), _jsx(Button, { label: "Vorschau", icon: "pi pi-eye", className: "p-button-outlined" }), _jsx(Button, { label: "Template bearbeiten", icon: "pi pi-cog", className: "p-button-text" })] })] })] })] }));
}
// Erweiterte PDF Seite
function ExtendedPdf() {
    const [options, setOptions] = useState({
        includeCharts: true,
        includeCompanyDocs: false,
        includeTechnicalDetails: true,
        includeFinancialAnalysis: true
    });
    const [isGenerating, setIsGenerating] = useState(false);
    return (_jsxs("div", { className: "p-3", children: [_jsx(PdfNavigation, {}), _jsxs(Card, { title: "\uD83D\uDCCB Erweiterte PDF-Ausgabe", className: "w-full", children: [_jsx("p", { className: "text-600 mb-4", children: "Erstellen Sie eine umfassende PDF mit zus\u00E4tzlichen Analysen und benutzerdefinierten Optionen." }), _jsx(Divider, {}), _jsxs("div", { className: "space-y-4", children: [_jsx(Panel, { header: "PDF-Optionen", className: "w-full", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex align-items-center gap-2", children: [_jsx(Checkbox, { inputId: "charts", checked: options.includeCharts, onChange: (e) => setOptions(prev => ({
                                                        ...prev,
                                                        includeCharts: e.checked
                                                    })) }), _jsx("label", { htmlFor: "charts", className: "text-sm", children: "Charts und Diagramme einschlie\u00DFen" })] }), _jsxs("div", { className: "flex align-items-center gap-2", children: [_jsx(Checkbox, { inputId: "company", checked: options.includeCompanyDocs, onChange: (e) => setOptions(prev => ({
                                                        ...prev,
                                                        includeCompanyDocs: e.checked
                                                    })) }), _jsx("label", { htmlFor: "company", className: "text-sm", children: "Firmendokumente anh\u00E4ngen" })] }), _jsxs("div", { className: "flex align-items-center gap-2", children: [_jsx(Checkbox, { inputId: "technical", checked: options.includeTechnicalDetails, onChange: (e) => setOptions(prev => ({
                                                        ...prev,
                                                        includeTechnicalDetails: e.checked
                                                    })) }), _jsx("label", { htmlFor: "technical", className: "text-sm", children: "Technische Details" })] }), _jsxs("div", { className: "flex align-items-center gap-2", children: [_jsx(Checkbox, { inputId: "financial", checked: options.includeFinancialAnalysis, onChange: (e) => setOptions(prev => ({
                                                        ...prev,
                                                        includeFinancialAnalysis: e.checked
                                                    })) }), _jsx("label", { htmlFor: "financial", className: "text-sm", children: "Finanzanalyse" })] })] }) }), _jsx(Button, { label: "Erweiterte PDF erstellen", icon: "pi pi-file-pdf", className: "w-full p-button-success", loading: isGenerating, onClick: () => {
                                    setIsGenerating(true);
                                    setTimeout(() => setIsGenerating(false), 3000);
                                } })] })] })] }));
}
// Multi-PDF Generation Seite
function MultiPdf() {
    const [config, setConfig] = useState({
        firmCount: 3,
        priceStaffing: 'standard',
        rotation: 'automatic'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const firmOptions = [
        { label: '2 Firmen', value: 2 },
        { label: '3 Firmen', value: 3 },
        { label: '4 Firmen', value: 4 },
        { label: '5 Firmen', value: 5 }
    ];
    const staffingOptions = [
        { label: 'Standard-Preise', value: 'standard' },
        { label: 'Gestaffelt (5%, 10%, 15%)', value: 'graduated' },
        { label: 'Individuell', value: 'custom' }
    ];
    const rotationOptions = [
        { label: 'Automatisch', value: 'automatic' },
        { label: 'Manuell festgelegt', value: 'manual' },
        { label: 'Keine Rotation', value: 'none' }
    ];
    return (_jsxs("div", { className: "p-3", children: [_jsx(PdfNavigation, {}), _jsxs(Card, { title: "\uD83D\uDCDA Multi-PDF Generation", className: "w-full", children: [_jsx("p", { className: "text-600 mb-4", children: "Erstellen Sie mehrere PDF-Varianten f\u00FCr verschiedene Firmen mit unterschiedlichen Preisen." }), _jsx(Divider, {}), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Panel, { header: "Anzahl Firmen", className: "w-full", children: _jsx(Dropdown, { value: config.firmCount, options: firmOptions, onChange: (e) => setConfig(prev => ({
                                                ...prev,
                                                firmCount: e.value
                                            })), className: "w-full" }) }), _jsx(Panel, { header: "Preis-Staffelung", className: "w-full", children: _jsx(Dropdown, { value: config.priceStaffing, options: staffingOptions, onChange: (e) => setConfig(prev => ({
                                                ...prev,
                                                priceStaffing: e.value
                                            })), className: "w-full" }) }), _jsx(Panel, { header: "Rotation", className: "w-full", children: _jsx(Dropdown, { value: config.rotation, options: rotationOptions, onChange: (e) => setConfig(prev => ({
                                                ...prev,
                                                rotation: e.value
                                            })), className: "w-full" }) })] }), _jsx(Message, { severity: "info", text: `Es werden ${config.firmCount} PDF-Dateien mit ${config.priceStaffing} Preismodell erstellt.` }), _jsx(Button, { label: `${config.firmCount} PDFs generieren`, icon: "pi pi-copy", className: "w-full p-button-success", loading: isGenerating, onClick: () => {
                                    setIsGenerating(true);
                                    setTimeout(() => setIsGenerating(false), 4000);
                                } })] })] })] }));
}
// PDF-Vorschau Seite
function PdfPreview() {
    const [selectedPages, setSelectedPages] = useState([1, 2, 3]);
    const pages = [
        { id: 1, title: 'Deckblatt', description: 'Firmenlogo und Projektdaten' },
        { id: 2, title: 'Anschreiben', description: 'Persönliche Ansprache' },
        { id: 3, title: 'Anlagendaten', description: 'Technische Spezifikationen' },
        { id: 4, title: 'Wirtschaftlichkeit', description: 'Kosten und Amortisation' },
        { id: 5, title: 'Produktübersicht', description: 'Module und Wechselrichter' },
        { id: 6, title: 'Montage', description: 'Installation und Service' },
        { id: 7, title: 'Anhang', description: 'Zertifikate und Garantien' }
    ];
    return (_jsxs("div", { className: "p-3", children: [_jsx(PdfNavigation, {}), _jsxs(Card, { title: "\uD83D\uDC41\uFE0F PDF-Vorschau", className: "w-full", children: [_jsx("p", { className: "text-600 mb-4", children: "Betrachten Sie die PDF-Struktur und w\u00E4hlen Sie Seiten f\u00FCr die Generierung aus." }), _jsx(Divider, {}), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: pages.map(page => (_jsx(Panel, { header: _jsxs("div", { className: "flex align-items-center justify-content-between w-full", children: [_jsxs("span", { children: ["Seite ", page.id] }), _jsx(Badge, { value: selectedPages.includes(page.id) ? "Aktiv" : "Inaktiv", severity: selectedPages.includes(page.id) ? "success" : "secondary" })] }), className: "w-full", children: _jsxs("div", { className: "text-center", children: [_jsx("h4", { className: "font-medium mb-2", children: page.title }), _jsx("p", { className: "text-sm text-600 mb-3", children: page.description }), _jsxs("div", { className: "flex flex-column gap-2", children: [_jsx(Button, { label: selectedPages.includes(page.id) ? "Entfernen" : "Hinzufügen", size: "small", className: selectedPages.includes(page.id) ? "p-button-danger" : "p-button-success", onClick: () => {
                                                    if (selectedPages.includes(page.id)) {
                                                        setSelectedPages(prev => prev.filter(id => id !== page.id));
                                                    }
                                                    else {
                                                        setSelectedPages(prev => [...prev, page.id]);
                                                    }
                                                } }), _jsx(Button, { label: "Vorschau", icon: "pi pi-eye", size: "small", className: "p-button-outlined" })] })] }) }, page.id))) }), _jsx(Divider, {}), _jsxs("div", { className: "text-center", children: [_jsx(Message, { severity: "info", text: `${selectedPages.length} von ${pages.length} Seiten ausgewählt`, className: "mb-3" }), _jsx(Button, { label: "Ausgew\u00E4hlte Seiten als PDF generieren", icon: "pi pi-file-pdf", className: "p-button-success", disabled: selectedPages.length === 0 })] })] })] }));
}
// Haupt-Hub Seite
function PdfHubHome() {
    return (_jsxs("div", { className: "p-3", children: [_jsx(PdfNavigation, {}), _jsx(Card, { title: "\uD83D\uDCC4 PDF-Generator Hub", className: "w-full mb-4", children: _jsx("p", { className: "text-600 text-lg", children: "Zentrale Anlaufstelle f\u00FCr die PDF-Generierung Ihrer PV-Angebote" }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Link, { to: "/pdf/standard", children: _jsx(Card, { className: "h-full hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-file-pdf text-4xl text-blue-600 mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: "Standard-PDF" }), _jsx("p", { className: "text-sm text-600", children: "7-seitiges Standardangebot" })] }) }) }), _jsx(Link, { to: "/pdf/extended", children: _jsx(Card, { className: "h-full hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-list text-4xl text-green-600 mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: "Erweiterte PDF" }), _jsx("p", { className: "text-sm text-600", children: "Mit zus\u00E4tzlichen Optionen" })] }) }) }), _jsx(Link, { to: "/pdf/multi", children: _jsx(Card, { className: "h-full hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-copy text-4xl text-purple-600 mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: "Multi-PDF" }), _jsx("p", { className: "text-sm text-600", children: "Mehrere Firmen-Varianten" })] }) }) }), _jsx(Link, { to: "/pdf/preview", children: _jsx(Card, { className: "h-full hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("i", { className: "pi pi-eye text-4xl text-orange-600 mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: "Vorschau" }), _jsx("p", { className: "text-sm text-600", children: "PDF-Struktur betrachten" })] }) }) })] })] }));
}
// Haupt-Router Komponente
export default function PdfHub() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PdfHubHome, {}) }), _jsx(Route, { path: "/standard", element: _jsx(StandardPdf, {}) }), _jsx(Route, { path: "/extended", element: _jsx(ExtendedPdf, {}) }), _jsx(Route, { path: "/multi", element: _jsx(MultiPdf, {}) }), _jsx(Route, { path: "/preview", element: _jsx(PdfPreview, {}) })] }));
}
