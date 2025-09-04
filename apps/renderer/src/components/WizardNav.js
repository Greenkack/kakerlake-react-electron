import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "react-router-dom";
export default function WizardNav({ backTo, nextTo, nextDisabled, showHome = true, }) {
    const nav = useNavigate();
    return (_jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [backTo ? (_jsx(Link, { to: backTo, className: "rounded border bg-white px-4 py-2 hover:bg-slate-50", children: "Zur\u00FCck" })) : (_jsx("button", { onClick: () => nav(-1), className: "rounded border bg-white px-4 py-2 hover:bg-slate-50", children: "Zur\u00FCck" })), showHome && (_jsx(Link, { to: "/project/mode", className: "rounded border bg-white px-4 py-2 hover:bg-slate-50", children: "Zum Hauptmen\u00FC" })), nextTo && (_jsx(Link, { to: nextTo, className: "rounded px-4 py-2 text-white " +
                    (nextDisabled ? "bg-slate-300 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"), onClick: (e) => {
                    if (nextDisabled)
                        e.preventDefault();
                }, children: "N\u00E4chster Bereich" }))] }));
}
