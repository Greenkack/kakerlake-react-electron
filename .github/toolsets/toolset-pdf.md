---
mode: "agent"
description: "PDF-Engine Toolset (PV/HP, Coords, Fallback, Final Page)"
tools: ["file-system","markdown"]
---

# Toolset: PDF

> Focus: `pdf_generator.py`, `pdf_*.py`, `pdf_template_engine/*`, `coords/`, `coords_wp/`.

## Tasks
- Generate **Single-PDF** (PV/HP), additional pages ≥8 only with UI flags.
- **Fallback** (4 pages) if templates/coords are missing — without crashing.
- **Final page**: Totals (a–f), payments (0/90/10 or Custom), date/location, signature.

## Checklist
- KEYSET: placeholders/coords, calc-keys, session-keys.
- Streams & memory economy (large files).
- Paths: `join` + `normpath`, Base-Dir-Whitelist.
- Progress: `create_progress_bar().update()/complete()`.

## Output
- DEF-Block (Plan), Patch(es), integration points, test cases incl. fallback.