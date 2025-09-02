# CONTRIBUTING – Kakerlake PV/WP Kalkulation – React + Electron + Tailwind Migration

Danke für deinen Beitrag! Dieses Projekt migriert eine bestehende Python/Streamlit-App (PV/WP-Kalkulation) zu **React + Electron + Tailwind** mit identischen Ergebnissen.

## Entwicklungs-Setup
- Node >= 20, PNPM empfohlen
- Python-Referenzcode liegt im Unterordner `python_ref/` (nur Vergleich)
- `pnpm install`
- `pnpm dev` (Renderer), `pnpm electron` (Main)

## Ordnerstruktur
- `apps/renderer` – React/Tailwind UI
- `apps/main` – Electron Main-Prozess (IPC, FS, DB)
- `packages/core` – Kalkulation (TS-Port der Python-Module)
- `packages/pdf` – PDF-Engine (pdf-lib Overlay, Template-Koordinaten JSON)
- `assets/templates` – Statische PDF-Hintergründe (PV/WP)
- `assets/coords` – Koordinaten (PV)
- `assets/coords_wp` – Koordinaten (WP)

## Richtlinien
- **Ergebnisse müssen 1:1 zum Python-Referenzoutput passen.**
- Jede neue Funktion bekommt Unit-Tests (Jest) + mind. 1 E2E (Playwright).
- PDF-Änderungen: Koordinaten per JSON, keine Magic Numbers im Code.
- Deutsche Formatierung (`de-DE`) konsequent verwenden.

## DEF-Block (Pflicht für größere Änderungen)
```
DEF:
- Ziel/Funktion:
- Inputs:
- Outputs:
- Abhängigkeiten/Koordinaten:
- Tests:
```
