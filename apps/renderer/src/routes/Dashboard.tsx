import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Solar Calculator State Interface
interface SolarConfig {
  moduleQty: number;
  moduleBrand: string;
  moduleModel: string;
  moduleProductId: number;
  invBrand: string;
  invModel: string;
  invProductId: number;
  invQty: number;
  withStorage: boolean;
  storageBrand: string;
  storageModel: string;
  storageProductId: number;
  storageDesiredKWh: number;
  
  // Zusätzliche Komponenten
  additionalComponents: boolean;
  wallboxEnabled: boolean;
  wallboxBrand: string;
  wallboxModel: string;
  wallboxProductId: number;
  emsEnabled: boolean;
  emsBrand: string;
  emsModel: string;
  emsProductId: number;
  optimizerEnabled: boolean;
  optimizerBrand: string;
  optimizerModel: string;
  optimizerProductId: number;
  optimizerQty: number;
  carportEnabled: boolean;
  carportBrand: string;
  carportModel: string;
  carportProductId: number;
  emergencyPowerEnabled: boolean;
  emergencyPowerBrand: string;
  emergencyPowerModel: string;
  emergencyPowerProductId: number;
  animalProtectionEnabled: boolean;
  animalProtectionBrand: string;
  animalProtectionModel: string;
  animalProtectionProductId: number;
  
  otherComponentNote: string;
}

// Berechnungsergebnisse Interface
interface CalculationResults {
  // Technische Kennzahlen
  anlage_kwp: number;
  annual_pv_production_kwh: number;
  specific_yield_kwh_per_kwp: number;
  performance_ratio: number;
  
  // Energiefluss
  annual_consumption_kwh: number;
  self_consumption_kwh: number;
  self_consumption_rate_percent: number;
  autarky_rate_percent: number;
  grid_feed_in_kwh: number;
  grid_purchase_kwh: number;
  
  // Wirtschaftlichkeit
  total_investment_netto: number;
  total_investment_brutto: number;
  annual_savings_eur: number;
  annual_revenue_eur: number;
  payback_time_years: number;
  npv_25_years: number;
  irr_percent: number;
  lcoe_eur_per_kwh: number;
  
  // CO2 & Umwelt
  annual_co2_savings_kg: number;
  co2_payback_time_years: number;
  tree_equivalent: number;
  car_km_equivalent: number;
  
  // Speicher (falls vorhanden)
  storage_kwh?: number;
  storage_cycles_per_year?: number;
  storage_efficiency_percent?: number;
  
  // Wartung & Betrieb
  annual_maintenance_costs: number;
  annual_insurance_costs: number;
}

// Deutsche Formatierungsfunktionen
const formatGermanNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
};

const formatGermanCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatGermanPercent = (value: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100);
};

// KPI Karten-Komponente
function KpiCard({ title, value, unit, color = "blue", icon }: { 
  title: string; 
  value: React.ReactNode; 
  unit?: string; 
  color?: string; 
  icon: string; 
}) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200", 
    orange: "text-orange-600 bg-orange-50 border-orange-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    red: "text-red-600 bg-red-50 border-red-200"
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} mt-1`}>
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        <div className={`text-4xl opacity-20 ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Vereinfachte Fortschrittsbalken-Komponente
function ProgressBar({ label, value, maxValue, color = "blue" }: {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600", 
    purple: "bg-purple-600",
    red: "bg-red-600"
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{formatGermanNumber(value)} / {formatGermanNumber(maxValue)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Berechnungsfunktionen aus der PDF
class SolarCalculations {
  
  // 1. PV-Ertrag (kWh/Jahr)
  static calculatePvYield(pv_power_kwp: number, location: string = "Deutschland", tilt: number = 30, orientation: string = "Süd"): number {
    const base_irradiance = 1000; // kWh/m²/Jahr für Deutschland
    const orientation_factor = orientation === "Süd" ? 1.0 : orientation === "Ost" || orientation === "West" ? 0.85 : 0.7;
    const tilt_factor = tilt >= 25 && tilt <= 40 ? 1.0 : 0.9;
    const system_efficiency = 0.85; // Gesamtsystemwirkungsgrad
    
    return pv_power_kwp * base_irradiance * orientation_factor * tilt_factor * system_efficiency;
  }
  
  // 2. Eigenverbrauchsanteil (%)
  static calculateSelfConsumptionRate(annual_consumption_kwh: number, annual_pv_production_kwh: number, storage_kwh: number = 0): number {
    const base_self_consumption = Math.min(annual_consumption_kwh * 0.35, annual_pv_production_kwh * 0.6);
    const storage_boost = storage_kwh > 0 ? Math.min(storage_kwh * 300, annual_pv_production_kwh * 0.25) : 0;
    const total_self_consumption = Math.min(base_self_consumption + storage_boost, annual_consumption_kwh);
    
    return (total_self_consumption / annual_pv_production_kwh) * 100;
  }
  
  // 3. Autarkiegrad (%)
  static calculateAutarkyRate(self_consumption_kwh: number, annual_consumption_kwh: number): number {
    return (self_consumption_kwh / annual_consumption_kwh) * 100;
  }
  
  // Weitere Berechnungsfunktionen...
  static calculateLCOE(total_investment: number, annual_production_kwh: number, annual_maintenance_costs: number, years: number = 25, discount_rate: number = 3): number {
    const total_costs = total_investment + (annual_maintenance_costs * years);
    const total_production = annual_production_kwh * years;
    return total_costs / total_production;
  }
  
  static calculateNPV(total_investment: number, annual_cash_flow: number, years: number = 25, discount_rate: number = 3): number {
    let npv = -total_investment;
    for (let year = 1; year <= years; year++) {
      npv += annual_cash_flow / Math.pow(1 + discount_rate / 100, year);
    }
    return npv;
  }
  
  static calculateIRR(total_investment: number, annual_cash_flow: number): number {
    return (annual_cash_flow / total_investment) * 100;
  }
  
  static calculatePaybackTime(total_investment: number, annual_savings: number): number {
    return total_investment / annual_savings;
  }
  
  static calculateSpecificYield(annual_production_kwh: number, pv_power_kwp: number): number {
    return annual_production_kwh / pv_power_kwp;
  }
  
  static calculateCO2Savings(annual_yield_kwh: number, co2_factor_kg_per_kwh: number = 0.401): number {
    return annual_yield_kwh * co2_factor_kg_per_kwh;
  }
  
  static calculatePerformanceRatio(actual_yield_kwh: number, theoretical_yield_kwh: number): number {
    return (actual_yield_kwh / theoretical_yield_kwh) * 100;
  }
  
  static calculateCO2PaybackTime(pv_size_kwp: number, annual_production_kwh: number): number {
    const CO2_EMBODIED_PV_KWP = 1500; // kg CO2 pro kWp
    const CO2_EMISSIONS_GRID_KWH = 0.401; // kg CO2 pro kWh
    
    const total_embodied_co2 = pv_size_kwp * CO2_EMBODIED_PV_KWP;
    const annual_co2_savings_kg = annual_production_kwh * CO2_EMISSIONS_GRID_KWH;
    
    if (annual_co2_savings_kg <= 0) return 99;
    return total_embodied_co2 / annual_co2_savings_kg;
  }
  
  static calculateEnvironmentalEquivalents(total_co2_savings_kg: number) {
    return {
      tree_equivalent: Math.round(total_co2_savings_kg / 22), // 22 kg CO2/Jahr pro Baum
      car_km_equivalent: Math.round(total_co2_savings_kg * 1000 / 120), // 120g CO2/km
    };
  }
}

export default function Dashboard(): JSX.Element {
  const [config, setConfig] = useState<SolarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Lade die gespeicherte Konfiguration
    const savedConfig = localStorage.getItem('kakerlake_solar_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Fehler beim Laden der Konfiguration:', e);
      }
    }
    setLoading(false);
  }, []);
  
  // Berechnungen basierend auf der Konfiguration
  const calculationResults = useMemo((): CalculationResults | null => {
    if (!config) return null;
    
    try {
      // Annahmen und Basis-Parameter
      const moduleWattage = 440; // Watt pro Modul (Standard)
      const anlage_kwp = (config.moduleQty * moduleWattage) / 1000;
      const annual_consumption_kwh = 4000; // Standard-Haushalt
      const electricity_price_eur_per_kwh = 0.35;
      const feed_in_tariff_eur_per_kwh = 0.082;
      const investment_per_kwp = 1800; // Euro pro kWp
      
      // Grundberechnungen
      const annual_pv_production_kwh = SolarCalculations.calculatePvYield(anlage_kwp);
      const specific_yield_kwh_per_kwp = SolarCalculations.calculateSpecificYield(annual_pv_production_kwh, anlage_kwp);
      const performance_ratio = SolarCalculations.calculatePerformanceRatio(annual_pv_production_kwh, anlage_kwp * 1000);
      
      // Eigenverbrauch und Autarkie
      const self_consumption_rate_percent = SolarCalculations.calculateSelfConsumptionRate(
        annual_consumption_kwh, 
        annual_pv_production_kwh, 
        config.withStorage ? config.storageDesiredKWh : 0
      );
      const self_consumption_kwh = (annual_pv_production_kwh * self_consumption_rate_percent) / 100;
      const autarky_rate_percent = SolarCalculations.calculateAutarkyRate(self_consumption_kwh, annual_consumption_kwh);
      
      // Energieflüsse
      const grid_feed_in_kwh = annual_pv_production_kwh - self_consumption_kwh;
      const grid_purchase_kwh = annual_consumption_kwh - self_consumption_kwh;
      
      // Investitionskosten
      const pv_investment = anlage_kwp * investment_per_kwp;
      const storage_investment = config.withStorage ? config.storageDesiredKWh * 800 : 0;
      const inverter_investment = 1000;
      const installation_costs = pv_investment * 0.15;
      
      const total_investment_netto = pv_investment + storage_investment + inverter_investment + installation_costs;
      const total_investment_brutto = total_investment_netto * 1.19;
      
      // Jährliche Einsparungen und Erlöse
      const annual_savings_from_self_consumption = self_consumption_kwh * electricity_price_eur_per_kwh;
      const annual_revenue_from_feed_in = grid_feed_in_kwh * feed_in_tariff_eur_per_kwh;
      const annual_revenue_eur = annual_savings_from_self_consumption + annual_revenue_from_feed_in;
      
      // Betriebskosten
      const annual_maintenance_costs = total_investment_netto * 0.015;
      const annual_insurance_costs = total_investment_netto * 0.005;
      const annual_operating_costs = annual_maintenance_costs + annual_insurance_costs;
      
      const annual_savings_eur = annual_revenue_eur - annual_operating_costs;
      
      // Wirtschaftlichkeitskennzahlen
      const payback_time_years = SolarCalculations.calculatePaybackTime(total_investment_netto, annual_savings_eur);
      const npv_25_years = SolarCalculations.calculateNPV(total_investment_netto, annual_savings_eur, 25, 3);
      const irr_percent = SolarCalculations.calculateIRR(total_investment_netto, annual_savings_eur);
      const lcoe_eur_per_kwh = SolarCalculations.calculateLCOE(total_investment_netto, annual_pv_production_kwh, annual_operating_costs);
      
      // CO2 und Umwelt
      const annual_co2_savings_kg = SolarCalculations.calculateCO2Savings(annual_pv_production_kwh);
      const co2_payback_time_years = SolarCalculations.calculateCO2PaybackTime(anlage_kwp, annual_pv_production_kwh);
      const total_co2_savings_25_years = annual_co2_savings_kg * 25;
      const environmental_equivalents = SolarCalculations.calculateEnvironmentalEquivalents(total_co2_savings_25_years);
      
      return {
        // Technische Kennzahlen
        anlage_kwp,
        annual_pv_production_kwh,
        specific_yield_kwh_per_kwp,
        performance_ratio,
        
        // Energiefluss
        annual_consumption_kwh,
        self_consumption_kwh,
        self_consumption_rate_percent,
        autarky_rate_percent,
        grid_feed_in_kwh,
        grid_purchase_kwh,
        
        // Wirtschaftlichkeit
        total_investment_netto,
        total_investment_brutto,
        annual_savings_eur,
        annual_revenue_eur,
        payback_time_years,
        npv_25_years,
        irr_percent,
        lcoe_eur_per_kwh,
        
        // CO2 & Umwelt
        annual_co2_savings_kg,
        co2_payback_time_years,
        tree_equivalent: environmental_equivalents.tree_equivalent,
        car_km_equivalent: environmental_equivalents.car_km_equivalent,
        
        // Speicher
        storage_kwh: config.withStorage ? config.storageDesiredKWh : 0,
        storage_cycles_per_year: config.withStorage ? 300 : 0,
        storage_efficiency_percent: config.withStorage ? 95 : 0,
        
        // Wartung & Betrieb
        annual_maintenance_costs,
        annual_insurance_costs,
      };
    } catch (error) {
      console.error('Fehler bei der Berechnung:', error);
      return null;
    }
  }, [config]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }
  
  if (!config || !calculationResults) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Kein Projekt gefunden</h2>
          <p className="text-yellow-700 mb-6">
            Es wurden keine Solar-Projektdaten gefunden. Bitte erstellen Sie zuerst ein Projekt.
          </p>
          <Link
            to="/solar"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🔧 Neues Projekt erstellen
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Solar Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Detaillierte Analyse & Visualisierung - {formatGermanNumber(calculationResults.anlage_kwp)} kWp PV-Anlage
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatGermanCurrency(calculationResults.total_investment_netto)}</div>
            <div className="text-blue-200">Investitionssumme</div>
          </div>
        </div>
      </div>
      
      {/* Haupt-KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Anlagengröße" 
          value={formatGermanNumber(calculationResults.anlage_kwp)} 
          unit="kWp" 
          color="blue" 
          icon="⚡" 
        />
        <KpiCard 
          title="Jahresertrag" 
          value={formatGermanNumber(calculationResults.annual_pv_production_kwh)} 
          unit="kWh" 
          color="green" 
          icon="☀️" 
        />
        <KpiCard 
          title="Eigenverbrauch" 
          value={formatGermanPercent(calculationResults.self_consumption_rate_percent)} 
          color="orange" 
          icon="🏠" 
        />
        <KpiCard 
          title="Autarkiegrad" 
          value={formatGermanPercent(calculationResults.autarky_rate_percent)} 
          color="purple" 
          icon="🔋" 
        />
      </div>
      
      {/* Wirtschaftliche KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Amortisation" 
          value={formatGermanNumber(calculationResults.payback_time_years)} 
          unit="Jahre" 
          color="green" 
          icon="💰" 
        />
        <KpiCard 
          title="Rendite (IRR)" 
          value={formatGermanPercent(calculationResults.irr_percent)} 
          color="blue" 
          icon="📈" 
        />
        <KpiCard 
          title="CO₂-Ersparnis" 
          value={formatGermanNumber(calculationResults.annual_co2_savings_kg / 1000)} 
          unit="t/Jahr" 
          color="green" 
          icon="🌱" 
        />
        <KpiCard 
          title="Jährl. Ersparnis" 
          value={formatGermanCurrency(calculationResults.annual_savings_eur)} 
          color="green" 
          icon="💵" 
        />
      </div>
      
      {/* Energiefluss-Analyse mit Fortschrittsbalken */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-bold mb-6 text-gray-900">🔄 Energiefluss-Analyse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProgressBar 
              label="PV-Produktion"
              value={calculationResults.annual_pv_production_kwh}
              maxValue={calculationResults.annual_pv_production_kwh}
              color="blue"
            />
            <ProgressBar 
              label="Eigenverbrauch"
              value={calculationResults.self_consumption_kwh}
              maxValue={calculationResults.annual_pv_production_kwh}
              color="green"
            />
            <ProgressBar 
              label="Netzeinspeisung"
              value={calculationResults.grid_feed_in_kwh}
              maxValue={calculationResults.annual_pv_production_kwh}
              color="orange"
            />
          </div>
          <div>
            <ProgressBar 
              label="Autarkiegrad"
              value={calculationResults.autarky_rate_percent}
              maxValue={100}
              color="purple"
            />
            <ProgressBar 
              label="Eigenverbrauchsanteil"
              value={calculationResults.self_consumption_rate_percent}
              maxValue={100}
              color="green"
            />
            <ProgressBar 
              label="Performance Ratio"
              value={calculationResults.performance_ratio}
              maxValue={100}
              color="blue"
            />
          </div>
        </div>
      </div>
      
      {/* Monatliche Übersicht */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-bold mb-6 text-gray-900">📅 Monatliche Ertragsverteilung</h3>
        <div className="grid grid-cols-12 gap-2">
          {['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'].map((month, index) => {
            const factors = [0.4, 0.6, 0.9, 1.2, 1.4, 1.5, 1.6, 1.4, 1.1, 0.8, 0.5, 0.3];
            const monthlyYield = Math.round(calculationResults.annual_pv_production_kwh * factors[index] / 12);
            const heightPercentage = (factors[index] / 1.6) * 100; // 1.6 ist das Maximum (Juli)
            
            return (
              <div key={month} className="text-center">
                <div className="relative h-32 bg-gray-100 rounded mb-2 flex items-end">
                  <div 
                    className="w-full bg-blue-500 rounded transition-all duration-1000 ease-out"
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium text-gray-700">{month}</div>
                <div className="text-xs text-gray-500">{formatGermanNumber(monthlyYield)} kWh</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Detailierte Kennzahlen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Technische Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            🔧 Technische Kennzahlen
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Spez. Ertrag:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.specific_yield_kwh_per_kwp)} kWh/kWp</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Performance Ratio:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.performance_ratio)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Module Anzahl:</span>
              <span className="font-semibold">{config.moduleQty} Stück</span>
            </div>
            {config.withStorage && (
              <div className="flex justify-between">
                <span className="text-gray-600">Speicher:</span>
                <span className="font-semibold">{config.storageDesiredKWh} kWh</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Wirtschaftliche Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            💰 Wirtschaftlichkeit
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">LCOE:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.lcoe_eur_per_kwh * 100)} ct/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NPV (25J):</span>
              <span className="font-semibold">{formatGermanCurrency(calculationResults.npv_25_years)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wartungskosten:</span>
              <span className="font-semibold">{formatGermanCurrency(calculationResults.annual_maintenance_costs)}/Jahr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Versicherung:</span>
              <span className="font-semibold">{formatGermanCurrency(calculationResults.annual_insurance_costs)}/Jahr</span>
            </div>
          </div>
        </div>
        
        {/* Umwelt Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            🌱 Umweltbilanz
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">CO₂-Amortisation:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.co2_payback_time_years)} Jahre</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Entspricht Bäumen:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.tree_equivalent)} 🌳</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-km vermieden:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.car_km_equivalent)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CO₂/Jahr:</span>
              <span className="font-semibold">{formatGermanNumber(calculationResults.annual_co2_savings_kg / 1000)} t</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Aktionen */}
      <div className="flex gap-4 justify-center">
        <Link
          to="/solar"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          🔧 Konfiguration ändern
        </Link>
        
        <Link
          to="/results"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          📋 Detailbericht anzeigen
        </Link>
        
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
        >
          🖨️ Dashboard drucken
        </button>
        
        <button
          onClick={() => {
            const data = {
              config,
              results: calculationResults,
              timestamp: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `solar-dashboard-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
        >
          💾 Daten exportieren
        </button>
      </div>
    </div>
  );
}
