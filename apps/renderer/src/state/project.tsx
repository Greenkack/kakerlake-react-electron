import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Mode = "pv" | "hp" | "both";
export type Anlagentyp = "Neuanlage" | "Bestandsanlage";
export type Einspeisetyp = "Teileinspeisung" | "Volleinspeisung";
export type Kundentyp = "Privat" | "Gewerblich";
export type Anrede = "" | "Herr" | "Frau" | "Familie";
export type Titel = "" | "Dr." | "Prof." | "Mag." | "Ing.";

export interface Customer {
  anlagentyp: Anlagentyp;
  einspeisetyp: Einspeisetyp;
  kundentyp: Kundentyp;
  anrede: Anrede;
  titel: Titel;
  vorname: string;
  nachname: string;

  adresseRaw: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;

  email: string;
  telFest: string;
  telMobil: string;
  bundesland: string;
  anmerkung: string;
}

export interface BuildingData {
  irradiationKWhPerKwp(irradiationKWhPerKwp: any, arg1: number): number | undefined;
  buildingType?: string;
  roofType?: string;
  roofOrientation?: string;
  roofTilt?: number;
  roofArea?: number;
  shadingFactors?: string;
  constructionYear?: number;
  livingSpace?: number;
  floors?: number;
  heatingSystem?: string;
  electricalConnection?: string;
}

export interface ConsumptionData {
  weightedTarifEURPerKWh(weightedTarifEURPerKWh: any, arg1: number): number;
  heatingAnnualKWh(heatingAnnualKWh: any): number | undefined;
  annualKWhHousehold?: number;
  monthlyCostHouseholdEuro?: number;
  annualKWhHeating?: number;
  monthlyCostHeatingEuro?: number;
  annualKWhOther?: number;
  monthlyCostOtherEuro?: number;
  currentHeatingType?: string;
  heatingAge?: number;
  fuelType?: string;
  householdSize?: number;
  homeOfficeHours?: number;
  electricAppliances?: string;
  zukunft_epump?: boolean;
  zukunft_wallbox?: boolean;
  zukunft_pool?: boolean;
  zukunft_sauna?: boolean;
  zukunft_klima?: boolean;
  zukunft_erweiterung?: boolean;
  
  // Verbrauchsschätzungen
  epump_verbrauch_schaetzung?: number;
  wallbox_verbrauch_schaetzung?: number;
  pool_verbrauch_schaetzung?: number;
  
  // Präferenzen
  eigenverbrauch_maximieren?: boolean;
  netzeinspeisung_begrenzen?: boolean;
  backup_wichtig?: boolean;
  umwelt_prioritaet?: boolean;
}

export interface ProjectOptions {
  annualYieldKWh(annualYieldKWh: any): unknown;
  systemSizeKWp(systemSizeKWp: any): unknown;
  selfConsumptionKWh(selfConsumptionKWh: any): number;
  investmentTotal(investmentTotal: any): number;
  feedInTarifEurPerKWh(feedInTarifEurPerKWh: any, arg1: number): number | undefined;
  batteryCapacityKWh(batteryCapacityKWh: any): number | undefined;
  batteryUsableFactor(batteryUsableFactor: any, arg1: number): number | undefined;
  subsidyTotal(subsidyTotal: any): number | undefined;
  financeInterestRate(financeInterestRate: any, arg1: number): number | undefined;
  inflationRate // Installation
      (inflationRate: any, arg1: number): number | undefined;
  analysisYears(analysisYears: any, arg1: number): number | undefined;
  // Erweiterungen
  depreciationYears(depreciationYears: any, arg1: number): number | undefined;
  selfConsumptionRatePct(selfConsumptionRatePct: any): unknown;
  calculatedEigenverbrauchKWh(calculatedEigenverbrauchKWh: any): unknown;
  batteryCycleLife(batteryCycleLife: any, arg1: number): number | undefined;
  batteryCyclesPerYear(batteryCyclesPerYear: any, arg1: number): number | undefined;
  // PV System
  pv_interest?: boolean;
  system_size_preference?: string;
  module_type_preference?: string;
  inverter_type_preference?: string;
  mounting_preference?: string;
  
  // Speicher
  battery_interest?: boolean;
  battery_size_preference?: string;
  battery_type_preference?: string;
  backup_power_desired?: boolean;
  
  // Wärmepumpe
  hp_interest?: boolean;
  hp_type_preference?: string;
  hp_size_preference?: string;
  hp_integration_timing?: string;
  
  // E-Mobilität
  ev_charging_interest?: boolean;
  wallbox_type_preference?: string;
  ev_integration_timing?: string;
  
  // Smart Home & Monitoring
  smart_home_integration?: boolean;
  monitoring_level_preference?: string;
  app_control_desired?: boolean;
  
  // Services
  maintenance_contract_interest?: boolean;
  insurance_interest?: boolean;
  financing_interest?: boolean;
  leasing_interest?: boolean;
  
  // Installation
  installation_speed_preference?: string;
  installation_team_size?: string;
  
  // Erweiterungen
  future_expansion_planned?: boolean;
  pool_heating_interest?: boolean;
  climate_control_interest?: boolean;
  
  // Sonstiges
  special_requests?: string;
  consultation_preference?: string;
}

export interface ProjectState {
  mode: Mode | null;
  customer: Customer;
  building: BuildingData;
  consumption: ConsumptionData;
  options: ProjectOptions;
}

type Actions = {
  setMode: (m: Mode) => void;
  updateCustomer: (patch: Partial<Customer>) => void;
  updateBuilding: (patch: Partial<BuildingData>) => void;
  updateConsumption: (patch: Partial<ConsumptionData>) => void;
  updateOptions: (patch: Partial<ProjectOptions>) => void;
  applyParsedAddress: (parsed: Partial<Customer>) => void;
  reset: () => void;
};

type Ctx = { state: ProjectState; actions: Actions };

const ProjectContext = createContext<Ctx | undefined>(undefined);

const defaultCustomer: Customer = {
  anlagentyp: "Neuanlage",
  einspeisetyp: "Teileinspeisung",
  kundentyp: "Privat",
  anrede: "",
  titel: "",
  vorname: "",
  nachname: "",
  adresseRaw: "",
  strasse: "",
  hausnummer: "",
  plz: "",
  ort: "",
  email: "",
  telFest: "",
  telMobil: "",
  bundesland: "",
  anmerkung: "",
};

const defaultState: ProjectState = {
  mode: null,
  customer: defaultCustomer,
  building: {
    irradiationKWhPerKwp: function(irradiationKWhPerKwp: any, arg1: number): number | undefined {
      throw new Error("Function not implemented.");
    }
  },
  consumption: {
      weightedTarifEURPerKWh: function(weightedTarifEURPerKWh: any, arg1: number): number {
          throw new Error("Function not implemented.");
      },
      heatingAnnualKWh: function(heatingAnnualKWh: any): number | undefined {
          throw new Error("Function not implemented.");
      }
  },
  options: {
    annualYieldKWh: function(annualYieldKWh: any): unknown { return undefined; },
    systemSizeKWp: function(systemSizeKWp: any): unknown { return undefined; },
    selfConsumptionKWh: function(selfConsumptionKWh: any): number { return 0; },
    investmentTotal: function(investmentTotal: any): number { return 0; },
    feedInTarifEurPerKWh: function(feedInTarifEurPerKWh: any, arg1: number): number | undefined { return undefined; },
    batteryCapacityKWh: function(batteryCapacityKWh: any): number | undefined { return undefined; },
    batteryUsableFactor: function(batteryUsableFactor: any, arg1: number): number | undefined { return undefined; },
    subsidyTotal: function(subsidyTotal: any): number | undefined { return undefined; },
    financeInterestRate: function(financeInterestRate: any, arg1: number): number | undefined { return undefined; },
    inflationRate: function(inflationRate: any, arg1: number): number | undefined { return undefined; },
    analysisYears: function(analysisYears: any, arg1: number): number | undefined { return undefined; },
    depreciationYears: function(depreciationYears: any, arg1: number): number | undefined { return undefined; },
    selfConsumptionRatePct: function(selfConsumptionRatePct: any): unknown { return undefined; },
    calculatedEigenverbrauchKWh: function(calculatedEigenverbrauchKWh: any): unknown { return undefined; },
    batteryCycleLife: function(batteryCycleLife: any, arg1: number): number | undefined { return undefined; },
    batteryCyclesPerYear: function(batteryCyclesPerYear: any, arg1: number): number | undefined { return undefined; },
    // Optional fields below
    pv_interest: undefined,
    system_size_preference: undefined,
    module_type_preference: undefined,
    inverter_type_preference: undefined,
    mounting_preference: undefined,
    battery_interest: undefined,
    battery_size_preference: undefined,
    battery_type_preference: undefined,
    backup_power_desired: undefined,
    hp_interest: undefined,
    hp_type_preference: undefined,
    hp_size_preference: undefined,
    hp_integration_timing: undefined,
    ev_charging_interest: undefined,
    wallbox_type_preference: undefined,
    ev_integration_timing: undefined,
    smart_home_integration: undefined,
    monitoring_level_preference: undefined,
    app_control_desired: undefined,
    maintenance_contract_interest: undefined,
    insurance_interest: undefined,
    financing_interest: undefined,
    leasing_interest: undefined,
    installation_speed_preference: undefined,
    installation_team_size: undefined,
    future_expansion_planned: undefined,
    pool_heating_interest: undefined,
    climate_control_interest: undefined,
    special_requests: undefined,
    consultation_preference: undefined,
  },
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  // Lade gespeicherte Daten aus localStorage beim Start
  const [state, setState] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem('kakerlake-project-state');
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Speichere Änderungen automatisch in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kakerlake-project-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Konnte Projektdaten nicht speichern:', error);
    }
  }, [state]);

  const actions = useMemo<Actions>(
    () => ({
      setMode: (m) => setState((s) => ({ ...s, mode: m })),
      updateCustomer: (patch) =>
        setState((s) => ({ ...s, customer: { ...s.customer, ...patch } })),
      updateBuilding: (patch) =>
        setState((s) => ({ ...s, building: { ...s.building, ...patch } })),
      updateConsumption: (patch) =>
        setState((s) => ({ ...s, consumption: { ...s.consumption, ...patch } })),
      updateOptions: (patch) =>
        setState((s) => ({ ...s, options: { ...s.options, ...patch } })),
      applyParsedAddress: (parsed) =>
        setState((s) => ({ ...s, customer: { ...s.customer, ...parsed } })),
      reset: () => {
        setState(defaultState);
        localStorage.removeItem('kakerlake-project-state');
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): Ctx {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within <ProjectProvider>");
  return ctx;
}
