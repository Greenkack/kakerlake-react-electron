---
name: "🐞 Bug Report"
about: Melde einen Fehler im Projekt
title: "[Bug]: "
labels: ["type:bug", "prio:triage"]
assignees: []
---

## Kontext
**App-Zweig:** Migration zu **React + Electron + Tailwind**  
**Bereich:** (Bedarfsanalyse | Solarkalkulator | Wärmepumpensimulator | Ergebnisse/Dashboard | PDF-Engine | CRM | Admin)  
**Platform:** (Windows/macOS/Linux) – Electron v<electron_version>  
**Frontend:** React <react_version> + Tailwind – Node v<node_version>  
**Backend-Layer:** (Electron Main | Node Services)  
**PDF-Engine:** (pdf-lib/jsPDF/pdfmake) + Template-Overlay (Koordinaten JSON)

## Beschreibung
Beschreibe den Fehler kurz und prägnant.

## Reproduktion
1. Gehe zu '...'
2. Klicke auf '...'
3. Siehe Fehler '...'

## Erwartet
Was sollte stattdessen passieren?

## Belege
- Logs (Console, Electron main) als Codeblock
- Screenshots/GIFs
- Beispiel-Projektdaten (anonymisiert)

## Auswirkungen
- [ ] Blocker für Release
- [ ] Falsche Ergebnisse (Kalkulation/PDF)
- [ ] UI/UX-Fehler
- [ ] Performance-/Speicherproblem

## Checkliste
- [ ] Reproduzierbar auf `main`
- [ ] Keine lokalen Anpassungen im Build
- [ ] `pnpm install && pnpm test` ohne Fehler
- [ ] PDF-Template/Coords-Datei angehängt (falls betroffen)
