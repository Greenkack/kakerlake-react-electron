---
mode: "agent"
description: "UI/Streamlit Toolset – Persistence, Navigation, Progress"
tools: ["markdown"]
---

# Toolset: UI/Streamlit

> Focus: `gui.py`, `pdf_ui.py`, `heatpump_ui.py`, `components/progress_manager.py`.

## Tasks
- **Persistence**: stable `st.session_state` keys; Snapshot/Restore; `_last_page_key`.
- **Navigation**: **no** auto-reset; roundtrip UI↔PDF without data loss.
- **Progress**: Bar instead of `st.spinner`; sensible steps.

## Rules
- No renaming; labels/formatting (German) via `german_formatting.py`.
- Only use real keys from KEYSET.

## Output
- DEF (Consolidation/Integration), patches, test scenarios.