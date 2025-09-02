---
mode: "edit"
description: "Targeted code changes without renaming/restructuring"
---

# Mode: EDIT – Direct Patch

> Purpose: Minimally invasive patches (read → change → test), **signatures & names unchanged**.

## Process
1) **KEYSET** (only real elements): see ASK.
2) **DEF**: Goal, affected files/lines, risks.
3) **CODE**: complete patch (only real keys/placeholders/columns).
4) **INTEGRATION**: exact location (under imports / between function X/Y / from line N).
5) **VERIFICATION**: Lints/tests green; fallbacks intact; progress hooks present.

## Rules
- No renaming. Parameterized SQL. Secure paths. YAML `safe_load`.
- UI Persistence: Respect `st.session_state`, do not break snapshot/restore.