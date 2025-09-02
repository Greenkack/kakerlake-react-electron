---
applyTo: "**/*.py"
description: "Python and Architecture Fundamentals for OmersKakerlake"
---

# Python Guidelines – OmersKakerlake

## Basic Principles
- **No renaming** of files, classes, functions, or variables without explicit instruction.
- Provide all functions and classes with **type annotations** (`typing`) and **docstrings** according to PEP 257.
- **Strictly adhere to module responsibility**:
  - `calculations*.py` → purely business calculations (PV, HP, Extended).
  - `pdf_*.py` → only PDF logic (templates, coords, fallback, merge).
  - `crm.py`, `database.py` → customers, projects, documents.
  - `gui.py` → navigation, snapshot, session state.
- Every commit: **no side effects**, functions should be **pure** as far as possible.

## Imports & Architecture
- Keep imports **local** (only in functions/classes if the dependency is large).
- **No circular dependencies**:
  - `pdf_ui.py` may use `calculations.py`, but not vice versa.
  - `crm.py` may use `database.py`, but not `gui.py`.
- If dependencies are unavoidable → utility functions in `utils.py` or a dedicated submodule.

## Performance & Memory
- Divide long operations (e.g., multi-PDF, DB import) into **clear steps**.
- For each step: **Progress bar hook** (`components/progress_manager.create_progress_bar()`) instead of `st.spinner`.
- **Stream-based processing** for PDF and DB – do not keep huge objects in RAM.

## Keys & Placeholders
- **All values** for prices, totals, forecasts exclusively via `calculation_results`:
  - `"brutto_total"`, `"mwst_summe"`, `"rabatte_summe"`, `"nachlaesse_summe"`,
    `"aufschlaege_summe"`, `"extras_summe"`, `"zubehoer_summe"`, `"endbetrag"`.
- In project data (`project_data`):
  - `"customer_data"`, `"pv_details"`, `"hp_details"`, `"project_details"`.
- For PDFs (`pdf_generator.py`): respect YAML coordinates (`seiteX.yml`, `wp_seiteX.yml`).

## Error Handling
- **Always** use try/except for I/O (DB, PDF, filesystem).
- Write errors immediately to the **log** (`app_status.py`), user receives a clear message.
- **Always** implement fallback mechanisms (e.g., PDF without templates → fallback version).

## Testing & Quality
- Unit tests for every core function (`calculations*.py`, `financial_tools.py`).
- Integration tests for CRM storage and PDF creation.
- Validate results with real customer workflows:
  - Create customer → save project → generate PDF → document visible in CRM.

## Additional Rules
- Respect the **prompt triad** (Analysis → Development → Verification).
- Always write code that is **modular, extensible, backward-compatible**.