# TASKS.md — Schritt-für-Schritt-Aufträge für die KI

> Lies zuerst PROMPT.md und befolge es als System-Regelwerk. Arbeite die Phasen nacheinander ab. Nach jeder Phase: kurze Checkliste abhaken, dann committen.

## Phase 0 — Dev-Start stabilisieren
**Prompt an @workspace:**
- Lies ./PROMPT.md und bestätige mit einem knappen 3-Punkte-Plan.
- Prüfe Root-scripts in package.json. Stelle sicher:
  - "dev": Renderer auf 127.0.0.1:5173 (strictPort), dann wait-on → Main.
  - "build": core → renderer → main.
- Mache keine Formatänderungen, nur die genannten Scripts ergänzen.
- Liefere nur Diff/Patche.

**Abnahme:** `yarn dev` zeigt kein weißes Fenster; Renderer antwortet auf 5173.

---

## Phase 1 — DB-Extraktion (Python → schema.json)
**Prompt an @workspace:**
- Scanne alle Python-Dateien und *.sql im Repo (inkl. Unterordner).
- Finde **alle** `CREATE TABLE ...` inkl. Spalten/Typen/PK/FK/UNIQUE/INDEX.
- Wenn Tabellen nur dynamisch erstellt werden: suche auch `cursor.execute("CREATE TABLE ...")`.
- Erzeuge **schema.json** im Repo-Root nach diesem Format:
  ```json
  { "tables": { "tname": { "columns": { "col": { "type": "TEXT", "pk": true, "notNull": true, "default": "..." } }, "indexes": ["...", "..."], "fks": [ {"column": "x", "refTable": "y", "refColumn": "id", "onDelete": "CASCADE"} ] } }, "crud": {} }
