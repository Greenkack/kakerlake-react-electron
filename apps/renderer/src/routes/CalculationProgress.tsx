import React, { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Timeline } from 'primereact/timeline';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import CalculationDashboard from "../components/CalculationDashboard";
import CalculationResults from "../components/CalculationResults";
import LivePricing from "../components/LivePricing";

export default function CalculationProgress(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calculationResults, setCalculationResults] = useState(null);

  const steps = [
    {
      id: 1,
      title: 'Konfiguration validieren',
      icon: 'pi-check-circle',
      description: 'System-Einstellungen und Daten prüfen'
    },
    {
      id: 2,
      title: 'Python-Bridge aktivieren',
      icon: 'pi-sync',
      description: 'Verbindung zu Berechnungsmodul herstellen'
    },
    {
      id: 3,
      title: 'Berechnungen durchführen',
      icon: 'pi-calculator',
      description: 'PV-Anlagen-Berechnungen und Simulationen'
    },
    {
      id: 4,
      title: 'Ergebnisse aufbereiten',
      icon: 'pi-chart-line',
      description: 'Charts und KPIs generieren'
    },
    {
      id: 5,
      title: 'Live-Pricing aktivieren',
      icon: 'pi-money-bill',
      description: 'Interaktive Preismodifikationen bereitstellen'
    }
  ];

  // Simulation des Berechnungsfortschritts
  useEffect(() => {
    if (isCalculating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            setIsCalculating(false);
            setCurrentStep(4);
            return 100;
          }
          return newProgress;
        });
        
        setCurrentStep(prev => {
          const step = Math.floor(progress / 20);
          return Math.min(step, 4);
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isCalculating, progress]);

  const startCalculation = () => {
    setIsCalculating(true);
    setProgress(0);
    setCurrentStep(0);
  };

  const timelineEvents = steps.map((step, index) => ({
    status: index <= currentStep ? 'Abgeschlossen' : index === currentStep + 1 ? 'Aktiv' : 'Ausstehend',
    date: index <= currentStep ? new Date().toLocaleTimeString() : '',
    icon: step.icon,
    color: index <= currentStep ? '#10b981' : index === currentStep + 1 ? '#3b82f6' : '#6b7280',
    title: step.title,
    description: step.description
  }));

  const customizedMarker = (item: any) => (
    <span 
      className={`flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1 ${
        item.color === '#10b981' ? 'bg-green-500' : 
        item.color === '#3b82f6' ? 'bg-blue-500' : 'bg-gray-400'
      }`}
    >
      <i className={`pi ${item.icon}`}></i>
    </span>
  );

  const customizedContent = (item: any) => (
    <Card className="mt-3 shadow-1">
      <div className="flex justify-content-between align-items-start">
        <div>
          <h6 className="mt-0 mb-1">{item.title}</h6>
          <p className="text-600 text-sm">{item.description}</p>
        </div>
        <div className="text-right">
          <Badge 
            value={item.status} 
            severity={
              item.status === 'Abgeschlossen' ? 'success' : 
              item.status === 'Aktiv' ? 'info' : 'secondary'
            }
          />
          {item.date && <p className="text-xs text-500 mt-1">{item.date}</p>}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex align-items-center justify-content-center gap-2">
            <i className="pi pi-cog pi-spin" />
            Berechnungs-Pipeline
          </h1>
          <p className="text-blue-100 text-lg">
            Verfolgen Sie den Fortschritt Ihrer PV-Berechnungen in Echtzeit
          </p>
        </div>
      </Card>

      {/* System Dashboard Integration */}
      <Card title="📊 System-Status" className="w-full">
        <CalculationDashboard />
      </Card>

      {/* Berechnungsfortschritt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline */}
        <Card title="🔄 Pipeline-Status" className="w-full">
          <Timeline 
            value={timelineEvents} 
            align="left" 
            className="customized-timeline"
            marker={customizedMarker} 
            content={customizedContent} 
          />
        </Card>

        {/* Fortschrittsbalken und Steuerung */}
        <Card title="⚡ Berechnungssteuerung" className="w-full">
          <div className="space-y-4">
            {/* Gesamtfortschritt */}
            <Panel header="Fortschritt" className="w-full">
              <div className="flex align-items-center gap-3 mb-3">
                <div className="flex-1">
                  <ProgressBar 
                    value={progress} 
                    className="h-1rem"
                    pt={{
                      value: { 
                        className: progress === 100 ? 'bg-green-400' : 'bg-blue-400'
                      }
                    }}
                  />
                </div>
                <Badge 
                  value={`${Math.round(progress)}%`}
                  severity={progress === 100 ? "success" : progress >= 50 ? "info" : "warning"}
                />
              </div>
              
              <div className="flex justify-content-between text-sm">
                <span className="text-600">
                  Schritt {currentStep + 1} von {steps.length}
                </span>
                <Chip 
                  label={steps[currentStep]?.title || 'Bereit'}
                  className="p-chip-outlined"
                />
              </div>
            </Panel>

            {/* Aktionen */}
            <Panel header="Aktionen" className="w-full">
              <div className="flex flex-column gap-3">
                {!isCalculating && progress < 100 && (
                  <Button 
                    label="Berechnungen starten"
                    icon="pi pi-play"
                    onClick={startCalculation}
                    className="p-button-success"
                  />
                )}

                {isCalculating && (
                  <div className="flex align-items-center gap-2">
                    <Button 
                      label="Läuft..."
                      icon="pi pi-spinner pi-spin"
                      disabled
                      className="flex-1"
                    />
                  </div>
                )}

                {progress === 100 && (
                  <>
                    <Message 
                      severity="success" 
                      text="✅ Berechnungen erfolgreich abgeschlossen!"
                    />
                    <Button 
                      label="Ergebnisse anzeigen"
                      icon="pi pi-eye"
                      className="p-button-outlined"
                    />
                    <Button 
                      label="Neu berechnen"
                      icon="pi pi-refresh"
                      onClick={() => {
                        setProgress(0);
                        setCurrentStep(0);
                      }}
                      className="p-button-text"
                    />
                  </>
                )}
              </div>
            </Panel>

            {/* Status-Details */}
            {isCalculating && (
              <Panel header="Details" className="w-full">
                <div className="space-y-2">
                  {steps.slice(0, currentStep + 2).map((step, index) => (
                    <div key={step.id} className="flex align-items-center gap-2">
                      {index <= currentStep ? (
                        <i className="pi pi-check text-green-600" />
                      ) : index === currentStep + 1 ? (
                        <i className="pi pi-spinner pi-spin text-blue-600" />
                      ) : (
                        <i className="pi pi-clock text-gray-400" />
                      )}
                      <span className={`text-sm ${
                        index <= currentStep ? 'text-green-700' : 
                        index === currentStep + 1 ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </Card>
      </div>

      {/* Ergebnisse anzeigen wenn fertig */}
      {progress === 100 && calculationResults && (
        <>
          <Card title="📈 Berechnungsergebnisse" className="w-full">
            <CalculationResults results={calculationResults} />
          </Card>

          <Card title="💰 Live-Preismodifikation" className="w-full">
            <LivePricing baseResults={calculationResults} />
          </Card>
        </>
      )}

      {progress === 100 && !calculationResults && (
        <Card title="📊 Berechnungen abgeschlossen" className="w-full">
          <Message 
            severity="info" 
            text="Berechnungen wurden erfolgreich durchgeführt. Ergebnisse werden im Hauptmodul angezeigt."
          />
          <div className="mt-3">
            <Button 
              label="Zu den Ergebnissen"
              icon="pi pi-arrow-right"
              onClick={() => window.location.href = '/results'}
              className="p-button-outlined"
            />
          </div>
        </Card>
      )}

      {/* Loading Skeleton während Berechnung */}
      {isCalculating && (
        <Card title="📊 Ergebnisse werden vorbereitet..." className="w-full">
          <div className="space-y-3">
            <Skeleton width="100%" height="4rem" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Skeleton width="100%" height="8rem" />
              <Skeleton width="100%" height="8rem" />
            </div>
            <Skeleton width="100%" height="6rem" />
          </div>
        </Card>
      )}
    </div>
  );
}
