# PropertyApp — Deployment & Tech Stack Guide

> Written for everyone — no technical background needed.  
> Think of this as a plain-English blueprint for building and launching PropertyApp as a real product.

---

## Part 1 — Where to Host the Current App (Static Version)

Right now, PropertyApp is a **static web app** — meaning it's just HTML, CSS, and JavaScript files.  
There is no server, no database, no login system (yet). It runs entirely in the browser.

### The 4 Platforms Compared

| Platform | Best For | Price (Start) | Difficulty |
|----------|----------|--------------|------------|
| **Netlify** ⭐ | Static sites, fast deploys | Free | Very Easy |
| Vercel | Static + Next.js apps | Free | Easy |
| Railway | Full apps with databases | ~$5/mo | Medium |
| Google Cloud | Enterprise-scale systems | Pay-as-you-go | Hard |

---

### ✅ Recommendation for Now: **Netlify**

**Why Netlify wins for this stage:**

- **Drag-and-drop deploy** — you literally drag the project folder onto the website and it's live in 60 seconds
- **Connects directly to GitHub** — every time you push code, it automatically updates the live site
- **Free SSL/HTTPS included** — no extra setup needed, your `.htaccess` HTTPS rules work out of the box
- **Global CDN built-in** — your app loads fast for users in Dubai, London, or New York equally
- **The `.htaccess` file works** — Netlify supports all the security rules we wrote
- **Free tier is genuinely free** — 100GB bandwidth, unlimited deploys, custom domain support

**How to deploy in 3 steps:**
1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Click **"Add new site" → "Import from Git"** → Connect your GitHub repo
3. Select the branch → click **Deploy** — done. Your site is live.

---

### Why Not the Others (for now)?

| Platform | Why Skip for Now |
|----------|-----------------|
| **Vercel** | Also excellent, but slightly more optimised for React/Next.js apps. Use it when you go full-stack |
| **Railway** | Built for apps with databases and servers — overkill for a static site, costs money from day one |
| **Google Cloud** | Powerful but complex. Needs a DevOps engineer to manage. Built for large companies |

---
---

## Part 2 — Going Full-Stack (Real Web App + Mobile App)

This is the bigger picture — turning PropertyApp from a demo into a **real, working product** that property managers actually use daily, on both a browser and their phones.

---

### What "Full-Stack" Means (Simply)

Imagine a restaurant:

- **Frontend (Web/Mobile)** = The dining room. What customers see and interact with.
- **Backend** = The kitchen. Handles all the logic, rules, and cooking.
- **Database** = The pantry/storage. Holds all the data (tenants, contracts, payments).
- **Auth** = The entrance host who checks who you are before letting you in.

A full-stack app has all four layers working together.

---

## ⭐ Recommended Tech Stack: The "SNAP" Stack

> **S**upabase · **N**ext.js · **A**pollo/React Native · **P**ostgreSQL

This is the ideal combination for PropertyApp specifically. Here's each piece explained:

---

### 🗄️ Database & Backend: **Supabase**

**What it is:** Think of Supabase as your entire back-office system in one place.  
It handles your database, user logins, file storage, and real-time updates — all without needing to hire a separate backend developer.

**Why it's perfect for PropertyApp:**

| Feature | What It Does for PropertyApp |
|---------|----------------------|
| **PostgreSQL Database** | Stores tenants, contracts, units, payments — all organised in neat tables |
| **Real-time updates** | When a payment is recorded, it instantly appears on all open screens — no refresh needed |
| **Authentication** | Handles login, logout, password reset, and role-based access (admin vs. agent vs. tenant) |
| **File Storage** | Stores tenant documents, contracts PDFs, inspection photos |
| **Row-level Security** | An agent can only see their own properties. A tenant only sees their own contract. Built-in. |
| **Auto-generated API** | Every table you create automatically becomes an API endpoint — no extra code needed |

**Cost:** Free up to 500MB database + 2 projects. Paid from $25/month for production.

---

### 🌐 Web App: **Next.js** (React)

**What it is:** Next.js is the framework used to build the actual website people visit in their browser.  
It's like the architectural blueprint that organises all your web pages, screens, and data.

**Why Next.js for PropertyApp:**

- **Fast loading** — Pages load almost instantly because content is prepared on the server before sending to the user
- **SEO-friendly** — If PropertyApp ever has public-facing property listings, they'll show up on Google
- **Same language everywhere** — JavaScript is used for both the frontend and the server code. One developer can handle both.
- **File-based routing** — Creating a new page is as simple as adding a new file. No complex configuration.
- **Used by** — Airbnb, TikTok, Notion, Twitch. Battle-tested at massive scale.

---

### 📱 Mobile App: **React Native + Expo**

**What it is:** React Native lets you build **one app that runs on both iPhone and Android** — you don't need two separate teams or two separate codebases.  
Expo is the toolkit that makes building with React Native much easier.

**Why React Native + Expo for PropertyApp:**

- **Share 60–70% of code with the web app** — the same business logic, same API calls, same design system. Write once, use everywhere.
- **One codebase = iOS + Android** — instead of paying two teams (one for Apple, one for Android), you pay one
- **Expo Go app** — during development, testers can scan a QR code on their phone and instantly see the latest version. No App Store submission needed for testing.
- **Push notifications** — Built in. Send payment reminders, maintenance updates, and lease renewal alerts to tenants' phones.
- **Camera & file access** — Inspectors can take photos directly in the app during move-in/move-out

---

### 🚀 Deployment: **Vercel + Expo EAS + Supabase Cloud**

| What | Where | Why |
|------|-------|-----|
| Web App (Next.js) | **Vercel** | Made by the same team as Next.js. One-click deploy, zero configuration |
| Mobile App (iOS) | **Apple App Store** via Expo EAS | Expo handles the complex Apple submission process |
| Mobile App (Android) | **Google Play Store** via Expo EAS | Same — Expo automates the build and submission |
| Database & Backend | **Supabase Cloud** | Managed database with automatic backups, zero maintenance |

---

## The Complete Picture

```
┌─────────────────────────────────────────────────────────┐
│                     USERS                               │
│          Browser           iPhone / Android             │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌───────────────────────┐
│   Next.js Web    │      │  React Native Mobile  │
│   (Vercel)       │      │  (App Store / Play)   │
└──────────┬───────┘      └───────────┬───────────┘
           │                          │
           └──────────┬───────────────┘
                      │  Shared API calls
                      ▼
           ┌─────────────────────┐
           │      Supabase       │
           │  ┌───────────────┐  │
           │  │  PostgreSQL   │  │  ← All your data
           │  │   Database    │  │
           │  └───────────────┘  │
           │  ┌───────────────┐  │
           │  │     Auth      │  │  ← Login / roles
           │  └───────────────┘  │
           │  ┌───────────────┐  │
           │  │    Storage    │  │  ← Files / photos
           │  └───────────────┘  │
           │  ┌───────────────┐  │
           │  │   Realtime    │  │  ← Live updates
           │  └───────────────┘  │
           └─────────────────────┘
```

---

## Why This Stack is Specifically Better for PropertyApp

This isn't a generic recommendation. Here's why this stack matches PropertyApp's exact needs:

### 1. Property data is relational — PostgreSQL handles it perfectly
Tenants belong to units. Units belong to properties. Properties belong to projects.  
Contracts link tenants to units. Payments link to contracts.  
This is *exactly* what a relational database like PostgreSQL is built for.  
A modern "NoSQL" database (like Firebase) would make these relationships messy and slow.

### 2. Real-time matters in property management
When a payment is marked as received, every open dashboard should update instantly.  
When a maintenance request is resolved, the tenant's app should notify them immediately.  
Supabase Realtime handles all of this with zero extra infrastructure.

### 3. Role-based access is non-negotiable
An agent should not see another agent's leads.  
A tenant should only see their own contract and payment history.  
A property admin should only manage their assigned building.  
Supabase's Row-Level Security enforces this at the database level — even if a developer makes a mistake in the app code, the data is still protected.

### 4. One team can build everything
Next.js + React Native share the same language (JavaScript/TypeScript) and the same core patterns.  
A developer who knows one can quickly work on the other.  
This keeps the team small and the budget lean.

### 5. The mobile app is not optional
Property managers are not always at a desk.  
Inspectors need to do move-in/move-out reports on-site with photos.  
Tenants want to submit maintenance requests from their phone.  
Agents need to check lead status while showing a property.  
React Native makes this possible without doubling the development cost.

---

## Cost Estimate (Monthly, Production)

| Service | Free Tier | Paid (Production) |
|---------|-----------|-------------------|
| Supabase | Free (dev/testing) | $25/month (Pro) |
| Vercel (web) | Free (hobby) | $20/month (Pro) |
| Expo EAS (mobile builds) | Free (limited) | $99/month (Production) |
| Apple Developer Account | — | $99/year (one-time) |
| Google Play Developer | — | $25 (one-time) |
| Custom Domain | — | ~$12/year |
| **Total (launch)** | **$0 for MVP** | **~$170/month** |

> 💡 **For an MVP (first working version):** You can run everything on free tiers for the first 3–6 months while validating the product. The paid tiers only become necessary when you have real users and real data.

---

## Recommended Build Order

```
Phase 1 — Foundation (Weeks 1–4)
├── Set up Supabase project
├── Design database tables (properties, units, tenants, contracts, payments)
├── Set up Next.js project connected to Supabase
└── Build authentication (login, roles, permissions)

Phase 2 — Core Web App (Weeks 5–12)
├── Rebuild PropertyApp-Lite screens using Next.js + real Supabase data
├── Property management, tenants, contracts, collections
└── Deploy to Vercel

Phase 3 — Mobile App (Weeks 13–20)
├── Set up React Native + Expo project
├── Port key screens: dashboard, contracts, maintenance, inspections
├── Add camera support for inspections
└── Submit to App Store + Google Play

Phase 4 — Advanced Features (Weeks 21+)
├── Push notifications
├── Direct debit integration (Stripe or local payment gateway)
├── Advanced reports and analytics
└── Multi-language support (Arabic + English for UAE market)
```

---

## Summary

| Question | Answer |
|----------|--------|
| **Best platform to deploy the current app?** | **Netlify** — free, simple, instant |
| **Best platform for full-stack deployment?** | **Vercel** (web) + **Supabase** (backend) + **Expo EAS** (mobile) |
| **Best database?** | **PostgreSQL via Supabase** |
| **Best web framework?** | **Next.js** |
| **Best mobile framework?** | **React Native + Expo** |
| **Cost to start?** | **$0** (all free tiers available) |
| **Cost in production?** | **~$170/month** |
| **One team or two?** | **One team** — same language for web and mobile |

---

*Prepared for PropertyApp-Lite → PropertyApp Full Product*  
*Developed by Shoaib Ahmed — Web Developer, ASICO*  
*An Idea by Sheeraz Shaikh*
