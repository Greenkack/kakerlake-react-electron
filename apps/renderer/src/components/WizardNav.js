import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// apps/renderer/src/components/WizardNav.tsx
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function WizardNav({ backTo, nextTo, disabledNext, showHome, labelNext = "Nächster Bereich", labelBack = "Zurück" }) {
    const navigate = useNavigate();
    const clickingRef = useRef(false);
    const safeNav = (target) => {
        if (!target)
            return;
        if (clickingRef.current)
            return;
        clickingRef.current = true;
        // minimal Delay um doppelte Effekte zu vermeiden
        requestAnimationFrame(() => {
            console.log("[WizardNav] navigate ->", target);
            navigate(target);
            setTimeout(() => { clickingRef.current = false; }, 150);
        });
    };
    return (_jsxs("div", { className: "mt-8 flex flex-wrap gap-3 justify-between items-center border-t pt-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { type: "button", disabled: !backTo, onClick: () => safeNav(backTo), className: "px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-sm font-medium", children: ["\u2190 ", labelBack] }), showHome && (_jsx("button", { type: "button", onClick: () => safeNav("/home"), className: "px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium", children: "\uD83C\uDFE0 Start" }))] }), _jsx("div", { className: "flex gap-3", children: _jsxs("button", { type: "button", disabled: !nextTo || disabledNext, onClick: () => safeNav(nextTo), className: "px-5 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-40", children: [labelNext, " \u2192"] }) })] }));
}
