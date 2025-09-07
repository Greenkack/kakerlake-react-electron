/// <reference types="electron" />
import { contextBridge, ipcRenderer } from 'electron';

// Standardisiertes Produktmodell (deutsche Keys, feste Reihenfolge app-weit)
type ProductModel = {
  id: number;
  kategorie: string;
  produkt_modell: string;
  hersteller: string;
  preis_stück?: number;
  pv_modul_leistung?: number;
  kapazitaet_speicher_kwh?: number;
  wr_leistung_kw?: number;
  ladezyklen_speicher?: number;
  garantie_zeit?: number;
  mass_laenge?: number;
  mass_breite?: number;
  mass_gewicht_kg?: number;
  wirkungsgrad_prozent?: number;
  hersteller_land?: string;
  beschreibung_info?: string;
  eigenschaft_info?: string;
  spezial_merkmal?: string;
  rating_null_zehn?: number;
  image_base64?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const solarAPI = {
  // PV
  getPVManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_pv_manufacturers'),
  getPVModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_pv_models', m),
  // Inverter
  getInverterManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_inverter_manufacturers'),
  getInverterModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_inverter_models', m),
  // Storage
  getStorageManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_storage_manufacturers'),
  getStorageModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_storage_models', m),
  // Additional
  getWallboxManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_wallbox_manufacturers'),
  getWallboxModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_wallbox_models', m),
  getEMSManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_ems_manufacturers'),
  getEMSModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_ems_models', m),
  getOptimizerManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_optimizer_manufacturers'),
  getOptimizerModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_optimizer_models', m),
  getCarportManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_carport_manufacturers'),
  getCarportModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_carport_models', m),
  getEmergencyPowerManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_emergency_power_manufacturers'),
  getEmergencyPowerModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_emergency_power_models', m),
  getAnimalProtectionManufacturers: (): Promise<string[]> => ipcRenderer.invoke('solar:get_animal_protection_manufacturers'),
  getAnimalProtectionModelsByManufacturer: (m: string): Promise<ProductModel[]> => ipcRenderer.invoke('solar:get_animal_protection_models', m),
  // Save
  saveConfiguration: (cfg: Record<string, unknown>): Promise<{ success: boolean }> => ipcRenderer.invoke('solar:save_config', cfg),
};

contextBridge.exposeInMainWorld('solarAPI', solarAPI);

// CRM & Projects API
type Customer = Record<string, unknown>;
type Project = Record<string, unknown>;

const crmAPI = {
  listCustomers: (): Promise<Customer[]> => ipcRenderer.invoke('crm:list_customers'),
  getCustomer: (id: number): Promise<Customer | null> => ipcRenderer.invoke('crm:get_customer', id),
  saveCustomer: (data: Customer): Promise<{ id: number }> => ipcRenderer.invoke('crm:save_customer', data),
  deleteCustomer: (id: number): Promise<{ success: boolean }> => ipcRenderer.invoke('crm:delete_customer', id),
};

const projectsAPI = {
  listForCustomer: (customerId: number): Promise<Project[]> => ipcRenderer.invoke('projects:list_for_customer', customerId),
  get: (id: number): Promise<Project | null> => ipcRenderer.invoke('projects:get', id),
  save: (data: Project): Promise<{ id: number }> => ipcRenderer.invoke('projects:save', data),
  delete: (id: number): Promise<{ success: boolean }> => ipcRenderer.invoke('projects:delete', id),
};

contextBridge.exposeInMainWorld('crmAPI', crmAPI);
contextBridge.exposeInMainWorld('projectsAPI', projectsAPI);

// Import API (Datei- und Datenimporte)
const importAPI = {
  productsFromFile: (filePath: string, companyId?: number, dryRun: boolean = false) =>
    ipcRenderer.invoke('import:products_from_file', { file_path: filePath, company_id: companyId, dry_run: dryRun }),
  customersFromFile: (filePath: string, dryRun: boolean = false) =>
    ipcRenderer.invoke('import:customers_from_file', { file_path: filePath, dry_run: dryRun }),
  addCustomerDocumentFromPath: (customerId: number, projectId: number | null, filePath: string, displayName?: string, docType: string = 'other') =>
    ipcRenderer.invoke('crm:add_customer_document_from_path', { customer_id: customerId, project_id: projectId, file_path: filePath, display_name: displayName, doc_type: docType }),
};

contextBridge.exposeInMainWorld('importAPI', importAPI);

// Produkte-API (manuelle Pflege)
const productsAPI = {
  addSingle: (data: Record<string, unknown>) => ipcRenderer.invoke('products:add_single', data),
  updateSingle: (id: number, data: Record<string, unknown>) => ipcRenderer.invoke('products:update_single', id, data),
  list: (payload?: { category?: string; company_id?: number }) => ipcRenderer.invoke('products:list', payload ?? {}),
  deleteSingle: (id: number) => ipcRenderer.invoke('products:delete_single', id),
};

contextBridge.exposeInMainWorld('productsAPI', productsAPI);

// System Helfer
const systemAPI = {
  openFileDialog: (filters?: Array<{ name: string; extensions: string[] }>, allowMultiple: boolean = false) =>
    ipcRenderer.invoke('system:show_open_dialog', {
      properties: ['openFile', ...(allowMultiple ? ['multiSelections'] : [])],
      filters,
    }) as Promise<{ canceled: boolean; filePaths: string[] }>,
  pythonInfo: () => ipcRenderer.invoke('system:python_info') as Promise<{ found: boolean; command?: string; version?: string; error?: string }>,
};

contextBridge.exposeInMainWorld('systemAPI', systemAPI);

export type SolarAPI = typeof solarAPI;
export type CrmAPI = typeof crmAPI;
export type ProjectsAPI = typeof projectsAPI;
export type ImportAPI = typeof importAPI;
export type ProductsAPI = typeof productsAPI;
export type SystemAPI = typeof systemAPI;
