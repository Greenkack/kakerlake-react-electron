import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { menuRouteFor, nextRoute, prevRoute } from "../routesOrder";
export default function FooterNav() {
    const nav = useNavigate();
    const loc = useLocation();
    const path = loc.pathname;
    const prev = prevRoute(path);
    const next = nextRoute(path);
    const menu = menuRouteFor(path);
    return (_jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white/95 border-t shadow-sm", children: _jsxs("div", { className: "mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2", children: [_jsx("button", { type: "button", className: "px-3 py-2 rounded border disabled:opacity-40", onClick: () => prev && nav(prev), disabled: !prev, children: "\u2190 vorherige Seite" }), _jsx("button", { type: "button", className: "px-3 py-2 rounded border", onClick: () => nav(menu), children: "Men\u00FC" }), _jsx("button", { type: "button", className: "px-3 py-2 rounded border disabled:opacity-40", onClick: () => next && nav(next), disabled: !next, children: "n\u00E4chste Seite \u2192" }), _jsx("button", { type: "button", className: "px-3 py-2 rounded border", onClick: () => nav("/"), children: "zur\u00FCck zum Hauptmen\u00FC" })] }) }));
}
