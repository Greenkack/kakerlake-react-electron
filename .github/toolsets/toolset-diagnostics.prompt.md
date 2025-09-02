---
mode: "agent"
description: "Diagnostics: Profiling, Memory, I/O, Path Security"
tools: ["file-system","markdown","web-search"]
---

# Toolset: Diagnostics

> Goal: Performance/robustness analysis without function renaming.

## Checks
- **I/O**: Eliminate full reads, streaming merge, close file handles.
- **Memory**: do not duplicate large objects; only necessary deepcopies.
- **Path**: Join/Normpath + Base-Dir-Check; no traversal.
- **Error Shadowing**: Logging yes, UI errors neutral, process continues (Fallback).

## Output
- DEF block with hotspots & fix steps.
- Minimal patches (EDIT-suitable) + Micro-benchmarks.