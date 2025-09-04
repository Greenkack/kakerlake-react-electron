import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
const adminMenuItems = [
    // System Management
    {
        id: 'settings',
        title: 'Systemeinstellungen',
        description: 'Grundeinstellungen der Anwendung verwalten',
        icon: '⚙️',
        path: '/admin/settings',
        category: 'system'
    },
    {
        id: 'database',
        title: 'Datenbank-Verwaltung',
        description: 'Backup, Import/Export und Datenbankwartung',
        icon: '🗄️',
        path: '/admin/database',
        category: 'system'
    },
    {
        id: 'logs',
        title: 'System-Logs',
        description: 'Fehler-Protokolle und System-Ereignisse',
        icon: '📋',
        path: '/admin/logs',
        category: 'system'
    },
    // Content Management
    {
        id: 'products',
        title: 'Produktverwaltung',
        description: 'PV-Module, Wechselrichter, Batterien verwalten',
        icon: '📦',
        path: '/admin/products',
        category: 'content'
    },
    {
        id: 'pricing',
        title: 'Preismatrix',
        description: 'Preise und Tarife konfigurieren',
        icon: '💰',
        path: '/admin/pricing',
        category: 'content'
    },
    {
        id: 'templates',
        title: 'PDF-Vorlagen',
        description: 'Angebots- und Vertragsvorlagen bearbeiten',
        icon: '📄',
        path: '/admin/templates',
        category: 'content'
    },
    {
        id: 'company',
        title: 'Unternehmensdaten',
        description: 'Firmeninformationen und Kontaktdaten',
        icon: '🏢',
        path: '/admin/company',
        category: 'content'
    },
    // User Management
    {
        id: 'users',
        title: 'Benutzerverwaltung',
        description: 'Benutzer, Rollen und Berechtigungen',
        icon: '👥',
        path: '/admin/users',
        category: 'users',
        status: 'new'
    },
    {
        id: 'permissions',
        title: 'Rechte-Management',
        description: 'Zugriffsrechte und Rollen definieren',
        icon: '🔐',
        path: '/admin/permissions',
        category: 'users'
    },
    // Analytics & Reports
    {
        id: 'analytics',
        title: 'Statistiken',
        description: 'Nutzungsstatistiken und KPIs',
        icon: '📊',
        path: '/admin/analytics',
        category: 'analytics'
    },
    {
        id: 'reports',
        title: 'Berichte',
        description: 'Automatisierte Berichte und Auswertungen',
        icon: '📈',
        path: '/admin/reports',
        category: 'analytics'
    },
    {
        id: 'audit',
        title: 'Audit-Log',
        description: 'Änderungsprotokoll und Sicherheitslog',
        icon: '🔍',
        path: '/admin/audit',
        category: 'analytics'
    }
];
const categoryLabels = {
    system: 'System-Verwaltung',
    content: 'Inhalte & Konfiguration',
    users: 'Benutzer-Verwaltung',
    analytics: 'Analysen & Berichte'
};
const categoryColors = {
    system: 'from-blue-50 to-blue-100 border-blue-200',
    content: 'from-green-50 to-green-100 border-green-200',
    users: 'from-purple-50 to-purple-100 border-purple-200',
    analytics: 'from-orange-50 to-orange-100 border-orange-200'
};
export default function AdminDashboard() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const filteredItems = adminMenuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const categorizedItems = Object.entries(categoryLabels).map(([key, label]) => ({
        key,
        label,
        items: filteredItems.filter(item => item.category === key)
    })).filter(cat => cat.items.length > 0);
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\uD83D\uDEE0\uFE0F Administration" }), _jsx("p", { className: "text-slate-600", children: "System-Verwaltung und Konfiguration" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium", children: "System Online" }), _jsx(Link, { to: "/", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Zur\u00FCck zur App" })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-6", children: [_jsxs("div", { className: "mb-6 flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Suchen...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsx("div", { className: "absolute left-3 top-2.5 text-slate-400", children: "\uD83D\uDD0D" })] }) }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => setSelectedCategory('all'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`, children: "Alle" }), Object.entries(categoryLabels).map(([key, label]) => (_jsx("button", { onClick: () => setSelectedCategory(key), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === key
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`, children: label }, key)))] })] }), _jsx("div", { className: "space-y-8", children: selectedCategory === 'all' ? (
                        // Kategorisierte Darstellung
                        categorizedItems.map(category => (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-slate-800 mb-4", children: category.label }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: category.items.map(item => (_jsx(AdminMenuItem, { item: item }, item.id))) })] }, category.key)))) : (
                        // Gefilterte Darstellung
                        _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredItems.map(item => (_jsx(AdminMenuItem, { item: item }, item.id))) })) }), filteredItems.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-2", children: "Keine Ergebnisse" }), _jsxs("p", { className: "text-slate-600", children: ["Keine Admin-Bereiche gefunden f\u00FCr \"", searchTerm, "\""] })] })), _jsxs("div", { className: "mt-12 grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: "12" }), _jsx("div", { className: "text-sm text-slate-600", children: "Aktive Module" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: "3" }), _jsx("div", { className: "text-sm text-slate-600", children: "Benutzer Online" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: "147" }), _jsx("div", { className: "text-sm text-slate-600", children: "Projekte heute" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: "99,2%" }), _jsx("div", { className: "text-sm text-slate-600", children: "System-Uptime" })] })] })] })] }));
}
// Admin Menu Item Component
function AdminMenuItem({ item }) {
    return (_jsxs(Link, { to: item.path, className: `block p-6 rounded-xl border bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${categoryColors[item.category]}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: "text-3xl", children: item.icon }), item.status && (_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${item.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'maintenance'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'}`, children: item.status === 'new' ? 'Neu' : item.status === 'maintenance' ? 'Wartung' : 'Aktiv' }))] }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: item.title }), _jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: item.description })] }));
}
