/* DEF: Globaler Projekt-Context (Basics, Kundendaten, Verbrauch, Gebäude) – strikt typed, side-effect-frei */
import React, { createContext, useContext, useMemo, useState } from 'react'

export type SystemMode = 'pv' | 'hp' | 'pv+hp'

export interface Basics { mode: SystemMode | null }

export interface Customer {
  plantType: 'new' | 'existing' | null
  feedInType: 'partial' | 'full' | null
  customerType: 'private' | 'business' | null
  salutation: 'Herr' | 'Frau' | 'Familie' | null
  title: 'Dr.' | 'Prof.' | 'Mag.' | 'Ing.' | null
  firstName: string
  lastName: string
  street: string
  houseNo: string
  zip: string
  city: string
  email: string
  phoneFixed: string
  phoneMobile: string
  state: string
  note: string
}

export interface Consumption {
  annualKWhHousehold: number | null
  monthlyCostHouseholdEuro: number | null
  annualKWhHeating?: number | null
  monthlyCostHeatingEuro?: number | null
  annualCostTotalEuro: number | null
  annualKWhTotal: number | null
  pricePerKWhEuro: number | null
}

export interface Building {
  buildYear: string
  roofCover: string | null
  roofOrientation: string | null
  roofType: string | null
  freeAreaM2: number | null
  tiltDeg: number | null
  heightOver7m: boolean
  financingWanted: boolean
  lat?: number | null
  lon?: number | null
}

export interface ProjectState {
  basics: Basics
  customer: Customer
  consumption: Consumption
  building: Building
}

const defaultState: ProjectState = {
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
}

type ProjectContextShape = {
  state: ProjectState
  setBasics: (b: Partial<Basics>) => void
  setCustomer: (c: Partial<Customer>) => void
  setConsumption: (c: Partial<Consumption>) => void
  setBuilding: (b: Partial<Building>) => void
  reset: () => void
}

const ProjectContext = createContext<ProjectContextShape | null>(null)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProjectState>(defaultState)
  const api: ProjectContextShape = useMemo(() => ({
    state,
    setBasics: (b) => setState(s => ({ ...s, basics: { ...s.basics, ...b }})),
    setCustomer: (c) => setState(s => ({ ...s, customer: { ...s.customer, ...c }})),
    setConsumption: (c) => setState(s => ({ ...s, consumption: { ...s.consumption, ...c }})),
    setBuilding: (b) => setState(s => ({ ...s, building: { ...s.building, ...b }})),
    reset: () => setState(defaultState),
  }), [state])

  return <ProjectContext.Provider value={api}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used inside <ProjectProvider>')
  return ctx
}
