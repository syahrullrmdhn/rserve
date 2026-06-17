const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

let mainWindow;
const services = {};

const SERVICE_CONFIGS = {
  apache: {
    name: 'Apache',
    macOS: { bin: '/usr/sbin/apachectl', startCmd: 'start', stopCmd: 'stop', statusCmd: '-S' },
    linux: { bin: 'systemctl', startCmd: 'start apache2', stopCmd: 'stop apache2', statusCmd: 'status apache2' },
    windows: { bin: 'httpd.exe', startCmd: null, stopCmd: null, statusCmd: null },
  },
  mysql: {
    name: 'MySQL',
    macOS: { bin: 'brew', startCmd: 'services start mysql', stopCmd: 'services stop mysql', statusCmd: 'services list' },
    linux: { bin: 'systemctl', startCmd: 'start mysql', stopCmd: 'stop mysql', statusCmd: 'status mysql' },
    windows: { bin: 'net', startCmd: 'start MySQL', stopCmd: 'stop MySQL', statusCmd: null },
  },
  nginx: {
    name: 'Nginx',
    macOS: { bin: 'nginx', startCmd: '', stopCmd: '-s stop', statusCmd: '-t' },
    linux: { bin: 'systemctl', startCmd: 'start nginx', stopCmd: 'stop nginx', statusCmd: 'status nginx' },
    windows: { bin: 'nginx.exe', startCmd: '', stopCmd: '-s stop', statusCmd: null },
  },
  postgresql: {
    name: 'PostgreSQL',
    macOS: { bin: 'brew', startCmd: 'services start postgresql@14', stopCmd: 'services stop postgresql@14', statusCmd: 'services list' },
    linux: { bin: 'systemctl', startCmd: 'start postgresql', stopCmd: 'stop postgresql', statusCmd: 'status postgresql' },
    windows: { bin: 'net', startCmd: 'start PostgreSQL', stopCmd: 'stop PostgreSQL', statusCmd: null },
  },
  php: {
    name: 'PHP-FPM',
    macOS: { bin: 'brew', startCmd: 'services start php', stopCmd: 'services stop php', statusCmd: 'services list' },
    linux: { bin: 'systemctl', startCmd: 'start php-fpm', stopCmd: 'stop php-fpm', statusCmd: 'status php-fpm' },
    windows: { bin: null, startCmd: null, stopCmd: null, statusCmd: null },
  },
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('renderer/index.html');
  mainWindow.setTitle('R-Serve');
}

function getPlatform() {
  const platform = process.platform;
  if (platform === 'darwin') return 'macOS';
  if (platform === 'linux') return 'linux';
  if (platform === 'win32') return 'windows';
  return 'unknown';
}

function executeCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { shell: true });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => (stdout += data.toString()));
    proc.stderr.on('data', (data) => (stderr += data.toString()));

    proc.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr, code });
      else reject({ stdout, stderr, code });
    });

    proc.on('error', (err) => reject({ error: err.message }));
  });
}

async function getServiceStatus(serviceId) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].statusCmd) {
    return { running: false, error: 'Not supported on this platform' };
  }

  try {
    const { bin, statusCmd } = config[platform];
    const result = await executeCommand(bin, statusCmd.split(' '));
    // Simple heuristic: if output contains 'running' or 'active', it's running
    const running = /running|active|started/i.test(result.stdout);
    return { running, output: result.stdout };
  } catch (err) {
    return { running: false, error: err.stderr || err.error || 'Unknown error' };
  }
}

async function startService(serviceId) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].startCmd) {
    return { success: false, error: 'Not supported on this platform' };
  }

  try {
    const { bin, startCmd } = config[platform];
    const args = startCmd ? startCmd.split(' ') : [];
    await executeCommand(bin, args);
    services[serviceId] = 'running';
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to start' };
  }
}

async function stopService(serviceId) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].stopCmd) {
    return { success: false, error: 'Not supported on this platform' };
  }

  try {
    const { bin, stopCmd } = config[platform];
    const args = stopCmd ? stopCmd.split(' ') : [];
    await executeCommand(bin, args);
    services[serviceId] = 'stopped';
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to stop' };
  }
}

// IPC handlers
ipcMain.handle('get-platform', () => getPlatform());

ipcMain.handle('get-service-status', async (_, serviceId) => {
  return await getServiceStatus(serviceId);
});

ipcMain.handle('start-service', async (_, serviceId) => {
  return await startService(serviceId);
});

ipcMain.handle('stop-service', async (_, serviceId) => {
  return await stopService(serviceId);
});

ipcMain.handle('get-all-services', async () => {
  const platform = getPlatform();
  const result = {};
  for (const [id, config] of Object.entries(SERVICE_CONFIGS)) {
    const status = await getServiceStatus(id);
    result[id] = {
      name: config.name,
      supported: !!config[platform],
      running: status.running,
    };
  }
  return result;
});

ipcMain.handle('window-minimize', () => mainWindow?.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.handle('window-close', () => mainWindow?.close());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
