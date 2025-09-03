/* DEF: Projekt → Bedarfsanalyse (Verbrauch & Gebäude) – dynamische Ableitungen, Validierung, Navigation */
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../../lib/projectContext'
import { ROOF_COVER, ROOF_ORIENT, ROOF_TYPES, STATES_DE } from '../../lib/constants'
import { annualCostFromMonthly, pricePerKWh, sumNullable, toNumberOrNull } from '../../lib/compute'

function Field({label, children}:{label:string, children:React.ReactNode}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600">{label}</div>
      {children}
    </label>
  )
}

export default function DemandAnalysis() {
  const nav = useNavigate()
  const { state, setConsumption, setBuilding } = useProject()

  // Lokale Eingaben mit initialen Werten aus Context
  const [annualKWhHousehold, setAnnualKWhHousehold] = useState<string>(state.consumption.annualKWhHousehold?.toString() ?? '')
  const [monthlyCostHouseholdEuro, setMonthlyCostHouseholdEuro] = useState<string>(state.consumption.monthlyCostHouseholdEuro?.toString() ?? '')
  const [annualKWhHeating, setAnnualKWhHeating] = useState<string>(state.consumption.annualKWhHeating?.toString() ?? '')
  const [monthlyCostHeatingEuro, setMonthlyCostHeatingEuro] = useState<string>(state.consumption.monthlyCostHeatingEuro?.toString() ?? '')

  const [buildYear, setBuildYear] = useState<string>(state.building.buildYear ?? '')
  const [roofCover, setRoofCover] = useState<string>(state.building.roofCover ?? '')
  const [roofOrientation, setRoofOrientation] = useState<string>(state.building.roofOrientation ?? '')
  const [roofType, setRoofType] = useState<string>(state.building.roofType ?? '')
  const [freeAreaM2, setFreeAreaM2] = useState<string>(state.building.freeAreaM2?.toString() ?? '')
  const [tiltDeg, setTiltDeg] = useState<string>(state.building.tiltDeg?.toString() ?? '')
  const [heightOver7m, setHeightOver7m] = useState<boolean>(state.building.heightOver7m ?? false)
  const [financingWanted, setFinancingWanted] = useState<boolean>(state.building.financingWanted ?? false)

  // Ableitungen
  const derived = useMemo(() => {
    const annKWhHH = toNumberOrNull(annualKWhHousehold)
    const monCostHH = toNumberOrNull(monthlyCostHouseholdEuro)
    const annKWhHeat = toNumberOrNull(annualKWhHeating)
    const monCostHeat = toNumberOrNull(monthlyCostHeatingEuro)

    const annCostHH = annualCostFromMonthly(monCostHH)
    const annCostHeat = annualCostFromMonthly(monCostHeat)

    const annualCostTotal = sumNullable(annCostHH, annCostHeat)
    const annualKWhTotal = sumNullable(annKWhHH, annKWhHeat)
    const euroPerKWh = pricePerKWh(annualCostTotal, annualKWhTotal)

    return {
      annCostHH, annCostHeat, annualCostTotal, annualKWhTotal, euroPerKWh
    }
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro])

  // Beim Verlassen/Weiter speichern wir in den Context
  function persistToContext() {
    setConsumption({
      annualKWhHousehold: toNumberOrNull(annualKWhHousehold),
      monthlyCostHouseholdEuro: toNumberOrNull(monthlyCostHouseholdEuro),
      annualKWhHeating: toNumberOrNull(annualKWhHeating),
      monthlyCostHeatingEuro: toNumberOrNull(monthlyCostHeatingEuro),
      annualCostTotalEuro: derived.annualCostTotal,
      annualKWhTotal: derived.annualKWhTotal,
      pricePerKWhEuro: derived.euroPerKWh,
    })
    setBuilding({
      buildYear,
      roofCover: roofCover || null,
      roofOrientation: roofOrientation || null,
      roofType: roofType || null,
      freeAreaM2: toNumberOrNull(freeAreaM2),
      tiltDeg: toNumberOrNull(tiltDeg),
      heightOver7m,
      financingWanted,
    })
  }

  const canContinue = useMemo(() => {
    // Minimalbedingungen: Wir brauchen zumindest JahreskWh Haushalt ODER Monatskosten Haushalt,
    // und ein paar Gebäudedaten für PV (die WP nutzt wir später separat detailierter).
    const hasAnyHH = annualKWhHousehold.trim() !== '' || monthlyCostHouseholdEuro.trim() !== ''
    const hasRoofBasics = Boolean(roofOrientation) && Boolean(roofType) && (freeAreaM2.trim() !== '')
    return hasAnyHH && hasRoofBasics
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, roofOrientation, roofType, freeAreaM2])

  function next() {
    persistToContext()
    // Entscheiden, wohin: Solarkalkulator, Wärmepumpe, oder Ergebnisse – je nach Modus
    const mode = state.basics.mode
    if (mode === 'pv') nav('/solarkalkulator')
    else if (mode === 'hp') nav('/waermepumpe')
    else nav('/ergebnisse')
  }

  useEffect(() => {
    // Live-Shadow-Save (optional): wenn du lieber erst beim Klick speichern willst, entferne diesen Effekt
    persistToContext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro, buildYear, roofCover, roofOrientation, roofType, freeAreaM2, tiltDeg, heightOver7m, financingWanted])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Bedarfsanalyse</h2>

      {/* Verbrauchswerte */}
      <section className="rounded-xl bg-white p-5 shadow">
        <h3 className="mb-3 text-lg font-semibold">Verbrauchswerte</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Jahresverbrauch Haushalt (kWh)">
            <input
              inputMode="numeric"
              className="w-full rounded border px-3 py-2"
              value={annualKWhHousehold}
              onChange={(e) => setAnnualKWhHousehold(e.target.value)}
              placeholder="z. B. 3500"
            />
          </Field>
          <Field label="Monatliche Stromkosten Haushalt (€)">
            <input
              inputMode="decimal"
              className="w-full rounded border px-3 py-2"
              value={monthlyCostHouseholdEuro}
              onChange={(e) => setMonthlyCostHouseholdEuro(e.target.value)}
              placeholder="z. B. 100"
            />
          </Field>

          <Field label="Jahresverbrauch Heizung (kWh) – optional">
            <input
              inputMode="numeric"
              className="w-full rounded border px-3 py-2"
              value={annualKWhHeating}
              onChange={(e) => setAnnualKWhHeating(e.target.value)}
              placeholder="z. B. 2000"
            />
          </Field>
          <Field label="Monatliche Stromkosten Heizung (€) – optional">
            <input
              inputMode="decimal"
              className="w-full rounded border px-3 py-2"
              value={monthlyCostHeatingEuro}
              onChange={(e) => setMonthlyCostHeatingEuro(e.target.value)}
              placeholder="z. B. 80"
            />
          </Field>
        </div>

        {/* Ableitungen */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border p-3 text-sm">
            <div className="font-medium">Jährliche Gesamtkosten (€)</div>
            <div className="text-slate-700">
              {derived.annualCostTotal != null ? derived.annualCostTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '—'}
            </div>
          </div>
          <div className="rounded border p-3 text-sm">
            <div className="font-medium">Jahresverbrauch gesamt (kWh)</div>
            <div className="text-slate-700">
              {derived.annualKWhTotal != null ? derived.annualKWhTotal.toLocaleString('de-DE') : '—'}
            </div>
          </div>
          <div className="rounded border p-3 text-sm">
            <div className="font-medium">Tarif (€/kWh)</div>
            <div className="text-slate-700">
              {derived.euroPerKWh != null ? derived.euroPerKWh.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* Gebäude */}
      <section className="rounded-xl bg-white p-5 shadow">
        <h3 className="mb-3 text-lg font-semibold">Gebäudedaten</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Baujahr">
            <input
              className="w-full rounded border px-3 py-2"
              value={buildYear}
              onChange={(e) => setBuildYear(e.target.value)}
              placeholder="z. B. 1998"
            />
          </Field>
          <Field label="Dachdeckungsart">
            <select className="w-full rounded border px-3 py-2" value={roofCover ?? ''} onChange={e=>setRoofCover(e.target.value)}>
              <option value="">— Bitte wählen —</option>
              {ROOF_COVER.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Dachausrichtung">
            <select className="w-full rounded border px-3 py-2" value={roofOrientation ?? ''} onChange={e=>setRoofOrientation(e.target.value)}>
              <option value="">— Bitte wählen —</option>
              {ROOF_ORIENT.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="Dachart">
            <select className="w-full rounded border px-3 py-2" value={roofType ?? ''} onChange={e=>setRoofType(e.target.value)}>
              <option value="">— Bitte wählen —</option>
              {ROOF_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Freie Fläche (m²)">
            <input
              inputMode="decimal"
              className="w-full rounded border px-3 py-2"
              value={freeAreaM2}
              onChange={(e) => setFreeAreaM2(e.target.value)}
              placeholder="z. B. 60"
            />
          </Field>
          <Field label="Dachneigung (°)">
            <input
              inputMode="decimal"
              className="w-full rounded border px-3 py-2"
              value={tiltDeg}
              onChange={(e) => setTiltDeg(e.target.value)}
              placeholder="z. B. 30"
            />
          </Field>

          <div className="col-span-1 md:col-span-3 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={heightOver7m} onChange={e=>setHeightOver7m(e.target.checked)} />
              Gebäudehöhe > 7 m (Gerüstkosten berücksichtigen)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={financingWanted} onChange={e=>setFinancingWanted(e.target.checked)} />
              Finanzierung gewünscht
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-between">
        <button
          type="button"
          className="rounded bg-slate-200 px-4 py-2 text-sm hover:bg-slate-300"
          onClick={() => nav('/projekt-bedarf/kundendaten')}
        >
          Zurück
        </button>
        <button
          type="button"
          disabled={!canContinue}
          className={`rounded px-4 py-2 text-sm text-white ${canContinue ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-300 cursor-not-allowed'}`}
          onClick={next}
        >
          Nächster Bereich
        </button>
      </div>
    </div>
  )
}
