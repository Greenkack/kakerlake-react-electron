---
mode: "agent"
description: "Save HP offer in existing CRM (OmersKakerlake) – KEYSET, DEF-Block, Tests"
---

# HP → CRM Save (OmersKakerlake)

> Goal: Implement/add the button **"Save customer in CRM"** in `heatpump_ui.py`.
> The flow mirrors the PV logic: **find_or_create_customer → save_project → add_customer_document**.
> **No** new tables, **no** renaming. Output as a **DEF block** with a complete patch.

## Preliminary Work (AUTO – ONLY REPO-AUTHENTIC ELEMENTS)
1) **Determine KEYSET (must be output before patch)**
   Scan workspace:
   - **UI**: `heatpump_ui.py`, `pdf_ui.py`, `gui.py` (for session keys, snapshot), `components/progress_manager.py`
   - **CRM/DB**: `crm.py`, `database.py`, `init_database.py`
   - **PDF/Output**: `pdf_generator.py` or the code path that creates/names the **HP PDF**
   - **Session/Data**: `project_data["customer_data"]`, `["hp_details"]`, `calculation_results[...]`
   - **Format**: `german_formatting.py` (if UI feedback displays formatted amounts)

   List **only** 1:1 actually existing keys/APIs/columns:
KEYSET:

session keys: [project_data.customer_data, project_data.hp_details, project_data.project_details, calculation_results]

crm api: [find_or_create_customer? save_customer, load_customer, save_project, add_customer_document (or _add_customer_document_db)]

db tables/columns: [customers(id, first_name, last_name, email, ...), projects(id, customer_id, project_name, status, offer_type?, ...), customer_documents(id, customer_id, project_id, path, label, ...)]

pdf api: [create hp offer: real function/helper names from repo]

progress api: [create_progress_bar, update, complete]

markdown
Copy code
**If** something is missing/unclear: **Do not invent anything** – briefly state in **which** file it must (already) exist / be verified.

## Constraints (Repo Rules)
- **One** CRM structure for PV & HP (no new tables/columns).
- Identify customer via `(first_name, last_name, email)`; if exists → **no duplicate**, message "Customer exists".
- Create project (e.g., `project_name = "Heat Pump Offer <Date>"`, `status = "Offer"`); leave fields that only concern PV empty (do not misuse).
- **PDF**: cleanly pass the created **HP PDF** path immediately after generation; **path security** (join/normpath, base-dir-check).
- **Parameterized SQL** (sqlite3 `?` placeholder). **Transaction** around project+document.
- Use **progress bar** instead of `st.spinner`.
- **German**: UI messages/labels in German, short & precise.
- **No** renaming/restructuring of existing names/signatures.

## Implementation (Guidance)
1) In `heatpump_ui.py`, mirror an **HP-CRM block** under the PV-CRM section:
- Use inputs from `st.session_state["project_data"]["customer_data"]`.
- Show progress with `components.progress_manager.create_progress_bar("Saving to CRM…", st.container())`:
  - 10%: Find/create customer if necessary.
  - 40%: Create project (`save_project`), remember `project_id`.
  - 70%: Create/determine **HP PDF**; check/normalize path.
  - 90%: `add_customer_document(customer_id, project_id, pdf_path, label="Heat Pump Offer")`.
  - 100%: `complete("Done.")`.
2) **Duplicate detection**: If customer exists → **no** new creation; display message ("Customer exists, project/document added").
3) **Error handling**: try/except; log technical details, neutral UI error message. Use **transaction** (commit/rollback).
4) **Persistence**: No session resets; leave the page's snapshot/restore intact.

## Output (DEF block – Mandatory)
**DEF**
- Addition in `heatpump_ui.py`: Button "Save customer in CRM" + complete flow (find_or_create_customer → save_project → add_customer_document).
- Affected APIs/files: `crm.py`, `database.py`, `pdf_generator.py` (HP PDF), `components/progress_manager.py`.
- Used keys/columns from **KEYSET**.

**CODE**
- Complete UI section (Streamlit) incl. progress hooks, transaction, parameterized SQL via CRM API.
- Creation/determination of the **HP-PDF path** (repo-compliant function/variable).
- Path normalization/whitelist (join/normpath, base-dir-check).
- German success/info/error messages.
- (Optional) Mini-pytest snippet for the flow (in-memory DB or temp DB).

**INTEGRATION**
- File: `heatpump_ui.py`
- **Position**: **immediately below** the existing PV-CRM section (same UI group/accordion/container).
- If a helper function for path normalization is needed → make it **local** within the block or use an existing util (no global renames).

**VERIFICATION**
1) **New customer**: Click button → customer created, project saved, document associated; success message.
2) **Customer exists**: No duplicate; message "Customer exists, project/document added".
3) **PDF Path**: is in the allowed output directory, file > 0 bytes; path traversal prevented.
4) **Transaction**: Error during document step → no inconsistent DB state (rollback/clean message).
5) **UX**: Progress bar shows steps; no UI resets; page change back/forth → inputs are preserved.