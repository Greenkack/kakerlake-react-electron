import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatGermanNumber } from '../../utils/germanFormat';
const mockSettings = [
    // Allgemeine Einstellungen
    {
        id: '1',
        category: 'general',
        key: 'company_name',
        name: 'Firmenname',
        description: 'Name Ihres Unternehmens für Angebote und Rechnungen',
        type: 'text',
        value: 'Solar Solutions GmbH',
        defaultValue: 'Mein Unternehmen',
        validation: { required: true }
    },
    {
        id: '2',
        category: 'general',
        key: 'company_logo',
        name: 'Firmen-Logo',
        description: 'Logo für PDF-Angebote (empfohlen: PNG, max. 2MB)',
        type: 'file',
        value: '/assets/logo.png',
        defaultValue: null
    },
    {
        id: '3',
        category: 'general',
        key: 'default_currency',
        name: 'Standard-Währung',
        description: 'Währung für alle Preisangaben',
        type: 'select',
        value: 'EUR',
        defaultValue: 'EUR',
        options: [
            { value: 'EUR', label: '€ Euro' },
            { value: 'USD', label: '$ Dollar' },
            { value: 'CHF', label: 'CHF Schweizer Franken' }
        ]
    },
    // Berechnungseinstellungen
    {
        id: '4',
        category: 'calculation',
        key: 'default_electricity_price',
        name: 'Standard Strompreis',
        description: 'Durchschnittlicher Strompreis für Berechnungen',
        type: 'number',
        value: 0.35,
        defaultValue: 0.32,
        unit: '€/kWh',
        validation: { min: 0.1, max: 1.0 }
    },
    {
        id: '5',
        category: 'calculation',
        key: 'feed_in_tariff',
        name: 'Einspeisevergütung',
        description: 'Aktuelle Einspeisevergütung für PV-Anlagen',
        type: 'number',
        value: 0.082,
        defaultValue: 0.082,
        unit: '€/kWh',
        validation: { min: 0.01, max: 0.5 }
    },
    {
        id: '6',
        category: 'calculation',
        key: 'vat_rate',
        name: 'Mehrwertsteuersatz',
        description: 'Standard MwSt.-Satz für Berechnungen',
        type: 'number',
        value: 19,
        defaultValue: 19,
        unit: '%',
        validation: { min: 0, max: 50 }
    },
    {
        id: '7',
        category: 'calculation',
        key: 'safety_margin',
        name: 'Sicherheitsfaktor',
        description: 'Aufschlag für Materialpreise und unvorhergesehene Kosten',
        type: 'number',
        value: 10,
        defaultValue: 10,
        unit: '%',
        validation: { min: 0, max: 50 },
        isAdvanced: true
    },
    // PDF-Einstellungen
    {
        id: '8',
        category: 'pdf',
        key: 'pdf_template',
        name: 'PDF-Vorlage',
        description: 'Standard-Vorlage für Angebote',
        type: 'select',
        value: 'professional',
        defaultValue: 'standard',
        options: [
            { value: 'standard', label: 'Standard' },
            { value: 'professional', label: 'Professionell' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'custom', label: 'Benutzerdefiniert' }
        ]
    },
    {
        id: '9',
        category: 'pdf',
        key: 'include_technical_specs',
        name: 'Technische Daten einbeziehen',
        description: 'Detaillierte technische Spezifikationen in PDFs',
        type: 'boolean',
        value: true,
        defaultValue: true
    },
    {
        id: '10',
        category: 'pdf',
        key: 'watermark_enabled',
        name: 'Wasserzeichen aktivieren',
        description: 'Wasserzeichen für Angebot-PDFs',
        type: 'boolean',
        value: false,
        defaultValue: false,
        isAdvanced: true
    },
    // E-Mail-Einstellungen
    {
        id: '11',
        category: 'email',
        key: 'smtp_server',
        name: 'SMTP-Server',
        description: 'Server für E-Mail-Versand',
        type: 'text',
        value: 'smtp.gmail.com',
        defaultValue: '',
        isAdvanced: true
    },
    {
        id: '12',
        category: 'email',
        key: 'email_signature',
        name: 'E-Mail-Signatur',
        description: 'Standard-Signatur für automatische E-Mails',
        type: 'text',
        value: 'Mit freundlichen Grüßen\nIhr Solar Solutions Team',
        defaultValue: 'Mit freundlichen Grüßen'
    },
    // Backup-Einstellungen
    {
        id: '13',
        category: 'backup',
        key: 'auto_backup_enabled',
        name: 'Automatische Backups',
        description: 'Tägliche Datensicherung aktivieren',
        type: 'boolean',
        value: true,
        defaultValue: true
    },
    {
        id: '14',
        category: 'backup',
        key: 'backup_retention_days',
        name: 'Backup-Aufbewahrung',
        description: 'Anzahl Tage für Backup-Aufbewahrung',
        type: 'number',
        value: 30,
        defaultValue: 30,
        unit: 'Tage',
        validation: { min: 1, max: 365 },
        isAdvanced: true
    }
];
const categoryLabels = {
    general: 'Allgemein',
    calculation: 'Berechnungen',
    pdf: 'PDF-Einstellungen',
    email: 'E-Mail',
    backup: 'Backup & Sicherheit'
};
const categoryIcons = {
    general: '⚙️',
    calculation: '🧮',
    pdf: '📄',
    email: '✉️',
    backup: '💾'
};
export default function SystemSettings() {
    const [settings, setSettings] = useState(mockSettings);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredSettings = settings.filter(setting => {
        const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory;
        const matchesSearch = setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            setting.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAdvanced = showAdvanced || !setting.isAdvanced;
        return matchesCategory && matchesSearch && matchesAdvanced;
    });
    const updateSetting = (id, value) => {
        setSettings(prev => prev.map(setting => setting.id === id ? { ...setting, value } : setting));
        setHasChanges(true);
    };
    const resetToDefault = (id) => {
        const setting = settings.find(s => s.id === id);
        if (setting) {
            updateSetting(id, setting.defaultValue);
        }
    };
    const saveSettings = async () => {
        // Hier würde die API-Call zum Speichern der Settings erfolgen
        console.log('Settings saved:', settings);
        setHasChanges(false);
        // Erfolgs-Notification anzeigen
        alert('Einstellungen erfolgreich gespeichert!');
    };
    const resetAllSettings = () => {
        if (confirm('Alle Einstellungen auf Standardwerte zurücksetzen?')) {
            setSettings(prev => prev.map(setting => ({
                ...setting,
                value: setting.defaultValue
            })));
            setHasChanges(true);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Link, { to: "/admin", className: "text-slate-500 hover:text-slate-700", children: "Admin" }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "text-slate-900 font-medium", children: "Systemeinstellungen" })] }), _jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\u2699\uFE0F Systemeinstellungen" }), _jsx("p", { className: "text-slate-600", children: "Konfigurieren Sie Ihr System nach Ihren Anforderungen" })] }), _jsxs("div", { className: "flex gap-3", children: [hasChanges && (_jsx("button", { onClick: saveSettings, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2", children: "\uD83D\uDCBE \u00C4nderungen speichern" })), _jsx("button", { onClick: resetAllSettings, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Zur\u00FCcksetzen" })] })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-6 py-6", children: _jsxs("div", { className: "grid lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg border p-4 sticky top-6", children: [_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "text", placeholder: "Einstellung suchen...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsx("div", { className: "absolute left-2.5 top-2.5 text-slate-400 text-sm", children: "\uD83D\uDD0D" })] }), _jsx("div", { className: "space-y-1 mb-4", children: Object.entries(categoryLabels).map(([key, label]) => (_jsxs("button", { onClick: () => setSelectedCategory(key), className: `w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === key
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-700 hover:bg-slate-100'}`, children: [_jsx("span", { className: "text-lg", children: categoryIcons[key] }), label] }, key))) }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: showAdvanced, onChange: (e) => setShowAdvanced(e.target.checked), className: "rounded border-slate-300" }), _jsx("span", { className: "text-slate-700", children: "Erweiterte Optionen" })] })] }) }), _jsx("div", { className: "lg:col-span-3", children: _jsxs("div", { className: "space-y-6", children: [selectedCategory !== 'all' && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("span", { className: "text-2xl", children: categoryIcons[selectedCategory] }), _jsx("h2", { className: "text-xl font-semibold text-slate-900", children: categoryLabels[selectedCategory] })] }), _jsx("div", { className: "space-y-6", children: filteredSettings.map(setting => (_jsx(SettingItem, { setting: setting, onUpdate: updateSetting, onReset: resetToDefault }, setting.id))) })] })), filteredSettings.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\u2699\uFE0F" }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-2", children: "Keine Einstellungen gefunden" }), _jsx("p", { className: "text-slate-600", children: searchTerm ? `Keine Einstellungen für "${searchTerm}"` : 'Keine Einstellungen in dieser Kategorie' })] }))] }) })] }) })] }));
}
// Setting Item Component
function SettingItem({ setting, onUpdate, onReset }) {
    const hasChanged = setting.value !== setting.defaultValue;
    const renderInput = () => {
        switch (setting.type) {
            case 'text':
                return (_jsx("input", { type: "text", value: setting.value || '', onChange: (e) => onUpdate(setting.id, e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: setting.validation?.required }));
            case 'number':
                return (_jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: setting.value || '', onChange: (e) => onUpdate(setting.id, parseFloat(e.target.value) || 0), min: setting.validation?.min, max: setting.validation?.max, step: "0.001", className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), setting.unit && (_jsx("div", { className: "absolute right-3 top-2.5 text-slate-500 text-sm", children: setting.unit }))] }));
            case 'boolean':
                return (_jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: setting.value || false, onChange: (e) => onUpdate(setting.id, e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" }), _jsx("span", { className: "ml-3 text-sm text-slate-900", children: setting.value ? 'Aktiviert' : 'Deaktiviert' })] }));
            case 'select':
                return (_jsx("select", { value: setting.value || '', onChange: (e) => onUpdate(setting.id, e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: setting.options?.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) }));
            case 'color':
                return (_jsx("input", { type: "color", value: setting.value || '#000000', onChange: (e) => onUpdate(setting.id, e.target.value), className: "w-20 h-10 border border-slate-300 rounded-lg cursor-pointer" }));
            case 'file':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "file", onChange: (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    // Hier würde der File-Upload erfolgen
                                    onUpdate(setting.id, `/uploads/${file.name}`);
                                }
                            }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg" }), setting.value && (_jsxs("div", { className: "text-sm text-slate-600", children: ["Aktuell: ", setting.value] }))] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: `p-4 rounded-lg border-2 transition-all ${hasChanged ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-medium text-slate-900", children: setting.name }), setting.isAdvanced && (_jsx("span", { className: "px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium", children: "Erweitert" })), hasChanged && (_jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium", children: "Ge\u00E4ndert" }))] }), _jsx("p", { className: "text-sm text-slate-600", children: setting.description })] }), hasChanged && (_jsx("button", { onClick: () => onReset(setting.id), className: "ml-3 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition-colors", title: "Auf Standardwert zur\u00FCcksetzen", children: "\u21BA Reset" }))] }), _jsx("div", { className: "max-w-md", children: renderInput() }), setting.validation && (_jsxs("div", { className: "mt-2 text-xs text-slate-500", children: [setting.validation.required && _jsx("span", { children: "\u2022 Pflichtfeld " }), setting.validation.min && _jsxs("span", { children: ["\u2022 Min: ", formatGermanNumber(setting.validation.min), " "] }), setting.validation.max && _jsxs("span", { children: ["\u2022 Max: ", formatGermanNumber(setting.validation.max), " "] })] }))] }));
}
