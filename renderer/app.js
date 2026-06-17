// R-Serve - Professional UI with Icons
let currentPage = 'dashboard';
let services = {};
let platform = 'Unknown';
let currentPath = '';

// Service icon mapping
const serviceIcons = {
  php: 'php',
  mysql: 'mysql',
  postgresql: 'postgresql',
  nodejs: 'nodejs',
  python: 'python',
  nginx: 'nginx',
  apache: 'apache',
  go: 'go',
  ruby: 'ruby',
  cron: 'cron'
};

// Get icon SVG
function getIcon(name) {
  const iconMap = {
    php: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    mysql: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    postgresql: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    nodejs: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    python: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>',
    nginx: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    apache: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    go: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    ruby: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9l4-6z"/><path d="M11 3 8 9l4 13 4-13-3-6z"/></svg>',
    cron: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  };
  return iconMap[name] || iconMap.php;
}

// Navigation
document.querySelectorAll('.nav-link').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.dataset.page;
    switchPage(page);
  });
});

function switchPage(page) {
  // Update nav
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add('active');
  
  // Update page
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.style.display = 'block';
  }
  
  // Update header
  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Manage your local development environment' },
    services: { title: 'All Services', subtitle: 'Complete overview of available services' },
    files: { title: 'File Browser', subtitle: 'Browse and manage project files' },
    cron: { title: 'Cron Jobs', subtitle: 'Manage scheduled tasks' },
    settings: { title: 'Settings', subtitle: 'Application preferences' }
  };
  
  const pageInfo = titles[page] || titles.dashboard;
  document.getElementById('page-title').textContent = pageInfo.title;
  document.getElementById('page-subtitle').textContent = pageInfo.subtitle;
  
  currentPage = page;
  
  // Load page-specific data
  if (page === 'files') {
    loadFileExplorer('.');
  } else if (page === 'cron') {
    loadCronJobs();
  }
}

// Initialize
async function init() {
  platform = await window.api.platform();
  document.getElementById('platform-info').textContent = platform;
  
  await loadServices();
  setInterval(loadServices, 5000); // Refresh every 5s
}

// Load services
async function loadServices() {
  services = await window.api.getAllServices();
  renderDashboard();
  renderServicesPage();
}

// Render dashboard
function renderDashboard() {
  const container = document.getElementById('services-container');
  const html = Object.entries(services)
    .filter(([_, service]) => service.supported)
    .map(([id, service]) => {
      const versions = service.versions || { installed: [], active: null, available: [] };
      const hasInstalled = versions.installed.length > 0;
      const icon = getIcon(id);
      
      return `
        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">
              ${icon}
            </div>
            <div class="service-info">
              <div class="service-name">${service.name}</div>
              <div class="service-type">${service.type || 'Service'}</div>
            </div>
            <div class="service-status ${service.running ? 'running' : 'stopped'}">
              <span class="status-dot"></span>
              ${service.running ? 'Running' : 'Stopped'}
            </div>
          </div>
          
          ${hasInstalled ? `
            <div class="service-actions">
              ${service.running 
                ? `<button class="btn btn-danger" onclick="stopService('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"/></svg>
                    Stop
                   </button>`
                : `<button class="btn btn-primary" onclick="startService('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Start
                   </button>`
              }
            </div>
          ` : ''}
          
          <div class="versions-section">
            <div class="versions-label">
              ${hasInstalled ? 'Installed Versions' : 'Available Versions (Click to Install)'}
            </div>
            ${versions.available.length > 0 ? `
              <div class="versions-grid">
                ${versions.available.map(ver => {
                  const installed = versions.installed.includes(ver);
                  const active = ver === versions.active;
                  return `<div class="version-badge ${active ? 'active' : ''}" 
                    onclick="${installed ? `switchVersion('${id}', '${ver}')` : `installVersion('${id}', '${ver}')`}"
                    title="${active ? 'Active version' : (installed ? 'Click to activate' : 'Click to install')}"
                  >${ver}${active ? ' ✓' : ''}</div>`;
                }).join('')}
              </div>
            ` : '<div class="no-versions">No versions available</div>'}
          </div>
        </div>
      `;
    }).join('');
  
  container.innerHTML = html || '<div class="no-versions">No supported services found</div>';
}

// Render services page (same as dashboard for now)
function renderServicesPage() {
  const container = document.getElementById('services-list');
  container.innerHTML = document.getElementById('services-container').innerHTML;
}

// Service actions
async function startService(id) {
  try {
    const result = await window.api.startService(id);
    if (!result.success) {
      showAlert('Start Failed', result.error || 'Unknown error');
    }
    await loadServices();
  } catch (err) {
    showAlert('Error', err.message);
  }
}

async function stopService(id) {
  try {
    const result = await window.api.stopService(id);
    if (!result.success) {
      showAlert('Stop Failed', result.error || 'Unknown error');
    }
    await loadServices();
  } catch (err) {
    showAlert('Error', err.message);
  }
}

async function installVersion(id, version) {
  try {
    showAlert('Installing...', `Installing ${services[id].name} ${version}\n\nThis may take a few minutes...`);
    const result = await window.api.installService(id, version);
    
    if (result.success) {
      showAlert('Success', `${services[id].name} ${version} installed successfully!`);
      await loadServices();
    } else {
      showAlert('Installation Failed', result.error || result.output || 'Unknown error');
    }
  } catch (err) {
    showAlert('Error', err.message);
  }
}

async function switchVersion(id, version) {
  try {
    const result = await window.api.switchVersion(id, version);
    if (result.success) {
      await loadServices();
    } else {
      showAlert('Switch Failed', result.error || 'Unknown error');
    }
  } catch (err) {
    showAlert('Error', err.message);
  }
}

// Alert modal
function showAlert(title, message) {
  document.getElementById('alert-title').textContent = title;
  document.getElementById('alert-message').textContent = message;
  document.getElementById('alert-modal').style.display = 'flex';
}

document.getElementById('close-alert').addEventListener('click', () => {
  document.getElementById('alert-modal').style.display = 'none';
});

document.getElementById('alert-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('alert-modal')) {
    document.getElementById('alert-modal').style.display = 'none';
  }
});

// Refresh all button
document.getElementById('refresh-all').addEventListener('click', () => {
  loadServices();
});

// File Browser
async function loadFileExplorer(path) {
  currentPath = path;
  document.getElementById('current-path').textContent = path || '~';
  
  try {
    const items = await window.api.browseDirectory(path);
    renderFileBrowser(path, items);
  } catch (err) {
    showAlert('Error', `Failed to browse directory: ${err.message}`);
  }
}

function renderFileBrowser(path, items) {
  const container = document.getElementById('file-list');
  
  const html = items.map(item => {
    const icon = item.isDirectory 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    
    return `
      <li class="file-item" onclick="${item.isDirectory ? `loadFileExplorer('${item.path}')` : `openFile('${item.path}')`}">
        ${icon}
        <span>${item.name}</span>
      </li>
    `;
  }).join('');
  
  container.innerHTML = html || '<li style="padding: 1rem; color: var(--text-muted);">No files found</li>';
}

async function openFile(path) {
  try {
    await window.api.openFile(path);
  } catch (err) {
    showAlert('Error', `Failed to open file: ${err.message}`);
  }
}

// Cron Jobs
async function loadCronJobs() {
  try {
    const jobs = await window.api.getCronJobs();
    renderCronJobs(jobs);
  } catch (err) {
    showAlert('Error', `Failed to load cron jobs: ${err.message}`);
  }
}

function renderCronJobs(jobs) {
  const container = document.getElementById('cron-list');
  
  if (jobs.length === 0) {
    container.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 2rem;">No cron jobs found</td></tr>';
    return;
  }
  
  const html = jobs.map((job, index) => `
    <tr>
      <td><code style="color: var(--primary-light);">${job.schedule}</code></td>
      <td><code>${job.command}</code></td>
      <td>
        <button class="btn btn-danger" onclick="deleteCronJob(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </td>
    </tr>
  `).join('');
  
  container.innerHTML = html;
}

document.getElementById('add-cron-btn').addEventListener('click', () => {
  document.getElementById('cron-modal').style.display = 'flex';
});

document.getElementById('cancel-cron').addEventListener('click', () => {
  document.getElementById('cron-modal').style.display = 'none';
  document.getElementById('cron-form').reset();
});

document.getElementById('cron-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const schedule = document.getElementById('cron-schedule').value;
  const command = document.getElementById('cron-command').value;
  
  try {
    const result = await window.api.addCronJob(schedule, command);
    if (result.success) {
      document.getElementById('cron-modal').style.display = 'none';
      document.getElementById('cron-form').reset();
      await loadCronJobs();
    } else {
      showAlert('Error', result.error || 'Failed to add cron job');
    }
  } catch (err) {
    showAlert('Error', err.message);
  }
});

async function deleteCronJob(index) {
  if (!confirm('Are you sure you want to delete this cron job?')) return;
  
  try {
    const result = await window.api.deleteCronJob(index);
    if (result.success) {
      await loadCronJobs();
    } else {
      showAlert('Error', result.error || 'Failed to delete cron job');
    }
  } catch (err) {
    showAlert('Error', err.message);
  }
}

// Close modals on overlay click
document.getElementById('cron-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('cron-modal')) {
    document.getElementById('cron-modal').style.display = 'none';
    document.getElementById('cron-form').reset();
  }
});

// Initialize app
init();
