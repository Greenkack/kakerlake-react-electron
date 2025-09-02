---
mode: "agent"
description: "Implement feature in OmersKakerlake (Python/Streamlit/PDF/CRM) – with KEYSET, DEF-Block, Tests & Fallback"
---

# Implement Feature (OmersKakerlake)

> **Goal:** Implement a new feature in a **repo-compliant** manner – without renaming, with a persistent UI, secure PDF/CRM integration, progress hooks, automatic KEYSET checks, and verifiable tests.

## Context
- **File/Module**: ${input:datei:Path/Filename.py}
- **Component**: ${input:komponente:Brief description}
- **Area**: ${input:bereich:ui|pdf|crm|calc|progress}
- **Relevant Dependencies**: #pdf_template_engine/, #crm.py, #database.py, #calculations*.py, #pdf_ui.py, #heatpump_ui.py
- **Selection/Code Context** (optional):
  ${selection}

## Preliminary Work (AUTO – only repo-authentic keys/placeholders/tables)
1) **Determine KEYSET (mandatory before every patch):**
   - Scan depending on the area:
     - **calc** → `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
     - **pdf** → `pdf_*.py`, `pdf_template_engine/*` (`overlay.py`, `dynamic_overlay.py`, `placeholders.py`, `merger.py`), `coords/seite*.yml`, `coords_wp/wp_seite*.yml`
     - **crm** → `crm.py`, `database.py`, `init_database.py`
     - **ui** → `gui.py`, `*ui.py`, `components/progress_manager.py`, `german_formatting.py`
   - Extract **only** real existing keys/fields/columns (1:1 spelling), e.g.:
     - **calc**: `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`, `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`
     - **session/project_data**: `project_data["customer_data"]`, `["pv_details"]`, `["hp_details"]`, `["project_details"]`, `calculation_results[...]`
     - **pdf placeholders/coords**: YAML fields/placeholders that are mapped on pages 1..7 (PV) or `wp_seite*.yml` (HP)
     - **crm/db**: Tables & columns as in repo (e.g., `customers`, `projects`, `customer_documents`, `id`, `customer_id`, `project_name`, `status`, `path`, …)
   - **Before** the patch, output **only this format**:
     ```
     KEYSET:
     - calc keys: [...]
     - pdf placeholders/coords: [...]
     - session keys: [...]
     - crm tables/columns: [...]
     ```

2) **If keys are missing/unclear:** **do not** invent fantasy keys. A brief note in **which** file the key needs to be added/verified.

## Constraints (Repo Rules)
- **No renaming/restructuring.** Leave existing names/files **unchanged**.
- **UI/Persistence:** All inputs in `st.session_state` with stable keys; use snapshot mechanism (`_save_page_snapshot`, `_restore_page_snapshot`); respect `"_last_page_key"` (no auto-reset).
- **PDF:**
  - PV: Templates `pdf_templates_static/notext/nt_nt_01..07`, Coords `coords/seite1.yml..seite7.yml`.
  - HP: Templates `hp_nt_01..07` (up to `_16` available), Coords `coords_wp/wp_seite1.yml..wp_seite7.yml`.
  - Additional pages **from page ≥8** only if UI option is set (checkboxes).
  - **Fallback PDF (4 pages)** ready if assets are missing/defective; process must not crash.
  - Final page: Totals (a–f) + separator line + location/date (today) + signature + payment terms from repo keys.
- **CRM/DB:** One common structure (PV & HP); customer via `(first_name, last_name, email)`; save project, then reference PDF as a document; **parameterized SQL**; no silent migrations.
- **Security/Robustness:** Join/normalize paths, whitelist for file extensions, YAML `safe_load`, no secrets in code.
- **Progress:** **Always** instrument long runs with `components/progress_manager.create_progress_bar()`.
- **German:** Labels/messages in German; amount/date formatting via `german_formatting.py` (format only in UI/PDF, not in calculation logic).

## Implementation Steps (Guidance)
1. **Analysis**: Specify the goal, name affected functions/files, map input data/keys from KEYSET.
2. **Development**: Write a minimally invasive patch – use only real keys/placeholders; include fallback and error paths.
3. **Integration**: Set progress bar hooks; consider UI persistence & snapshot; optionally wire up CRM storage.
4. **Validation**: Check invariants/edge cases; add tests (pytest).

## Output (DEF block – Mandatory)
**DEF**
- Brief goal, affected files/modules, relevant keys from the **KEYSET**.

**CODE**
- Complete patch (only repo-authentic keys/placeholders/tables).
- If needed: additional test code (pytest), e.g., for calculation/PDF fallback/CRM flow.

**INTEGRATION**
- Exact file + insertion position:
  - "below the import lines",
  - "between function `X` and `Y`",
  - or "insert/replace from line N".

**VERIFICATION**
- 3–5 checks/tests, incl.:
  - **Functional**: Feature behaves as specified (UI/PDF/CRM/Calc).
  - **Fallback**: missing coords/templates → 4-page fallback, no crash.
  - **Persistence**: Page change → inputs are preserved; `_last_page_key` takes effect.
  - **Security**: Parameterized SQL, secure paths, YAML `safe_load`.
  - **Progress**: `update()`/`complete()` was called.