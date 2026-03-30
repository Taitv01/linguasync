/**
 * LinguaSync Dashboard — App Logic
 * Kanban board, CRUD, analytics — all persisted to localStorage
 */

const STORAGE_KEY = 'linguasync_projects';
const STATUSES = ['received', 'quoted', 'in-progress', 'qc', 'delivered', 'paid'];

// ============================================================
// DATA LAYER (localStorage)
// ============================================================
function getProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return loadSampleData();
  return JSON.parse(data);
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadSampleData() {
  const samples = [
    { id: genId(), client: 'Sarah Kim', email: 'sarah@edutech.asia', source: 'English', targets: 'Vietnamese, Japanese, Korean', duration: 8, price: 320, status: 'paid', urgency: 'normal', notes: 'E-learning platform course videos', created: '2026-03-01' },
    { id: genId(), client: 'Minh Trần', email: 'minh@vietsoft.vn', source: 'Vietnamese', targets: 'English, Japanese', duration: 12, price: 250, status: 'delivered', urgency: 'normal', notes: 'Product demo for international expansion', created: '2026-03-10' },
    { id: genId(), client: 'James Lee', email: 'james@cloudscale.io', source: 'English', targets: 'Vietnamese, Thai, Indonesian', duration: 5, price: 190, status: 'in-progress', urgency: 'rush', notes: 'Marketing video — urgent deadline', created: '2026-03-22' },
    { id: genId(), client: 'Anh Nguyễn', email: 'anh@startup.vn', source: 'Vietnamese', targets: 'English', duration: 15, price: 200, status: 'qc', urgency: 'normal', notes: 'Investor pitch video', created: '2026-03-25' },
    { id: genId(), client: 'Tanaka Yuki', email: 'yuki@techjp.co.jp', source: 'Japanese', targets: 'English, Vietnamese', duration: 6, price: 150, status: 'quoted', urgency: 'normal', notes: 'App tutorial walkthrough', created: '2026-03-28' },
    { id: genId(), client: 'Lisa Wang', email: 'lisa@globalhealth.org', source: 'English', targets: 'Thai, Indonesian', duration: 20, price: 480, status: 'received', urgency: 'normal', notes: 'Healthcare training series — medical terminology', created: '2026-03-29' },
  ];
  saveProjects(samples);
  return samples;
}

function genId() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

// ============================================================
// KANBAN BOARD
// ============================================================
function renderKanban() {
  const projects = getProjects();
  
  STATUSES.forEach(status => {
    const col = document.getElementById('col' + capitalize(status.replace('-', '')));
    const countEl = document.getElementById('count' + capitalize(status.replace('-', '')));
    if (!col) return;
    
    const items = projects.filter(p => p.status === status);
    countEl.textContent = items.length;
    
    col.innerHTML = items.map(p => `
      <div class="kanban-card" data-id="${p.id}" onclick="openProject('${p.id}')">
        <div class="card-client">${p.client}</div>
        <div class="card-langs">${p.source} → ${p.targets}</div>
        <div class="card-meta">
          <span>${p.duration} min</span>
          <span class="card-urgency ${p.urgency}">${p.urgency === 'rush' ? '⚡ Rush' : '🟢 Normal'}</span>
          <span class="card-price">$${p.price}</span>
        </div>
      </div>
    `).join('');
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Column ID mapping
function getColumnId(status) {
  const map = {
    'received': 'Received', 'quoted': 'Quoted', 'in-progress': 'Inprogress',
    'qc': 'Qc', 'delivered': 'Delivered', 'paid': 'Paid'
  };
  return map[status] || '';
}

// ============================================================
// CLIENTS VIEW
// ============================================================
function renderClients() {
  const projects = getProjects();
  const clientMap = {};
  
  projects.forEach(p => {
    if (!clientMap[p.email]) {
      clientMap[p.email] = { name: p.client, email: p.email, projects: 0, revenue: 0, lastDate: '' };
    }
    clientMap[p.email].projects++;
    if (p.status === 'paid') clientMap[p.email].revenue += p.price;
    if (p.created > clientMap[p.email].lastDate) clientMap[p.email].lastDate = p.created;
  });

  const tbody = document.getElementById('clientsTableBody');
  tbody.innerHTML = Object.values(clientMap).map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.projects}</td>
      <td style="color:var(--success);font-weight:600;">$${c.revenue}</td>
      <td>${c.lastDate}</td>
    </tr>
  `).join('');
}

// ============================================================
// ANALYTICS VIEW
// ============================================================
function renderAnalytics() {
  const projects = getProjects();
  
  const totalRevenue = projects.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.price, 0);
  const totalProjects = projects.length;
  const uniqueClients = new Set(projects.map(p => p.email)).size;
  const avgValue = totalProjects > 0 ? Math.round(projects.reduce((s, p) => s + p.price, 0) / totalProjects) : 0;

  document.getElementById('metricRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
  document.getElementById('metricProjects').textContent = totalProjects;
  document.getElementById('metricClients').textContent = uniqueClients;
  document.getElementById('metricAvg').textContent = `$${avgValue}`;

  // Bar chart — revenue by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthData = [0, 0, 0, 0, 0, 0];
  
  projects.filter(p => p.status === 'paid').forEach(p => {
    const month = new Date(p.created).getMonth();
    if (month >= 0 && month < 6) monthData[month] += p.price;
  });

  const maxVal = Math.max(...monthData, 1);
  const chart = document.getElementById('revenueChart');
  chart.innerHTML = months.map((m, i) => `
    <div class="bar-item">
      <div class="bar-value">$${monthData[i]}</div>
      <div class="bar" style="height: ${(monthData[i] / maxVal) * 160}px;"></div>
      <div class="bar-label">${m}</div>
    </div>
  `).join('');
}

// ============================================================
// MODAL (Create/Edit Project)
// ============================================================
function openNewProject() {
  document.getElementById('modalTitle').textContent = 'New Project';
  document.getElementById('projectId').value = '';
  document.getElementById('pClientName').value = '';
  document.getElementById('pClientEmail').value = '';
  document.getElementById('pSourceLang').value = 'English';
  document.getElementById('pTargetLangs').value = '';
  document.getElementById('pDuration').value = 5;
  document.getElementById('pPrice').value = 0;
  document.getElementById('pNotes').value = '';
  document.getElementById('pStatus').value = 'received';
  document.getElementById('pUrgency').value = 'normal';
  document.getElementById('deleteProjectBtn').style.display = 'none';
  document.getElementById('projectModal').classList.remove('hidden');
}

window.openProject = function(id) {
  const projects = getProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalTitle').textContent = 'Edit Project';
  document.getElementById('projectId').value = p.id;
  document.getElementById('pClientName').value = p.client;
  document.getElementById('pClientEmail').value = p.email;
  document.getElementById('pSourceLang').value = p.source;
  document.getElementById('pTargetLangs').value = p.targets;
  document.getElementById('pDuration').value = p.duration;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pNotes').value = p.notes || '';
  document.getElementById('pStatus').value = p.status;
  document.getElementById('pUrgency').value = p.urgency;
  document.getElementById('deleteProjectBtn').style.display = '';
  document.getElementById('projectModal').classList.remove('hidden');
};

function closeModal() {
  document.getElementById('projectModal').classList.add('hidden');
}

function saveProject(e) {
  e.preventDefault();
  const id = document.getElementById('projectId').value;
  const projects = getProjects();

  const data = {
    id: id || genId(),
    client: document.getElementById('pClientName').value,
    email: document.getElementById('pClientEmail').value,
    source: document.getElementById('pSourceLang').value,
    targets: document.getElementById('pTargetLangs').value,
    duration: parseInt(document.getElementById('pDuration').value),
    price: parseInt(document.getElementById('pPrice').value),
    notes: document.getElementById('pNotes').value,
    status: document.getElementById('pStatus').value,
    urgency: document.getElementById('pUrgency').value,
    created: id ? (projects.find(p => p.id === id)?.created || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
  };

  if (id) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx >= 0) projects[idx] = data;
  } else {
    projects.push(data);
  }

  saveProjects(projects);
  closeModal();
  renderAll();
}

function deleteProject() {
  const id = document.getElementById('projectId').value;
  if (!id) return;
  if (!confirm('Delete this project? This cannot be undone.')) return;
  
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  saveProjects(projects);
  closeModal();
  renderAll();
}

// ============================================================
// VIEW SWITCHING
// ============================================================
function switchView(view) {
  const views = { kanban: 'kanbanView', clients: 'clientsView', analytics: 'analyticsView' };
  const titles = { kanban: '📋 Project Board', clients: '👥 Clients', analytics: '📊 Analytics' };

  Object.values(views).forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById(views[view]).classList.remove('hidden');
  document.getElementById('viewTitle').textContent = titles[view];

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });

  if (view === 'clients') renderClients();
  if (view === 'analytics') renderAnalytics();
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  renderKanban();
  renderClients();
  renderAnalytics();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  // Nav
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.dataset.view) switchView(item.dataset.view);
    });
  });

  // Buttons
  document.getElementById('newProjectBtn').addEventListener('click', openNewProject);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('projectForm').addEventListener('submit', saveProject);
  document.getElementById('deleteProjectBtn').addEventListener('click', deleteProject);

  // Sidebar toggle (mobile)
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Close modal on overlay click
  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('projectModal')) closeModal();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
