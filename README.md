# Kakerlake – PV/WP Kalkulations- & Angebots-App (Tailwind + React + Electron)

Dieses Repo enthält die laufende Migration einer komplexen Python/Streamlit-Anwendung
(Photovoltaik + Wärmepumpen, Multi-PDF-Angebote, CRM-Anbindung) in eine **modulare
Desktop-App** basierend auf **Electron (Main)**, **React + Tailwind (Renderer)** und
**TypeScript** mit getrennter **Core-Business-Logik** (Pakete).

---

## Tech-Stack

- **Electron** (Desktop Shell), Main-Prozess in `apps/main`
- **React 18 + Vite + Tailwind CSS** (Renderer UI) in `apps/renderer`
- **TypeScript** überall (strict), Monorepo via **pnpm workspaces**
- **Core-Logik** (PV/WP, Tarife, Preis-Matrix, Formatierung DE) in `packages/core`
- **PDF-Bausteine** (Renderer/Server-agnostisch, vorbereitet) in `packages/pdf`
- **Assets/Templates** (PDF-Templates, Koordinaten, Logos) in `assets/templates`
- **CI (GitHub Actions)**: Node 20, Corepack, pnpm, Lint/Build

---

## Repository-Struktur

.
├─ apps
│ ├─ main/ # Electron Main Process (tsup build)
│ │ ├─ src/main.ts
│ │ └─ dist/ # build output (tsup)
│ └─ renderer/ # React + Tailwind (Vite)
│ ├─ index.html
│ ├─ src/
│ │ ├─ main.tsx # Router + App-Shell
│ │ ├─ App.tsx
│ │ ├─ state/project.tsx
│ │ └─ routes/
│ │ ├─ Project/
│ │ │ ├─ ModeSelect.tsx
│ │ │ ├─ CustomerForm.tsx
│ │ │ └─ AdditionalOptions.tsx
│ │ ├─ SolarCalculator.tsx
│ │ ├─ HeatpumpSimulator.tsx
│ │ ├─ Results.tsx
│ │ ├─ Dashboard.tsx
│ │ └─ Documents.tsx
│ ├─ tailwind.config.cjs
│ ├─ postcss.config.cjs
│ └─ index.css
├─ packages
│ ├─ core/ # Pure TS Logik (keine UI/DOM/Electron)
│ │ ├─ src/
│ │ │ ├─ index.ts # öffentliche Exports (calcKwp, computePVFlow, …)
│ │ │ ├─ pv.ts # PV-Funktionen (KWP, Produktion, Flüsse)
│ │ │ ├─ battery.ts # Speicherladung/-nutzung, Überschuss
│ │ │ ├─ tariffs.ts # Einspeisevergütung, Strompreis/Index
│ │ │ ├─ price-matrix.ts# XLSX-Parsing und INDEX/VERGLEICH-Logik
│ │ │ └─ format-de.ts # deutsche Formatierung (1.234,56 €; kWh; %)
│ │ └─ tsconfig.json
│ └─ pdf/ # PDF-Orchestrierung (Platzhalter/Koordinaten)
│ ├─ src/
│ │ ├─ templates.ts # Abstraktion Templates + Layer
│ │ ├─ coords.ts # YML/JSON-Koordinaten-Loader
│ │ └─ compose.ts # Seiten mergen, Layer, Metadaten
│ └─ tsconfig.json
├─ assets/
│ └─ templates/ # PDF-Vorlagen, Logos, Fonts, Koordinaten
├─ .github/
│ └─ workflows/ci.yml # Node 20 + pnpm Setup, Lint, Build
├─ pnpm-workspace.yaml
├─ package.json # workspace scripts (dev/build)
└─ README.md

markdown
Code kopieren

---

## Menüstruktur (Soll – mit Navigation & Untermenüs)

1) **Projekt & Bedarfsanalyse**
   - Anlagenmodus: *Photovoltaik | Wärmepumpe | PV+WP*
   - Kundendaten:
     - Anlagentyp: *Neuanlage | Bestandsanlage*
     - Einspeisetyp: *Teileinspeisung | Volleinspeisung*
     - Kundentyp: *Privat | Gewerblich*
     - Anrede/Titel/Vorname/Nachname
     - Adresse: Volltext → Auto-Parsing in Straße, Hausnummer, PLZ, Ort
     - E-Mail, Tel (Festnetz/Mobil), Bundesland, Anmerkung
   - **Weiter / Zurück / Hauptmenü** Buttons in jeder Unterseite

2) **Solarkalkulator**
   - Module (Anzahl, Wp), Hersteller/Modell (DB)
   - Wechselrichter (Modell/Anzahl/Leistung)
   - Speicher (Modell/Kapazität kWh)
   - Zusatzkomponenten (Wallbox, EMS, Optimierer, …)
   - Live-Berechnungen: kWp, Jahresproduktion, Direktverbrauch, Speicherflüsse

3) **Wärmepumpensimulator**
   - Gebäudedaten (Baujahr, Dach, Neigung/Ausrichtung, Fläche, Höhe>7m)
   - Heizlast/verbrauch, WP-Modelle (DB), COP/Saisonal
   - Finanzierungswunsch (optional; Felder siehe `financial_tools` Konzept)
   - Ergebnisgrößen: JAZ, Ersparnisse, Amortisation

4) **Ergebnisse & Dashboard**
   - Preise: Grundpreis (Preis-Matrix), Rabatte/Zuschläge, Endpreis
   - Wirtschaftlichkeit: Direktverbrauch-Ersparnis, Speicher-Ersparnis,
     Einspeise-Einnahmen, Batterie-Überschuss-Einnahmen, **Summe/Jahr**
   - 10/20-Jahre-Prognose (mit/ohne Strompreissteigerung)
   - Kennzahlen: Autarkiegrad, Eigenverbrauchsquote, Einspeisevergütung/Jahr,
     Amortisationszeit, Modulanzahl, WR-Leistung, Speicherkapazität
   - Diagramme (Jahresproduktion, Flüsse, Cashflow), deutsche Zahlformate

5) **PDF-Angebotsausgabe**
   - **Standard** (7 Seiten; PV: `nt_nt_0x`, WP: `hp_nt_0x`)
   - **Erweitert** (Optionen: Datenblätter, Logos, Diagramme, Verträge, AGB, …)
   - **Multi-PDF**: Multi-Firma (Rotation, Staffelung, Layout, Branding)
   - Vorschau (Schnell/Komplett/Seitenweise), Zoom, Layer-Overlay (Debug-Grid)

6) **CRM**
   - Dashboard (Aktivitäten/Angebote/Zahlen)
   - Kundenverwaltung (CRUD + Dokumente/Anhänge)
   - Workflows/Pipeline (Status), Kalender (Termine)
   - Schnellkalkulation (Minimal-Input), Informationsportal (News/Updates)

7) **Einstellungen & Optionen**
   - PVGIS-Anbindung (an/aus); statische Erträge wenn aus
   - Visualisierung/Typografie/Design-Profile (Professional/Modern/…)
   - API-Keys (Maps, PVGIS, …), Lokalisierungstexte (JSON), Debug-Flags
   - Daten zurücksetzen (Werkseinstellungen)
   - **Administration & Konfiguration:**
     - Firmenverwaltung (CRUD, Logos)
     - Produktverwaltung (CRUD, CSV/XLSX/JSON/YAML Import)
     - Allgemeine Parameter: MwSt., Degradation, Wartung, Inflation
     - Ertragseinstellungen (Süd/SO/SW/… pro Neigung 0°–60°)
     - Simulation (Jahre, Strompreissteigerung, Amortisations-Cheat)
     - **Tarifverwaltung** (Teileinspeisung/Volleinspeisung – Jahrgang)

---

## Datenfluss (vereinfacht)

Eingaben (Projekt & Bedarf)
├─> Core: pv.ts / battery.ts / tariffs.ts
│ └─ computePVFlow(...) # Produktion, Direktverbrauch, Speicher, Netz
├─> Core: price-matrix.ts # XLSX → Grundpreis (INDEX/VERGLEICH)
└─> Renderer: state/project.tsx # globaler Zustand (React Context)

Berechnungen → Ergebnisse/Dashboard → PDF-Engine → Multi-Angebote/Zip

markdown
Code kopieren

**Wichtige Berechnungsprinzipien:**
- **kWp** = `moduleCount * moduleWp / 1000`
- **Tarif Strom (€/kWh)** = `Jahreskosten / Jahresverbrauch`
- **Direktverbrauchs-Ersparnis (€)** = `directUseKWh * stromtarif`
- **Speicher-Ersparnis (€)** = `fromBatteryKWh * stromtarif`
- **Einspeise (€)** = `feedInKWh * feedInTarif`
- **Batterie-Überschuss (€)** = `batterySurplusKWh * feedInTarif`
- **Gesamtertrag/Jahr (€)** = Summe der vier Komponenten oben
- **Speicherladung (kWh/Jahr)** = `Speicherkapazität * Zyklen`  
  (aktuell Default‐Annahme **300 Zyklen**, in Settings konfigurierbar)

---

## Setup

**Voraussetzungen**
- **Node.js 20.x LTS** (empfohlen)
- **pnpm** (Corepack): `corepack enable && corepack prepare pnpm@10 --activate`

**Installieren**
```bash
pnpm install
Entwicklung starten (2 Fenster)

bash
Code kopieren
# Fenster A – Renderer (Vite)
pnpm -C apps/renderer dev

# Fenster B – Electron Main
pnpm -C apps/main dev
Troubleshooting (Windows, Electron Download)

Falls Electron nicht startet: setze einmalig
setx ELECTRON_OVERRIDE_DIST_PATH "%CD%\node_modules\.pnpm\electron@31.7.7\node_modules\electron\dist"
(Kommando in Repo-Wurzel ausführen, Terminal neu öffnen)

Was funktioniert bereits
Grundgerüst Monorepo (pnpm workspaces) + CI-Pipeline vorbereitet

Electron Main baut & lädt http://localhost:5173

React Renderer mit Router und State (ProjectProvider)

Screens: ModeSelect, CustomerForm, AdditionalOptions, Results, SolarCalculator, HeatpumpSimulator, Dashboard, Documents

Core-Exports verfügbar: calcKwp, computePVFlow (PV + Speicherflüsse, Basistarife)

Tailwind funktionsfähig; PostCSS/Tailwind im CJS-Modus (keine ESM-Konflikte)

Deutsche Formatierung Helper (€, kWh, Prozent) – Basis vorhanden

Offene Punkte (Kurzüberblick)
Preis-Matrix (XLSX)

Datei-Upload, Validierung (Header=Speicher-Modelle, Spalten=Modulanzahl)

INDEX/VERGLEICH-Logik robust + Fallback "Kein Speicher"

Tarifverwaltung & Jahrgänge

Admin-UI + persistente Ablage (JSON/DB)

PVGIS Integration

Umschaltbar: API vs. statische Erträge (Einstellungen)

PDF-Engine

Mapping Koordinaten (YML→JSON), Fonts/ICC, Layer/Overlay-Debug, Multi-Firma Output (Zip)

Mehrjahres-Simulation 10/20 Jahre

Strompreissteigerung (Index), Wartung/Inflation, Degradation

CRM-Module

Kunden CRUD + Dateiablage, Workflows/Kalender, Dashboard KPIs

Persistenz

Anfangs: JSON-Files im App-Verzeichnis; später SQLite (better-sqlite3)

Packaging

electron-builder Konfiguration (Win/x64), Code-Sign optional

Commands
pnpm -C apps/renderer dev – UI dev server

pnpm -C apps/main dev – Electron dev (wartet auf 5173)

pnpm -C packages/core build – Core bauen

pnpm -w build – Alles bauen (Workspace)