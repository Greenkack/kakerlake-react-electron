import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ModernCard, ModernButton, ModernInput, ModernSelect } from './ModernUI_PrimeReact';
import { ResponsiveGrid, ResponsiveContainer, ResponsiveNavigation, ResponsiveSidebar, ResponsiveTable, useResponsive } from './ResponsiveLayout_PrimeReact';
import { WorkflowProvider } from '../lib/workflowIntegration';
// Beispiel-Komponente für PV-Angebotserstellung
export const PVOfferExample = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const { isMobile, isDesktop } = useResponsive();
    // Beispiel-Navigationselemente
    const navItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => console.log('Dashboard clicked')
        },
        {
            label: 'Projekte',
            icon: 'pi pi-folder',
            items: [
                { label: 'Neues Projekt', icon: 'pi pi-plus' },
                { label: 'Alle Projekte', icon: 'pi pi-list' }
            ]
        },
        {
            label: 'Angebote',
            icon: 'pi pi-file-pdf',
            command: () => console.log('Angebote clicked')
        }
    ];
    // Beispiel-Tabellendaten
    const projectData = [
        {
            id: 1,
            kunde: 'Max Mustermann',
            anlage: '10 kWp',
            status: 'In Bearbeitung',
            erstellt: '2025-09-10'
        },
        {
            id: 2,
            kunde: 'Anna Schmidt',
            anlage: '15 kWp',
            status: 'Angebot erstellt',
            erstellt: '2025-09-09'
        }
    ];
    // Tabellenspalten-Definition
    const tableColumns = [
        { field: 'kunde', header: 'Kunde', sortable: true },
        { field: 'anlage', header: 'Anlagengröße', sortable: true },
        { field: 'status', header: 'Status' },
        { field: 'erstellt', header: 'Erstellt am', sortable: true }
    ];
    // Mobile Card-Template für Tabelle
    const mobileCardTemplate = (item) => (_jsxs("div", { children: [_jsx("div", { className: "font-bold text-900 mb-2", children: item.kunde }), _jsxs("div", { className: "text-600 mb-1", children: ["Anlage: ", item.anlage] }), _jsxs("div", { className: "text-600 mb-1", children: ["Status: ", item.status] }), _jsxs("div", { className: "text-500 text-sm", children: ["Erstellt: ", item.erstellt] })] }));
    return (_jsx(WorkflowProvider, { workflowType: "pv_project", children: _jsxs("div", { className: "min-h-screen surface-ground", children: [_jsx(ResponsiveNavigation, { items: navItems, logo: _jsx("span", { className: "font-bold text-primary", children: "Kakerlake PV" }), onMenuToggle: () => setSidebarVisible(true) }), _jsx(ResponsiveSidebar, { visible: sidebarVisible, onHide: () => setSidebarVisible(false), header: "Navigation", children: _jsx("div", { className: "p-3", children: navItems.map((item, index) => (_jsx("div", { className: "mb-2", children: _jsx(ModernButton, { icon: item.icon, className: "w-full justify-content-start", text: true, onClick: item.command, children: item.label }) }, index))) }) }), _jsxs(ResponsiveContainer, { size: "xl", padding: "lg", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h1", { className: "text-3xl font-bold text-900 mb-2", children: "PV-Anlagen Dashboard" }), _jsx("p", { className: "text-600", children: "Verwalten Sie Ihre Photovoltaik-Projekte und Angebote" })] }), _jsxs(ResponsiveGrid, { cols: isMobile ? 1 : isDesktop ? 4 : 2, gap: "md", className: "mb-6", children: [_jsxs(ModernCard, { title: "Aktive Projekte", variant: "elevated", size: "md", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: "12" }), _jsx("div", { className: "text-600 text-sm", children: "+2 seit letzter Woche" })] }), _jsxs(ModernCard, { title: "Angebote erstellt", variant: "elevated", size: "md", children: [_jsx("div", { className: "text-2xl font-bold text-green-500", children: "8" }), _jsx("div", { className: "text-600 text-sm", children: "Durchschnitt: 6/Woche" })] }), _jsxs(ModernCard, { title: "Gesamtleistung", variant: "elevated", size: "md", children: [_jsx("div", { className: "text-2xl font-bold text-orange-500", children: "248 kWp" }), _jsx("div", { className: "text-600 text-sm", children: "Installierte Leistung" })] }), _jsxs(ModernCard, { title: "Umsatz (Monat)", variant: "elevated", size: "md", children: [_jsx("div", { className: "text-2xl font-bold text-blue-500", children: "\u20AC 145.200" }), _jsx("div", { className: "text-600 text-sm", children: "+15% zum Vormonat" })] })] }), _jsxs(ResponsiveGrid, { cols: isMobile ? 1 : 2, gap: "lg", className: "mb-6", children: [_jsx(ModernCard, { title: "Neues Projekt erstellen", variant: "outlined", size: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsx(ModernInput, { label: "Kundenname", placeholder: "Name des Kunden eingeben", icon: "pi pi-user" }), _jsx(ModernSelect, { label: "Anlagentyp", options: [
                                                    { label: 'Aufdach-Anlage', value: 'aufdach' },
                                                    { label: 'Flachdach-Anlage', value: 'flachdach' },
                                                    { label: 'Freiflächen-Anlage', value: 'freiflaeche' }
                                                ] }), _jsx(ModernInput, { label: "Gew\u00FCnschte Leistung (kWp)", type: "number", placeholder: "z.B. 10", icon: "pi pi-bolt" }), _jsxs(ModernButton, { variant: "primary", className: "w-full", children: [_jsx("i", { className: "pi pi-plus mr-2" }), "Projekt erstellen"] })] }) }), _jsx(ModernCard, { title: "Schnellaktionen", variant: "subtle", size: "lg", children: _jsxs("div", { className: "space-y-3", children: [_jsx(ModernButton, { outlined: true, className: "w-full justify-content-start", icon: "pi pi-calculator", children: "PV-Rechner starten" }), _jsx(ModernButton, { outlined: true, className: "w-full justify-content-start", icon: "pi pi-file-import", children: "Stammdaten importieren" }), _jsx(ModernButton, { outlined: true, className: "w-full justify-content-start", icon: "pi pi-chart-line", children: "Berichte generieren" }), _jsx(ModernButton, { outlined: true, className: "w-full justify-content-start", icon: "pi pi-cog", children: "Einstellungen" })] }) })] }), _jsx(ModernCard, { title: "Aktuelle Projekte", variant: "default", size: "lg", children: _jsx(ResponsiveTable, { data: projectData, columns: tableColumns, mobileCardTemplate: mobileCardTemplate, emptyMessage: "Keine Projekte vorhanden" }) })] })] }) }));
};
export default PVOfferExample;
