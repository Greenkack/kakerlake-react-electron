// apps/main/src/ipc/ProductHandlers.ts  
// IPC handlers for Product operations - mirrors product_db.py functions exactly

import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { ProductRepository } from '../db/repositories/ProductRepository';

export function registerProductHandlers(db: Database.Database) {
  const productRepo = new ProductRepository(db);

  // Product CRUD - mirrors product_db.py functions exactly
  ipcMain.handle('products:add_product', async (event, productData) => {
    return await productRepo.addProduct(productData);
  });

  ipcMain.handle('products:list_products', async (event, category, companyId) => {
    return await productRepo.listProducts(category, companyId);
  });

  ipcMain.handle('products:get_product_by_id', async (event, productId) => {
    return await productRepo.getProductById(productId);
  });

  ipcMain.handle('products:update_product', async (event, productId, productData) => {
    return await productRepo.updateProduct(productId, productData);
  });

  ipcMain.handle('products:delete_product', async (event, productId) => {
    return await productRepo.deleteProduct(productId);
  });
}
