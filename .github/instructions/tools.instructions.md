---
applyTo: "**/*"
description: "Tool Usage & Modes (OmersKakerlake)"
---

# Tools & Modes – Basic Rules

- **No** fantasy APIs/keys: Only use 1:1 existing repo elements.
- **Security over speed**: Paths via `os.path.join` + `normpath`, **parameterized** SQL, YAML `safe_load`.
- **Triad**: 1) KEYSET (real keys), 2) DEF block (plan), 3) Patch/tests.
- **Mode Selection**:
  - `ask`: Analysis/answer, **no** file edits.
  - `edit`: Direct patch in files, **without renaming**.
  - `agent`: Multi-step tasks (read/write, multiple files, tools).
- **Streams instead of full reads** for PDFs/merges; progress hooks from `components/progress_manager.py`.