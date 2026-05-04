/* ═══════════════════════════════════════════════════════════
   plans.js — Subscription plan gating
   Must be loaded AFTER data.js and app.js
   ═══════════════════════════════════════════════════════════ */

const PLAN_CONFIG = {
  free: {
    label: 'Free Plan',
    unitLimit: 100,
    tier: 0,
    upgradeFile: 'lite.html',
    upgradeLabel: 'Lite Plan',
    icon: 'star_outline',
  },
  lite: {
    label: 'Lite Plan',
    unitLimit: 1000,
    tier: 1,
    upgradeFile: 'pro.html',
    upgradeLabel: 'Pro Plan',
    icon: 'star_half',
  },
  pro: {
    label: 'Pro Plan',
    unitLimit: 10000,
    tier: 2,
    upgradeFile: 'enterprise.html',
    upgradeLabel: 'Enterprise',
    icon: 'star',
  },
  enterprise: {
    label: 'Enterprise',
    unitLimit: null,
    tier: 3,
    upgradeFile: null,
    upgradeLabel: null,
    icon: 'workspace_premium',
  },
};

/* Minimum plan tier required for each route */
const FEATURE_TIERS = {
  /* Free — all plans */
  'dashboard':       0,
  'projects':        0,
  'properties':      0,
  'units':           0,
  'lessor':          0,
  'tenants':         0,
  'settings':        0,
  /* Lite (tier 1) */
  'leads':           1,
  'leasing-request': 1,
  'booking':         1,
  'collection':      1,
  'agents':          1,
  'property-admin':  1,
  'facilitators':    1,
  'contracts':       1,
  'maintenance':     1,
  'mailbox':         1,
  /* Pro (tier 2) */
  'renewals':        2,
  'approvals':       2,
  'bank-deposit':    2,
  'move-in':         2,
  'move-out':        2,
  'reports':         2,
  /* Enterprise (tier 3) */
  'direct-debit':    3,
  'legal':           3,
  'workboard':       3,
};

const FEATURE_META = {
  'direct-debit':    { label: 'Direct Debit',          desc: 'Automate rent collection with direct debit mandates from tenants.' },
  'leads':           { label: 'Leads',                  desc: 'Capture and manage leads from prospective tenants and buyers.' },
  'leasing-request': { label: 'Leasing Requests',       desc: 'Handle leasing requests and inquiries from prospects.' },
  'booking':         { label: 'Bookings',                desc: 'Manage unit bookings and reservations before signing.' },
  'collection':      { label: 'Collection',              desc: 'Track and record rent payments and collections.' },
  'bank-deposit':    { label: 'Bank Deposit',            desc: 'Record and reconcile bank deposit transactions.' },
  'agents':          { label: 'Agents',                  desc: 'Manage your real estate agent profiles and assignments.' },
  'property-admin':  { label: 'Property Admin',          desc: 'Assign and manage property administrators per building.' },
  'facilitators':    { label: 'Facilitators',            desc: 'Manage property facilitators and service providers.' },
  'contracts':       { label: 'Contracts',               desc: 'Create, manage, and track tenancy contracts.' },
  'renewals':        { label: 'Renewals',                desc: 'Manage contract renewals and track expiring leases.' },
  'approvals':       { label: 'Approvals',               desc: 'Set up multi-level approval workflows for key actions.' },
  'legal':           { label: 'Legal',                   desc: 'Manage legal proceedings and case tracking.' },
  'maintenance':     { label: 'Maintenance',             desc: 'Submit and track maintenance requests and jobs.' },
  'move-in':         { label: 'Move-In Inspection',      desc: 'Conduct and document move-in property inspections.' },
  'move-out':        { label: 'Move-Out Inspection',     desc: 'Conduct and document move-out property inspections.' },
  'mailbox':         { label: 'Mail Box',                desc: 'Send and receive communications with tenants and agents.' },
  'reports':         { label: 'Reports & Analytics',     desc: 'Access detailed reports and analytics on your portfolio.' },
  'workboard':       { label: 'Workboard',               desc: 'Manage tasks and workflows with a visual kanban board.' },
};

const TIER_KEYS = ['free', 'lite', 'pro', 'enterprise'];

(function initPlan() {
  const planKey = window.CURRENT_PLAN || 'enterprise';
  const plan    = PLAN_CONFIG[planKey];

  function isLocked(route) {
    return plan.tier < (FEATURE_TIERS[route] ?? 0);
  }

  function minPlanForRoute(route) {
    return PLAN_CONFIG[TIER_KEYS[FEATURE_TIERS[route] ?? 0]];
  }

  /* ── Plan badge in sidebar ────────────────────────────── */
  function injectPlanBadge() {
    const anchor = document.querySelector('.sidebar-company');
    if (!anchor) return;

    const tenantCount = (window.DB && DB.tenants) ? DB.tenants.length : 0;
    const unitsUsed   = (window.DB && DB.units)   ? DB.units.length   : 0;
    const unitLimit   = plan.unitLimit != null ? plan.unitLimit.toLocaleString() : '∞';

    const badge = document.createElement('div');
    badge.className = 'plan-badge';
    badge.innerHTML = `
      <div class="plan-badge-header">
        <span class="material-symbols-outlined plan-badge-icon">${plan.icon}</span>
        <span class="plan-badge-name">${plan.label}</span>
        ${plan.upgradeFile
          ? `<a href="${plan.upgradeFile}" class="plan-upgrade-chip">Upgrade</a>`
          : `<span class="plan-badge-tag">Active</span>`}
      </div>
      <div class="plan-badge-stats">
        <div class="plan-stat">
          <span class="material-symbols-outlined">apartment</span>
          <span class="plan-stat-value">${unitsUsed}&thinsp;/&thinsp;${unitLimit}</span>
          <span class="plan-stat-label">Units</span>
        </div>
        <div class="plan-stat-divider"></div>
        <div class="plan-stat">
          <span class="material-symbols-outlined">people</span>
          <span class="plan-stat-value">${tenantCount}</span>
          <span class="plan-stat-label">Tenants</span>
        </div>
      </div>`;

    anchor.after(badge);
  }

  /* ── Lock nav items ───────────────────────────────────── */
  function applyPlanLocks() {
    document.querySelectorAll('[data-route]').forEach(el => {
      const route = el.getAttribute('data-route');
      if (!route || !isLocked(route)) return;

      el.classList.add('nav-locked');
      el.removeAttribute('onclick');
      el.onclick = e => { e.preventDefault(); showUpgradeModal(route); };

      const lockIcon = document.createElement('span');
      lockIcon.className = 'nav-lock material-symbols-outlined';
      lockIcon.textContent = 'lock';
      el.appendChild(lockIcon);
    });

    /* If every child of a nav-group is locked, style the header */
    document.querySelectorAll('.nav-group').forEach(group => {
      const items = group.querySelectorAll('[data-route]');
      if (items.length && [...items].every(i => i.classList.contains('nav-locked'))) {
        const header = group.querySelector('.nav-group-header');
        if (header) {
          header.classList.add('nav-group-all-locked');
          /* Override click — open group to show locked children */
          const origClick = header.getAttribute('onclick');
          header.removeAttribute('onclick');
          header.onclick = e => {
            const itemsEl = group.querySelector('.nav-group-items');
            if (itemsEl) {
              const open = itemsEl.classList.toggle('open');
              header.classList.toggle('open', open);
            }
          };
        }
      }
    });
  }

  /* ── Upgrade modal ────────────────────────────────────── */
  function showUpgradeModal(route) {
    const meta    = FEATURE_META[route] || { label: route, desc: 'This feature is not available on your current plan.' };
    const reqPlan = minPlanForRoute(route);

    /* Upgrade path: current → ... → required plan */
    const pathPills = TIER_KEYS.slice(plan.tier, PLAN_CONFIG[reqPlan.upgradeFile ? TIER_KEYS.indexOf(TIER_KEYS.find(k => PLAN_CONFIG[k] === reqPlan)) : 3]).map((k, i) => {
      const p = PLAN_CONFIG[k];
      const isTarget = p === reqPlan;
      return `${i > 0 ? '<span class="upg-sep">›</span>' : ''}<span class="upg-pill${isTarget ? ' upg-pill-hi' : ''}">${p.label}</span>`;
    }).join('');

    /* Simpler, cleaner path build */
    const startTier = plan.tier;
    const endTier   = reqPlan.tier;
    let pills = '';
    for (let t = startTier; t <= endTier; t++) {
      const p = PLAN_CONFIG[TIER_KEYS[t]];
      if (t > startTier) pills += '<span class="upg-sep">›</span>';
      pills += `<span class="upg-pill${t === endTier ? ' upg-pill-hi' : ''}">${p.label}</span>`;
    }

    /* Map tier to its file */
    const tierFile = { 0: 'free.html', 1: 'lite.html', 2: 'pro.html', 3: 'enterprise.html' };
    const targetFile = tierFile[reqPlan.tier] || 'enterprise.html';

    openModal('Upgrade Required', `
      <div class="upgrade-modal-body">
        <div class="upgrade-lock-wrap">
          <span class="material-symbols-outlined upgrade-lock-icon">lock</span>
        </div>
        <div class="upgrade-feature-title">${meta.label}</div>
        <p class="upgrade-feature-desc">${meta.desc}</p>
        <div class="upgrade-current-row">
          <span class="upgrade-current-label">Current plan</span>
          <span class="upgrade-current-badge">${plan.label}</span>
        </div>
        <div class="upgrade-path-row">${pills}</div>
        <p class="upgrade-avail-note">
          Available from <strong>${reqPlan.label}</strong> and above
        </p>
      </div>
    `, `
      <button class="btn btn-outline" onclick="closeModal()">Maybe Later</button>
      <a href="${targetFile}" class="btn btn-primary">Upgrade to ${reqPlan.label} →</a>
    `);
  }

  /* ── Guard window.navigate() ─────────────────────────── */
  function guardNavigate() {
    if (typeof window.navigate !== 'function') return;
    const orig = window.navigate;
    window.navigate = function(route) {
      if (isLocked(route)) { showUpgradeModal(route); return; }
      orig.call(this, route);
    };
  }

  /* ── Boot ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    guardNavigate();
    injectPlanBadge();
    applyPlanLocks();
  });
})();
