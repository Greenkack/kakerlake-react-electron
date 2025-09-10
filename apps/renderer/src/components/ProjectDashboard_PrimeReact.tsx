import React, { useMemo } from 'react'
import { useProject } from '../state/project'
import { Link } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Panel } from 'primereact/panel'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Badge } from 'primereact/badge'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

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

  // Steps Daten für bessere Darstellung
  const steps = [
    {
      id: 1,
      title: 'Kundendaten',
      icon: 'pi-user',
      completed: summary.hasCustomer,
      description: summary.hasCustomer 
        ? `${customer.vorname} ${customer.nachname}` 
        : 'Name und Adresse eingeben'
    },
    {
      id: 2,
      title: 'Gebäudedaten',
      icon: 'pi-home',
      completed: summary.hasBuilding,
      description: summary.hasBuilding 
        ? `${building.roofArea}m² • ${building.roofOrientation}` 
        : 'Dachfläche und Ausrichtung'
    },
    {
      id: 3,
      title: 'Verbrauchsdaten',
      icon: 'pi-bolt',
      completed: summary.hasConsumption,
      description: summary.hasConsumption 
        ? `${consumption.annualKWhHousehold?.toLocaleString('de-DE')} kWh/Jahr` 
        : 'Stromverbrauch eingeben'
    },
    {
      id: 4,
      title: 'Optionen',
      icon: 'pi-cog',
      completed: summary.hasOptions,
      description: summary.hasOptions 
        ? `Modus: ${mode}` 
        : 'Speicher & Wärmepumpe'
    }
  ]

  const stepRowTemplate = (step: any) => (
    <div className="flex align-items-center gap-3 py-2">
      <div 
        className={`flex align-items-center justify-content-center border-circle w-3rem h-3rem ${
          step.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}
      >
        <i className={`pi ${step.icon} text-lg`} />
      </div>
      <div className="flex-1">
        <div className="flex align-items-center gap-2 mb-1">
          <span className="font-semibold">{step.title}</span>
          {step.completed && <i className="pi pi-check text-green-600" />}
        </div>
        <p className="text-sm text-600 m-0">{step.description}</p>
      </div>
      <div>
        {step.completed ? (
          <Tag severity="success" value="Fertig" />
        ) : (
          <Tag severity="warning" value="Ausstehend" />
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4 p-3">
      {/* Willkommen Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3 flex align-items-center justify-content-center gap-2">
            <i className="pi pi-sun" />
            Willkommen bei der PV-Anlagenplanung!
          </h1>
          <p className="text-blue-100 text-lg">
            Erstellen Sie in wenigen Schritten ein individuelles Angebot für Ihre Photovoltaik-Anlage.
          </p>
        </div>
      </Card>

      {/* Fortschrittsübersicht */}
      <Card title="📊 Projektstatus" className="w-full">
        <div className="flex align-items-center justify-content-between mb-4">
          <div className="flex-1 mr-4">
            <div className="flex justify-content-between text-sm mb-2">
              <span className="text-600">Projekterstellung</span>
              <Chip 
                label={`${progress.completed}/${progress.total} Schritte`}
                className="p-chip-outlined"
              />
            </div>
            <ProgressBar 
              value={progress.percentage} 
              className="h-1rem"
              pt={{
                value: { 
                  className: progress.percentage === 100 ? 'bg-green-400' : 'bg-blue-400'
                }
              }}
            />
          </div>
          <div className="text-center">
            <Badge 
              value={`${progress.percentage}%`}
              size="large" 
              severity={progress.percentage === 100 ? "success" : progress.percentage >= 50 ? "info" : "warning"}
            />
          </div>
        </div>

        <Divider />

        {/* Schritt-Status */}
        <div className="space-y-3">
          {steps.map(step => (
            <div key={step.id}>
              {stepRowTemplate(step)}
            </div>
          ))}
        </div>
      </Card>

      {/* Schnellübersicht */}
      {(summary.hasConsumption || summary.hasBuilding) && (
        <Card title="⚡ Projekt-Übersicht" className="bg-green-50 border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.hasCustomer && (
              <Panel header="👤 Kunde" className="h-full">
                <p className="text-sm text-600 m-0">
                  {customer.vorname} {customer.nachname}
                  {customer.strasse && (
                    <>
                      <br />
                      {customer.strasse} {customer.hausnummer}
                      <br />
                      {customer.plz} {customer.ort}
                    </>
                  )}
                </p>
              </Panel>
            )}

            {summary.hasBuilding && (
              <Panel header="🏠 Gebäude" className="h-full">
                <p className="text-sm text-600 m-0">
                  Dachfläche: <strong>{building.roofArea}m²</strong><br />
                  Ausrichtung: <strong>{building.roofOrientation}</strong><br />
                  {building.roofTilt && `Neigung: ${building.roofTilt}°`}
                  <br />
                  <Chip 
                    label={`~${summary.estimatedSize} kWp möglich`} 
                    className="mt-2 p-chip-outlined"
                  />
                </p>
              </Panel>
            )}

            {summary.hasConsumption && (
              <Panel header="⚡ Verbrauch" className="h-full">
                <p className="text-sm text-600 m-0">
                  Haushalt: <strong>{consumption.annualKWhHousehold?.toLocaleString('de-DE')} kWh/Jahr</strong><br />
                  {consumption.annualKWhHeating && (
                    <>Heizung: <strong>{consumption.annualKWhHeating?.toLocaleString('de-DE')} kWh/Jahr</strong><br /></>
                  )}
                  {consumption.homeOfficeHours && (
                    <>HomeOffice: <strong>{consumption.homeOfficeHours}h/Tag</strong></>
                  )}
                </p>
              </Panel>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card title="🚀 Nächste Schritte" className="w-full">
        <div className="flex flex-wrap gap-3 justify-content-center">
          {!summary.hasCustomer && (
            <Link to="/solar-calculator">
              <Button 
                label="Kundendaten eingeben"
                icon="pi pi-user-plus"
                className="p-button-outlined"
              />
            </Link>
          )}
          
          {!summary.hasBuilding && (
            <Link to="/solar-calculator">
              <Button 
                label="Gebäudedaten erfassen"
                icon="pi pi-home"
                className="p-button-outlined"
              />
            </Link>
          )}

          {!summary.hasConsumption && (
            <Link to="/solar-calculator">
              <Button 
                label="Verbrauch analysieren"
                icon="pi pi-chart-line"
                className="p-button-outlined"
              />
            </Link>
          )}

          {summary.isComplete && (
            <Link to="/results">
              <Button 
                label="Ergebnisse anzeigen"
                icon="pi pi-eye"
                className="p-button-success"
              />
            </Link>
          )}

          <Link to="/solar-calculator">
            <Button 
              label="Rechner öffnen"
              icon="pi pi-calculator"
              className="p-button-primary"
            />
          </Link>
        </div>
      </Card>
    </div>
  )
}
