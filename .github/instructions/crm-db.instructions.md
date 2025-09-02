---
applyTo: "**/(crm|database).py"
description: "CRM/DB: Customers, Projects, Documents (common structure, PV & HP, repo-Keys)"
---

# CRM/DB Rules – Repo-Compliant

## KEY-COMPLIANCE (Mandatory)
- **Do not invent new tables or fields.**
- **Before every code suggestion**:
  - Scan `crm.py`, `database.py`, and if applicable, `init_database.py`.
  - List all **tables** and **column names** as a `KEYSET:` block:
    - Tables: `customers`, `projects`, `customer_documents` (if others exist → adopt from code).
    - Columns: exactly as in the repo (`id`, `first_name`, `last_name`, `email`, `phone`, `project_name`, `status`, `created_at`, …).
- **Exclusively** use these keys/columns, otherwise abort.

## Structure (PV & HP)
- **One** customer/project structure for PV **and** HP.
- **No** separate CRM.
- `customers` contains all customers (regardless of PV, HP, or both).
- `projects` references a customer via `customer_id` and stores offer metadata:
  - e.g., `project_name`, `status`, `created_at`, `offer_type` (if present in the repo).
- `customer_documents` references the customer/project via `customer_id` + `project_id` and stores the path/metadata of the PDF.

## Customer Logic
- Uniquely find customers by `(first_name, last_name, email)`.
- If not present → create via `crm.save_customer()`.
- If present → no duplicate; return message "Customer exists".

## Project Logic
- Always **save the project first** (`crm.save_project()` or similar).
- Afterwards, reference the PDF (PV or HP) via `database.add_customer_document()` or `_add_customer_document_db()`.
- Always store PDF files with a timestamp/project reference in the path (`documents/<customer_id>/<project_id>_type.pdf`).

## Security
- **Always use parameterized SQL statements** (`?` placeholder for sqlite3).
- **No string concatenation** in queries.
- Check that tables exist via `create_tables_crm()` or `ensure_*` methods.

## Migrations
- No silent changes to tables.
- **All schema changes** (new columns, constraints) → separate migration scripts.
- Never use `ALTER TABLE` directly in production code, only in migrations.

## Extensions
- Use `offer_type` or similar flags to distinguish between PV and HP (if present in the repo).
- If both (PV+HP) are in one project: store this cleanly in the project record, **not a second table**.
- Documents: Pass label or category from parameters (e.g., `"PV Offer"`, `"HP Offer"`), but only if repo fields already provide for this.

## Tests
- Test insert + select for customer/project/documents.
- Check that HP PDFs are saved in the CRM just like PV PDFs.
- Check duplicate handling: customer is not created twice.