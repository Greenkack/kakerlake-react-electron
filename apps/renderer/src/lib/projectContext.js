import { jsx as _jsx } from "react/jsx-runtime";
/* DEF: Globaler Projekt-Context (Basics, Kundendaten, Verbrauch, Gebäude) – strikt typed, side-effect-frei */
import { createContext, useContext, useMemo, useState } from 'react';
const defaultState = {
    basics: { mode: null },
    customer: {
        plantType: null,
        feedInType: null,
        customerType: null,
        salutation: null,
        title: null,
        firstName: '',
        lastName: '',
        street: '',
        houseNo: '',
        zip: '',
        city: '',
        email: '',
        phoneFixed: '',
        phoneMobile: '',
        state: '',
        note: '',
    },
    consumption: {
        annualKWhHousehold: null,
        monthlyCostHouseholdEuro: null,
        annualKWhHeating: null,
        monthlyCostHeatingEuro: null,
        annualCostTotalEuro: null,
        annualKWhTotal: null,
        pricePerKWhEuro: null,
    },
    building: {
        buildYear: '',
        roofCover: null,
        roofOrientation: null,
        roofType: null,
        freeAreaM2: null,
        tiltDeg: null,
        heightOver7m: false,
        financingWanted: false,
        lat: null,
        lon: null,
    },
};
const ProjectContext = createContext(null);
export function ProjectProvider({ children }) {
    const [state, setState] = useState(defaultState);
    const api = useMemo(() => ({
        state,
        setBasics: (b) => setState(s => ({ ...s, basics: { ...s.basics, ...b } })),
        setCustomer: (c) => setState(s => ({ ...s, customer: { ...s.customer, ...c } })),
        setConsumption: (c) => setState(s => ({ ...s, consumption: { ...s.consumption, ...c } })),
        setBuilding: (b) => setState(s => ({ ...s, building: { ...s.building, ...b } })),
        reset: () => setState(defaultState),
    }), [state]);
    return _jsx(ProjectContext.Provider, { value: api, children: children });
}
export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx)
        throw new Error('useProject must be used inside <ProjectProvider>');
    return ctx;
}
