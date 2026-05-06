# The SNAP Stack — In-Depth Technical Report

**Prepared for:** PropertyApp — Property Management Platform  
**Prepared by:** Shoaib Ahmed, Web Developer — ASICO  
**Concept by:** Sheeraz Shaikh  
**Version:** 1.0  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Is the SNAP Stack](#2-what-is-the-snap-stack)
3. [S — Supabase](#3-s--supabase)
4. [N — Next.js](#4-n--nextjs)
5. [A — React Native + Expo](#5-a--react-native--expo)
6. [P — PostgreSQL](#6-p--postgresql)
7. [How the Four Layers Work Together](#7-how-the-four-layers-work-together)
8. [Security Architecture](#8-security-architecture)
9. [Performance & Scalability](#9-performance--scalability)
10. [Cost Analysis](#10-cost-analysis)
11. [SNAP vs. Alternative Stacks](#11-snap-vs-alternative-stacks)
12. [Migration Path from PropertyApp-Lite](#12-migration-path-from-propertyapp-lite)
13. [Developer Experience](#13-developer-experience)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Conclusion & Recommendation](#15-conclusion--recommendation)

---

## 1. Executive Summary

PropertyApp is a property management platform designed for real estate companies in the UAE and broader MENA region. To evolve from its current static prototype (PropertyApp-Lite) into a fully operational SaaS product — accessible on both web browsers and mobile phones — it requires a modern, scalable, and cost-effective technology foundation.

This report makes the case for the **SNAP Stack**: a carefully selected combination of four technologies that collectively cover every layer of a modern application — from the database that stores data, to the web interface, to the mobile app on tenants' and agents' phones.

**Key findings:**

- The SNAP stack can launch an MVP with **zero infrastructure cost**
- A single small team (2–4 developers) can build and maintain the entire platform
- The stack scales from 10 users to 100,000 users without architectural changes
- All four technologies are open-source at their core, avoiding vendor lock-in
- The combination is uniquely well-suited to property management's data structure, real-time requirements, and multi-user role system

---

## 2. What Is the SNAP Stack

SNAP is an acronym for four technologies that work together as a complete application platform:

```
S — Supabase       (Backend-as-a-Service: database, auth, storage, realtime)
N — Next.js        (Web application framework)
A — React Native   (Cross-platform mobile app framework)
P — PostgreSQL     (Relational database engine, hosted inside Supabase)
```

Each piece has a specific job:

| Layer | Technology | Analogy |
|-------|-----------|---------|
| **Data Store** | PostgreSQL | The filing cabinet — where everything is saved |
| **Back Office** | Supabase | The office manager — handles all the behind-the-scenes work |
| **Website** | Next.js | The front desk — what users see in their browser |
| **Mobile App** | React Native | The field team app — what agents and tenants use on their phones |

### Why These Four Specifically

Most tech stacks require you to pick from dozens of options at each layer, leading to analysis paralysis and compatibility issues. The SNAP stack is deliberately opinionated:

- All four technologies use **JavaScript / TypeScript** — one language for everything
- Supabase is built **on top of** PostgreSQL — they are not separate systems, they are one
- Next.js and React Native are both **React-based** — developers who know one can quickly work on the other
- Supabase's client SDK works **identically** in Next.js and React Native — the same API calls, same code patterns

This means a developer hired for the web app can also contribute to the mobile app and vice versa. There is no "backend developer vs. frontend developer" divide.

---

## 3. S — Supabase

### 3.1 What Is Supabase

Supabase is an **open-source Firebase alternative** — but "Firebase alternative" undersells it. Supabase is a complete backend platform built on top of the world's most advanced open-source database (PostgreSQL). It was founded in 2020, is backed by Y Combinator, and raised $80M in funding. As of 2024, it powers over 1 million databases.

Think of Supabase as hiring five different specialists — a database administrator, a security engineer, a file manager, a real-time messaging expert, and an authentication specialist — but paying for none of them individually. Supabase handles all five jobs automatically.

### 3.2 The Five Pillars of Supabase

---

#### Pillar 1: Database (PostgreSQL)

Every Supabase project gets a dedicated, full PostgreSQL database. This is not a simplified or cut-down version — it is the full, real PostgreSQL engine with every feature available.

**What this means for PropertyApp:**

```
Properties Table
├── id (unique identifier)
├── name ("Marina Tower A")
├── location ("Dubai Marina")
├── project_id (links to Projects table)
└── created_at (timestamp)

Units Table
├── id
├── unit_number ("A-1204")
├── floor (12)
├── bedrooms (2)
├── annual_rent (110000)
├── status ("occupied" | "vacant" | "booked")
└── property_id (links to Properties table)

Tenants Table
├── id
├── full_name
├── email
├── phone
├── emirates_id
└── passport_number

Contracts Table
├── id
├── tenant_id (links to Tenants)
├── unit_id (links to Units)
├── start_date
├── end_date
├── annual_value
├── status ("active" | "expired" | "under_renewal")
└── payment_schedule (JSON)

Payments Table
├── id
├── contract_id (links to Contracts)
├── amount
├── due_date
├── paid_date
├── status ("paid" | "pending" | "overdue")
└── cheque_number
```

All of these tables are **related** to each other. When you query a contract, you can automatically get the tenant's name, the unit number, and the property name in a single query — because PostgreSQL understands relationships.

**Key database capabilities relevant to PropertyApp:**

- **Joins:** Fetch a tenant's name, their unit, their property, and outstanding payments — all in one query
- **Full-text search:** Search tenants by name, Emirates ID, or phone number instantly
- **JSONB columns:** Store flexible data like payment schedules, inspection notes, or custom fields
- **Views:** Create virtual "tables" that combine data from multiple tables — useful for the dashboard's KPI cards
- **Triggers:** Automatically run actions when data changes — for example, when a contract expires, automatically update the unit status to "vacant"

---

#### Pillar 2: Authentication

Supabase Auth handles everything related to **who can log in and what they are allowed to do**.

**Supported login methods:**
- Email + password (primary for PropertyApp)
- Magic link (click a link in email to log in — no password needed)
- Google / Microsoft / Apple login (one-click social login)
- Phone number + SMS OTP

**User roles for PropertyApp:**

```
Super Admin
├── Full access to everything
├── Can create/delete users
└── Can see all properties across all companies

Property Admin
├── Access to their assigned properties only
├── Can manage units, tenants, contracts
└── Cannot access other properties

Agent
├── Access to their assigned leads and bookings
├── Can create leasing requests
└── Cannot see financial data

Tenant (future mobile app)
├── Can see their own contract only
├── Can submit maintenance requests
├── Can see their payment history
└── Cannot see other tenants

Facilitator
├── Access to maintenance requests assigned to them
└── Cannot access financial or contract data
```

Each role is enforced at the **database level**, not just in the app code. Even if a developer accidentally forgets to add a permission check in the app, the database will still reject the request.

---

#### Pillar 3: Row-Level Security (RLS)

This is the most important security feature for a multi-tenant SaaS like PropertyApp, and it is unique to PostgreSQL/Supabase.

**What it means in simple terms:**

Imagine the database as a shared office with filing cabinets. Row-Level Security is like having a magic filing cabinet that automatically shows each person only the folders they are allowed to see — even if two people open the same drawer at the same time.

**Example RLS policy for PropertyApp:**

```sql
-- Agents can only see contracts for properties they manage
CREATE POLICY "agents_see_own_contracts"
ON contracts
FOR SELECT
USING (
  property_id IN (
    SELECT property_id
    FROM agent_assignments
    WHERE agent_id = auth.uid()
  )
);
```

This single rule means: no matter what the application code does, an agent can never accidentally (or intentionally) retrieve another agent's contracts. The protection is at the deepest possible level.

---

#### Pillar 4: Real-Time Subscriptions

Supabase can **broadcast database changes to all connected clients instantly**.

**How this works:** The database uses a built-in feature called replication to publish a stream of all changes. Supabase captures this stream and forwards it to connected browsers and mobile apps via WebSockets.

**Real-time use cases in PropertyApp:**

| Event | Real-Time Effect |
|-------|-----------------|
| Agent marks payment as received | Dashboard's "Unrealised Collection" number updates live for all admins |
| New maintenance request submitted | Facility manager's screen shows the new request without refreshing |
| Contract status changes to "Expiring" | Renewal officer's list updates immediately |
| Tenant submits inspection note | Admin sees it appear in real-time during the walk-through |
| Lead assigned to agent | Agent's phone gets a push notification AND their lead list updates |

Without real-time, everyone has to keep pressing refresh to see updates. Real-time makes the app feel alive.

---

#### Pillar 5: Storage

Supabase Storage is a file hosting service that integrates directly with the database and its permission system.

**Files PropertyApp will need to store:**

```
/contracts/
  ├── contract-2024-001.pdf
  └── contract-2024-002.pdf

/inspections/
  ├── move-in-unit-A1204-2024-03-01/
  │   ├── living-room-before.jpg
  │   ├── kitchen-before.jpg
  │   └── inspection-report.pdf
  └── move-out-unit-A1204-2024-12-31/
      └── ...

/tenants/
  ├── ahmed-ali/
  │   ├── emirates-id-front.jpg
  │   ├── emirates-id-back.jpg
  │   └── passport.jpg
  └── ...

/cheques/
  └── cheque-images/
```

**Key advantage:** Storage buckets inherit the same permission system as the database. A tenant can upload their own passport scan but cannot view another tenant's documents. An agent can access contracts for their properties but not for other agents' properties. No extra configuration needed.

### 3.3 Supabase Pricing

| Plan | Price | Database | API Calls | Storage | Best For |
|------|-------|----------|-----------|---------|----------|
| **Free** | $0/month | 500MB | Unlimited | 1GB | Development, MVP testing |
| **Pro** | $25/month | 8GB | Unlimited | 100GB | Production (small-medium) |
| **Team** | $599/month | Custom | Unlimited | Custom | Enterprise / Large scale |
| **Enterprise** | Custom | Custom | Unlimited | Custom | 100k+ users |

> **For PropertyApp:** Free tier for development and initial launch. Pro tier ($25/month) when the first paying clients onboard.

### 3.4 Supabase: Strengths and Limitations

**Strengths:**
- Zero backend code needed for 80% of use cases — the database rules handle everything
- Open source — you can self-host if you ever want to move away from Supabase's hosted service
- Built-in dashboard to browse and edit data directly — useful for support and debugging
- Automatic database backups on Pro plan
- 99.9% uptime SLA on Pro plan

**Limitations:**
- The free tier pauses projects after 1 week of inactivity (not a problem in production, only in development)
- Edge Functions (serverless code) have cold start times of ~150ms — fine for most operations
- Complex analytical queries (millions of rows) may need additional optimisation

---

## 4. N — Next.js

### 4.1 What Is Next.js

Next.js is a **React-based web framework** created by Vercel in 2016. React itself is a library created by Facebook (Meta) for building user interfaces. Next.js takes React and adds everything it needs to become a full web application framework: routing, server-side rendering, API routes, optimised images, fonts, and more.

As of 2024, Next.js is used by:
- **Airbnb** — their property listing platform
- **TikTok** — their web application
- **Notion** — their productivity platform
- **Twitch** — their streaming platform
- **Nike** — their e-commerce website
- **OpenAI** — chatgpt.com itself

### 4.2 How Next.js Renders Pages

This is the most important technical concept in Next.js, and it directly affects how fast PropertyApp will feel to users.

Traditional websites work like this:
```
User visits page → Browser asks server → Server processes → Server sends HTML → Browser shows page
(everything happens on the server, every time, for every user)
```

Old React apps work like this:
```
User visits page → Browser gets empty HTML → Browser downloads JavaScript → 
JavaScript runs → Page appears
(everything happens in the browser — slow first load, not good for SEO)
```

Next.js gives you **three options** — you can choose the right one for each page:

---

**Option 1: Static Site Generation (SSG)**

The page is built once when you deploy the app. Every user gets the same pre-built page instantly.

```
Build time: page is rendered to HTML once
User visits: gets pre-built HTML instantly (milliseconds)
```

**Best for in PropertyApp:** Login page, landing page, plan selection page, marketing pages

---

**Option 2: Server-Side Rendering (SSR)**

The page is built fresh on the server every time a user requests it.

```
User visits page → Server fetches fresh data → Server builds HTML → Sends to user
```

**Best for in PropertyApp:** Dashboard (needs latest KPI data), reports (always current)

---

**Option 3: Client-Side Rendering (CSR)**

The page loads instantly with a skeleton, then JavaScript fetches data in the background.

```
User visits: gets page structure instantly → Data loads in background → Page fills in
```

**Best for in PropertyApp:** Real-time sections like the workboard, live notifications, chat

---

**In practice, a single Next.js app can use all three** — the login page is static, the dashboard is server-rendered, and the kanban board is client-side. This is what makes Next.js uniquely powerful.

### 4.3 App Router vs. Pages Router

Next.js 13+ introduced the **App Router** — a new way to organise pages and layouts. This is the modern approach and should be used for new projects.

**File structure for PropertyApp web app:**

```
app/
├── page.tsx                    → Landing page (/)
├── login/
│   └── page.tsx                → Login page (/login)
├── dashboard/
│   ├── layout.tsx              → Shared sidebar + topbar
│   ├── page.tsx                → Dashboard (/dashboard)
│   ├── properties/
│   │   ├── page.tsx            → Properties list
│   │   └── [id]/page.tsx       → Single property (/properties/123)
│   ├── tenants/
│   │   └── page.tsx
│   ├── contracts/
│   │   └── page.tsx
│   └── ...
├── api/
│   ├── webhooks/
│   │   └── route.ts            → Webhook endpoints (payment gateways, etc.)
│   └── reports/
│       └── route.ts            → Report generation endpoint
└── globals.css
```

**The layout system** is particularly powerful: you define the sidebar and topbar once in `layout.tsx`, and every nested page automatically inherits it. If you want to change the sidebar, you change it in one file and it updates everywhere.

### 4.4 Server Components vs. Client Components

Next.js 13+ introduced a distinction that significantly improves performance:

**Server Components** run on the server, never in the browser:
- Fetch data directly from Supabase without exposing API keys
- Send only the final HTML to the browser — smaller downloads
- Cannot have interactive elements (no onClick, no state)
- **Default** in Next.js App Router

**Client Components** run in the browser:
- Handle user interactions (button clicks, form inputs, modals)
- Can use real-time subscriptions
- Must be explicitly marked with `'use client'` at the top of the file

**For PropertyApp, the pattern looks like:**

```
DashboardPage (Server Component)
├── Fetches KPI data from Supabase on the server
├── Renders KPI cards, tables, chart data
└── ContractTable (Client Component)
    ├── Subscribes to real-time contract updates
    ├── Handles "View Details" button clicks
    └── Opens modal on click
```

This means the initial dashboard loads with real data already embedded in the HTML — no waiting for JavaScript to fetch data after the page loads.

### 4.5 Next.js Built-in Optimisations

These come for free with Next.js — no configuration needed:

| Feature | What It Does | Benefit for PropertyApp |
|---------|-------------|------------------|
| **Image Optimisation** | Automatically resizes, compresses, and serves images in WebP format | Property photos load 40–60% faster |
| **Font Optimisation** | Downloads fonts at build time, eliminates layout shift | Text doesn't "jump" when fonts load |
| **Code Splitting** | Only loads the JavaScript needed for the current page | Dashboard doesn't load mobile code |
| **Prefetching** | Preloads pages you're likely to navigate to next | Clicking nav links feels instant |
| **Static Assets CDN** | Serves CSS, JS, images from a global CDN | Fast load times worldwide |

### 4.6 Next.js + Supabase Integration

The Supabase team maintains official Next.js helpers that handle the most complex part of the integration: **authentication across server and client components**.

```typescript
// Server Component — data fetched securely on the server
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function PropertiesPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      *,
      units (count),
      contracts (count)
    `)
  
  return <PropertiesTable data={properties} />
}
```

No API endpoint needed. The page fetches directly from the database, respecting all Row-Level Security policies. The user's session is automatically passed through.

### 4.7 Next.js: Strengths and Limitations

**Strengths:**
- The most popular React framework — massive community, abundant tutorials and documentation
- Vercel (the company behind Next.js) provides free hosting with zero configuration
- TypeScript support out of the box — catches coding errors before they reach users
- Built-in API routes — can handle webhooks and integrations without a separate backend server
- The App Router enables extremely performant apps with minimal developer effort

**Limitations:**
- The App Router (introduced in Next.js 13) has a learning curve, especially the Server/Client component distinction
- Build times can be slow for large applications (mitigated by incremental builds)
- Hosting on platforms other than Vercel requires additional configuration

---

## 5. A — React Native + Expo

### 5.1 What Is React Native

React Native is a framework created by **Facebook (Meta) in 2015** for building mobile applications using JavaScript. The key insight behind React Native is this:

> Instead of writing two separate apps (one in Swift/Objective-C for iPhone, one in Kotlin/Java for Android), write one app in JavaScript and let React Native translate it into real native components for both platforms.

"Real native components" is the critical phrase. React Native does **not** wrap a website in a browser window (like a hybrid app). It compiles to actual native iOS and Android UI components. A button in React Native becomes a real iOS `UIButton` or an Android `Button` — not a web `<button>` element pretending to be a native button.

This means:
- The app **looks and feels** like a native app because it uses native components
- The app **performs** like a native app — smooth 60fps scrolling and animations
- Users cannot tell the difference between a React Native app and a "real" native app

**Apps built with React Native:**
- **Facebook** — the main Facebook mobile app
- **Instagram** — the entire Instagram app
- **Shopify** — their merchant app
- **Discord** — their mobile app
- **Walmart** — their shopping app
- **Bloomberg** — their finance app

### 5.2 What Is Expo

Expo is a **platform and toolchain built on top of React Native** that removes 80% of the complexity of building mobile apps.

Building a bare React Native app requires:
- Xcode (Apple's development environment) — for iOS builds
- Android Studio (Google's development environment) — for Android builds
- Native code configuration in multiple files
- A Mac computer to build iOS apps
- Managing certificates, provisioning profiles, and signing keys

Expo eliminates all of this:
- Builds happen **in the cloud** — no need for Xcode or Android Studio locally
- **Expo Go** app lets testers run your development app on their phone by scanning a QR code
- **EAS Build** (Expo Application Services) handles all the complex iOS/Android build pipeline
- **EAS Submit** automatically submits your app to the App Store and Google Play
- Works on Windows, Mac, and Linux

### 5.3 Code Sharing Between Web and Mobile

This is the biggest cost-saving advantage of the SNAP stack.

When you build a web app in Next.js and a mobile app in React Native, they are both React applications. The UI components look different (web uses HTML, mobile uses native components), but the **business logic is identical**.

```
What gets shared (60–70% of code):
├── Supabase API calls (fetching properties, tenants, contracts)
├── Authentication logic (login, logout, session management)
├── Data validation (checking if a form is filled correctly)
├── Business rules (calculating occupancy rate, collection percentage)
├── Date formatting, currency formatting utilities
├── State management (Redux/Zustand store)
└── TypeScript types (the shape of Property, Tenant, Contract objects)

What stays separate (30–40% of code):
├── UI components (web: <div>, <table>; mobile: <View>, <FlatList>)
├── Navigation (web: URL routing; mobile: stack/tab navigation)
├── Platform-specific features (mobile: camera, push notifications, biometrics)
└── Responsive layout logic
```

In practice, a team of 3 developers can maintain both the web and mobile app simultaneously — the web developer and the mobile developer share the same business logic repository, and each adapts the UI for their platform.

### 5.4 React Native Architecture for PropertyApp

**Screen map:**

```
Mobile App (React Native + Expo)
│
├── Auth Stack
│   ├── Login Screen
│   └── Forgot Password Screen
│
├── Admin Tab Navigator
│   ├── Dashboard Tab
│   │   └── KPIs, Charts (simplified for mobile)
│   ├── Properties Tab
│   │   ├── Properties List
│   │   ├── Property Detail
│   │   └── Units List
│   ├── Tenants Tab
│   │   ├── Tenants List
│   │   └── Tenant Detail
│   └── More Tab
│       ├── Contracts
│       ├── Maintenance
│       └── Settings
│
├── Agent Stack
│   ├── My Leads
│   ├── My Bookings
│   └── My Contracts
│
├── Tenant Stack (future phase)
│   ├── My Contract
│   ├── My Payments
│   ├── Submit Maintenance Request
│   └── My Documents
│
└── Inspector Stack
    ├── Assigned Inspections
    ├── Move-In Inspection Form
    │   ├── Photo capture (camera integration)
    │   ├── Room-by-room checklist
    │   └── Digital signature
    └── Move-Out Inspection Form
```

### 5.5 Mobile-Specific Features

These features are only possible on mobile and add significant value to PropertyApp:

**Camera Integration:**
```
Inspector opens Move-In Inspection
├── Takes photos of each room
├── Photos are uploaded directly to Supabase Storage
├── Linked to the inspection record in the database
└── Admin can view photos from the web app instantly
```

**Push Notifications via Expo:**
```
Trigger events → Push notification to relevant user's phone

Contract expiring in 30 days → Notification to agent and admin
Payment due tomorrow → Notification to tenant (future phase)
Maintenance request assigned → Notification to facilitator
New lead assigned → Notification to agent
Inspection scheduled → Notification to inspector
```

**Biometric Authentication:**
Agents can log in with Face ID or fingerprint instead of typing a password — significantly faster and more secure.

**Offline Mode (Progressive Enhancement):**
Inspectors often work in buildings with poor signal. Key data (assigned inspections, tenant info, unit details) can be cached locally and synced when connectivity is restored.

### 5.6 Expo EAS — Build and Deploy Pipeline

EAS (Expo Application Services) is the CI/CD pipeline for mobile apps:

```
Developer pushes code to GitHub
         │
         ▼
EAS Build triggered (cloud build servers)
├── iOS build → .ipa file (Apple package format)
└── Android build → .aab file (Android package format)
         │
         ▼
EAS Submit (automated submission)
├── Submits .ipa to App Store Connect (Apple review process, 1–3 days)
└── Submits .aab to Google Play Console (Google review, hours–1 day)
         │
         ▼
App live on App Store and Google Play
```

**Update strategy with EAS Update:**

For bug fixes and small changes, Expo allows **over-the-air (OTA) updates** — you push a fix and all installed apps update automatically within minutes, without going through the App Store review process. This is a massive advantage for rapid iteration.

> Note: Full App Store reviews are required when you change native code (adding new device permissions, new native modules). Pure JavaScript/UI changes can bypass the review via OTA.

### 5.7 React Native + Expo: Strengths and Limitations

**Strengths:**
- One codebase for iOS and Android — saves 30–50% of mobile development cost
- Expo removes all the complexity of native build tools
- OTA updates for instant bug fixes without App Store delays
- Huge React ecosystem — most React web libraries have React Native equivalents
- Strong community, backed by Meta and Expo Inc.

**Limitations:**
- Very complex native features (advanced AR, custom Bluetooth protocols, deep OS integrations) may still require native code
- App Store and Google Play have separate review processes — a breaking bug on iOS may be fixed on Android in hours but take 24–48 hours to appear on iOS
- Large app bundle sizes compared to pure native apps (mitigated by Hermes engine)
- Some animations require careful implementation to stay smooth on lower-end Android devices

---

## 6. P — PostgreSQL

### 6.1 What Is PostgreSQL

PostgreSQL (pronounced "post-gres-Q-L", often shortened to "Postgres") is the world's most advanced open-source relational database system. It has been in active development since 1986 — making it nearly 40 years old and one of the most battle-tested pieces of software in existence.

It is the database that powers Supabase, and understanding its capabilities explains why Supabase (and therefore the SNAP stack) is so powerful.

### 6.2 Why PostgreSQL Over Other Databases

The database landscape is crowded. Here is why PostgreSQL is the right choice for PropertyApp:

| Database | Type | Good For | Bad For | Verdict for PropertyApp |
|----------|------|----------|---------|------------------|
| **PostgreSQL** | Relational SQL | Complex queries, related data, ACID transactions | Very large document stores | ✅ **Perfect match** |
| **MySQL** | Relational SQL | Web apps, simple queries | Advanced features | ⚠️ Good but less capable |
| **MongoDB** | Document NoSQL | Flexible schema, simple documents | Related data, complex queries | ❌ Wrong fit — property data is relational |
| **Firebase (Firestore)** | Document NoSQL | Real-time, simple mobile apps | Complex queries, joins, analytics | ❌ Gets messy at scale |
| **Redis** | Key-Value | Caching, sessions, queues | Primary data storage | ❌ Not a primary database |
| **SQLite** | Embedded SQL | Single-user desktop apps | Multi-user, production web apps | ❌ Wrong scale |

**The core reason PostgreSQL wins for PropertyApp:** Property management data is fundamentally **relational**. A contract is not a standalone document — it links to a tenant, a unit, a property, a payment schedule, and a set of documents. MongoDB and Firestore force you to either duplicate this data everywhere (wasting storage and causing inconsistencies) or implement manual "joins" in your application code (slow and error-prone). PostgreSQL handles all of this natively, efficiently, and safely.

### 6.3 PostgreSQL Features That PropertyApp Relies On

**ACID Transactions:**
ACID stands for Atomicity, Consistency, Isolation, Durability — the four properties that guarantee database operations are reliable.

```
Example: Recording a payment in PropertyApp

The following must ALL succeed or ALL fail together:
1. Insert a new row in the payments table (amount: 27,500 AED)
2. Update the contract's "paid_amount" field
3. Update the payment_schedule JSONB field
4. Create an audit log entry

If the server crashes after step 2 but before step 3:
→ PostgreSQL automatically rolls back ALL changes
→ The database is left in its original state
→ No partial payment record, no inconsistency
```

Without ACID transactions (which MongoDB does not provide at the document level in all versions), you can end up with corrupt data — a payment recorded but the contract not updated.

**Foreign Keys and Referential Integrity:**
```sql
-- PostgreSQL enforces that a contract MUST reference a real tenant
ALTER TABLE contracts
ADD CONSTRAINT fk_tenant
FOREIGN KEY (tenant_id) REFERENCES tenants(id)
ON DELETE RESTRICT;  -- Cannot delete a tenant who has a contract
```

This means it is **impossible** to create a contract for a tenant that doesn't exist, or to delete a tenant who still has an active contract. The database enforces data quality automatically.

**Full-Text Search:**
```sql
-- Search tenants by name, company, or Emirates ID
SELECT * FROM tenants
WHERE to_tsvector('english', full_name || ' ' || company_name || ' ' || emirates_id)
@@ plainto_tsquery('ahmed ali marina');
```

This is 100x faster than a `LIKE '%ahmed%'` query and understands word variations.

**JSONB Columns:**
PostgreSQL stores JSON documents natively with full indexing:
```sql
-- Store a contract's payment schedule as structured JSON
UPDATE contracts
SET payment_schedule = '[
  {"cheque_no": "001234", "amount": 27500, "due_date": "2024-03-01", "bank": "ENBD"},
  {"cheque_no": "001235", "amount": 27500, "due_date": "2024-06-01", "bank": "ENBD"},
  {"cheque_no": "001236", "amount": 27500, "due_date": "2024-09-01", "bank": "ENBD"},
  {"cheque_no": "001237", "amount": 27500, "due_date": "2024-12-01", "bank": "ENBD"}
]'::jsonb
WHERE id = 'contract-uuid-here';

-- Query by a field inside the JSON
SELECT * FROM contracts
WHERE payment_schedule @> '[{"bank": "ENBD"}]';
```

**Window Functions (for analytics):**
```sql
-- Calculate occupancy rate per property, ranked by performance
SELECT
  p.name AS property,
  COUNT(u.id) AS total_units,
  COUNT(CASE WHEN u.status = 'occupied' THEN 1 END) AS occupied,
  ROUND(
    COUNT(CASE WHEN u.status = 'occupied' THEN 1 END)::numeric /
    COUNT(u.id) * 100, 1
  ) AS occupancy_rate,
  RANK() OVER (ORDER BY occupancy_rate DESC) AS rank
FROM properties p
JOIN units u ON u.property_id = p.id
GROUP BY p.id, p.name;
```

This single query powers the entire Reports page — no application-level calculation needed.

**Triggers (Automation):**
```sql
-- Automatically update unit status when a contract expires
CREATE OR REPLACE FUNCTION update_unit_on_contract_expire()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'expired' AND OLD.status != 'expired' THEN
    UPDATE units SET status = 'vacant' WHERE id = NEW.unit_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contract_expire_trigger
AFTER UPDATE ON contracts
FOR EACH ROW EXECUTE FUNCTION update_unit_on_contract_expire();
```

When any contract's status changes to "expired", the associated unit is automatically marked as "vacant" — no application code needed.

### 6.4 Database Design for PropertyApp (Schema Overview)

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   projects  │─────▶│  properties │─────▶│    units    │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                      ┌───────────────────────────┤
                      │                           │
                 ┌────▼─────┐              ┌──────▼──────┐
                 │ contracts │              │   tenants   │
                 └────┬─────┘              └─────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
   ┌─────▼─────┐ ┌───▼───┐  ┌────▼──────────┐
   │ payments  │ │ docs  │  │ payment_sched │
   └───────────┘ └───────┘  └───────────────┘

Other tables:
├── leads (CRM)
├── leasing_requests
├── bookings
├── maintenance_requests
├── inspections
├── inspection_items (photos, notes per room)
├── agents
├── facilitators
├── audit_logs (every action tracked)
└── notifications
```

---

## 7. How the Four Layers Work Together

### 7.1 Request Flow — Loading the Dashboard

Let's trace exactly what happens when an admin opens the PropertyApp dashboard:

```
1. Admin opens browser → types propertyapp.asico.ae
   ↓
2. DNS resolves → Vercel CDN (nearest server, e.g. Dubai)
   ↓
3. Vercel serves Next.js app
   ↓
4. Next.js Server Component runs on Vercel's server:
   - Reads the admin's session cookie
   - Creates Supabase client with the admin's credentials
   - Runs 5 database queries in parallel:
     a. SELECT KPI totals (total contract value, occupancy rate, etc.)
     b. SELECT properties with unit counts
     c. SELECT recent contracts
     d. SELECT pending maintenance requests
     e. SELECT upcoming payment due dates
   ↓
5. PostgreSQL (inside Supabase) executes queries:
   - RLS policies checked: admin sees all properties ✓
   - Results returned in ~20ms
   ↓
6. Next.js renders the complete HTML with data embedded
   ↓
7. Browser receives HTML → Dashboard appears immediately (no loading state)
   ↓
8. Browser downloads React JavaScript (hydration)
   ↓
9. Client Components activate:
   - Real-time subscription to contracts table established
   - Charts rendered (Chart.js)
   - Interactive buttons become clickable
   ↓
10. Admin sees a fully loaded, interactive dashboard
    Total time from step 1 to step 10: ~400ms
```

### 7.2 Request Flow — Mobile App Recording a Payment

```
1. Agent opens PropertyApp mobile app on iPhone
   ↓
2. Expo/React Native app launches (cached locally)
   ↓
3. Supabase SDK checks local session:
   - Valid JWT token found → agent is logged in
   - Token auto-refreshes in background if needed
   ↓
4. Agent navigates to "Collection" → finds overdue payment
   ↓
5. Agent taps "Mark as Paid"
   ↓
6. React Native form captures:
   - Payment amount (AED 27,500)
   - Payment date (today)
   - Cheque number
   - Photo of cheque (captured via Expo Camera)
   ↓
7. Supabase Storage: cheque photo uploaded to /cheques/2024-03/
   ↓
8. Supabase Database: INSERT into payments table
   - RLS check: agent can only record payments for their contracts ✓
   ↓
9. PostgreSQL trigger fires: updates contract's paid_amount field
   ↓
10. Supabase Realtime: broadcasts change to all subscribers
    ↓
11. Admin's dashboard (web browser, open in Dubai office):
    - "Unrealised Collection" KPI updates live
    - Payment appears in collection table without refresh
    ↓
12. Agent sees success confirmation on phone
    Total time: ~600ms
```

---

## 8. Security Architecture

### 8.1 Security Layers

The SNAP stack provides security at **five distinct layers**:

```
Layer 1: Transport Security
└── HTTPS/TLS on all connections (Vercel + Supabase enforce this)
└── JWT tokens expire after 1 hour (auto-refreshed)

Layer 2: Authentication
└── Supabase Auth validates every API request
└── Sessions are server-validated, not just client-side
└── Brute force protection built-in (rate limiting)

Layer 3: Authorisation
└── Row-Level Security in PostgreSQL
└── Each user can only read/write their own data
└── Even if an API key is stolen, RLS limits what it can access

Layer 4: Application Security
└── .htaccess security headers (CSP, X-Frame-Options, etc.)
└── Input validation before database insertion
└── SQL injection: impossible with Supabase's parameterised queries

Layer 5: Infrastructure Security
└── Supabase manages database server security
└── Vercel manages web server security
└── No exposed server ports — everything via HTTPS API
└── Automatic SSL certificate renewal
```

### 8.2 JWT Token Flow

```
Login → Supabase validates credentials
         ↓
      Issues two tokens:
      ├── Access Token (JWT, expires in 1 hour)
      └── Refresh Token (expires in 60 days)
         ↓
      Access Token stored in browser cookie (httpOnly, secure)
         ↓
      Every API request includes Access Token in Authorization header
         ↓
      PostgreSQL RLS reads user ID from token
         ↓
      Queries only return data the user is allowed to see
```

### 8.3 Data for the UAE Market

For a property management platform operating in the UAE, specific data considerations apply:

**Personal Data (Emirates ID, Passport, etc.):**
- Supabase Pro and above allows choosing the data region — select "Frankfurt" (EU) or "Singapore" for GDPR compliance
- Future: Supabase is expanding to UAE/MENA regions
- Alternative: Self-host Supabase on a UAE-based cloud provider (AWS Middle East - Bahrain, or Azure UAE North) for full data sovereignty

**Audit Logging:**
Every action in PropertyApp should be logged — who did what, when:
```sql
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100),           -- "contract_created", "payment_recorded"
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

This is a legal requirement in UAE property management (RERA compliance) and provides a complete trail for dispute resolution.

---

## 9. Performance & Scalability

### 9.1 Performance Benchmarks

**Database query performance** (typical PropertyApp queries on PostgreSQL):

| Query | Records | Time |
|-------|---------|------|
| Load dashboard KPIs | All tables | ~20–50ms |
| List all contracts with tenant names | 1,000 contracts | ~15ms |
| Search tenants by name | 10,000 tenants | ~5ms |
| Generate occupancy report | All units | ~30ms |
| Real-time subscription latency | N/A | ~100ms |

**Web app performance** (Next.js on Vercel):

| Metric | Target | What It Means |
|--------|--------|---------------|
| **Time to First Byte (TTFB)** | < 200ms | Server responds quickly |
| **First Contentful Paint (FCP)** | < 1.5s | User sees something |
| **Largest Contentful Paint (LCP)** | < 2.5s | Main content loaded |
| **Time to Interactive (TTI)** | < 3.5s | User can click and type |
| **Lighthouse Score** | > 90/100 | Google's overall quality score |

### 9.2 Scalability Model

The SNAP stack scales in three phases without architectural changes:

**Phase 1: 0–1,000 active users**
```
Infrastructure: Supabase Free/Pro + Vercel Hobby/Pro
Cost: $0–$45/month
Database: Single PostgreSQL instance (2 CPU, 1GB RAM on Pro)
No changes needed
```

**Phase 2: 1,000–50,000 active users**
```
Infrastructure: Supabase Pro (upgraded add-ons) + Vercel Pro
Cost: ~$200–500/month
Database: Upgrade to dedicated compute add-on (4+ CPU, 8GB RAM)
Add: Redis caching via Upstash for frequently accessed data
Add: Supabase Read Replicas for analytics queries
```

**Phase 3: 50,000+ active users**
```
Infrastructure: Supabase Enterprise + Vercel Enterprise
Cost: Custom / $1000+/month
Database: Multiple read replicas, connection pooling via pgBouncer
Add: Database partitioning for the payments and audit_logs tables
Add: Separate analytics database (pg_analytics or ClickHouse)
Consider: PgBouncer connection pooling (already built into Supabase)
```

### 9.3 Connection Pooling

One critical PostgreSQL scalability feature that Supabase handles automatically is **connection pooling**.

PostgreSQL can handle a limited number of simultaneous connections (typically 100–500 on standard hardware). A web app might need to serve thousands of simultaneous requests. Connection pooling (via PgBouncer, built into Supabase) maintains a pool of database connections and shares them efficiently across thousands of application requests.

For PropertyApp, this means: even during peak times (e.g., end of month when 500 agents simultaneously check payment statuses), the database remains responsive.

---

## 10. Cost Analysis

### 10.1 Launch Phase (MVP)

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Free | $0/month |
| Vercel (web) | Hobby | $0/month |
| Expo (mobile builds) | Free (30 builds/month) | $0/month |
| Domain name | — | ~$12/year ($1/month) |
| Apple Developer Account | — | $99/year ($8/month) |
| Google Play | — | $25 one-time |
| **Total** | | **~$9/month** |

### 10.2 Production Phase (First Paying Clients)

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Pro | $25/month |
| Vercel (web) | Pro | $20/month |
| Expo EAS | Production | $99/month |
| Domain + SSL | — | $1/month |
| Apple Developer | — | $8/month |
| **Total** | | **~$153/month** |

### 10.3 Growth Phase (100+ Properties)

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Pro + Compute Add-on | $75/month |
| Vercel (web) | Pro | $20/month |
| Expo EAS | Production | $99/month |
| Email service (SendGrid) | Essentials | $20/month |
| SMS notifications | Twilio | ~$30/month |
| Monitoring (Sentry) | Team | $26/month |
| **Total** | | **~$270/month** |

### 10.4 Cost Per User

At 100 properties with an average of 200 units each:
- Total units: 20,000
- Estimated users (admins + agents + property staff): ~500
- Cost per user: ~$0.54/month

For context: competing property management SaaS products charge $1–3 per unit per month. PropertyApp's infrastructure cost at this scale is effectively negligible compared to revenue potential.

---

## 11. SNAP vs. Alternative Stacks

### 11.1 SNAP vs. MEAN Stack (MongoDB, Express, Angular, Node.js)

| Aspect | SNAP | MEAN |
|--------|------|------|
| Database | PostgreSQL (relational) | MongoDB (document) |
| Fits PropertyApp's data? | ✅ Excellent — relational data | ❌ Poor — joins are manual |
| Backend code needed | Minimal (Supabase handles it) | Yes — Express API needed |
| Team size needed | 2–3 developers | 3–5 developers |
| Mobile app | React Native included | Separate framework needed |
| Real-time | Built into Supabase | Additional setup (Socket.io) |
| Auth | Built into Supabase | Custom or passport.js |
| **Verdict** | **Better for PropertyApp** | Overkill for this use case |

### 11.2 SNAP vs. LAMP Stack (Linux, Apache, MySQL, PHP)

| Aspect | SNAP | LAMP |
|--------|------|------|
| Language | JavaScript everywhere | PHP (backend) + JS (frontend) |
| Mobile app | React Native | Separate (Flutter or native) |
| Developer market | Large, growing | Shrinking |
| Real-time | Native (Supabase) | Complex add-on |
| Modern tooling | Excellent | Dated |
| **Verdict** | **Better for new projects** | Legacy — not recommended |

### 11.3 SNAP vs. Django + React (Python backend)

| Aspect | SNAP | Django + React |
|--------|------|---------------|
| Language | JavaScript everywhere | Python (backend) + JS (frontend) |
| Team needed | Full-stack JS developer | Backend Python dev + Frontend JS dev |
| Database admin | Supabase (automatic) | Manual Django admin/migrations |
| Mobile | React Native (shared code) | Separate React Native project |
| Real-time | Native (Supabase) | Django Channels (complex) |
| Analytics/ML | Add Python as Lambda later | Native Python |
| **Verdict** | **Better for small team** | Good if Python expertise available |

### 11.4 SNAP vs. Firebase Stack (Google)

| Aspect | SNAP | Firebase |
|--------|------|---------|
| Database | PostgreSQL (SQL, relational) | Firestore (NoSQL, document) |
| Complex queries | ✅ Native SQL | ❌ Limited, requires workarounds |
| Data relationships | ✅ Foreign keys, joins | ❌ Manual, denormalized |
| Analytics queries | ✅ Powerful SQL aggregations | ❌ Very limited |
| Pricing | Predictable ($25/month Pro) | Can get expensive at scale |
| Vendor lock-in | Low (open-source core) | High (Google-proprietary) |
| Self-hostable | ✅ Yes | ❌ No |
| **Verdict** | **Better for PropertyApp** | Good for simple apps, wrong for property management |

---

## 12. Migration Path from PropertyApp-Lite

### 12.1 What Carries Over

The current PropertyApp-Lite is not wasted work. Here is what transfers directly:

| PropertyApp-Lite Asset | Carries Over To |
|-----------------|----------------|
| CSS design system (all tokens, components) | Next.js global CSS — nearly identical |
| Color scheme, typography, spacing | Used unchanged in both Next.js and React Native (via StyleSheet) |
| Route structure (26 routes) | Maps directly to Next.js App Router file structure |
| UI component patterns (cards, tables, modals) | Converted to React components (reusable across all pages) |
| DB mock data structure | Defines the real PostgreSQL schema |
| `packages.md` plan definitions | Maps to Supabase subscription/plan tables |
| `.htaccess` security rules | Supplemented by Vercel's `vercel.json` security headers |
| `plans.js` subscription logic | Becomes server-side plan gating with Supabase |

### 12.2 Migration Phases

**Phase 1: Database First (Week 1–2)**
```
1. Create Supabase project
2. Design PostgreSQL schema based on DB mock data in data.js
3. Seed the database with the mock data
4. Test all queries return the same results as the mock DB
5. Set up Row-Level Security policies for each role
```

**Phase 2: Authentication (Week 2–3)**
```
1. Replace the current fake Auth.login() with Supabase Auth
2. Create test users for each role (super admin, agent, tenant)
3. Verify RLS policies work correctly for each role
4. Add "forgot password" email flow (Supabase handles email sending)
```

**Phase 3: Web App Conversion (Week 3–8)**
```
For each of the 26 routes in app.js:
1. Create corresponding page.tsx in Next.js
2. Convert the renderX() function's HTML to JSX
3. Replace DB.x references with Supabase queries
4. Add real-time subscription where needed
5. Test with real data
```

Priority order:
```
First: Dashboard, Properties, Units (core value)
Then: Tenants, Contracts, Collection (financial core)
Then: CRM (Leads, Leasing, Booking)
Then: Maintenance, Inspections
Then: Reports, Workboard
Finally: Direct Debit, Legal
```

**Phase 4: Mobile App (Week 9–16)**
```
1. Set up React Native + Expo project
2. Set up tab navigation structure
3. Build mobile versions of high-priority screens:
   - Dashboard (simplified KPIs)
   - Properties and Units list
   - Tenants list and detail
   - Contracts list
   - Maintenance requests
   - Inspection form with camera
4. Integrate Expo push notifications
5. Test on real iOS and Android devices via Expo Go
6. Submit to App Store and Google Play via EAS
```

---

## 13. Developer Experience

### 13.1 Local Development Setup

Setting up the SNAP stack for development is straightforward:

```bash
# 1. Create Next.js project
npx create-next-app@latest propertyapp --typescript --tailwind --app

# 2. Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 3. Create React Native project
npx create-expo-app propertyapp-mobile --template

# 4. Install Supabase client for mobile
cd propertyapp-mobile && npm install @supabase/supabase-js

# 5. Local Supabase (optional — for offline development)
npx supabase init
npx supabase start
# → Starts local PostgreSQL + Supabase dashboard on localhost
```

### 13.2 TypeScript — Catching Errors Before They Reach Users

The SNAP stack uses TypeScript throughout — a version of JavaScript that adds type safety.

**Without TypeScript:**
```javascript
// This bug only shows up when a user triggers it in production
function displayTenant(tenant) {
  return tenant.fullName.toUpperCase(); // Crash if fullName is null
}
```

**With TypeScript:**
```typescript
// This error shows up in the code editor before you even save the file
interface Tenant {
  fullName: string | null;
  email: string;
}

function displayTenant(tenant: Tenant) {
  return tenant.fullName.toUpperCase(); // ❌ TypeScript error: fullName might be null
  return tenant.fullName?.toUpperCase() ?? 'Unknown'; // ✅ Handles null safely
}
```

Supabase can automatically generate TypeScript types from your database schema:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

This means every table, column, and query in your database has a corresponding TypeScript type — the code editor knows exactly what data shape to expect, and will show an error if you make a typo in a column name or pass the wrong data type.

### 13.3 Tooling Ecosystem

| Tool | Purpose | Free? |
|------|---------|-------|
| **VS Code** | Code editor | ✅ Free |
| **Supabase Studio** | Visual database editor | ✅ Free |
| **Expo Go** | Test mobile app on real device | ✅ Free |
| **Vercel Preview** | Automatic preview for every PR | ✅ Free |
| **Sentry** | Error tracking in production | ✅ Free tier |
| **Posthog** | Analytics and user behavior | ✅ Free tier |
| **GitHub Actions** | Automated testing and deployment | ✅ Free tier |

---

## 14. Risks & Mitigations

### Risk 1: Supabase Vendor Dependency

**Risk:** Supabase as a company could change pricing, have outages, or shut down.

**Mitigation:**
- Supabase is **open-source** — you can self-host the entire Supabase stack on any cloud
- The underlying database is standard **PostgreSQL** — migrate to any PostgreSQL host (AWS RDS, DigitalOcean, Neon) with a single `pg_dump`
- No proprietary data format — your data is always accessible
- Supabase has raised $80M and powers 1M+ databases — low risk of shutdown

---

### Risk 2: React Native Performance on Low-End Android

**Risk:** Some UAE users may have older or lower-end Android devices where React Native animations can feel janky.

**Mitigation:**
- Use the **Hermes JavaScript engine** (default in Expo) — significantly improves React Native performance on Android
- Implement the **New Architecture** (Fabric renderer) for smoother animations
- Test specifically on mid-range Android devices (Samsung A-series) during development
- Heavy animations can be replaced with **React Native Reanimated** library for native-thread animations

---

### Risk 3: App Store Review Delays

**Risk:** A critical bug fix could take 24–72 hours to reach iOS users due to Apple's review process.

**Mitigation:**
- Use **Expo OTA Updates** — JavaScript/UI fixes can be pushed instantly to all installed apps without App Store review
- Only native code changes (new device permissions, new native modules) require full review
- Submit updates during off-peak times (Monday morning) for faster review turnaround
- Maintain a staging build on TestFlight for internal testing before production release

---

### Risk 4: Database Performance with Large Data Sets

**Risk:** After 5+ years, the database could contain millions of audit logs and payments, potentially slowing queries.

**Mitigation:**
- **Table partitioning:** Partition the `audit_logs` and `payments` tables by year — old data is automatically in separate partitions, queries on current year data are fast
- **Indexes:** Add appropriate indexes from day one (on `tenant_id`, `contract_id`, `created_at` columns in key tables)
- **Archiving:** Move closed contracts and resolved maintenance requests to archive tables after 2 years
- **Read replica:** Supabase Pro allows adding a read replica — dashboard analytics run on the replica, leaving the primary database for write operations

---

### Risk 5: Team Knowledge Concentration

**Risk:** If the single developer who built the system leaves, knowledge is lost.

**Mitigation:**
- **Document everything** — Supabase Studio shows the schema visually; add table/column comments
- **Code comments** — all complex queries and business rules commented in code
- **TypeScript** — the types themselves are documentation; anyone new can read the types and understand the data structure
- **Supabase Dashboard** — non-developers (managers) can browse data, run simple queries, and understand the structure without touching code

---

## 15. Conclusion & Recommendation

### The Case in One Paragraph

PropertyApp needs to manage deeply relational property data, serve multiple user roles with strict access control, work on both web and mobile, handle real-time updates, and remain maintainable by a small team on a lean budget. The SNAP stack — Supabase, Next.js, React Native, PostgreSQL — addresses every one of these requirements directly, without workarounds or compromises. No other commonly available stack does this as efficiently for this specific use case.

### Final Recommendation Matrix

| Requirement | SNAP Solution | Confidence |
|-------------|--------------|------------|
| Relational property data | PostgreSQL + Supabase | ✅ Excellent |
| Multi-role access control | Supabase RLS | ✅ Excellent |
| Real-time dashboard updates | Supabase Realtime | ✅ Excellent |
| Web application | Next.js on Vercel | ✅ Excellent |
| iOS + Android mobile app | React Native + Expo | ✅ Excellent |
| Code sharing web/mobile | React + React Native | ✅ Good (60–70%) |
| Small team maintainability | Single language (JS/TS) | ✅ Excellent |
| Cost efficiency | Free → $153/month | ✅ Excellent |
| Scalability | To 100k+ users | ✅ Excellent |
| Vendor lock-in risk | Open source core | ✅ Low risk |
| UAE data compliance | Self-hostable | ✅ Possible |

### Action Steps

```
Immediate (This Week):
├── Deploy PropertyApp-Lite to Netlify (current static version)
└── Create Supabase account and initialise project

Short Term (Next Month):
├── Design and implement PostgreSQL schema
├── Build authentication with Supabase Auth
└── Begin converting dashboard to Next.js

Medium Term (3–6 Months):
├── Complete web app conversion to Next.js + Supabase
├── Begin React Native mobile app development
└── Beta test with first real client

Long Term (6–12 Months):
├── Launch iOS and Android apps on App Stores
├── Implement direct debit / payment gateway
└── Build advanced analytics and reporting
```

---

*This report covers the SNAP stack as it applies specifically to the PropertyApp property management platform.*

*Developed by **Shoaib Ahmed** — Web Developer, ASICO*  
*An Idea by **Sheeraz Shaikh***  
*PropertyApp-Lite → PropertyApp Full Platform*
