/**
 * Erweiterte PV-Berechnungsalgorithmen (TypeScript)
 * ================================================
 * 
 * TypeScript-Äquivalente der umfassenden Python PV-Berechnungen.
 * Portiert aus pv_calculations_core.py für die React/Electron-App.
 * 
 * Kategorien:
 * - Grundberechnungen (Ertrag, Eigenverbrauch, Autarkie)
 * - Wirtschaftlichkeit (ROI, NPV, Amortisation)
 * - Technische Analysen (Performance Ratio, Wirkungsgrade)
 * - Speicherberechnungen
 * - Umwelt/Nachhaltigkeit (CO2-Bilanz)
 * - Finanzierung/Steuern
 */

// =============================================================================
// TYPDEFINITIONEN
// =============================================================================

export interface PvCalculationInput {
  // Basis PV-System
  pv_power_kwp: number;
  annual_production_kwh: number;
  annual_consumption_kwh: number;
  self_consumption_kwh: number;
  
  // Wirtschaftlich
  investment_costs_eur: number;
  electricity_price_eur_kwh: number;
  feed_in_tariff_eur_kwh: number;
  
  // Optional
  storage_capacity_kwh?: number;
  module_power_wp?: number;
  module_area_m2?: number;
  inverter_power_kw?: number;
  customer_type?: string;
  
  // Erweiterte Parameter
  simulation_years?: number;
  discount_rate?: number;
  electricity_price_increase_rate?: number;
}

export interface PvCalculationResult {
  // Grundkennzahlen
  self_consumption_rate_percent: number;
  autarky_degree_percent: number;
  specific_yield_kwh_kwp: number;
  performance_ratio?: number;
  
  // Wirtschaftlichkeit
  annual_savings_eur: number;
  payback_period_years: number;
  npv_eur: number;
  irr_percent: number;
  total_roi_percent: number;
  
  // Energie
  feed_in_kwh: number;
  grid_consumption_kwh: number;
  
  // Umwelt
  annual_co2_savings_kg: number;
  co2_payback_years: number;
  
  // Status
  calculation_timestamp: string;
  calculation_status: 'success' | 'error' | 'warning';
  warnings: string[];
}

export interface Co2Analysis {
  annual_co2_savings_tons: number;
  cumulative_savings: number[];
  production_emissions: number;
  carbon_payback_time: number;
  total_co2_savings: number;
  tree_equivalent: number;
  car_km_equivalent: number;
  primary_energy_saved: number;
  water_saved: number;
  years: number[];
}

export interface MonteCarloResult {
  npv_mean: number;
  npv_std: number;
  npv_lower_bound: number;
  npv_upper_bound: number;
  success_probability: number;
  var_5: number;
  simulations_count: number;
  confidence_level: number;
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  category: string;
  implementation_effort: number;
  benefit_potential: number;
  roi_improvement: number;
  cost_estimate: number;
  annual_benefit: number;
  payback: number;
  difficulty: 'Einfach' | 'Mittel' | 'Komplex';
}

export interface FinancingCalculation {
  monthly_payment: number;
  total_interest: number;
  total_cost: number;
  effective_rate: number;
  duration_months: number;
}

// =============================================================================
// KONSTANTEN
// =============================================================================

const LIFESPAN_YEARS = 25;
const DISCOUNT_RATE = 0.04;
const CO2_EMISSIONS_GRID_KWH = 0.474; // kg CO2 pro kWh
const CO2_EMBODIED_PV_KWP = 50; // kg CO2 pro kWp

// =============================================================================
// HILFSFUNKTIONEN
// =============================================================================

const safe = (value: unknown, def = 0): number => {
  const n = Number(value);
  return isFinite(n) && !isNaN(n) ? n : def;
};

const safeDivide = (numerator: number, denominator: number, fallback = 0): number => {
  if (denominator === 0) {
    return numerator !== 0 ? Infinity : fallback;
  }
  return numerator / denominator;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// =============================================================================
// GRUNDBERECHNUNGEN
// =============================================================================

export const calculateAnnualEnergyYield = (
  pvPowerKwp: number,
  specificYieldKwhPerKwp: number = 950
): number => {
  return safe(pvPowerKwp) * safe(specificYieldKwhPerKwp, 950);
};

export const calculateSelfConsumptionQuote = (
  selfConsumedKwh: number,
  totalGenerationKwh: number
): number => {
  const selfConsumed = safe(selfConsumedKwh);
  const totalGen = safe(totalGenerationKwh);
  
  return totalGen === 0 ? 0 : (selfConsumed / totalGen) * 100;
};

export const calculateAutarkyDegree = (
  selfConsumedKwh: number,
  totalConsumptionKwh: number
): number => {
  const selfConsumed = safe(selfConsumedKwh);
  const totalCons = safe(totalConsumptionKwh);
  
  return totalCons === 0 ? 0 : Math.min(100, (selfConsumed / totalCons) * 100);
};

export const calculateSpecificYield = (
  annualYieldKwh: number,
  pvPowerKwp: number
): number => {
  return safeDivide(safe(annualYieldKwh), safe(pvPowerKwp), 0);
};

export const calculatePerformanceRatio = (
  actualYieldKwh: number,
  globalRadiationKwhPerM2: number,
  pvAreaM2: number
): number => {
  const actualYield = safe(actualYieldKwh);
  const radiation = safe(globalRadiationKwhPerM2, 1000);
  const area = safe(pvAreaM2, 1);
  
  const theoreticalYield = radiation * area;
  return safeDivide(actualYield, theoreticalYield, 0);
};

// =============================================================================
// WIRTSCHAFTLICHKEITSBERECHNUNGEN
// =============================================================================

export const calculatePaybackPeriod = (
  investmentCosts: number,
  annualSavings: number
): number => {
  return safeDivide(safe(investmentCosts), safe(annualSavings), Infinity);
};

export const calculateAnnualCostSavings = (
  selfConsumedKwh: number,
  electricityPrice: number
): number => {
  return safe(selfConsumedKwh) * safe(electricityPrice, 0.30);
};

export const calculateFeedInTariffRevenue = (
  feedInKwh: number,
  feedInRateEur: number
): number => {
  return safe(feedInKwh) * safe(feedInRateEur, 0.08);
};

export const calculateNetPresentValue = (
  investment: number,
  annualSavings: number,
  years: number = LIFESPAN_YEARS,
  discountRate: number = DISCOUNT_RATE
): number => {
  const inv = safe(investment);
  const savings = safe(annualSavings);
  const rate = safe(discountRate, DISCOUNT_RATE);
  const period = Math.max(1, Math.floor(safe(years, LIFESPAN_YEARS)));
  
  if (rate === 0) {
    return (savings * period) - inv;
  }
  
  let npv = -inv;
  for (let year = 1; year <= period; year++) {
    npv += savings / Math.pow(1 + rate, year);
  }
  
  return npv;
};

export const calculateIRR = (
  investment: number,
  annualSavings: number,
  years: number = LIFESPAN_YEARS
): number => {
  const inv = safe(investment);
  const savings = safe(annualSavings);
  const period = Math.max(1, Math.floor(safe(years, LIFESPAN_YEARS)));
  
  if (inv <= 0 || savings <= 0) return 0;
  
  // Einfache IRR-Annäherung durch Newton-Raphson
  let rate = 0.1; // Startwert 10%
  
  for (let iteration = 0; iteration < 100; iteration++) {
    let npv = -inv;
    let derivative = 0;
    
    for (let year = 1; year <= period; year++) {
      const factor = Math.pow(1 + rate, year);
      npv += savings / factor;
      derivative -= (year * savings) / Math.pow(factor, 2);
    }
    
    if (Math.abs(npv) < 0.01) break;
    if (Math.abs(derivative) < 1e-10) break;
    
    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < 1e-8) break;
    
    rate = newRate;
    if (rate < -0.99 || rate > 10) break; // Plausibilitätsgrenzen
  }
  
  return Math.max(0, rate * 100);
};

export const calculateTotalROI = (
  investment: number,
  annualSavings: number,
  years: number = LIFESPAN_YEARS
): number => {
  const inv = safe(investment);
  const savings = safe(annualSavings);
  const period = Math.max(1, Math.floor(safe(years, LIFESPAN_YEARS)));
  
  if (inv <= 0) return 0;
  
  const totalProfit = (savings * period) - inv;
  return (totalProfit / inv) * 100;
};

// =============================================================================
// SPEICHERBERECHNUNGEN
// =============================================================================

export const calculateStorageCoverageDegree = (
  storedSelfConsumptionKwh: number,
  totalSelfConsumptionKwh: number
): number => {
  const stored = safe(storedSelfConsumptionKwh);
  const total = safe(totalSelfConsumptionKwh);
  
  return safeDivide(stored * 100, total, 0);
};

export const calculateOptimalStorageSize = (
  dailyConsumptionKwh: number,
  lossesPercent: number = 10
): number => {
  const dailyCons = safe(dailyConsumptionKwh);
  const losses = clamp(safe(lossesPercent, 10), 0, 50);
  
  return dailyCons * (1 - losses / 100);
};

export const calculateEmergencyPowerCapacity = (
  storageKwh: number,
  usableCapacityPercent: number = 80
): number => {
  const storage = safe(storageKwh);
  const usable = clamp(safe(usableCapacityPercent, 80), 0, 100);
  
  return storage * (usable / 100);
};

// =============================================================================
// UMWELT- UND NACHHALTIGKEITSBERECHNUNGEN
// =============================================================================

export const calculateCo2Savings = (
  annualYieldKwh: number,
  co2FactorKgPerKwh: number = CO2_EMISSIONS_GRID_KWH
): number => {
  return safe(annualYieldKwh) * safe(co2FactorKgPerKwh, CO2_EMISSIONS_GRID_KWH);
};

export const calculateCo2PaybackTime = (
  pvSizeKwp: number,
  annualProductionKwh: number
): number => {
  const pvSize = safe(pvSizeKwp);
  const annualProd = safe(annualProductionKwh);
  
  const totalEmbodiedCo2 = pvSize * CO2_EMBODIED_PV_KWP;
  const annualCo2Savings = annualProd * CO2_EMISSIONS_GRID_KWH;
  
  return safeDivide(totalEmbodiedCo2, annualCo2Savings, Infinity);
};

export const calculateDetailedCo2Analysis = (
  annualProductionKwh: number,
  systemKwp: number,
  years: number = LIFESPAN_YEARS
): Co2Analysis => {
  const annualProd = safe(annualProductionKwh, 10000);
  const systemSize = safe(systemKwp, 10);
  const period = Math.max(1, Math.floor(safe(years, LIFESPAN_YEARS)));
  
  // Jährliche CO2-Einsparung
  const annualCo2SavingsKg = calculateCo2Savings(annualProd);
  const annualCo2SavingsTons = annualCo2SavingsKg / 1000;
  
  // Kumulierte Einsparung über Jahre
  const yearsList = Array.from({length: period}, (_, i) => i + 1);
  const cumulativeSavings = yearsList.map(year => annualCo2SavingsTons * year);
  
  // Produktionsemissionen
  const productionEmissions = systemSize * CO2_EMBODIED_PV_KWP / 1000; // Tonnen
  
  // CO2-Amortisationszeit
  const carbonPaybackTime = calculateCo2PaybackTime(systemSize, annualProd);
  
  // Gesamte Netto-CO2-Einsparung
  const totalCo2Savings = annualCo2SavingsTons * period - productionEmissions;
  
  // Äquivalente
  const treeEquivalent = Math.round(totalCo2Savings * 47); // ~22 kg CO2/Jahr pro Baum
  const carKmEquivalent = Math.round(totalCo2Savings * 1000 / 0.12); // 120g/km
  
  // Weitere Umweltaspekte
  const primaryEnergySaved = Math.round(annualProd * period * 2.8); // kWh Primärenergie
  const waterSaved = Math.round(annualProd * period * 1.2); // Liter Wasser
  
  return {
    annual_co2_savings_tons: Math.round(annualCo2SavingsTons * 100) / 100,
    cumulative_savings: cumulativeSavings.map(x => Math.round(x * 100) / 100),
    production_emissions: Math.round(productionEmissions * 100) / 100,
    carbon_payback_time: Math.round(carbonPaybackTime * 10) / 10,
    total_co2_savings: Math.round(totalCo2Savings * 100) / 100,
    tree_equivalent: treeEquivalent,
    car_km_equivalent: carKmEquivalent,
    primary_energy_saved: primaryEnergySaved,
    water_saved: waterSaved,
    years: yearsList
  };
};

// =============================================================================
// TECHNISCHE ANALYSEN
// =============================================================================

export const calculatePvModuleEfficiency = (
  modulePowerWp: number,
  moduleAreaM2: number
): number => {
  const power = safe(modulePowerWp);
  const area = safe(moduleAreaM2, 1);
  
  if (area === 0) return 0;
  
  // 1000 W/m² Einstrahlung unter STC
  const efficiency = (power / (area * 1000)) * 100;
  return clamp(efficiency, 0, 100);
};

export const calculateDcAcOversizingFactor = (
  pvPowerKwp: number,
  inverterPowerKw: number
): number => {
  return safeDivide(safe(pvPowerKwp), safe(inverterPowerKw), Infinity);
};

// =============================================================================
// FINANZIERUNGSBERECHNUNGEN
// =============================================================================

export const calculateAnnuity = (
  principal: number,
  annualInterestRate: number,
  durationYears: number
): FinancingCalculation => {
  const principalVal = safe(principal);
  const interestRate = safe(annualInterestRate);
  const duration = Math.max(1, Math.floor(safe(durationYears)));
  
  if (principalVal <= 0) {
    throw new Error("Ungültiger Darlehensbetrag");
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = duration * 12;
  
  let monthlyPayment: number;
  let totalInterest: number;
  
  if (monthlyRate === 0) { // Zinsfrei
    monthlyPayment = principalVal / numPayments;
    totalInterest = 0;
  } else {
    // Annuitätenformel
    const q = 1 + monthlyRate;
    monthlyPayment = principalVal * (monthlyRate * Math.pow(q, numPayments)) / (Math.pow(q, numPayments) - 1);
    totalInterest = (monthlyPayment * numPayments) - principalVal;
  }
  
  return {
    monthly_payment: Math.round(monthlyPayment * 100) / 100,
    total_interest: Math.round(totalInterest * 100) / 100,
    total_cost: Math.round((principalVal + totalInterest) * 100) / 100,
    effective_rate: Math.round(interestRate * 100) / 100,
    duration_months: numPayments
  };
};

export const calculateLeasingCosts = (
  totalInvestment: number,
  leasingFactor: number,
  durationMonths: number,
  residualValuePercent: number = 1
): any => {
  const investment = safe(totalInvestment);
  const factor = safe(leasingFactor);
  const duration = Math.max(1, Math.floor(safe(durationMonths)));
  const residual = safe(residualValuePercent, 1);
  
  if (investment <= 0 || factor <= 0) {
    throw new Error("Ungültige Parameter");
  }
  
  const monthlyRate = investment * (factor / 100);
  const totalCosts = monthlyRate * duration;
  const residualValue = investment * (residual / 100);
  const effectiveCosts = totalCosts - residualValue;
  
  return {
    monthly_rate: Math.round(monthlyRate * 100) / 100,
    total_costs: Math.round(totalCosts * 100) / 100,
    residual_value: Math.round(residualValue * 100) / 100,
    effective_costs: Math.round(effectiveCosts * 100) / 100,
    cost_advantage_vs_purchase: Math.round((investment - effectiveCosts) * 100) / 100
  };
};

// =============================================================================
// MONTE-CARLO-SIMULATION
// =============================================================================

export const runMonteCarloSimulation = (
  baseInvestment: number,
  baseAnnualBenefit: number,
  nSimulations: number = 1000,
  confidenceLevel: number = 95
): MonteCarloResult => {
  const inv = safe(baseInvestment, 20000);
  const benefit = safe(baseAnnualBenefit, 1500);
  const simCount = Math.max(100, Math.min(10000, Math.floor(safe(nSimulations, 1000))));
  
  if (inv <= 0 || benefit <= 0) {
    throw new Error("Ungültige Basisdaten für Simulation");
  }
  
  // Einfache Pseudozufallsgenerator für deterministische Ergebnisse
  let seed = 42;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Box-Muller Transformation für Normalverteilung
  const randomNormal = (mean: number, stdDev: number) => {
    const u1 = random();
    const u2 = random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  };
  
  const npvDistribution: number[] = [];
  
  for (let i = 0; i < simCount; i++) {
    // Parameter variieren (normalverteilt)
    const investment = Math.max(0, randomNormal(inv, inv * 0.1));
    const annualBenefit = Math.max(0, randomNormal(benefit, benefit * 0.15));
    const discountRate = Math.max(0, randomNormal(0.04, 0.01));
    
    // NPV berechnen
    let npv = -investment;
    for (let year = 1; year <= LIFESPAN_YEARS; year++) {
      npv += annualBenefit / Math.pow(1 + discountRate, year);
    }
    
    npvDistribution.push(npv);
  }
  
  // Sortieren für Perzentilberechnung
  npvDistribution.sort((a, b) => a - b);
  
  // Statistiken berechnen
  const npvMean = npvDistribution.reduce((sum, val) => sum + val, 0) / simCount;
  const npvVariance = npvDistribution.reduce((sum, val) => sum + Math.pow(val - npvMean, 2), 0) / simCount;
  const npvStd = Math.sqrt(npvVariance);
  
  // Perzentile
  const getPercentile = (p: number) => {
    const index = Math.floor(p / 100 * (simCount - 1));
    return npvDistribution[Math.max(0, Math.min(simCount - 1, index))];
  };
  
  const alpha = (100 - confidenceLevel) / 2;
  const npvLower = getPercentile(alpha);
  const npvUpper = getPercentile(100 - alpha);
  const var5 = getPercentile(5);
  
  // Erfolgswahrscheinlichkeit (NPV > 0)
  const successCount = npvDistribution.filter(npv => npv > 0).length;
  const successProb = (successCount / simCount) * 100;
  
  return {
    npv_mean: Math.round(npvMean * 100) / 100,
    npv_std: Math.round(npvStd * 100) / 100,
    npv_lower_bound: Math.round(npvLower * 100) / 100,
    npv_upper_bound: Math.round(npvUpper * 100) / 100,
    var_5: Math.round(var5 * 100) / 100,
    success_probability: Math.round(successProb * 10) / 10,
    simulations_count: simCount,
    confidence_level: confidenceLevel
  };
};

// =============================================================================
// OPTIMIERUNGSVORSCHLÄGE
// =============================================================================

export const generateOptimizationSuggestions = (
  systemKwp: number,
  annualProduction: number
): OptimizationSuggestion[] => {
  const suggestions: OptimizationSuggestion[] = [
    {
      title: "Batteriespeicher erweitern",
      description: "Vergrößerung des Batteriespeichers für höheren Eigenverbrauch",
      category: "Speicher",
      implementation_effort: 30,
      benefit_potential: 400,
      roi_improvement: 1.2,
      cost_estimate: 3000,
      annual_benefit: 400,
      payback: 7.5,
      difficulty: "Einfach"
    },
    {
      title: "Leistungsoptimierer installieren",
      description: "Leistungsoptimierer für verschattete Module",
      category: "Technik",
      implementation_effort: 50,
      benefit_potential: 600,
      roi_improvement: 2.1,
      cost_estimate: 2000,
      annual_benefit: 600,
      payback: 3.3,
      difficulty: "Mittel"
    },
    {
      title: "Warmwasser-Integration",
      description: "Elektrische Warmwasserbereitung für PV-Überschuss",
      category: "Integration",
      implementation_effort: 40,
      benefit_potential: 300,
      roi_improvement: 0.8,
      cost_estimate: 1500,
      annual_benefit: 300,
      payback: 5.0,
      difficulty: "Mittel"
    },
    {
      title: "Smart Home System",
      description: "Intelligente Laststeuerung für optimalen Verbrauch",
      category: "Automatisierung",
      implementation_effort: 60,
      benefit_potential: 250,
      roi_improvement: 0.6,
      cost_estimate: 2500,
      annual_benefit: 250,
      payback: 10.0,
      difficulty: "Komplex"
    }
  ];
  
  // Nach ROI-Verbesserung sortieren
  return suggestions.sort((a, b) => b.roi_improvement - a.roi_improvement);
};

// =============================================================================
// HAUPT-BERECHNUNGSFUNKTION
// =============================================================================

export const calculateComprehensivePvAnalysis = (
  input: PvCalculationInput
): PvCalculationResult & {
  detailed_co2_analysis?: Co2Analysis;
  monte_carlo_analysis?: MonteCarloResult;
  optimization_suggestions?: OptimizationSuggestion[];
} => {
  
  const warnings: string[] = [];
  
  try {
    // Basis-Parameter validieren
    const pvPower = safe(input.pv_power_kwp, 10);
    const annualProduction = safe(input.annual_production_kwh, pvPower * 950);
    const annualConsumption = safe(input.annual_consumption_kwh, 4000);
    const selfConsumption = safe(input.self_consumption_kwh, 
      Math.min(annualProduction * 0.3, annualConsumption));
    const investmentCosts = safe(input.investment_costs_eur, 20000);
    const electricityPrice = safe(input.electricity_price_eur_kwh, 0.30);
    const feedInTariff = safe(input.feed_in_tariff_eur_kwh, 0.08);
    
    // Plausibilitätsprüfungen
    if (pvPower <= 0) warnings.push("PV-Leistung nicht angegeben");
    if (annualProduction <= 0) warnings.push("Jahresertrag nicht plausibel");
    if (investmentCosts <= 0) warnings.push("Investitionskosten nicht angegeben");
    
    // Grundberechnungen
    const selfConsumptionRate = calculateSelfConsumptionQuote(selfConsumption, annualProduction);
    const autarkyDegree = calculateAutarkyDegree(selfConsumption, annualConsumption);
    const specificYield = calculateSpecificYield(annualProduction, pvPower);
    
    // Wirtschaftlichkeit
    const feedInKwh = Math.max(0, annualProduction - selfConsumption);
    const gridConsumptionKwh = Math.max(0, annualConsumption - selfConsumption);
    const annualSavings = calculateAnnualCostSavings(selfConsumption, electricityPrice) +
                         calculateFeedInTariffRevenue(feedInKwh, feedInTariff);
    
    const paybackPeriod = calculatePaybackPeriod(investmentCosts, annualSavings);
    const npv = calculateNetPresentValue(investmentCosts, annualSavings);
    const irr = calculateIRR(investmentCosts, annualSavings);
    const totalRoi = calculateTotalROI(investmentCosts, annualSavings);
    
    // Umwelt
    const annualCo2Savings = calculateCo2Savings(annualProduction);
    const co2PaybackYears = calculateCo2PaybackTime(pvPower, annualProduction);
    
    // Performance Ratio (wenn Daten verfügbar)
    let performanceRatio: number | undefined;
    if (input.module_area_m2) {
      performanceRatio = calculatePerformanceRatio(annualProduction, 1200, input.module_area_m2);
    }
    
    // Basis-Ergebnis
    const result: PvCalculationResult = {
      self_consumption_rate_percent: Math.round(selfConsumptionRate * 10) / 10,
      autarky_degree_percent: Math.round(autarkyDegree * 10) / 10,
      specific_yield_kwh_kwp: Math.round(specificYield * 10) / 10,
      performance_ratio: performanceRatio ? Math.round(performanceRatio * 1000) / 1000 : undefined,
      annual_savings_eur: Math.round(annualSavings * 100) / 100,
      payback_period_years: Math.round(paybackPeriod * 10) / 10,
      npv_eur: Math.round(npv * 100) / 100,
      irr_percent: Math.round(irr * 10) / 10,
      total_roi_percent: Math.round(totalRoi * 10) / 10,
      feed_in_kwh: Math.round(feedInKwh),
      grid_consumption_kwh: Math.round(gridConsumptionKwh),
      annual_co2_savings_kg: Math.round(annualCo2Savings),
      co2_payback_years: Math.round(co2PaybackYears * 10) / 10,
      calculation_timestamp: new Date().toISOString(),
      calculation_status: warnings.length > 0 ? 'warning' : 'success',
      warnings: warnings
    };
    
    // Erweiterte Analysen
    const extendedResult = result as any;
    
    // Detaillierte CO2-Analyse
    extendedResult.detailed_co2_analysis = calculateDetailedCo2Analysis(
      annualProduction, pvPower
    );
    
    // Monte-Carlo-Simulation (nur bei plausiblen Daten)
    if (annualSavings > 0 && investmentCosts > 0) {
      try {
        extendedResult.monte_carlo_analysis = runMonteCarloSimulation(
          investmentCosts, annualSavings
        );
      } catch (e) {
        warnings.push("Monte-Carlo-Simulation fehlgeschlagen");
      }
    }
    
    // Optimierungsvorschläge
    extendedResult.optimization_suggestions = generateOptimizationSuggestions(
      pvPower, annualProduction
    );
    
    return extendedResult;
    
  } catch (error) {
    return {
      self_consumption_rate_percent: 0,
      autarky_degree_percent: 0,
      specific_yield_kwh_kwp: 0,
      annual_savings_eur: 0,
      payback_period_years: Infinity,
      npv_eur: 0,
      irr_percent: 0,
      total_roi_percent: 0,
      feed_in_kwh: 0,
      grid_consumption_kwh: 0,
      annual_co2_savings_kg: 0,
      co2_payback_years: Infinity,
      calculation_timestamp: new Date().toISOString(),
      calculation_status: 'error',
      warnings: [`Berechnung fehlgeschlagen: ${error}`]
    };
  }
};

// =============================================================================
// REACT HOOK FÜR INTEGRATION
// =============================================================================

import { useMemo } from 'react';

export const useAdvancedPvCalculations = (input: PvCalculationInput | null) => {
  return useMemo(() => {
    if (!input) return null;
    return calculateComprehensivePvAnalysis(input);
  }, [input]);
};

// Export aller Hauptfunktionen
export * from './pvCalculations'; // Bestehende Berechnungen
