import React, { useMemo } from "react";
import { useProject } from "../state/project";
import { Link } from "react-router-dom";
import WizardNav from "../components/WizardNav";
import SmartRecommendations from "../components/SmartRecommendations";
import InteractiveCalculator from "../components/InteractiveCalculator";
import { calculatePVSystem, type CalculationParams } from "../utils/calculations";
import { usePvCalculations } from "../utils/pvCalculations";
import { 
  formatGermanNumber, 
  formatGermanCurrency, 
  formatGermanInteger, 
  formatGermanKWh, 
  formatGermanKWp,
  formatGermanElectricityPrice,
  formatGermanPercent 
} from "../utils/germanFormat";

// PrimeReact Components
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';

// PrimeReact Kpi component for displaying KPIs
function Kpi({ label, value, severity = 'info' }: { label: string; value: React.ReactNode; severity?: 'success' | 'info' | 'warning' | 'danger' }) {
  return (
    <Card className="text-center h-full">
      <div className="text-2xl font-bold text-primary mb-2">{value}</div>
      <Tag severity={severity} value={label} className="text-xs" />
    </Card>
  );
}

export default function Results(): JSX.Element {
  const { state } = useProject();
  const { mode, customer: c, building, consumption, options } = state;
  const { input, results } = usePvCalculations();

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
    <div className="p-4">
      <Card className="mb-4">
        <h1 className="text-4xl font-bold text-primary mb-3">📊 Projektergebnisse</h1>
        <p className="text-600">Detaillierte Kalkulation basierend auf Ihren Eingaben</p>
      </Card>

      {/* System-Übersicht */}
      <Panel header="⚡ System-Übersicht" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Anlagengröße" 
              value={formatGermanKWp(calculations.finalSystemSize)}
              severity="info"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Module (440Wp)" 
              value={formatGermanInteger(calculations.moduleCount)}
              severity="success"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Dachnutzung" 
              value={formatGermanPercent(calculations.roofUtilization)}
              severity="warning"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Investition" 
              value={formatGermanCurrency(calculations.systemCost, 0)}
              severity="danger"
            />
          </div>
        </div>
      </Panel>

      {/* Ertrags-Übersicht */}
      <Panel header="📈 Energieerträge" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4 p-2">
            <Kpi 
              label="pro Jahr" 
              value={formatGermanKWh(calculations.annualYield)}
              severity="success"
            />
          </div>
          <div className="col-12 md:col-4 p-2">
            <Kpi 
              label="pro Monat" 
              value={formatGermanKWh(calculations.monthlyYield)}
              severity="info"
            />
          </div>
          <div className="col-12 md:col-4 p-2">
            <Kpi 
              label="pro Tag" 
              value={formatGermanKWh(calculations.dailyYield)}
              severity="warning"
            />
          </div>
        </div>

        
        {/* Eigenverbrauch vs. Einspeisung */}
        <div className="grid">
          <div className="col-12 md:col-6 p-3">
            <h4 className="font-medium mb-3">🏠 Eigenverbrauch</h4>
            <div className="flex justify-content-between mb-2">
              <span>Direkt verbraucht:</span>
              <span className="font-medium">{calculations.breakdown.directConsumption.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-content-between mb-2">
              <span>Aus Speicher:</span>
              <span className="font-medium">{calculations.breakdown.fromBattery.toLocaleString('de-DE')} kWh</span>
            </div>
            <Divider />
            <div className="flex justify-content-between font-bold">
              <span>Gesamt ({calculations.selfConsumptionRate.toFixed(1)}%):</span>
              <span>{calculations.selfConsumption.toLocaleString('de-DE')} kWh</span>
            </div>
          </div>
          <div className="col-12 md:col-6 p-3">
            <h4 className="font-medium mb-3">� Netzinteraktion</h4>
            <div className="flex justify-content-between mb-2">
              <span>Einspeisung:</span>
              <span className="font-medium">{calculations.feedIn.toLocaleString('de-DE')} kWh</span>
            </div>
            <div className="flex justify-content-between mb-2">
              <span>Netzbezug:</span>
              <span className="font-medium">{calculations.breakdown.fromGrid.toLocaleString('de-DE')} kWh</span>
            </div>
            <Divider />
            <div className="flex justify-content-between font-bold">
              <span>Autarkie:</span>
              <span>{calculations.autarkyRate?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Erweiterte Wirtschaftlichkeits-Kennzahlen */}
      <Panel header="💹 Erweiterte Wirtschaftlichkeits-Kennzahlen" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Autarkiegrad" value={formatGermanPercent(results.autarkiegrad_prozent ?? 0)} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Jährliche Ersparnis" value={formatGermanCurrency(results.jahres_ersparnis_eur ?? 0)} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Break-Even (Jahr)" value={results.break_even_jahr ?? "—"} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="PV-Strompreis" value={formatGermanNumber(results.pv_strompreis_ct_kwh ?? 0, 2) + " ct/kWh"} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Speichergrad" value={formatGermanPercent(results.speichergrad_prozent ?? 0)} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Notstrom Kapazität / Tag" value={formatGermanNumber(results.notstrom_kapazitaet_kwh_tag ?? 0, 2) + " kWh"} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Restwert nach Laufzeit" value={formatGermanCurrency(results.restwert_nach_laufzeit_eur ?? 0)} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Inflationsbereinigter Wert (20J)" value={formatGermanCurrency(results.inflationsbereinigter_wert_20a_eur ?? 0)} />
          </div>
          <div className="col-12 md:col-4 lg:col-3 p-2">
            <Kpi label="Lineare AfA / Jahr" value={formatGermanCurrency(results.afa_linear_jahr_eur ?? 0)} />
          </div>
        </div>
      </Panel>

      {/* Wirtschaftlichkeit */}
      <Panel header="💰 Wirtschaftlichkeit" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Ersparnis/Jahr" 
              value={`${calculations.annualSavings.toLocaleString('de-DE')} €`}
              severity="success"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Jahre Amortisation" 
              value={calculations.paybackTime.toFixed(1)}
              severity="info"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="Gewinn 20 Jahre" 
              value={`${calculations.roi20Years.toLocaleString('de-DE')} €`}
              severity="success"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <Kpi 
              label="ROI 20 Jahre" 
              value={`${(calculations.roi20Years / calculations.systemCost * 100).toFixed(0)}%`}
              severity="warning"
            />
          </div>
        </div>
      </Panel>

      {/* Umweltbeitrag */}
      <Panel header="🌱 Umweltbeitrag" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 p-2">
            <Kpi 
              label="CO₂-Einsparung/Jahr" 
              value={`${calculations.co2SavingsAnnual.toLocaleString('de-DE')} kg`}
              severity="success"
            />
          </div>
          <div className="col-12 md:col-6 p-2">
            <Kpi 
              label="CO₂-Einsparung 20 Jahre" 
              value={`${(calculations.co2Savings20Years / 1000).toFixed(1)} t`}
              severity="success"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-600">
            Das entspricht ca. <strong>{Math.round(calculations.co2SavingsAnnual / 2300)} Bäumen</strong> pro Jahr
            oder <strong>{Math.round(calculations.co2SavingsAnnual / 140)} weniger Autokilometern</strong>
          </p>
        </div>
      </Panel>

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
      <Panel header="🏗️ Projektbasis" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <div className="mb-2">
              <span className="text-500 block text-sm">Anlagenmodus:</span>
              <span className="font-medium">
                {mode === "pv" ? "☀️ Photovoltaik" : mode === "hp" ? "🔥 Wärmepumpe" : mode === "both" ? "⚡ PV + Wärmepumpe" : "—"}
              </span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <div className="mb-2">
              <span className="text-500 block text-sm">Anlagentyp:</span>
              <span className="font-medium">{c.anlagentyp}</span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <div className="mb-2">
              <span className="text-500 block text-sm">Einspeisetyp:</span>
              <span className="font-medium">{c.einspeisetyp}</span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 p-2">
            <div className="mb-2">
              <span className="text-500 block text-sm">Kundentyp:</span>
              <span className="font-medium">{c.kundentyp}</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Kunde */}
      <Panel header="👤 Kundendaten" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 p-2">
            <div className="mb-2">
              <span className="text-500 text-sm">Name:</span> 
              <span className="font-medium ml-2">{`${c.titel ? c.titel + " " : ""}${c.anrede ? c.anrede + " " : ""}${c.vorname} ${c.nachname}`.trim()}</span>
            </div>
            <div className="mb-2">
              <span className="text-500 text-sm">E-Mail:</span> 
              <span className="font-medium ml-2">{c.email || "—"}</span>
            </div>
            <div className="mb-2">
              <span className="text-500 text-sm">Telefon (Festnetz):</span> 
              <span className="font-medium ml-2">{c.telFest || "—"}</span>
            </div>
            <div className="mb-2">
              <span className="text-500 text-sm">Telefon (Mobil):</span> 
              <span className="font-medium ml-2">{c.telMobil || "—"}</span>
            </div>
          </div>
          <div className="col-12 md:col-6 p-2">
            <div className="mb-2">
              <span className="text-500 text-sm">Straße:</span> 
              <span className="font-medium ml-2">{c.strasse} {c.hausnummer}</span>
            </div>
            <div className="mb-2">
              <span className="text-500 text-sm">Ort:</span> 
              <span className="font-medium ml-2">{c.plz} {c.ort}</span>
            </div>
            <div className="mb-2">
              <span className="text-500 text-sm">Bundesland:</span> 
              <span className="font-medium ml-2">{c.bundesland || "—"}</span>
            </div>
            {c.anmerkung && (
              <div className="mb-2">
                <span className="text-500 text-sm">Anmerkung:</span> 
                <span className="font-medium ml-2">{c.anmerkung}</span>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* Aktionen */}
      <Panel header="🚀 Nächste Schritte" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4 p-2">
            <Link to="/pdf">
              <Button 
                label="📄 PDF generieren" 
                className="w-full p-3"
                severity="secondary"
              />
            </Link>
          </div>
          <div className="col-12 md:col-4 p-2">
            <Link to="/solar">
              <Button 
                label="☀️ Detailkalkulation" 
                className="w-full p-3"
                severity="success"
              />
            </Link>
          </div>
          <div className="col-12 md:col-4 p-2">
            <Link to="/crm">
              <Button 
                label="👥 Kunde speichern" 
                className="w-full p-3"
                severity="info"
              />
            </Link>
          </div>
        </div>
      </Panel>

      <WizardNav 
        backTo="/project/options" 
        nextTo={undefined} 
        showHome 
      />
    </div>
  );
}
