---
applyTo: "**/*"
description: "Security and Robustness Rules (OmersKakerlake, repo-Keys & -Paths)"
---

# Security & Robustness – OmersKakerlake

> Goal: All contributions must cleanly validate inputs, securely store/process data,
> secure PDF/file operations, and use **only** repo-compliant tables/keys/paths.

## 1) Input Validation (Streamlit/UI & Backend)
- **Check types/ranges/required fields** before calculating or saving.
  - Customer fields (CRM): `first_name`, `last_name` → not empty; `email` → RFC 5322 regex; `phone` → allowed format.
  - Project fields: `project_name` → not empty; flags (PV/HP) boolean; amounts ≥ 0.
  - Calculations: discounts/percentages in [0, 100], quantities as integers ≥ 0.
- **Sanitizing** for free text (e.g., `payment_terms`): max length, filter forbidden control characters (`\x00`, etc.).
- **File uploads** (logos/documents): only whitelist extensions (`.pdf`, `.png`, `.jpg`, `.jpeg`), max size (e.g., 10 MB),
  check MIME type. No SVG as images (XSS vector).
- **YAML** must only be read with `safe_load` (coordinates): no object deserialization.

## 2) Database & SQL (SQLite via `database.py` / `crm.py`)
- **Always use parameterized queries** (`?` placeholder for sqlite3), **never** string-concatenated SQL.
- **Tables/columns only according to the repo** (no fantasy fields):
  - `customers(id, first_name, last_name, email, phone, created_at, ...)`
  - `projects(id, customer_id, project_name, status, offer_type, created_at, ...)`
  - `customer_documents(id, customer_id, project_id, path, label, created_at, ...)`
- **Find/create customer**: Search via `(first_name, last_name, email)`; avoid duplicates.
- **Use transactions** for multi-step operations (create project → reference document).
- **Handle errors**: Log exceptions (see Logging), UI receives clear but data-sparse messages.

## 3) Paths & Files (PDF/Logos/Coordinates)
- **Path Whitelisting & Joining**:
  - Firmly define base paths:
    - Templates: `pdf_templates_static/notext/`
    - Coordinates: `coords/`, `coords_wp/`
    - Outputs/Documents: e.g., `documents/`
  - **Only** use `os.path.join(BASE, rel_path)` + `os.path.normpath()` and check:
    - `result_path.startswith(BASE_ABS)` — otherwise **reject**.
  - **Do not** accept user-controlled absolute paths.
- **Normalize file names** (slug from `customer_name`, append timestamp).
- **File size limit** & **time limit** per generation step (split long runs into sub-sections).
- **Streams instead of full reads**: Merge/write PDFs page by page; close buffers early.
- **Hash/Integrity** optional: SHA-256 for stored documents (verifiable in CRM UI).

## 4) PDF Engine (repo-compliant, fault-tolerant)
- **Templates**:
  - PV: `nt_nt_01..07` (Coords `coords/seite1.yml..seite7.yml`)
  - HP: `hp_nt_01..07` (Coords `coords_wp/wp_seite1.yml..wp_seite7.yml`; templates up to `_16` available, but only use if content/coords exist)
- **Extras ≥ Page 8** only if selected in UI; missing assets → **no crash**, instead **skip** or use **4-page fallback**.
- **Final Page**: Summation blocks/Date/Location/Signature/Payment terms from **existing keys**:
  - `calculation_results[...]` with keys like `brutto_total`, `mwst_summe`, `rabatte_summe`, `nachlaesse_summe`,
    `aufschlaege_summe`, `extras_summe`, `zubehoer_summe`, `endbetrag`.
- **Font Handling**: Do not load embedded, insecure fonts from external sources; only use project-known resources.
- **Image data** (logos): re-encode into a safe format (PNG/JPEG), no metadata leaks (strip EXIF optionally).

## 5) Payment Terms (legally sensitive)
- Calculate amounts/percentages **consistently** with the final amount (`endbetrag`).
- Validation: Sum of all partial payments (fixed + %) **must not** exceed `endbetrag`; remainder must be logically correct.
- Free-text clauses: Length limit + simple blacklist (no HTML/JS, no URLs), **no** interpretation in the backend (only as text).

## 6) Secrets, Configuration, Logging
- **No secrets in code/repo** (API keys, etc.). Use **environment variables**.
- **Logging**:
  - Log technical errors (to file or STDOUT), **no** personal data (GDPR minimization).
  - Log levels: INFO/ERROR; Debug only locally.
- **Error Shadowing**:
  - Log internal details, user sees a generic notification box (e.g., "PDF creation failed; please try again.").
- **Headless/Batch**: Identical security as interactive mode; no special paths/unsanitized inputs.

## 7) Resources & DoS Protection
- **Rate limits** for expensive operations (multi-PDF generation).
- **Termination conditions** (watchdog): if runtime is too long → terminate cleanly + report progress.
- **Memory Leak Shield**: Explicitly close/release resources (`with` contexts), dereference large objects.

## 8) Tests & Checks
- **Security Tests**:
  - SQL injection attempts → thwarted (parameterized).
  - Path traversal (`../../`) → blocked.
  - Oversized uploads → rejected.
  - YAML with dangerous tags → `safe_load` prevents execution.
- **Robustness**:
  - Missing templates/coords → 4-page fallback, no crash.
  - Invalid payment terms → UI error message, no PDF output.
- **Repro Workflows**:
  - "Save customer in CRM": new/existing customer → create project → reference PDF document (path check OK).