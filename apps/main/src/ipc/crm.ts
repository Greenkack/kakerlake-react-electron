import { ipcMain } from 'electron';
import { crmRepo } from '../db/repositories/crmRepo';
import { Customer, Project, DocumentLink } from '../../../../packages/core/src/types/db';

export function registerCrmIpcHandlers() {
  ipcMain.handle('crm.saveCustomer', (_e, payload: Partial<Customer>) => crmRepo.saveCustomer(payload as any));
  ipcMain.handle('crm.saveProject',  (_e, payload: Partial<Project>)  => crmRepo.saveProject(payload as any));
  ipcMain.handle('crm.loadCustomer', (_e, id: string) => crmRepo.loadCustomer(id));
  ipcMain.handle('crm.loadProject',  (_e, id: string) => crmRepo.loadProject(id));
  ipcMain.handle('crm.listCustomers', () => crmRepo.listCustomers());
  ipcMain.handle('crm.listProjectsByCustomer', (_e, customerId: string) => crmRepo.listProjectsByCustomer(customerId));
  ipcMain.handle('crm.deleteCustomer', (_e, id: string) => crmRepo.deleteCustomer(id));
  ipcMain.handle('crm.deleteProject',  (_e, id: string) => crmRepo.deleteProject(id));
  ipcMain.handle('crm.addCustomerDocument', (_e, payload: Partial<DocumentLink>) => crmRepo.addCustomerDocument(payload as any));
}
