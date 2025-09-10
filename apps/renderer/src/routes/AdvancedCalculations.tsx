import React from 'react';
import PdfConfiguration from '../components/PdfConfiguration';
import ScenarioCalculation from '../components/ScenarioCalculation';
import { useDynamicData } from '../lib/dynamicDataSystem';
import { WorkflowProvider, WorkflowProgress, WorkflowNavigation } from '../lib/workflowIntegration';
import { ModernCard, ModernButton } from '../components/ModernUI_PrimeReact';
import { ResponsiveGrid, ResponsiveContainer } from '../components/ResponsiveLayout_PrimeReact';

const AdvancedCalculations: React.FC = () => {
  const { exportForPdf } = useDynamicData();
  const [activeTab, setActiveTab] = React.useState<'scenarios' | 'pdf' | 'workflow'>('scenarios');

  const handleScenarioChange = (scenarios: any[]) => {
    console.log('Szenarien aktualisiert:', scenarios);
  };

  const handlePdfConfigChange = (config: any) => {
    console.log('PDF-Konfiguration aktualisiert:', config);
  };

  return (
    <div className="modern-page-wrapper">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Erweiterte Berechnungen & PDF-Konfiguration
            </h1>
            <p className="text-gray-600 mt-2">
              Verwalten Sie Szenarien und konfigurieren Sie die PDF-Ausgabe mit vollständiger Kontrolle über alle Datenelemente.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scenarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Szenario-Berechnungen
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pdf'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                PDF-Konfiguration
              </button>
              <button
                onClick={() => setActiveTab('workflow')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'workflow'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Workflow Management
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <ScenarioCalculation onScenarioChange={handleScenarioChange} />
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-6">
              <PdfConfiguration onConfigChange={handlePdfConfigChange} />
            </div>
          )}

          {activeTab === 'workflow' && (
            <WorkflowProvider workflowType="pv_project">
              <ResponsiveContainer size="xl">
                <ResponsiveGrid cols={1} gap="lg">
                  
                  {/* Workflow Progress */}
                  <ModernCard 
                    title="Projekt-Workflow" 
                    subtitle="Verfolgen Sie den Fortschritt Ihres PV-Projekts"
                    variant="elevated"
                    size="lg"
                  >
                    <WorkflowProgress 
                      orientation="horizontal"
                      className="mb-6"
                    />
                    
                    {/* Workflow Actions */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Aktuelle Aufgaben</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModernCard variant="outlined" size="sm">
                          <div className="flex items-center gap-3">
                            <i className="pi pi-user text-blue-500 text-xl"></i>
                            <div>
                              <h4 className="font-medium">Kundendaten</h4>
                              <p className="text-sm text-gray-600">Erfassen Sie die Kundeninformationen</p>
                            </div>
                          </div>
                        </ModernCard>
                        
                        <ModernCard variant="outlined" size="sm">
                          <div className="flex items-center gap-3">
                            <i className="pi pi-home text-orange-500 text-xl"></i>
                            <div>
                              <h4 className="font-medium">Gebäudedaten</h4>
                              <p className="text-sm text-gray-600">Analysieren Sie das Gebäude</p>
                            </div>
                          </div>
                        </ModernCard>
                        
                        <ModernCard variant="outlined" size="sm">
                          <div className="flex items-center gap-3">
                            <i className="pi pi-bolt text-yellow-500 text-xl"></i>
                            <div>
                              <h4 className="font-medium">PV-Auslegung</h4>
                              <p className="text-sm text-gray-600">Konfigurieren Sie die Anlage</p>
                            </div>
                          </div>
                        </ModernCard>
                        
                        <ModernCard variant="outlined" size="sm">
                          <div className="flex items-center gap-3">
                            <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                            <div>
                              <h4 className="font-medium">Angebot</h4>
                              <p className="text-sm text-gray-600">Erstellen Sie das finale Angebot</p>
                            </div>
                          </div>
                        </ModernCard>
                      </div>
                    </div>
                  </ModernCard>
                  
                  {/* Workflow Navigation */}
                  <ModernCard title="Navigation" variant="subtle" size="md">
                    <WorkflowNavigation className="flex justify-between items-center" />
                  </ModernCard>
                  
                </ResponsiveGrid>
              </ResponsiveContainer>
            </WorkflowProvider>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-gray-100 border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Szenario-Berechnungen</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Erstellen Sie verschiedene Berechnungsszenarien für PV-Anlagen</li>
                  <li>• Vergleichen Sie ROI, Amortisation und Umwelt-Kennzahlen</li>
                  <li>• Alle Berechnungen werden automatisch in das dynamische Datensystem integriert</li>
                  <li>• Cashflow-Analyse über die gesamte Anlagenlebensdauer</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">PDF-Konfiguration</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Individuell wählbare Datenelemente für die PDF-Ausgabe</li>
                  <li>• Byte-genaue Kontrolle über Inhaltsgröße</li>
                  <li>• Kategorisierte Übersicht aller verfügbaren Daten</li>
                  <li>• Prioritäts- und Typ-basierte Filterung</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculations;
