import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatGermanNumber } from '../../utils/germanFormat'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  permissions: string[]
  avatar?: string
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
  userCount: number
}

const mockUsers: User[] = [
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
]

const mockRoles: Role[] = [
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
]

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
]

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-slate-100 text-slate-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleObj = mockRoles.find(r => r.name === role)
    return roleObj?.displayName || role
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/admin" className="text-slate-500 hover:text-slate-700">Admin</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 font-medium">Benutzerverwaltung</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">👥 Benutzerverwaltung</h1>
              <p className="text-slate-600">Verwalten Sie Benutzer, Rollen und Berechtigungen</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateUser(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                👤 Benutzer hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex border-b">
            {[
              { key: 'users', label: '👥 Benutzer', icon: '👥' },
              { key: 'roles', label: '🔑 Rollen', icon: '🔑' },
              { key: 'permissions', label: '🛡️ Berechtigungen', icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <input
                      type="text"
                      placeholder="Benutzer suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Alle Rollen</option>
                    {mockRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.displayName}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Alle Status</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="pending">Ausstehend</option>
                  </select>
                </div>

                {/* Users List */}
                <div className="grid gap-4">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-slate-900">{user.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleDisplayName(user.role)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status === 'active' ? 'Aktiv' : user.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600">{user.email}</div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                              {user.lastLogin && (
                                <span>Letzter Login: {new Date(user.lastLogin).toLocaleString('de-DE')}</span>
                              )}
                              <span>Erstellt: {new Date(user.createdAt).toLocaleDateString('de-DE')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                          >
                            ✏️ Bearbeiten
                          </button>
                          <button className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Keine Benutzer gefunden</h3>
                    <p className="text-slate-600">
                      {searchTerm ? `Keine Benutzer für "${searchTerm}"` : 'Keine Benutzer vorhanden'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {mockRoles.map(role => (
                    <div key={role.id} className="bg-slate-50 border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{role.displayName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                              {formatGermanNumber(role.userCount)} Benutzer
                            </span>
                          </div>
                          <p className="text-slate-600 mb-4">{role.description}</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          ✏️
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-700 mb-2">Berechtigungen:</div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map(permissionId => {
                            const permission = permissions.find(p => p.id === permissionId)
                            return (
                              <span
                                key={permissionId}
                                className="px-2 py-1 bg-white text-slate-700 rounded text-xs border"
                              >
                                {permission?.name || permissionId}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    🔑 Neue Rolle erstellen
                  </button>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="bg-slate-50 border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">🛡️ Verfügbare Berechtigungen</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {permissions.map(permission => (
                      <div key={permission.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-1">{permission.name}</h4>
                            <p className="text-sm text-slate-600">{permission.description}</p>
                            <div className="mt-2 text-xs text-slate-500">
                              ID: <span className="font-mono">{permission.id}</span>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 text-sm">
                            ✏️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    🛡️ Neue Berechtigung erstellen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Benutzer bearbeiten</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">E-Mail</label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rolle</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {mockRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.displayName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    defaultValue={selectedUser.status}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="pending">Ausstehend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Berechtigungen</label>
                <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {permissions.filter(p => p.id !== 'all').map(permission => (
                    <label key={permission.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedUser.permissions.includes(permission.id)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Abbrechen
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
