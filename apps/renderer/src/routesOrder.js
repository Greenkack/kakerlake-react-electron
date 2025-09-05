// apps/renderer/src/routesOrder.ts
// Zentrale, lineare Reihenfolge für "vorherige"/"nächste"
export const ROUTE_ORDER = [
    "/", // Hauptmenü / Mainscreen
    "/home", // Hauptmenü / Mainscreen
    "/project/mode", // 1. Anlagenmodus wählen
    "/project/customer", // 2. Kundendaten
    "/project/building", // 3. Gebäudedaten  
    "/project/demand", // 4. Bedarfsanalyse
    "/project/needs", // 5. Zusätzliche Angaben (alt)
    "/project/options", // 6. Zusätzliche Optionen
    "/project/results", // 7. Ergebnisse
    "/calc/menu", // Untermenü Berechnungen (alt)
    "/calc/customer", // 1. Kundendaten (alt)
    "/calc/needs", // 2. Bedarfsanalyse (alt)
    "/calc/building", // 3. Gebäudedaten (alt)
    "/calc/options", // 4. Zusätzliche Angaben (alt)
    "/calc/solar", // Solar Calculator (alt)
    "/calc/heatpump", // Wärmepumpe Simulator (alt)
    "/results", // Ergebnisse der Analyse (alt)
    "/solar", // Solar Calculator
    "/heatpump", // Wärmepumpe Simulator
    "/dashboard", // Dashboard
    "/documents", // Dokumentenerstellung
    "/crm", // CRM Hauptmenü
    "/planning/menu", // Planungen (Platzhalter)
    "/admin", // Admin Login
];
export function indexOfRoute(path) {
    const idx = ROUTE_ORDER.indexOf(path);
    return idx >= 0 ? idx : ROUTE_ORDER.indexOf("/");
}
export function nextRoute(path) {
    const i = indexOfRoute(path);
    const n = i < ROUTE_ORDER.length - 1 ? ROUTE_ORDER[i + 1] : null;
    console.log('[routesOrder] nextRoute', { path, index: i, next: n });
    return n;
}
export function prevRoute(path) {
    const i = indexOfRoute(path);
    const p = i > 0 ? ROUTE_ORDER[i - 1] : null;
    console.log('[routesOrder] prevRoute', { path, index: i, prev: p });
    return p;
}
// Für "Menü"-Button: wohin zurück?
export function menuRouteFor(path) {
    if (path.startsWith("/calc"))
        return "/calc/menu";
    if (path.startsWith("/crm"))
        return "/crm";
    if (path.startsWith("/planning"))
        return "/planning/menu";
    if (path.startsWith("/admin"))
        return "/admin";
    if (path.startsWith("/project"))
        return "/home";
    console.log('[routesOrder] menuRouteFor fallback /home', { path });
    return "/home";
}
