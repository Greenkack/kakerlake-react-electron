---
mode: "agent"
description: "Generate tests for calculations, PDF fallback, and CRM flow (OmersKakerlake) – with KEYSET, DEF-Block, Fixtures & Mocks"
---

# Generate Tests – OmersKakerlake

> Goal: Reproducible, fast **pytest** tests for calculations (PV/HP), PDF fallback/final page, and CRM flow.
> **Only** use repo-authentic keys/APIs/placeholders; no fantasy names. Output as **DEF block** with complete test files.

## Preliminary Work (AUTO – ONLY REPO-AUTHENTIC)
1) **Determine KEYSET (mandatory before generation)**
   Scan workspace:
   - **Calc**: `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
   - **PDF**: `pdf_generator.py`, `pdf_*.py`, `pdf_template_engine/*` (esp. `merger.py`, `overlay.py`, `dynamic_overlay.py`, `placeholders.py`)
   - **Coordinates**: `coords/seite*.yml`, `coords_wp/wp_seite*.yml`
   - **CRM/DB**: `crm.py`, `database.py`, `init_database.py`
   - **UI/State**: `pdf_ui.py`, `heatpump_ui.py`, `gui.py` (for `st.session_state` keys)
   - **Format**: `german_formatting.py`

   List **only** real existing elements 1:1:
KEYSET:

calc keys: [brutto_total, mwst_summe, rabatte_summe, nachlaesse_summe, aufschlaege_summe, extras_summe, zubehoer_summe, endbetrag]

session keys: [project_data.customer_data, project_data.pv_details, project_data.hp_details, project_data.project_details, calculation_results, pdf_inclusion_options, payment_terms]

pdf templates/coords: [nt_nt_01..07, hp_nt_01..07, coords/seite1.yml..seite7.yml, coords_wp/wp_seite1.yml..wp_seite7.yml]

pdf apis: [public/indirect generator functions – real names from repo]

crm tables/columns: [customers, projects, customer_documents, ...]

crm apis: [save_customer, load_customer, save_project, add_customer_document (or _add_customer_document_db)]

helpers: [german_formatting.<function>]

markdown
Copy code

**If** required keys/APIs are unclear → **do not invent them**. Briefly state **where** in the repo they would need to be verified/added.

## Focus
- **calculations.py / calculations_heatpump.py**: Totals and edge cases.
- **pdf_generator.py**: Fallback (4 pages), final page (values a–f, payments, date/location, signature).
- **crm.py / database.py**: `find_or_create` behavior, `save_project`, `add_customer_document`.

## Constraints
- **pytest** conventions (`tests/test_*.py`), modular fixtures, fast runtime (unit < 1s).
- **No** renaming/refactoring of production APIs.
- **Security/Robustness**: No real path traversals; paths in temp directories, parameterized SQL, YAML `safe_load`.
- **Fallbacks**: Missing templates/coords must **not** cause a crash (4-page PDF).
- **German**: Assertions on labels not required; amounts/dates are checked with formatting where sensible.

## Output (DEF block)
**DEF**
- Which cases are covered (Calc PV/HP Totals, PDF Fallback/Final Page, CRM find_or_create & document linking).
- Which fixtures/mocks are provided.

**CODE**
- Complete test modules incl. fixtures/mocks.
- **At least**:
1. `tests/test_calculations.py` – PV Totals/Percentages/Edge Cases
2. `tests/test_calculations_heatpump.py` – HP Totals/Edge Cases
3. `tests/test_pdf_generator.py` – Fallback 4 pages, Final Page a–f + payments + date/location/signature, progress hooks
4. `tests/test_crm_flow.py` – New/existing customer, `save_project`, `add_customer_document` (parameterized SQL, transaction)
5. `tests/conftest.py` – common fixtures
- **Fixtures** (examples, adapt to repo APIs):
- `tmp_outdir` (tmp_path)
- `sqlite_db` (temp DB file or in-memory, adapted to `database.py` access)
- `project_data_pv_min` / `project_data_wp_min` (real session/project_data structure)
- `calc_results_stub` (keys from KEYSET)
- `progress_spy` (spy for `components.progress_manager.create_progress_bar`)
- `assets_missing` (monkeypatch: simulate templates/coords as "not present")
- **Mocks/Stubs**:
- File/path checks (no traversal), patch `os.path.exists` if necessary
- Progress bar object with `update()`/`complete()` counters

**INTEGRATION**
- Create files in the `tests/` folder.
- Invocation:
- Fast: `pytest -q -m "not slow"`
- Full: `pytest -q`
- Selective: `pytest -q tests/test_pdf_generator.py::test_fallback_generates_4_pages`

**VERIFICATION**
- Expected **values/files** are present:
- `endbetrag` equation is consistent with components (discounts, rebates, surcharges/extras, accessories).
- PDF fallback generates exactly **4 pages**.
- Final page contains values a–f and payment plan (standard 0/90/10 or custom) – if placeholders/coords are missing → **no crash**.
- CRM: New/existing customer is correct; `project_id` is returned; document entry exists; path is secure.

---

## Skeleton of the test files (Generator template)

> **Note**: **Always** derive function/class names from KEYSET, do not guess.

### `tests/conftest.py`
- Temp outputs, DB fixture, minimal `project_data` corpus (PV & HP), `calc_results_stub`, progress spy.

### `tests/test_calculations.py`
- **PV Totals**:
- `endbetrag == brutto_total - rabatte_summe - nachlaesse_summe + aufschlaege_summe + extras_summe + zubehoer_summe`
- `mwst_summe` matches base/rate
- Percentages ↔ Amounts (round(…, 2))
- **Edge**: 0-values, very large numbers, empty inputs -> no exceptions, sensible defaults

### `tests/test_calculations_heatpump.py`
- Analogous to PV, with HP-relevant parameters/results (use only existing keys)

### `tests/test_pdf_generator.py`
- **Fallback**: simulate missing templates/coords → 4 pages
- **Final Page**: a–f, payment terms (standard/custom), date "DD.MM.YYYY", signature; progress `update/complete()` called

### `tests/test_crm_flow.py`
- **find_or_create**: new/existing customer
- **save_project**: returns `project_id`
- **add_customer_document**: PDF path referenced (> 0 bytes), path normalized/whitelisted
- **Transaction**: failing doc link does not create a semi-consistent state

---

## Mini-Examples (Snippets – adapt to repo APIs)

**Totals-Assert:**
```python
def assert_totals(results):
 expected = (
     results["brutto_total"]
     - results.get("rabatte_summe", 0)
     - results.get("nachlaesse_summe", 0)
     + results.get("aufschlaege_summe", 0)
     + results.get("extras_summe", 0)
     + results.get("zubehoer_summe", 0)
 )
 assert results["endbetrag"] == expected