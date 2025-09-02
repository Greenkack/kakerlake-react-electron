---
mode: "agent"
description: "Multi-step tasks with tools (PDF/DB/UI) – KEYSET → DEF → Patch/Tests"
tools: ["file-system","web-search","markdown"]
---

# Mode: AGENT – Orchestration

> Purpose: **Coordinately** change & verify multiple files/subsystems (PDF, CRM, UI, Calc).

## Pipeline
1) **KEYSET** (Repo-wide, only real).
2) **Plan (DEF)**: Steps, files, interfaces, fallbacks.
3) **Implementation**: Patches per file, tests/fixtures.
4) **Validation**: PDF fallback (4 pages), final page values, CRM flow, UI persistence, progress.

## Safeguards
- **Transactions** for DB writes; rollback on errors.
- **Streams** for PDF merge. **No** crash on missing templates/coords.
- German, precise error messages.