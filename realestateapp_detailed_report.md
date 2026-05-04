# 🏢 RealEstateApp.ae — Comprehensive Application Analysis Report

**Date:** May 4, 2026  
**URL:** https://realestateapp.ae/  
**Developer:** Realestate App Tech Limited / SoftSpace  
**Client Company (Demo):** Asico Real Estate LLC  
**Support Email:** support@realestateapp.ae / apps@realestateapp.ae

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Authentication & Security](#3-authentication--security)
4. [Navigation Structure](#4-navigation-structure)
5. [Module-by-Module Feature Analysis](#5-module-by-module-feature-analysis)
6. [Dashboard & Analytics](#6-dashboard--analytics)
7. [UI/UX Analysis](#7-uiux-analysis)
8. [Mobile App & Cross-Platform](#8-mobile-app--cross-platform)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [Security Assessment](#10-security-assessment)
11. [Performance Analysis](#11-performance-analysis)
12. [Observations & Recommendations](#12-observations--recommendations)

---

## 1. Executive Summary

**RealEstateApp.ae** is a comprehensive, enterprise-grade **Property Management SaaS application** purpose-built for the UAE real estate market. It provides end-to-end leasing lifecycle management — from lead capture and CRM through contract generation, rent collection, maintenance, inspections, and legal proceedings.

The application is operated under **Realestate App Tech Limited** and is developed by **SoftSpace** (softspace.ae). It targets property management companies to streamline their leasing operations, offering both a web portal and native mobile apps (iOS & Android).

### Key Highlights
| Aspect | Detail |
|---|---|
| **Type** | B2B SaaS — Property Management Platform |
| **Market** | UAE Real Estate (Dubai-centric, Ejari integration) |
| **Platform** | Web (Angular SPA) + iOS + Android |
| **Pricing** | Free (App Store listing), likely subscription-based for the web portal |
| **Current Version** | v2.44.9 (as of April 2, 2026) |
| **iOS Size** | 134.1 MB |
| **Min iOS** | Requires iOS 16.6+ |

---

## 2. Technology Stack & Architecture

### Frontend
| Technology | Details |
|---|---|
| **Framework** | Angular (latest, with standalone components) |
| **UI Library** | Angular Material (`deeppurple-amber` prebuilt theme) |
| **CSS Framework** | Bootstrap 5 (v5.x via `bootstrap.min.css` + `bootstrap.bundle.min.js`) |
| **Typography** | Google Fonts — Inter (100-900) + Open Sans (300-800) |
| **JavaScript** | jQuery 3.6.0 (legacy support alongside Angular) |
| **Build System** | esbuild-based (Angular CLI, module preloaded chunks) |
| **Rendering** | Client-side SPA with `<app-root>` bootstrap |

### Key Libraries Detected
| Library | Purpose |
|---|---|
| `ngx-filesaver` | File download/save functionality (contracts, reports) |
| `ngx-lightbox` | Image viewer with zoom, rotate, and download capabilities |
| `FileSaver.min.js` | Browser-based file saving |
| **Angular Material** | Dialogs, forms, chips, slide toggles, cards, tooltips, progress bars, autocomplete, select |

### Backend Architecture
| Component | Detail |
|---|---|
| **API Pattern** | RESTful API with POST-based RPC calls |
| **Auth** | Token-based (JWT likely, via `AsicoService.UpdateToken()`) |
| **Finance API** | Separate microservice endpoint (`environment.Application.FinanceApi`) |
| **Service Layer** | `AsicoService` (core), `FinanceService`, and others |

### Build & Deployment
- **10 lazy-loaded JavaScript chunks** for code-splitting:
  - `chunk-4CLZLDNP.js` — Collection status management
  - `chunk-WETTWNBF.js` — Renewal decisions, unit selection, legal proceedings
  - `chunk-NQSX2GX5.js` — Special contract release requests
  - `chunk-5RKCV2ZM.js` — Approvals, legal, maintenance, direct debit, inspections
  - `chunk-VK3EPBKA.js` — User remarks/comments system
  - `chunk-EOB2MQ4I.js` — Deposit status updates
  - `chunk-EC7IQJSH.js` — Finance service (collection data, payment schedule uploads)
  - `chunk-H7NRQHU7.js` — Maintenance module (priority, remarks, feedback, rescheduling)
  - `chunk-XCTGJHCJ.js` — File saver + Lightbox image viewer
  - `chunk-PA3ZXPIL.js` — FileSaver.min.js wrapper
- **PWA Support** — `manifest.json` present with GCM sender ID (`865435990924`) for push notifications

---

## 3. Authentication & Security

### Login System
- **Login Page** (`/login`) — Email + password based authentication
- **Forgot Password** — Email-based reset flow with link sent to email
- **Password Reset** — Separate reset page with confirmation messaging
- **Change Password** — Available in user profile settings (requires current password)

### User Profile & Session
- Displays **user name** and **designation** in the header/sidebar
- **Subscription name** displayed (suggesting multi-tier plans)
- **Theme toggle** (light/dark mode with `setTheme()` function)
- **Sign Out / Log Out** functionality

### Authorization
- **Role-Based Access Control (RBAC)** — The app has a dedicated "Roles" section in settings
- **401 Unauthorized Page** — Custom error page: *"You are not authorized to access this page, please contact administrator"*
- **Functional Modules** — Configurable per role, suggesting granular permission management

---

## 4. Navigation Structure

The application features a comprehensive **sidebar navigation** (desktop) and a **bottom/top navigation** (mobile) with the following hierarchy:

### Primary Navigation Menu

```
├── 📊 Dashboard
├── 💳 Direct Debit
├── 🏗️ Property Mgmt.
│   ├── Projects
│   ├── Properties
│   ├── Units
│   └── Lessor
├── 📋 CRM
│   ├── Leads
│   ├── Leasing Request
│   └── Booking
├── 💰 Accounts
│   ├── Collection
│   └── Bank Deposit
├── 👥 People
│   ├── Tenants
│   ├── Agents
│   ├── Property Admin
│   └── Facilitators
├── 📄 Contracts
├── 🔄 Renewals
├── ✅ Approvals
├── ⚖️ Legal
├── 🔧 Maintenance
├── 🔍 Inspection
│   ├── Move In
│   └── Move Out
├── 📧 Mail Box
├── 📊 Reports
├── ⚙️ Settings / Master Settings
└── 📋 Workboard
```

### Header/Top Bar Features
- **Company branding** (Asico Real Estate LLC)
- **Notification bell** with count badge (e.g., "5")
- **Notification dropdown** showing contract-level alerts (Unit No, Property, Location, CRM details)
- **User avatar/profile** with dropdown menu
- **Breadcrumb navigation** (`{{ breadcrumb.label }}`)

---

## 5. Module-by-Module Feature Analysis

### 5.1 Dashboard
The main dashboard provides a high-level financial and operational overview:

**Financial KPIs:**
- **Total Contract Value** — `AED {{Dash?.TConValue}}`
- **Unrealised Collection for Ready Units** — `AED {{Dash?.TUnrealiseCol}}`
- **Est. Collection if Fully Occupied** — `AED {{Dash?.TEstCol}}`

**Occupancy Status:**
- Total occupancy percentage with visual chart
- Breakdown: Leased, Booked, Vacant, Occupied, Residential, Commercial

**CRM Performance Panel:**
- Leads count (`{{Dash?.TLead}}`)
- Leasing Requests count (`{{Dash?.TLaesingRequest}}`)
- Bookings count (`{{Dash?.TBooking}}`)
- Contracts count (`{{Dash?.TContract}}`)

**Property Status Breakdown:**
- Total Units, Occupied, Vacant (Ready), Vacant (Not Ready), Vacant (On Hold), Booked

**Contract Statistics:**
- New Contracts (`{{Dash?.TNewContract}}`)
- Renewed Contracts (`{{Dash?.TRenewedContract}}`)
- Under Renewal (`{{Dash?.TExpAndRenewal}}`)
- Expiring in 30 Days (`{{Dash?.TNearToExpiry}}`)
- Expired Contracts (`{{Dash?.TExpiredContract}}`)
- Under Notice (`{{Dash?.TUnderNoticeCont}}`)

---

### 5.2 Property Management

#### Projects
- Project-level management (grouping of properties)

#### Properties
- Individual property listings with details
- Connected user tracking
- Unit status filtering
- Occupancy ratio per property

#### Units
- Per-unit management with rich data model:
  - `UnitModel`, `UnitNo`, `BlockName`, `LayoutName`
  - Occupancy tracking: Occupied, Booked, Vacant, Total
  - **Occupancy Ratio** percentage calculation
  - Unit use types (Residential/Commercial)
  - Filterable by status: All, Units, Occupied, Vacant
- Non-rentable unit exclusion from occupancy calculations

#### Lessor
- Lessor/landlord management
- Redesigned landlord interface (v2.38.6)

---

### 5.3 CRM (Customer Relationship Management)

#### Leads
- Lead capture and tracking pipeline
- Integration with downstream leasing workflow

#### Leasing Request
- Formal leasing request creation from leads
- Quote generation with:
  - Requested Rent (`ReqREnt`)
  - Commission (`ReqComsn`)
  - Security Deposit (`ReqSecDpst`)
  - Management Fee (`ReqMngmntFee`)
  - Installments (`ReqInstl`)
  - Free Days (`ReqFreeDays`)
  - Special Terms and Conditions
  - Remarks field
- **Quotation Letter Generation** — Formal quote document with:
  - Property type and use description
  - Commission cheque recipient info
  - Approved renewal rent details
  - Company branding and signature block

#### Booking
- Booking creation with property/unit selection
- Booking info with detailed financial terms
- Unit model selection with availability check
- Document proof uploads
- Special terms and conditions

---

### 5.4 Accounts

#### Collection
- **Daily Collection Data** management (`Finance/GetDailyCollectionData`)
- Collection status updates (`Finance/UpdateDailyCollectionData`)
- Cheque management:
  - Cheque number tracking
  - Cheque status updates (deposited, held, bounced, etc.)
  - **Cheque Hold Request** with reason capture
- Payment schedule image upload (`Finance/UploadPaymntscheduleAcctImage`)
- Multiple payment modes supported (cheque, other modes)

#### Bank Deposit
- Deposit status tracking and updates
- Cheque deposit confirmation workflows
- Multi-mode deposit support

---

### 5.5 People Management

#### Tenants
- Tenant profiles with full detail management
- Document proof storage
- Address management
- Tenant portal access

#### Agents
- Agent profiles (`AgentDetails?.PartyName`)
- Document proof management

#### Property Admin
- Property administrator management

#### Facilitators
- Facilitator profiles (`FacilityDetails?.PartyName`)
- Document proof uploads
- Address management

---

### 5.6 Contracts
- Full contract lifecycle management
- Contract numbering (e.g., `ASIC-2020-0000673`)
- Contract value tracking
- **Digital Lease Agreement** creation
- Contract signing workflow (*"You have successfully signed the contract"*)
- Payment Schedule signing (*"You have successfully signed the Payment Schedule"*)
- **Special Request for Contract Release** functionality

---

### 5.7 Renewals
- Automated lease renewal workflows
- **Renewal Decision** tracking:
  - Renewal decision by tenant
  - Termination informed date
  - Reason for non-renewal
  - Remarks
- **Renewal Rent Proposal** with layout and unit details
- Management-approved renewal rent tracking

---

### 5.8 Approvals
- Multi-level approval workflow
- Approval data showing unit use type and model
- **Quote Approval** workflow (`Approve Quote`)
- Notification-based approval alerts (fixed in v2.38.5)

---

### 5.9 Legal
- **Legal Proceedings** referral system
- "Under Legal Proceeding" confirmation workflow
- **Hearing Notes** with history tracking
- Legal case management

---

### 5.10 Maintenance
- **Priority-based ticket system**: Normal, Medium, High, Emergency
- **Assignment** system (priority or assign-to workflows)
- **Remarks system** per request:
  - User name, posted timestamp, remark text
- **Feedback** collection:
  - Feedback description, created by
  - Reason tracking
- **Reschedule functionality**:
  - Reschedule history with previous dates/times
  - New scheduled date/time
  - Reason for rescheduling
- Image upload for maintenance requests

---

### 5.11 Inspection

#### Move-In
- Move-in inspection workflow
- Image capture (before/after)
- Summary reports (added v2.44.5)

#### Move-Out
- Move-out inspection workflow
- **Move-out Declined** with reason
- **Reason for Rejection** capture
- Image capture
- Summary reports

---

### 5.12 Direct Debit
- **Direct Debit Mandate Creation** workflow
- Credential management requirement
- Validation: First installment due date must be 3+ days ahead
- Covers: Rent installment, VAT on rent, Security deposit
- Success/failure messaging
- Error message display for failed mandates

---

### 5.13 Mail Box
- **Email Communication** system
- Inbox view: Date, email/from address, subject
- Sent view: Date, to address, subject
- Pagination (6 pages visible)
- Message detail view:
  - Subject, Content, Attachments, Sent By, Sent Status
- "No Messages" empty state

---

### 5.14 Reports
- Report generation module
- **Contract Report** (added v2.38.5)
- Likely includes financial, occupancy, and performance reports

---

### 5.15 Settings / Master Settings
- **Functional Modules** configuration
- **Role Management** with display names
- **App Settings** (general configuration)
- **User Management**
- **Profile Management**
- **Theme Toggle** (light/dark mode)

---

### 5.16 Notifications
- Push notification support (GCM/FCM, sender ID: `865435990924`)
- In-app notification center
- Property/unit-level notifications with CRM reference numbers
- Empty state: *"You have no notifications right now. Come back later"*

---

### 5.17 Holidays & Notes (Calendar)
- **Holiday** tracking with date and description
- **Notes** with date and content
- Calendar/date-based views

---

### 5.18 Workboard
- Dedicated workboard section (likely Kanban-style task board)

---

## 6. Dashboard & Analytics

### Financial Overview Cards
| Metric | Data Source |
|---|---|
| Total Contract Value | `Dash?.TConValue` |
| Unrealised Collection | `Dash?.TUnrealiseCol` |
| Estimated Full Occupancy Collection | `Dash?.TEstCol` |

### Occupancy Analytics
- Total occupancy percentage visualization
- Property-level breakdown with per-property stats

### CRM Funnel
- Leads → Leasing Requests → Bookings → Contracts pipeline visualization

### Contract Lifecycle
- 6 contract status categories tracked in real-time

---

## 7. UI/UX Analysis

### Design System
| Element | Implementation |
|---|---|
| **Color Scheme** | Angular Material Deep Purple & Amber theme (`#673ab7`, `#ffd740`) |
| **Typography** | Inter + Open Sans (Google Fonts), Roboto (Material default) |
| **Components** | Angular Material + Bootstrap hybrid |
| **Responsive** | Mobile-first with `max-scale=1, user-scalable=0` |
| **Theming** | Light/Dark mode toggle via CSS class swapping |
| **Icons** | Custom SVG app icon (`REA-appicon.svg`) |

### UX Patterns
- **Sidebar navigation** (collapsible, with submenu dropdowns)
- **Breadcrumb navigation** for deep page context
- **Modal dialogs** for confirmations and data entry
- **Empty states** with helpful messaging
- **Image lightbox** with zoom, rotate, and download
- **File upload** with drag-and-drop support
- **Pagination** for list views
- **Real-time reconnection** handling (*"You are being reconnecting, please wait..."*)

### Observations
> [!WARNING]
> - The viewport meta tag has `user-scalable=0`, which is an **accessibility concern** — it prevents pinch-to-zoom
> - Mixing jQuery 3.6.0 with Angular is unusual and may cause DOM manipulation conflicts
> - The `setTheme()` function replaces the entire `className` on `<html>`, which could conflict with Angular Material classes

---

## 8. Mobile App & Cross-Platform

### iOS App
| Detail | Value |
|---|---|
| **App Store ID** | 6472250265 |
| **Developer** | Realestate App Tech Limited |
| **Category** | Utilities |
| **Size** | 134.1 MB |
| **Min iOS** | 16.6 |
| **Language** | English |
| **Age Rating** | 4+ |
| **Price** | Free |
| **Privacy** | "Data Not Collected" |

### Android App
| Detail | Value |
|---|---|
| **Package** | `ae.softspace.realestateapp` |
| **Developer** | Realestate App |
| **Support Email** | apps@realestateapp.ae |

### Version History (Recent)
| Version | Date | Key Changes |
|---|---|---|
| 2.44.9 | Apr 2, 2026 | Bug fixes, UI enhancements |
| 2.44.8 | Mar 18, 2026 | Hot fixes |
| 2.44.5 | Feb 26, 2026 | Move-in/Move-out summary |
| 2.42.0 | Dec 18, 2025 | Migrated contracts in dashboard, connected users, unit status filter |
| 2.39.0 | Sep 9, 2025 | Move-In & Move-Out feature launch |
| 2.38.6 | Aug 1, 2025 | Redesigned landlord interface |
| 2.38.4 | Jul 21, 2025 | Approvals + Maintenance module changes |

---

## 9. Third-Party Integrations

| Integration | Purpose | Evidence |
|---|---|---|
| **Google Maps API** | Property location mapping | API key: `AIzaSyCxHosrEIl1N6Ehpzxe-7DqTJudBkzqqiE` |
| **Firebase/GCM** | Push notifications | GCM Sender ID: `865435990924` |
| **Ejari** | Dubai lease registration | Mentioned in app description |
| **Direct Debit** | Automated rent collection | Dedicated module with mandate creation |

---

## 10. Security Assessment

### Findings

> [!CAUTION]
> **Google Maps API Key Exposed in HTML Source**  
> The API key `AIzaSyCxHosrEIl1N6Ehpzxe-7DqTJudBkzqqiE` is hardcoded in the `<head>` of `index.html`. This is common for Maps API but should be restricted by HTTP referrer in the Google Cloud Console.

> [!WARNING]
> **JavaScript Source Maps Available**  
> Source map files (`.js.map`) are referenced and likely accessible, which could expose the full original source code including service implementations, API endpoints, and business logic.

> [!NOTE]
> **Token-Based Authentication**  
> The `AsicoService.UpdateToken()` pattern suggests JWT or similar token refresh. The token is passed via `AuthhttpOptions` headers on API calls — standard practice.

### Positive Security Features
- Password change requires current password confirmation
- Role-based access control with configurable functional modules
- 401 unauthorized handling with user-friendly error page
- Document-level access control for sensitive files
- App Store privacy declaration: "Data Not Collected"

---

## 11. Performance Analysis

### Build Optimization
- ✅ **Code splitting** — 10 lazy-loaded chunks for reduced initial bundle
- ✅ **Module preloading** — All chunks preloaded via `<link rel="modulepreload">`
- ✅ **Modern ES modules** — `type="module"` for main.js and polyfills
- ✅ **Deferred scripts** — `scripts.js` loaded with `defer`

### Concerns
- ⚠️ **jQuery loaded alongside Angular** — Adds ~90KB unnecessary payload
- ⚠️ **Bootstrap CSS + JS loaded fully** — Could be tree-shaken if using Angular Material
- ⚠️ **Google Maps loaded eagerly** — Loaded on every page even when not needed
- ⚠️ **Large CSS file** — `styles.css` is ~592KB (23,469 lines), contains full Angular Material theme

---

## 12. Observations & Recommendations

### Strengths ✅
1. **Comprehensive feature set** — Covers the entire property management lifecycle
2. **UAE market-specific** — Ejari integration, AED currency, Dubai-centric design
3. **Multi-platform** — Web + iOS + Android with consistent experience
4. **Active development** — Frequent releases (25+ versions in last year)
5. **Role-based security** — Granular access control
6. **Digital contracts** — E-signing capabilities
7. **Direct debit integration** — Automated rent collection
8. **PWA support** — Push notifications, installable
9. **Dark/Light theme** — User preference support
10. **Image management** — Lightbox with zoom, rotate, download

### Areas for Improvement ⚠️

| Area | Issue | Recommendation |
|---|---|---|
| **Security** | Google Maps API key exposed | Add HTTP referrer restrictions in GCP Console |
| **Security** | Source maps accessible in production | Disable source maps for production builds |
| **Performance** | jQuery loaded alongside Angular | Remove jQuery dependency; use Angular's native DOM API |
| **Performance** | Bootstrap + Angular Material redundancy | Choose one UI framework to reduce bundle size |
| **Performance** | Eager Google Maps loading | Lazy-load Maps API only on pages that need it |
| **Performance** | 592KB CSS file | Purge unused styles; consider CSS modules |
| **Accessibility** | `user-scalable=0` | Remove to allow pinch-to-zoom for accessibility compliance |
| **SEO** | SPA without SSR | Consider Angular Universal for SEO-critical pages |
| **UX** | Typo in sidebar — "Maintanance" | Fix spelling to "Maintenance" |
| **UX** | No offline support despite PWA manifest | Implement service worker for offline capabilities |
| **Privacy** | App Store says "Data Not Collected" | Verify accuracy — the app clearly processes tenant PII |
| **API** | Finance API on separate endpoint | Ensure consistent auth and rate limiting across microservices |

### Missing / Could Not Verify
- Exact API endpoints and backend technology (likely .NET based on naming conventions)
- Database technology
- Actual Ejari integration flow
- Payment gateway details for direct debit
- Tenant portal separate from admin portal
- Report types and export formats
- Workboard functionality details

---

## Summary

**RealEstateApp.ae** is a mature, feature-rich property management platform that covers the full leasing lifecycle for UAE-based real estate companies. Built on Angular with Material Design, it provides **16+ distinct functional modules** spanning property management, CRM, contracts, finance, maintenance, inspections, and legal proceedings. The application is actively maintained with frequent releases and is available across web, iOS, and Android platforms.

The main areas for improvement center around **performance optimization** (removing jQuery/Bootstrap redundancy), **security hardening** (source maps, API key restrictions), and **accessibility compliance** (zoom restrictions). The core business functionality appears comprehensive and well-structured for its target market.

---

*Report generated by analyzing the application's HTML structure, JavaScript bundles, CSS stylesheets, App Store/Play Store listings, and public-facing assets.*
