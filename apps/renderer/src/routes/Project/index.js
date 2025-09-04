import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export default function ProjectWizard() {
    return (_jsx(ProjectProvider, { children: _jsx(WizardProvider, { children: _jsx("div", { className: "min-h-screen bg-slate-50", children: _jsx("div", { className: "container mx-auto max-w-4xl px-4 py-8", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "mode", replace: true }) }), _jsx(Route, { path: "mode", element: _jsx(ModeSelect, {}) }), _jsx(Route, { path: "customer", element: _jsx(CustomerForm, {}) }), _jsx(Route, { path: "building", element: _jsx(BuildingData, {}) }), _jsx(Route, { path: "demand", element: _jsx(DemandAnalysisNew, {}) }), _jsx(Route, { path: "needs", element: _jsx(NeedsAnalysis, {}) }), _jsx(Route, { path: "options", element: _jsx(AdditionalOptions, {}) }), _jsx(Route, { path: "results", element: _jsx(Results, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "mode", replace: true }) })] }) }) }) }) }));
}
