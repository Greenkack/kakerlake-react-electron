---
mode: "agent"
description: "Automatically select the appropriate mode/toolset"
tools: ["markdown","file-system"]
---

# Mode Router

> Purpose: Select the correct **Mode** + **Toolset** based on the task/files.

## Input
- **Task**: ${input:task:Brief description}
- **File/Module**: ${input:file:Path/File.py}
- **Area**: ${input:bereich:ui|pdf|crm|calc|progress|tests|diagnostics}

## Logic
- **calc/pdf/crm/ui** with code change → **mode: edit** (small) or **mode: agent** (multi).
- Analysis only → **mode: ask**.
- Tests/Diagnostics → **mode: agent** + corresponding toolset.

## Output
- Brief **Plan**: Mode choice, toolset choice, next prompts (e.g., `/toolset-pdf`, `/mode-edit`).