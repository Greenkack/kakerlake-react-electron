// apps/main/src/ipc/CrmHandlers.ts
// IPC handlers for CRM operations - mirrors crm.py functions exactly

import { ipcMain } from 'electron';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: better-sqlite3 has no bundled declaration file in this project
import Database from 'better-sqlite3';
import { CustomerRepository } from '../db/repositories/CustomerRepository';
import { ProjectRepository } from '../db/repositories/ProjectRepository';
import { CustomerDocumentRepository } from '../db/repositories/CustomerDocumentRepository';

export function registerCrmHandlers(db: Database.Database) {
  const customerRepo = new CustomerRepository(db);
  const projectRepo = new ProjectRepository(db);
  const docRepo = new CustomerDocumentRepository(db);

  // Customer CRUD - mirrors crm.py functions exactly
  ipcMain.removeAllListeners('crm:save_customer');
  ipcMain.handle('crm:save_customer', async (event, customerData) => {
    return await customerRepo.saveCustomer(customerData);
  });

  ipcMain.removeAllListeners('crm:load_customer');
  ipcMain.handle('crm:load_customer', async (event, customerId) => {
    return await customerRepo.loadCustomer(customerId);
  });

  ipcMain.removeAllListeners('crm:delete_customer');
  ipcMain.handle('crm:delete_customer', async (event, customerId) => {
    return await customerRepo.deleteCustomer(customerId);
  });

  ipcMain.removeAllListeners('crm:load_all_customers');
  ipcMain.handle('crm:load_all_customers', async (event) => {
    return await customerRepo.loadAllCustomers();
  });

  // Project CRUD - mirrors crm.py functions exactly
  ipcMain.removeAllListeners('crm:save_project');  
  ipcMain.handle('crm:save_project', async (event, projectData) => {
    return await projectRepo.saveProject(projectData);
  });

  ipcMain.removeAllListeners('crm:load_project');
  ipcMain.handle('crm:load_project', async (event, projectId) => {
    return await projectRepo.loadProject(projectId);
  });

  ipcMain.removeAllListeners('crm:delete_project');
  ipcMain.handle('crm:delete_project', async (event, projectId) => {
    return await projectRepo.deleteProject(projectId);
  });

  ipcMain.removeAllListeners('crm:load_projects_for_customer');
  ipcMain.handle('crm:load_projects_for_customer', async (event, customerId) => {
    return await projectRepo.loadProjectsForCustomer(customerId);
  });

  // Customer Document CRUD - mirrors database.py functions exactly
  ipcMain.removeAllListeners('crm:add_customer_document');
  ipcMain.handle('crm:add_customer_document', async (event, customerId, fileBytes, displayName, docType, projectId, suggestedFilename) => {
    return await docRepo.addCustomerDocument(customerId, fileBytes, displayName, docType, projectId, suggestedFilename);
  });

  ipcMain.removeAllListeners('crm:list_customer_documents');
  ipcMain.handle('crm:list_customer_documents', async (event, customerId, docType) => {
    return await docRepo.listCustomerDocuments(customerId, docType);
  });

  ipcMain.removeAllListeners('crm:delete_customer_document');
  ipcMain.handle('crm:delete_customer_document', async (event, documentId) => {
    return await docRepo.deleteCustomerDocument(documentId);
  });
}
