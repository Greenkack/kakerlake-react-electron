---
mode: "edit"
description: "Targeted refactoring without renaming (OmersKakerlake) – KEYSET, DEF-Block, Tests"
---

# Refactoring (without renaming) – OmersKakerlake

> **Goal:** Increase readability, reduce duplicates, minimize side effects – **without** changing file names/APIs/signatures. Repo-compliant, with KEYSET check, DEF block, green tests.

## Context
- **Target file(s):** ${file}
- **Selection/Context (optional):**
  ${selection}
- **Area (optional):** ${input:bereich:ui|pdf|crm|calc|progress|misc}

## Preliminary Work (AUTO – only repo-authentic keys/placeholders/tables)
1) **Determine KEYSET (output before patch):**
   - Scan according to area:
     - **calc** → `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
     - **pdf** → `pdf_*.py`, `pdf_template_engine/*` (`overlay.py`, `dynamic_overlay.py`, `placeholders.py`, `merger.py`), `coords/seite*.yml`, `coords_wp/wp_seite*.yml`
     - **crm** → `crm.py`, `database.py`, `init_database.py`
     - **ui** → `gui.py`, `*ui.py`, `components/progress_manager.py`, `german_formatting.py`
   - List **only** existing/real elements (1:1 spelling):
     ```
     KEYSET:
     - public API/signatures (to be preserved): [...]
     - calc keys: [brutto_total, mwst_summe, rabatte_summe, nachlaesse_summe, aufschlaege_summe, extras_summe, zubehoer_summe, endbetrag]
     - session keys: [project_data["customer_data"], ["pv_details"], ["hp_details"], ["project_details"], calculation_results[...], pdf_inclusion_options[...], payment_terms]
     - crm tables/columns: [customers, projects, customer_documents, …]
     - pdf templates/coords: [nt_nt_01..07, hp_nt_01..07, coords/seite1.yml..seite7.yml, coords_wp/wp_seite1.yml..wp_seite7.yml]
     ```
   - **Do not** invent fantasy keys/columns/APIs. If necessary, briefly state where a key would need to be maintained (without introducing it).

## Constraints (Repo Rules)
- **No renaming** of files, functions, classes, variables, or modules.
- **Signatures unchanged** (keep parameter names/order/types).
- Only **extract internal helper functions** (make them private, e.g., `_helper()`), leave callers unchanged.
- **No logic changes** – except for removing/unifying clearly dead/duplicated paths.
- **Maintain Security/Robustness**: Parameterized SQL, path-join/`normpath`, YAML `safe_load`, streams for PDFs, `progress_manager` instead of `st.spinner`.
- **Preserve UI Persistence**: `st.session_state` keys, Snapshot/Restore, `_last_page_key`.
- **Preserve PDF Contracts**: PV `nt_nt_01..07`, HP `hp_nt_01..07` (up to `_16` exists, use only with coords), do not damage fallback (4 pages).

## Refactoring Guidelines
- **Extract** repeated blocks into **local private** helpers (`_normalize_path`, `_format_amount`, `_with_transaction`, `_render_lines`, …).
- **Order imports**: standard lib → third-party → internal modules; remove unused; avoid circular dependencies (use lazy import if necessary).
- **Reduce side effects**: encapsulate IO in slim adapter functions; keep pure functions in `calculations*.py`.
- **Split complex functions** into manageable steps (max. ~50–80 lines per function), add **docstrings** + type annotations.
- **Leave or harmonize progress hooks** (`create_progress_bar().update()/complete()`).
- **Formatting** (internal only): no UI labels in the calc layer; format amounts/dates only in UI/PDF via `german_formatting.py`.

## Output (DEF block – Mandatory)
**DEF**
- What was cleaned up (duplicates, extractions, import cleanup, side effects).
- Affected files/modules.
- Confirmation: No renaming/signature changes.

**CODE**
- Complete patch (only affected sections).
- New **private** helpers with docstrings/type annotations.
- Optional: small tests/adaptations (if pure restructuring – tests remain green).

**INTEGRATION**
- Exact location: "below the import lines", "between function X/Y", "replace block from line N to M".

**VERIFICATION**
- **Linter/Formatter** (ruff/flake8/black or similar) is error-free.
- **Tests are green** (pytest), no API changes; manually trigger important paths:
  - Single PDF (PV/HP) incl. final page → unchanged.
  - Fallback PDF (without coords/templates) → 4 pages, no crash.
  - CRM flow (Customer → Project → Document) → unchanged.
  - UI Persistence: Page change → inputs are preserved.