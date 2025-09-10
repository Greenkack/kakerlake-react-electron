import React, { useState, useMemo, useEffect, useRef } from 'react'
import { 
  formatGermanNumber, 
  formatGermanCurrency, 
  formatGermanInteger, 
  formatGermanKWh, 
  formatGermanKWp,
  formatGermanElectricityPrice,
  formatGermanPercent 
} from '../utils/germanFormat'

interface InteractiveCalculatorProps {
  initialSystemSize: number
  annualConsumption: number
  roofArea?: number
}

export default function InteractiveCalculator({ 
  initialSystemSize, 
  annualConsumption, 
  roofArea 
}: InteractiveCalculatorProps) {
  const [systemSize, setSystemSize] = useState(initialSystemSize)
  const [batterySize, setBatterySize] = useState(10)
  const [electricityPrice, setElectricityPrice] = useState(0.35)
  const [includeWallbox, setIncludeWallbox] = useState(false)
  const [includePump, setIncludePump] = useState(false)
  const autarkyBarRef = useRef<HTMLDivElement>(null)
  const selfConsumptionBarRef = useRef<HTMLDivElement>(null)

  // Update progress bars with CSS custom properties
  useEffect(() => {
    if (autarkyBarRef.current) {
      autarkyBarRef.current.style.setProperty('--progress-width', `${calculations.autarkyRate}%`)
    }
    if (selfConsumptionBarRef.current) {
      selfConsumptionBarRef.current.style.setProperty('--progress-width', `${calculations.selfConsumptionRate}%`)
    }
  }, [calculations.autarkyRate, calculations.selfConsumptionRate])

  // Berechnungen basierend auf aktuellen Einstellungen
  const calculations = useMemo(() => {
    const annualYield = systemSize * 950 // kWh pro kWp in Deutschland
    const systemCost = systemSize * 1800 + (batterySize * 800) // Systemkosten
    
    // Zusatzverbrauch
    let totalConsumption = annualConsumption
    if (includeWallbox) totalConsumption += 3000 // ~3000 kWh für E-Auto
    if (includePump) totalConsumption += 4000 // ~4000 kWh für Wärmepumpe
    
    // Eigenverbrauch berechnen (komplexere Logik)
    const baseAutarky = 0.35 + (batterySize / 50) * 0.3 // 35-65% je nach Speicher
    const autarkyRate = Math.min(0.85, baseAutarky)
    const selfConsumption = Math.min(annualYield, totalConsumption * autarkyRate)
    const gridFeedIn = Math.max(0, annualYield - selfConsumption)
    const gridConsumption = Math.max(0, totalConsumption - selfConsumption)
    
    // Wirtschaftlichkeit
    const electricitySavings = selfConsumption * electricityPrice
    const feedInRevenue = gridFeedIn * 0.08
    const annualSavings = electricitySavings + feedInRevenue
    const paybackTime = systemCost / annualSavings
    
    // CO2-Einsparungen
    const co2Savings = annualYield * 0.4 // 400g CO2/kWh
    
    return {
      annualYield,
      systemCost,
      totalConsumption,
      selfConsumption,
      gridFeedIn,
      gridConsumption,
      autarkyRate: (selfConsumption / totalConsumption) * 100,
      selfConsumptionRate: (selfConsumption / annualYield) * 100,
      annualSavings,
      paybackTime,
      co2Savings,
      electricitySavings,
      feedInRevenue
    }
  }, [systemSize, batterySize, electricityPrice, includeWallbox, includePump, annualConsumption])

  const maxSystemSize = roofArea ? Math.floor(roofArea * 0.17) : 30

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <h2 className="text-xl font-bold text-slate-800 mb-6">🧮 Interaktiver Rechner</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Eingabebereich */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-700">Konfiguration</h3>
          
          {/* PV-Anlagengröße */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              PV-Anlagengröße: {systemSize} kWp
            </label>
            <input
              type="range"
              min="3"
              max={maxSystemSize}
              step="0.5"
              value={systemSize}
              onChange={(e) => setSystemSize(parseFloat(e.target.value))}
              title={`PV-Anlagengröße: ${systemSize} kWp`}
              aria-label="PV-Anlagengröße"
              placeholder="PV-Anlagengröße"
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer pv-slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>3 kWp</span>
              <span>{maxSystemSize} kWp {roofArea && "(max für Ihr Dach)"}</span>
            </div>
          </div>

          {/* Batteriegröße */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Batteriegröße: {batterySize} kWh
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="2.5"
              value={batterySize}
              onChange={(e) => setBatterySize(parseFloat(e.target.value))}
              title={`Batteriegröße: ${batterySize} kWh`}
              aria-label="Batteriegröße"
              placeholder="Batteriegröße"
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer battery-slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0 kWh</span>
              <span>25 kWh</span>
            </div>
          </div>

          {/* Strompreis */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Strompreis: {electricityPrice.toFixed(2)} €/kWh
            </label>
            <input
              type="range"
              min="0.25"
              max="0.50"
              step="0.01"
              value={electricityPrice}
              onChange={(e) => setElectricityPrice(parseFloat(e.target.value))}
              title={`Strompreis: ${electricityPrice.toFixed(2)} €/kWh`}
              aria-label="Strompreis"
              placeholder="Strompreis"
              className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer price-slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>25 ct</span>
              <span>50 ct</span>
            </div>
          </div>

          {/* Zusatzverbraucher */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Zusätzliche Verbraucher</h4>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeWallbox}
                onChange={(e) => setIncludeWallbox(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm">🚗 Wallbox (+3.000 kWh/Jahr)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includePump}
                onChange={(e) => setIncludePump(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm">🔥 Wärmepumpe (+4.000 kWh/Jahr)</span>
            </label>
          </div>
        </div>

        {/* Ergebnisbereich */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">Live-Ergebnisse</h3>
          
          {/* Kernzahlen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {calculations.annualYield.toLocaleString('de-DE')}
              </div>
              <div className="text-sm text-slate-600">kWh Ertrag/Jahr</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {calculations.annualSavings.toLocaleString('de-DE')} €
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-700"
                  data-width={calculations.autarkyRate}
                />
              </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Autarkiegrad</span>
                <span className="text-sm font-medium">{calculations.autarkyRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  data-width={calculations.selfConsumptionRate}
                />
              </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Eigenverbrauchsquote</span>
                <span className="text-sm font-medium">{calculations.selfConsumptionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${calculations.selfConsumptionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Wirtschaftlichkeit */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Systemkosten:</span>
                <div className="font-bold">{calculations.systemCost.toLocaleString('de-DE')} €</div>
              </div>
              <div>
                <span className="text-slate-600">Amortisation:</span>
                <div className="font-bold">{calculations.paybackTime.toFixed(1)} Jahre</div>
              </div>
            </div>
      </div>

      <style jsx>{`
        .progress-bar {
          width: var(--progress-width, 0%);
        }
      `}</style>
    </div>
  )
}
              <div className="text-lg font-bold text-green-600">
                {calculations.co2Savings.toLocaleString('de-DE')} kg CO₂
              </div>
              <div className="text-sm text-slate-600">Einsparung pro Jahr</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
