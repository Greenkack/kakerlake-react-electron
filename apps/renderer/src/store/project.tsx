// apps/renderer/src/store/project.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type { AnlagenModus } from "../../../packages/core/dist/index.js";

export type Mode = AnlagenModus; // 'pv' | 'wp' | 'pv+wp'

export type Customer = {
  anlagentyp: 'neuanlage' | 'bestandsanlage';
  einspeisetyp: 'teileinspeisung' | 'volleinspeisung';
  kundentyp: 'privat' | 'gewerblich';
  anrede: '' | 'Herr' | 'Frau' | 'Familie';
  titel: '' | 'Dr.' | 'Prof.' | 'Mag.' | 'Ing.';
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
};

export type SolarSetup = {
  modules: number;
  moduleWp: number;
  storageModel: string | null;
  kWp: number;                 // berechnet
  priceFromMatrix: number|null;// berechnet
};

type ProjectState = {
  mode: Mode;
  customer: Customer;
  solar: SolarSetup;
};

type ProjectActions = {
  setMode: (m: Mode) => void;
  updateCustomer: (patch: Partial<Customer>) => void;
  setSolar: (patch: Partial<SolarSetup>) => void;
  reset: () => void;
};

const defaultCustomer: Customer = {
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

const defaultSolar: SolarSetup = {
  modules: 20,
  moduleWp: 440,
  storageModel: null,
  kWp: 0,
  priceFromMatrix: null
};

const ProjectContext = createContext<{state: ProjectState; actions: ProjectActions} | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('pv');
  const [customer, setCustomer] = useState<Customer>(defaultCustomer);
  const [solar, setSolarState] = useState<SolarSetup>(defaultSolar);

  const actions: ProjectActions = useMemo(() => ({
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

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within <ProjectProvider>");
  return ctx;
}
