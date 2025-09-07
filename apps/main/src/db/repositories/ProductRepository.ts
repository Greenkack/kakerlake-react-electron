// apps/main/src/db/repositories/ProductRepository.ts
// Mirrors product_db.py CRUD functions exactly

import Database from 'better-sqlite3';

// Local Product type fallback to avoid depending on the monorepo package during build.
// Contains all fields from Python product_db.py to ensure full compatibility
export interface Product {
  id?: number | null;
  category?: string | null;
  model_name?: string | null;
  brand?: string | null;
  price_euro?: number | null;
  capacity_w?: number | null;
  storage_power_kw?: number | null;
  power_kw?: number | null;
  max_cycles?: number | null;
  warranty_years?: number | null;
  length_m?: number | null;
  width_m?: number | null;
  weight_kg?: number | null;
  efficiency_percent?: number | null;
  origin_country?: string | null;
  description?: string | null;
  pros?: string | null;
  cons?: string | null;
  rating?: number | null;
  image_base64?: string | null;
  datasheet_link_db_path?: string | null;
  additional_cost_netto?: number | null;
  company_id?: number | null;
  // NEW: Module detail fields from Python
  cell_technology?: string | null;
  module_structure?: string | null;
  cell_type?: string | null;
  version?: string | null;
  module_warranty_text?: string | null;
  labor_hours?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export class ProductRepository {
  constructor(private db: Database.Database) {}

  // Mirrors product_db.py:add_product with full validation
  async addProduct(productData: Product): Promise<number | null> {
    try {
      const now = new Date().toISOString();
      
      // Validate required fields (mirrors Python validation)
      if (!productData.category || !productData.model_name) {
        console.error('ProductRepository.addProduct: category and model_name are required');
        return null;
      }

      // Check for duplicate model_name (mirrors Python validation)
      const existingProduct = this.db.prepare('SELECT id FROM products WHERE model_name = ?')
        .get(productData.model_name);
      if (existingProduct) {
        console.error(`ProductRepository.addProduct: Product with model_name '${productData.model_name}' already exists`);
        return null;
      }

      // Prepare data with all Python columns
      const allDbColumns = [
        'category', 'model_name', 'brand', 'price_euro', 'capacity_w', 'storage_power_kw', 
        'power_kw', 'max_cycles', 'warranty_years', 'length_m', 'width_m', 'weight_kg', 
        'efficiency_percent', 'origin_country', 'description', 'pros', 'cons', 'rating', 
        'image_base64', 'datasheet_link_db_path', 'additional_cost_netto', 'company_id',
        'cell_technology', 'module_structure', 'cell_type', 'version', 'module_warranty_text',
        'labor_hours', 'created_at', 'updated_at'
      ];

      const insertData: Record<string, any> = {};
      
      // Process each column (mirrors Python logic)
      for (const colName of allDbColumns) {
        if (colName === 'created_at' || colName === 'updated_at') {
          insertData[colName] = now;
        } else if (colName in productData && productData[colName] !== undefined) {
          insertData[colName] = productData[colName];
        } else {
          // Set to null for optional fields (mirrors Python logic)
          insertData[colName] = null;
        }
      }

      const fields = Object.keys(insertData);
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map(k => insertData[k]);

      const stmt = this.db.prepare(`INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`);
      const result = stmt.run(...values);
      
      const productId = result.lastInsertRowid as number;
      console.log(`ProductRepository.addProduct: Product '${productData.model_name}' successfully added with ID ${productId}`);
      return productId;
    } catch (error) {
      console.error('ProductRepository.addProduct: SQLite error:', error);
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

  // Mirrors product_db.py:get_product_by_model_name (needed for bulk import)
  async getProductByModelName(modelName: string): Promise<Product | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM products WHERE model_name = ?');
      const row = stmt.get(modelName) as Product | undefined;
      return row || null;
    } catch (error) {
      console.error('Error getting product by model name:', error);
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
