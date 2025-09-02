---
mode: "agent"
description: "Bugfix with regression checklists (OmersKakerlake)"
---

# Bugfix (OmersKakerlake)

> **Goal:** A precise fix without breaking changes – repo-compliant (keys/placeholders/tables), with regression tests, security/performance checks, and DEF block output.

## Context
- **Bug Description:** ${input:bug:What is happening?}
- **Location (File/Line):** ${file}:${cursorPosition}
- **Repro Steps (brief):** ${input:repro:How can the bug be reliably triggered?}
- **Affected Domain (selection):** ${input:domain:calculations|pdf|crm|ui|heatpump|multi-offer|other}

## Preliminary Work (AUTO – ONLY REPO-KEYS)
- **Determine KEYSET (mandatory):**
  - Scan relevant files depending on the domain:
    - *calculations*: `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
    - *pdf*: `pdf_*.py`, `pdf_template_engine/*`, `coords/seite*.yml`, `coords_wp/wp_seite*.yml`
    - *crm*: `crm.py`, `database.py`, `init_database.py`
    - *ui*: `gui.py`, `*ui.py`, `components/progress_manager.py`, `german_formatting.py`
  - Collect **only real** keys/placeholders/table columns (1:1 spelling).
  - Output them **before** the patch as:
    ```
    KEYSET:
    - calc keys: [...]
    - pdf placeholders/coords: [...]
    - session keys: [...]
    - crm tables/columns: [...]
    ```
- **If a required key does not exist:** no fantasy – briefly name in which file the key would need to be updated (without inventing it).

## Constraints (Repo Rules)
- **No breaking changes**, no renaming of existing identifiers/files.
- **Only parameterized SQL** (sqlite3 `?` placeholder).
- **Path Security:** `os.path.join(BASE, rel)`, `normpath`, no user-controlled absolute paths.
- **PDF:** PV templates `nt_nt_01..07`, HP templates `hp_nt_01..07` (up to `_16` available – use only with coords).
  Extras ≥ page 8 only if UI flag is active; fallback (4 pages) ready.
- **UI:** No menu/widget resets; use Snapshot/Restore; progress bar instead of `st.spinner`.
- **Calculations:** Only existing result keys (e.g., `brutto_total`, `mwst_summe`, `rabatte_summe`, `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`).
- **German:** Labels/error messages in German; amounts/dates via `german_formatting.py` (format only in UI/PDF, not in calculation logic).

## Regression Checklists (to be checked off)
- **Security:** Parameterized SQL, YAML `safe_load`, upload whitelist, no path traversal possibility.
- **Performance:** Streams instead of full reads; large runs in steps with a progress bar.
- **Robustness:** Missing templates/coords → no crash; fallback active.
- **Persistence:** `st.session_state` values are preserved on page change.
- **Compatibility:** Existing CRM flows (Customer → Project → Document) work unchanged.

## Output (DEF block, Mandatory)
**DEF**
- Cause (concise)
- Fix Strategy (brief, repo-rule-compliant)
- Affected files/modules

**CODE**
- Minimal patch **only** with repo-authentic keys/placeholders/table columns.
- If sensible, show: Unit test/integration test (pytest) for repro + regression.

**INTEGRATION**
- Exact file(s) + insertion position (e.g., "between function X and Y", "below line 210").

**VERIFICATION**
- Execute repro again → bug is gone.
- Edge case (e.g., missing coords/high values/empty inputs) → no crash.
- PDF: Final page is correct; multi-offer with fallback is possible.
- CRM: Customer/project/document can still be saved.