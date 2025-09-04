// apps/renderer/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

import { ProjectProvider } from "./state/project";
import { WizardProvider } from "./state/wizard";

// Project Routes
import ModeSelect from "./routes/Project/ModeSelect";
import CustomerForm from "./routes/Project/CustomerForm";
import BuildingData from "./routes/Project/BuildingData";
import DemandAnalysis from "./routes/Project/DemandAnalysis";
import NeedsAnalysis from "./routes/Project/NeedsAnalysis";
import AdditionalOptions from "./routes/Project/AdditionalOptions";

// Calc Routes
import CalcMenu from "./routes/Calc/Menu";
import SolarCalculator from "./routes/SolarCalculator";
import HeatpumpSimulator from "./routes/HeatpumpSimulator";
import Results from "./routes/Results";

// PDF Routes
import PdfHub from "./routes/PdfHub";

// CRM Routes
import CRMMenu from "./routes/CRM/Menu";

// Planning Routes
import PlanningMenu from "./routes/Planning/Menu";
import Documents from "./routes/Documents";

// Admin Routes
import AdminLogin from "./routes/Admin/Login";
import PriceMatrixImport from "./routes/Admin/PriceMatrixImport";

// Other Routes
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WizardProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<Home />} />
            
            {/* Project Routes */}
            <Route path="project/mode" element={<ModeSelect />} />
            <Route path="project/customer" element={<CustomerForm />} />
            <Route path="project/building" element={<BuildingData />} />
            <Route path="project/demand" element={<DemandAnalysis />} />
            <Route path="project/needs" element={<NeedsAnalysis />} />
            <Route path="project/options" element={<AdditionalOptions />} />

            {/* Calculation Routes */}
            <Route path="calc" element={<CalcMenu />} />
            <Route path="calc/solar" element={<SolarCalculator />} />
            <Route path="calc/heatpump" element={<HeatpumpSimulator />} />
            <Route path="calc/results" element={<Results />} />

            {/* PDF Routes */}
            <Route path="pdf/*" element={<PdfHub />} />
            <Route path="pdf" element={<PdfHub />} />

            {/* CRM Routes */}
            <Route path="crm/*" element={<CRMMenu />} />
            <Route path="crm" element={<CRMMenu />} />

            {/* Planning Routes */}
            <Route path="planning/*" element={<PlanningMenu />} />
            <Route path="planning" element={<PlanningMenu />} />
            <Route path="planning/documents" element={<Documents />} />

            {/* Admin Routes */}
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/price-matrix" element={<PriceMatrixImport />} />

            {/* Legacy Routes (für Kompatibilität) */}
            <Route path="results" element={<Results />} />
            <Route path="solar" element={<SolarCalculator />} />
            <Route path="heatpump" element={<HeatpumpSimulator />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  </WizardProvider>
  </ErrorBoundary>
  </React.StrictMode>
);
