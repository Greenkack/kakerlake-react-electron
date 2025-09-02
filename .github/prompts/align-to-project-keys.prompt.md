---
mode: "agent"
description: "Strictly adapt generated code to the real project keys"
---

# Align Code to Project Keys

## Input
- Pseudocode/code with generic keys:
${selection}

- Binding KEYSET (from /extract-calculation-keys):
${input:keyset:Please insert KEYSET here}

## Task
- **Replace** all generic/incorrect keys exactly with the **project keys** from the KEYSET.
- **Do not** invent new fields/structures.
- **Order** and **final amount logic** strictly according to project fields (as in KEYSET/repo).

## Output (DEF block)
**DEF**: Briefly what was mapped.
**CODE**: Patch **only** with real keys.
**INTEGRATION**: File & exact position (between which blocks).
**VERIFICATION**: Short checks (e.g., amount↔%, final amount).