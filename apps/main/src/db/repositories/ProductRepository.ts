// apps/main/src/db/repositories/ProductRepository.ts
// Mirrors product_db.py CRUD functions exactly

import Database from 'better-sqlite3';
import { Product } from '../../../../packages/core/src/types/db';

export class ProductRepository {
  constructor(private db: Database.Database) {}

  // Mirrors product_db.py:add_product
  async addProduct(productData: Product): Promise<number | null> {
    try {
      const now = new Date().toISOString();
      const sanitizedData = {
        ...productData,
        created_at: productData.created_at || now,
        updated_at: now,
      };

      // Remove undefined/null values, let database handle defaults
      const cleanData = Object.fromEntries(
        Object.entries(sanitizedData).filter(([_, value]) => value !== undefined && value !== null)
      );

      const fields = Object.keys(cleanData);
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map(k => cleanData[k]);

      const stmt = this.db.prepare(`INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`);
      const result = stmt.run(...values);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  }

  // Mirrors product_db.py:list_products
  async listProducts(category?: string, companyId?: number): Promise<Product[]> {
    try {
      let query = 'SELECT * FROM products';
      const params: any[] = [];

      const conditions: string[] = [];
      if (category) {
        conditions.push('category = ?');
        params.push(category);
      }
      if (companyId !== undefined) {
        conditions.push('company_id = ?');
        params.push(companyId);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY brand, model_name';

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Product[];
    } catch (error) {
      console.error('Error listing products:', error);
      return [];
    }
  }

  // Mirrors product_db.py:get_product_by_id
  async getProductById(productId: number): Promise<Product | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?');
      const row = stmt.get(productId) as Product | undefined;
      return row || null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  }

  // Mirrors product_db.py:update_product
  async updateProduct(productId: number, productData: Product): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const sanitizedData = {
        ...productData,
        updated_at: now,
      };

      // Remove undefined/null values and id
      const cleanData = Object.fromEntries(
        Object.entries(sanitizedData).filter(([key, value]) => 
          key !== 'id' && value !== undefined && value !== null
        )
      );

      const fields = Object.keys(cleanData);
      const setClause = fields.map(k => `${k} = ?`).join(', ');
      const values = fields.map(k => cleanData[k]);
      values.push(productId);

      const stmt = this.db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`);
      const result = stmt.run(...values);
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  // Mirrors product_db.py:delete_product
  async deleteProduct(productId: number): Promise<boolean> {
    try {
      const stmt = this.db.prepare('DELETE FROM products WHERE id = ?');
      const result = stmt.run(productId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}
