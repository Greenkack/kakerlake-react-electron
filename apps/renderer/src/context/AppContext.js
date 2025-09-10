import { jsx as _jsx } from "react/jsx-runtime";
// apps/renderer/src/context/AppContext.tsx
// Globales State Management für die gesamte Anwendung
import { createContext, useReducer, useContext } from 'react';
const initialState = {
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
function reducer(state, action) {
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
            const newNotification = {
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
export const AppContext = createContext(null);
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (_jsx(AppContext.Provider, { value: { state, dispatch }, children: children }));
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
        setProjectData: (data) => dispatch({ type: 'SET_PROJECT_DATA', payload: data }),
        updateProjectData: (data) => dispatch({ type: 'UPDATE_PROJECT_DATA', payload: data }),
    };
};
export const useCalculationResults = () => {
    const { state, dispatch } = useAppContext();
    return {
        results: state.calculationResults,
        setResults: (results) => dispatch({ type: 'SET_CALCULATION_RESULTS', payload: results }),
    };
};
export const usePricing = () => {
    const { state, dispatch } = useAppContext();
    return {
        pricing: state.pricing,
        updatePricing: (pricing) => dispatch({ type: 'UPDATE_PRICING', payload: pricing }),
    };
};
export const useNotifications = () => {
    const { state, dispatch } = useAppContext();
    return {
        notifications: state.ui.notifications,
        addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
        removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
        clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
    };
};
export default AppContext;
