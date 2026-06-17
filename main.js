const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

let mainWindow;
const services = {};

const SERVICE_CONFIGS = {
  php: {
    name: 'PHP',
    type: 'runtime',
    versions: {
      macOS: ['8.3', '8.2', '8.1', '8.0', '7.4'],
      linux: ['8.3', '8.2', '8.1', '8.0', '7.4'],
      windows: ['8.3', '8.2', '8.1', '8.0', '7.4'],
    },
    macOS: {
      detectCmd: 'brew list --formula | grep "^php@"',
      versionCmd: (ver) => `php${ver.replace('.', '')} -v`,
      installCmd: (ver) => `brew install php@${ver}`,
      switchCmd: (ver) => `brew unlink php && brew link --force --overwrite php@${ver}`,
      startCmd: (ver) => `brew services start php@${ver}`,
      stopCmd: (ver) => `brew services stop php@${ver}`,
      statusCmd: (ver) => `brew services list | grep php@${ver}`,
    },
    linux: {
      detectCmd: 'dpkg -l | grep php | grep -E "php[0-9]\\.[0-9]"',
      versionCmd: (ver) => `php${ver} -v`,
      installCmd: (ver) => `sudo apt install -y php${ver}-fpm php${ver}-cli`,
      switchCmd: (ver) => `sudo update-alternatives --set php /usr/bin/php${ver}`,
      startCmd: (ver) => `sudo systemctl start php${ver}-fpm`,
      stopCmd: (ver) => `sudo systemctl stop php${ver}-fpm`,
      statusCmd: (ver) => `systemctl status php${ver}-fpm`,
    },
    windows: {
      detectCmd: 'where php 2>nul',
      versionCmd: (ver) => `php -v`,
      installCmd: (ver) => `choco install php --version=${ver} -y`,
      switchCmd: (ver) => `choco upgrade php --version=${ver} -y`,
      startCmd: (ver) => `echo PHP runs via web server on Windows`,
      stopCmd: (ver) => `echo PHP runs via web server on Windows`,
      statusCmd: (ver) => `php -v`,
    },
  },
  nodejs: {
    name: 'Node.js',
    type: 'runtime',
    versions: {
      macOS: ['22', '20', '18', '16'],
      linux: ['22', '20', '18', '16'],
      windows: ['22', '20', '18', '16'],
    },
    macOS: {
      detectCmd: 'ls -1 /usr/local/Cellar/node/ 2>/dev/null || echo ""',
      versionCmd: (ver) => `node -v`,
      installCmd: (ver) => `brew install node@${ver}`,
      switchCmd: (ver) => `brew unlink node && brew link --force --overwrite node@${ver}`,
    },
    windows: {
      detectCmd: 'where node 2>nul',
      versionCmd: (ver) => `node -v`,
      installCmd: (ver) => `choco install nodejs --version=${ver} -y`,
      switchCmd: (ver) => `choco upgrade nodejs --version=${ver} -y`,
    },
  },
  python: {
    name: 'Python',
    type: 'runtime',
    versions: {
      macOS: ['3.12', '3.11', '3.10', '3.9'],
      linux: ['3.12', '3.11', '3.10', '3.9'],
      windows: ['3.12', '3.11', '3.10', '3.9'],
    },
    macOS: {
      detectCmd: 'brew list --formula | grep "^python@"',
      versionCmd: (ver) => `python${ver} --version`,
      installCmd: (ver) => `brew install python@${ver}`,
      switchCmd: (ver) => `brew unlink python && brew link --force --overwrite python@${ver}`,
    },
    windows: {
      detectCmd: 'where python 2>nul',
      versionCmd: (ver) => `python --version`,
      installCmd: (ver) => `choco install python --version=${ver} -y`,
      switchCmd: (ver) => `choco upgrade python --version=${ver} -y`,
    },
  },
  mysql: {
    name: 'MySQL',
    type: 'database',
    versions: {
      macOS: ['8.0', '5.7'],
      linux: ['8.0', '5.7'],
      windows: ['8.0', '5.7'],
    },
    macOS: {
      detectCmd: 'brew list --formula | grep "^mysql"',
      versionCmd: (ver) => `mysql --version`,
      installCmd: (ver) => `brew install mysql@${ver}`,
      switchCmd: (ver) => `brew unlink mysql && brew link --force --overwrite mysql@${ver}`,
      startCmd: (ver) => `brew services start mysql@${ver}`,
      stopCmd: (ver) => `brew services stop mysql@${ver}`,
      statusCmd: (ver) => `brew services list | grep mysql@${ver}`,
    },
    windows: {
      detectCmd: 'sc query MySQL 2>nul',
      versionCmd: (ver) => `mysql --version`,
      installCmd: (ver) => `choco install mysql -y`,
      switchCmd: (ver) => `choco upgrade mysql -y`,
      startCmd: (ver) => `net start MySQL`,
      stopCmd: (ver) => `net stop MySQL`,
      statusCmd: (ver) => `sc query MySQL`,
    },
  },
  postgresql: {
    name: 'PostgreSQL',
    type: 'database',
    versions: {
      macOS: ['16', '15', '14', '13'],
      linux: ['16', '15', '14', '13'],
      windows: ['16', '15', '14', '13'],
    },
    macOS: {
      detectCmd: 'brew list --formula | grep "^postgresql@"',
      versionCmd: (ver) => `psql --version`,
      installCmd: (ver) => `brew install postgresql@${ver}`,
      switchCmd: (ver) => `brew unlink postgresql && brew link --force --overwrite postgresql@${ver}`,
      startCmd: (ver) => `brew services start postgresql@${ver}`,
      stopCmd: (ver) => `brew services stop postgresql@${ver}`,
      statusCmd: (ver) => `brew services list | grep postgresql@${ver}`,
    },
    windows: {
      detectCmd: 'sc query postgresql 2>nul',
      versionCmd: (ver) => `psql --version`,
      installCmd: (ver) => `choco install postgresql -y`,
      switchCmd: (ver) => `choco upgrade postgresql -y`,
      startCmd: (ver) => `net start postgresql`,
      stopCmd: (ver) => `net stop postgresql`,
      statusCmd: (ver) => `sc query postgresql`,
    },
  },
  apache: {
    name: 'Apache',
    type: 'webserver',
    versions: {
      macOS: ['2.4'],
      linux: ['2.4'],
      windows: ['2.4'],
    },
    macOS: {
      detectCmd: 'which apachectl',
      versionCmd: (ver) => `apachectl -v`,
      installCmd: (ver) => `brew install httpd`,
      startCmd: (ver) => `brew services start httpd`,
      stopCmd: (ver) => `brew services stop httpd`,
      statusCmd: (ver) => `brew services list | grep httpd`,
    },
    windows: {
      detectCmd: 'sc query Apache2.4 2>nul',
      versionCmd: (ver) => `httpd -v`,
      installCmd: (ver) => `choco install apache-httpd -y`,
      startCmd: (ver) => `net start Apache2.4`,
      stopCmd: (ver) => `net stop Apache2.4`,
      statusCmd: (ver) => `sc query Apache2.4`,
    },
  },
  nginx: {
    name: 'Nginx',
    type: 'webserver',
    versions: {
      macOS: ['1.25', '1.24'],
      linux: ['1.25', '1.24'],
      windows: ['1.25', '1.24'],
    },
    macOS: {
      detectCmd: 'which nginx',
      versionCmd: (ver) => `nginx -v`,
      installCmd: (ver) => `brew install nginx`,
      startCmd: (ver) => `brew services start nginx`,
      stopCmd: (ver) => `brew services stop nginx`,
      statusCmd: (ver) => `brew services list | grep nginx`,
    },
    windows: {
      detectCmd: 'where nginx 2>nul',
      versionCmd: (ver) => `nginx -v`,
      installCmd: (ver) => `choco install nginx -y`,
      startCmd: (ver) => `start nginx`,
      stopCmd: (ver) => `nginx -s stop`,
      statusCmd: (ver) => `tasklist | findstr nginx.exe`,
    },
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

async function detectInstalledVersions(serviceId) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform]) {
    return { installed: [], active: null };
  }

  try {
    const { detectCmd } = config[platform];
    const result = await executeCommand(detectCmd, []);
    
    // Parse detected versions from output
    const installed = [];
    const availableVersions = config.versions[platform] || [];
    
    for (const ver of availableVersions) {
      // Check if version exists in output
      if (result.stdout.includes(ver) || result.stdout.includes(`@${ver}`)) {
        installed.push(ver);
      }
    }

    // Get active version
    let active = null;
    if (config[platform].versionCmd) {
      try {
        const versionResult = await executeCommand(config[platform].versionCmd(''), []);
        // Extract version number from output
        const match = versionResult.stdout.match(/(\d+\.\d+)/);
        if (match) active = match[1];
      } catch (err) {
        // No active version
      }
    }

    return { installed, active, available: availableVersions };
  } catch (err) {
    return { installed: [], active: null, available: config.versions[platform] || [] };
  }
}

async function installVersion(serviceId, version) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].installCmd) {
    return { success: false, error: 'Install not supported on this platform' };
  }

  try {
    const cmd = config[platform].installCmd(version);
    await executeCommand(cmd, []);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to install' };
  }
}

async function switchVersion(serviceId, version) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].switchCmd) {
    return { success: false, error: 'Version switching not supported' };
  }

  try {
    const cmd = config[platform].switchCmd(version);
    await executeCommand(cmd, []);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to switch version' };
  }
}

async function getServiceStatus(serviceId, version = null) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].statusCmd) {
    return { running: false, error: 'Not supported on this platform' };
  }

  try {
    const { statusCmd } = config[platform];
    const cmd = typeof statusCmd === 'function' ? statusCmd(version || '') : statusCmd;
    const result = await executeCommand(cmd, []);
    const running = /running|active|started/i.test(result.stdout);
    return { running, output: result.stdout };
  } catch (err) {
    return { running: false, error: err.stderr || err.error || 'Unknown error' };
  }
}

async function startService(serviceId, version = null) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].startCmd) {
    return { success: false, error: 'Not supported on this platform' };
  }

  try {
    const { startCmd } = config[platform];
    const cmd = typeof startCmd === 'function' ? startCmd(version || '') : startCmd;
    await executeCommand(cmd, []);
    services[serviceId] = 'running';
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to start' };
  }
}

async function stopService(serviceId, version = null) {
  const platform = getPlatform();
  const config = SERVICE_CONFIGS[serviceId];
  if (!config || !config[platform] || !config[platform].stopCmd) {
    return { success: false, error: 'Not supported on this platform' };
  }

  try {
    const { stopCmd } = config[platform];
    const cmd = typeof stopCmd === 'function' ? stopCmd(version || '') : stopCmd;
    await executeCommand(cmd, []);
    services[serviceId] = 'stopped';
    return { success: true };
  } catch (err) {
    return { success: false, error: err.stderr || err.error || 'Failed to stop' };
  }
}

// IPC handlers
ipcMain.handle('get-platform', () => getPlatform());

ipcMain.handle('get-service-status', async (_, serviceId, version) => {
  return await getServiceStatus(serviceId, version);
});

ipcMain.handle('start-service', async (_, serviceId, version) => {
  return await startService(serviceId, version);
});

ipcMain.handle('stop-service', async (_, serviceId, version) => {
  return await stopService(serviceId, version);
});

ipcMain.handle('detect-versions', async (_, serviceId) => {
  return await detectInstalledVersions(serviceId);
});

ipcMain.handle('install-version', async (_, serviceId, version) => {
  return await installVersion(serviceId, version);
});

ipcMain.handle('switch-version', async (_, serviceId, version) => {
  return await switchVersion(serviceId, version);
});

ipcMain.handle('get-all-services', async () => {
  const platform = getPlatform();
  const result = {};
  for (const [id, config] of Object.entries(SERVICE_CONFIGS)) {
    const versions = await detectInstalledVersions(id);
    const status = versions.active ? await getServiceStatus(id, versions.active) : { running: false };
    result[id] = {
      name: config.name,
      type: config.type,
      supported: !!config[platform],
      versions: versions,
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

// File Browser handlers
ipcMain.handle('browse-directory', async (_, dirPath) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const fullPath = dirPath || os.homedir();
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    
    const files = items.map(item => {
      const itemPath = path.join(fullPath, item.name);
      const stats = fs.statSync(itemPath);
      return {
        name: item.name,
        path: itemPath,
        isDirectory: item.isDirectory(),
        isFile: item.isFile(),
        size: item.isFile() ? stats.size : 0,
        modified: stats.mtime,
      };
    });
    
    return {
      success: true,
      currentPath: fullPath,
      parent: path.dirname(fullPath),
      files: files.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      }),
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-file', async (_, filePath) => {
  const { shell } = require('electron');
  try {
    await shell.openPath(filePath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Cron Jobs handlers
ipcMain.handle('get-cron-jobs', async () => {
  const { execSync } = require('child_process');
  const platform = getPlatform();
  
  try {
    if (platform === 'macOS' || platform === 'linux') {
      const output = execSync('crontab -l 2>/dev/null || echo ""', { encoding: 'utf-8' });
      const lines = output.trim().split('\n').filter(line => line && !line.startsWith('#'));
      
      const jobs = lines.map((line, index) => {
        const parts = line.split(' ');
        if (parts.length < 6) return null;
        
        return {
          id: index,
          schedule: parts.slice(0, 5).join(' '),
          command: parts.slice(5).join(' '),
          enabled: true,
        };
      }).filter(Boolean);
      
      return { success: true, jobs };
    } else {
      return { success: false, error: 'Cron jobs not supported on Windows yet' };
    }
  } catch (err) {
    return { success: true, jobs: [] }; // Empty crontab is OK
  }
});

ipcMain.handle('add-cron-job', async (_, schedule, command) => {
  const { execSync } = require('child_process');
  const platform = getPlatform();
  
  try {
    if (platform === 'macOS' || platform === 'linux') {
      const current = execSync('crontab -l 2>/dev/null || echo ""', { encoding: 'utf-8' });
      const newCron = current.trim() + '\n' + `${schedule} ${command}\n`;
      execSync(`echo "${newCron.replace(/"/g, '\\"')}" | crontab -`);
      return { success: true };
    } else {
      return { success: false, error: 'Cron jobs not supported on Windows yet' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-cron-job', async (_, jobId) => {
  const { execSync } = require('child_process');
  const platform = getPlatform();
  
  try {
    if (platform === 'macOS' || platform === 'linux') {
      const output = execSync('crontab -l 2>/dev/null || echo ""', { encoding: 'utf-8' });
      const lines = output.trim().split('\n').filter(line => line && !line.startsWith('#'));
      lines.splice(jobId, 1);
      
      const newCron = lines.join('\n') + '\n';
      execSync(`echo "${newCron.replace(/"/g, '\\"')}" | crontab -`);
      return { success: true };
    } else {
      return { success: false, error: 'Cron jobs not supported on Windows yet' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
});



app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
