import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function SimplePage({ title, description, children }) {
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-800", children: title }), description && (_jsx("p", { className: "text-slate-600 mt-2", children: description }))] }), children || (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("p", { className: "text-slate-600 mb-4", children: "Diese Seite ist noch in Entwicklung." }), _jsx(Link, { to: "/home", className: "inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Zur Startseite" })] }))] }));
}
