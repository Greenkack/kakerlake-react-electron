// apps/main/src/db/repositories/CustomerDocumentRepository.ts
// Mirrors database.py customer document CRUD functions exactly

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

interface CustomerDocument {
  id?: number;
  customer_id: number;
  project_id?: number | null;
  doc_type?: string | null;
  display_name?: string | null;
  file_name?: string | null;
  absolute_file_path?: string | null;
  uploaded_at?: string | null;
}

export class CustomerDocumentRepository {
  constructor(private db: Database.Database) {}

  // Mirrors database.py:add_customer_document
  async addCustomerDocument(
    customerId: number,
    fileBytes: Uint8Array,
    displayName: string,
    docType: string = 'other',
    projectId?: number,
    suggestedFilename?: string
  ): Promise<number | null> {
    try {
      if (!fileBytes || fileBytes.length === 0) {
        return null;
      }

      // Create customer documents directory if it doesn't exist
      const baseDir = path.join(process.cwd(), 'data', 'customer_docs');
      const customerDir = path.join(baseDir, customerId.toString());
      
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }
      if (!fs.existsSync(customerDir)) {
        fs.mkdirSync(customerDir, { recursive: true });
      }

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = suggestedFilename ? path.extname(suggestedFilename) : '.bin';
      const filename = `${timestamp}_${displayName.replace(/[^a-zA-Z0-9]/g, '_')}${extension}`;
      const absolutePath = path.join(customerDir, filename);

      // Write file
      fs.writeFileSync(absolutePath, fileBytes);

      // Insert database record
      const stmt = this.db.prepare(`
        INSERT INTO customer_documents 
        (customer_id, project_id, doc_type, display_name, file_name, absolute_file_path, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const result = stmt.run(customerId, projectId || null, docType, displayName, filename, absolutePath);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error('Error adding customer document:', error);
      return null;
    }
  }

  // Mirrors database.py:list_customer_documents
  async listCustomerDocuments(customerId: number, docType?: string): Promise<CustomerDocument[]> {
    try {
      let query = 'SELECT * FROM customer_documents WHERE customer_id = ?';
      const params: any[] = [customerId];

      if (docType) {
        query += ' AND doc_type = ?';
        params.push(docType);
      }

      query += ' ORDER BY uploaded_at DESC';

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as CustomerDocument[];
    } catch (error) {
      console.error('Error listing customer documents:', error);
      return [];
    }
  }

  // Mirrors database.py:delete_customer_document
  async deleteCustomerDocument(documentId: number): Promise<boolean> {
    try {
      // Get document info first to delete file
      const getDoc = this.db.prepare('SELECT * FROM customer_documents WHERE id = ?');
      const doc = getDoc.get(documentId) as CustomerDocument | undefined;

      if (doc && doc.absolute_file_path && fs.existsSync(doc.absolute_file_path)) {
        try {
          fs.unlinkSync(doc.absolute_file_path);
        } catch (fileError) {
          console.warn('Could not delete file:', doc.absolute_file_path, fileError);
        }
      }

      // Delete database record
      const stmt = this.db.prepare('DELETE FROM customer_documents WHERE id = ?');
      const result = stmt.run(documentId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting customer document:', error);
      return false;
    }
  }
}
