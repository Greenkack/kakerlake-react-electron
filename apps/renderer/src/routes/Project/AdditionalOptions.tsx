import React, { useState, useEffect } from 'react'
import WizardNav from '../../components/WizardNav'
import { useProject } from '../../state/project'

export default function AdditionalOptions() {
  const { state, actions } = useProject()

  // PV System Optionen
  const [pv_interest, setPvInterest] = useState<boolean>(
    state.options?.pv_interest || false
  )
  const [system_size_preference, setSystemSizePreference] = useState<string>(
    state.options?.system_size_preference || ''
  )
  const [module_type_preference, setModuleTypePreference] = useState<string>(
    state.options?.module_type_preference || ''
  )
  const [inverter_type_preference, setInverterTypePreference] = useState<string>(
    state.options?.inverter_type_preference || ''
  )
  const [mounting_preference, setMountingPreference] = useState<string>(
    state.options?.mounting_preference || ''
  )

  // Speicher Optionen
  const [battery_interest, setBatteryInterest] = useState<boolean>(
    state.options?.battery_interest || false
  )
  const [battery_size_preference, setBatterySizePreference] = useState<string>(
    state.options?.battery_size_preference || ''
  )
  const [battery_type_preference, setBatteryTypePreference] = useState<string>(
    state.options?.battery_type_preference || ''
  )
  const [backup_power_desired, setBackupPowerDesired] = useState<boolean>(
    state.options?.backup_power_desired || false
  )

  // Wärmepumpe Optionen
  const [hp_interest, setHpInterest] = useState<boolean>(
    state.options?.hp_interest || false
  )
  const [hp_type_preference, setHpTypePreference] = useState<string>(
    state.options?.hp_type_preference || ''
  )
  const [hp_size_preference, setHpSizePreference] = useState<string>(
    state.options?.hp_size_preference || ''
  )
  const [hp_integration_timing, setHpIntegrationTiming] = useState<string>(
    state.options?.hp_integration_timing || ''
  )

  // E-Mobilität
  const [ev_charging_interest, setEvChargingInterest] = useState<boolean>(
    state.options?.ev_charging_interest || false
  )
  const [wallbox_type_preference, setWallboxTypePreference] = useState<string>(
    state.options?.wallbox_type_preference || ''
  )
  const [ev_integration_timing, setEvIntegrationTiming] = useState<string>(
    state.options?.ev_integration_timing || ''
  )

  // Smart Home & Monitoring
  const [smart_home_integration, setSmartHomeIntegration] = useState<boolean>(
    state.options?.smart_home_integration || false
  )
  const [monitoring_level_preference, setMonitoringLevelPreference] = useState<string>(
    state.options?.monitoring_level_preference || ''
  )
  const [app_control_desired, setAppControlDesired] = useState<boolean>(
    state.options?.app_control_desired || false
  )

  // Zusätzliche Services
  const [maintenance_contract_interest, setMaintenanceContractInterest] = useState<boolean>(
    state.options?.maintenance_contract_interest || false
  )
  const [insurance_interest, setInsuranceInterest] = useState<boolean>(
    state.options?.insurance_interest || false
  )
  const [financing_interest, setFinancingInterest] = useState<boolean>(
    state.options?.financing_interest || false
  )
  const [leasing_interest, setLeasingInterest] = useState<boolean>(
    state.options?.leasing_interest || false
  )

  // Installation Präferenzen
  const [installation_speed_preference, setInstallationSpeedPreference] = useState<string>(
    state.options?.installation_speed_preference || ''
  )
  const [installation_team_size, setInstallationTeamSize] = useState<string>(
    state.options?.installation_team_size || ''
  )

  // Zukünftige Erweiterungen
  const [future_expansion_planned, setFutureExpansionPlanned] = useState<boolean>(
    state.options?.future_expansion_planned || false
  )
  const [pool_heating_interest, setPoolHeatingInterest] = useState<boolean>(
    state.options?.pool_heating_interest || false
  )
  const [climate_control_interest, setClimateControlInterest] = useState<boolean>(
    state.options?.climate_control_interest || false
  )

  // Sonstiges
  const [special_requests, setSpecialRequests] = useState<string>(
    state.options?.special_requests || ''
  )
  const [consultation_preference, setConsultationPreference] = useState<string>(
    state.options?.consultation_preference || ''
  )

  // Mindestanforderungen für "Weiter"-Button
  const requiredOk = pv_interest || hp_interest || ev_charging_interest

  // Beim Verlassen/Weiter speichern wir in den Context
  useEffect(() => {
    actions.updateOptions({
      pv_interest,
      system_size_preference,
      module_type_preference,
      inverter_type_preference,
      mounting_preference,
      battery_interest,
      battery_size_preference,
      battery_type_preference,
      backup_power_desired,
      hp_interest,
      hp_type_preference,
      hp_size_preference,
      hp_integration_timing,
      ev_charging_interest,
      wallbox_type_preference,
      ev_integration_timing,
      smart_home_integration,
      monitoring_level_preference,
      app_control_desired,
      maintenance_contract_interest,
      insurance_interest,
      financing_interest,
      leasing_interest,
      installation_speed_preference,
      installation_team_size,
      future_expansion_planned,
      pool_heating_interest,
      climate_control_interest,
      special_requests,
      consultation_preference
    })
  }, [
    pv_interest, system_size_preference, module_type_preference, inverter_type_preference, mounting_preference,
    battery_interest, battery_size_preference, battery_type_preference, backup_power_desired,
    hp_interest, hp_type_preference, hp_size_preference, hp_integration_timing,
    ev_charging_interest, wallbox_type_preference, ev_integration_timing,
    smart_home_integration, monitoring_level_preference, app_control_desired,
    maintenance_contract_interest, insurance_interest, financing_interest, leasing_interest,
    installation_speed_preference, installation_team_size,
    future_expansion_planned, pool_heating_interest, climate_control_interest,
    special_requests, consultation_preference,
    actions
  ])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Zusätzliche Optionen</h1>
        <p className="text-slate-600">Komponenten, Services und Erweiterungen auswählen</p>
      </div>

      {/* Grundinteressen */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Grundlegende Interessen</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={pv_interest} 
              onChange={(e) => setPvInterest(e.target.checked)} 
            />
            <span>Photovoltaik-Anlage</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={hp_interest} 
              onChange={(e) => setHpInterest(e.target.checked)} 
            />
            <span>Wärmepumpe</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={ev_charging_interest} 
              onChange={(e) => setEvChargingInterest(e.target.checked)} 
            />
            <span>E-Auto Ladestation</span>
          </label>
        </div>
      </div>

      {/* PV System Optionen */}
      {pv_interest && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Photovoltaik-System</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Systemgröße-Präferenz">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={system_size_preference} 
                onChange={(e) => setSystemSizePreference(e.target.value)}
              >
                <option value="">Keine Präferenz</option>
                <option value="small">Klein (bis 5 kWp)</option>
                <option value="medium">Mittel (5-10 kWp)</option>
                <option value="large">Groß (10-20 kWp)</option>
                <option value="very_large">Sehr groß (&gt; 20 kWp)</option>
                <option value="maximum">Maximale Dachnutzung</option>
              </select>
            </Field>
            <Field label="Modul-Typ Präferenz">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={module_type_preference} 
                onChange={(e) => setModuleTypePreference(e.target.value)}
              >
                <option value="">Keine Präferenz</option>
                <option value="mono">Monokristallin</option>
                <option value="poly">Polykristallin</option>
                <option value="bifacial">Bifazial</option>
                <option value="high_efficiency">Hocheffizienz</option>
                <option value="black">Vollschwarze Module</option>
              </select>
            </Field>
            <Field label="Wechselrichter-Typ">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={inverter_type_preference} 
                onChange={(e) => setInverterTypePreference(e.target.value)}
              >
                <option value="">Keine Präferenz</option>
                <option value="string">String-Wechselrichter</option>
                <option value="power_optimizer">Power Optimizer</option>
                <option value="micro">Mikro-Wechselrichter</option>
                <option value="hybrid">Hybrid-Wechselrichter</option>
              </select>
            </Field>
            <Field label="Montage-Präferenz">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={mounting_preference} 
                onChange={(e) => setMountingPreference(e.target.value)}
              >
                <option value="">Standard-Montage</option>
                <option value="parallel">Parallel zum Dach</option>
                <option value="elevated">Aufgeständert</option>
                <option value="integrated">Dachintegriert</option>
                <option value="ground">Freifläche</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* Speicher Optionen */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Energiespeicher</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={battery_interest} 
                onChange={(e) => setBatteryInterest(e.target.checked)} 
              />
              <span>Batterie-Speicher gewünscht</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={backup_power_desired} 
                onChange={(e) => setBackupPowerDesired(e.target.checked)} 
              />
              <span>Notstrom-Funktionalität gewünscht</span>
            </label>
          </div>
          <div className="space-y-3">
            {battery_interest && (
              <>
                <Field label="Speicher-Größe">
                  <select 
                    className="w-full rounded border border-slate-300 px-3 py-2" 
                    value={battery_size_preference} 
                    onChange={(e) => setBatterySizePreference(e.target.value)}
                  >
                    <option value="">Automatische Dimensionierung</option>
                    <option value="small">Klein (bis 5 kWh)</option>
                    <option value="medium">Mittel (5-10 kWh)</option>
                    <option value="large">Groß (10-20 kWh)</option>
                    <option value="very_large">Sehr groß (&gt; 20 kWh)</option>
                  </select>
                </Field>
                <Field label="Batterie-Technologie">
                  <select 
                    className="w-full rounded border border-slate-300 px-3 py-2" 
                    value={battery_type_preference} 
                    onChange={(e) => setBatteryTypePreference(e.target.value)}
                  >
                    <option value="">Keine Präferenz</option>
                    <option value="lithium_ion">Lithium-Ionen</option>
                    <option value="lifepo4">LiFePO4</option>
                    <option value="salt_water">Salzwasser</option>
                    <option value="lead_acid">Blei-Säure</option>
                  </select>
                </Field>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Wärmepumpe Optionen */}
      {hp_interest && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Wärmepumpen-System</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Wärmepumpen-Typ">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={hp_type_preference} 
                onChange={(e) => setHpTypePreference(e.target.value)}
              >
                <option value="">Automatische Auswahl</option>
                <option value="air_water">Luft-Wasser</option>
                <option value="ground_water">Sole-Wasser (Erdwärme)</option>
                <option value="water_water">Wasser-Wasser</option>
                <option value="air_air">Luft-Luft</option>
                <option value="hybrid">Hybrid-System</option>
              </select>
            </Field>
            <Field label="Leistungsklasse">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={hp_size_preference} 
                onChange={(e) => setHpSizePreference(e.target.value)}
              >
                <option value="">Automatische Dimensionierung</option>
                <option value="small">Klein (bis 6 kW)</option>
                <option value="medium">Mittel (6-12 kW)</option>
                <option value="large">Groß (12-20 kW)</option>
                <option value="very_large">Sehr groß (&gt; 20 kW)</option>
              </select>
            </Field>
            <Field label="Integration Zeitplan">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={hp_integration_timing} 
                onChange={(e) => setHpIntegrationTiming(e.target.value)}
              >
                <option value="">Gleichzeitig mit PV</option>
                <option value="immediate">Sofort</option>
                <option value="next_season">Nächste Heizsaison</option>
                <option value="future">Zukünftig geplant</option>
                <option value="evaluation">Noch in Evaluierung</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* E-Mobilität */}
      {ev_charging_interest && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">E-Mobilität &amp; Ladeinfrastruktur</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Wallbox-Typ">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={wallbox_type_preference} 
                onChange={(e) => setWallboxTypePreference(e.target.value)}
              >
                <option value="">Standard Wallbox</option>
                <option value="basic">Basis (11 kW)</option>
                <option value="fast">Schnell (22 kW)</option>
                <option value="smart">Smart Wallbox</option>
                <option value="bidirectional">Bidirektional (V2G)</option>
                <option value="multiple">Mehrere Ladepunkte</option>
              </select>
            </Field>
            <Field label="Integration Zeitplan">
              <select 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={ev_integration_timing} 
                onChange={(e) => setEvIntegrationTiming(e.target.value)}
              >
                <option value="">Gleichzeitig mit PV</option>
                <option value="immediate">Sofort</option>
                <option value="car_purchase">Bei E-Auto Kauf</option>
                <option value="next_year">Nächstes Jahr</option>
                <option value="future">Zukünftig geplant</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* Smart Home & Monitoring */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Smart Home &amp; Monitoring</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={smart_home_integration} 
                onChange={(e) => setSmartHomeIntegration(e.target.checked)} 
              />
              <span>Smart Home Integration</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={app_control_desired} 
                onChange={(e) => setAppControlDesired(e.target.checked)} 
              />
              <span>App-Steuerung gewünscht</span>
            </label>
          </div>
          <Field label="Monitoring-Level">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={monitoring_level_preference} 
              onChange={(e) => setMonitoringLevelPreference(e.target.value)}
            >
              <option value="">Basis-Monitoring</option>
              <option value="basic">Grundfunktionen</option>
              <option value="advanced">Erweitert</option>
              <option value="professional">Professionell</option>
              <option value="comprehensive">Umfassend</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Zusätzliche Services */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Zusätzliche Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={maintenance_contract_interest} 
                onChange={(e) => setMaintenanceContractInterest(e.target.checked)} 
              />
              <span>Wartungsvertrag gewünscht</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={insurance_interest} 
                onChange={(e) => setInsuranceInterest(e.target.checked)} 
              />
              <span>Versicherung gewünscht</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={financing_interest} 
                onChange={(e) => setFinancingInterest(e.target.checked)} 
              />
              <span>Finanzierung benötigt</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={leasing_interest} 
                onChange={(e) => setLeasingInterest(e.target.checked)} 
              />
              <span>Leasing interessant</span>
            </label>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Installation &amp; Durchführung</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Installationsgeschwindigkeit">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={installation_speed_preference} 
              onChange={(e) => setInstallationSpeedPreference(e.target.value)}
            >
              <option value="">Normal</option>
              <option value="asap">So schnell wie möglich</option>
              <option value="planned">Geplant/Terminiert</option>
              <option value="flexible">Flexibel</option>
              <option value="off_season">Nebensaison bevorzugt</option>
            </select>
          </Field>
          <Field label="Team-Größe Präferenz">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={installation_team_size} 
              onChange={(e) => setInstallationTeamSize(e.target.value)}
            >
              <option value="">Standard Team</option>
              <option value="small">Kleines Team</option>
              <option value="large">Großes Team</option>
              <option value="single_day">Ein-Tages-Installation</option>
              <option value="minimal_disruption">Minimale Störung</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Zukünftige Erweiterungen */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Zukünftige Erweiterungen</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={future_expansion_planned} 
              onChange={(e) => setFutureExpansionPlanned(e.target.checked)} 
            />
            <span>System-Erweiterung geplant</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={pool_heating_interest} 
              onChange={(e) => setPoolHeatingInterest(e.target.checked)} 
            />
            <span>Pool-Heizung Interesse</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={climate_control_interest} 
              onChange={(e) => setClimateControlInterest(e.target.checked)} 
            />
            <span>Klimatechnik Interesse</span>
          </label>
        </div>
      </div>

      {/* Beratung & Sonstiges */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Beratung &amp; Sonstiges</h3>
        <div className="grid md:grid-cols-1 gap-4">
          <Field label="Beratungs-Präferenz">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={consultation_preference} 
              onChange={(e) => setConsultationPreference(e.target.value)}
            >
              <option value="">Standard Beratung</option>
              <option value="detailed">Ausführliche Beratung</option>
              <option value="technical">Technische Detailberatung</option>
              <option value="financial">Finanzberatung Fokus</option>
              <option value="environmental">Umwelt-Fokus</option>
              <option value="quick">Kompakte Beratung</option>
            </select>
          </Field>
          <Field label="Besondere Wünsche oder Anforderungen">
            <textarea 
              className="w-full rounded border border-slate-300 px-3 py-2 h-24" 
              value={special_requests} 
              onChange={(e) => setSpecialRequests(e.target.value)} 
              placeholder="z.B. spezielle Komponenten, besondere Installationswünsche, zeitliche Vorgaben..."
            />
          </Field>
        </div>
      </div>

      <WizardNav
        backTo="/project/needs"
        nextTo="/project/results"
        disabledNext={!requiredOk}
      />
    </div>
  )
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  )
}
