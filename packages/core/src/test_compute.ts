// DEF: kleiner Konsolen-Test für computePVFlow (passt zu den neuen Typen/Exports)
import { computePVFlow, type ProjectBasics, type PVSetup, type Tariffs } from './index'

// Beispiel-Eingaben (deine echten Werte kommen später aus UI/DB/PVGIS):
const basics: ProjectBasics = {
  annualConsumptionHouseholdKWh: 3500,
  // annualConsumptionHeatingKWh: 0, // optional
  tariffEuroPerKWh: 0.27,
}

const setup: PVSetup = {
  modules: 20,
  moduleWp: 440,
  batteryCapacityKWh: 6.6,
}

const tariffs: Tariffs = {
  feedInEuroPerKWh: 0.0786,
}

// computePVFlow erwartet EIN Objekt (PVFlowInput)
const res = computePVFlow({
  basics,
  setup,
  tariffs,
  // Overrides nur zum Test, damit fixe Zahlen aus deiner Beschreibung entstehen:
  annualProductionOverrideKWh: 9077,
  directUseOverrideKWh: 2633,
})

function euro(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n)
}

console.log('kWp:', res.kWp.toFixed(2))
console.log('Produktion (kWh):', res.annualProductionKWh)
console.log('Direktverbrauch (kWh):', res.directUseKWh)
console.log('→ Speicher geladen (kWh):', res.toBatteryKWh)
console.log('← aus Speicher genutzt (kWh):', res.fromBatteryKWh)
console.log('Speicher-Überschuss (kWh):', res.batterySurplusKWh)
console.log('Netzeinspeisung aus Produktion (kWh):', res.feedInFromProductionKWh)
console.log('Netto-Export gesamt (kWh):', res.gridExportTotalKWh)
console.log('Ersparnis Direktverbrauch:', euro(res.savingsDirectEuro))
console.log('Ersparnis Speichernutzung:', euro(res.savingsFromBatteryEuro))
console.log('Einnahmen Einspeisung:', euro(res.revenueFeedInEuro))
console.log('Einnahmen Batterie-Export:', euro(res.revenueBatteryExportEuro))
console.log('Summe/Jahr:', euro(res.totalAnnualBenefitEuro))
