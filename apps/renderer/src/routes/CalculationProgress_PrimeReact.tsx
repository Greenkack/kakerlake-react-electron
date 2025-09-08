import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Steps } from 'primereact/steps';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface CalculationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  duration: number;
}

function CalculationProgress() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<CalculationStep[]>([
    {
      id: 'modules',
      title: 'Module Analyse',
      description: 'Berechnung der PV-Module Konfiguration',
      status: 'pending',
      progress: 0,
      duration: 1000
    },
    {
      id: 'inverter',
      title: 'Wechselrichter',
      description: 'Optimale Wechselrichter Auslegung',
      status: 'pending',
      progress: 0,
      duration: 800
    },
    {
      id: 'energy',
      title: 'Energiebilanz',
      description: 'Berechnung von Ertrag und Verbrauch',
      status: 'pending',
      progress: 0,
      duration: 1500
    },
    {
      id: 'economics',
      title: 'Wirtschaftlichkeit',
      description: 'Investition und Amortisation',
      status: 'pending',
      progress: 0,
      duration: 1200
    },
    {
      id: 'environment',
      title: 'Umweltbilanz',
      description: 'CO₂-Einsparung und Nachhaltigkeit',
      status: 'pending',
      progress: 0,
      duration: 600
    }
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<any>(null);

  useEffect(() => {
    // Automatically start calculation if config is available
    const savedConfig = localStorage.getItem('kakerlake_current_config');
    if (savedConfig && !isCalculating && !isCompleted) {
      startCalculation();
    }
  }, []);

  const startCalculation = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      for (let i = 0; i < steps.length; i++) {
        // Mark current step as active
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'active' : index < i ? 'completed' : 'pending'
        })));
        
        setCurrentStepIndex(i);
        
        // Simulate step calculation with progress
        await simulateStepCalculation(i);
        
        // Mark step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending',
          progress: index === i ? 100 : step.progress
        })));
        
        // Update overall progress
        setOverallProgress(((i + 1) / steps.length) * 100);
        
        if (toast) {
          toast.show({
            severity: 'success',
            summary: 'Schritt abgeschlossen',
            detail: steps[i].title,
            life: 2000
          });
        }
      }
      
      setIsCompleted(true);
      setIsCalculating(false);
      
      // Redirect to results after short delay
      setTimeout(() => {
        navigate('/calc/results');
      }, 2000);
      
    } catch (error) {
      setError('Fehler bei der Berechnung');
      setIsCalculating(false);
      
      if (toast) {
        toast.show({
          severity: 'error',
          summary: 'Berechnungsfehler',
          detail: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
          life: 5000
        });
      }
    }
  };

  const simulateStepCalculation = (stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const step = steps[stepIndex];
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setSteps(prev => prev.map((s, i) => 
            i === stepIndex ? { ...s, progress: 100 } : s
          ));
          
          setTimeout(() => resolve(), 200);
        } else {
          setSteps(prev => prev.map((s, i) => 
            i === stepIndex ? { ...s, progress } : s
          ));
        }
      }, step.duration / 10);
    });
  };

  const resetCalculation = () => {
    setSteps(prev => prev.map(step => ({ 
      ...step, 
      status: 'pending' as const, 
      progress: 0 
    })));
    setCurrentStepIndex(0);
    setOverallProgress(0);
    setIsCalculating(false);
    setIsCompleted(false);
    setError(null);
  };

  const getStepIcon = (step: CalculationStep) => {
    switch (step.status) {
      case 'completed':
        return 'pi pi-check-circle text-green-500';
      case 'active':
        return 'pi pi-spin pi-spinner text-blue-500';
      case 'error':
        return 'pi pi-times-circle text-red-500';
      default:
        return 'pi pi-circle text-gray-400';
    }
  };

  const getStepColor = (step: CalculationStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const stepItems = steps.map((step, index) => ({
    label: step.title,
    command: () => {}
  }));

  return (
    <div className="calculation-progress p-4 fade-in">
      <Toast ref={(el) => setToast(el)} />
      <ConfirmDialog />
      
      {/* Header */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center flex-wrap gap-3 p-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 flex align-items-center gap-2">
              <i className="pi pi-calculator"></i>
              Berechnung läuft
            </h1>
            <p className="text-color-secondary">
              {isCompleted ? 'Berechnung erfolgreich abgeschlossen!' : 
               isCalculating ? 'PV-Anlage wird berechnet...' : 
               'Bereit für die Berechnung'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Abbrechen"
              icon="pi pi-times"
              className="p-button-outlined p-button-danger"
              onClick={() => navigate('/calc/solar')}
              disabled={isCompleted}
            />
            {error && (
              <Button
                label="Wiederholen"
                icon="pi pi-refresh"
                className="p-button-warning"
                onClick={resetCalculation}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Overall Progress */}
      <Panel header="📊 Gesamtfortschritt" className="mb-4">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-primary mb-2">
            {Math.round(overallProgress)}%
          </div>
          <ProgressBar 
            value={overallProgress} 
            className="h-1rem mb-3"
            color={isCompleted ? '#10b981' : isCalculating ? '#3b82f6' : '#6b7280'}
          />
          <div className="flex justify-content-between text-sm text-color-secondary">
            <span>Start</span>
            <span className={isCompleted ? 'text-green-600 font-semibold' : ''}>
              {isCompleted ? 'Fertig!' : 'In Arbeit...'}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center">
          {isCompleted ? (
            <Badge value="✅ Abgeschlossen" severity="success" className="text-lg p-2" />
          ) : isCalculating ? (
            <Badge value="⚡ Berechnung läuft" severity="info" className="text-lg p-2" />
          ) : error ? (
            <Badge value="❌ Fehler aufgetreten" severity="danger" className="text-lg p-2" />
          ) : (
            <Badge value="⏳ Bereit" severity="warning" className="text-lg p-2" />
          )}
        </div>
      </Panel>

      {/* Steps Progress */}
      <Panel header="⚙️ Berechnungsschritte" className="mb-4">
        {/* Steps Indicator */}
        <div className="mb-4">
          <Steps 
            model={stepItems} 
            activeIndex={currentStepIndex}
            readOnly={true}
            className="mb-4"
          />
        </div>

        {/* Detailed Step Progress */}
        <div className="grid">
          {steps.map((step, index) => (
            <div key={step.id} className="col-12">
              <Card className={`mb-3 ${step.status === 'active' ? 'border-primary border-2' : ''}`}>
                <div className="flex align-items-center gap-3 p-3">
                  {/* Step Icon */}
                  <div className="flex align-items-center justify-content-center w-3rem h-3rem border-round surface-100">
                    <i className={`${getStepIcon(step)} text-2xl`}></i>
                  </div>
                  
                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex justify-content-between align-items-center mb-2">
                      <h4 className={`font-semibold ${getStepColor(step)} mb-0`}>
                        {step.title}
                      </h4>
                      <span className="text-sm text-color-secondary">
                        {step.progress.toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-color-secondary text-sm mb-2">{step.description}</p>
                    
                    {/* Step Progress Bar */}
                    <ProgressBar 
                      value={step.progress} 
                      className="h-0-5rem"
                      color={
                        step.status === 'completed' ? '#10b981' : 
                        step.status === 'active' ? '#3b82f6' : 
                        step.status === 'error' ? '#ef4444' : '#d1d5db'
                      }
                    />
                  </div>

                  {/* Step Status */}
                  <div className="text-right">
                    {step.status === 'completed' && (
                      <Badge value="Fertig" severity="success" />
                    )}
                    {step.status === 'active' && (
                      <Badge value="Aktiv" severity="info" />
                    )}
                    {step.status === 'error' && (
                      <Badge value="Fehler" severity="danger" />
                    )}
                    {step.status === 'pending' && (
                      <Badge value="Wartend" severity="secondary" />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Panel>

      {/* Current Step Details */}
      {isCalculating && !isCompleted && (
        <Panel header={`🔄 Aktuell: ${steps[currentStepIndex]?.title}`} className="mb-4">
          <div className="text-center p-4">
            <i className="pi pi-spin pi-cog text-6xl text-primary mb-3"></i>
            <p className="text-xl mb-3">{steps[currentStepIndex]?.description}</p>
            <p className="text-color-secondary">
              Schritt {currentStepIndex + 1} von {steps.length}
            </p>
          </div>
        </Panel>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <Panel header="✅ Berechnung Abgeschlossen!" className="mb-4">
          <div className="text-center p-4">
            <i className="pi pi-check-circle text-8xl text-green-500 mb-4"></i>
            <h3 className="text-2xl font-bold text-success mb-3">
              Ihre PV-Anlage wurde erfolgreich berechnet!
            </h3>
            <p className="text-color-secondary mb-4">
              Alle Berechnungsschritte wurden erfolgreich abgeschlossen. 
              Sie werden automatisch zu den Ergebnissen weitergeleitet.
            </p>
            
            <Divider />
            
            <div className="flex justify-content-center gap-3 mt-4">
              <Button
                label="Zu den Ergebnissen"
                icon="pi pi-chart-bar"
                className="p-button-success p-button-lg"
                onClick={() => navigate('/calc/results')}
              />
              <Button
                label="Dashboard"
                icon="pi pi-home"
                className="p-button-outlined"
                onClick={() => navigate('/dashboard')}
              />
            </div>
          </div>
        </Panel>
      )}

      {/* Error Screen */}
      {error && (
        <Panel header="❌ Berechnungsfehler" className="mb-4">
          <div className="text-center p-4">
            <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-bold text-red-600 mb-3">Fehler bei der Berechnung</h3>
            <p className="text-color-secondary mb-4">{error}</p>
            
            <div className="flex justify-content-center gap-3">
              <Button
                label="Erneut versuchen"
                icon="pi pi-refresh"
                className="p-button-warning"
                onClick={() => {
                  resetCalculation();
                  startCalculation();
                }}
              />
              <Button
                label="Zurück zur Konfiguration"
                icon="pi pi-arrow-left"
                className="p-button-outlined"
                onClick={() => navigate('/calc/solar')}
              />
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default CalculationProgress;
