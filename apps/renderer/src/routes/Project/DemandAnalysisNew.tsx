import React, { useState, useEffect, useMemo } from 'react'
import WizardNav from '../../components/WizardNav'
import { useProject } from '../../state/project'
import { 
  formatGermanNumber, 
  formatGermanCurrency, 
  formatGermanInteger, 
  formatGermanKWh, 
  formatGermanElectricityPrice,
  parseGermanNumber 
} from '../../utils/germanFormat'

const toNumberOrUndefined = (value: string): number | undefined => {
  const num = parseGermanNumber(value)
  return isNaN(num || 0) ? undefined : num
}

// Intelligente Verbrauchsanalyse-Funktionen
const estimateAnnualConsumption = (householdSize: number, livingSpace: number): number => {
  // Durchschnittliche Verbrauchswerte für Deutschland
  const baseConsumption = householdSize * 1500; // 1500 kWh pro Person
  const spaceConsumption = livingSpace * 20; // 20 kWh pro m² Wohnfläche
  return Math.round((baseConsumption + spaceConsumption) / 2);
}

const calculateElectricityPrice = (annualKWh: number, monthlyCost: number): number => {
  if (annualKWh > 0 && monthlyCost > 0) {
    const annualCost = monthlyCost * 12;
    return Math.round((annualCost / annualKWh) * 10000) / 10000; // 4 Dezimalstellen
  }
  return 0.32; // Durchschnittspreis Deutschland
}

const getConsumptionCategory = (consumption: number, householdSize: number): string => {
  const averagePerPerson = consumption / (householdSize || 1);
  if (averagePerPerson < 1200) return 'Sehr niedrig (sparsam)';
  if (averagePerPerson < 1800) return 'Niedrig (effizient)';
  if (averagePerPerson < 2500) return 'Durchschnittlich';
  if (averagePerPerson < 3500) return 'Hoch';
  return 'Sehr hoch (Einsparpotential!)';
}

const calculatePotentialSavings = (currentConsumption: number, electricityPrice: number): number => {
  // Geschätztes Einsparpotential durch PV-Anlage (60-80% Eigenverbrauch möglich)
  const savingsPotential = currentConsumption * 0.7; // 70% durchschnittliches Einsparpotential
  return Math.round(savingsPotential * electricityPrice);
}

export default function DemandAnalysis() {
  const { state, actions } = useProject()

  // Energieverbrauch - Haushalt
  const [annualKWhHousehold, setAnnualKWhHousehold] = useState<string>(
    state.consumption?.annualKWhHousehold?.toString() || ''
  )
  const [monthlyCostHouseholdEuro, setMonthlyCostHouseholdEuro] = useState<string>(
    state.consumption?.monthlyCostHouseholdEuro?.toString() || ''
  )

  // Energieverbrauch - Heizung
  const [annualKWhHeating, setAnnualKWhHeating] = useState<string>(
    state.consumption?.annualKWhHeating?.toString() || ''
  )
  const [monthlyCostHeatingEuro, setMonthlyCostHeatingEuro] = useState<string>(
    state.consumption?.monthlyCostHeatingEuro?.toString() || ''
  )

  // Energieverbrauch - Sonstiges
  const [annualKWhOther, setAnnualKWhOther] = useState<string>(
    state.consumption?.annualKWhOther?.toString() || ''
  )
  const [monthlyCostOtherEuro, setMonthlyCostOtherEuro] = useState<string>(
    state.consumption?.monthlyCostOtherEuro?.toString() || ''
  )

  // Heizungsdetails
  const [currentHeatingType, setCurrentHeatingType] = useState<string>(
    state.consumption?.currentHeatingType || ''
  )
  const [heatingAge, setHeatingAge] = useState<string>(
    state.consumption?.heatingAge?.toString() || ''
  )
  const [fuelType, setFuelType] = useState<string>(
    state.consumption?.fuelType || ''
  )

  // Haushaltsdaten
  const [householdSize, setHouseholdSize] = useState<string>(
    state.consumption?.householdSize?.toString() || ''
  )
  const [homeOfficeHours, setHomeOfficeHours] = useState<string>(
    state.consumption?.homeOfficeHours?.toString() || ''
  )
  const [electricAppliances, setElectricAppliances] = useState<string>(
    state.consumption?.electricAppliances || ''
  )

  // Zukunftsplanung
  const [zukunft_epump, setZukunftEpump] = useState<boolean>(
    state.consumption?.zukunft_epump || false
  )
  const [zukunft_wallbox, setZukunftWallbox] = useState<boolean>(
    state.consumption?.zukunft_wallbox || false
  )
  const [zukunft_pool, setZukunftPool] = useState<boolean>(
    state.consumption?.zukunft_pool || false
  )
  const [zukunft_sauna, setZukunftSauna] = useState<boolean>(
    state.consumption?.zukunft_sauna || false
  )
  const [zukunft_klima, setZukunftKlima] = useState<boolean>(
    state.consumption?.zukunft_klima || false
  )
  const [zukunft_erweiterung, setZukunftErweiterung] = useState<boolean>(
    state.consumption?.zukunft_erweiterung || false
  )

  // Verbrauchsschätzungen für Zukunftsplanung
  const [epump_verbrauch_schaetzung, setEpumpVerbrauch] = useState<string>(
    state.consumption?.epump_verbrauch_schaetzung?.toString() || ''
  )
  const [wallbox_verbrauch_schaetzung, setWallboxVerbrauch] = useState<string>(
    state.consumption?.wallbox_verbrauch_schaetzung?.toString() || ''
  )
  const [pool_verbrauch_schaetzung, setPoolVerbrauch] = useState<string>(
    state.consumption?.pool_verbrauch_schaetzung?.toString() || ''
  )

  // Prioritäten
  const [eigenverbrauch_maximieren, setEigenverbrauch] = useState<boolean>(
    state.consumption?.eigenverbrauch_maximieren || false
  )
  const [netzeinspeisung_begrenzen, setNetzeinspeisung] = useState<boolean>(
    state.consumption?.netzeinspeisung_begrenzen || false
  )
  const [backup_wichtig, setBackupWichtig] = useState<boolean>(
    state.consumption?.backup_wichtig || false
  )
  const [umwelt_prioritaet, setUmweltPrioritaet] = useState<boolean>(
    state.consumption?.umwelt_prioritaet || false
  )

  // Intelligente Verbrauchsanalyse
  const analysisData = useMemo(() => {
    const householdConsumption = toNumberOrUndefined(annualKWhHousehold) || 0;
    const householdCostMonthly = toNumberOrUndefined(monthlyCostHouseholdEuro) || 0;
    const heatingConsumption = toNumberOrUndefined(annualKWhHeating) || 0;
    const heatingCostMonthly = toNumberOrUndefined(monthlyCostHeatingEuro) || 0;
    const otherConsumption = toNumberOrUndefined(annualKWhOther) || 0;
    const otherCostMonthly = toNumberOrUndefined(monthlyCostOtherEuro) || 0;
    const householdSizeNum = toNumberOrUndefined(householdSize) || 1;
    const livingSpace = state.building?.livingSpace || 150;
    
    // Berechnungen
    const totalConsumption = householdConsumption + heatingConsumption + otherConsumption;
    const totalMonthlyCost = householdCostMonthly + heatingCostMonthly + otherCostMonthly;
    const totalAnnualCost = totalMonthlyCost * 12;
    const electricityPrice = totalConsumption > 0 ? totalAnnualCost / totalConsumption : 0.32;
    
    // Einzeltarife berechnen
    const householdElectricityPrice = householdConsumption > 0 ? (householdCostMonthly * 12) / householdConsumption : 0;
    const heatingElectricityPrice = heatingConsumption > 0 ? (heatingCostMonthly * 12) / heatingConsumption : 0;
    const otherElectricityPrice = otherConsumption > 0 ? (otherCostMonthly * 12) / otherConsumption : 0;
    
    // Schätzungen und Empfehlungen
    const estimatedConsumption = estimateAnnualConsumption(householdSizeNum, livingSpace);
    const consumptionCategory = householdConsumption > 0 ? getConsumptionCategory(householdConsumption, householdSizeNum) : '';
    const potentialSavings = householdConsumption > 0 ? calculatePotentialSavings(householdConsumption, electricityPrice) : 0;
    
    // Zukunftspläne Verbrauchsschätzungen
    const futureConsumption = totalConsumption + 
      (zukunft_epump ? (toNumberOrUndefined(epump_verbrauch_schaetzung) || 3000) : 0) +
      (zukunft_wallbox ? (toNumberOrUndefined(wallbox_verbrauch_schaetzung) || 2500) : 0) +
      (zukunft_pool ? (toNumberOrUndefined(pool_verbrauch_schaetzung) || 1500) : 0) +
      (zukunft_sauna ? 1200 : 0) +
      (zukunft_klima ? 800 : 0);
    
    return {
      totalConsumption,
      totalAnnualCost,
      electricityPrice,
      householdElectricityPrice,
      heatingElectricityPrice,
      otherElectricityPrice,
      estimatedConsumption,
      consumptionCategory,
      potentialSavings,
      futureConsumption,
      hasSignificantIncrease: futureConsumption > totalConsumption * 1.5
    };
  }, [
    annualKWhHousehold, monthlyCostHouseholdEuro,
    annualKWhHeating, monthlyCostHeatingEuro,
    annualKWhOther, monthlyCostOtherEuro,
    annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
    householdSize, zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima,
    epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
    state.building?.livingSpace
  ]);

  // Berechnete Werte anzeigen
  const [annCostHH, setAnnCostHH] = useState<number>(0)
  const [annCostHeat, setAnnCostHeat] = useState<number>(0)
  const [annualCostTotal, setAnnualCostTotal] = useState<number>(0)
  const [annualKWhTotal, setAnnualKWhTotal] = useState<number>(0)
  const [euroPerKWh, setEuroPerKWh] = useState<number>(0)

  // Validierung für "Weiter"-Button
  const requiredOk = annualKWhHousehold !== '' && monthlyCostHouseholdEuro !== ''

  // Live-Berechnung der Gesamtkosten und kWh
  useEffect(() => {
    const monthlyCostHH = toNumberOrUndefined(monthlyCostHouseholdEuro) || 0
    const annCostHH = monthlyCostHH * 12
    
    const monthlyCostHeat = toNumberOrUndefined(monthlyCostHeatingEuro) || 0
    const annCostHeat = monthlyCostHeat * 12

    const annualCostTotal = annCostHH + annCostHeat
    const annualKWhTotal = (toNumberOrUndefined(annualKWhHousehold) || 0) + (toNumberOrUndefined(annualKWhHeating) || 0)
    const euroPerKWh = annualKWhTotal > 0 ? annualCostTotal / annualKWhTotal : 0

    setAnnCostHH(annCostHH)
    setAnnCostHeat(annCostHeat)
    setAnnualCostTotal(annualCostTotal)
    setAnnualKWhTotal(annualKWhTotal)
    setEuroPerKWh(euroPerKWh)
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro])

  // Beim Verlassen/Weiter speichern wir in den Context
  useEffect(() => {
    actions.updateConsumption({
      annualKWhHousehold: toNumberOrUndefined(annualKWhHousehold),
      monthlyCostHouseholdEuro: toNumberOrUndefined(monthlyCostHouseholdEuro),
      annualKWhHeating: toNumberOrUndefined(annualKWhHeating),
      monthlyCostHeatingEuro: toNumberOrUndefined(monthlyCostHeatingEuro),
      currentHeatingType,
      heatingAge: toNumberOrUndefined(heatingAge),
      fuelType,
      householdSize: toNumberOrUndefined(householdSize),
      homeOfficeHours: toNumberOrUndefined(homeOfficeHours),
      electricAppliances,
      zukunft_epump,
      zukunft_wallbox,
      zukunft_pool,
      zukunft_sauna,
      zukunft_klima,
      zukunft_erweiterung,
      epump_verbrauch_schaetzung: toNumberOrUndefined(epump_verbrauch_schaetzung),
      wallbox_verbrauch_schaetzung: toNumberOrUndefined(wallbox_verbrauch_schaetzung),
      pool_verbrauch_schaetzung: toNumberOrUndefined(pool_verbrauch_schaetzung),
      eigenverbrauch_maximieren,
      netzeinspeisung_begrenzen,
      backup_wichtig,
      umwelt_prioritaet
    })
  }, [
    annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro,
    currentHeatingType, heatingAge, fuelType, householdSize, homeOfficeHours, electricAppliances,
    zukunft_epump, zukunft_wallbox, zukunft_pool, zukunft_sauna, zukunft_klima, zukunft_erweiterung,
    epump_verbrauch_schaetzung, wallbox_verbrauch_schaetzung, pool_verbrauch_schaetzung,
    eigenverbrauch_maximieren, netzeinspeisung_begrenzen, backup_wichtig, umwelt_prioritaet,
    actions
  ])

  // Speichern der Daten beim Verlassen der Seite
  const handleSave = () => {
    actions.updateConsumption({
      annualKWhHousehold: toNumberOrUndefined(annualKWhHousehold),
      monthlyCostHouseholdEuro: toNumberOrUndefined(monthlyCostHouseholdEuro),
      annualKWhHeating: toNumberOrUndefined(annualKWhHeating),
      monthlyCostHeatingEuro: toNumberOrUndefined(monthlyCostHeatingEuro),
      annualKWhOther: toNumberOrUndefined(annualKWhOther),
      monthlyCostOtherEuro: toNumberOrUndefined(monthlyCostOtherEuro),
      currentHeatingType,
      heatingAge: toNumberOrUndefined(heatingAge),
      fuelType,
      householdSize: toNumberOrUndefined(householdSize),
      homeOfficeHours: toNumberOrUndefined(homeOfficeHours),
      electricAppliances,
      zukunft_epump,
      zukunft_wallbox,
      zukunft_pool,
      zukunft_sauna,
      zukunft_klima,
      zukunft_erweiterung,
      epump_verbrauch_schaetzung: toNumberOrUndefined(epump_verbrauch_schaetzung),
      wallbox_verbrauch_schaetzung: toNumberOrUndefined(wallbox_verbrauch_schaetzung),
      pool_verbrauch_schaetzung: toNumberOrUndefined(pool_verbrauch_schaetzung),
      eigenverbrauch_maximieren,
      netzeinspeisung_begrenzen,
      backup_wichtig,
      umwelt_prioritaet,
    })
  }

  // Auto-Save bei wichtigen Änderungen
  useEffect(() => {
    if (annualKWhHousehold || monthlyCostHouseholdEuro) {
      handleSave()
    }
  }, [annualKWhHousehold, monthlyCostHouseholdEuro, annualKWhHeating, monthlyCostHeatingEuro, annualKWhOther, monthlyCostOtherEuro])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">⚡ Bedarfsanalyse</h1>
        <p className="text-slate-600">Analysieren Sie Ihren Stromverbrauch und planen Sie für die Zukunft</p>
      </div>

      {/* Quick-Start Verbrauchseingabe */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Ihr aktueller Stromverbrauch</h2>
        <p className="text-blue-700 mb-6">Geben Sie Ihren Jahresverbrauch und monatliche Kosten ein. Wir berechnen automatisch Ihren Strompreis und Einsparpotential.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jahresverbrauch */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jährlicher Stromverbrauch (kWh) *
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={annualKWhHousehold} 
                onChange={(e) => setAnnualKWhHousehold(e.target.value)} 
                placeholder="z.B. 4500"
                required
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">kWh/Jahr</div>
            </div>
            
            {/* Smart-Hilfen */}
            {!annualKWhHousehold && analysisData.estimatedConsumption > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  💡 <strong>Intelligente Schätzung:</strong> ~{formatGermanKWh(analysisData.estimatedConsumption)} für Ihren Haushalt
                </div>
                <button 
                  className="text-xs text-blue-600 hover:underline mt-1"
                  onClick={() => setAnnualKWhHousehold(analysisData.estimatedConsumption.toString())}
                >
                  Schätzung übernehmen
                </button>
              </div>
            )}
            
            {/* Verbrauchskategorien-Hilfe */}
            <div className="mt-3 text-xs text-slate-500">
              <div>Richtewerte:</div>
              <div>• 1-2 Personen: 1.500-3.000 kWh</div>
              <div>• 3-4 Personen: 3.000-5.000 kWh</div>
              <div>• 5+ Personen: 5.000+ kWh</div>
            </div>
          </div>

          {/* Monatliche Kosten */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monatliche Stromkosten (€) *
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={monthlyCostHouseholdEuro} 
                onChange={(e) => setMonthlyCostHouseholdEuro(e.target.value)} 
                placeholder="z.B. 120"
                required
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">€/Monat</div>
            </div>
            
            {/* Strompreis-Anzeige */}
            {analysisData.electricityPrice > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <div className="text-sm text-green-800">
                  ⚡ <strong>Ihr Strompreis:</strong> {formatGermanElectricityPrice(analysisData.electricityPrice)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Jährliche Kosten: {formatGermanCurrency(analysisData.totalAnnualCost, 0)}
                </div>
              </div>
            )}
            
            {/* Durchschnitts-Info */}
            <div className="mt-3 text-xs text-slate-500">
              <div>Deutschland Durchschnitt: 0,35 €/kWh</div>
              <div>Typische Bandbreite: 0,28-0,45 €/kWh</div>
            </div>
          </div>
        </div>

        {/* Live-Berechnungs-Dashboard */}
        {(annualKWhHousehold || monthlyCostHouseholdEuro || annualKWhHeating || monthlyCostHeatingEuro || annualKWhOther || monthlyCostOtherEuro) && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-3">🧮 Live-Analyse</h4>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-lg font-bold text-blue-600">{formatGermanKWh(analysisData.totalConsumption)}</div>
                <div className="text-xs text-slate-600">pro Jahr Gesamt</div>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <div className="text-lg font-bold text-green-600">{formatGermanCurrency(analysisData.totalAnnualCost, 0)}</div>
                <div className="text-xs text-slate-600">pro Jahr</div>
              </div>
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <div className="text-lg font-bold text-orange-600">⌀ {formatGermanElectricityPrice(analysisData.electricityPrice)}</div>
                <div className="text-xs text-slate-600">Durchschnitt</div>
              </div>
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <div className="text-lg font-bold text-purple-600">{formatGermanCurrency(analysisData.potentialSavings, 0)}</div>
                <div className="text-xs text-slate-600">Sparpotential</div>
              </div>
            </div>
            
            {/* Kategorie und Empfehlungen */}
            <div className="mt-4 text-center">
              <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                {analysisData.consumptionCategory}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optionale Heizungs-Stromkosten */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-orange-800 mb-4">🔥 Heizungs-Stromverbrauch (optional)</h2>
        <p className="text-orange-700 mb-6">Falls Sie eine elektrische Heizung oder Wärmepumpe haben, tragen Sie hier die zusätzlichen Kosten ein.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Heizung Jahresverbrauch */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jährlicher Stromverbrauch Heizung (kWh)
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={annualKWhHeating} 
                onChange={(e) => setAnnualKWhHeating(e.target.value)} 
                placeholder="z.B. 3000"
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">kWh/Jahr</div>
            </div>
            
            {/* Einzelpreis-Anzeige */}
            {analysisData.heatingElectricityPrice > 0 && (
              <div className="mt-3 p-3 bg-orange-50 rounded border border-orange-200">
                <div className="text-sm text-orange-800">
                  🔥 <strong>Heizstrom-Tarif:</strong> {formatGermanElectricityPrice(analysisData.heatingElectricityPrice)}
                </div>
              </div>
            )}
          </div>

          {/* Heizung Monatliche Kosten */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monatliche Heizstrom-Kosten (€)
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={monthlyCostHeatingEuro} 
                onChange={(e) => setMonthlyCostHeatingEuro(e.target.value)} 
                placeholder="z.B. 80"
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">€/Monat</div>
            </div>
            
            <div className="mt-3 text-xs text-slate-500">
              <div>Heizstrom-Tarife: meist 0,25-0,35 €/kWh</div>
              <div>Wärmepumpe: typisch 2.000-4.000 kWh/Jahr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optionale Sonstige Stromkosten */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">⚡ Sonstiger Stromverbrauch (optional)</h2>
        <p className="text-purple-700 mb-6">E-Auto, Pool, Werkstatt oder andere große Stromverbraucher separat erfassen.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sonstiges Jahresverbrauch */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jährlicher sonstiger Stromverbrauch (kWh)
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={annualKWhOther} 
                onChange={(e) => setAnnualKWhOther(e.target.value)} 
                placeholder="z.B. 2500"
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">kWh/Jahr</div>
            </div>
            
            {/* Einzelpreis-Anzeige */}
            {analysisData.otherElectricityPrice > 0 && (
              <div className="mt-3 p-3 bg-purple-50 rounded border border-purple-200">
                <div className="text-sm text-purple-800">
                  ⚡ <strong>Sonstiger Tarif:</strong> {formatGermanElectricityPrice(analysisData.otherElectricityPrice)}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-xs text-slate-500">
              <div>Beispiele:</div>
              <div>• E-Auto: 2.000-3.500 kWh/Jahr</div>
              <div>• Pool: 1.000-2.500 kWh/Jahr</div>
              <div>• Werkstatt: 500-1.500 kWh/Jahr</div>
            </div>
          </div>

          {/* Sonstiges Monatliche Kosten */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monatliche Kosten sonstiger Verbrauch (€)
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-3 text-lg font-medium" 
                value={monthlyCostOtherEuro} 
                onChange={(e) => setMonthlyCostOtherEuro(e.target.value)} 
                placeholder="z.B. 60"
              />
              <div className="absolute right-3 top-3 text-slate-500 font-medium">€/Monat</div>
            </div>
            
            <div className="mt-3 text-xs text-slate-500">
              <div>Spezial-Tarife möglich:</div>
              <div>• Nachtstrom: 0,20-0,28 €/kWh</div>
              <div>• Gewerbestrom: 0,25-0,40 €/kWh</div>
            </div>
          </div>
        </div>
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
        backTo="/project/customer"
        nextTo="/project/building"
        nextDisabled={!requiredOk}
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
