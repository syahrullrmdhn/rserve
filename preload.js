const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  platform: () => ipcRenderer.invoke('get-platform'),
  getAllServices: () => ipcRenderer.invoke('get-all-services'),
  getServiceStatus: (serviceId) => ipcRenderer.invoke('get-service-status', serviceId),
  startService: (serviceId) => ipcRenderer.invoke('start-service', serviceId),
  stopService: (serviceId) => ipcRenderer.invoke('stop-service', serviceId),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
});
