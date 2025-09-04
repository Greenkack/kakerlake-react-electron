// apps/renderer/src/routesOrder.ts
// Zentrale, lineare Reihenfolge für "vorherige"/"nächste"
export const ROUTE_ORDER = [
    "/", // Hauptmenü / Mainscreen
    "/calc/menu", // Untermenü Berechnungen
    "/calc/customer", // 1. Kundendaten
    "/calc/needs", // 2. Bedarfsanalyse
    "/calc/building", // 3. Gebäudedaten
    "/calc/options", // 4. Zusätzliche Angaben
    "/calc/solar", // Solar Calculator
    "/calc/heatpump", // Wärmepumpe Simulator
    "/results", // Ergebnisse der Analyse
    "/dashboard", // Dashboard
    "/documents", // Dokumentenerstellung
    "/crm/menu", // CRM Hauptmenü (Platzhalter)
    "/planning/menu", // Planungen (Platzhalter)
    "/admin/login", // Admin Login (Platzhalter)
];
export function indexOfRoute(path) {
    const idx = ROUTE_ORDER.indexOf(path);
    return idx >= 0 ? idx : ROUTE_ORDER.indexOf("/");
}
export function nextRoute(path) {
    const i = indexOfRoute(path);
    return i < ROUTE_ORDER.length - 1 ? ROUTE_ORDER[i + 1] : null;
}
export function prevRoute(path) {
    const i = indexOfRoute(path);
    return i > 0 ? ROUTE_ORDER[i - 1] : null;
}
// Für "Menü"-Button: wohin zurück?
export function menuRouteFor(path) {
    if (path.startsWith("/calc"))
        return "/calc/menu";
    if (path.startsWith("/crm"))
        return "/crm/menu";
    if (path.startsWith("/planning"))
        return "/planning/menu";
    if (path.startsWith("/admin"))
        return "/admin/login";
    if (path.startsWith("/project"))
        return "/home";
    return "/home";
}
