---
applyTo: "**/calculations*.py"
description: "Calculation Modules – ONLY use existing project keys/placeholders; Totals, percentages, final amounts, simulations & forecasts"
---

# Calculations – Repo-Compliant (PV & Heat Pump)

> **Very important:** Use **exclusively** the **project keys & placeholders** that exist in the workspace.
> **Do not** invent new fields, **no** renames. Before any code generation: **Determine the KEYSET** (see below).

## KEY-COMPLIANCE (must)
1. **Automatic Key Detection (before every suggestion):**
   - Scan workspace files for existing keys/placeholders:
     - `calculations.py`, `calculations_extended.py`, `calculations_heatpump.py`
     - `pdf_template_engine/placeholders.py`
     - YAML coordinates (e.g., `coords/seite*.yml`, `coords_wp/wp_seite*.yml`)
     - known state paths (e.g., `st.session_state["calculation_results"]`, `project_data[...]`)
   - Detect keys/placeholders via:
     - Dict literals with constant keys (`{"gross": ..., "mwst": ...}`)
     - Attribute/index access (`totals["gross"]`, `data["mwst_summe"]`)
     - YAML fields (`key:`, `name:`, or `placeholder:` in coordinate files)
     - Placeholder registries/functions in `placeholders.py`
2. **Output KEYSET Protocol (Mandatory):**
   - **Before** the code, output the block header `KEYSET:` and list the **exact** keys (1:1 spelling).
   - All subsequent calculation/assignment logic **must** only use these keys.
3. **Rejection on Ambiguity:**
   - If a required key is **not found** in the repo: **do not invent it**.
     Instead: "Unclear key name – please check/add key in file X." (brief & precise).

## Totals & Percentage Logic (with existing keys)
- **Always** deliver (with **project keys**, not generic ones!):
  - Net/gross/tax totals, discounts/rebates (amount + % if provided for), surcharges/extras, accessories, **final amounts**.
  - Percentage/amount pairs must be consistent: `amount == round(base * pct/100, 2)`.
  - Tax: document/use the **VAT base field & rate** established in the repo (e.g., `mwst_pct`, `mwst_summe`, **only** if they exist **exactly like this** in the repo).
- Payment terms (if provided for in the app): calculate partial amounts against the **final amount key defined in the project**.

## Simulations & Forecasts (repo-compliant)
- Scenarios: at least `base`, `optimistic`, `pessimistic` – **using your keys**.
- Sensitivity: ±x % for project-relevant parameters (prices, subsidy rate, energy price, COP, …), **only** with existing parameter names.
- Time series/Forecast:
  - PV: kWh/year, degradation, self-consumption, price development **according to your fields/functions**.
  - HP: COP/heat demand/power demand projections **according to your fields/functions**.
  - Financial metrics (NPV/IRR) via `financial_tools.py`, if it exists.
- Output structure: **adapt to your repo** (do not invent new structures).
  For example, if your project uses `st.session_state["calculation_results"]["pv"]["totals"]["…"]`, maintain **exactly that**.

## Rounding & Validation
- Round monetary values at the final node to **2 decimal places**; use sufficient precision internally (Decimal if common in the repo).
- Invariants (please adapt to **your** field names):
  - `gross == net + vat`
  - final amount = Gross after discounts/surcharges/accessories according to **your sequence**
- German formatting (€, decimal comma) only in UI/PDF, **not** in calculation functions.

## Tests
- Create/extend tests **only** with real keys.
- Check:
  - Percent↔amount consistency,
  - Final amount chain (discount/extras/accessories → net/VAT → gross),
  - Scenario/sensitivity monotonic effects,
  - Forecast series are plausible.