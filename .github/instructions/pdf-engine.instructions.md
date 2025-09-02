---
applyTo: "**/pdf_*.py"
description: "PDF Engine (PV/HP, Fallback, Extras, Final Page, repo-Keys)"
---

# PDF Engine Rules – Repo-Compliant

## Templates & Coordinates
- **Photovoltaics (PV)**:
  - Templates: `pdf_templates_static/notext/nt_nt_01.pdf … nt_nt_07.pdf`
  - Coordinates: `coords/seite1.yml … seite7.yml`
- **Heat Pump (HP)**:
  - Templates: `pdf_templates_static/notext/hp_nt_01.pdf … hp_nt_16.pdf`
  - Coordinates: `coords_wp/wp_seite1.yml … wp_seite7.yml`
- From page **≥ 8**: optional additional pages only if the user selects this in the UI (`pdf_ui.py`, checkboxes).
- If an asset (template/YAML) does not exist → **Fallback Generator** (only 4 pages, dynamic with code).

## Data Sources
- Content is filled exclusively from `project_data`:
  - `project_data["customer_data"]`
  - `project_data["pv_details"]`
  - `project_data["hp_details"]`
  - `project_data["calculation_results"]`
- Keys from calculations (`calculations.py`, `calculations_heatpump.py`):
  - `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`,
    `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`.

## Final Page (always append)
- Display totals line by line:
  1. Gross amount incl. VAT
  2. – VAT amount
  3. – Discounts/rebates (optional)
  4. + Surcharges/extra costs (optional)
  5. + Accessories (optional)
  6. = Final total amount
- Below: **Separating line**
- Bottom right: `Location, Date (today)`
- Below that: **Signature field** ("Client")
- Above that: Payment terms (`payment_terms` from `pdf_ui.py` or `payment.py`).

## Memory & Merging
- Merge engine only via `pdf_template_engine/merger.py`.
- **Do not** load entire PDFs into RAM → stream page by page.
- For multi-PDF (via `multi_offer_generator.py`):
  - Base is always fallback (4 pages) → optional extras added.
  - Generate PDFs per customer and save via `crm.py` + `database.py`.

## Error Handling
- If coordinates are missing → insert an empty page, but the process must not crash.
- If a template is defective → automatically use fallback.
- Memory Leak Shield: Close/release PDFs after each step.

## Tests
- Test cases:
  - PV offer with discount + extras → totals are correct, final page is correct.
  - HP offer without extras → PDF is only 7 pages.
  - Multi-offer → multiple fallback PDFs in a ZIP.
  - PDF without coordinates → process runs, page is empty.