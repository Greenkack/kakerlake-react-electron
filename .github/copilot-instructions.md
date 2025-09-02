Here is the complete, 1-to-1 English translation of the provided file.

***

# Copilot Instructions for DING_App

Brief overview: Python app for PV offer creation with a Streamlit UI, calculation engine, and modular PDF generation (ReportLab + pypdf + custom template overlay). The focus is on offer logic, pricing (matrix + surcharges/discounts), simulations, and the final PDF.

## Architecture – The Big Picture
- UI/Workflows (Streamlit):
  - `analysis.py`: central app and KPI views, live cost preview, chart generation, simulations, pricing modifications (discounts/surcharges).
  - `pdf_ui.py`: PDF configuration, validation, handover to the generator, download flow.
  - Other UIs: `crm*.py`, `heatpump_ui.py`, `pdf_preview.py` (if present).
- Calculations/Domain:
  - `calculations.py`: Core calculations incl. price matrix (data/price_matrix.*), additional costs, net/gross, feed-in tariff, cash flows, KPIs. Central result fields: `base_matrix_price_netto`, `total_investment_netto/brutto`, various cost and simulation lists.
  - `calculations_heatpump.py`, `calculations_extended.py`: Special calculations.
  - `financial_tools.py`: Financial functions.
- Data/DB:
  - `data/`: SQLite `app_data.db`, CSV/XLSX price matrix, product and company documents.
  - `product_db.py`, `database.py`: Product query/DB.
- PDF Generation:
  - `pdf_generator.py`: Main generator (ReportLab), validation, chapters, cost and profitability pages; supports "6-page main template" via `pdf_template_engine`.
  - `pdf_template_engine/`: Overlay engine with YML coordinates (`coords/seite1.yml`…`seite6.yml`) and static backgrounds (`pdf_templates_static/notext/nt_nt_01.pdf`…`nt_nt_06.pdf`). Placeholder mapping in `pdf_template_engine/placeholders.py`.
  - Helpers/Styles: `theming/pdf_styles.py`, `pdf_styles.py`, `pdf_widgets.py`.

## Architecture Guidelines
- Entry point: `gui.py` (navigation, session state, snapshots).
- Data persistence: `st.session_state` with stable keys; snapshots on page change.
- PDF Engine: `pdf_template_engine/*`, `pdf_generator.py`, static templates under `pdf_templates_static/notext/*`,
  dynamic coordinates (YAML) for PV: `coords/seite*.yml`, HP: `coords_wp/wp_seite*.yml`.
- CRM: SQLite via `database.py`/`crm.py`. Save heat pump documents in the **same** CRM model as PV.
- Loading feedback: Use components from `components/progress_*.py` (progress bar instead of spinner).
- No "auto-resets" of menus. Remember and restore the last active menu.

## Important Data Flows & Contracts
- perform_calculations (calculations.py) -> results dict with e.g.:
  - `base_matrix_price_netto`, `total_additional_costs_netto`, `subtotal_netto`, `total_investment_netto`, `total_investment_brutto`, `einspeiseverguetung_*`, simulation results and KPIs.
- Pricing Modifications (Analysis/UI):
  - The live final price is held in `st.session_state["live_pricing_calculations"]`; fields: `base_cost`, `total_rabatte_nachlaesse`, `total_aufpreise_zuschlaege`, `final_price`.
- PDF Pipeline:
  - `pdf_ui.render_pdf_ui` collects `project_data`, `analysis_results`, `company_info`, inclusion options and calls `pdf_generator.generate_offer_pdf`.
  - `pdf_generator.generate_offer_pdf_with_main_templates` first creates the 7-page template (overlay) and optionally appends the classic PDF.
  - Validation (`_validate_pdf_data_availability`) checks KPIs such as: `anlage_kwp`, `annual_pv_production_kwh`, `final_price` and company data.

## Output and Response Rules (for Copilot Chat / Inline)
- Deliver **100% complete code blocks** in the **"DEF block" format**:
  1) **DEF**: Brief purpose.
  2) **CODE**: Complete patch/file section.
  3) **INTEGRATION**: Exact integration instruction (file, position, between which lines/markers).
  4) **VERIFICATION**: Brief checklist/tests.
- Adapt **1:1** to the existing file styles (imports, naming, layout).
- No placeholder functions; real implementation with sensible defaults.
- Do **not** add any global side-effects during changes (e.g., no DB migrations "on import").

## Project Specifics and Conventions
- Price Matrix:
  - Admin upload in `admin_panel.py` (XLSX/CSV); persists in admin settings. Runtime access in `calculations.py` (column selection incl. fallback "Without Storage"). Raw data is also located under `data/price_matrix.*`.
- Storage Costs:
  - If the matrix column is "Without Storage" or there is no matrix price, storage surcharges from the product DB are added: field `cost_storage_aufpreis_product_db_netto` in the result.
- Net as Base Price:
  - Many KPIs/decisions are based on net values (`total_investment_netto`). Gross is derived from the VAT rate and is primarily visualized for private customers.
- Placeholders/Overlay:
  - `pdf_template_engine/placeholders.py` maps OCR/example texts from `coords/*.yml` to logical keys like `customer_name`, `pv_power_kWp`, `annual_yield_kwh`. The function `build_dynamic_data` fills these from `project_data`, `analysis_results`, `company_info`.

## Important: final_price & Company Data in the PDF Pipeline
- `final_price` is not guaranteed to be present in the calculation results. The generator and the UI fill it defensively:
  - First from `st.session_state["live_pricing_calculations"]["final_price"]` (if set), otherwise derived from `total_investment_netto`/`total_investment_brutto`.
- Company Data:
  - `company_info` is injected into `project_data.company_information` before validation, so that the validation does not warn and the cover page/cover letter are consistent.

## Programming Style
- Language: **Python 3.11+**, type annotations, pure functions where possible.
- **Maintain structure & format**: respect existing patterns, no breaking changes.
- Error handling: try/except with precise error messages, no silent failures.
- Performance: stream-/generator-based for large PDFs, memory-efficient.
- Security: SQL parameter binding, validate inputs, no secrets in the repo.
- Internationalization/Formatting: Use `german_formatting.py` for amount/date formats.

## Domain-Specific Mandatory Paths
- **Persistence**: Inputs (PV/HP/Customers) must be preserved on page change.
- **Single-PDF**: PV uses `nt_nt_01..07` (+ extras from page ≥8), HP uses `hp_nt_01..07`.
- **Fallback**: If templates/coords are missing → generate **4-page standard** (robust, without crash).
- **Final Page (PV)**: Total blocks (a–f), separator line, date/location, signature, payment terms.
- **Multi-PDF**: Base = fallback variant of the single PV; selectively append optional additional pages.
- **CRM-Save**: PV is present, integrate HP analogously into the **same** structure.

## Typical Developer Workflows
- Start (Streamlit App):
  - The main app is not explicitly here, but the analysis and PDF UI are rendered via Streamlit. Common entry points: functions in `analysis.py` and `pdf_ui.py`.
- Test PDF:
  - Ensure that `data/pdf_templates_static/notext/nt_nt_01.pdf`…`06.pdf` exist and `coords/seite1.yml`…`6.yml` are consistent with the placeholders.
  - Check session state: live pricing, selected products, active company.
- Update Price Matrix:
  - Upload XLSX/CSV via Admin Panel (`admin_panel.py`); at runtime, `calculations.py` accesses it. In case of problems: check `data/price_matrix.*`.

## Pattern: Fallbacks in Validation
- See `pdf_generator.generate_offer_pdf` and `pdf_ui.render_pdf_ui`:
  - Before `_validate_pdf_data_availability`, missing fields are supplemented: `final_price`, `company_information`.
  - This makes warnings like "Missing important key figures: final_price" and "No company data available" disappear.

## Important Files/Directories
- `calculations.py`: Price determination, investment totals, simulations.
- `analysis.py`: UI, KPIs, charts, pricing modifiers.
- `pdf_ui.py`: PDF UI, validation, call of the generator.
- `pdf_generator.py`: Generator, validation, overlay combination, chapters.
- `pdf_template_engine/`: Overlay/Fusion + `placeholders.py` mapping.
- `data/`: Price matrix, product/company files; `app_data.db`.
- `coords/`: YML coordinates for the 6 main pages.
- `multi_pdf_generator.py`: Multi-company PDF creation.
- `gui.py`: Starter & Layout.
- `admin_panel.py`: everything concerning configuration.

## Integration Points and External Dependencies
- ReportLab, pypdf/PyPDF2: PDF creation & merge.
- Streamlit: UI/State management.
- Pandas/Numpy (implicitly in calculations): Price matrix, simulations.

## "Prompt Triad" (always apply)
- **Context**: Which file/component? Which constraints (templates, YAML coords, CRM schema)?
- **Constraints**: No renaming, backward compatible, progress bars, session persistence.
- **Output**: DEF block (with integration points), incl. minimal tests.

## Settings in VS Code
- Activate: `github.copilot.chat.codeGeneration.useInstructionFiles = true`
- Optional: Have `chat.instructionsFilesLocations` and `chat.promptFilesLocations` point to `.github/`.

## If you change something
- Pay attention to the contracts of the result keys (e.g., `base_matrix_price_netto`, `total_investment_netto`, `einspeiseverguetung_*`). These are consumed in multiple modules (UI, PDF, charts).
- When adding new overlay placeholders: map them in `placeholders.py` and fill them in `build_dynamic_data`; adapt YMLs under `coords/` accordingly.
- Pricing logic: Check matrix/storage cases and double counting (notes in `de.json` and cost tables in `pdf_generator.py`).