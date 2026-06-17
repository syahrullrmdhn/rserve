let currentPage = 'dashboard';
let services = {};
let platform = 'Unknown';

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    switchPage(page);
  });
});

function switchPage(page) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
  
  // Update page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
  
  currentPage = page;
  
  // Load file browser when switching to files page
  if (page === 'files' && !currentPath) {
    loadFileBrowser('');
  }
  
  // Load cron jobs when switching to cron page
  if (page === 'cron') {
    loadCronJobs();
  }
}

// Load platform and services
async function init() {
  platform = await window.api.platform();
  document.getElementById('platformInfo').textContent = platform;
  
  await loadServices();
  setInterval(loadServices, 5000); // Refresh every 5s
}

async function loadServices() {
  services = await window.api.getAllServices();
  renderDashboard();
  renderServicesPage();
}

function renderDashboard() {
  const container = document.getElementById('dashboardServices');
  const html = Object.entries(services).map(([id, service]) => {
    if (!service.supported) return '';
    
    const versions = service.versions || { installed: [], active: null, available: [] };
    const hasInstalled = versions.installed.length > 0;
    
    return `
      <div class="service-card">
        <div class="service-header">
          <div>
            <div class="service-name">${service.name}</div>
            <div class="service-type">${service.type || 'service'}</div>
          </div>
          <div class="service-status ${service.running ? 'running' : 'stopped'}">
            <span class="status-dot"></span>
            ${service.running ? 'Running' : 'Stopped'}
          </div>
        </div>
        
        ${hasInstalled ? `
          <div class="service-version">
            <div class="version-label">Installed Versions</div>
            <div class="version-selector">
              ${versions.available.map(ver => {
                const installed = versions.installed.includes(ver);
                const active = ver === versions.active;
                const className = active ? 'active' : (installed ? 'installed' : 'not-installed');
                return `<button class="version-badge ${className}" 
                  onclick="handleVersionClick('${id}', '${ver}', ${installed})"
                  title="${active ? 'Active' : (installed ? 'Click to switch' : 'Click to install')}"
                >${ver}${active ? ' ✓' : ''}</button>`;
              }).join('')}
            </div>
            ${versions.active ? `<div class="version-info">Active: <strong>${versions.active}</strong></div>` : ''}
          </div>
        ` : `
          <div class="service-version">
            <div class="version-label">Available Versions (click to install)</div>
            <div class="version-selector">
              ${versions.available.map(ver => 
                `<button class="version-badge not-installed" 
                  onclick="installVersion('${id}', '${ver}')"
                  title="Click to install ${ver}"
                >${ver}</button>`
              ).join('')}
            </div>
            <div class="version-info">No versions installed yet</div>
          </div>
        `}
        
        <div class="service-actions">
          <button class="btn btn-start" onclick="startService('${id}', '${versions.active || ''}')" 
            ${!hasInstalled || service.running ? 'disabled' : ''}>
            Start
          </button>
          <button class="btn btn-stop" onclick="stopService('${id}', '${versions.active || ''}')" 
            ${!service.running ? 'disabled' : ''}>
            Stop
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html || '<p style="color: var(--text-dim)">No supported services found</p>';
}

function renderServicesPage() {
  const container = document.getElementById('servicesGrid');
  const html = Object.entries(services).map(([id, service]) => {
    const versions = service.versions || { installed: [], active: null, available: [] };
    const hasInstalled = versions.installed.length > 0;
    
    return `
      <div class="service-card">
        <div class="service-header">
          <div>
            <div class="service-name">${service.name}</div>
            <div class="service-type">${service.type || 'service'}</div>
          </div>
          <div class="service-status ${service.running ? 'running' : 'stopped'}">
            <span class="status-dot"></span>
            ${service.running ? 'Running' : 'Stopped'}
          </div>
        </div>
        
        ${service.supported ? `
          ${hasInstalled ? `
            <div class="service-version">
              <div class="version-label">Installed Versions</div>
              <div class="version-selector">
                ${versions.available.map(ver => {
                  const installed = versions.installed.includes(ver);
                  const active = ver === versions.active;
                  const className = active ? 'active' : (installed ? 'installed' : 'not-installed');
                  return `<button class="version-badge ${className}" 
                    onclick="handleVersionClick('${id}', '${ver}', ${installed})"
                    title="${active ? 'Active' : (installed ? 'Click to switch' : 'Click to install')}"
                  >${ver}${active ? ' ✓' : ''}</button>`;
                }).join('')}
              </div>
              ${versions.active ? `<div class="version-info">Active: <strong>${versions.active}</strong></div>` : ''}
            </div>
          ` : `
            <div class="service-version">
              <div class="version-label">Available Versions (click to install)</div>
              <div class="version-selector">
                ${versions.available.map(ver => 
                  `<button class="version-badge not-installed" 
                    onclick="installVersion('${id}', '${ver}')"
                    title="Click to install ${ver}"
                  >${ver}</button>`
                ).join('')}
              </div>
              <div class="version-info">No versions installed yet</div>
            </div>
          `}
          
          <div class="service-actions">
            <button class="btn btn-start" onclick="startService('${id}', '${versions.active || ''}')" 
              ${!hasInstalled || service.running ? 'disabled' : ''}>
              Start
            </button>
            <button class="btn btn-stop" onclick="stopService('${id}', '${versions.active || ''}')" 
              ${!service.running ? 'disabled' : ''}>
              Stop
            </button>
          </div>
        ` : '<p style="font-size: 12px; color: var(--text-dim); margin-top: 8px;">Not supported on ' + platform + '</p>'}
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

async function startService(id, version) {
  const result = await window.api.startService(id, version);
  if (result.success) {
    console.log(`✓ ${services[id].name} started`);
  } else {
    console.error(`✗ Failed to start ${services[id].name}:`, result.error);
    alert(`Failed to start ${services[id].name}\n\n${result.error}`);
  }
  await loadServices();
}

async function stopService(id, version) {
  const result = await window.api.stopService(id, version);
  if (result.success) {
    console.log(`✓ ${services[id].name} stopped`);
  } else {
    console.error(`✗ Failed to stop ${services[id].name}:`, result.error);
    alert(`Failed to stop ${services[id].name}\n\n${result.error}`);
  }
  await loadServices();
}

async function installVersion(serviceId, version) {
  if (!confirm(`Install ${services[serviceId].name} ${version}?\n\nThis will download and install the selected version.`)) {
    return;
  }

  console.log(`Installing ${services[serviceId].name} ${version}...`);
  const result = await window.api.installVersion(serviceId, version);
  
  if (result.success) {
    console.log(`✓ ${services[serviceId].name} ${version} installed`);
    alert(`${services[serviceId].name} ${version} installed successfully!`);
  } else {
    console.error(`✗ Failed to install ${services[serviceId].name} ${version}:`, result.error);
    alert(`Failed to install ${services[serviceId].name} ${version}\n\n${result.error}`);
  }
  
  await loadServices();
}

async function switchVersion(serviceId, version) {
  if (!confirm(`Switch ${services[serviceId].name} to version ${version}?\n\nThis will make ${version} the active version.`)) {
    return;
  }

  console.log(`Switching ${services[serviceId].name} to ${version}...`);
  const result = await window.api.switchVersion(serviceId, version);
  
  if (result.success) {
    console.log(`✓ ${services[serviceId].name} switched to ${version}`);
    alert(`${services[serviceId].name} switched to ${version} successfully!`);
  } else {
    console.error(`✗ Failed to switch ${services[serviceId].name} to ${version}:`, result.error);
    alert(`Failed to switch ${services[serviceId].name} to ${version}\n\n${result.error}`);
  }
  
  await loadServices();
}

async function handleVersionClick(serviceId, version, isInstalled) {
  if (!isInstalled) {
    await installVersion(serviceId, version);
  } else {
    await switchVersion(serviceId, version);
  }
}

// File Browser
let currentPath = '';

async function loadFileBrowser(path) {
  const result = await window.api.browseDirectory(path);
  
  if (!result.success) {
    console.error('Failed to load directory:', result.error);
    alert(`Failed to load directory: ${result.error}`);
    return;
  }
  
  currentPath = result.currentPath;
  document.getElementById('currentPath').value = currentPath;
  
  const fileList = document.getElementById('fileList');
  const html = result.files.map(file => {
    const icon = file.isDirectory ? '📁' : '📄';
    const sizeStr = file.isFile ? formatFileSize(file.size) : '';
    const dateStr = new Date(file.modified).toLocaleString();
    
    return `
      <div class="file-item" onclick="${file.isDirectory ? `loadFileBrowser('${file.path.replace(/'/g, "\\'")}')` : `openFile('${file.path.replace(/'/g, "\\'")}')`}">
        <span class="file-icon">${icon}</span>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${sizeStr}</span>
        <span class="file-date">${dateStr}</span>
      </div>
    `;
  }).join('');
  
  fileList.innerHTML = html || '<p style="color: var(--text-dim); text-align: center; padding: 20px;">Empty directory</p>';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function openFile(path) {
  const result = await window.api.openFile(path);
  if (!result.success) {
    alert(`Failed to open file: ${result.error}`);
  }
}

function goToParent() {
  const pathInput = document.getElementById('currentPath');
  const parent = currentPath.split('/').slice(0, -1).join('/') || '/';
  loadFileBrowser(parent);
}

function goToPath() {
  const pathInput = document.getElementById('currentPath');
  loadFileBrowser(pathInput.value);
}

// Cron Jobs
let cronJobs = [];

async function loadCronJobs() {
  const result = await window.api.getCronJobs();
  
  if (!result.success) {
    console.error('Failed to load cron jobs:', result.error);
    document.getElementById('cronJobsList').innerHTML = `<p style="color: var(--text-dim); text-align: center; padding: 20px;">${result.error}</p>`;
    return;
  }
  
  cronJobs = result.jobs;
  renderCronJobs();
}

function renderCronJobs() {
  const container = document.getElementById('cronJobsList');
  
  if (cronJobs.length === 0) {
    container.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">No cron jobs configured</p>';
    return;
  }
  
  const html = cronJobs.map((job, index) => `
    <div class="cron-job-item">
      <div class="cron-schedule">
        <strong>Schedule:</strong> ${job.schedule}
      </div>
      <div class="cron-command">
        <strong>Command:</strong> <code>${job.command}</code>
      </div>
      <button class="btn btn-stop" onclick="deleteCronJob(${index})" style="margin-top: 8px;">Delete</button>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

async function addCronJob() {
  const schedule = document.getElementById('cronSchedule').value.trim();
  const command = document.getElementById('cronCommand').value.trim();
  
  if (!schedule || !command) {
    alert('Please enter both schedule and command');
    return;
  }
  
  // Validate cron schedule (basic check: 5 fields)
  if (schedule.split(' ').length !== 5) {
    alert('Invalid cron schedule. Format: * * * * * (minute hour day month weekday)');
    return;
  }
  
  const result = await window.api.addCronJob(schedule, command);
  
  if (result.success) {
    document.getElementById('cronSchedule').value = '';
    document.getElementById('cronCommand').value = '';
    await loadCronJobs();
  } else {
    alert(`Failed to add cron job: ${result.error}`);
  }
}

async function deleteCronJob(index) {
  if (!confirm('Delete this cron job?')) return;
  
  const result = await window.api.deleteCronJob(index);
  
  if (result.success) {
    await loadCronJobs();
  } else {
    alert(`Failed to delete cron job: ${result.error}`);
  }
}

// Initialize on load
init();
