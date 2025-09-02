---
applyTo: "**/*.md"
description: "Documentation Guidelines (OmersKakerlake, German, repo-Keys)"
---

# Documentation Guidelines

## Language & Style
- Write documentation exclusively in **German**.
- Precise, clear instructions, no filler words.
- Use technical terms (e.g., session state, snapshot, fallback), but explain them briefly.
- Always use examples with real paths/files from this repo (`gui.py`, `pdf_ui.py`, `heatpump_ui.py`, `crm.py`, …).

## Structure
- When creating code patches or installation instructions, always use a **DEF block**:
  - **DEF** – Goal & Context
  - **CODE** – complete code block
  - **INTEGRATION** – File + Line/Environment
  - **VERIFICATION** – How to test
- Example:
  ```markdown
  ## DEF
  Extension of the snapshot function in gui.py so that inputs do not disappear.

  ## CODE
  ```python
  def _save_page_snapshot(...):
      ...