/* ════════════════════════════════════════════════════
   PropertyApp — Main Application
   ════════════════════════════════════════════════════ */

/* ── Auth ── */
const Auth = {
  login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass  = document.getElementById('login-password').value;
    if (email === 'admin@asico.ae' && pass === 'admin123') {
      localStorage.setItem('pa_auth', '1');
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('app-shell').classList.remove('hidden');
      navigate('dashboard');
      renderNotifications();
    } else {
      const err = document.getElementById('login-error');
      err.textContent = 'Invalid email or password.';
      err.classList.remove('hidden');
    }
  },
  logout() {
    localStorage.removeItem('pa_auth');
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    closeUserMenu();
  },
  check() {
    if (localStorage.getItem('pa_auth')) {
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('app-shell').classList.remove('hidden');
      navigate('dashboard');
      renderNotifications();
    }
  }
};

/* ── Router ── */
const routes = {
  'dashboard':       renderDashboard,
  'projects':        renderProjects,
  'properties':      renderProperties,
  'units':           renderUnits,
  'lessor':          renderLessor,
  'leads':           renderLeads,
  'leasing-request': renderLeasingRequests,
  'booking':         renderBookings,
  'collection':      renderCollection,
  'bank-deposit':    renderBankDeposit,
  'tenants':         renderTenants,
  'agents':          renderAgents,
  'property-admin':  renderPropertyAdmin,
  'facilitators':    renderFacilitators,
  'contracts':       renderContracts,
  'renewals':        renderRenewals,
  'approvals':       renderApprovals,
  'legal':           renderLegal,
  'maintenance':     renderMaintenance,
  'move-in':         renderMoveIn,
  'move-out':        renderMoveOut,
  'direct-debit':    renderDirectDebit,
  'mailbox':         renderMailbox,
  'reports':         renderReports,
  'workboard':       renderWorkboard,
  'settings':        renderSettings
};

const breadcrumbs = {
  'dashboard':'Dashboard','projects':'Property Mgmt. / Projects',
  'properties':'Property Mgmt. / Properties','units':'Property Mgmt. / Units',
  'lessor':'Property Mgmt. / Lessor','leads':'CRM / Leads',
  'leasing-request':'CRM / Leasing Request','booking':'CRM / Booking',
  'collection':'Accounts / Collection','bank-deposit':'Accounts / Bank Deposit',
  'tenants':'People / Tenants','agents':'People / Agents',
  'property-admin':'People / Property Admin','facilitators':'People / Facilitators',
  'contracts':'Contracts','renewals':'Renewals','approvals':'Approvals',
  'legal':'Legal','maintenance':'Maintenance','move-in':'Inspection / Move In',
  'move-out':'Inspection / Move Out','direct-debit':'Direct Debit',
  'mailbox':'Mail Box','reports':'Reports','workboard':'Workboard','settings':'Settings'
};

let currentRoute = 'dashboard';

function navigate(route) {
  currentRoute = route;
  closeUserMenu();
  closeNotifications();
  // Close mobile sidebar on navigation
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.remove('visible');
  }
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
  document.getElementById('breadcrumb').textContent = breadcrumbs[route] || route;
  const fn = routes[route];
  if (fn) fn();
}

/* ── Sidebar ── */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sb.classList.toggle('mobile-open');
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      overlay.onclick = () => {
        sb.classList.remove('mobile-open');
        overlay.classList.remove('visible');
      };
      document.body.appendChild(overlay);
    }
    overlay.classList.toggle('visible', sb.classList.contains('mobile-open'));
  } else {
    sb.classList.toggle('collapsed');
  }
}

function toggleGroup(header) {
  header.classList.toggle('open');
  header.nextElementSibling.classList.toggle('open');
}

/* ── Notifications ── */
function renderNotifications() {
  const list = document.getElementById('notif-list');
  const unread = DB.notifications.filter(n => !n.read);
  document.getElementById('notif-count').textContent = unread.length;
  list.innerHTML = DB.notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead(${n.id})">
      <div class="notif-item-title">${n.text}</div>
      <div class="notif-item-text">Unit ${n.unitNo} · ${n.property}</div>
      <div class="notif-item-time">${n.time}</div>
    </div>`).join('') ||
    `<div style="padding:28px;text-align:center;color:var(--text-muted);font-size:12px">
       You have no notifications right now.
     </div>`;
}

function toggleNotifications() {
  document.getElementById('notif-panel').classList.toggle('hidden');
  document.getElementById('user-menu').classList.add('hidden');
}
function closeNotifications() { document.getElementById('notif-panel').classList.add('hidden'); }
function markNotifRead(id) {
  const n = DB.notifications.find(x => x.id === id);
  if (n) n.read = true;
  renderNotifications();
}
function markAllRead() { DB.notifications.forEach(n => n.read = true); renderNotifications(); }
function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('hidden');
  closeNotifications();
}
function closeUserMenu() { document.getElementById('user-menu').classList.add('hidden'); }

document.addEventListener('click', e => {
  if (!e.target.closest('.notif-wrapper')) closeNotifications();
  if (!e.target.closest('.user-wrapper'))  closeUserMenu();
});

/* ── Modal ── */
function openModal(title, bodyHTML, footerHTML = '', size = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  const box = document.getElementById('modal-box');
  box.className = 'modal-box' + (size ? ' modal-' + size : '');
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

/* ── Toast ── */
function toast(msg, type = 'success') {
  const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px;">${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ── Forgot password ── */
function showForgotPassword() {
  openModal('Reset Password',
    `<div class="form-group">
       <label>Registered Email Address</label>
       <input type="email" id="fp-email" placeholder="you@company.ae" />
     </div>
     <div class="alert alert-info">A password reset link will be sent to your email.</div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Reset link sent to your email','success');closeModal()">Send Reset Link</button>`
  );
}

/* ── Helpers ── */
function setContent(html) {
  document.getElementById('page-content').innerHTML = html;
}

function filterTable(inputId, tableId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════ */
function renderDashboard() {
  const d = DB.getDashStats();
  setContent(`
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-subtitle">Welcome back, ${DB.user.name} · ${DB.user.company}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="badge badge-primary" style="font-size:11px;padding:5px 12px">Enterprise Plan</span>
        <span class="badge badge-success">An Idea by Sheeraz Shaikh</span>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-grid">
      <div class="kpi-card purple">
        <div class="kpi-icon"><span class="material-symbols-outlined">receipt_long</span></div>
        <div class="kpi-label">Total Contract Value</div>
        <div class="kpi-value">${DB.fmtAED(d.TConValue)}</div>
        <div class="kpi-sub">${d.TContract} contracts</div>
      </div>
      <div class="kpi-card cyan">
        <div class="kpi-icon"><span class="material-symbols-outlined">account_balance</span></div>
        <div class="kpi-label">Unrealised Collection</div>
        <div class="kpi-value">${DB.fmtAED(d.TUnrealiseCol)}</div>
        <div class="kpi-sub">Ready units</div>
      </div>
      <div class="kpi-card emerald">
        <div class="kpi-icon"><span class="material-symbols-outlined">trending_up</span></div>
        <div class="kpi-label">Est. Full Occupancy</div>
        <div class="kpi-value">${DB.fmtAED(d.TEstCol)}</div>
        <div class="kpi-sub">100% occupied</div>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-icon"><span class="material-symbols-outlined">home_work</span></div>
        <div class="kpi-label">Occupancy Rate</div>
        <div class="kpi-value">${d.occupancyPct}%</div>
        <div class="kpi-sub">${d.totalOccupied} / ${d.totalUnits} units</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2-1" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Contract Lifecycle</div>
          <span class="badge badge-primary">Live</span>
        </div>
        <div style="height:220px"><canvas id="contractChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Unit Occupancy</div>
        </div>
        <div style="height:160px;display:flex;align-items:center;justify-content:center">
          <canvas id="occupancyChart"></canvas>
        </div>
        <div class="occupancy-legend" style="display:flex; justify-content:center; gap: 16px; margin-top: 16px; font-size: 12px;">
          <div class="legend-item" style="display:flex; align-items:center; gap: 6px;">
            <div class="legend-dot" style="width:10px; height:10px; border-radius:50%; background:#191248;"></div>
            Occupied (${d.totalOccupied})
          </div>
          <div class="legend-item" style="display:flex; align-items:center; gap: 6px;">
            <div class="legend-dot" style="width:10px; height:10px; border-radius:50%; background:#e81a47;"></div>
            Booked (${d.totalBooked})
          </div>
          <div class="legend-item" style="display:flex; align-items:center; gap: 6px;">
            <div class="legend-dot" style="width:10px; height:10px; border-radius:50%; background:#f59e0b;"></div>
            Vacant (${d.totalVacant})
          </div>
        </div>
      </div>
    </div>

    <!-- CRM + Stats Row -->
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">CRM Pipeline</div></div>
        <div class="crm-stat-grid">
          ${[
            ['Leads',     d.TLead,           '#191248'],
            ['Requests',  d.TLeasingRequest,  '#e81a47'],
            ['Bookings',  d.TBooking,         '#f59e0b'],
            ['Contracts', d.TContract,        '#10b981']
          ].map(([l,v,c]) => `
            <div class="crm-stat-box">
              <span class="crm-stat-value" style="color:${c};">${v}</span>
              <span class="crm-stat-label">${l}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Contract Statistics</div></div>
        ${[
          ['Active',          d.TNewContract,      'badge-success'],
          ['Under Renewal',   d.TExpAndRenewal,    'badge-warning'],
          ['Expiring ≤ 30d',  d.TNearToExpiry,     'badge-warning'],
          ['Expired',         d.TExpiredContract,  'badge-danger'],
          ['Under Notice',    d.TUnderNoticeCont,  'badge-secondary'],
        ].map(([l,v,b]) => `
          <div class="stat-row">
            <span class="stat-label">${l}</span>
            <span class="badge ${b}">${v}</span>
          </div>`).join('')}
      </div>
    </div>

    <!-- Property Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Property Overview</div>
        <button class="btn btn-sm btn-outline-primary" onclick="navigate('properties')">View All →</button>
      </div>
      <div class="table-wrapper" style="border:none;background:transparent;backdrop-filter:none">
        <table>
          <thead>
            <tr><th>Property</th><th>Location</th><th>Units</th><th>Occupied</th><th>Booked</th><th>Vacant</th><th>Occupancy</th></tr>
          </thead>
          <tbody>
            ${DB.properties.map(p => {
              const pct = Math.round((p.occupied / p.units) * 100);
              return `<tr>
                <td class="font-semibold">${p.name}</td>
                <td style="color:var(--text-secondary)">${p.location}</td>
                <td>${p.units}</td>
                <td><span class="badge badge-occupied">${p.occupied}</span></td>
                <td><span class="badge badge-booked">${p.booked}</span></td>
                <td><span class="badge badge-vacant">${p.vacant}</span></td>
                <td style="width:140px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar-wrap" style="flex:1">
                      <div class="progress-bar" style="width:${pct}%"></div>
                    </div>
                    <span style="font-size:11px;color:var(--text-muted);min-width:30px">${pct}%</span>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  requestAnimationFrame(() => {
    const isDark     = document.documentElement.dataset.theme === 'dark';
    const gridColor  = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 18, 72, 0.05)';
    const tickColor  = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(25, 18, 72, 0.5)';
    const fontFamily = 'Inter, system-ui, sans-serif';

    new Chart(document.getElementById('contractChart'), {
      type: 'bar',
      data: {
        labels: ['Active', 'Renewal', 'Expiring', 'Expired', 'Legal', 'Notice'],
        datasets: [{
          data: [d.TNewContract, d.TExpAndRenewal, d.TNearToExpiry, d.TExpiredContract, 1, 1],
          backgroundColor: ['#191248','#e81a47','#f59e0b','#dc3545','#191248','#6b7280'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: { color: tickColor, font: { family: fontFamily, size: 11 }, stepSize: 1 },
            grid: { color: gridColor },
            border: { color: 'transparent' }
          },
          x: {
            ticks: { color: tickColor, font: { family: fontFamily, size: 11 } },
            grid: { display: false },
            border: { color: 'transparent' }
          }
        }
      }
    });

    new Chart(document.getElementById('occupancyChart'), {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Booked', 'Vacant'],
        datasets: [{
          data: [d.totalOccupied, d.totalBooked, d.totalVacant],
          backgroundColor: ['#191248', '#e81a47', '#f59e0b'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { titleFont: { family: fontFamily }, bodyFont: { family: fontFamily } }
        }
      }
    });
  });
}

/* ════════════════════════════════════════════════════
   PROPERTY MANAGEMENT
   ════════════════════════════════════════════════════ */
function renderProjects() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Projects</div><div class="page-subtitle">${DB.projects.length} projects in portfolio</div></div>
      <button class="btn btn-primary" onclick="openAddProject()">+ Add Project</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="proj-search" placeholder="Search projects…" oninput="filterTable('proj-search','proj-table')" />
      </div>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="proj-table">
          <thead><tr><th>#</th><th>Project Name</th><th>Location</th><th>Units</th><th>Manager</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.projects.map(p => `<tr>
              <td style="color:var(--text-muted)">${p.id}</td>
              <td class="font-semibold">${p.name}</td>
              <td style="color:var(--text-secondary)">${p.location}</td>
              <td>${p.units}</td>
              <td>${p.manager}</td>
              <td>${p.year}</td>
              <td><span class="badge badge-success">${p.status}</span></td>
              <td><div class="td-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="toast('Edit project ${p.id}','info')">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="toast('Delete project','error')">Delete</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function openAddProject() {
  openModal('Add Project',
    `<div class="form-row">
       <div class="form-group"><label>Project Name</label><input type="text" placeholder="e.g. Marina Heights" /></div>
       <div class="form-group"><label>Location</label><input type="text" placeholder="Dubai Marina" /></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Total Units</label><input type="number" placeholder="48" /></div>
       <div class="form-group"><label>Manager</label><input type="text" placeholder="Manager name" /></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Project added successfully','success');closeModal()">Save Project</button>`
  );
}

function renderProperties() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Properties</div><div class="page-subtitle">${DB.properties.length} properties across all projects</div></div>
      <button class="btn btn-primary" onclick="openAddProperty()">+ Add Property</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="prop-search" placeholder="Search properties…" oninput="filterTable('prop-search','prop-table')" />
      </div>
      <select oninput="filterTable('prop-search','prop-table')">
        <option value="">All Types</option><option>Residential</option><option>Commercial</option>
      </select>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="prop-table">
          <thead><tr><th>Ref</th><th>Property</th><th>Type</th><th>Location</th><th>Units</th><th>Occupied</th><th>Booked</th><th>Vacant</th><th>Occupancy</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.properties.map(p => {
              const pct = Math.round((p.occupied / p.units) * 100);
              return `<tr>
                <td style="color:var(--text-muted);font-size:11px">${p.ref}</td>
                <td class="font-semibold">${p.name}</td>
                <td><span class="badge ${p.type === 'Residential' ? 'badge-info' : 'badge-secondary'}">${p.type}</span></td>
                <td style="color:var(--text-secondary)">${p.location}</td>
                <td>${p.units}</td>
                <td><span class="badge badge-occupied">${p.occupied}</span></td>
                <td><span class="badge badge-booked">${p.booked}</span></td>
                <td><span class="badge badge-vacant">${p.vacant}</span></td>
                <td style="width:120px">
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar" style="width:${pct}%"></div></div>
                    <span style="font-size:10px;color:var(--text-muted)">${pct}%</span>
                  </div>
                </td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing property','info')">View</button>
                  <button class="btn btn-sm btn-secondary" onclick="toast('Editing property','info')">Edit</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function openAddProperty() {
  openModal('Add Property',
    `<div class="form-row">
       <div class="form-group"><label>Property Name</label><input type="text" placeholder="Marina Tower C" /></div>
       <div class="form-group"><label>Reference</label><input type="text" placeholder="MTC-003" /></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Project</label><select>${DB.projects.map(p => `<option>${p.name}</option>`).join('')}</select></div>
       <div class="form-group"><label>Type</label><select><option>Residential</option><option>Commercial</option></select></div>
     </div>
     <div class="form-group"><label>Location</label><input type="text" placeholder="Dubai Marina" /></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Property added','success');closeModal()">Save</button>`
  );
}

function renderUnits() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Units</div><div class="page-subtitle">${DB.units.length} units managed</div></div>
      <button class="btn btn-primary" onclick="openAddUnit()">+ Add Unit</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="unit-search" placeholder="Search units…" oninput="filterTable('unit-search','unit-table')" />
      </div>
      <select id="unit-status-filter" onchange="filterUnitsByStatus()">
        <option value="">All Status</option><option>Occupied</option><option>Vacant</option><option>Booked</option>
      </select>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="unit-table">
          <thead><tr><th>Unit No</th><th>Property</th><th>Model</th><th>Block</th><th>Use</th><th>Area (sqft)</th><th>Annual Rent</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.units.map(u => {
              const prop = DB.getProperty(u.propertyId);
              const statusMap = { Occupied:'badge-occupied', Vacant:'badge-vacant', Booked:'badge-booked' };
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${u.unitNo}</td>
                <td style="color:var(--text-secondary)">${prop?.name || '—'}</td>
                <td>${u.model}</td>
                <td style="color:var(--text-muted)">${u.block}</td>
                <td><span class="badge ${u.use === 'Residential' ? 'badge-info' : 'badge-secondary'}">${u.use}</span></td>
                <td>${u.area.toLocaleString()}</td>
                <td class="font-semibold">${DB.fmtAED(u.rent)}</td>
                <td><span class="badge ${statusMap[u.status] || 'badge-secondary'}">${u.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="viewUnit(${u.id})">View</button>
                  <button class="btn btn-sm btn-secondary" onclick="toast('Edit unit','info')">Edit</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function filterUnitsByStatus() {
  const val = document.getElementById('unit-status-filter').value.toLowerCase();
  document.querySelectorAll('#unit-table tbody tr').forEach(row => {
    row.style.display = !val || row.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
}

function openAddUnit() {
  openModal('Add Unit',
    `<div class="form-row">
       <div class="form-group"><label>Unit No</label><input type="text" placeholder="A-301" /></div>
       <div class="form-group"><label>Property</label><select>${DB.properties.map(p => `<option>${p.name}</option>`).join('')}</select></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Model</label><input type="text" placeholder="2BR Apartment" /></div>
       <div class="form-group"><label>Use Type</label><select><option>Residential</option><option>Commercial</option></select></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Area (sqft)</label><input type="number" placeholder="1200" /></div>
       <div class="form-group"><label>Annual Rent (<img src="dhiram-sign.svg" style="height: 0.85em; width: auto; vertical-align: middle; margin-right: 2px; margin-bottom: 2px;" alt="AED" />)</label><input type="number" placeholder="110000" /></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Unit added','success');closeModal()">Save</button>`
  );
}

function viewUnit(id) {
  const u = DB.getUnit(id);
  const prop = DB.getProperty(u.propertyId);
  openModal(`Unit ${u.unitNo} — Details`,
    `<div class="detail-grid">
       <div class="detail-item"><label>Unit No</label><div class="value">${u.unitNo}</div></div>
       <div class="detail-item"><label>Property</label><div class="value">${prop?.name}</div></div>
       <div class="detail-item"><label>Model</label><div class="value">${u.model}</div></div>
       <div class="detail-item"><label>Layout</label><div class="value">${u.layout}</div></div>
       <div class="detail-item"><label>Block</label><div class="value">${u.block}</div></div>
       <div class="detail-item"><label>Use Type</label><div class="value">${u.use}</div></div>
       <div class="detail-item"><label>Area</label><div class="value">${u.area.toLocaleString()} sqft</div></div>
       <div class="detail-item"><label>Annual Rent</label><div class="value" style="color:var(--emerald)">${DB.fmtAED(u.rent)}</div></div>
       <div class="detail-item"><label>Status</label><div class="value">${u.status}</div></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="toast('Edit mode','info')">Edit</button>`
  );
}

function renderLessor() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Lessors / Landlords</div></div>
      <button class="btn btn-primary" onclick="toast('Add lessor form','info')">+ Add Lessor</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Emirates ID</th><th>Properties</th><th>Total Units</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.lessors.map(l => `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  <div class="avatar" style="width:30px;height:30px;font-size:10px">${DB.initials(l.name)}</div>
                  <span class="font-semibold">${l.name}</span>
                </div>
              </td>
              <td style="color:var(--text-secondary)">${l.email}</td>
              <td>${l.phone}</td>
              <td style="color:var(--text-muted);font-size:11px">${l.eid}</td>
              <td>${l.properties}</td>
              <td>${l.totalUnits}</td>
              <td><div class="td-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing lessor','info')">View</button>
                <button class="btn btn-sm btn-secondary" onclick="toast('Edit lessor','info')">Edit</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

/* ════════════════════════════════════════════════════
   CRM
   ════════════════════════════════════════════════════ */
function renderLeads() {
  const statusColors = { New:'badge-secondary', Contacted:'badge-info', Qualified:'badge-primary', Proposal:'badge-warning', Converted:'badge-success', Lost:'badge-danger' };
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Leads</div><div class="page-subtitle">${DB.leads.length} total leads in pipeline</div></div>
      <button class="btn btn-primary" onclick="openAddLead()">+ Add Lead</button>
    </div>
    <div class="pipeline">
      ${['New','Contacted','Qualified','Proposal','Converted'].map((s, i) => `
        <div class="pipeline-step ${s==='New'?'active':''}" onclick="filterLeadsByStatus('${s}')">${s}</div>
        ${i < 4 ? '<span class="pipeline-arrow">›</span>' : ''}`).join('')}
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="lead-search" placeholder="Search leads…" oninput="filterTable('lead-search','lead-table')" />
      </div>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="lead-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Source</th><th>Interest</th><th>Agent</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.leads.map(l => {
              const agent = DB.agents.find(a => a.id === l.agentId);
              return `<tr>
                <td class="font-semibold">${l.name}</td>
                <td style="color:var(--text-secondary)">${l.email}</td>
                <td>${l.phone}</td>
                <td><span class="badge badge-secondary">${l.source}</span></td>
                <td>${l.interest}</td>
                <td style="color:var(--text-secondary)">${agent?.name || '—'}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(l.date)}</td>
                <td><span class="badge ${statusColors[l.status] || 'badge-secondary'}">${l.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing lead','info')">View</button>
                  <button class="btn btn-sm btn-primary" onclick="toast('Converted to leasing request','success')">→ Request</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function filterLeadsByStatus(status) {
  document.querySelectorAll('.pipeline-step').forEach(s =>
    s.classList.toggle('active', s.textContent.trim().startsWith(status))
  );
  document.querySelectorAll('#lead-table tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(status.toLowerCase()) ? '' : 'none';
  });
}

function openAddLead() {
  openModal('Add Lead',
    `<div class="form-row">
       <div class="form-group"><label>Full Name</label><input type="text" placeholder="John Smith" /></div>
       <div class="form-group"><label>Email</label><input type="email" placeholder="john@email.com" /></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Phone</label><input type="tel" placeholder="+971 50 000 0000" /></div>
       <div class="form-group"><label>Source</label><select><option>Website</option><option>Referral</option><option>Bayut</option><option>Property Finder</option><option>Walk-in</option></select></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Interest</label><input type="text" placeholder="2BR Dubai Marina" /></div>
       <div class="form-group"><label>Assign Agent</label><select>${DB.agents.map(a => `<option>${a.name}</option>`).join('')}</select></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Lead added','success');closeModal()">Save Lead</button>`
  );
}

function renderLeasingRequests() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Leasing Requests</div></div>
      <button class="btn btn-primary" onclick="toast('New leasing request form','info')">+ New Request</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>CRM No</th><th>Unit</th><th>Req. Rent</th><th>Commission</th><th>Sec. Deposit</th><th>Installments</th><th>Free Days</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.leasingRequests.map(r => {
              const unit = DB.getUnit(r.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${r.crmNo}</td>
                <td>${unit?.unitNo || '—'}</td>
                <td class="font-semibold">${DB.fmtAED(r.reqRent)}</td>
                <td>${DB.fmtAED(r.reqCommission)}</td>
                <td>${DB.fmtAED(r.reqSecDeposit)}</td>
                <td>${r.reqInstallments}</td>
                <td>${r.reqFreeDays}</td>
                <td><span class="badge ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="viewQuote(${r.id})">View Quote</button>
                  <button class="btn btn-sm btn-primary" onclick="toast('Converted to booking','success')">→ Booking</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function viewQuote(id) {
  const r = DB.leasingRequests.find(x => x.id === id);
  const unit = DB.getUnit(r.unitId);
  const prop = unit ? DB.getProperty(unit.propertyId) : null;
  openModal('Quotation Letter',
    `<div class="info-box">Asico Real Estate LLC · ${DB.fmtDate(r.date)}</div>
     <div class="detail-grid">
       <div class="detail-item"><label>CRM Reference</label><div class="value">${r.crmNo}</div></div>
       <div class="detail-item"><label>Unit</label><div class="value">${unit?.unitNo || '—'}</div></div>
       <div class="detail-item"><label>Property</label><div class="value">${prop?.name || '—'}</div></div>
       <div class="detail-item"><label>Property Type</label><div class="value">${unit?.use || '—'}</div></div>
       <div class="detail-item"><label>Requested Rent</label><div class="value" style="color:var(--emerald)">${DB.fmtAED(r.reqRent)}</div></div>
       <div class="detail-item"><label>Commission</label><div class="value">${DB.fmtAED(r.reqCommission)}</div></div>
       <div class="detail-item"><label>Security Deposit</label><div class="value">${DB.fmtAED(r.reqSecDeposit)}</div></div>
       <div class="detail-item"><label>Management Fee</label><div class="value">${DB.fmtAED(r.reqMgmtFee)}</div></div>
       <div class="detail-item"><label>Installments</label><div class="value">${r.reqInstallments}</div></div>
       <div class="detail-item"><label>Free Days</label><div class="value">${r.reqFreeDays} days</div></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="toast('Quote PDF generated','success')">Download PDF</button>`,
    'lg'
  );
}

function renderBookings() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Bookings</div></div>
      <button class="btn btn-primary" onclick="toast('New booking form','info')">+ New Booking</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Booking No</th><th>Unit</th><th>Rent</th><th>Sec. Deposit</th><th>Installments</th><th>Start Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.bookings.map(b => {
              const unit = DB.getUnit(b.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${b.crmNo}</td>
                <td>${unit?.unitNo || '—'}</td>
                <td class="font-semibold">${DB.fmtAED(b.rent)}</td>
                <td>${DB.fmtAED(b.secDeposit)}</td>
                <td>${b.installments}</td>
                <td>${DB.fmtDate(b.startDate)}</td>
                <td><span class="badge badge-success">${b.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing booking','info')">View</button>
                  <button class="btn btn-sm btn-primary" onclick="toast('Contract created','success')">→ Contract</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

/* ════════════════════════════════════════════════════
   PEOPLE
   ════════════════════════════════════════════════════ */
function renderTenants() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Tenants</div><div class="page-subtitle">${DB.tenants.length} registered tenants</div></div>
      <button class="btn btn-primary" onclick="openAddTenant()">+ Add Tenant</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="tenant-search" placeholder="Search tenants…" oninput="filterTable('tenant-search','tenant-table')" />
      </div>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="tenant-table">
          <thead><tr><th>Tenant</th><th>Email</th><th>Phone</th><th>Nationality</th><th>Emirates ID</th><th>Unit</th><th>Verified</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.tenants.map(t => {
              const unit = DB.getUnit(t.unitId);
              return `<tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="avatar" style="width:30px;height:30px;font-size:10px">${DB.initials(t.name)}</div>
                    <span class="font-semibold">${t.name}</span>
                  </div>
                </td>
                <td style="color:var(--text-secondary)">${t.email}</td>
                <td>${t.phone}</td>
                <td>${t.nationality}</td>
                <td style="color:var(--text-muted);font-size:11px">${t.eid}</td>
                <td style="color:var(--purple)">${unit?.unitNo || '—'}</td>
                <td>${t.verified
                  ? '<span class="badge badge-verified">✓ Verified</span>'
                  : '<span class="badge badge-secondary">Unverified</span>'
                }</td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="viewTenant(${t.id})">View</button>
                  <button class="btn btn-sm btn-secondary" onclick="toast('Edit tenant','info')">Edit</button>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function viewTenant(id) {
  const t = DB.getTenant(id);
  const unit = DB.getUnit(t.unitId);
  const contract = DB.getContract(t.contractId);
  openModal(`Tenant — ${t.name}`,
    `<div style="display:flex;align-items:center;gap:16px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--border)">
       <div class="avatar" style="width:54px;height:54px;font-size:18px">${DB.initials(t.name)}</div>
       <div>
         <div class="font-bold" style="font-size:17px">${t.name}</div>
         <div style="color:var(--text-secondary);font-size:12px;margin-top:3px">${t.nationality} ·
           ${t.verified
             ? '<span class="badge badge-verified">✓ UAE Pass Verified</span>'
             : '<span class="badge badge-secondary">Unverified</span>'
           }
         </div>
       </div>
     </div>
     <div class="detail-grid">
       <div class="detail-item"><label>Email</label><div class="value">${t.email}</div></div>
       <div class="detail-item"><label>Phone</label><div class="value">${t.phone}</div></div>
       <div class="detail-item"><label>Emirates ID</label><div class="value">${t.eid}</div></div>
       <div class="detail-item"><label>Current Unit</label><div class="value" style="color:var(--purple)">${unit?.unitNo || '—'}</div></div>
       <div class="detail-item"><label>Contract No</label><div class="value">${contract?.contractNo || '—'}</div></div>
       <div class="detail-item"><label>Contract Value</label><div class="value" style="color:var(--emerald)">${contract ? DB.fmtAED(contract.value) : '—'}</div></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-uae-pass" onclick="toast('UAE Pass verification initiated','info')">🇦🇪 Verify via UAE Pass</button>`,
    'lg'
  );
}

function openAddTenant() {
  openModal('Add Tenant',
    `<div class="form-row">
       <div class="form-group"><label>Full Name</label><input type="text" placeholder="John Smith" /></div>
       <div class="form-group"><label>Email</label><input type="email" placeholder="john@email.com" /></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Phone</label><input type="tel" placeholder="+971 50 000 0000" /></div>
       <div class="form-group"><label>Nationality</label><input type="text" placeholder="UAE" /></div>
     </div>
     <div class="form-group"><label>Emirates ID / Passport No</label><input type="text" placeholder="784-1990-0000000-0" /></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Tenant added','success');closeModal()">Save Tenant</button>`
  );
}

function renderAgents() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Agents</div></div>
      <button class="btn btn-primary" onclick="toast('Add agent form','info')">+ Add Agent</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Agent</th><th>Email</th><th>Phone</th><th>RERA License</th><th>Commission</th><th>Active Leads</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.agents.map(a => `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  <div class="avatar" style="width:30px;height:30px;font-size:10px">${DB.initials(a.name)}</div>
                  <span class="font-semibold">${a.name}</span>
                </div>
              </td>
              <td style="color:var(--text-secondary)">${a.email}</td>
              <td>${a.phone}</td>
              <td><span class="badge badge-info">${a.license}</span></td>
              <td style="color:var(--emerald)">${a.commission}</td>
              <td>${a.activeLeads}</td>
              <td><div class="td-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing agent','info')">View</button>
                <button class="btn btn-sm btn-secondary" onclick="toast('Edit agent','info')">Edit</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function renderPropertyAdmin() {
  const admins = DB.properties.reduce((acc, p) => {
    const ex = acc.find(x => x.name === p.admin);
    if (ex) { ex.props++; ex.units += p.units; }
    else acc.push({ name: p.admin, props: 1, units: p.units });
    return acc;
  }, []);
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Property Administrators</div></div>
      <button class="btn btn-primary" onclick="toast('Add property admin','info')">+ Add Admin</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Name</th><th>Assigned Properties</th><th>Units Managed</th><th>Actions</th></tr></thead>
          <tbody>
            ${admins.map(a => `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  <div class="avatar" style="width:30px;height:30px;font-size:10px">${DB.initials(a.name)}</div>
                  <span class="font-semibold">${a.name}</span>
                </div>
              </td>
              <td>${a.props}</td><td>${a.units}</td>
              <td><button class="btn btn-sm btn-outline-primary" onclick="toast('Viewing admin','info')">View</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function renderFacilitators() {
  setContent(`
    <div class="page-header"><div class="page-title">Facilitators</div>
    <button class="btn btn-primary" onclick="toast('Add facilitator','info')">+ Add Facilitator</button></div>
    <div class="empty-state">
      <div class="empty-state-icon">🤝</div>
      <h4>No Facilitators Added</h4>
      <p>Add external facilitators who assist with leasing and property management.</p>
      <button class="btn btn-primary mt-2" onclick="toast('Add facilitator','info')">+ Add First Facilitator</button>
    </div>`);
}

/* ════════════════════════════════════════════════════
   CONTRACTS
   ════════════════════════════════════════════════════ */
function renderContracts() {
  const statusClass = { Active:'badge-success', 'Under Renewal':'badge-warning', 'Expiring Soon':'badge-warning', Expired:'badge-danger', 'Under Legal':'badge-danger', New:'badge-info' };
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Contracts</div><div class="page-subtitle">${DB.contracts.length} total contracts</div></div>
      <button class="btn btn-primary" onclick="toast('New contract wizard','info')">+ New Contract</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="con-search" placeholder="Search contracts…" oninput="filterTable('con-search','con-table')" />
      </div>
      <select>
        <option>All Status</option><option>Active</option><option>Under Renewal</option><option>Expiring Soon</option><option>Expired</option>
      </select>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="con-table">
          <thead><tr><th>Contract No</th><th>Tenant</th><th>Unit</th><th>Value</th><th>Start</th><th>End</th><th>Installments</th><th>Ejari</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.contracts.map(c => {
              const tenant = DB.getTenant(c.tenantId);
              const unit = DB.getUnit(c.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${c.contractNo}</td>
                <td>${tenant?.name || '—'}</td>
                <td>${unit?.unitNo || '—'}</td>
                <td class="font-semibold" style="color:var(--emerald)">${DB.fmtAED(c.value)}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(c.startDate)}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(c.endDate)}</td>
                <td>${c.installments}</td>
                <td style="color:var(--text-muted);font-size:11px">${c.ejari}</td>
                <td><span class="badge ${statusClass[c.status] || 'badge-secondary'}">${c.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="viewContract(${c.id})">View</button>
                  ${c.status === 'Active' ? `<button class="btn btn-ejari btn-sm" onclick="toast('Ejari submitted','success')">Ejari</button>` : ''}
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function viewContract(id) {
  const c = DB.getContract(id);
  const tenant = DB.getTenant(c.tenantId);
  const unit = DB.getUnit(c.unitId);
  const prop = unit ? DB.getProperty(unit.propertyId) : null;
  openModal(`Contract ${c.contractNo}`,
    `<div class="info-box">Digital Lease Agreement · Asico Real Estate LLC</div>
     <div class="detail-grid">
       <div class="detail-item"><label>Contract No</label><div class="value" style="color:var(--purple)">${c.contractNo}</div></div>
       <div class="detail-item"><label>Ejari No</label><div class="value">${c.ejari}</div></div>
       <div class="detail-item"><label>Tenant</label><div class="value">${tenant?.name}</div></div>
       <div class="detail-item"><label>Unit</label><div class="value">${unit?.unitNo}</div></div>
       <div class="detail-item"><label>Property</label><div class="value">${prop?.name}</div></div>
       <div class="detail-item"><label>Contract Value</label><div class="value font-bold" style="color:var(--emerald)">${DB.fmtAED(c.value)}</div></div>
       <div class="detail-item"><label>Start Date</label><div class="value">${DB.fmtDate(c.startDate)}</div></div>
       <div class="detail-item"><label>End Date</label><div class="value">${DB.fmtDate(c.endDate)}</div></div>
       <div class="detail-item"><label>Installments</label><div class="value">${c.installments}</div></div>
       <div class="detail-item"><label>Status</label><div class="value">${c.status}</div></div>
       <div class="detail-item"><label>Signed</label><div class="value" style="color:var(--emerald)">${c.signed ? '✓ Digitally Signed' : 'Pending Signature'}</div></div>
     </div>
     ${!c.signed ? `<div class="alert alert-warning mt-2">This contract is pending digital signature.</div>` : ''}`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-outline-primary" onclick="toast('Contract PDF downloaded','success')">Download PDF</button>
     ${!c.signed ? `<button class="btn btn-primary" onclick="toast('You have successfully signed the contract','success');closeModal()">✍ Sign Contract</button>` : ''}`,
    'lg'
  );
}

/* ════════════════════════════════════════════════════
   RENEWALS
   ════════════════════════════════════════════════════ */
function renderRenewals() {
  setContent(`
    <div class="page-header"><div class="page-title">Renewals</div></div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Contract</th><th>Tenant</th><th>Unit</th><th>Current Rent</th><th>Proposed</th><th>Approved</th><th>Decision</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.renewals.map(r => {
              const c = DB.getContract(r.contractId);
              const t = DB.getTenant(r.tenantId);
              const u = DB.getUnit(r.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${c?.contractNo || '—'}</td>
                <td>${t?.name || '—'}</td>
                <td>${u?.unitNo || '—'}</td>
                <td>${DB.fmtAED(r.currentRent)}</td>
                <td style="color:var(--amber)">${DB.fmtAED(r.proposedRent)}</td>
                <td style="color:var(--emerald)">${r.approvedRent ? DB.fmtAED(r.approvedRent) : '<span style="color:var(--text-muted)">Pending</span>'}</td>
                <td><span class="badge ${r.decision === 'Renewing' ? 'badge-success' : 'badge-warning'}">${r.decision}</span></td>
                <td><span class="badge ${r.status === 'Pending' ? 'badge-warning' : 'badge-info'}">${r.status}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="renewalDecision(${r.id})">Decision</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function renewalDecision(id) {
  const r = DB.renewals.find(x => x.id === id);
  openModal('Renewal Decision',
    `<div class="form-row">
       <div class="form-group"><label>Renewal Decision</label>
         <select><option>Renewing</option><option>Not Renewing</option><option>Pending</option></select></div>
       <div class="form-group"><label>Termination Informed Date</label><input type="date" /></div>
     </div>
     <div class="form-group"><label>Reason (if not renewing)</label><input type="text" placeholder="Reason…" /></div>
     <div class="form-group"><label>Remarks</label><textarea>${r.remarks}</textarea></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Renewal decision saved','success');closeModal()">Save Decision</button>`
  );
}

/* ════════════════════════════════════════════════════
   APPROVALS
   ════════════════════════════════════════════════════ */
function renderApprovals() {
  setContent(`
    <div class="page-header"><div class="page-title">Approvals</div></div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Type</th><th>Reference</th><th>Description</th><th>Requested By</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.approvals.map(a => `<tr>
              <td><span class="badge badge-primary">${a.type}</span></td>
              <td class="font-semibold" style="color:var(--purple)">${a.ref}</td>
              <td style="color:var(--text-secondary);font-size:12px">${a.description}</td>
              <td>${a.requestedBy}</td>
              <td class="font-semibold">${DB.fmtAED(a.amount)}</td>
              <td style="color:var(--text-muted)">${DB.fmtDate(a.date)}</td>
              <td><span class="badge ${a.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${a.status}</span></td>
              <td><div class="td-actions">
                ${a.status === 'Pending' ? `
                  <button class="btn btn-sm btn-success" onclick="approveItem(${a.id})">Approve</button>
                  <button class="btn btn-sm btn-outline-danger" onclick="toast('Request rejected','error')">Reject</button>
                ` : `<button class="btn btn-sm btn-secondary" onclick="toast('Viewing approval','info')">View</button>`}
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function approveItem(id) {
  const a = DB.approvals.find(x => x.id === id);
  if (a) { a.status = 'Approved'; toast(`${a.type} approved`, 'success'); renderApprovals(); }
}

/* ════════════════════════════════════════════════════
   LEGAL
   ════════════════════════════════════════════════════ */
function renderLegal() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Legal Proceedings</div></div>
      <button class="btn btn-primary" onclick="toast('File new legal case','info')">+ File Case</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Ref</th><th>Tenant</th><th>Unit</th><th>Reason</th><th>Filed Date</th><th>Next Hearing</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.legal.map(l => {
              const t = DB.getTenant(l.tenantId);
              const u = DB.getUnit(l.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--blue)">${l.ref}</td>
                <td>${t?.name || '—'}</td>
                <td>${u?.unitNo || '—'}</td>
                <td style="color:var(--text-secondary);font-size:12px">${l.reason}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(l.filedDate)}</td>
                <td>${l.hearingDate ? DB.fmtDate(l.hearingDate) : '<span style="color:var(--text-muted)">—</span>'}</td>
                <td><span class="badge ${l.status === 'Resolved' ? 'badge-success' : 'badge-danger'}">${l.status}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="viewLegal(${l.id})">View Notes</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function viewLegal(id) {
  const l = DB.legal.find(x => x.id === id);
  openModal(`Case ${l.ref} — Hearing Notes`,
    `<div class="timeline">
       ${l.notes.map(n => `
         <div class="timeline-item">
           <div class="timeline-date">${DB.fmtDate(n.date)}</div>
           <div class="timeline-text">${n.note}</div>
         </div>`).join('')}
     </div>
     <div class="form-group mt-3">
       <label>Add Hearing Note</label>
       <textarea placeholder="Enter hearing notes…"></textarea>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="toast('Hearing note saved','success');closeModal()">Save Note</button>`,
    'lg'
  );
}

/* ════════════════════════════════════════════════════
   MAINTENANCE
   ════════════════════════════════════════════════════ */
function renderMaintenance() {
  const statusColors = { Pending:'badge-warning', 'In Progress':'badge-info', Scheduled:'badge-primary', Completed:'badge-success' };
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Maintenance</div><div class="page-subtitle">${DB.maintenance.filter(m => m.status !== 'Completed').length} open requests</div></div>
      <button class="btn btn-primary" onclick="openAddMaint()">+ New Request</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <input class="search-input" id="maint-search" placeholder="Search requests…" oninput="filterTable('maint-search','maint-table')" />
      </div>
      <select onchange="filterMaintPriority(this.value)">
        <option value="">All Priority</option><option>Normal</option><option>Medium</option><option>High</option><option>Emergency</option>
      </select>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table id="maint-table">
          <thead><tr><th>Request No</th><th>Unit</th><th>Title</th><th>Category</th><th>Priority</th><th>Assigned To</th><th>Scheduled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.maintenance.map(m => {
              const u = DB.getUnit(m.unitId);
              const pClass = { Normal:'priority-normal', Medium:'priority-medium', High:'priority-high', Emergency:'priority-emergency' };
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${m.reqNo}</td>
                <td>${u?.unitNo || '—'}</td>
                <td class="font-semibold">${m.title}</td>
                <td style="color:var(--text-secondary)">${m.category}</td>
                <td><span class="badge ${pClass[m.priority]}">${m.priority}</span></td>
                <td>${m.assignedTo || '<span style="color:var(--text-muted)">Unassigned</span>'}</td>
                <td style="color:var(--text-muted)">${m.scheduledDate ? DB.fmtDate(m.scheduledDate) : '—'}</td>
                <td><span class="badge ${statusColors[m.status] || 'badge-secondary'}">${m.status}</span></td>
                <td><div class="td-actions">
                  <button class="btn btn-sm btn-outline-primary" onclick="viewMaintenance(${m.id})">View</button>
                  ${m.status !== 'Completed' ? `<button class="btn btn-sm btn-success" onclick="completeMaint(${m.id})">Complete</button>` : ''}
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function filterMaintPriority(val) {
  document.querySelectorAll('#maint-table tbody tr').forEach(row => {
    row.style.display = !val || row.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

function viewMaintenance(id) {
  const m = DB.maintenance.find(x => x.id === id);
  const u = DB.getUnit(m.unitId);
  openModal(`${m.reqNo} — ${m.title}`,
    `<div class="detail-grid mb-3">
       <div class="detail-item"><label>Unit</label><div class="value">${u?.unitNo}</div></div>
       <div class="detail-item"><label>Category</label><div class="value">${m.category}</div></div>
       <div class="detail-item"><label>Priority</label><div class="value">${m.priority}</div></div>
       <div class="detail-item"><label>Status</label><div class="value">${m.status}</div></div>
       <div class="detail-item"><label>Assigned To</label><div class="value">${m.assignedTo || 'Unassigned'}</div></div>
       <div class="detail-item"><label>Scheduled</label><div class="value">${m.scheduledDate ? DB.fmtDate(m.scheduledDate) : '—'}</div></div>
     </div>
     <div class="section-title">Remarks</div>
     ${m.remarks.length ? m.remarks.map(r => `
       <div style="padding:12px;background:var(--bg-glass);border:1px solid var(--glass-border);border-radius:var(--r-sm);margin-bottom:8px;backdrop-filter:blur(8px)">
         <div style="display:flex;justify-content:space-between;margin-bottom:5px">
           <span class="font-semibold" style="font-size:12px">${r.user}</span>
           <span style="font-size:11px;color:var(--text-muted)">${DB.fmtDate(r.date)}</span>
         </div>
         <div style="font-size:13px;color:var(--text-secondary)">${r.text}</div>
       </div>`).join('') : '<div style="color:var(--text-muted);font-size:13px">No remarks yet.</div>'}
     ${m.feedback.length ? `
       <div class="section-title">Feedback</div>
       ${m.feedback.map(f => `<div class="info-box">${f.desc} — <em>${f.by}</em></div>`).join('')}` : ''}
     <div class="form-group mt-3"><label>Add Remark</label><textarea placeholder="Enter remark…"></textarea></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="toast('Remark saved','success');closeModal()">Save Remark</button>`,
    'lg'
  );
}

function openAddMaint() {
  openModal('New Maintenance Request',
    `<div class="form-row">
       <div class="form-group"><label>Unit</label><select>${DB.units.map(u => `<option value="${u.id}">${u.unitNo}</option>`).join('')}</select></div>
       <div class="form-group"><label>Category</label><select><option>HVAC</option><option>Plumbing</option><option>Electrical</option><option>Civil</option><option>Facilities</option><option>Other</option></select></div>
     </div>
     <div class="form-group"><label>Title / Issue Description</label><input type="text" placeholder="Brief description of the issue" /></div>
     <div class="form-row">
       <div class="form-group"><label>Priority</label><select><option>Normal</option><option>Medium</option><option>High</option><option>Emergency</option></select></div>
       <div class="form-group"><label>Assign To</label><input type="text" placeholder="Service provider name" /></div>
     </div>
     <div class="form-group"><label>Scheduled Date</label><input type="date" /></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Maintenance request created','success');closeModal()">Submit Request</button>`
  );
}

function completeMaint(id) {
  const m = DB.maintenance.find(x => x.id === id);
  if (m) { m.status = 'Completed'; toast(`${m.reqNo} marked as completed`, 'success'); renderMaintenance(); }
}

/* ════════════════════════════════════════════════════
   INSPECTION
   ════════════════════════════════════════════════════ */
function renderMoveIn() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Move-In Inspections</div></div>
      <button class="btn btn-primary" onclick="toast('New move-in inspection','info')">+ New Inspection</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Unit</th><th>Tenant</th><th>Date</th><th>Inspector</th><th>Condition</th><th>Images</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.inspections.moveIn.map(i => {
              const u = DB.getUnit(i.unitId);
              const t = DB.getTenant(i.tenantId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${u?.unitNo || '—'}</td>
                <td>${t?.name || '—'}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(i.date)}</td>
                <td>${i.inspector}</td>
                <td><span class="badge ${i.condition === 'Excellent' ? 'badge-success' : 'badge-info'}">${i.condition}</span></td>
                <td style="color:var(--text-secondary)">${i.images} photos</td>
                <td><span class="badge badge-success">${i.status}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="viewInspection('in',${i.id})">View Report</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function renderMoveOut() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Move-Out Inspections</div></div>
      <button class="btn btn-primary" onclick="toast('New move-out inspection','info')">+ New Inspection</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Unit</th><th>Tenant</th><th>Date</th><th>Inspector</th><th>Condition</th><th>Deduction</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.inspections.moveOut.map(i => {
              const u = DB.getUnit(i.unitId);
              const t = i.tenantId ? DB.getTenant(i.tenantId) : null;
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${u?.unitNo || '—'}</td>
                <td>${t?.name || '<span style="color:var(--text-muted)">TBD</span>'}</td>
                <td style="color:var(--text-muted)">${i.date ? DB.fmtDate(i.date) : '—'}</td>
                <td>${i.inspector || '—'}</td>
                <td>${i.condition ? `<span class="badge badge-warning">${i.condition}</span>` : '—'}</td>
                <td style="color:var(--rose)">${i.deduction ? DB.fmtAED(i.deduction) : '—'}</td>
                <td><span class="badge ${i.status === 'Completed' ? 'badge-success' : 'badge-warning'}">${i.status}</span></td>
                <td>${i.status === 'Completed'
                  ? `<button class="btn btn-sm btn-outline-primary" onclick="viewInspection('out',${i.id})">View Report</button>`
                  : `<button class="btn btn-sm btn-primary" onclick="toast('Start inspection','info')">Start</button>`
                }</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function viewInspection(type, id) {
  const i = (type === 'in' ? DB.inspections.moveIn : DB.inspections.moveOut).find(x => x.id === id);
  const u = DB.getUnit(i.unitId);
  openModal(`Inspection Report — ${u?.unitNo}`,
    `<div class="detail-grid">
       <div class="detail-item"><label>Type</label><div class="value">${type === 'in' ? 'Move In' : 'Move Out'}</div></div>
       <div class="detail-item"><label>Date</label><div class="value">${DB.fmtDate(i.date)}</div></div>
       <div class="detail-item"><label>Inspector</label><div class="value">${i.inspector}</div></div>
       <div class="detail-item"><label>Condition</label><div class="value">${i.condition}</div></div>
       ${i.deduction ? `<div class="detail-item"><label>Deduction</label><div class="value" style="color:var(--rose)">${DB.fmtAED(i.deduction)}</div></div>` : ''}
       <div class="detail-item"><label>Images</label><div class="value">${i.images} photos</div></div>
     </div>
     <div class="section-title">Notes</div>
     <div style="padding:14px;background:var(--bg-glass);border:1px solid var(--glass-border);border-radius:var(--r-sm);font-size:13px;color:var(--text-secondary)">
       ${i.notes || 'No notes recorded.'}
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="toast('Summary report downloaded','success')">Download Summary</button>`
  );
}

/* ════════════════════════════════════════════════════
   ACCOUNTS
   ════════════════════════════════════════════════════ */
function renderCollection() {
  const statusColors = { Deposited:'badge-success', Pending:'badge-warning', Bounced:'badge-danger', Held:'badge-secondary' };
  setContent(`
    <div class="page-header"><div class="page-title">Collection</div></div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Contract</th><th>Tenant</th><th>Cheque No</th><th>Amount</th><th>Due Date</th><th>Mode</th><th>Bank</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.collection.map(c => {
              const t = DB.getTenant(c.tenantId);
              const con = DB.getContract(c.contractId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${con?.contractNo || '—'}</td>
                <td>${t?.name || '—'}</td>
                <td style="color:var(--text-muted)">${c.chequeNo || 'N/A'}</td>
                <td class="font-semibold" style="color:var(--emerald)">${DB.fmtAED(c.amount)}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(c.dueDate)}</td>
                <td><span class="badge badge-secondary">${c.mode}</span></td>
                <td style="color:var(--text-secondary)">${c.bank}</td>
                <td><span class="badge ${statusColors[c.status] || 'badge-secondary'}">${c.status}</span></td>
                <td><div class="td-actions">
                  ${c.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="updateCollStatus(${c.id},'Deposited')">Deposit</button>` : ''}
                  ${c.status === 'Pending' ? `<button class="btn btn-sm btn-outline-danger" onclick="updateCollStatus(${c.id},'Held')">Hold</button>` : ''}
                  ${c.status === 'Bounced' ? `<button class="btn btn-sm btn-warning" onclick="toast('Replacement cheque requested','info')">Re-collect</button>` : ''}
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function updateCollStatus(id, status) {
  const c = DB.collection.find(x => x.id === id);
  if (c) { c.status = status; toast(`Cheque status updated to ${status}`, 'success'); renderCollection(); }
}

function renderBankDeposit() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Bank Deposits</div></div>
      <button class="btn btn-primary" onclick="toast('Record new deposit','info')">+ New Deposit</button>
    </div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Deposit Ref</th><th>Collection</th><th>Deposit Date</th><th>Amount</th><th>Bank</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.bankDeposits.map(d => {
              const coll = DB.collection.find(x => x.id === d.collectionId);
              return `<tr>
                <td class="font-semibold" style="color:var(--purple)">${d.depositRef}</td>
                <td style="color:var(--text-secondary)">${coll?.chequeNo || 'Direct Debit'}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(d.depositDate)}</td>
                <td class="font-semibold" style="color:var(--emerald)">${DB.fmtAED(d.amount)}</td>
                <td>${d.bank}</td>
                <td><span class="badge badge-success">${d.status}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

/* ════════════════════════════════════════════════════
   DIRECT DEBIT
   ════════════════════════════════════════════════════ */
function renderDirectDebit() {
  setContent(`
    <div class="page-header">
      <div><div class="page-title">Direct Debit</div></div>
      <button class="btn btn-primary" onclick="openAddDirectDebit()">+ Create Mandate</button>
    </div>
    <div class="info-box">⚠ Direct debit mandates allow automated rent collection. First installment due date must be at least 3 days ahead.</div>
    <div class="card p-0" style="padding:0">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Mandate ID</th><th>Tenant</th><th>Unit</th><th>Bank</th><th>IBAN</th><th>Amount</th><th>First Due</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.directDebits.map(d => {
              const t = DB.getTenant(d.tenantId);
              const u = DB.getUnit(d.unitId);
              return `<tr>
                <td class="font-semibold" style="color:var(--cyan)">${d.mandateId}</td>
                <td>${t?.name || '—'}</td>
                <td>${u?.unitNo || '—'}</td>
                <td>${d.bank}</td>
                <td style="color:var(--text-muted);font-size:11px">${d.iban}</td>
                <td class="font-semibold" style="color:var(--emerald)">${DB.fmtAED(d.amount)}</td>
                <td style="color:var(--text-muted)">${DB.fmtDate(d.firstDueDate)}</td>
                <td><span class="badge ${d.status === 'Active' ? 'badge-success' : d.status === 'Failed' ? 'badge-danger' : 'badge-warning'}">${d.status}</span></td>
                <td>${d.status === 'Failed'
                  ? `<button class="btn btn-sm btn-warning" onclick="toast('Retry initiated','info')">Retry</button>`
                  : `<button class="btn btn-sm btn-outline-danger" onclick="toast('Mandate cancelled','error')">Cancel</button>`
                }</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`);
}

function openAddDirectDebit() {
  openModal('Create Direct Debit Mandate',
    `<div class="alert alert-warning">First installment due date must be at least 3 days from today.</div>
     <div class="form-row">
       <div class="form-group"><label>Tenant</label><select>${DB.tenants.map(t => `<option>${t.name}</option>`).join('')}</select></div>
       <div class="form-group"><label>Unit</label><select>${DB.units.map(u => `<option>${u.unitNo}</option>`).join('')}</select></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Bank</label><input type="text" placeholder="Emirates NBD" /></div>
       <div class="form-group"><label>IBAN</label><input type="text" placeholder="AE07 0331 …" /></div>
     </div>
     <div class="form-row">
       <div class="form-group"><label>Instalment Amount (<img src="dhiram-sign.svg" style="height: 0.85em; width: auto; vertical-align: middle; margin-right: 2px; margin-bottom: 2px;" alt="AED" />)</label><input type="number" placeholder="18750" /></div>
       <div class="form-group"><label>First Due Date</label><input type="date" /></div>
     </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Direct debit mandate created','success');closeModal()">Create Mandate</button>`
  );
}

/* ════════════════════════════════════════════════════
   MAILBOX
   ════════════════════════════════════════════════════ */
function renderMailbox() {
  let activeTab = 'inbox';

  function renderList() {
    const messages = activeTab === 'inbox' ? DB.mailbox.inbox : DB.mailbox.sent;
    document.getElementById('mail-list').innerHTML = messages.map(m => `
      <div class="notif-item ${activeTab === 'inbox' && !m.read ? 'unread' : ''}"
           onclick="viewEmail('${activeTab}',${m.id})"
           style="cursor:pointer;padding:14px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
          <span class="font-semibold" style="font-size:12px">${activeTab === 'inbox' ? m.from : m.to}</span>
          <span style="font-size:10px;color:var(--text-muted)">${m.date}</span>
        </div>
        <div style="font-size:12px;color:var(--text-secondary)">${m.subject}</div>
      </div>`).join('') ||
      `<div class="empty-state"><div class="empty-state-icon"><span class="material-symbols-outlined" style="font-size:32px;">mail</span></div><h4>No Messages</h4></div>`;
  }

  setContent(`
    <div class="page-header">
      <div><div class="page-title">Mail Box</div></div>
      <button class="btn btn-primary" onclick="openCompose()"><span class="material-symbols-outlined" style="font-size:16px; margin-right:4px; vertical-align:middle;">edit</span> Compose</button>
    </div>
    <div class="grid-1-2">
      <div class="card p-0" style="padding:0">
        <div class="tabs" style="padding:0 14px">
          <button class="tab-btn active" id="tab-inbox"
            onclick="switchMailTab('inbox')"><span class="material-symbols-outlined" style="font-size:16px;">inbox</span> Inbox (${DB.mailbox.inbox.filter(m => !m.read).length})</button>
          <button class="tab-btn" id="tab-sent"
            onclick="switchMailTab('sent')"><span class="material-symbols-outlined" style="font-size:16px;">send</span> Sent</button>
        </div>
        <div id="mail-list"></div>
      </div>
      <div id="mail-preview" class="card">
        <div class="empty-state">
          <div class="empty-state-icon material-symbols-outlined" style="font-size:36px">drafts</div>
          <h4>Select a message</h4>
          <p>Click any message to preview it here.</p>
        </div>
      </div>
    </div>`);

  window.switchMailTab = tab => {
    activeTab = tab;
    document.getElementById('tab-inbox').classList.toggle('active', tab === 'inbox');
    document.getElementById('tab-sent').classList.toggle('active', tab === 'sent');
    renderList();
  };

  window.viewEmail = (tab, id) => {
    const msgs = tab === 'inbox' ? DB.mailbox.inbox : DB.mailbox.sent;
    const m = msgs.find(x => x.id === id);
    if (!m) return;
    m.read = true;
    document.getElementById('mail-preview').innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${m.subject}</div>
          <div class="card-subtitle">${tab === 'inbox' ? 'From: ' + m.from : 'To: ' + m.to} · ${m.date}</div>
        </div>
      </div>
      <div class="mail-body">${m.body}</div>
      ${tab === 'inbox' ? `<div style="padding:0 16px 16px"><button class="btn btn-outline-primary btn-sm" onclick="openCompose()"><span class="material-symbols-outlined" style="font-size:14px; margin-right:4px; vertical-align:middle;">reply</span> Reply</button></div>` : ''}`;
    renderList();
  };

  renderList();
}

function openCompose() {
  openModal('Compose Email',
    `<div class="form-group"><label>To</label><input type="email" placeholder="recipient@email.com" /></div>
     <div class="form-group"><label>Subject</label><input type="text" placeholder="Subject…" /></div>
     <div class="form-group"><label>Message</label><textarea style="min-height:140px" placeholder="Type your message…"></textarea></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Email sent successfully','success');closeModal()">Send Email</button>`
  );
}

/* ════════════════════════════════════════════════════
   REPORTS
   ════════════════════════════════════════════════════ */
function renderReports() {
  const stats = DB.getDashStats();
  setContent(`
    <div class="page-header"><div class="page-title">Reports</div></div>
    <div class="grid-3" style="margin-bottom:24px">
      ${[
        ['Contract Report',      'Full contract listing with statuses, values and expiry dates', 'description', 'purple'],
        ['Occupancy Report',     'Property and unit occupancy rates and trends',                 'apartment', 'cyan'],
        ['Collection Report',    'Cheque and payment collection status summary',                 'credit_card', 'emerald'],
        ['Financial Summary',    'Revenue, outstanding, and estimated collection',               'account_balance', 'amber'],
        ['Maintenance Report',   'Open, in-progress, and closed maintenance requests',           'build', 'rose'],
        ['Tenant Report',        'Tenant profiles, verification status, and contract details',   'groups', 'blue']
      ].map(([title, desc, icon, color]) => `
        <div class="card" style="cursor:pointer;--kpi-color:var(--${color})" onclick="generateReport('${title}')">
          <div class="material-symbols-outlined" style="font-size:30px;margin-bottom:12px">${icon}</div>
          <div class="card-title">${title}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;line-height:1.5">${desc}</div>
          <button class="btn btn-outline-primary btn-sm" style="margin-top:14px;color:var(--${color});border-color:rgba(0,0,0,0)">Generate →</button>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Quick Financial Summary</div>
        <button class="btn btn-sm btn-outline-primary" onclick="toast('Report exported to Excel','success')">Export Excel</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
        ${[
          ['Total Portfolio Value', DB.fmtAED(stats.TConValue), 'var(--purple)'],
          ['Occupancy Rate',        stats.occupancyPct + '%',    'var(--cyan)'],
          ['Active Contracts',      stats.TNewContract,          'var(--emerald)'],
          ['Open Maintenance',      DB.maintenance.filter(m => m.status !== 'Completed').length, 'var(--amber)']
        ].map(([l, v, c]) => `
          <div style="text-align:center;padding:18px 12px;background:var(--bg-glass);border:1px solid var(--glass-border);border-radius:var(--r-md)">
            <div style="font-size:22px;font-weight:900;color:${c};text-shadow:0 0 16px ${c}55">${v}</div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-top:6px">${l}</div>
          </div>`).join('')}
      </div>
    </div>`);
}

function generateReport(title) {
  toast(`Generating ${title}…`, 'info');
  setTimeout(() => toast(`${title} ready for download`, 'success'), 1200);
}

/* ════════════════════════════════════════════════════
   WORKBOARD
   ════════════════════════════════════════════════════ */
function renderWorkboard() {
  const wb = DB.workboard;
  const cols = [
    { key:'todo',       label:'To Do',       color:'var(--amber)' },
    { key:'inProgress', label:'In Progress', color:'var(--cyan)' },
    { key:'done',       label:'Done',        color:'var(--emerald)' }
  ];
  const pClass = { Normal:'priority-normal', Medium:'priority-medium', High:'priority-high', Emergency:'priority-emergency' };

  setContent(`
    <div class="page-header">
      <div><div class="page-title">Workboard</div></div>
      <button class="btn btn-primary" onclick="addTask()">+ Add Task</button>
    </div>
    <div class="kanban-board">
      ${cols.map(col => `
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span class="kanban-col-title" style="color:${col.color}">${col.label}</span>
            <span class="kanban-col-count">${wb[col.key].length}</span>
          </div>
          ${wb[col.key].map(task => `
            <div class="kanban-card">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span class="badge ${pClass[task.priority]}">${task.priority}</span>
                <span class="badge badge-secondary" style="font-size:10px">${task.tag}</span>
              </div>
              <div class="kanban-card-title">${task.title}</div>
              <div class="kanban-card-meta" style="margin-top:6px">${task.desc}</div>
              <div class="kanban-card-meta" style="margin-top:8px;color:var(--text-muted)"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;margin-right:4px;">calendar_today</span> ${DB.fmtDate(task.due)}</div>
            </div>`).join('')}
          <button class="btn-text" style="width:100%;margin-top:6px;display:block;text-align:center" onclick="addTask()">+ Add Card</button>
        </div>`).join('')}
    </div>`);
}

function addTask() {
  openModal('Add Task',
    `<div class="form-group"><label>Title</label><input type="text" placeholder="Task title…" /></div>
     <div class="form-group"><label>Description</label><textarea placeholder="Details…" style="min-height:80px"></textarea></div>
     <div class="form-row">
       <div class="form-group"><label>Priority</label><select><option>Normal</option><option>Medium</option><option>High</option></select></div>
       <div class="form-group"><label>Tag</label><input type="text" placeholder="CRM, Maintenance…" /></div>
     </div>
     <div class="form-group"><label>Due Date</label><input type="date" /></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="toast('Task added to board','success');closeModal()">Add Task</button>`
  );
}

/* ════════════════════════════════════════════════════
   SETTINGS
   ════════════════════════════════════════════════════ */
function renderSettings() {
  let activeTab = 'users';

  function render() {
    const content = {
      users: `
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              ${DB.settings.users.map(u => `<tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="avatar" style="width:28px;height:28px;font-size:10px">${DB.initials(u.name)}</div>
                    <span class="font-semibold">${u.name}</span>
                  </div>
                </td>
                <td style="color:var(--text-secondary)">${u.email}</td>
                <td><span class="badge badge-primary">${u.role}</span></td>
                <td><span class="badge badge-success">${u.status}</span></td>
                <td style="color:var(--text-muted);font-size:11px">${u.lastLogin}</td>
                <td><button class="btn btn-sm btn-secondary" onclick="toast('Edit user','info')">Edit</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`,

      roles: `
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Role Name</th><th>Accessible Modules</th><th>Users</th><th>Actions</th></tr></thead>
            <tbody>
              ${DB.settings.roles.map(r => `<tr>
                <td class="font-semibold">${r.name}</td>
                <td style="color:var(--text-secondary);font-size:12px">${r.modules}</td>
                <td><span class="badge badge-secondary">${r.users} users</span></td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="toast('Edit role permissions','info')">Edit Permissions</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`,

      profile: `
        <div style="max-width:500px">
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border)">
            <div class="avatar" style="width:64px;height:64px;font-size:20px">${DB.initials(DB.user.name)}</div>
            <div>
              <div class="font-bold" style="font-size:17px">${DB.user.name}</div>
              <div style="color:var(--text-secondary);font-size:12px">${DB.user.role}</div>
              <span class="badge badge-primary" style="margin-top:6px">${DB.user.subscription} Plan</span>
            </div>
          </div>
          <div class="form-group"><label>Full Name</label><input type="text" value="${DB.user.name}" /></div>
          <div class="form-group"><label>Email</label><input type="email" value="${DB.user.email}" /></div>
          <div class="form-group"><label>Company</label><input type="text" value="${DB.user.company}" /></div>
          <button class="btn btn-primary" onclick="toast('Profile updated','success')">Save Changes</button>
        </div>`,

      password: `
        <div style="max-width:420px">
          <div class="form-group"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>Confirm New Password</label><input type="password" placeholder="••••••••" /></div>
          <button class="btn btn-primary" onclick="toast('Password changed successfully','success')">Change Password</button>
        </div>`,

      app: `
        <div style="max-width:480px">
          <div class="section-title">Appearance</div>
          <div class="stat-row">
            <span class="stat-label">Interface Theme</span>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm ${document.documentElement.dataset.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" onclick="setTheme('light')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;margin-right:4px;">light_mode</span> Light</button>
              <button class="btn btn-sm ${document.documentElement.dataset.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" onclick="setTheme('dark')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;margin-right:4px;">dark_mode</span> Dark</button>
            </div>
          </div>
          <div class="section-title">Notifications</div>
          <div class="stat-row"><span class="stat-label">Email Notifications</span><span class="badge badge-success">Enabled</span></div>
          <div class="stat-row"><span class="stat-label">Push Notifications (FCM)</span><span class="badge badge-success">Enabled</span></div>
          <div class="section-title">Company</div>
          <div class="form-group"><label>Company Name</label><input type="text" value="${DB.user.company}" /></div>
          <button class="btn btn-primary mt-2" onclick="toast('Settings saved','success')">Save Settings</button>
        </div>`
    };
    document.getElementById('settings-content').innerHTML = content[activeTab] || '';
  }

  setContent(`
    <div class="page-header"><div class="page-title">Settings</div></div>
    <div class="tabs">
      ${[
        ['users', 'group', 'Users'],
        ['roles', 'admin_panel_settings', 'Roles'],
        ['profile', 'person', 'Profile'],
        ['password', 'lock', 'Password'],
        ['app', 'settings', 'App']
      ].map(([k, icon, label]) =>
        `<button class="tab-btn ${k === activeTab ? 'active' : ''}" id="stab-${k}" onclick="switchSettingsTab('${k}')">
          <span class="material-symbols-outlined" style="font-size:16px;">${icon}</span> ${label}
        </button>`
      ).join('')}
    </div>
    <div id="settings-content"></div>`);

  window.switchSettingsTab = tab => {
    activeTab = tab;
    document.querySelectorAll('.tab-btn[id^="stab-"]').forEach(b =>
      b.classList.toggle('active', b.id === `stab-${tab}`)
    );
    render();
  };

  window.setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pa_theme', theme);
    if (currentRoute === 'settings') renderSettings();
    if (currentRoute === 'dashboard') renderDashboard();
  };

  render();
}

/* ════════════════════════════════════════════════════
   BOOT
   ════════════════════════════════════════════════════ */
(function init() {
  const savedTheme = localStorage.getItem('pa_theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  Auth.check();
})();
