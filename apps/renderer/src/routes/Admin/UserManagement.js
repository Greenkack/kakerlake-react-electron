import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatGermanNumber } from '../../utils/germanFormat';
const mockUsers = [
    {
        id: '1',
        name: 'Max Mustermann',
        email: 'max.mustermann@company.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15 14:30:00',
        createdAt: '2024-01-15 10:00:00',
        permissions: ['all'],
        avatar: '👤'
    },
    {
        id: '2',
        name: 'Anna Schmidt',
        email: 'anna.schmidt@company.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-03-15 11:20:00',
        createdAt: '2024-01-20 14:30:00',
        permissions: ['projects_manage', 'customers_manage', 'offers_create'],
        avatar: '👩'
    },
    {
        id: '3',
        name: 'Thomas Weber',
        email: 'thomas.weber@company.com',
        role: 'user',
        status: 'active',
        lastLogin: '2024-03-14 16:45:00',
        createdAt: '2024-02-01 09:15:00',
        permissions: ['projects_view', 'customers_view', 'offers_create'],
        avatar: '👨'
    },
    {
        id: '4',
        name: 'Lisa Müller',
        email: 'lisa.mueller@company.com',
        role: 'user',
        status: 'inactive',
        lastLogin: '2024-03-10 13:00:00',
        createdAt: '2024-02-10 11:30:00',
        permissions: ['projects_view', 'customers_view'],
        avatar: '👩‍💼'
    },
    {
        id: '5',
        name: 'Peter Klein',
        email: 'peter.klein@company.com',
        role: 'viewer',
        status: 'pending',
        lastLogin: '',
        createdAt: '2024-03-14 16:00:00',
        permissions: ['projects_view'],
        avatar: '👔'
    }
];
const mockRoles = [
    {
        id: 'admin',
        name: 'admin',
        displayName: 'Administrator',
        description: 'Vollzugriff auf alle Funktionen und Einstellungen',
        permissions: ['all'],
        userCount: 1
    },
    {
        id: 'manager',
        name: 'manager',
        displayName: 'Manager',
        description: 'Verwaltung von Projekten, Kunden und Angeboten',
        permissions: ['projects_manage', 'customers_manage', 'offers_create', 'reports_view'],
        userCount: 1
    },
    {
        id: 'user',
        name: 'user',
        displayName: 'Benutzer',
        description: 'Standardbenutzer mit eingeschränkten Berechtigungen',
        permissions: ['projects_view', 'customers_view', 'offers_create'],
        userCount: 2
    },
    {
        id: 'viewer',
        name: 'viewer',
        displayName: 'Betrachter',
        description: 'Nur Lesezugriff auf ausgewählte Bereiche',
        permissions: ['projects_view'],
        userCount: 1
    }
];
const permissions = [
    { id: 'all', name: 'Vollzugriff', description: 'Zugriff auf alle Funktionen' },
    { id: 'projects_manage', name: 'Projekte verwalten', description: 'Projekte erstellen, bearbeiten, löschen' },
    { id: 'projects_view', name: 'Projekte einsehen', description: 'Projekte nur anzeigen' },
    { id: 'customers_manage', name: 'Kunden verwalten', description: 'Kunden erstellen, bearbeiten, löschen' },
    { id: 'customers_view', name: 'Kunden einsehen', description: 'Kunden nur anzeigen' },
    { id: 'offers_create', name: 'Angebote erstellen', description: 'Neue Angebote generieren' },
    { id: 'offers_manage', name: 'Angebote verwalten', description: 'Angebote bearbeiten und verwalten' },
    { id: 'reports_view', name: 'Berichte einsehen', description: 'Zugriff auf Auswertungen und Statistiken' },
    { id: 'admin_settings', name: 'Admin-Einstellungen', description: 'Systemeinstellungen verwalten' },
    { id: 'user_management', name: 'Benutzerverwaltung', description: 'Benutzer und Rollen verwalten' }
];
export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('users');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'manager': return 'bg-blue-100 text-blue-800';
            case 'user': return 'bg-green-100 text-green-800';
            case 'viewer': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-slate-100 text-slate-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };
    const getRoleDisplayName = (role) => {
        const roleObj = mockRoles.find(r => r.name === role);
        return roleObj?.displayName || role;
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Link, { to: "/admin", className: "text-slate-500 hover:text-slate-700", children: "Admin" }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "text-slate-900 font-medium", children: "Benutzerverwaltung" })] }), _jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\uD83D\uDC65 Benutzerverwaltung" }), _jsx("p", { className: "text-slate-600", children: "Verwalten Sie Benutzer, Rollen und Berechtigungen" })] }), _jsx("div", { className: "flex gap-3", children: _jsx("button", { onClick: () => setShowCreateUser(true), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: "\uD83D\uDC64 Benutzer hinzuf\u00FCgen" }) })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-6 py-6", children: _jsxs("div", { className: "bg-white rounded-lg border mb-6", children: [_jsx("div", { className: "flex border-b", children: [
                                { key: 'users', label: '👥 Benutzer', icon: '👥' },
                                { key: 'roles', label: '🔑 Rollen', icon: '🔑' },
                                { key: 'permissions', label: '🛡️ Berechtigungen', icon: '🛡️' }
                            ].map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: `px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.key
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`, children: [_jsx("span", { children: tab.icon }), tab.label] }, tab.key))) }), _jsxs("div", { className: "p-6", children: [activeTab === 'users' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("div", { className: "flex-1 min-w-64", children: _jsx("input", { type: "text", placeholder: "Benutzer suchen...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }) }), _jsxs("select", { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), className: "px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "Alle Rollen" }), mockRoles.map(role => (_jsx("option", { value: role.name, children: role.displayName }, role.id)))] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "Alle Status" }), _jsx("option", { value: "active", children: "Aktiv" }), _jsx("option", { value: "inactive", children: "Inaktiv" }), _jsx("option", { value: "pending", children: "Ausstehend" })] })] }), _jsx("div", { className: "grid gap-4", children: filteredUsers.map(user => (_jsx("div", { className: "bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl", children: user.avatar }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("h3", { className: "font-semibold text-slate-900", children: user.name }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`, children: getRoleDisplayName(user.role) }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`, children: user.status === 'active' ? 'Aktiv' : user.status === 'inactive' ? 'Inaktiv' : 'Ausstehend' })] }), _jsx("div", { className: "text-sm text-slate-600", children: user.email }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-slate-500 mt-1", children: [user.lastLogin && (_jsxs("span", { children: ["Letzter Login: ", new Date(user.lastLogin).toLocaleString('de-DE')] })), _jsxs("span", { children: ["Erstellt: ", new Date(user.createdAt).toLocaleDateString('de-DE')] })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setSelectedUser(user), className: "px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors", children: "\u270F\uFE0F Bearbeiten" }), _jsx("button", { className: "px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors", children: "\uD83D\uDDD1\uFE0F" })] })] }) }, user.id))) }), filteredUsers.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDC65" }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-2", children: "Keine Benutzer gefunden" }), _jsx("p", { className: "text-slate-600", children: searchTerm ? `Keine Benutzer für "${searchTerm}"` : 'Keine Benutzer vorhanden' })] }))] })), activeTab === 'roles' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid md:grid-cols-2 gap-6", children: mockRoles.map(role => (_jsxs("div", { className: "bg-slate-50 border rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: role.displayName }), _jsxs("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.name)}`, children: [formatGermanNumber(role.userCount), " Benutzer"] })] }), _jsx("p", { className: "text-slate-600 mb-4", children: role.description })] }), _jsx("button", { className: "text-slate-400 hover:text-slate-600", children: "\u270F\uFE0F" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm font-medium text-slate-700 mb-2", children: "Berechtigungen:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: role.permissions.map(permissionId => {
                                                                    const permission = permissions.find(p => p.id === permissionId);
                                                                    return (_jsx("span", { className: "px-2 py-1 bg-white text-slate-700 rounded text-xs border", children: permission?.name || permissionId }, permissionId));
                                                                }) })] })] }, role.id))) }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\uD83D\uDD11 Neue Rolle erstellen" }) })] })), activeTab === 'permissions' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-slate-50 border rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uD83D\uDEE1\uFE0F Verf\u00FCgbare Berechtigungen" }), _jsx("div", { className: "grid md:grid-cols-2 gap-4", children: permissions.map(permission => (_jsx("div", { className: "bg-white border rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-slate-900 mb-1", children: permission.name }), _jsx("p", { className: "text-sm text-slate-600", children: permission.description }), _jsxs("div", { className: "mt-2 text-xs text-slate-500", children: ["ID: ", _jsx("span", { className: "font-mono", children: permission.id })] })] }), _jsx("button", { className: "text-slate-400 hover:text-slate-600 text-sm", children: "\u270F\uFE0F" })] }) }, permission.id))) })] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "\uD83D\uDEE1\uFE0F Neue Berechtigung erstellen" }) })] }))] })] }) }), selectedUser && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Benutzer bearbeiten" }), _jsx("button", { onClick: () => setSelectedUser(null), className: "text-slate-400 hover:text-slate-600", children: "\u2715" })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Name" }), _jsx("input", { type: "text", defaultValue: selectedUser.name, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "E-Mail" }), _jsx("input", { type: "email", defaultValue: selectedUser.email, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Rolle" }), _jsx("select", { defaultValue: selectedUser.role, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: mockRoles.map(role => (_jsx("option", { value: role.name, children: role.displayName }, role.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Status" }), _jsxs("select", { defaultValue: selectedUser.status, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "active", children: "Aktiv" }), _jsx("option", { value: "inactive", children: "Inaktiv" }), _jsx("option", { value: "pending", children: "Ausstehend" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Berechtigungen" }), _jsx("div", { className: "grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3", children: permissions.filter(p => p.id !== 'all').map(permission => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: selectedUser.permissions.includes(permission.id), className: "rounded border-slate-300" }), _jsx("span", { className: "text-sm", children: permission.name })] }, permission.id))) })] })] }), _jsxs("div", { className: "flex justify-end gap-3 p-6 border-t", children: [_jsx("button", { onClick: () => setSelectedUser(null), className: "px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors", children: "Abbrechen" }), _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Speichern" })] })] }) }))] }));
}
