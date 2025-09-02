---
mode: "ask"
description: "Extract real project keys/placeholders for calculations & PDFs"
---

# Extract Calculation Keys (Workspace-Scan)

Scan the workspace and list **all** actually used **keys/placeholders** that are relevant for calculations/PDFs:

## Sources (please check all)
- calculations.py, calculations_extended.py, calculations_heatpump.py
- pdf_template_engine/placeholders.py
- YAML coordinates (e.g., coords/seite*.yml, coords_wp/wp_seite*.yml)
- st.session_state paths (calculation_results, project_data, …)

## Output Format
Exclusively output this format:

KEYSET:
- totals keys: [exact, exact, …]
- percentage keys: [exact, …]
- payment keys: [exact, …]
- placeholders (PDF/YAML): [exact, …]
- session keys: [exact, …]
- other calc-related: [exact, …]

> **Note:** **Do not** invent new keys. Only names read 1:1 from the repo.