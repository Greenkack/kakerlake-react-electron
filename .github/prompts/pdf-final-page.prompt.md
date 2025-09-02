---
mode: "agent"
description: "Correctly fill final page PV/HP (totals, payments, signature) – repo-compliant with KEYSET & DEF-Block"
---

# Final Page Update (OmersKakerlake)

> Goal: **Correctly** render the final page in PV/HP offers: Totals (a–f), payments (standard 0/90/10 or custom), separator line, location/date (today), signature. **Only** use repo-authentic keys/placeholders. Output is mandatory as a **DEF block** with a patch for `pdf_generator._render_final_page(...)`.

## Preliminary Work (AUTO – ONLY REPO-KEYS)
1) **Determine KEYSET (must be output before patch):**
   - Scan workspace:
     - Calculations: `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
     - PDF: `pdf_generator.py`, `pdf_*.py`, `pdf_template_engine/placeholders.py`, YAML coordinates (`coords/seite*.yml`, `coords_wp/wp_seite*.yml`)
     - UI/State: `pdf_ui.py`, `heatpump_ui.py`, `gui.py` (Payment-UI/flags, `st.session_state`)
     - Format: `german_formatting.py`
   - List **only** 1:1 keys/placeholders present in the repo:
     ```
     KEYSET:
     - calc keys (results): [brutto_total, mwst_summe, rabatte_summe, nachlaesse_summe, aufschlaege_summe, extras_summe, zubehoer_summe, endbetrag]
     - session keys: [project_data["customer_data"], project_data["project_details"], calculation_results[...], payment_terms, pdf_inclusion_options[...]]
     - placeholders/coords: [from placeholders.py and YAML pages of the final page]
     - helpers: [german_formatting.format_currency or similar – real function name]
     ```
   - **If** a required key does not exist → **do not** invent a fantasy key. Briefly state in **which** file the key would need to be added/verified.

## Context (Parameters)
- Required values (from `calculations*` / `calculation_results`):
  - **net**, **vat**, **gross**, **discount**, **extras**, **accessories**, **final** (use the **repo-authentic** keys: `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`, `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`).
- Payment:
  - **Standard**: 0/90/10 (or the scheme defined as standard in the repo).
  - **Custom**: Free text **or** amount/percentage fields from `payment_terms` (exact field names from KEYSET).
  - Calculate amounts/percentages **consistently** against `endbetrag`.
- Footer:
  - **Location/Date** from `project_data` (location from a sensible source in the project, date = today).
- Format:
  - **German formatting** (€, decimal comma) via a helper function from `german_formatting.py` (use the exact name from KEYSET).

## Constraints (Repo Rules)
- **No** renaming/restructuring; only use keys/placeholders true to the original.
- **Fallback**: If templates/coords are missing → render the final page as a **code fallback** (no crash).
- **Rounding**: Monetary values to 2 decimal places at the final node; maintain internal precision.
- **PDF Engine**: Pages ≥ 8 only if UI flag is active; otherwise, standard scope.
- **Security**: No external fonts/insecure resources; paths via `os.path.join(...)` + `normpath`.
- **Performance**: Stream-based writing, close resources, no full reads.

## Output (DEF block)
**DEF**
- What is being added: Renderer for the final page (totals a–f, payment section, separator line, location/date, signature).
- Relevant real keys from **KEYSET** + used helpers (formatting).
- Error/Fallback behavior.

**CODE**
- **Patch** for `pdf_generator._render_final_page(...)` **only** with repo-authentic keys/placeholders.
- Insert **after** the `block_lines` **and** `pay_lines` blocks.
- Payment logic:
  - Standard (0/90/10) → concrete amounts from `endbetrag`.
  - Custom: If `payment_terms` is structured (%, sum) → calculate correctly; if free text → adopt free text.
  - Validation: Sum of partial payments ≤ `endbetrag`; otherwise, defensively shorten/annotate.
- Output elements on the final page:
  - a) Gross amount incl. VAT (`brutto_total`)
  - b) – VAT (`mwst_summe`)
  - c) – Discounts/rebates (optional; `rabatte_summe` + `nachlaesse_summe`)
  - d) + Surcharges/extras (optional; `aufschlaege_summe` + `extras_summe`)
  - e) + Accessories (optional; `zubehoer_summe`)
  - f) **Final Amount** (`endbetrag`) – highlighted
  - Thin separator line, then **Location, Date (today)**, then **Signature field "Client"**
- **Formatting** of all amounts via `german_formatting` helper; date as "DD.MM.YYYY".
- **Fallback branch**: If coordinates/placeholders for the final page are missing → draw textual boxes (Overlay/Dynamic), do not abort the process.

**INTEGRATION**
- File: `pdf_generator.py`
- Function: `_render_final_page(...)`
- **Insertion position**: **directly after** the existing construction of `block_lines` **and** `pay_lines` (look for comment markers "block_lines"/"pay_lines"; insert the block **below** it).
- If helper functions are missing (e.g., date formatting) → **only** include existing util functions (no new global utilities without proof in KEYSET).

**VERIFICATION**
1) **PV offer with discount + extras + accessories**: All totals are correct (a–f), final amount matches; amounts in German format.
2) **HP offer without extras**: Final page renders, no empty/"None" fields; date/location are present.
3) **Custom payment terms**: Percentage/amount pairs are consistent; sum of partial payments ≤ `endbetrag`.
4) **Fallback Case** (coordinates/final placeholders are missing): No crash; final page is rendered as a fallback overlay.
5) **Regression**: Page change in UI (back/forth) → inputs persist; newly generated PDF shows an unchanged final page.