import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatGermanNumber } from '../../utils/germanFormat';
const mockDatabaseInfo = {
    name: 'solar_app.db',
    size: '24,8 MB',
    lastBackup: '2024-03-15 14:30:00',
    recordCount: 1847,
    status: 'healthy'
};
const mockTables = [
    {
        name: 'customers',
        displayName: 'Kunden',
        recordCount: 245,
        size: '2,1 MB',
        lastModified: '2024-03-15 10:45:00',
        description: 'Kundendaten und Kontaktinformationen'
    },
    {
        name: 'projects',
        displayName: 'Projekte',
        recordCount: 189,
        size: '4,3 MB',
        lastModified: '2024-03-15 09:30:00',
        description: 'PV-Projekte und Konfigurationen'
    },
    {
        name: 'products',
        displayName: 'Produkte',
        recordCount: 342,
        size: '1,8 MB',
        lastModified: '2024-03-14 16:20:00',
        description: 'Produktkatalog mit Preisen'
    },
    {
        name: 'offers',
        displayName: 'Angebote',
        recordCount: 156,
        size: '3,2 MB',
        lastModified: '2024-03-15 11:15:00',
        description: 'Generierte Angebote und PDFs'
    },
    {
        name: 'price_matrix',
        displayName: 'Preismatrix',
        recordCount: 28,
        size: '0,9 MB',
        lastModified: '2024-03-10 14:00:00',
        description: 'Aktuelle Preisstrukturen'
    },
    {
        name: 'system_settings',
        displayName: 'Systemeinstellungen',
        recordCount: 42,
        size: '0,3 MB',
        lastModified: '2024-03-15 12:00:00',
        description: 'Konfigurationsparameter'
    }
];
const mockBackups = [
    {
        id: '1',
        filename: 'solar_app_2024-03-15_14-30.db',
        size: '24,8 MB',
        created: '2024-03-15 14:30:00',
        type: 'auto',
        status: 'completed'
    },
    {
        id: '2',
        filename: 'solar_app_2024-03-14_14-30.db',
        size: '24,2 MB',
        created: '2024-03-14 14:30:00',
        type: 'auto',
        status: 'completed'
    },
    {
        id: '3',
        filename: 'solar_app_manual_2024-03-13.db',
        size: '23,9 MB',
        created: '2024-03-13 16:45:00',
        type: 'manual',
        status: 'completed'
    },
    {
        id: '4',
        filename: 'solar_app_2024-03-12_14-30.db',
        size: '23,5 MB',
        created: '2024-03-12 14:30:00',
        type: 'auto',
        status: 'completed'
    }
];
export default function DatabaseManagement() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isBackupRunning, setIsBackupRunning] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [maintenanceResults, setMaintenanceResults] = useState(null);
    const createBackup = async () => {
        setIsBackupRunning(true);
        // Simuliere Backup-Prozess
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsBackupRunning(false);
        alert('Backup erfolgreich erstellt!');
    };
    const runMaintenance = async (type) => {
        const results = {
            optimize: {
                title: 'Datenbankoptimierung',
                message: 'Datenbank wurde optimiert. Indizes aktualisiert, nicht genutzte Bereiche bereinigt.',
                timeSaved: '0,3 Sekunden',
                spaceSaved: '2,1 MB'
            },
            vacuum: {
                title: 'Speicher-Bereinigung',
                message: 'Nicht genutzter Speicherplatz wurde freigegeben.',
                timeSaved: '0,1 Sekunden',
                spaceSaved: '1,8 MB'
            },
            integrity: {
                title: 'Integritätsprüfung',
                message: 'Alle Datenbankstrukturen sind korrekt. Keine Fehler gefunden.',
                issues: 0,
                checkedRecords: 1847
            }
        };
        setMaintenanceResults(results[type]);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-slate-600 bg-slate-100';
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Link, { to: "/admin", className: "text-slate-500 hover:text-slate-700", children: "Admin" }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "text-slate-900 font-medium", children: "Datenbankmanagement" })] }), _jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\uD83D\uDCBE Datenbankmanagement" }), _jsx("p", { className: "text-slate-600", children: "Verwalten Sie Ihre Datenbank und Backups" })] }), _jsx("div", { className: "flex gap-3", children: _jsx("button", { onClick: createBackup, disabled: isBackupRunning, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2", children: isBackupRunning ? '⏳ Erstelle Backup...' : '💾 Backup erstellen' }) })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-6 py-6", children: _jsxs("div", { className: "bg-white rounded-lg border mb-6", children: [_jsx("div", { className: "flex border-b", children: [
                                { key: 'overview', label: '📊 Übersicht', icon: '📊' },
                                { key: 'tables', label: '🗃️ Tabellen', icon: '🗃️' },
                                { key: 'backups', label: '💾 Backups', icon: '💾' },
                                { key: 'maintenance', label: '🔧 Wartung', icon: '🔧' }
                            ].map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: `px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.key
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`, children: [_jsx("span", { children: tab.icon }), tab.label] }, tab.key))) }), _jsxs("div", { className: "p-6", children: [activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Datenbankgr\u00F6\u00DFe" }), _jsx("span", { className: "text-lg", children: "\uD83D\uDCCA" })] }), _jsx("div", { className: "text-2xl font-bold text-slate-900", children: mockDatabaseInfo.size })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Gesamtdatens\u00E4tze" }), _jsx("span", { className: "text-lg", children: "\uD83D\uDCCB" })] }), _jsx("div", { className: "text-2xl font-bold text-slate-900", children: formatGermanNumber(mockDatabaseInfo.recordCount) })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Status" }), _jsx("span", { className: "text-lg", children: "\u2705" })] }), _jsx("div", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mockDatabaseInfo.status)}`, children: mockDatabaseInfo.status === 'healthy' ? 'Gesund' : 'Warnung' })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Letztes Backup" }), _jsx("span", { className: "text-lg", children: "\uD83D\uDCBE" })] }), _jsx("div", { className: "text-sm font-medium text-slate-900", children: new Date(mockDatabaseInfo.lastBackup).toLocaleString('de-DE') })] })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Schnellaktionen" }), _jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("button", { onClick: () => runMaintenance('optimize'), className: "p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u26A1" }), _jsx("div", { className: "font-medium mb-1", children: "Optimieren" }), _jsx("div", { className: "text-sm text-slate-600", children: "Datenbank-Performance verbessern" })] }), _jsxs("button", { onClick: () => runMaintenance('vacuum'), className: "p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83E\uDDF9" }), _jsx("div", { className: "font-medium mb-1", children: "Bereinigen" }), _jsx("div", { className: "text-sm text-slate-600", children: "Nicht genutzten Speicher freigeben" })] }), _jsxs("button", { onClick: () => runMaintenance('integrity'), className: "p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDD0D" }), _jsx("div", { className: "font-medium mb-1", children: "Pr\u00FCfen" }), _jsx("div", { className: "text-sm text-slate-600", children: "Integrit\u00E4t der Daten \u00FCberpr\u00FCfen" })] })] })] }), maintenanceResults && (_jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-green-600 text-xl", children: "\u2705" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-green-900", children: maintenanceResults.title }), _jsx("p", { className: "text-green-800 mb-2", children: maintenanceResults.message }), maintenanceResults.spaceSaved && (_jsxs("div", { className: "text-sm text-green-700", children: ["Gespartzr Speicher: ", maintenanceResults.spaceSaved, " | Performance-Verbesserung: ", maintenanceResults.timeSaved] })), maintenanceResults.checkedRecords && (_jsxs("div", { className: "text-sm text-green-700", children: ["Gepr\u00FCfte Datens\u00E4tze: ", formatGermanNumber(maintenanceResults.checkedRecords), " | Gefundene Probleme: ", maintenanceResults.issues] }))] })] }) }))] })), activeTab === 'tables' && (_jsx("div", { className: "space-y-6", children: _jsx("div", { className: "grid gap-4", children: mockTables.map(table => (_jsx("div", { className: "bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: table.displayName }), _jsx("span", { className: "text-xs text-slate-500 font-mono", children: table.name })] }), _jsx("p", { className: "text-slate-600 mb-3", children: table.description }), _jsxs("div", { className: "flex items-center gap-6 text-sm text-slate-500", children: [_jsxs("span", { children: ["\uD83D\uDCCA ", formatGermanNumber(table.recordCount), " Datens\u00E4tze"] }), _jsxs("span", { children: ["\uD83D\uDCBE ", table.size] }), _jsxs("span", { children: ["\uD83D\uDCC5 ", new Date(table.lastModified).toLocaleString('de-DE')] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\uD83D\uDCCA Analysieren" }), _jsx("button", { className: "px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\uD83D\uDCE4 Exportieren" })] })] }) }, table.name))) }) })), activeTab === 'backups' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Verf\u00FCgbare Backups" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\uD83D\uDCC2 Backup-Ordner \u00F6ffnen" }), _jsx("button", { className: "px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\u2699\uFE0F Backup-Einstellungen" })] })] }), _jsx("div", { className: "grid gap-4", children: mockBackups.map(backup => (_jsx("div", { className: "bg-white border rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "font-mono text-slate-900", children: backup.filename }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`, children: backup.type === 'auto' ? 'Automatisch' : 'Manuell' }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${backup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: backup.status === 'completed' ? 'Abgeschlossen' : 'Fehlgeschlagen' })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-500", children: [_jsxs("span", { children: ["\uD83D\uDCC5 ", new Date(backup.created).toLocaleString('de-DE')] }), _jsxs("span", { children: ["\uD83D\uDCBE ", backup.size] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors", children: "\uD83D\uDD04 Wiederherstellen" }), _jsx("button", { className: "px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\uD83D\uDCE5 Herunterladen" }), _jsx("button", { className: "px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors", children: "\uD83D\uDDD1\uFE0F" })] })] }) }, backup.id))) })] })), activeTab === 'maintenance' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-slate-50 rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\u26A1" }), " Performance-Optimierung"] }), _jsx("p", { className: "text-slate-600 mb-4", children: "Verbessern Sie die Datenbankperformance durch Indexoptimierung und Fragmentierungsbereinigung." }), _jsx("button", { onClick: () => runMaintenance('optimize'), className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Datenbank optimieren" })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\uD83E\uDDF9" }), " Speicher-Bereinigung"] }), _jsx("p", { className: "text-slate-600 mb-4", children: "Geben Sie nicht genutzten Speicherplatz frei und komprimieren Sie die Datenbankdatei." }), _jsx("button", { onClick: () => runMaintenance('vacuum'), className: "w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Speicher bereinigen" })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDD0D" }), " Integrit\u00E4tspr\u00FCfung"] }), _jsx("p", { className: "text-slate-600 mb-4", children: "\u00DCberpr\u00FCfen Sie die Integrit\u00E4t Ihrer Datenbank und entdecken Sie potentielle Probleme." }), _jsx("button", { onClick: () => runMaintenance('integrity'), className: "w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors", children: "Integrit\u00E4t pr\u00FCfen" })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDCCA" }), " Statistiken aktualisieren"] }), _jsx("p", { className: "text-slate-600 mb-4", children: "Aktualisieren Sie die Datenbankstatistiken f\u00FCr bessere Abfrageoptimierung." }), _jsx("button", { className: "w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "Statistiken aktualisieren" })] })] }), _jsxs("div", { className: "bg-white border rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\u23F0 Geplante Wartung" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "T\u00E4gliche Optimierung" }), _jsx("div", { className: "text-sm text-slate-600", children: "Jeden Tag um 02:00 Uhr" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "W\u00F6chentliche Bereinigung" }), _jsx("div", { className: "text-sm text-slate-600", children: "Jeden Sonntag um 03:00 Uhr" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Monatliche Integrit\u00E4tspr\u00FCfung" }), _jsx("div", { className: "text-sm text-slate-600", children: "Jeden 1. des Monats um 04:00 Uhr" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })] })] })] })] })] }))] })] }) })] }));
}
