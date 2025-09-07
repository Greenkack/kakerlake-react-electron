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
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'backups' | 'maintenance' | 'product-import'>('overview')
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [maintenanceResults, setMaintenanceResults] = useState<any>(null)
  const [importPath, setImportPath] = useState('')
  const [dryRun, setDryRun] = useState(true)
  const [importResult, setImportResult] = useState<any>(null)
  const [manualProduct, setManualProduct] = useState({
    kategorie: '', hersteller: '', produkt_modell: '', preis_stück: '',
    pv_modul_leistung: '', wr_leistung_kw: '', kapazitaet_speicher_kwh: '',
    wirkungsgrad_prozent: '', garantie_zeit: '', ladezyklen_speicher: '',
    mass_laenge: '', mass_breite: '', mass_gewicht_kg: '', hersteller_land: '',
    beschreibung_info: '', eigenschaft_info: '', spezial_merkmal: '',
    rating_null_zehn: '', image_base64: ''
  })
  const productCategories = [
    'PV Modul', 'Wechselrichter', 'Batteriespeicher', 'Wallbox', 'Energiemanagementsystem', 'Leistungsoptimierer', 'Carport', 'Notstromversorgung', 'Tierabwehrschutz', 'Extrakosten'
  ]

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
              { key: 'maintenance', label: '🔧 Wartung', icon: '🔧' },
              { key: 'product-import', label: '📥 Import/Produkte', icon: '📥' }
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

            {/* Product Import/Manual Tab */}
            {activeTab === 'product-import' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* File Import */}
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><span>📥</span> Produkte aus Datei importieren</h3>
                    <p className="text-slate-600 text-sm mb-3">Unterstützt: .xlsx, .csv, .json. Große Dateien werden begrenzt. Felder mit deutschen/englischen Bezeichnungen werden automatisch gemappt.</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Dateipfad wählen…"
                          value={importPath}
                          onChange={(e) => setImportPath(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded"
                        />
                        <button
                          onClick={async () => {
                            const sys = (window as any).systemAPI
                            if (!sys) { alert('systemAPI nicht verfügbar'); return }
                            const res = await sys.openFileDialog([
                              { name: 'Daten', extensions: ['xlsx', 'csv', 'json'] }
                            ])
                            if (!res.canceled && res.filePaths?.[0]) setImportPath(res.filePaths[0])
                          }}
                          className="px-3 py-2 border rounded hover:bg-slate-50"
                        >Durchsuchen…</button>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
                        <span>Probelauf (ohne Speichern)</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!importPath) { alert('Bitte Datei auswählen'); return }
                            const api = (window as any).importAPI
                            if (!api) { alert('importAPI nicht verfügbar'); return }
                            setImportResult(null)
                            const res = await api.productsFromFile(importPath, undefined, dryRun)
                            setImportResult(res)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >{dryRun ? 'Analyse starten' : 'Import starten'}</button>
                        {importResult && (
                          <button
                            onClick={() => setImportResult(null)}
                            className="px-4 py-2 border rounded hover:bg-slate-50"
                          >Zurücksetzen</button>
                        )}
                      </div>
                      {importResult && (
                        <div className={`rounded border p-3 ${importResult.success ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                          <div className="font-semibold mb-1">Ergebnis</div>
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(importResult, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual Add */}
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>✍️</span> Produkt manuell anlegen</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {/* Grunddaten */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700">Grunddaten</div>
                      <label className="text-sm">Kategorie*
                        <select className="w-full px-3 py-2 border rounded" value={manualProduct.kategorie} onChange={(e) => setManualProduct({ ...manualProduct, kategorie: e.target.value })}>
                          <option value="">-- wählen --</option>
                          {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </label>
                      <label className="text-sm">Hersteller*
                        <input className="w-full px-3 py-2 border rounded" placeholder="z.B. Ja Solar" value={manualProduct.hersteller} onChange={(e) => setManualProduct({ ...manualProduct, hersteller: e.target.value })} />
                      </label>
                      <label className="text-sm">Produktmodell*
                        <input className="w-full px-3 py-2 border rounded" placeholder="z.B. JAM72S30 540/MR" value={manualProduct.produkt_modell} onChange={(e) => setManualProduct({ ...manualProduct, produkt_modell: e.target.value })} />
                      </label>

                      {/* Preise */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700 mt-4">Preis</div>
                      <label className="text-sm">Preis (€/Stück)
                        <input type="number" step="0.01" className="w-full px-3 py-2 border rounded" placeholder="0.00" value={manualProduct.preis_stück} onChange={(e) => setManualProduct({ ...manualProduct, preis_stück: e.target.value })} />
                      </label>

                      {/* Leistungsdaten */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700 mt-4">Technische Daten</div>
                      <label className="text-sm">PV Modulleistung (Wp)
                        <input type="number" className="w-full px-3 py-2 border rounded" placeholder="540" value={manualProduct.pv_modul_leistung} onChange={(e) => setManualProduct({ ...manualProduct, pv_modul_leistung: e.target.value })} />
                      </label>
                      <label className="text-sm">WR-Leistung (kW)
                        <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" placeholder="5.0" value={manualProduct.wr_leistung_kw} onChange={(e) => setManualProduct({ ...manualProduct, wr_leistung_kw: e.target.value })} />
                      </label>
                      <label className="text-sm">Speicherkapazität (kWh)
                        <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" placeholder="10.0" value={manualProduct.kapazitaet_speicher_kwh} onChange={(e) => setManualProduct({ ...manualProduct, kapazitaet_speicher_kwh: e.target.value })} />
                      </label>
                      <label className="text-sm">Wirkungsgrad (%)
                        <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" placeholder="20.9" value={manualProduct.wirkungsgrad_prozent} onChange={(e) => setManualProduct({ ...manualProduct, wirkungsgrad_prozent: e.target.value })} />
                      </label>
                      <label className="text-sm">Ladezyklen Speicher
                        <input type="number" className="w-full px-3 py-2 border rounded" placeholder="6000" value={manualProduct.ladezyklen_speicher} onChange={(e) => setManualProduct({ ...manualProduct, ladezyklen_speicher: e.target.value })} />
                      </label>
                      <label className="text-sm">Garantie (Jahre)
                        <input type="number" className="w-full px-3 py-2 border rounded" placeholder="25" value={manualProduct.garantie_zeit} onChange={(e) => setManualProduct({ ...manualProduct, garantie_zeit: e.target.value })} />
                      </label>

                      {/* Abmessungen */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700 mt-4">Abmessungen & Gewicht</div>
                      <label className="text-sm">Länge (m)
                        <input type="number" step="0.001" className="w-full px-3 py-2 border rounded" placeholder="2.279" value={manualProduct.mass_laenge} onChange={(e) => setManualProduct({ ...manualProduct, mass_laenge: e.target.value })} />
                      </label>
                      <label className="text-sm">Breite (m)
                        <input type="number" step="0.001" className="w-full px-3 py-2 border rounded" placeholder="1.134" value={manualProduct.mass_breite} onChange={(e) => setManualProduct({ ...manualProduct, mass_breite: e.target.value })} />
                      </label>
                      <label className="text-sm">Gewicht (kg)
                        <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" placeholder="27.5" value={manualProduct.mass_gewicht_kg} onChange={(e) => setManualProduct({ ...manualProduct, mass_gewicht_kg: e.target.value })} />
                      </label>

                      {/* Zusatzinfos */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700 mt-4">Zusatzinformationen</div>
                      <label className="text-sm">Herstellerland
                        <input className="w-full px-3 py-2 border rounded" placeholder="China" value={manualProduct.hersteller_land} onChange={(e) => setManualProduct({ ...manualProduct, hersteller_land: e.target.value })} />
                      </label>
                      <label className="text-sm">Spezial Merkmal
                        <input className="w-full px-3 py-2 border rounded" placeholder="All-Black, Bifazial, etc." value={manualProduct.spezial_merkmal} onChange={(e) => setManualProduct({ ...manualProduct, spezial_merkmal: e.target.value })} />
                      </label>
                      <label className="text-sm">Rating (0-10)
                        <input type="number" min="0" max="10" step="0.1" className="w-full px-3 py-2 border rounded" placeholder="8.5" value={manualProduct.rating_null_zehn} onChange={(e) => setManualProduct({ ...manualProduct, rating_null_zehn: e.target.value })} />
                      </label>

                      {/* Beschreibungen */}
                      <label className="text-sm md:col-span-3">Beschreibung/Info
                        <textarea rows={2} className="w-full px-3 py-2 border rounded" placeholder="Kurze Produktbeschreibung..." value={manualProduct.beschreibung_info} onChange={(e) => setManualProduct({ ...manualProduct, beschreibung_info: e.target.value })} />
                      </label>
                      <label className="text-sm md:col-span-3">Eigenschaft Info
                        <textarea rows={2} className="w-full px-3 py-2 border rounded" placeholder="Technische Eigenschaften..." value={manualProduct.eigenschaft_info} onChange={(e) => setManualProduct({ ...manualProduct, eigenschaft_info: e.target.value })} />
                      </label>

                      {/* Produktbild Upload */}
                      <div className="md:col-span-3 mb-2 font-medium text-slate-700 mt-4">Produktbild</div>
                      <div className="md:col-span-3 p-3 border-2 border-dashed border-slate-300 rounded-lg">
                        <div className="text-center">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              if (file.size > 2 * 1024 * 1024) { alert('Bild zu groß (max 2MB)'); return }
                              const reader = new FileReader()
                              reader.onload = (ev) => {
                                const base64 = ev.target?.result as string
                                setManualProduct({ ...manualProduct, image_base64: base64.split(',')[1] }) // nur base64 ohne data:... prefix
                              }
                              reader.readAsDataURL(file)
                            }}
                            className="mb-2"
                          />
                          <p className="text-sm text-slate-600">JPG, PNG, WebP (max 2MB)</p>
                          {manualProduct.image_base64 && <p className="text-xs text-green-600 mt-1">✓ Bild geladen</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setManualProduct({
                          kategorie: '', hersteller: '', produkt_modell: '', preis_stück: '',
                          pv_modul_leistung: '', wr_leistung_kw: '', kapazitaet_speicher_kwh: '',
                          wirkungsgrad_prozent: '', garantie_zeit: '', ladezyklen_speicher: '',
                          mass_laenge: '', mass_breite: '', mass_gewicht_kg: '', hersteller_land: '',
                          beschreibung_info: '', eigenschaft_info: '', spezial_merkmal: '',
                          rating_null_zehn: '', image_base64: ''
                        })}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
                      >Felder leeren</button>
                      <button
                        onClick={async () => {
                          if (!manualProduct.kategorie || !manualProduct.produkt_modell || !manualProduct.hersteller) { 
                            alert('Kategorie, Produktmodell und Hersteller sind Pflicht') 
                            return 
                          }
                          const api = (window as any).productsAPI
                          if (!api) { alert('productsAPI nicht verfügbar'); return }
                          
                          // Nur nicht-leere Felder senden
                          const productData: any = {}
                          for (const [key, value] of Object.entries(manualProduct)) {
                            if (value && String(value).trim() !== '') {
                              productData[key] = value
                            }
                          }
                          
                          const res = await api.addSingle(productData)
                          if (res?.success) { 
                            alert(`Produkt gespeichert (ID: ${res.id})`)
                            // Formular zurücksetzen
                            setManualProduct({
                              kategorie: '', hersteller: '', produkt_modell: '', preis_stück: '',
                              pv_modul_leistung: '', wr_leistung_kw: '', kapazitaet_speicher_kwh: '',
                              wirkungsgrad_prozent: '', garantie_zeit: '', ladezyklen_speicher: '',
                              mass_laenge: '', mass_breite: '', mass_gewicht_kg: '', hersteller_land: '',
                              beschreibung_info: '', eigenschaft_info: '', spezial_merkmal: '',
                              rating_null_zehn: '', image_base64: ''
                            })
                          } else { 
                            alert('Fehler: ' + (res?.error || 'Unbekannt')) 
                          }
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >💾 Produkt speichern</button>
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
