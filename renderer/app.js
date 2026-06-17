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

// Initialize on load
init();
