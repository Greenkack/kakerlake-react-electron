---
applyTo: "**/*ui.py"
description: "Streamlit-UI: Persistence, Navigation, UX (OmersKakerlake, repo-Keys)"
---

# Streamlit UI Rules – OmersKakerlake

> Goal: No inputs disappear, no menu resets, consistent German UI, clean progress feedback.
> Applies to e.g.: `gui.py`, `pdf_ui.py`, `heatpump_ui.py`, `crm_*_ui.py`, `pdf_preview.py`.

## 1) Persistence & State Layout (only real repo keys)
- **All inputs via `st.session_state`** with stable keys, e.g.:
  - `project_data["customer_data"]`
  - `project_data["pv_details"]`
  - `project_data["hp_details"]`
  - `project_data["project_details"]`
  - `calculation_results` (filled from `calculations*.py`), including:
    - `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`,
      `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`
  - PDF options from the UI:
    - `pdf_inclusion_options["append_additional_pages_after_main7"]`
    - other checkboxes for PV/HP additional pages (if available/re-enabled)
  - Payment terms:
    - `payment_terms` (default 0/90/10 or custom text/fields)
- **Do not invent** fantasy keys; only extend existing ones.

## 2) Snapshot/Restore (no data loss on page change)
- **Always** use/call the existing snapshot mechanism in `gui.py`:
  - Before navigation: `_save_page_snapshot(current_page_key)`
  - After navigation: `_restore_page_snapshot(target_page_key)`
- Snapshots contain **all** UI fields of the page (inputs, selections, checkboxes).
- New fields → add to the snapshot list (backward compatible).

## 3) No Auto-Reset of Menus/Widgets
- Remember and restore the last page:
  - **Always** set/read `st.session_state["_last_page_key"]`.
- **Never** "clear" pages/widgets on-render. Only with a specific confirmation.

## 4) Loading Feedback (instead of spinner)
- **Mandatory:** Use `components/progress_manager.py`:
  ```python
  from components.progress_manager import create_progress_bar
  # ...
  pb = create_progress_bar("Creating PDF...", st.container())
  pb.update(20, "Collecting data")
  pb.update(60, "Generating pages")
  pb.complete("Done")