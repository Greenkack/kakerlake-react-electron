---
mode: "agent"
description: "DB/CRM Toolset – Customers/Projects/Documents (one structure)"
tools: ["file-system","markdown"]
---

# Toolset: DB/CRM

> Focus: `crm.py`, `database.py`, `init_database.py`.

## Tasks
- **find_or_create_customer** via (First Name, Last Name, Email).
- **save_project** (Status "Offer"), **add_customer_document** (path secure).
- **HP & PV**: same tables, **no** new schemas.

## Rules
- Parameterized SQL (`?`), transactions, indices only via migration scripts.
- Path whitelist, no user-controlled absolute paths.
- German-language UI notifications.

## Output
- DEF, patch, integration, tests (In-Memory/Temp-DB).