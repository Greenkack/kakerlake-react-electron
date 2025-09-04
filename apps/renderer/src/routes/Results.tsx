import React, { useMemo } from "react";
import { useProject } from "../state/project";
import { Link } from "react-router-dom";
import WizardNav from "../components/WizardNav";
import SmartRecommendations from "../components/SmartRecommendations";
import InteractiveCalculator from "../components/InteractiveCalculator";
import { calculatePVSystem, type CalculationParams } from "../utils/calculations";
import { 
  formatGermanNumber, 
  formatGermanCurrency, 
  formatGermanInteger, 
  formatGermanKWh, 
  formatGermanKWp,
  formatGermanElectricityPrice,
  formatGermanPercent 
} from "../utils/germanFormat";

export default function Results(): JSX.Element {
  const { state } = useProject();
  const { mode, customer: c, building, consumption, options } = state;

  // Erweiterte Live-Berechnungen basierend auf den echten eingegebenen Daten
  const calculations = useMemo(() => {
    // Berechnungsparameter aus echten Formulardaten zusammenstellen
    const params: CalculationParams = {
      // System-Parameter aus Building Data
      systemSize: building.roofArea ? Math.min(building.roofArea * 0.15, 20) : 10, // kWp basierend auf Dachfläche
      modulePower: 440, // Wp
      orientation: building.roofOrientation || "Süd",
      tilt: building.roofTilt || 30,
      location: c.bundesland || "Deutschland",
      
      // Verbrauchsdaten aus Consumption Analysis
      annualConsumption: consumption.annualKWhHousehold || 4000, // kWh
      daytimeConsumption: consumption.homeOfficeHours ? 
        Math.min(0.6, 0.3 + (consumption.homeOfficeHours / 8) * 0.3) : 0.4,
      
      // Speicher aus Options
      hasBattery: options.battery_interest || false,
      batterySize: options.battery_size_preference === "small" ? 5 :
                   options.battery_size_preference === "medium" ? 10 :
                   options.battery_size_preference === "large" ? 15 :
                   options.battery_size_preference === "very_large" ? 20 : 10,
      
      // Wärmepumpe aus Options
      hasHeatPump: options.hp_interest || false,
      heatingDemand: consumption.annualKWhHeating || 0,
      
      // Wirtschaftliche Parameter
      electricityPrice: 0.35,
      feedInTariff: 0.08
    };

    return calculatePVSystem(params);
  }, [c.bundesland, building, consumption, options]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">📊 Projektergebnisse</h1>
        <p className="text-slate-600">Detaillierte Kalkulation basierend auf Ihren Eingaben</p>
      </div>

      {/* System-Übersicht */}
      <section className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-6 shadow">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">⚡ System-Übersicht</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-blue-600">{formatGermanKWp(calculations.finalSystemSize)}</div>
            <div className="text-sm text-slate-600">Anlagengröße</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-green-600">{formatGermanInteger(calculations.moduleCount)}</div>
            <div className="text-sm text-slate-600">Module (440Wp)</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-orange-600">{formatGermanPercent(calculations.roofUtilization)}</div>
            <div className="text-sm text-slate-600">Dachnutzung</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-purple-600">{formatGermanCurrency(calculations.systemCost, 0)}</div>
            <div className="text-sm text-slate-600">Investition</div>
          </div>
        </div>
      </section>

      {/* Ertrags-Übersicht */}
      <section className="rounded-xl bg-white p-6 shadow border">
        <h2 className="text-xl font-semibold mb-4">📈 Energieerträge</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">{formatGermanKWh(calculations.annualYield)}</div>
            <div className="text-sm text-slate-600">pro Jahr</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{formatGermanKWh(calculations.monthlyYield)}</div>
            <div className="text-sm text-slate-600">pro Monat</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{formatGermanKWh(calculations.dailyYield)}</div>
            <div className="text-sm text-slate-600">pro Tag</div>
          </div>
        </div>
        
        {/* Eigenverbrauch vs. Einspeisung */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">🏠 Eigenverbrauch</h4>
            <div className="flex justify-between">
              <span>Direkt verbraucht:</span>
              <span className="font-medium">{calculations.breakdown.directConsumption.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Aus Speicher:</span>
              <span className="font-medium">{calculations.breakdown.fromBattery.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Gesamt ({calculations.selfConsumptionRate.toFixed(1)}%):</span>
              <span>{calculations.selfConsumption.toLocaleString('de-DE')} kWh</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">🌐 Netzinteraktion</h4>
            <div className="flex justify-between">
              <span>Einspeisung:</span>
              <span className="font-medium">{calculations.feedIn.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Netzbezug:</span>
              <span className="font-medium">{calculations.breakdown.fromGrid.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Autarkie:</span>
              <span>{calculations.autarkyRate?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wirtschaftlichkeit */}
      <section className="rounded-xl bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 p-6 shadow">
        <h2 className="text-xl font-semibold text-green-800 mb-4">💰 Wirtschaftlichkeit</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-green-600">{calculations.annualSavings.toLocaleString('de-DE')} €</div>
            <div className="text-sm text-slate-600">Ersparnis/Jahr</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-blue-600">{calculations.paybackTime.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Jahre Amortisation</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-purple-600">{calculations.roi20Years.toLocaleString('de-DE')} €</div>
            <div className="text-sm text-slate-600">Gewinn 20 Jahre</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-orange-600">{(calculations.roi20Years / calculations.systemCost * 100).toFixed(0)}%</div>
            <div className="text-sm text-slate-600">ROI 20 Jahre</div>
          </div>
        </div>
      </section>

      {/* Umweltbeitrag */}
      <section className="rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 p-6 shadow">
        <h2 className="text-xl font-semibold text-green-800 mb-4">🌱 Umweltbeitrag</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-green-600">{calculations.co2SavingsAnnual.toLocaleString('de-DE')} kg</div>
            <div className="text-sm text-slate-600">CO₂-Einsparung/Jahr</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <div className="text-2xl font-bold text-teal-600">{(calculations.co2Savings20Years / 1000).toFixed(1)} t</div>
            <div className="text-sm text-slate-600">CO₂-Einsparung 20 Jahre</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Das entspricht ca. <strong>{Math.round(calculations.co2SavingsAnnual / 2300)} Bäumen</strong> pro Jahr
            oder <strong>{Math.round(calculations.co2SavingsAnnual / 140)} weniger Autokilometern</strong>
          </p>
        </div>
      </section>

      {/* Intelligente Empfehlungen */}
      <SmartRecommendations 
        data={{
          totalConsumption: consumption.annualKWhHousehold || 0,
          electricityPrice: 0.35,
          potentialSavings: calculations.annualSavings,
          futureConsumption: (consumption.annualKWhHousehold || 0) * 1.02,
          hasSignificantIncrease: (consumption.annualKWhHousehold || 0) > 5000,
          consumptionCategory: consumption.annualKWhHousehold && consumption.annualKWhHousehold > 5000 ? 'hoch' : 
                              consumption.annualKWhHousehold && consumption.annualKWhHousehold < 3000 ? 'niedrig' : 'mittel'
        }}
        buildingData={{
          roofArea: building.roofArea,
          roofOrientation: building.roofOrientation,
          roofTilt: building.roofTilt
        }}
      />

      {/* Interaktiver Rechner */}
      <InteractiveCalculator 
        initialSystemSize={calculations.finalSystemSize}
        annualConsumption={consumption.annualKWhHousehold || 4000}
        roofArea={building.roofArea}
      />

      {/* Projektbasis */}
      <section className="rounded-xl bg-white p-6 shadow border">
        <h2 className="text-xl font-semibold mb-4">🏗️ Projektbasis</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-slate-500 block">Anlagenmodus:</span>
            <span className="font-medium">
              {mode === "pv" ? "☀️ Photovoltaik" : mode === "hp" ? "🔥 Wärmepumpe" : mode === "both" ? "⚡ PV + Wärmepumpe" : "—"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block">Anlagentyp:</span>
            <span className="font-medium">{c.anlagentyp}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block">Einspeisetyp:</span>
            <span className="font-medium">{c.einspeisetyp}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block">Kundentyp:</span>
            <span className="font-medium">{c.kundentyp}</span>
          </div>
        </div>
      </section>

      {/* Kunde */}
      <section className="rounded-xl bg-white p-6 shadow border">
        <h2 className="text-xl font-semibold mb-4">👤 Kundendaten</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><span className="text-slate-500">Name:</span> <span className="font-medium">{`${c.titel ? c.titel + " " : ""}${c.anrede ? c.anrede + " " : ""}${c.vorname} ${c.nachname}`.trim()}</span></div>
            <div><span className="text-slate-500">E-Mail:</span> <span className="font-medium">{c.email || "—"}</span></div>
            <div><span className="text-slate-500">Telefon (Festnetz):</span> <span className="font-medium">{c.telFest || "—"}</span></div>
            <div><span className="text-slate-500">Telefon (Mobil):</span> <span className="font-medium">{c.telMobil || "—"}</span></div>
          </div>
          <div className="space-y-2">
            <div><span className="text-slate-500">Straße:</span> <span className="font-medium">{c.strasse} {c.hausnummer}</span></div>
            <div><span className="text-slate-500">Ort:</span> <span className="font-medium">{c.plz} {c.ort}</span></div>
            <div><span className="text-slate-500">Bundesland:</span> <span className="font-medium">{c.bundesland || "—"}</span></div>
            {c.anmerkung && <div><span className="text-slate-500">Anmerkung:</span> <span className="font-medium">{c.anmerkung}</span></div>}
          </div>
        </div>
      </section>

      {/* Aktionen */}
      <section className="rounded-xl bg-slate-50 border p-6">
        <h2 className="text-xl font-semibold mb-4">🚀 Nächste Schritte</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link 
            to="/pdf" 
            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-xl mb-2">📄</div>
            <div className="font-medium">PDF generieren</div>
            <div className="text-sm opacity-90">Angebot erstellen</div>
          </Link>
          <Link 
            to="/solar" 
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-xl mb-2">☀️</div>
            <div className="font-medium">Detailkalkulation</div>
            <div className="text-sm opacity-90">Solar-Rechner</div>
          </Link>
          <Link 
            to="/crm" 
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-xl mb-2">👥</div>
            <div className="font-medium">Kunde speichern</div>
            <div className="text-sm opacity-90">CRM-System</div>
          </Link>
        </div>
      </section>

      <WizardNav 
        backTo="/project/options" 
        nextTo={undefined} 
        showHome 
      />
    </div>
  );
}
