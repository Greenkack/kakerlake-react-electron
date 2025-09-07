export const ipc = {
  invoke<T=unknown>(channel: string, ...args: any[]): Promise<T> {
    // @ts-expect-error preload exposes window.electron?.invoke
    return window.electron.invoke(channel, ...args);
  },
  crm: {
    saveCustomer: (payload: any) => ipc.invoke('crm.saveCustomer', payload),
    saveProject:  (payload: any) => ipc.invoke('crm.saveProject', payload),
    loadCustomer: (id: string) => ipc.invoke('crm.loadCustomer', id),
    loadProject:  (id: string) => ipc.invoke('crm.loadProject', id),
    listCustomers: () => ipc.invoke('crm.listCustomers'),
    listProjectsByCustomer: (customerId: string) => ipc.invoke('crm.listProjectsByCustomer', customerId),
    deleteCustomer: (id: string) => ipc.invoke('crm.deleteCustomer', id),
    deleteProject:  (id: string) => ipc.invoke('crm.deleteProject', id),
    addCustomerDocument: (payload: any) => ipc.invoke('crm.addCustomerDocument', payload)
  }
};
