---
mode: "agent"
description: "Persistent inputs & no menu resets (OmersKakerlake) – consolidate snapshot/restore, robust & stable"
---

# Session Persistence & Navigation

> **Goal:** All inputs are preserved, no menu/widget resets, stable navigation with snapshot/restore.
> **Scope:** `gui.py` (Navigation + Snapshot/Restore), `*ui.py` (Example Keys), Progress Integration. Output as a **DEF block** with a precise patch & integration points.

## Context (Repo)
- **Core mechanism in `gui.py`**:
  - `set_last_page(page_key)` / `get_last_page()`
  - `_save_page_snapshot(page_key)` / `_restore_page_snapshot(page_key)`
- **UI modules** use **stable `st.session_state` keys**:
  - `project_data["customer_data"]`, `["pv_details"]`, `["hp_details"]`, `["project_details"]`
  - `calculation_results[...]` (from `calculations*.py`)
  - `pdf_inclusion_options[...]` (e.g., `append_additional_pages_after_main7`)
  - `payment_terms` (Standard/Custom)
- **Progress Bar**: `components/progress_manager.create_progress_bar()`

## Preliminary Work (AUTO – ONLY REPO-AUTHENTIC KEYS/MECHANICS)
1) **Determine KEYSET (must be output before patch)**
   Scan:
   - `gui.py`: Navigation, `_save_page_snapshot`, `_restore_page_snapshot`, `_last_page_key`
   - `pdf_ui.py`, `heatpump_ui.py`, `crm_*_ui.py`: used `st.session_state` keys
   - `components/progress_manager.py`: API of the progress bar
   - `calculations*.py`: result keys that the UI builds upon
   **Output the exact following format**:
KEYSET:

nav keys: [_last_page_key]

snapshot funcs: [_save_page_snapshot, _restore_page_snapshot]

session keys: [project_data.customer_data, project_data.pv_details, project_data.hp_details, project_data.project_details, calculation_results, pdf_inclusion_options, payment_terms]

progress api: [create_progress_bar, update, complete]

markdown
Copy code
**If** a required key/func is missing → **do not invent it**; briefly state where in the repo it would need to be added/verified.

## Constraints (Repo Rules)
- **No renaming**/restructuring of existing functions/classes/files.
- Snapshot/Restore must be **idempotent** and **backward-compatible** (new keys are optional, old keys are preserved).
- **No** implicit clears/resets on render; only explicitly via a confirmed action.
- **Fault-tolerant**: Snapshot/Restore must not crash if sub-trees are missing (e.g., new keys).
- **Performance**: O(n) over key sets; no unnecessary large deep copies; preferably **shallow merge** per namespace.
- **Security/Robustness**: Do not leak exceptions upward; logs should be technical, UI notifications neutral.

## Implementation Guide
1) **Consolidation in `gui.py`**:
- Stabilize `get_last_page()`/`set_last_page()`; set `_last_page_key` **on every navigation**.
- Extend `_save_page_snapshot(page_key)`:
  - Only save **known namespaces** (`project_data`, `calculation_results`, `pdf_inclusion_options`, `payment_terms`).
  - Use deepcopy **only** where mutations are likely (e.g., dict/list); otherwise, avoid references.
  - Use a key whitelist to avoid noise.
- Extend `_restore_page_snapshot(page_key)`:
  - **Non-destructive merge**: keep existing runtime keys, only **fill/overwrite** with snapshot values, no hard reset.
  - Initialize missing namespaces defensively (empty dicts), never set to `None`.
2) **Hook into Navigation**:
- Call `_save_page_snapshot(current_page)` **before page change**.
- Call `_restore_page_snapshot(target_page)` + `set_last_page(target_page)` **after target selection**.
3) **UI Example Keys**:
- For critical inputs (`st.text_input`, `st.checkbox`, `st.selectbox`), **explicitly** bind `key="..."` to `st.session_state` (repo keys).
4) **Progress**:
- Instrument longer snapshot/restore paths (with many keys) with a progress bar (optional, if noticeable).

## Output (DEF block – Mandatory)
**DEF**
- Consolidation of Snapshot/Restore in `gui.py` (idempotent, fault-tolerant, backward-compatible).
- Navigation fixed with `set_last_page/get_last_page`; no resets.
- Example keys in UI (PV/HP/CRM) are mandatory.

**CODE**
- Patch in `gui.py`:
- Improved implementation for `_save_page_snapshot`, `_restore_page_snapshot`, `set_last_page`, `get_last_page`.
- Hook calls **directly** after the determination of the `target_page`.
- Optional: short snippets in `pdf_ui.py`/`heatpump_ui.py` for clean key binding (only if necessary).
- **No** renaming/signature changes.

**INTEGRATION**
- File: `gui.py`
- **Insertion position**: **after** the navigation detection/page selection (e.g., directly below the point where `target_page` is determined).
- Replace/supplement Snapshot/Restore implementations **at the location** of their previous definition; leave existing comments.

**VERIFICATION**
1) **Roundtrip**: PV-UI → CRM-UI → back to PV-UI → **all inputs are present** (text fields, checkboxes, selects).
2) **Page Refresh** (F5/Re-render) → `get_last_page()` shows the last page; UI starts there, **without** a reset.
3) **Sub-tree is missing** (e.g., `payment_terms` not yet set) → Restore runs without exception; defaults to an empty dict.
4) **Many fields** (Stress): Snapshot/Restore < 50 ms with 1k keys (local test); no memory spikes.
5) **Error Shadow**: Intentionally inject a key with an incompatible type → secure log message, UI remains usable.