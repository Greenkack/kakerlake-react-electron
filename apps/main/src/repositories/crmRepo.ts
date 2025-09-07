// apps/main/src/db/repositories/crmRepo.ts
// Spiegelt die Python-Funktionen wie save_customer(), save_project(), load_customer(), load_project() etc.
// Python-Referenz: crm.py initialisiert Tabellen customers/projects und verknüpft PDF-Pfade. 
// (Siehe Struktur-PDF) 
import { getDb } from '../connection';
import { Customer, Project, DocumentLink, ID } from '../../../../packages/core/src/types/db';
import { randomUUID } from 'node:crypto';

function nowISO() { return new Date().toISOString(); }

export const crmRepo = {
  saveCustomer(input: Omit<Customer, 'id'|'created_at'|'updated_at'> & Partial<Pick<Customer,'id'>>): Customer {
    const db = getDb();
    const id = input.id ?? randomUUID();
    const created = nowISO();
    const updated = created;

    const upsert = db.prepare(`
      INSERT INTO customers (id, name, email, phone, address, created_at, updated_at)
      VALUES (@id, @name, @email, @phone, @address, @created_at, @updated_at)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name, email=excluded.email, phone=excluded.phone, address=excluded.address,
        updated_at=excluded.updated_at
    `);
    upsert.run({ id, name: input.name, email: input.email ?? null, phone: input.phone ?? null, address: input.address ?? null, created_at: created, updated_at: updated });

    return db.prepare(`SELECT * FROM customers WHERE id=?`).get(id) as Customer;
  },

  saveProject(input: Omit<Project, 'id'|'created_at'|'updated_at'> & Partial<Pick<Project,'id'>>): Project {
    const db = getDb();
    const id = input.id ?? randomUUID();
    const created = nowISO();
    const updated = created;

    const upsert = db.prepare(`
      INSERT INTO projects (id, customer_id, title, status, notes, created_at, updated_at)
      VALUES (@id, @customer_id, @title, @status, @notes, @created_at, @updated_at)
      ON CONFLICT(id) DO UPDATE SET
        customer_id=excluded.customer_id, title=excluded.title, status=excluded.status, notes=excluded.notes,
        updated_at=excluded.updated_at
    `);
    upsert.run({ id, customer_id: input.customer_id, title: input.title, status: input.status, notes: input.notes ?? null, created_at: created, updated_at: updated });

    return db.prepare(`SELECT * FROM projects WHERE id=?`).get(id) as Project;
  },

  loadCustomer(id: ID): Customer | undefined {
    return getDb().prepare(`SELECT * FROM customers WHERE id=?`).get(id) as Customer | undefined;
  },

  loadProject(id: ID): Project | undefined {
    return getDb().prepare(`SELECT * FROM projects WHERE id=?`).get(id) as Project | undefined;
  },

  listCustomers(): Customer[] {
    return getDb().prepare(`SELECT * FROM customers ORDER BY updated_at DESC`).all() as Customer[];
  },

  listProjectsByCustomer(customerId: ID): Project[] {
    return getDb().prepare(`SELECT * FROM projects WHERE customer_id=? ORDER BY updated_at DESC`).all(customerId) as Project[];
  },

  deleteCustomer(id: ID) {
    getDb().prepare(`DELETE FROM customers WHERE id=?`).run(id);
  },

  deleteProject(id: ID) {
    getDb().prepare(`DELETE FROM projects WHERE id=?`).run(id);
  },

  // Verknüpft erzeugte PDFs mit Kunden/Projekten (entspricht add_customer_document in Python)
  addCustomerDocument(doc: Omit<DocumentLink,'id'|'created_at'> & Partial<Pick<DocumentLink,'id'>>): DocumentLink {
    const db = getDb();
    const id = doc.id ?? randomUUID();
    const created = nowISO();
    db.prepare(`
      INSERT INTO documents (id, customer_id, project_id, kind, path, meta_json, created_at)
      VALUES (@id, @customer_id, @project_id, @kind, @path, @meta_json, @created_at)
    `).run({ id, customer_id: doc.customer_id, project_id: doc.project_id ?? null, kind: doc.kind, path: doc.path, meta_json: doc.meta_json ?? null, created_at: created });
    return db.prepare(`SELECT * FROM documents WHERE id=?`).get(id) as DocumentLink;
  }
};
