# Copilot-Anwe  - `data/`: SQLite `app_data.db`, CSV/XLSX Preis-Matrix, Produkt- und Firmendokumente.
  - `product_db.py`, `database.py`: Produktabfrage/DB.
- PDF-Erzeugung:
  - `pdf_generator.py`: Hauptgenerator (ReportLab), Validierung, Kapitel, Kosten- und Wirtschaftlichkeitsseiten; unterstützt „7-Seiten-Haupttemplate" via `pdf_template_engine`.
  - `pdf_template_engine/`: Overlay-Engine mit YML-Koordinaten (`coords/seite1.yml`…`seite7.yml`) und statischen Hintergründen (`pdf_templates_static/notext/nt_nt_01.pdf`…`nt_nt_07.pdf`). Platzhalter-Mapping in `pdf_template_engine/placeholders.py`.
  - Hilfen/Styles: `theming/pdf_styles.py`, `pdf_styles.py`, `pdf_widgets.py`.n für DING_App

Kurzübersicht: Python-App für PV-Angebotserstellung mit Streamlit-UI, Berechnungs-Engine und modularer PDF-Erzeugung (ReportLab + pypdf + eigenes Template-Overlay). Fokus liegt auf Angebotslogik, Preisbildung (Matrix + Auf-/Abschläge), Simulationen und finalem PDF.

## Architektur – das große Bild
- UI/Workflows (Streamlit):
  - `analysis.py`: zentrale App- und KPI-Ansichten, Live-Kosten-Vorschau, Diagramm-Erzeugung, Simulationen, Pricing-Modifikationen (Rabatte/Zuschläge).
  - `pdf_ui.py`: PDF-Konfiguration, Validierung, Übergabe an Generator, Download-Flow.
  - Weitere UIs: `crm*.py`, `heatpump_ui.py`, `pdf_preview.py` (wenn vorhanden).
- Berechnungen/Domain:
  - `calculations.py`: Kernkalkulationen inkl. Preis-Matrix (data/price_matrix.*), Zusatzkosten, Netto/Brutto, Einspeisevergütung, Cashflows, KPIs. Zentrales Ergebnisfeld: `base_matrix_price_netto`, `total_investment_netto/brutto`, diverse Kosten- und Simulationslisten.
  - `calculations_heatpump.py`, `calculations_extended.py`: Spezialberechnungen.
  - `financial_tools.py`: Finanzfunktionen.
- Daten/DB:
  - `data/`: SQLite `app_data.db`, CSV/XLSX Preis-Matrix, Produkt- und Firmendokumente.
  - `product_db.py`, `database.py`: Produktabfrage/DB.
- PDF-Erzeugung:
  - `pdf_generator.py`: Hauptgenerator (ReportLab), Validierung, Kapitel, Kosten- und Wirtschaftlichkeitsseiten; unterstützt „6-Seiten-Haupttemplate“ via `pdf_template_engine`.
  - `pdf_template_engine/`: Overlay-Engine mit YML-Koordinaten (`coords/seite1.yml`…`seite6.yml`) und statischen Hintergründen (`pdf_templates_static/notext/nt_nt_01.pdf`…`nt_nt_06.pdf`). Platzhalter-Mapping in `pdf_template_engine/placeholders.py`.
  - Hilfen/Styles: `theming/pdf_styles.py`, `pdf_styles.py`, `pdf_widgets.py`.

## Wichtige Datenflüsse & Kontrakte
- perform_calculations (calculations.py) -> results-Dict mit u.a.:
  - `base_matrix_price_netto`, `total_additional_costs_netto`, `subtotal_netto`, `total_investment_netto`, `total_investment_brutto`, `einspeiseverguetung_*`, Simulationsergebnisse und KPIs.
- Pricing-Modifikationen (Analysis/UI):
  - Live-Finalpreis wird in `st.session_state["live_pricing_calculations"]` gehalten; Felder: `base_cost`, `total_rabatte_nachlaesse`, `total_aufpreise_zuschlaege`, `final_price`.
- PDF-Pipeline:
  - `pdf_ui.render_pdf_ui` sammelt `project_data`, `analysis_results`, `company_info`, Inclusion-Optionen und ruft `pdf_generator.generate_offer_pdf`.
  - `pdf_generator.generate_offer_pdf_with_main_templates` erzeugt zuerst das 7-Seiten-Template (Overlay) und hängt optional die klassische PDF an.
  - Validierung (`_validate_pdf_data_availability`) prüft u.a. KPIs: `anlage_kwp`, `annual_pv_production_kwh`, `final_price` und Firmendaten.

## Projektbesonderheiten und Konventionen
- Preis-Matrix:
  - Admin-Upload in `admin_panel.py` (XLSX/CSV); persistiert in Admin-Settings. Laufzeitzugriff in `calculations.py` (Spaltenauswahl inkl. Fallback „Ohne Speicher“). Rohdaten liegen zusätzlich unter `data/price_matrix.*`.
- Speicher-Kosten:
  - Wenn Matrix-Spalte „Ohne Speicher“ oder kein Matrixpreis, werden Speicher-Aufpreise aus Produkt-DB addiert: Feld `cost_storage_aufpreis_product_db_netto` im Ergebnis.
- Netto als Basispreis:
  - Viele KPIs/Entscheidungen basieren auf Netto-Werten (`total_investment_netto`). Brutto wird aus MwSt.-Satz abgeleitet und v. a. für Privatkunden visualisiert.
- Platzhalter/Overlay:
  - `pdf_template_engine/placeholders.py` mappt OCR-/Beispieltexte aus `coords/*.yml` auf logische Keys wie `customer_name`, `pv_power_kWp`, `annual_yield_kwh`. Die Funktion `build_dynamic_data` befüllt diese aus `project_data`, `analysis_results`, `company_info`.

## Wichtig: final_price & Firmendaten in der PDF-Pipeline
- `final_price` ist in den Calculation-Results nicht garantiert vorhanden. Der Generator und die UI füllen defensiv:
  - Zuerst aus `st.session_state["live_pricing_calculations"]["final_price"]` (falls gesetzt), sonst aus `total_investment_netto`/`total_investment_brutto` abgeleitet.
- Firmendaten:
  - `company_info` wird vor Validierung in `project_data.company_information` injiziert, damit die Validierung nicht warnt und Deckblatt/Anschreiben konsistent sind.

## Typische Entwickler-Workflows
- Start (Streamlit-App):
  - Haupt-App ist nicht explizit hier, aber Analyse- und PDF-UI werden über Streamlit gerendert. Übliche Einstiege: Funktionen in `analysis.py` und `pdf_ui.py`.
- PDF testen:
  - Stelle sicher, dass `data/pdf_templates_static/notext/nt_nt_01.pdf`…`06.pdf` existieren und `coords/seite1.yml`…`6.yml` konsistent zu den Platzhaltern sind.
  - Prüfe Session-State: live pricing, ausgewählte Produkte, aktive Firma.
- Preis-Matrix aktualisieren:
  - Über Admin-Panel (`admin_panel.py`) XLSX/CSV hochladen; zur Laufzeit greift `calculations.py` darauf zu. Bei Problemen: `data/price_matrix.*` prüfen.

## Muster: Fallbacks in der Validierung
- Siehe `pdf_generator.generate_offer_pdf` und `pdf_ui.render_pdf_ui`:
  - Vor `_validate_pdf_data_availability` werden fehlende Felder ergänzt: `final_price`, `company_information`.
  - Dadurch verschwinden Warnungen wie „Fehlende wichtige Kennzahlen: final_price“ sowie „Keine Firmendaten verfügbar“.

## Wichtige Dateien/Verzeichnisse
- `calculations.py`: Preisermittlung, Investitionssummen, Simulationen.
- `analysis.py`: UI, KPIs, Charts, Pricing-Modifikatoren.
- `pdf_ui.py`: PDF-UI, Validierung, Aufruf von Generator.
- `pdf_generator.py`: Generator, Validierung, Overlay-Kombination, Kapitel.
- `pdf_template_engine/`: Overlay/Fusion + `placeholders.py` Mapping.
- `data/`: Preis-Matrix, Produkt-/Firmendateien; `app_data.db`.
- `coords/`: YML-Koordinaten für die 6 Hauptseiten.

## Integrationspunkte und externe Abhängigkeiten
- ReportLab, pypdf/PyPDF2: PDF-Erzeugung & -Merge.
- Streamlit: UI/State-Management.
- Pandas/Numpy (implizit in Berechnungen): Preis-Matrix, Simulationen.

## Wenn du etwas änderst
- Achte auf die Contracts der Ergebnis-Keys (z. B. `base_matrix_price_netto`, `total_investment_netto`, `einspeiseverguetung_*`). Diese werden in mehreren Modulen konsumiert (UI, PDF, Charts).
- Beim Hinzufügen neuer Overlay-Platzhalter: in `placeholders.py` mappen und in `build_dynamic_data` befüllen; YMLs unter `coords/` entsprechend anpassen.
- Preislogik: Prüfe Matrix-/Speicher-Fälle und Doppelzählungen (Hinweise in `de.json` und Kosten-Tabellen in `pdf_generator.py`).
