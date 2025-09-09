import React, { useState, useEffect } from 'react'
import WizardNav from '../../components/WizardNav'

// Mock useProjectData hook until context is available
const useProjectData = () => ({
  projectData: { 
    consumption: {
      annualKWhHousehold: undefined as number | undefined,
      monthlyCostHouseholdEuro: undefined as number | undefined,
      annualKWhHeating: undefined as number | undefined,
      monthlyCostHeatingEuro: undefined as number | undefined,
      currentHeatingType: undefined as string | undefined,
      heatingAge: undefined as number | undefined,
      fuelType: undefined as string | undefined,
      householdSize: undefined as number | undefined,
      homeOfficeHours: undefined as number | undefined,
      electricAppliances: undefined as string | undefined,
      zukunft_epump: undefined as boolean | undefined,
      zukunft_wallbox: undefined as boolean | undefined,
      zukunft_pool: undefined as boolean | undefined,
      zukunft_sauna: undefined as boolean | undefined,
      zukunft_klima: undefined as boolean | undefined,
      zukunft_erweiterung: undefined as boolean | undefined,
      epump_verbrauch_schaetzung: undefined as number | undefined,
      wallbox_verbrauch_schaetzung: undefined as number | undefined,
      pool_verbrauch_schaetzung: undefined as number | undefined,
      eigenverbrauch_maximieren: undefined as boolean | undefined,
      netzeinspeisung_begrenzen: undefined as boolean | undefined,
      backup_wichtig: undefined as boolean | undefined,
      umwelt_prioritaet: undefined as boolean | undefined
    }
  },
  updateProjectData: (data: any) => console.log('Update project data:', data)
})

const toNumberOrNull = (value: string): number | null => {
  const num = parseFloat(value)
  return isNaN(num) ? null : num
}

export default function DemandAnalysis() {
  const { projectData, updateProjectData } = useProjectData()

  // Energieverbrauch - Haushalt
  const [annualKWhHousehold, setAnnualKWhHousehold] = useState<string>(
    projectData.consumption?.annualKWhHousehold?.toString() || ''
  )
  const [monthlyCostHouseholdEuro, setMonthlyCostHouseholdEuro] = useState<string>(
    projectData.consumption?.monthlyCostHouseholdEuro?.toString() || ''
  )

  // Energieverbrauch - Heizung
  const [annualKWhHeating, setAnnualKWhHeating] = useState<string>(
    projectData.consumption?.annualKWhHeating?.toString() || ''
  )
  const [monthlyCostHeatingEuro, setMonthlyCostHeatingEuro] = useState<string>(
    projectData.consumption?.monthlyCostHeatingEuro?.toString() || ''
  )

  // Heizungsdetails
  const [currentHeatingType, setCurrentHeatingType] = useState<string>(
    projectData.consumption?.currentHeatingType || ''
  )
  const [heatingAge, setHeatingAge] = useState<string>(
    projectData.consumption?.heatingAge?.toString() || ''
  )
  const [fuelType, setFuelType] = useState<string>(
    projectData.consumption?.fuelType || ''
  )

  // Haushaltsdaten
  const [householdSize, setHouseholdSize] = useState<string>(
    projectData.consumption?.householdSize?.toString() || ''
  )
  const [homeOfficeHours, setHomeOfficeHours] = useState<string>(
    projectData.consumption?.homeOfficeHours?.toString() || ''
  )
  const [electricAppliances, setElectricAppliances] = useState<string>(
    projectData.consumption?.electricAppliances || ''
  )

  // Zukunftsplanung
  const [zukunft_epump, setZukunftEpump] = useState<boolean>(
    projectData.consumption?.zukunft_epump || false
  )
  const [zukunft_wallbox, setZukunftWallbox] = useState<boolean>(
    projectData.consumption?.zukunft_wallbox || false
  )
  const [zukunft_pool, setZukunftPool] = useState<boolean>(
    projectData.consumption?.zukunft_pool || false
  )
  const [zukunft_sauna, setZukunftSauna] = useState<boolean>(
    projectData.consumption?.zukunft_sauna || false
  )
  const [zukunft_klima, setZukunftKlima] = useState<boolean>(
    projectData.consumption?.zukunft_klima || false
  )
  const [zukunft_erweiterung, setZukunftErweiterung] = useState<boolean>(
    projectData.consumption?.zukunft_erweiterung || false
  )

  // Verbrauchsschätzungen für Zukunftsplanung
  const [epump_verbrauch_schaetzung, setEpumpVerbrauch] = useState<string>(
    projectData.consumption?.epump_verbrauch_schaetzung?.toString() || ''
  )
  const [wallbox_verbrauch_schaetzung, setWallboxVerbrauch] = useState<string>(
    projectData.consumption?.wallbox_verbrauch_schaetzung?.toString() || ''
  )
  const [pool_verbrauch_schaetzung, setPoolVerbrauch] = useState<string>(
    projectData.consumption?.pool_verbrauch_schaetzung?.toString() || ''
  )

  // Prioritäten
  const [eigenverbrauch_maximieren, setEigenverbrauch] = useState<boolean>(
    projectData.consumption?.eigenverbrauch_maximieren || false
  )
  const [netzeinspeisung_begrenzen, setNetzeinspeisung] = useState<boolean>(
    projectData.consumption?.netzeinspeisung_begrenzen || false
  )
  const [backup_wichtig, setBackupWichtig] = useState<boolean>(
    projectData.consumption?.backup_wichtig || false
  )
  const [umwelt_prioritaet, setUmweltPrioritaet] = useState<boolean>(
    projectData.consumption?.umwelt_prioritaet || false
  )

  // Berechnete Werte anzeigen
  const [annCostHH, setAnnCostHH] = useState<number>(0)
  const [annCostHeat, setAnnCostHeat] = useState<number>(0)
  const [annualCostTotal, setAnnualCostTotal] = useState<number>(0)
  const [annualKWhTotal, setAnnualKWhTotal] = useState<number>(0)
  const [euroPerKWh, setEuroPerKWh] = useState<number>(0)

  // Minimal validation - either consumption OR cost is enough
  const requiredOk = annualKWhHousehold !== '' || monthlyCostHouseholdEuro !== ''

  // Live-Berechnung der Gesamtkosten und kWh
  useEffect(() => {
    const monthlyCostHH = toNumberOrNull(monthlyCostHouseholdEuro) || 0
    const annCostHH = monthlyCostHH * 12
    
    const monthlyCostHeat = toNumberOrNull(monthlyCostHeatingEuro) || 0
    const annCostHeat = monthlyCostHeat * 12

    const annualCostTotal = annCostHH + annCostHeat
    const annualKWhTotal = (toNumberOrNull(annualKWhHousehold) || 0) + (toNumberOrNull(annualKWhHeating) || 0)
    const euroPerKWh = annualKWhTotal > 0 ? annualCostTotal / annualKWhTotal : 0

    setAnnCostHH(annCostHH)
    setAnnCostHeat(annCostHeat)
    setAnnualCostTotal(annualCostTotal)
    setAnnualKWhTotal(annualKWhTotal)
    setEuroPerKWh(euroPerKWh)
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro])

  // Beim Verlassen/Weiter speichern wir in den Context
  useEffect(() => {
    updateProjectData({
      consumption: {
        annualKWhHousehold: toNumberOrNull(annualKWhHousehold),
        monthlyCostHouseholdEuro: toNumberOrNull(monthlyCostHouseholdEuro),
        annualKWhHeating: toNumberOrNull(annualKWhHeating),
        monthlyCostHeatingEuro: toNumberOrNull(monthlyCostHeatingEuro),
        currentHeatingType,
        heatingAge: toNumberOrNull(heatingAge),
        fuelType,
        householdSize: toNumberOrNull(householdSize),
        homeOfficeHours: toNumberOrNull(homeOfficeHours),
        electricAppliances,
        zukunft_epump,
        zukunft_wallbox,
        zukunft_pool,
        zukunft_sauna,
        zukunft_klima,
        zukunft_erweiterung,
        epump_verbrauch_schaetzung: toNumberOrNull(epump_verbrauch_schaetzung),
        wallbox_verbrauch_schaetzung: toNumberOrNull(wallbox_verbrauch_schaetzung),
        pool_verbrauch_schaetzung: toNumberOrNull(pool_verbrauch_schaetzung),
        eigenverbrauch_maximieren,
        netzeinspeisung_begrenzen,
        backup_wichtig,
        umwelt_prioritaet
      }
    })
  }, [
    annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
    currentHeatingType, heatingAge, fuelType, householdSize, homeOfficeHours, electricAppliances,
    zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima, zukunft_erweiterung,
    epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
    eigenverbrauch_maximieren, netzeinspeisung_begrenzen, backup_wichtig, umwelt_prioritaet,
    updateProjectData
  ])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bedarfsanalyse</h1>
        <p className="text-slate-600">Energieverbrauch und zukünftige Planungen erfassen</p>
      </div>

      {/* Aktueller Energieverbrauch - Haushaltsstrom */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Haushaltsstrom</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Jährlicher Verbrauch (kWh/Jahr) *">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={annualKWhHousehold} 
              onChange={(e) => setAnnualKWhHousehold(e.target.value)} 
              placeholder="z.B. 4500"
              required
            />
          </Field>
          <Field label="Monatliche Kosten (€/Monat) *">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={monthlyCostHouseholdEuro} 
              onChange={(e) => setMonthlyCostHouseholdEuro(e.target.value)} 
              placeholder="z.B. 120"
              required
            />
          </Field>
        </div>
        
        {annualKWhHousehold && monthlyCostHouseholdEuro && (
          <div className="mt-4 p-3 bg-blue-50 rounded border text-sm">
            <strong>Haushaltsstrom:</strong> {annCostHH.toFixed(0)} €/Jahr
          </div>
        )}
      </div>

      {/* Heizung */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Heizung &amp; Warmwasser</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Jährlicher Verbrauch (kWh/Jahr)">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={annualKWhHeating} 
              onChange={(e) => setAnnualKWhHeating(e.target.value)} 
              placeholder="z.B. 15000"
            />
          </Field>
          <Field label="Monatliche Kosten (€/Monat)">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={monthlyCostHeatingEuro} 
              onChange={(e) => setMonthlyCostHeatingEuro(e.target.value)} 
              placeholder="z.B. 180"
            />
          </Field>
          <Field label="Heizungstyp">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={currentHeatingType} 
              onChange={(e) => setCurrentHeatingType(e.target.value)}
            >
              <option value="">Bitte wählen</option>
              <option value="gas">Gasheizung</option>
              <option value="oil">Ölheizung</option>
              <option value="electric">Elektroheizung</option>
              <option value="district">Fernwärme</option>
              <option value="wood">Holz/Pellets</option>
              <option value="heatpump">Wärmepumpe</option>
              <option value="other">Sonstiges</option>
            </select>
          </Field>
          <Field label="Alter der Heizung (Jahre)">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={heatingAge} 
              onChange={(e) => setHeatingAge(e.target.value)} 
              placeholder="z.B. 15"
            />
          </Field>
          <Field label="Brennstoff/Energieträger">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={fuelType} 
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="">Bitte wählen</option>
              <option value="gas">Erdgas</option>
              <option value="propane">Flüssiggas</option>
              <option value="oil">Heizöl</option>
              <option value="electric">Strom</option>
              <option value="wood">Holz</option>
              <option value="pellets">Pellets</option>
              <option value="district">Fernwärme</option>
              <option value="other">Sonstiges</option>
            </select>
          </Field>
        </div>
        
        {annualKWhHeating && monthlyCostHeatingEuro && (
          <div className="mt-4 p-3 bg-orange-50 rounded border text-sm">
            <strong>Heizung:</strong> {annCostHeat.toFixed(0)} €/Jahr
          </div>
        )}
      </div>

      {/* Haushaltsdaten */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Haushaltsdaten</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Anzahl Personen">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={householdSize} 
              onChange={(e) => setHouseholdSize(e.target.value)} 
              placeholder="z.B. 4"
            />
          </Field>
          <Field label="Homeoffice-Stunden/Woche">
            <input 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={homeOfficeHours} 
              onChange={(e) => setHomeOfficeHours(e.target.value)} 
              placeholder="z.B. 20"
            />
          </Field>
          <Field label="Große Stromverbraucher">
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={electricAppliances} 
              onChange={(e) => setElectricAppliances(e.target.value)}
            >
              <option value="">Keine besonderen</option>
              <option value="pool">Pool-Pumpe</option>
              <option value="sauna">Sauna</option>
              <option value="workshop">Werkstatt</option>
              <option value="server">Server/IT</option>
              <option value="multiple">Mehrere</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Gesamtübersicht */}
      {annualCostTotal > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Energiekosten-Übersicht</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-800">{annualKWhTotal.toFixed(0)}</div>
              <div className="text-sm text-slate-600">kWh/Jahr gesamt</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-800">{annualCostTotal.toFixed(0)} €</div>
              <div className="text-sm text-slate-600">€/Jahr gesamt</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-800">{(annualCostTotal/12).toFixed(0)} €</div>
              <div className="text-sm text-slate-600">€/Monat gesamt</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-800">{euroPerKWh.toFixed(2)} €</div>
              <div className="text-sm text-slate-600">€/kWh Durchschnitt</div>
            </div>
          </div>
        </div>
      )}

      {/* Zukunftsplanung */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Zukünftige Verbraucher</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Geplante Anschaffungen</h4>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_epump} onChange={(e) => setZukunftEpump(e.target.checked)} />
              <span>Wärmepumpe geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_wallbox} onChange={(e) => setZukunftWallbox(e.target.checked)} />
              <span>Wallbox/E-Auto geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_pool} onChange={(e) => setZukunftPool(e.target.checked)} />
              <span>Pool geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_sauna} onChange={(e) => setZukunftSauna(e.target.checked)} />
              <span>Sauna geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_klima} onChange={(e) => setZukunftKlima(e.target.checked)} />
              <span>Klimaanlage geplant</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={zukunft_erweiterung} onChange={(e) => setZukunftErweiterung(e.target.checked)} />
              <span>Gebäudeerweiterung geplant</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Geschätzte Zusatzverbräuche (kWh/Jahr)</h4>
            <Field label="Wärmepumpe (geschätzt)">
              <input 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={epump_verbrauch_schaetzung} 
                onChange={(e) => setEpumpVerbrauch(e.target.value)} 
                placeholder="z.B. 3000"
                disabled={!zukunft_epump}
              />
            </Field>
            <Field label="Wallbox/E-Auto (geschätzt)">
              <input 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={wallbox_verbrauch_schaetzung} 
                onChange={(e) => setWallboxVerbrauch(e.target.value)} 
                placeholder="z.B. 2500"
                disabled={!zukunft_wallbox}
              />
            </Field>
            <Field label="Pool/Sauna (geschätzt)">
              <input 
                className="w-full rounded border border-slate-300 px-3 py-2" 
                value={pool_verbrauch_schaetzung} 
                onChange={(e) => setPoolVerbrauch(e.target.value)} 
                placeholder="z.B. 1500"
                disabled={!zukunft_pool && !zukunft_sauna}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Spezielle Anforderungen */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Spezielle Anforderungen &amp; Prioritäten</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={eigenverbrauch_maximieren} onChange={(e) => setEigenverbrauch(e.target.checked)} />
              <span>Eigenverbrauch maximieren</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={netzeinspeisung_begrenzen} onChange={(e) => setNetzeinspeisung(e.target.checked)} />
              <span>Netzeinspeisung begrenzen</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={backup_wichtig} onChange={(e) => setBackupWichtig(e.target.checked)} />
              <span>Notstromfähigkeit wichtig</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={umwelt_prioritaet} onChange={(e) => setUmweltPrioritaet(e.target.checked)} />
              <span>Umweltschutz hat Priorität</span>
            </label>
          </div>
        </div>
      </div>

      <WizardNav
        backTo="/project/building"
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
