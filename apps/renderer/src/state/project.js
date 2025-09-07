import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
const ProjectContext = createContext(undefined);
const defaultCustomer = {
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
const defaultState = {
    mode: null,
    customer: defaultCustomer,
    building: {
        irradiationKWhPerKwp: function (irradiationKWhPerKwp, arg1) {
            throw new Error("Function not implemented.");
        }
    },
    consumption: {
        weightedTarifEURPerKWh: function (weightedTarifEURPerKWh, arg1) {
            throw new Error("Function not implemented.");
        },
        heatingAnnualKWh: function (heatingAnnualKWh) {
            throw new Error("Function not implemented.");
        }
    },
    options: {
        annualYieldKWh: function (annualYieldKWh) { return undefined; },
        systemSizeKWp: function (systemSizeKWp) { return undefined; },
        selfConsumptionKWh: function (selfConsumptionKWh) { return 0; },
        investmentTotal: function (investmentTotal) { return 0; },
        feedInTarifEurPerKWh: function (feedInTarifEurPerKWh, arg1) { return undefined; },
        batteryCapacityKWh: function (batteryCapacityKWh) { return undefined; },
        batteryUsableFactor: function (batteryUsableFactor, arg1) { return undefined; },
        subsidyTotal: function (subsidyTotal) { return undefined; },
        financeInterestRate: function (financeInterestRate, arg1) { return undefined; },
        inflationRate: function (inflationRate, arg1) { return undefined; },
        analysisYears: function (analysisYears, arg1) { return undefined; },
        depreciationYears: function (depreciationYears, arg1) { return undefined; },
        selfConsumptionRatePct: function (selfConsumptionRatePct) { return undefined; },
        calculatedEigenverbrauchKWh: function (calculatedEigenverbrauchKWh) { return undefined; },
        batteryCycleLife: function (batteryCycleLife, arg1) { return undefined; },
        batteryCyclesPerYear: function (batteryCyclesPerYear, arg1) { return undefined; },
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
export function ProjectProvider({ children }) {
    // Lade gespeicherte Daten aus localStorage beim Start
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem('kakerlake-project-state');
            return saved ? JSON.parse(saved) : defaultState;
        }
        catch {
            return defaultState;
        }
    });
    // Speichere Änderungen automatisch in localStorage
    useEffect(() => {
        try {
            localStorage.setItem('kakerlake-project-state', JSON.stringify(state));
        }
        catch (error) {
            console.warn('Konnte Projektdaten nicht speichern:', error);
        }
    }, [state]);
    const actions = useMemo(() => ({
        setMode: (m) => setState((s) => ({ ...s, mode: m })),
        updateCustomer: (patch) => setState((s) => ({ ...s, customer: { ...s.customer, ...patch } })),
        updateBuilding: (patch) => setState((s) => ({ ...s, building: { ...s.building, ...patch } })),
        updateConsumption: (patch) => setState((s) => ({ ...s, consumption: { ...s.consumption, ...patch } })),
        updateOptions: (patch) => setState((s) => ({ ...s, options: { ...s.options, ...patch } })),
        applyParsedAddress: (parsed) => setState((s) => ({ ...s, customer: { ...s.customer, ...parsed } })),
        reset: () => {
            setState(defaultState);
            localStorage.removeItem('kakerlake-project-state');
        },
    }), []);
    const value = useMemo(() => ({ state, actions }), [state, actions]);
    return _jsx(ProjectContext.Provider, { value: value, children: children });
}
export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx)
        throw new Error("useProject must be used within <ProjectProvider>");
    return ctx;
}
