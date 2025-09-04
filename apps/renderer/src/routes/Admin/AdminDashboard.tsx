import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface AdminMenuItem {
  id: string
  title: string
  description: string
  icon: string
  path: string
  category: 'system' | 'content' | 'users' | 'analytics'
  status?: 'active' | 'maintenance' | 'new'
}

const adminMenuItems: AdminMenuItem[] = [
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
]

const categoryLabels = {
  system: 'System-Verwaltung',
  content: 'Inhalte & Konfiguration', 
  users: 'Benutzer-Verwaltung',
  analytics: 'Analysen & Berichte'
}

const categoryColors = {
  system: 'from-blue-50 to-blue-100 border-blue-200',
  content: 'from-green-50 to-green-100 border-green-200',
  users: 'from-purple-50 to-purple-100 border-purple-200',
  analytics: 'from-orange-50 to-orange-100 border-orange-200'
}

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = adminMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categorizedItems = Object.entries(categoryLabels).map(([key, label]) => ({
    key,
    label,
    items: filteredItems.filter(item => item.category === key)
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">🛠️ Administration</h1>
              <p className="text-slate-600">System-Verwaltung und Konfiguration</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                System Online
              </div>
              <Link 
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zurück zur App
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-slate-400">🔍</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Alle
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === key 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Menu Grid */}
        <div className="space-y-8">
          {selectedCategory === 'all' ? (
            // Kategorisierte Darstellung
            categorizedItems.map(category => (
              <div key={category.key}>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  {category.label}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map(item => (
                    <AdminMenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Gefilterte Darstellung
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <AdminMenuItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Keine Ergebnisse</h3>
            <p className="text-slate-600">
              Keine Admin-Bereiche gefunden für "{searchTerm}"
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-slate-600">Aktive Module</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-slate-600">Benutzer Online</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">147</div>
            <div className="text-sm text-slate-600">Projekte heute</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">99,2%</div>
            <div className="text-sm text-slate-600">System-Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Menu Item Component
function AdminMenuItem({ item }: { item: AdminMenuItem }) {
  return (
    <Link
      to={item.path}
      className={`block p-6 rounded-xl border bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        categoryColors[item.category]
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{item.icon}</div>
        {item.status && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === 'new' 
              ? 'bg-blue-100 text-blue-800'
              : item.status === 'maintenance'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {item.status === 'new' ? 'Neu' : item.status === 'maintenance' ? 'Wartung' : 'Aktiv'}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
    </Link>
  )
}
