import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WizardNav from "../../components/WizardNav";
import { useProject } from "../../state/project";
export default function ModeSelect() {
    const nav = useNavigate();
    const { state, actions } = useProject();
    const [mode, setMode] = useState(state.mode);
    const choose = (m) => {
        setMode(m);
        actions.setMode(m);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Projekt \u2013 Bedarfsanalyse: Anlagenmodus" }), _jsx("p", { className: "text-slate-600", children: "Bitte w\u00E4hlen Sie einen Bedarfsanalyse-Modus aus." }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("button", { className: "rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "pv" ? "ring-2 ring-cyan-500" : ""), onClick: () => choose("pv"), children: [_jsx("div", { className: "font-medium", children: "Photovoltaik" }), _jsx("div", { className: "text-sm text-slate-600", children: "Nur PV-Angebot" })] }), _jsxs("button", { className: "rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "hp" ? "ring-2 ring-cyan-500" : ""), onClick: () => choose("hp"), children: [_jsx("div", { className: "font-medium", children: "W\u00E4rmepumpe" }), _jsx("div", { className: "text-sm text-slate-600", children: "Nur WP-Angebot" })] }), _jsxs("button", { className: "rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "both" ? "ring-2 ring-cyan-500" : ""), onClick: () => choose("both"), children: [_jsx("div", { className: "font-medium", children: "Photovoltaik & W\u00E4rmepumpe" }), _jsx("div", { className: "text-sm text-slate-600", children: "Kombiniertes Angebot" })] })] }), _jsx(WizardNav, { backTo: undefined, nextTo: "/project/customer", nextDisabled: !mode, showHome: false })] }));
}
