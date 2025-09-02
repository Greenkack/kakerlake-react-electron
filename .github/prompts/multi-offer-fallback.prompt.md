---
mode: "agent"
description: "Multi-offers with fallback base + optional extras (OmersKakerlake)"
---

# Multi-Offers (Fallback Base)

> Goal: Generate an offer bundle from multiple variants. **Each** variant uses the **single PV fallback PDF (4 pages)** as a base, optional **extras** (pages ≥ 8) are only added if UI flags are enabled. The save & merge process is **stream-based** (RAM-efficient), CRM linking is optional. Output is mandatory as a **DEF block**.

## Inputs
- **Variant Source**: ${input:quelle:session|from_file|from_db}
- **Variant List** (comma-separated; Name=ID optional): ${input:varianten:Variant A,Variant B}
- **Activate Extras**: ${input:extras:yes|no}
- **Merge Mode**: ${input:merge:zip|single-pdf}
- **Target Folder** (relative): ${input:outdir:documents/multi_offers}

## Preliminary Work (AUTO – ONLY REPO-AUTHENTIC KEYS/PLACEHOLDERS)
1) **Determine KEYSET (output before patch)**
   Scan:
   - `pdf_*.py`, `pdf_generator.py`, `pdf_erstellen_komplett.py`
   - `pdf_template_engine/` (`merger.py`, `overlay.py`, `dynamic_overlay.py`, `placeholders.py`)
   - Coordinates: `coords/seite*.yml`, `coords_wp/wp_seite*.yml`
   - UI/State: `pdf_ui.py`, `heatpump_ui.py`, `gui.py` (checkboxes, `st.session_state`)
   - CRM/DB (optional save): `crm.py`, `database.py`
   - Calculation results (totals): `calculations*.py`

   List **only** 1:1 occurring keys/columns/placeholders:
KEYSET:

session keys: [project_data[...], pdf_inclusion_options[...], calculation_results[...]]

calc keys: [brutto_total, mwst_summe, rabatte_summe, nachlaesse_summe, aufschlaege_summe, extras_summe, zubehoer_summe, endbetrag]

pdf templates: [nt_nt_01..07]

coords: [coords/seite1.yml..seite7.yml]

merger api: [from merger.py – real function names]

crm tables/columns (optional): [customers, projects, customer_documents, ...]

markdown
Copy code
If a required key is missing → **do not invent it**; briefly state where it would need to be maintained.

## Constraints (Repo Rules)
- **Base is always fallback** of the **single PV** (4 pages) per variant, **without** dependency on templates/coords.
- **Extras** (pages ≥ 8) **only** if `${input:extras}` = `yes` **and** UI flags/state are set (e.g., `pdf_inclusion_options["append_additional_pages_after_main7"]`).
- **HP parts** in multi-bundles are **not** generated via the static HP templates, but should also use fallback logic, unless the project explicitly requires HP and your multi-logic provides for this (maintain the repo-compliant decision).
- **Stream-based** merging/writing (no full reads of large PDFs).
- **Path Security**: `os.path.join(BASE, rel)`, `normpath`, check `startswith(BASE_ABS)`.
- **Progress Bar**: `components/progress_manager.create_progress_bar()` instead of `st.spinner`.
- **German**: Messages/labels in German; amounts/dates formatted only in UI/PDF.
- **CRM optional**: If enabled, use **existing** mechanics (`save_customer`, `save_project`, `add_customer_document`) – **no** new tables.

## Implementation (Guidance)
1. Load variants (from session/DB/file) → for each variant, generate a **fallback single PDF**.
2. If extras are active: append additional pages (only if flags + assets are present; otherwise, ignore without crashing).
3. Merge:
- `zip`: create each variant as a single PDF → build ZIP.
- `single-pdf`: merge all variants into one PDF via `merger.py` (page sequence: V1…Vn).
4. Normalize paths, close files, release memory.
5. Optional CRM: Reference a project/document for each variant (or a collective project with multiple documents – adopt the **repo-compliant decision**).
6. Progress: distribute `update(…)` sensibly across steps; `complete("Done")`.

## Output (DEF block)
**DEF**
- Build function/workflow for multi-offers (fallback base, optional extras, merge mode).
- Affected files (`multi_offer_generator.py`, `pdf_generator.py`, `pdf_template_engine/merger.py`, optionally `crm.py`, `database.py`).
- Relevant keys from **KEYSET**.

**CODE**
- Complete patch or new function(s) in the **existing module** – use **only repo-authentic** APIs/keys.
- Error paths (missing extras/assets) without a crash → continue with fallback.
- Streams instead of full reads.
- Optional: small pytest for ZIP/page count.

**INTEGRATION**
- Exact insertion position:
- File: `multi_offer_generator.py`
- "below the import lines" or "between function X and Y", or "insert from line N".
- If a helper API is needed in `pdf_generator.py`: also specify the exact position.

**VERIFICATION**
- **ZIP mode**: Bundle is generated; each variant ≥ 4 pages (fallback), extras only if active.
- **Single-PDF mode**: Page sequence is consistent (V1…Vn), page count > 4 × n with extras.
- **No template/coords necessary** for fallback; no crash if assets are missing.
- **Progress bar** is visible with multiple `update()` steps, `complete()` at the end.
- **Path Security**: Outputs are under `${input:outdir}`; no traversal; files exist & are > 0 bytes.
- **(Optional CRM)**: Projects/documents are referenced, no duplicates.