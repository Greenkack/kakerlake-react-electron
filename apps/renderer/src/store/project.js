import { jsx as _jsx } from "react/jsx-runtime";
// apps/renderer/src/store/project.tsx
import { createContext, useContext, useMemo, useState } from "react";
const defaultCustomer = {
    anlagentyp: 'neuanlage',
    einspeisetyp: 'teileinspeisung',
    kundentyp: 'privat',
    anrede: '',
    titel: '',
    vorname: '',
    nachname: '',
    adresseRaw: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
    email: '',
    telFest: '',
    telMobil: '',
    bundesland: '',
    anmerkung: ''
};
const defaultSolar = {
    modules: 20,
    moduleWp: 440,
    storageModel: null,
    kWp: 0,
    priceFromMatrix: null
};
const ProjectContext = createContext(null);
export function ProjectProvider({ children }) {
    const [mode, setMode] = useState('pv');
    const [customer, setCustomer] = useState(defaultCustomer);
    const [solar, setSolarState] = useState(defaultSolar);
    const actions = useMemo(() => ({
        setMode: (m) => setMode(m),
        updateCustomer: (patch) => setCustomer(prev => ({ ...prev, ...patch })),
        setSolar: (patch) => setSolarState(prev => ({ ...prev, ...patch })),
        reset: () => {
            setMode('pv');
            setCustomer(defaultCustomer);
            setSolarState(defaultSolar);
        }
    }), []);
    const value = useMemo(() => ({ state: { mode, customer, solar }, actions }), [mode, customer, solar, actions]);
    return (_jsx(ProjectContext.Provider, { value: value, children: children }));
}
export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx)
        throw new Error("useProject must be used within <ProjectProvider>");
    return ctx;
}
