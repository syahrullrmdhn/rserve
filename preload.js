const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  platform: () => ipcRenderer.invoke('get-platform'),
  getAllServices: () => ipcRenderer.invoke('get-all-services'),
  getServiceStatus: (serviceId, version) => ipcRenderer.invoke('get-service-status', serviceId, version),
  startService: (serviceId, version) => ipcRenderer.invoke('start-service', serviceId, version),
  stopService: (serviceId, version) => ipcRenderer.invoke('stop-service', serviceId, version),
  detectVersions: (serviceId) => ipcRenderer.invoke('detect-versions', serviceId),
  installVersion: (serviceId, version) => ipcRenderer.invoke('install-version', serviceId, version),
  switchVersion: (serviceId, version) => ipcRenderer.invoke('switch-version', serviceId, version),
  browseDirectory: (dirPath) => ipcRenderer.invoke('browse-directory', dirPath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  getCronJobs: () => ipcRenderer.invoke('get-cron-jobs'),
  addCronJob: (schedule, command) => ipcRenderer.invoke('add-cron-job', schedule, command),
  deleteCronJob: (jobId) => ipcRenderer.invoke('delete-cron-job', jobId),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
});
