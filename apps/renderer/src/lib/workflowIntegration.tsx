import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDynamicData } from '../lib/dynamicDataSystem';

import '../styles/workflow.css';

interface WorkflowStep {
  id: string;
  name: string;
  component: string;
  path: string;
  completed: boolean;
  data: Record<string, any>;
  dependencies: string[];
  optional: boolean;
}

interface WorkflowState {
  currentStep: string;
  steps: WorkflowStep[];
  progress: number;
  validationErrors: Record<string, string[]>;
}

interface WorkflowContextType {
  state: WorkflowState;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepId: string) => void;
  updateStepData: (stepId: string, data: Record<string, any>) => void;
  completeStep: (stepId: string) => void;
  validateStep: (stepId: string) => boolean;
  getStepData: (stepId: string) => Record<string, any>;
  isStepAccessible: (stepId: string) => boolean;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

// Standard-Workflows Definition
const defaultWorkflows: Record<string, WorkflowStep[]> = {
  pv_project: [
    {
      id: 'mode_select',
      name: 'Anlagenmodus auswählen',
      component: 'ModeSelect',
      path: '/project/mode',
      completed: false,
      data: {},
      dependencies: [],
      optional: false
    },
    {
      id: 'customer_data',
      name: 'Kundendaten erfassen',
      component: 'CustomerForm',
      path: '/project/customer',
      completed: false,
      data: {},
      dependencies: ['mode_select'],
      optional: false
    },
    {
      id: 'building_data',
      name: 'Gebäudedaten & Standort',
      component: 'BuildingData',
      path: '/project/building',
      completed: false,
      data: {},
      dependencies: ['customer_data'],
      optional: false
    },
    {
      id: 'demand_analysis',
      name: 'Bedarfsanalyse & Verbrauch',
      component: 'DemandAnalysis',
      path: '/project/demand',
      completed: false,
      data: {},
      dependencies: ['building_data'],
      optional: false
    },
    {
      id: 'additional_options',
      name: 'Zusatzoptionen & Konfiguration',
      component: 'AdditionalOptions',
      path: '/project/options',
      completed: false,
      data: {},
      dependencies: ['demand_analysis'],
      optional: true
    },
    {
      id: 'solar_calculation',
      name: 'Solarkalkulator & PV-Auslegung',
      component: 'SolarCalculator',
      path: '/calc/solar',
      completed: false,
      data: {},
      dependencies: ['building_data', 'demand_analysis'],
      optional: false
    },
    {
      id: 'results_review',
      name: 'Ergebnisse & Dashboard',
      component: 'Results',
      path: '/calc/results',
      completed: false,
      data: {},
      dependencies: ['solar_calculation'],
      optional: false
    }
  ]
};

interface WorkflowProviderProps {
  children: React.ReactNode;
  workflowType?: 'pv_project' | 'heatpump_project' | 'combined_project';
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  children,
  workflowType = 'pv_project'
}) => {
  const { setData, getData } = useDynamicData();
  
  const [state, setState] = useState<WorkflowState>(() => {
    // Lade gespeicherten Workflow-Zustand
    const saved = localStorage.getItem(`workflow_${workflowType}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      currentStep: defaultWorkflows[workflowType][0].id,
      steps: defaultWorkflows[workflowType],
      progress: 0,
      validationErrors: {}
    };
  });

  // Speichere Workflow-Zustand automatisch
  useEffect(() => {
    localStorage.setItem(`workflow_${workflowType}`, JSON.stringify(state));
    
    // Synchronisiere mit Dynamic Data System
    setData('workflow_state', state, {
      category: 'workflow_management',
      label: 'Workflow-Zustand',
      dataType: 'object',
      priority: 'high',
      description: 'Aktueller Zustand des Projekt-Workflows'
    });
  }, [state, workflowType, setData]);

  // Berechne Fortschritt
  useEffect(() => {
    const completedSteps = state.steps.filter(step => step.completed).length;
    const totalSteps = state.steps.filter(step => !step.optional).length;
    const progress = Math.round((completedSteps / totalSteps) * 100);
    
    if (progress !== state.progress) {
      setState(prev => ({ ...prev, progress }));
    }
  }, [state.steps, state.progress]);

  const validateStep = (stepId: string): boolean => {
    const step = state.steps.find(s => s.id === stepId);
    if (!step) return false;

    const errors: string[] = [];

    // Basis-Validierungslogik für jeden Step-Typ
    switch (stepId) {
      case 'customer_data':
        if (!step.data.vorname) errors.push('Vorname ist erforderlich');
        if (!step.data.nachname) errors.push('Nachname ist erforderlich');
        if (!step.data.adresse) errors.push('Adresse ist erforderlich');
        break;
        
      case 'building_data':
        if (!step.data.gebaeudeart) errors.push('Gebäudeart muss ausgewählt werden');
        if (!step.data.dachflaeche || step.data.dachflaeche <= 0) errors.push('Dachfläche muss größer als 0 sein');
        break;
        
      case 'demand_analysis':
        if (!step.data.jahresverbrauch || step.data.jahresverbrauch <= 0) errors.push('Jahresverbrauch muss angegeben werden');
        break;
    }

    setState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [stepId]: errors
      }
    }));

    return errors.length === 0;
  };

  const isStepAccessible = (stepId: string): boolean => {
    const step = state.steps.find(s => s.id === stepId);
    if (!step) return false;

    // Überprüfe Dependencies
    return step.dependencies.every(depId => {
      const depStep = state.steps.find(s => s.id === depId);
      return depStep?.completed || false;
    });
  };

  const nextStep = () => {
    const currentIndex = state.steps.findIndex(s => s.id === state.currentStep);
    if (currentIndex < state.steps.length - 1) {
      const nextStepId = state.steps[currentIndex + 1].id;
      if (isStepAccessible(nextStepId)) {
        setState(prev => ({ ...prev, currentStep: nextStepId }));
      }
    }
  };

  const previousStep = () => {
    const currentIndex = state.steps.findIndex(s => s.id === state.currentStep);
    if (currentIndex > 0) {
      const prevStepId = state.steps[currentIndex - 1].id;
      setState(prev => ({ ...prev, currentStep: prevStepId }));
    }
  };

  const goToStep = (stepId: string) => {
    if (isStepAccessible(stepId)) {
      setState(prev => ({ ...prev, currentStep: stepId }));
    }
  };

  const updateStepData = (stepId: string, data: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, data: { ...step.data, ...data } }
          : step
      )
    }));

    // Synchronisiere mit Dynamic Data System
    setData(`step_${stepId}_data`, data, {
      category: 'workflow_steps',
      label: `${stepId} Daten`,
      dataType: 'object',
      priority: 'medium',
      description: `Formulardaten für Workflow-Schritt ${stepId}`
    });
  };

  const completeStep = (stepId: string) => {
    if (validateStep(stepId)) {
      setState(prev => ({
        ...prev,
        steps: prev.steps.map(step =>
          step.id === stepId
            ? { ...step, completed: true }
            : step
        )
      }));
      
      // Automatisch zum nächsten Schritt wenn verfügbar
      const currentIndex = state.steps.findIndex(s => s.id === stepId);
      if (currentIndex < state.steps.length - 1) {
        const nextStepId = state.steps[currentIndex + 1].id;
        if (isStepAccessible(nextStepId)) {
          setTimeout(() => goToStep(nextStepId), 500);
        }
      }
    }
  };

  const getStepData = (stepId: string): Record<string, any> => {
    const step = state.steps.find(s => s.id === stepId);
    return step?.data || {};
  };

  const resetWorkflow = () => {
    setState({
      currentStep: defaultWorkflows[workflowType][0].id,
      steps: defaultWorkflows[workflowType],
      progress: 0,
      validationErrors: {}
    });
    localStorage.removeItem(`workflow_${workflowType}`);
  };

  const contextValue: WorkflowContextType = {
    state,
    nextStep,
    previousStep,
    goToStep,
    updateStepData,
    completeStep,
    validateStep,
    getStepData,
    isStepAccessible,
    resetWorkflow
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};

// Workflow Progress Component
interface WorkflowProgressProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  showLabels = true,
  orientation = 'horizontal',
  className = ''
}) => {
  const { state, goToStep, isStepAccessible } = useWorkflow();

  const currentStepIndex = state.steps.findIndex(s => s.id === state.currentStep);

  return (
    <div className={`${orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row'} ${className}`}>
      {/* Progress Bar */}
      <div className={`${orientation === 'vertical' ? 'w-1 h-64' : 'h-1 flex-1'} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500`}
          ref={(el) => {
            if (el) {
              const property = orientation === 'vertical' ? 'height' : 'width';
              el.style[property as any] = `${state.progress}%`;
            }
          }}
        />
      </div>

      {/* Step Indicators */}
      {showLabels && (
        <div className={`${orientation === 'vertical' ? 'ml-4 space-y-4' : 'mt-4 flex justify-between'}`}>
          {state.steps.map((step, index) => {
            const isActive = step.id === state.currentStep;
            const isCompleted = step.completed;
            const isAccessible = isStepAccessible(step.id);
            
            return (
              <div
                key={step.id}
                className={`${orientation === 'vertical' ? 'flex items-center' : 'flex flex-col items-center'} ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                onClick={() => isAccessible && goToStep(step.id)}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }
                  ${isAccessible ? 'hover:scale-110' : ''}
                `}>
                  {isCompleted ? (
                    <i className="pi pi-check text-xs"></i>
                  ) : (
                    index + 1
                  )}
                </div>
                
                <span className={`
                  ${orientation === 'vertical' ? 'ml-3' : 'mt-2'} text-xs font-medium text-center
                  ${isActive ? 'text-blue-600' : 'text-gray-600'}
                `}>
                  {step.name}
                </span>
                
                {step.optional && (
                  <span className="text-xs text-gray-400">(Optional)</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Workflow Navigation Component
interface WorkflowNavigationProps {
  className?: string;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  className = ''
}) => {
  const { state, nextStep, previousStep, completeStep, validateStep } = useWorkflow();
  
  const currentStep = state.steps.find(s => s.id === state.currentStep);
  const currentIndex = state.steps.findIndex(s => s.id === state.currentStep);
  const canGoNext = currentIndex < state.steps.length - 1;
  const canGoPrevious = currentIndex > 0;
  const hasErrors = state.validationErrors[state.currentStep]?.length > 0;

  const handleNext = () => {
    if (validateStep(state.currentStep)) {
      completeStep(state.currentStep);
      if (canGoNext) {
        nextStep();
      }
    }
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <button
        onClick={previousStep}
        disabled={!canGoPrevious}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <i className="pi pi-arrow-left mr-2"></i>
        Zurück
      </button>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Schritt {currentIndex + 1} von {state.steps.length}
        </span>
        
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            ref={(el) => {
              if (el) {
                el.style.width = `${((currentIndex + 1) / state.steps.length) * 100}%`;
              }
            }}
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!canGoNext && !hasErrors}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {canGoNext ? 'Weiter' : 'Abschließen'}
        <i className="pi pi-arrow-right ml-2"></i>
      </button>
    </div>
  );
};

export default { WorkflowProvider, useWorkflow, WorkflowProgress, WorkflowNavigation };
