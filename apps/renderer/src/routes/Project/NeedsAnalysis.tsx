import React, { useState, useEffect } from 'react'
import WizardNav from '../../components/WizardNav'

// Mock useProjectData hook until context is available
const useProjectData = () => ({
  projectData: { 
    needs: {
      primary_goal: undefined as string | undefined,
      budget_max: undefined as number | undefined,
      budget_preferred: undefined as number | undefined,
      financing_needed: undefined as boolean | undefined,
      installation_time_preference: undefined as string | undefined,
      technology_preference: undefined as string | undefined,
      warranty_importance: undefined as string | undefined,
      service_importance: undefined as string | undefined,
      brand_preference: undefined as string | undefined,
      installer_preference: undefined as string | undefined,
      aesthetic_requirements: undefined as string | undefined,
      roof_space_usage: undefined as string | undefined,
      future_expansion: undefined as boolean | undefined,
      smart_home_integration: undefined as boolean | undefined,
      monitoring_wishes: undefined as string | undefined,
      environmental_priority: undefined as string | undefined,
      noise_restrictions: undefined as boolean | undefined,
      building_permits_handled: undefined as boolean | undefined,
      grid_connection_status: undefined as string | undefined,
      insurance_clarification: undefined as boolean | undefined,
      storage_priority: undefined as string | undefined,
      backup_power_need: undefined as string | undefined,
      feed_in_vs_self_consumption: undefined as string | undefined,
      special_requirements: undefined as string | undefined
    }
  },
  updateProjectData: (data: any) => console.log('Update project data:', data)
})

const toNumberOrNull = (value: string): number | null => {
  const num = parseFloat(value)
  return isNaN(num) ? null : num
}

export default function NeedsAnalysis() {
  const { projectData, updateProjectData } = useProjectData()

  // Hauptziele & Budget
  const [primary_goal, setPrimaryGoal] = useState<string>(
    projectData.needs?.primary_goal || ''
  )
  const [budget_max, setBudgetMax] = useState<string>(
    projectData.needs?.budget_max?.toString() || ''
  )
  const [budget_preferred, setBudgetPreferred] = useState<string>(
    projectData.needs?.budget_preferred?.toString() || ''
  )
  const [financing_needed, setFinancingNeeded] = useState<boolean>(
    projectData.needs?.financing_needed || false
  )

  // Zeitpläne & Präferenzen
  const [installation_time_preference, setInstallationTime] = useState<string>(
    projectData.needs?.installation_time_preference || ''
  )
  const [technology_preference, setTechnologyPreference] = useState<string>(
    projectData.needs?.technology_preference || ''
  )
  const [warranty_importance, setWarrantyImportance] = useState<string>(
    projectData.needs?.warranty_importance || ''
  )
  const [service_importance, setServiceImportance] = useState<string>(
    projectData.needs?.service_importance || ''
  )

  // Anbieter & Marken
  const [brand_preference, setBrandPreference] = useState<string>(
    projectData.needs?.brand_preference || ''
  )
  const [installer_preference, setInstallerPreference] = useState<string>(
    projectData.needs?.installer_preference || ''
  )

  // Ästhetik & Design
  const [aesthetic_requirements, setAestheticRequirements] = useState<string>(
    projectData.needs?.aesthetic_requirements || ''
  )
  const [roof_space_usage, setRoofSpaceUsage] = useState<string>(
    projectData.needs?.roof_space_usage || ''
  )

  // Zukunftsplanung & Integration
  const [future_expansion, setFutureExpansion] = useState<boolean>(
    projectData.needs?.future_expansion || false
  )
  const [smart_home_integration, setSmartHomeIntegration] = useState<boolean>(
    projectData.needs?.smart_home_integration || false
  )
  const [monitoring_wishes, setMonitoringWishes] = useState<string>(
    projectData.needs?.monitoring_wishes || ''
  )

  // Umwelt & Nachhaltigkeit
  const [environmental_priority, setEnvironmentalPriority] = useState<string>(
    projectData.needs?.environmental_priority || ''
  )

  // Rechtliche & technische Aspekte
  const [noise_restrictions, setNoiseRestrictions] = useState<boolean>(
    projectData.needs?.noise_restrictions || false
  )
  const [building_permits_handled, setBuildingPermitsHandled] = useState<boolean>(
    projectData.needs?.building_permits_handled || false
  )
  const [grid_connection_status, setGridConnectionStatus] = useState<string>(
    projectData.needs?.grid_connection_status || ''
  )
  const [insurance_clarification, setInsuranceClarification] = useState<boolean>(
    projectData.needs?.insurance_clarification || false
  )

  // Speicher & Energiemanagement
  const [storage_priority, setStoragePriority] = useState<string>(
    projectData.needs?.storage_priority || ''
  )
  const [backup_power_need, setBackupPowerNeed] = useState<string>(
    projectData.needs?.backup_power_need || ''
  )
  const [feed_in_vs_self_consumption, setFeedInVsSelfConsumption] = useState<string>(
    projectData.needs?.feed_in_vs_self_consumption || ''
  )

  // Sonderanforderungen
  const [special_requirements, setSpecialRequirements] = useState<string>(
    projectData.needs?.special_requirements || ''
  )

  // Validierung für "Weiter"-Button
  const requiredOk = primary_goal !== '' && budget_max !== ''

  // Beim Verlassen/Weiter speichern wir in den Context
  useEffect(() => {
    updateProjectData({
      needs: {
        primary_goal,
        budget_max: toNumberOrNull(budget_max),
        budget_preferred: toNumberOrNull(budget_preferred),
        financing_needed,
        installation_time_preference,
        technology_preference,
        warranty_importance,
        service_importance,
        brand_preference,
        installer_preference,
        aesthetic_requirements,
        roof_space_usage,
        future_expansion,
        smart_home_integration,
        monitoring_wishes,
        environmental_priority,
        noise_restrictions,
        building_permits_handled,
        grid_connection_status,
        insurance_clarification,
        storage_priority,
        backup_power_need,
        feed_in_vs_self_consumption,
        special_requirements
      }
    })
  }, [
    primary_goal, budget_max, budget_preferred, financing_needed,
    installation_time_preference, technology_preference, warranty_importance, service_importance,
    brand_preference, installer_preference, aesthetic_requirements, roof_space_usage,
    future_expansion, smart_home_integration, monitoring_wishes, environmental_priority,
    noise_restrictions, building_permits_handled, grid_connection_status, insurance_clarification,
    storage_priority, backup_power_need, feed_in_vs_self_consumption, special_requirements,
    updateProjectData
  ])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bedürfnisse &amp; Präferenzen</h1>
        <p className="text-slate-600">Ihre Wünsche und Anforderungen für die PV-Anlage</p>
      </div>

      {/* Hauptziele & Budget */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Hauptziele &amp; Budget</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primäres Ziel der PV-Anlage *">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={primary_goal} 
              onChange={(e) => setPrimaryGoal(e.target.value)}
              title="Primäres Ziel der PV-Anlage auswählen"
              required
            >
              <option value="">Bitte wählen</option>
              <option value="cost_reduction">Stromkosten reduzieren</option>
              <option value="independence">Energieunabhängigkeit</option>
              <option value="environment">Umweltschutz</option>
              <option value="investment">Investition/Rendite</option>
              <option value="self_sufficiency">Autarkie anstreben</option>
              <option value="future_proofing">Zukunftssicherheit</option>
            </select>
          </Field>
          <Field label="Maximales Budget (€) *">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={budget_max} 
              onChange={(e) => setBudgetMax(e.target.value)} 
              placeholder="z.B. 25000"
              required
            />
          </Field>
          <Field label="Bevorzugtes Budget (€)">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={budget_preferred} 
              onChange={(e) => setBudgetPreferred(e.target.value)} 
              placeholder="z.B. 20000"
            />
          </Field>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="financing_needed"
              checked={financing_needed} 
              onChange={(e) => setFinancingNeeded(e.target.checked)} 
            />
            <label htmlFor="financing_needed" className="text-sm">Finanzierung benötigt</label>
          </div>
        </div>
      </div>

      {/* Zeitpläne & Service */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Zeitpläne &amp; Service-Präferenzen</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Gewünschte Installationszeit">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={installation_time_preference} 
              onChange={(e) => setInstallationTime(e.target.value)}
              title="Gewünschte Installationszeit auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="asap">So schnell wie möglich</option>
              <option value="spring">Frühjahr</option>
              <option value="summer">Sommer</option>
              <option value="fall">Herbst</option>
              <option value="winter">Winter</option>
              <option value="next_year">Nächstes Jahr</option>
            </select>
          </Field>
          <Field label="Technologie-Präferenz">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={technology_preference} 
              onChange={(e) => setTechnologyPreference(e.target.value)}
              title="Technologie-Präferenz auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="latest">Neueste Technologie</option>
              <option value="proven">Bewährte Technologie</option>
              <option value="cost_effective">Kosteneffizient</option>
              <option value="premium">Premium-Klasse</option>
            </select>
          </Field>
          <Field label="Wichtigkeit der Garantie">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={warranty_importance} 
              onChange={(e) => setWarrantyImportance(e.target.value)}
              title="Wichtigkeit der Garantie auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="low">Wenig wichtig</option>
              <option value="medium">Mittel wichtig</option>
              <option value="high">Sehr wichtig</option>
            </select>
          </Field>
          <Field label="Wichtigkeit des Services">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={service_importance} 
              onChange={(e) => setServiceImportance(e.target.value)}
              title="Wichtigkeit des Services auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="low">Wenig wichtig</option>
              <option value="medium">Mittel wichtig</option>
              <option value="high">Sehr wichtig</option>
              <option value="critical">Kritisch</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Anbieter & Marken */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Anbieter &amp; Marken</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Marken-Präferenz">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={brand_preference} 
              onChange={(e) => setBrandPreference(e.target.value)}
              title="Marken-Präferenz auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="german">Deutsche Marken bevorzugt</option>
              <option value="european">Europäische Marken</option>
              <option value="global">Internationale Marken</option>
              <option value="premium">Premium-Marken</option>
              <option value="value">Preis-Leistungs-Sieger</option>
            </select>
          </Field>
          <Field label="Installateur-Präferenz">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={installer_preference} 
              onChange={(e) => setInstallerPreference(e.target.value)}
              title="Installateur-Präferenz auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="local">Lokaler Anbieter</option>
              <option value="certified">Zertifizierter Fachbetrieb</option>
              <option value="experienced">Erfahrener Spezialist</option>
              <option value="full_service">Full-Service-Anbieter</option>
              <option value="recommendation">Empfehlung erwünscht</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Ästhetik & Design */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Ästhetik &amp; Design</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Ästhetische Anforderungen">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={aesthetic_requirements} 
              onChange={(e) => setAestheticRequirements(e.target.value)}
              title="Ästhetische Anforderungen auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="low">Wenig wichtig</option>
              <option value="medium">Mittel wichtig</option>
              <option value="high">Sehr wichtig</option>
              <option value="critical">Entscheidend</option>
            </select>
          </Field>
          <Field label="Dachflächennutzung">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={roof_space_usage} 
              onChange={(e) => setRoofSpaceUsage(e.target.value)}
              title="Dachflächennutzung auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="maximum">Maximale Nutzung</option>
              <option value="optimal">Optimale Nutzung</option>
              <option value="partial">Teilweise Nutzung</option>
              <option value="minimal">Minimale Nutzung</option>
              <option value="specific_areas">Nur bestimmte Bereiche</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Zukunftsplanung & Integration */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Zukunftsplanung &amp; Integration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={future_expansion} 
                onChange={(e) => setFutureExpansion(e.target.checked)} 
              />
              <span>Zukünftige Erweiterung geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={smart_home_integration} 
                onChange={(e) => setSmartHomeIntegration(e.target.checked)} 
              />
              <span>Smart-Home-Integration gewünscht</span>
            </label>
          </div>
          <Field label="Monitoring-Wünsche">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={monitoring_wishes} 
              onChange={(e) => setMonitoringWishes(e.target.value)}
              title="Monitoring-Wünsche auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="basic">Grundlegendes Monitoring</option>
              <option value="detailed">Detailliertes Monitoring</option>
              <option value="app_control">App-Steuerung</option>
              <option value="web_portal">Web-Portal</option>
              <option value="professional">Professionelles System</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Umwelt & Rechtliche Aspekte */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Umwelt &amp; Rechtliche Aspekte</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Umwelt-Priorität">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={environmental_priority} 
              onChange={(e) => setEnvironmentalPriority(e.target.value)}
              title="Umwelt-Priorität auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="low">Wenig wichtig</option>
              <option value="medium">Mittel wichtig</option>
              <option value="high">Sehr wichtig</option>
              <option value="critical">Kritisch wichtig</option>
            </select>
          </Field>
          <Field label="Netzanschluss-Status">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={grid_connection_status} 
              onChange={(e) => setGridConnectionStatus(e.target.value)}
              title="Netzanschluss-Status auswählen"
            >
              <option value="">Unbekannt</option>
              <option value="existing">Vorhanden</option>
              <option value="upgrade_needed">Upgrade erforderlich</option>
              <option value="new_required">Neuanschluss erforderlich</option>
              <option value="pending">In Klärung</option>
            </select>
          </Field>
              <input 
                type="checkbox" 
                checked={noise_restrictions} 
                onChange={(e) => setNoiseRestrictions(e.target.checked)} 
              />
              <span>Lärmschutz-Auflagen vorhanden</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={building_permits_handled} 
                onChange={(e) => setBuildingPermitsHandled(e.target.checked)} 
              />
              <span>Baugenehmigung bereits geklärt</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
              <input 
                type="checkbox" 
                checked={insurance_clarification} 
                onChange={(e) => setInsuranceClarification(e.target.checked)} 
              />
              <span>Versicherung bereits geklärt</span>
            </label>
          </div>
        </div>
      </div>

      {/* Speicher & Energiemanagement */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Speicher &amp; Energiemanagement</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Speicher-Priorität">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={storage_priority} 
              onChange={(e) => setStoragePriority(e.target.value)}
              title="Speicher-Priorität auswählen"
            >
              <option value="">Nicht wichtig</option>
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
              <option value="essential">Unbedingt erforderlich</option>
            </select>
          </Field>
          <Field label="Notstrom-Bedarf">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={backup_power_need} 
              onChange={(e) => setBackupPowerNeed(e.target.value)}
              title="Notstrom-Bedarf auswählen"
            >
              <option value="">Nicht erforderlich</option>
              <option value="basic">Grundversorgung</option>
              <option value="partial">Teilweise Absicherung</option>
              <option value="full">Vollständige Absicherung</option>
              <option value="critical">Kritische Verbraucher</option>
            </select>
          </Field>
          <Field label="Einspeisung vs. Eigenverbrauch">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={feed_in_vs_self_consumption} 
              onChange={(e) => setFeedInVsSelfConsumption(e.target.value)}
              title="Einspeisung vs. Eigenverbrauch auswählen"
            >
              <option value="">Keine Präferenz</option>
              <option value="max_feed_in">Maximale Einspeisung</option>
              <option value="balanced">Ausgewogen</option>
              <option value="max_self_consumption">Maximaler Eigenverbrauch</option>
              <option value="autarky">Autarkie anstreben</option>
            </select>
          </Field>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Sonderanforderungen</h3>
        <Field label="Besondere Wünsche oder Anforderungen">
          <textarea 
            className="w-full rounded border border-slate-300 px-3 py-2 h-24" 
            value={special_requirements} 
            onChange={(e) => setSpecialRequirements(e.target.value)} 
            placeholder="z.B. spezielle Verschattungssituationen, architektonische Besonderheiten, etc."
          />
        </Field>
      </div>

      <WizardNav
        backTo="/project/demand"
        nextTo="/project/options"
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
