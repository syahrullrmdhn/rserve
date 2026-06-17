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
    return `
      <div class="service-card">
        <div class="service-header">
          <span class="service-name">${service.name}</span>
          <div class="service-status ${service.running ? 'running' : 'stopped'}">
            <span class="status-dot"></span>
            ${service.running ? 'Running' : 'Stopped'}
          </div>
        </div>
        <div class="service-actions">
          <button class="btn btn-start" onclick="startService('${id}')" ${service.running ? 'disabled' : ''}>
            Start
          </button>
          <button class="btn btn-stop" onclick="stopService('${id}')" ${!service.running ? 'disabled' : ''}>
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
  const html = Object.entries(services).map(([id, service]) => `
    <div class="service-card">
      <div class="service-header">
        <span class="service-name">${service.name}</span>
        <div class="service-status ${service.running ? 'running' : 'stopped'}">
          <span class="status-dot"></span>
          ${service.running ? 'Running' : 'Stopped'}
        </div>
      </div>
      ${service.supported ? `
        <div class="service-actions">
          <button class="btn btn-start" onclick="startService('${id}')" ${service.running ? 'disabled' : ''}>
            Start
          </button>
          <button class="btn btn-stop" onclick="stopService('${id}')" ${!service.running ? 'disabled' : ''}>
            Stop
          </button>
        </div>
      ` : '<p style="font-size: 12px; color: var(--text-dim); margin-top: 8px;">Not supported on ' + platform + '</p>'}
    </div>
  `).join('');
  
  container.innerHTML = html;
}

async function startService(id) {
  const result = await window.api.startService(id);
  if (result.success) {
    console.log(`✓ ${services[id].name} started`);
  } else {
    console.error(`✗ Failed to start ${services[id].name}:`, result.error);
    alert(`Failed to start ${services[id].name}\n\n${result.error}`);
  }
  await loadServices();
}

async function stopService(id) {
  const result = await window.api.stopService(id);
  if (result.success) {
    console.log(`✓ ${services[id].name} stopped`);
  } else {
    console.error(`✗ Failed to stop ${services[id].name}:`, result.error);
    alert(`Failed to stop ${services[id].name}\n\n${result.error}`);
  }
  await loadServices();
}

// Initialize on load
init();
