// apps/renderer/src/context/AppContext.tsx
// Globales State Management für die gesamte Anwendung

import React, { createContext, useReducer, FC, Dispatch, useContext } from 'react';

// Definiere die Typen für deine Anwendungsdaten
export interface ProjectConfiguration {
  moduleQuantity?: number;
  inverterId?: string;
  batteryCapacity?: number;
  moduleType?: string;
  systemPower?: number;
  installationType?: string;
  roofOrientation?: string;
  roofTilt?: number;
  shadingFactor?: number;
  location?: string;
  customerName?: string;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  // Ergänze weitere Felder nach Bedarf
  [key: string]: any;
}

export interface AnalysisResults {
  total_investment_netto?: number;
  total_investment_brutto?: number;
  annual_pv_production_kwh?: number;
  annual_savings?: number;
  payback_years?: number;
  roi_percent?: number;
  co2_savings_annual?: number;
  einspeiseverguetung_annual?: number;
  eigenverbrauch_percent?: number;
  autarkie_grad?: number;
  // Erweiterte Ergebnisse
  monthly_production?: number[];
  yearly_cashflow?: number[];
  cost_breakdown?: any[];
  energy_balance?: any;
  [key: string]: number | string | number[] | any[] | any | undefined;
}

export interface PricingState {
  baseCost: number;
  discountPercent: number;
  surchargePercent: number;
  additionalCosts: number;
  finalPrice: number;
  finalPriceBrutto?: number;
  lastUpdated?: string;
}

export interface UIState {
  currentStep: number;
  isLoading: boolean;
  activeTab: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warn' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

interface AppState {
  projectData: ProjectConfiguration | null;
  calculationResults: AnalysisResults | null;
  pricing: PricingState;
  ui: UIState;
}

// Aktionen zur Aktualisierung des States
type Action =
  | { type: 'SET_PROJECT_DATA'; payload: ProjectConfiguration }
  | { type: 'UPDATE_PROJECT_DATA'; payload: Partial<ProjectConfiguration> }
  | { type: 'SET_CALCULATION_RESULTS'; payload: AnalysisResults }
  | { type: 'UPDATE_PRICING'; payload: Partial<PricingState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  projectData: null,
  calculationResults: null,
  pricing: {
    baseCost: 0,
    discountPercent: 0,
    surchargePercent: 0,
    additionalCosts: 0,
    finalPrice: 0,
    finalPriceBrutto: 0,
  },
  ui: {
    currentStep: 1,
    isLoading: false,
    activeTab: 'configuration',
    sidebarCollapsed: false,
    notifications: [],
  },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROJECT_DATA':
      return { ...state, projectData: action.payload };

    case 'UPDATE_PROJECT_DATA':
      return { 
        ...state, 
        projectData: { ...state.projectData, ...action.payload } 
      };

    case 'SET_CALCULATION_RESULTS':
      return { ...state, calculationResults: action.payload };

    case 'UPDATE_PRICING':
      const updatedPricing = { ...state.pricing, ...action.payload };
      // Auto-calculate final price if needed
      if ('baseCost' in action.payload || 'discountPercent' in action.payload || 'surchargePercent' in action.payload || 'additionalCosts' in action.payload) {
        const baseAfterDiscount = updatedPricing.baseCost * (1 - updatedPricing.discountPercent / 100);
        const withSurcharge = baseAfterDiscount * (1 + updatedPricing.surchargePercent / 100);
        updatedPricing.finalPrice = withSurcharge + updatedPricing.additionalCosts;
        updatedPricing.finalPriceBrutto = updatedPricing.finalPrice * 1.19; // 19% MwSt
        updatedPricing.lastUpdated = new Date().toISOString();
      }
      return { ...state, pricing: updatedPricing };

    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, isLoading: action.payload } };

    case 'SET_CURRENT_STEP':
      return { ...state, ui: { ...state.ui, currentStep: action.payload } };

    case 'SET_ACTIVE_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };

    case 'TOGGLE_SIDEBAR':
      return { 
        ...state, 
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed } 
      };

    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, newNotification],
        },
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload),
        },
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, ui: { ...state.ui, notifications: [] } };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

export const AppContext = createContext<{ 
  state: AppState; 
  dispatch: Dispatch<Action>;
} | null>(null);

export const AppProvider: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook für einfacheren Zugriff auf den Context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Spezielle Hooks für häufig verwendete State-Bereiche
export const useProjectData = () => {
  const { state, dispatch } = useAppContext();
  return {
    projectData: state.projectData,
    setProjectData: (data: ProjectConfiguration) => 
      dispatch({ type: 'SET_PROJECT_DATA', payload: data }),
    updateProjectData: (data: Partial<ProjectConfiguration>) => 
      dispatch({ type: 'UPDATE_PROJECT_DATA', payload: data }),
  };
};

export const useCalculationResults = () => {
  const { state, dispatch } = useAppContext();
  return {
    results: state.calculationResults,
    setResults: (results: AnalysisResults) => 
      dispatch({ type: 'SET_CALCULATION_RESULTS', payload: results }),
  };
};

export const usePricing = () => {
  const { state, dispatch } = useAppContext();
  return {
    pricing: state.pricing,
    updatePricing: (pricing: Partial<PricingState>) => 
      dispatch({ type: 'UPDATE_PRICING', payload: pricing }),
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useAppContext();
  return {
    notifications: state.ui.notifications,
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => 
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => 
      dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
  };
};

export default AppContext;
