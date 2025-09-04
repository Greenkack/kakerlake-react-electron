import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ProjectProvider } from "../../state/project";
import { WizardProvider } from "../../state/wizard";
import { useProject } from "../../state/project";
import FooterNav from "../../components/FooterNav";

// Import der echten Projekt-Komponenten
import ModeSelect from "./ModeSelect";
import CustomerForm from "./CustomerForm";
import BuildingData from "./BuildingData";
import DemandAnalysisNew from "./DemandAnalysisNew";
import NeedsAnalysis from "./NeedsAnalysis";
import AdditionalOptions from "./AdditionalOptions";
import Results from "../Results";

function ProjectHeader() {
  const { actions } = useProject();
  
  const handleClearAll = () => {
    if (confirm('Alle eingegebenen Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      actions.reset();
      alert('Alle Projektdaten wurden gelöscht!');
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">🏗️ Projekt-Assistent</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm font-medium transition-colors flex items-center gap-2"
              title="Alle eingegebenen Daten löschen"
            >
              🗑️ Alle Daten löschen
            </button>
            <Link 
              to="/home" 
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors flex items-center gap-2"
            >
              🏠 Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectWizard(): JSX.Element {
  return (
    <ProjectProvider>
      <WizardProvider>
        <div className="min-h-screen bg-slate-50">
          {/* Header mit Home-Button und Clear-Button */}
          <ProjectHeader />
          
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <Routes>
              {/* Projekt-Startseite -> Mode Selection */}
              <Route index element={<Navigate to="mode" replace />} />
              
              {/* Wizard Schritte */}
              <Route path="mode" element={<ModeSelect />} />
              <Route path="customer" element={<CustomerForm />} />
              <Route path="building" element={<BuildingData />} />
              <Route path="demand" element={<DemandAnalysisNew />} />
              <Route path="needs" element={<NeedsAnalysis />} />
              <Route path="options" element={<AdditionalOptions />} />
              <Route path="results" element={<Results />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="mode" replace />} />
            </Routes>
          </div>
          
          {/* Footer Navigation */}
          <FooterNav />
        </div>
      </WizardProvider>
    </ProjectProvider>
  );
}
