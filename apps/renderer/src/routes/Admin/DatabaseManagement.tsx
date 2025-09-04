import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatGermanNumber, formatGermanCurrency } from '../../utils/germanFormat'

interface DatabaseInfo {
  name: string
  size: string
  lastBackup: string
  recordCount: number
  status: 'healthy' | 'warning' | 'error'
}

interface TableInfo {
  name: string
  displayName: string
  recordCount: number
  size: string
  lastModified: string
  description: string
}

interface BackupInfo {
  id: string
  filename: string
  size: string
  created: string
  type: 'auto' | 'manual'
  status: 'completed' | 'failed' | 'in-progress'
}

const mockDatabaseInfo: DatabaseInfo = {
  name: 'solar_app.db',
  size: '24,8 MB',
  lastBackup: '2024-03-15 14:30:00',
  recordCount: 1847,
  status: 'healthy'
}

const mockTables: TableInfo[] = [
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
]

const mockBackups: BackupInfo[] = [
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
]

export default function DatabaseManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'backups' | 'maintenance'>('overview')
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [maintenanceResults, setMaintenanceResults] = useState<any>(null)

  const createBackup = async () => {
    setIsBackupRunning(true)
    // Simuliere Backup-Prozess
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsBackupRunning(false)
    alert('Backup erfolgreich erstellt!')
  }

  const runMaintenance = async (type: 'optimize' | 'vacuum' | 'integrity') => {
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
    }
    setMaintenanceResults(results[type])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
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
                <span className="text-slate-900 font-medium">Datenbankmanagement</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">💾 Datenbankmanagement</h1>
              <p className="text-slate-600">Verwalten Sie Ihre Datenbank und Backups</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={createBackup}
                disabled={isBackupRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2"
              >
                {isBackupRunning ? '⏳ Erstelle Backup...' : '💾 Backup erstellen'}
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
              { key: 'overview', label: '📊 Übersicht', icon: '📊' },
              { key: 'tables', label: '🗃️ Tabellen', icon: '🗃️' },
              { key: 'backups', label: '💾 Backups', icon: '💾' },
              { key: 'maintenance', label: '🔧 Wartung', icon: '🔧' }
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Database Status */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Datenbankgröße</span>
                      <span className="text-lg">📊</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{mockDatabaseInfo.size}</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Gesamtdatensätze</span>
                      <span className="text-lg">📋</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatGermanNumber(mockDatabaseInfo.recordCount)}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Status</span>
                      <span className="text-lg">✅</span>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mockDatabaseInfo.status)}`}>
                      {mockDatabaseInfo.status === 'healthy' ? 'Gesund' : 'Warnung'}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Letztes Backup</span>
                      <span className="text-lg">💾</span>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {new Date(mockDatabaseInfo.lastBackup).toLocaleString('de-DE')}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button 
                      onClick={() => runMaintenance('optimize')}
                      className="p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-medium mb-1">Optimieren</div>
                      <div className="text-sm text-slate-600">Datenbank-Performance verbessern</div>
                    </button>

                    <button 
                      onClick={() => runMaintenance('vacuum')}
                      className="p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="text-2xl mb-2">🧹</div>
                      <div className="font-medium mb-1">Bereinigen</div>
                      <div className="text-sm text-slate-600">Nicht genutzten Speicher freigeben</div>
                    </button>

                    <button 
                      onClick={() => runMaintenance('integrity')}
                      className="p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-medium mb-1">Prüfen</div>
                      <div className="text-sm text-slate-600">Integrität der Daten überprüfen</div>
                    </button>
                  </div>
                </div>

                {/* Maintenance Results */}
                {maintenanceResults && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✅</span>
                      <div>
                        <h4 className="font-semibold text-green-900">{maintenanceResults.title}</h4>
                        <p className="text-green-800 mb-2">{maintenanceResults.message}</p>
                        {maintenanceResults.spaceSaved && (
                          <div className="text-sm text-green-700">
                            Gespartzr Speicher: {maintenanceResults.spaceSaved} | 
                            Performance-Verbesserung: {maintenanceResults.timeSaved}
                          </div>
                        )}
                        {maintenanceResults.checkedRecords && (
                          <div className="text-sm text-green-700">
                            Geprüfte Datensätze: {formatGermanNumber(maintenanceResults.checkedRecords)} | 
                            Gefundene Probleme: {maintenanceResults.issues}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {mockTables.map(table => (
                    <div 
                      key={table.name}
                      className="bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{table.displayName}</h3>
                            <span className="text-xs text-slate-500 font-mono">{table.name}</span>
                          </div>
                          <p className="text-slate-600 mb-3">{table.description}</p>
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <span>📊 {formatGermanNumber(table.recordCount)} Datensätze</span>
                            <span>💾 {table.size}</span>
                            <span>📅 {new Date(table.lastModified).toLocaleString('de-DE')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                            📊 Analysieren
                          </button>
                          <button className="px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                            📤 Exportieren
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Backups Tab */}
            {activeTab === 'backups' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Verfügbare Backups</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                      📂 Backup-Ordner öffnen
                    </button>
                    <button className="px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                      ⚙️ Backup-Einstellungen
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {mockBackups.map(backup => (
                    <div key={backup.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-slate-900">{backup.filename}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {backup.type === 'auto' ? 'Automatisch' : 'Manuell'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              backup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {backup.status === 'completed' ? 'Abgeschlossen' : 'Fehlgeschlagen'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>📅 {new Date(backup.created).toLocaleString('de-DE')}</span>
                            <span>💾 {backup.size}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            🔄 Wiederherstellen
                          </button>
                          <button className="px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                            📥 Herunterladen
                          </button>
                          <button className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>⚡</span> Performance-Optimierung
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Verbessern Sie die Datenbankperformance durch Indexoptimierung und Fragmentierungsbereinigung.
                    </p>
                    <button 
                      onClick={() => runMaintenance('optimize')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Datenbank optimieren
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>🧹</span> Speicher-Bereinigung
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Geben Sie nicht genutzten Speicherplatz frei und komprimieren Sie die Datenbankdatei.
                    </p>
                    <button 
                      onClick={() => runMaintenance('vacuum')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Speicher bereinigen
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>🔍</span> Integritätsprüfung
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Überprüfen Sie die Integrität Ihrer Datenbank und entdecken Sie potentielle Probleme.
                    </p>
                    <button 
                      onClick={() => runMaintenance('integrity')}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Integrität prüfen
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>📊</span> Statistiken aktualisieren
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Aktualisieren Sie die Datenbankstatistiken für bessere Abfrageoptimierung.
                    </p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Statistiken aktualisieren
                    </button>
                  </div>
                </div>

                {/* Scheduled Maintenance */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">⏰ Geplante Wartung</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div>
                        <div className="font-medium">Tägliche Optimierung</div>
                        <div className="text-sm text-slate-600">Jeden Tag um 02:00 Uhr</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div>
                        <div className="font-medium">Wöchentliche Bereinigung</div>
                        <div className="text-sm text-slate-600">Jeden Sonntag um 03:00 Uhr</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div>
                        <div className="font-medium">Monatliche Integritätsprüfung</div>
                        <div className="text-sm text-slate-600">Jeden 1. des Monats um 04:00 Uhr</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
