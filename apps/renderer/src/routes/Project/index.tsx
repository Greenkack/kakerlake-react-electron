import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
