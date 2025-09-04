// apps/renderer/src/utils/address.ts
// Sehr einfache Heuristik:
// "Straße Hausnummer, PLZ Ort"  oder  "Straße Hausnummer\nPLZ Ort"
export function parseFullAddress(raw) {
    const result = {
        strasse: "",
        hausnummer: "",
        plz: "",
        ort: "",
    };
    if (!raw)
        return result;
    // Normalisieren
    const txt = raw.replace(/\r/g, "").trim();
    const lines = txt.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
    // Versuche: erste Zeile = Straße + Hausnummer
    // zweite Zeile = PLZ + Ort
    const line1 = lines[0] ?? "";
    const line2 = lines[1] ?? "";
    // Hausnummer = letztes Token in line1
    const l1parts = line1.split(/\s+/);
    if (l1parts.length >= 2) {
        result.hausnummer = l1parts.pop() ?? "";
        result.strasse = l1parts.join(" ");
    }
    else {
        // fallback: alles Straße
        result.strasse = line1;
    }
    // PLZ = erstes Token in line2, 4-5 Ziffern
    const l2parts = line2.split(/\s+/);
    if (l2parts.length >= 2 && /^\d{4,5}$/.test(l2parts[0])) {
        result.plz = l2parts.shift();
        result.ort = l2parts.join(" ");
    }
    else {
        // ggf. in Zeile 1 nach PLZ suchen
        const m = txt.match(/\b(\d{4,5})\b/);
        if (m) {
            result.plz = m[1];
            result.ort =
                line2 ||
                    txt.substring(txt.indexOf(m[1]) + m[1].length).replace(/[,]/g, "").trim();
        }
    }
    return result;
}
