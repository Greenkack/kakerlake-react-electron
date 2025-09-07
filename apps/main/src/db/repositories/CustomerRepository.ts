// apps/main/src/db/repositories/CustomerRepository.ts
// Mirrors crm.py customer CRUD functions exactly

import Database from 'better-sqlite3';

/**
 * Local Customer type fallback to avoid depending on external package paths.
 * Contains commonly used fields and a catch-all index signature so the
 * repository can access arbitrary customer fields produced by other parts
 * of the app without compile errors.
 */
export interface Customer {
  id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  salutation?: string | null;
  title?: string | null;
  company_name?: string | null;
  address?: string | null;
  house_number?: string | null;
  zip_code?: string | null;
  city?: string | null;
  state?: string | null;
  region?: string | null;
  email?: string | null;
  phone_landline?: string | null;
  phone_mobile?: string | null;
  last_updated?: string | null;
  [key: string]: any;
}

export class CustomerRepository {
  constructor(private db: Database.Database) {}

  // Mirrors crm.py:save_customer
  async saveCustomer(customerData: Customer): Promise<number | null> {
    try {
      const now = new Date().toISOString();
      const sanitizedData = {
        ...customerData,
        last_updated: now,
        first_name: (customerData.first_name || '').trim() || 'Interessent',
        last_name: (customerData.last_name || '').trim() || 'Unbekannt',
      };

      // Normalize optional strings
      for (const key of ['salutation', 'title', 'company_name', 'address', 'house_number', 
                          'zip_code', 'city', 'state', 'region', 'email', 'phone_landline', 'phone_mobile']) {
        if (sanitizedData[key] !== undefined && sanitizedData[key] !== null) {
          sanitizedData[key] = String(sanitizedData[key]).trim();
        }
      }

      if (sanitizedData.id) {
        // Update existing customer
        const fields = Object.keys(sanitizedData).filter(k => k !== 'id');
        const setClause = fields.map(k => `${k} = ?`).join(', ');
        const values = fields.map(k => sanitizedData[k]);
        values.push(sanitizedData.id);

        const stmt = this.db.prepare(`UPDATE customers SET ${setClause} WHERE id = ?`);
        stmt.run(...values);
        return sanitizedData.id;
      } else {
        // Insert new customer
        const fields = Object.keys(sanitizedData).filter(k => k !== 'id');
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(k => sanitizedData[k]);

        const stmt = this.db.prepare(`INSERT INTO customers (${fields.join(', ')}) VALUES (${placeholders})`);
        const result = stmt.run(...values);
        return result.lastInsertRowid as number;
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      return null;
    }
  }

  // Mirrors crm.py:load_customer
  async loadCustomer(customerId: number): Promise<Customer | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM customers WHERE id = ?');
      const row = stmt.get(customerId) as Customer | undefined;
      return row || null;
    } catch (error) {
      console.error('Error loading customer:', error);
      return null;
    }
  }

  // Mirrors crm.py:delete_customer
  async deleteCustomer(customerId: number): Promise<boolean> {
    try {
      // Delete related projects first (cascade)
      const deleteProjects = this.db.prepare('DELETE FROM projects WHERE customer_id = ?');
      deleteProjects.run(customerId);

      // Delete customer
      const deleteCustomer = this.db.prepare('DELETE FROM customers WHERE id = ?');
      const result = deleteCustomer.run(customerId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }

  // Mirrors crm.py:load_all_customers
  async loadAllCustomers(): Promise<Customer[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM customers');
      return stmt.all() as Customer[];
    } catch (error) {
      console.error('Error loading all customers:', error);
      return [];
    }
  }
}
