---
mode: "agent"
description: "Testsuite-Toolset (pytest): Calcs, PDF, CRM"
tools: ["markdown","file-system"]
---

# Toolset: Testsuite

> Goal: Reliable, fast pytest coverage.

## Building Blocks
- **Fixtures**: `tmp_outdir`, Temp-DB, `project_data_*`, `progress_spy`, `assets_missing`.
- **PDF**: Fallback 4 pages; final page values; progress hooks called.
- **CRM**: New/existing customer; save_project; add_customer_document; transaction rollback.

## Output
- DEF (which cases), complete test modules, paths + pytest calls.