# PropertyApp — Property Management Platform

> A feature-rich, UAE-focused property management web application covering the full leasing lifecycle — from lead capture to contract renewal.

![PropertyApp](logo_dark.svg)

---

## Overview

**PropertyApp** is a vanilla JS single-page application (SPA) built for real estate companies operating in the UAE. It provides a complete dashboard for managing properties, units, tenants, contracts, collections, maintenance, and more — all within a clean, branded interface built to the PropertyApp design system.

The app ships in four subscription tiers, each unlocking additional features:

| Plan | Units | Key Additions |
|---|---|---|
| **Free** | Up to 100 | Core property & tenant management |
| **Lite** | Up to 1,000 | + CRM, Leasing Request, Booking |
| **Pro** | Up to 10,000 | + Legal, Inspections, Workboard |
| **Enterprise** | Unlimited | + Direct Debit, Bank Deposit, Reports |

---

## Features

- **Dashboard** — KPI cards, revenue charts, occupancy stats, recent activity
- **Property Management** — Projects, Properties, Units, Lessor
- **CRM** — Leads pipeline, Leasing Requests, Bookings
- **Accounts** — Collections, Bank Deposits, Direct Debit
- **People** — Tenants, Agents, Property Admins, Facilitators
- **Contracts & Renewals** — Full contract lifecycle management
- **Approvals & Legal** — Approval workflows, legal case tracking
- **Maintenance** — Work orders with priority levels
- **Inspections** — Move-in / Move-out checklists
- **Mail Box** — Internal messaging
- **Reports** — Analytics and exportable reports
- **Workboard** — Kanban task management
- **Dark Mode** — Full light/dark theme toggle
- **Plan Gating** — Locked routes with upgrade prompts per subscription tier
- **Responsive** — Mobile-first layout with slide-in sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Charts | [Chart.js 4.4](https://www.chartjs.org/) |
| Icons | [Google Material Symbols](https://fonts.google.com/icons) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Hosting | Static file server (Apache / Nginx) |

No build step, no framework, no dependencies to install — open in a browser and it works.

---

## Project Structure

```
PropertyApp/
├── index.html              # Plan selection landing page
├── free.html               # Free plan app shell
├── lite.html               # Lite plan app shell
├── pro.html                # Pro plan app shell
├── enterprise.html         # Enterprise plan app shell
│
├── css/
│   └── styles.css          # All styles — design tokens, components, dark mode
│
├── js/
│   ├── app.js              # SPA router, page renderers, UI logic
│   ├── data.js             # Mock data store & helper functions
│   └── plans.js            # Plan gating — locked routes & upgrade modals
│
├── logo_dark.svg           # Navy wordmark + red mark (for light backgrounds)
├── logo_white.svg          # White wordmark + red mark (for dark backgrounds)
├── dhiram-sign.svg         # UAE Dirham currency symbol
└── design.md               # Brand guidelines & design tokens reference
```

---

## Getting Started

No installation required. Just open any plan file in a browser:

```bash
# Clone the repo
git clone https://github.com/ShoaibAhmedSoomro/ReApp-Lite.git
cd ReApp-Lite

# Open the plan selector
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or serve it locally to avoid CORS issues with fonts/icons:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

### Default Login

| Field | Value |
|---|---|
| Email | `admin@asico.ae` |
| Password | `admin123` |

---

## Design System

PropertyApp follows a strict brand identity defined in [`design.md`](design.md):

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#191248` | Primary brand color — text, headers, active states |
| `--red` | `#e81a47` | Accent/action color — CTAs, badges, active nav |
| `--white` | `#fafaf8` | Smoke white — all surface backgrounds |

**Color proportions:** 65% Smoke White · 20% Crimson Red · 15% Navy

Dark mode is toggled via `data-theme="dark"` on the `<html>` element, controlled by the theme toggle in the top bar.

---

## Deployment

See [`DEPLOYMENT_AND_STACK.md`](DEPLOYMENT_AND_STACK.md) for a full guide covering Apache/Nginx configuration, `.htaccess` security rules, SSL setup, and recommended upgrade path to the SNAP stack (Supabase · Next.js · AWS · PostgreSQL).

---

## Credits

**Developed by** Shoaib Ahmed — Web Developer, ASICO  
**Concept by** Sheeraz Shaikh

---

*© PropertyApp / Asico Real Estate LLC. All rights reserved.*
