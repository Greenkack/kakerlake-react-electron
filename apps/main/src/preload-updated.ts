// apps/main/src/preload.ts
// Preload bridge for exposing IPC APIs to renderer

import { contextBridge, ipcRenderer } from 'electron';
import { Customer, Project, Product, CustomerDocument } from '../../../packages/core/src/types/db';

// Define the API surface exposed to the renderer
const API = {
  // CRM APIs
  crm: {
    saveCustomer: (customerData: Customer) => ipcRenderer.invoke('crm:saveCustomer', customerData),
    loadCustomer: (customerId: number) => ipcRenderer.invoke('crm:loadCustomer', customerId),
    deleteCustomer: (customerId: number) => ipcRenderer.invoke('crm:deleteCustomer', customerId),
    loadAllCustomers: () => ipcRenderer.invoke('crm:loadAllCustomers'),
  },

  // Project APIs
  projects: {
    saveProject: (projectData: Project) => ipcRenderer.invoke('projects:saveProject', projectData),
    loadProject: (projectId: number) => ipcRenderer.invoke('projects:loadProject', projectId),
    deleteProject: (projectId: number) => ipcRenderer.invoke('projects:deleteProject', projectId),
    loadProjectsForCustomer: (customerId: number) => ipcRenderer.invoke('projects:loadProjectsForCustomer', customerId),
  },

  // Product APIs  
  products: {
    addProduct: (productData: Product) => ipcRenderer.invoke('products:addProduct', productData),
    listProducts: (filters?: any) => ipcRenderer.invoke('products:listProducts', filters),
    getProductById: (productId: number) => ipcRenderer.invoke('products:getProductById', productId),
    updateProduct: (productId: number, productData: Product) => ipcRenderer.invoke('products:updateProduct', productId, productData),
    deleteProduct: (productId: number) => ipcRenderer.invoke('products:deleteProduct', productId),
  },

  // Customer Document APIs
  customerDocuments: {
    addCustomerDocument: (documentData: CustomerDocument) => ipcRenderer.invoke('customerDocuments:addCustomerDocument', documentData),
    listCustomerDocuments: (customerId: number) => ipcRenderer.invoke('customerDocuments:listCustomerDocuments', customerId),
    deleteCustomerDocument: (documentId: number) => ipcRenderer.invoke('customerDocuments:deleteCustomerDocument', documentId),
  },

  // PDF Generation APIs
  pdf: {
    generateOfferPdf: (payload: any) => ipcRenderer.invoke('pdf:generateOfferPdf', payload),
  },

  // Legacy Solar APIs (maintained for compatibility)
  solar: {
    getPvManufacturers: () => ipcRenderer.invoke('solar:get_pv_manufacturers'),
    getPvModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_pv_models', manufacturer),
    getInverterManufacturers: () => ipcRenderer.invoke('solar:get_inverter_manufacturers'),
    getInverterModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_inverter_models', manufacturer),
    getStorageManufacturers: () => ipcRenderer.invoke('solar:get_storage_manufacturers'),
    getStorageModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_storage_models', manufacturer),
    getWallboxManufacturers: () => ipcRenderer.invoke('solar:get_wallbox_manufacturers'),
    getWallboxModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_wallbox_models', manufacturer),
    getEmsManufacturers: () => ipcRenderer.invoke('solar:get_ems_manufacturers'),
    getEmsModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_ems_models', manufacturer),
    getOptimizerManufacturers: () => ipcRenderer.invoke('solar:get_optimizer_manufacturers'),
    getOptimizerModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_optimizer_models', manufacturer),
    getCarportManufacturers: () => ipcRenderer.invoke('solar:get_carport_manufacturers'),
    getCarportModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_carport_models', manufacturer),
    getEmergencyPowerManufacturers: () => ipcRenderer.invoke('solar:get_emergency_power_manufacturers'),
    getEmergencyPowerModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_emergency_power_models', manufacturer),
    getAnimalProtectionManufacturers: () => ipcRenderer.invoke('solar:get_animal_protection_manufacturers'),
    getAnimalProtectionModels: (manufacturer: string) => ipcRenderer.invoke('solar:get_animal_protection_models', manufacturer),
    saveConfig: (config: Record<string, unknown>) => ipcRenderer.invoke('solar:save_config', config),
  },

  // System APIs
  system: {
    showOpenDialog: (options?: any) => ipcRenderer.invoke('system:show_open_dialog', options),
    getPythonInfo: () => ipcRenderer.invoke('system:python_info'),
  }
};

// Export the typed API to renderer
contextBridge.exposeInMainWorld('electronAPI', API);

// Type declaration for the exposed API
export type ElectronAPI = typeof API;
