import React, { useMemo } from 'react'
import { useProject } from '../state/project'
import { Link } from 'react-router-dom'

export default function ProjectDashboard(): JSX.Element {
  const { state } = useProject()
  const { mode, customer, building, consumption, options } = state

  // Fortschrittsanalyse
  const progress = useMemo(() => {
    let steps = 0
    let completed = 0

    // Kundendaten
    steps++
    if (customer.vorname && customer.nachname && customer.strasse) completed++

    // Gebäudedaten
    steps++
    if (building.roofArea && building.roofOrientation) completed++

    // Verbrauchsanalyse
    steps++
    if (consumption.annualKWhHousehold && consumption.annualKWhHousehold > 0) completed++

    // Optionen
    steps++
    if (mode && (options.battery_interest !== undefined || options.hp_interest !== undefined)) completed++

    return {
      total: steps,
      completed,
      percentage: Math.round((completed / steps) * 100)
    }
  }, [customer, building, consumption, options, mode])

  // Schnellübersicht der eingegebenen Daten
  const summary = useMemo(() => {
    const hasCustomer = customer.vorname && customer.nachname
    const hasBuilding = building.roofArea && building.roofOrientation
    const hasConsumption = consumption.annualKWhHousehold && consumption.annualKWhHousehold > 0
    const hasOptions = Boolean(mode)

    // Geschätzte Systemgröße
    const estimatedSize = building.roofArea 
      ? Math.min(building.roofArea * 0.15, 20)
      : consumption.annualKWhHousehold 
        ? Math.min(consumption.annualKWhHousehold / 1000, 20)
        : 10

    return {
      hasCustomer,
      hasBuilding,
      hasConsumption,
      hasOptions,
      estimatedSize: Math.round(estimatedSize * 10) / 10,
      isComplete: hasCustomer && hasBuilding && hasConsumption && hasOptions
    }
  }, [customer, building, consumption, mode])

  return (
    <div className="space-y-6">
      {/* Willkommen Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">
          Willkommen bei der PV-Anlagenplanung! 🌞
        </h1>
        <p className="text-blue-100">
          Erstellen Sie in wenigen Schritten ein individuelles Angebot für Ihre Photovoltaik-Anlage.
        </p>
      </div>

      {/* Fortschrittsübersicht */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Projektstatus</h2>
        
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Fortschritt</span>
              <span className="font-medium">{progress.completed}/{progress.total} Schritte</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          <div className="ml-4 text-2xl font-bold text-blue-600">
            {progress.percentage}%
          </div>
        </div>

        {/* Schritt-Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg border ${summary.hasCustomer ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                summary.hasCustomer ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {summary.hasCustomer ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Kundendaten</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${summary.hasBuilding ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                summary.hasBuilding ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {summary.hasBuilding ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Gebäudedaten</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${summary.hasConsumption ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                summary.hasConsumption ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {summary.hasConsumption ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium">Verbrauchsdaten</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${summary.hasOptions ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                summary.hasOptions ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {summary.hasOptions ? '✓' : '4'}
              </div>
              <span className="text-sm font-medium">Optionen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schnellübersicht */}
      {(summary.hasConsumption || summary.hasBuilding) && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">⚡ Ihre Projekt-Übersicht</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {summary.hasCustomer && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-slate-700 mb-2">👤 Kunde</h4>
                <p className="text-sm text-slate-600">
                  {customer.vorname} {customer.nachname}
                  {customer.strasse && (
                    <><br />{customer.strasse} {customer.hausnummer}</>
                  )}
                </p>
              </div>
            )}

            {summary.hasBuilding && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-slate-700 mb-2">🏠 Gebäude</h4>
                <p className="text-sm text-slate-600">
                  Dachfläche: {building.roofArea}m²<br />
                  Ausrichtung: {building.roofOrientation}<br />
                  {building.roofTilt && `Neigung: ${building.roofTilt}°`}
                </p>
              </div>
            )}

            {summary.hasConsumption && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-slate-700 mb-2">⚡ Verbrauch</h4>
                <p className="text-sm text-slate-600">
                  Haushalt: {consumption.annualKWhHousehold?.toLocaleString('de-DE')} kWh/Jahr<br />
                  {consumption.annualKWhHeating && `Heizung: ${consumption.annualKWhHeating?.toLocaleString('de-DE')} kWh/Jahr`}
                  {consumption.homeOfficeHours && `HomeOffice: ${consumption.homeOfficeHours}h/Tag`}
                </p>
              </div>
            )}
          </div>

          {(summary.hasBuilding || summary.hasConsumption) && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-700">🔮 Erste Schätzung</h4>
                  <p className="text-sm text-slate-600">Empfohlene Anlagengröße basierend auf Ihren Daten</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{summary.estimatedSize} kWp</div>
                  <div className="text-sm text-slate-500">
                    ≈ {Math.round(summary.estimatedSize * 950).toLocaleString('de-DE')} kWh/Jahr
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigations-Karten */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          to="/project/customer" 
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
        >
          <div className="text-3xl mb-3">👤</div>
          <h3 className="font-semibold mb-1">Kundendaten</h3>
          <p className="text-sm text-slate-600">Kontaktinformationen erfassen</p>
          {summary.hasCustomer && (
            <div className="mt-2 text-xs text-green-600 font-medium">✓ Vollständig</div>
          )}
        </Link>

        <Link 
          to="/project/building" 
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
        >
          <div className="text-3xl mb-3">🏠</div>
          <h3 className="font-semibold mb-1">Gebäudedaten</h3>
          <p className="text-sm text-slate-600">Dach und Standort definieren</p>
          {summary.hasBuilding && (
            <div className="mt-2 text-xs text-green-600 font-medium">✓ Vollständig</div>
          )}
        </Link>

        <Link 
          to="/project/demand" 
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
        >
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold mb-1">Bedarfsanalyse</h3>
          <p className="text-sm text-slate-600">Energieverbrauch analysieren</p>
          {summary.hasConsumption && (
            <div className="mt-2 text-xs text-green-600 font-medium">✓ Vollständig</div>
          )}
        </Link>

        <Link 
          to="/project/options" 
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
        >
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="font-semibold mb-1">Optionen</h3>
          <p className="text-sm text-slate-600">Speicher und Zusatzkomponenten</p>
          {summary.hasOptions && (
            <div className="mt-2 text-xs text-green-600 font-medium">✓ Vollständig</div>
          )}
        </Link>
      </div>

      {/* Ergebnisse Button */}
      {summary.isComplete && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">🎉 Projektkonfiguration abgeschlossen!</h3>
          <p className="mb-4 text-green-100">
            Alle benötigten Daten wurden erfasst. Jetzt können Sie Ihre detaillierten Ergebnisse einsehen.
          </p>
          <Link 
            to="/project/results"
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            📊 Ergebnisse anzeigen
          </Link>
        </div>
      )}

      {/* Quick Start für neue Projekte */}
      {progress.completed === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🚀 Schnellstart</h3>
          <p className="text-blue-700 mb-4">
            Beginnen Sie mit der Erfassung der Kundendaten oder springen Sie direkt zur Gebäudeanalyse.
          </p>
          <div className="flex gap-3">
            <Link 
              to="/project/customer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              👤 Mit Kundendaten starten
            </Link>
            <Link 
              to="/project/building"
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
            >
              🏠 Mit Gebäudedaten starten
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
