import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* ==== DEF BLOCK: PriceMatrix Import Route ============================== */
import { useMemo, useState } from "react";
import { usePriceMatrix } from "../../hooks/usePriceMatrix";
import { lookupPriceEuro, getNoStorageKey } from "../../lib/pricematrix";
function PreviewTable({ table }) {
    return (_jsx("div", { className: "overflow-auto rounded border bg-white", children: _jsxs("table", { className: "min-w-[720px] w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Module" }), table.storages.map((s) => (_jsx("th", { className: "px-3 py-2 text-left font-semibold", children: s }, s)))] }) }), _jsx("tbody", { children: table.rows.map((r) => (_jsxs("tr", { className: "odd:bg-gray-50", children: [_jsx("td", { className: "px-3 py-1 font-medium", children: r.modules }), table.storages.map((s) => (_jsx("td", { className: "px-3 py-1 tabular-nums", children: r.pricesEuro[s]?.toLocaleString("de-DE", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                }) ?? "—" }, s)))] }, r.modules))) })] }) }));
}
export default function PriceMatrixImport() {
    const { state, hasTable, loadFile, reset } = usePriceMatrix();
    const [modules, setModules] = useState(20);
    const [storage, setStorage] = useState("");
    const defaultStorage = useMemo(() => {
        if (!state.table)
            return "";
        return getNoStorageKey(state.table) ?? state.storageOptions[0] ?? "";
    }, [state.table, state.storageOptions]);
    const effectiveStorage = storage || defaultStorage;
    const pricePreview = useMemo(() => {
        if (!state.table)
            return null;
        try {
            const p = lookupPriceEuro(state.table, modules, effectiveStorage);
            return p.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
        }
        catch {
            return null;
        }
    }, [state.table, modules, effectiveStorage]);
    return (_jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [_jsxs("header", { className: "rounded-xl bg-white p-4 shadow", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Preis-Matrix (XLSX) importieren" }), _jsx("p", { className: "text-gray-600", children: "Excel-Aufbau: Erste Zeile = Speichermodelle (Spalte A leer/Label), erste Spalte = Modulanzahl, Zellen = Festpreise (schl\u00FCsselfertig) in EUR." })] }), _jsxs("section", { className: "rounded-xl bg-white p-4 shadow space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "file", accept: ".xlsx", onChange: (e) => {
                                    const f = e.currentTarget.files?.[0];
                                    if (f)
                                        loadFile(f);
                                }, className: "block" }), hasTable && (_jsx("button", { onClick: reset, className: "rounded bg-gray-100 px-3 py-2 hover:bg-gray-200", children: "Zur\u00FCcksetzen" }))] }), state.error && (_jsxs("div", { className: "rounded border border-red-200 bg-red-50 p-3 text-red-800", children: [_jsx("strong", { children: "Fehler:" }), " ", state.error] })), hasTable && (_jsxs("div", { className: "text-sm text-gray-600", children: ["Quelle: ", _jsx("span", { className: "font-medium", children: state.table?.sourceName })] }))] }), hasTable && state.table && (_jsxs(_Fragment, { children: [_jsxs("section", { className: "rounded-xl bg-white p-4 shadow space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Vorschau" }), _jsx(PreviewTable, { table: state.table })] }), _jsxs("section", { className: "rounded-xl bg-white p-4 shadow space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Index/MATCH-Probe" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "mb-1 block text-sm", children: "Modulanzahl" }), _jsx("input", { type: "number", className: "w-full rounded border px-2 py-2", value: modules, onChange: (e) => setModules(parseInt(e.target.value || "0", 10)) })] }), _jsxs("label", { className: "block sm:col-span-2", children: [_jsx("span", { className: "mb-1 block text-sm", children: "Speichermodell" }), _jsx("select", { className: "w-full rounded border px-2 py-2", value: effectiveStorage, onChange: (e) => setStorage(e.target.value), children: (state.table?.storages ?? []).map((s) => (_jsx("option", { value: s, children: s }, s))) })] })] }), _jsxs("div", { className: "rounded border bg-gray-50 p-3", children: [_jsx("div", { className: "text-sm text-gray-600", children: "Ermittelter Pauschalbetrag" }), _jsx("div", { className: "text-2xl font-semibold", children: pricePreview ?? "— (kein Treffer für diese Kombination)" })] })] })] }))] }));
}
