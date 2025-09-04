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
    building: {},
    consumption: {},
    options: {},
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
