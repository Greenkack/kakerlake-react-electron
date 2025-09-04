import { jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
export default function AppDebugger() {
    const location = useLocation();
    return (_jsxs("div", { className: "fixed top-0 left-0 bg-black text-white p-2 text-xs z-50 font-mono", children: [_jsxs("div", { children: ["Path: ", location.pathname] }), _jsxs("div", { children: ["Search: ", location.search] }), _jsxs("div", { children: ["Timestamp: ", new Date().toLocaleTimeString()] })] }));
}
