---
applyTo: "**/tests/**/*.py"
description: "Test Rules and Minimal Checklists (OmersKakerlake)"
---

# Test Guidelines – OmersKakerlake

> Goal: Reliable, fast tests for calculations (PV/HP), PDF generation (incl. fallback & extras),
> CRM storage flow, and UX-relevant hooks (progress bar). **Only use repo-authentic keys/structures.**

## 1) Framework & Conventions
- Test Runner: **pytest**
- File Names: `test_*.py`
- Markers:
  - `@pytest.mark.calc` for calculations
  - `@pytest.mark.pdf` for PDF/coordinates/fallback
  - `@pytest.mark.crm` for DB/CRM flows
  - `@pytest.mark.slow` for multi-PDF/end-to-end
- Fast unit tests << 1s, mark slower tests (PDF/multi/IO) with `slow`.

## 2) Fixtures (recommended)
- **tmp_path** / **tmp_path_factory**: Isolate output paths (documents, ZIPs).
- **sqlite_in_memory_conn**: In-memory SQLite (if compatible with repo functions; otherwise, a temp DB file).
- **project_data_minimal**: Minimal inputs for PV/HP:
  - `project_data["customer_data"]` (First Name, Last Name, Email)
  - `project_data["pv_details"]` / `["hp_details"]`
  - `project_data["project_details"]`
- **calc_results_stub**: Results with repo keys:
  - `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`,
    `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`
- **assets_stub**: Simulate presence/absence of templates/coords (monkeypatch `os.path.exists` or search paths).
- **progress_spy**: Spy/stub for `components.progress_manager.create_progress_bar()` (counts `update()/complete()` calls).

## 3) Calculations (PV/HP) – Mandatory Cases
- **Keys & Totals (repo-authentic)** ✅ `@pytest.mark.calc`
  - Calculate with example values; check:
    - `endbetrag == brutto_total - rabatte_summe - nachlaesse_summe + aufschlaege_summe + extras_summe + zubehoer_summe` (according to your actual order/policy)
    - `mwst_summe` is consistent with the VAT base and rate
- **Percent↔Amount Consistency**
  - If percentage keys exist: `amount == round(base * pct/100, 2)`
- **Edge Cases**
  - €0 extras/accessories, 0% VAT, very large numbers, empty inputs → **no exceptions**, sensible defaults
- **Forecast/Simulation (if available)**
  - `base/optimistic/pessimistic` scenarios are generated & have monotonically plausible effects
  - Degradation/price escalation has an effect in time series

## 4) PDF – Single/Extras/Fallback
- **Single PV with Extras** ✅ `@pytest.mark.pdf`
  - If coordinates/template exist: pages 1..7 + extras ≥8 if UI flag is set
  - Final page contains totals (a–f) with real keys and **Date/Location/Signature/Payment Terms**
- **HP Single**
  - `hp_nt_01..07` (up to `_16` available; only use if coords exist) → page count is plausible
- **Fallback (without assets)**
  - Remove/patch coordinates/template → **4-page fallback** is generated (no crash)
- **Page Merge/Streams**
  - Construct an example PDF; check that memory does not explode (do not force full reads)
- **Progress Bar**
  - During generation, `update()` and `complete()` are called at least once

## 5) Multi-Offers
- **Base = Fallback of the single PV** ✅ `@pytest.mark.pdf @pytest.mark.slow`
  - Generate multiple variants → each initially 4 pages (fallback), extras only if flag is set
  - Optional: ZIP/merged PDF is created in `tmp_path` and is >0 bytes

## 6) CRM Flow (Customer/Project/Documents)
- **`find_or_create` Customer** ✅ `@pytest.mark.crm`
  - New customer → `save_customer()` creates a record
  - Customer exists → no duplicate, message "Customer exists"
- **Save Project & Reference Document**
  - `save_project()` returns `project_id`
  - `add_customer_document()`/`_add_customer_document_db()` references the PDF path (under `tmp_path`)
  - Paths are normalized via `os.path.join(BASE, ...)`_ **no** path traversal possible
- **Transactional Integrity**
  - Error in the document step → project remains consistent (either rollback or a clear status)

## 7) Path/Security Checks (Brief)
- Upload mock `.exe` / `.svg` → validation fails correctly
- YAML `safe_load` instead of unsafe loaders
- Parameterized SQL (query strings without direct string concatenation)

## 8) Example Asserts (Snippets)
- **Totals**
  ```python
  assert results["endbetrag"] == pytest.approx(
      results["brutto_total"]
      - results.get("rabatte_summe", 0)
      - results.get("nachlaesse_summe", 0)
      + results.get("aufschlaege_summe", 0)
      + results.get("extras_summe", 0)
      + results.get("zubehoer_summe", 0),
      rel=1e-9
  )