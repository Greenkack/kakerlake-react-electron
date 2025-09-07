import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "container mx-auto max-w-4xl px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-lg font-semibold text-slate-900", children: "\uD83C\uDFD7\uFE0F Projekt-Assistent" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleClearAll, className: "px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm font-medium transition-colors flex items-center gap-2", title: "Alle eingegebenen Daten l\u00F6schen", children: "\uD83D\uDDD1\uFE0F Alle Daten l\u00F6schen" }), _jsx(Link, { to: "/home", className: "px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors flex items-center gap-2", children: "\uD83C\uDFE0 Zur\u00FCck zur Startseite" })] })] }) }) }));
}
// NOTE: Avoid importing with explicit .js extensions for TSX modules.
// Legacy build artefacts (.js) previously caused duplicated component logic and render loops.
// Ensure any dynamic loaders or Electron preload scripts reference extension-less paths.
export default function ProjectWizard() {
    return (_jsx(ProjectProvider, { children: _jsx(WizardProvider, { children: _jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx(ProjectHeader, {}), _jsx("div", { className: "container mx-auto max-w-4xl px-4 py-8 pb-24", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "mode", replace: true }) }), _jsx(Route, { path: "mode", element: _jsx(ModeSelect, {}) }), _jsx(Route, { path: "customer", element: _jsx(CustomerForm, {}) }), _jsx(Route, { path: "building", element: _jsx(BuildingData, {}) }), _jsx(Route, { path: "demand", element: _jsx(DemandAnalysisNew, {}) }), _jsx(Route, { path: "needs", element: _jsx(NeedsAnalysis, {}) }), _jsx(Route, { path: "options", element: _jsx(AdditionalOptions, {}) }), _jsx(Route, { path: "results", element: _jsx(Results, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "mode", replace: true }) })] }) }), _jsx(FooterNav, {})] }) }) }));
}
