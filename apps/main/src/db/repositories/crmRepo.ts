import { getDb } from '../connection';

export const crmRepo = {
  saveCustomer(payload: any) {
    const db = getDb();
    const { id, ...rest } = payload || {};
    const json = JSON.stringify(rest || {});
    if (id) {
      db.prepare('INSERT INTO customers(id, data) VALUES(?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(String(id), json);
      return { id };
    } else {
      const insert = db.prepare('INSERT INTO customers(data) VALUES(?)');
      const res = insert.run(json);
      return { id: Number(res.lastInsertRowid) };
    }
  },
  loadCustomer(id: string) {
    const db = getDb();
    const row = db.prepare('SELECT id, data FROM customers WHERE id=?').get(id);
    if (!row) return null;
    return { id: row.id, ...(JSON.parse(row.data||'{}')) };
  },
  listCustomers() {
    const db = getDb();
    const rows = db.prepare('SELECT id, data FROM customers ORDER BY id DESC LIMIT 500').all();
    return rows.map((r: any) => ({ id: r.id, ...(JSON.parse(r.data||'{}')) }));
  },
  deleteCustomer(id: string) {
    const db = getDb();
    db.prepare('DELETE FROM customers WHERE id=?').run(id);
    return { success: true };
  },
  saveProject(payload: any) {
    const db = getDb();
    const { id, customer_id, ...rest } = payload || {};
    const json = JSON.stringify(rest || {});
    if (id) {
      db.prepare('INSERT INTO projects(id, customer_id, data) VALUES(?, ?, ?) ON CONFLICT(id) DO UPDATE SET customer_id=excluded.customer_id, data=excluded.data').run(String(id), String(customer_id||''), json);
      return { id };
    } else {
      const res = db.prepare('INSERT INTO projects(customer_id, data) VALUES(?, ?)').run(String(customer_id||''), json);
      return { id: Number(res.lastInsertRowid) };
    }
  },
  loadProject(id: string) {
    const db = getDb();
    const row = db.prepare('SELECT id, customer_id, data FROM projects WHERE id=?').get(id);
    if (!row) return null;
    return { id: row.id, customer_id: row.customer_id, ...(JSON.parse(row.data||'{}')) };
  },
  listProjectsByCustomer(customerId: string) {
    const db = getDb();
    const rows = db.prepare('SELECT id, customer_id, data FROM projects WHERE customer_id=? ORDER BY id DESC').all(customerId);
    return rows.map((r: any) => ({ id: r.id, customer_id: r.customer_id, ...(JSON.parse(r.data||'{}')) }));
  },
  deleteProject(id: string) {
    const db = getDb();
    db.prepare('DELETE FROM projects WHERE id=?').run(id);
    return { success: true };
  },
  addCustomerDocument(payload: any) {
    const db = getDb();
    const { customer_id, project_id, path, name, type } = payload || {};
    db.prepare('INSERT INTO documents(customer_id, project_id, path, name, type) VALUES(?,?,?,?,?)').run(String(customer_id||''), project_id?String(project_id):null, String(path||''), String(name||''), String(type||'other'));
    return { success: true };
  }
};
