import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ProjectProvider } from "../../state/project";
import { WizardProvider } from "../../state/wizard";

// Import der echten Projekt-Komponenten
import ModeSelect from "./ModeSelect";
import CustomerForm from "./CustomerForm";
import BuildingData from "./BuildingData";
import DemandAnalysisNew from "./DemandAnalysisNew";
import NeedsAnalysis from "./NeedsAnalysis";
import AdditionalOptions from "./AdditionalOptions";
import Results from "../Results";

export default function ProjectWizard(): JSX.Element {
  return (
    <ProjectProvider>
      <WizardProvider>
        <div className="min-h-screen bg-slate-50">
          {/* Header mit Home-Button */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto max-w-4xl px-4 py-3">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-slate-900">🏗️ Projekt-Assistent</h1>
                <Link 
                  to="/home" 
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  🏠 Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
          
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
        </div>
      </WizardProvider>
    </ProjectProvider>
  );
}
