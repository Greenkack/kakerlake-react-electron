// apps/renderer/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import { WizardProvider } from "./state/wizard";
import PriceMatrixImport from "./routes/Admin/PriceMatrixImport";
import SolarCalculator from "./routes/SolarCalculator";
// Seiten
import Home from "./routes/Home";
import CalcMenu from "./routes/Calc/Menu";
import Customer from "./routes/Project/CustomerForm";
import Needs from "./routes/Project/NeedsAnalysis";
import Building from "./routes/Project/BuildingData";
import Options from "./routes/Project/AdditionalOptions";
import Heatpump from "./routes/HeatpumpSimulator";
import Results from "./routes/Results";
import Dashboard from "./routes/Dashboard";
import Documents from "./routes/Documents";

// Platzhalter
import CRMMenu from "./routes/CRM/Menu";
import PlanningMenu from "./routes/Planning/Menu";
import AdminLogin from "./routes/Admin/Login";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WizardProvider>
      <HashRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />

            {/* Berechnungen */}
            <Route path="/calc/menu" element={<CalcMenu />} />
            <Route path="/calc/customer" element={<Customer />} />
            <Route path="/calc/needs" element={<Needs />} />
            <Route path="/calc/building" element={<Building />} />
            <Route path="/calc/options" element={<Options />} />
            <Route path="/calc/solar" element={<Solar />} />
            <Route path="/calc/heatpump" element={<Heatpump />} />
						<Route path="/admin/pricematrix" element={<PriceMatrixImport />} />
						<Route path="/solar" element={<SolarCalculator />} />
            {/* Auswertung */}
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />

            {/* CRM / Planungen / Admin */}
            <Route path="/crm/menu" element={<CRMMenu />} />
            <Route path="/planning/menu" element={<PlanningMenu />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </WizardProvider>
  </React.StrictMode>
);
