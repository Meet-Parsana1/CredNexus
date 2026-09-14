# CredNexus — Intelligent Concessional Scheme Matching & Channel Partner Router

**Smart India Hackathon (SIH) 2026**  
**Team**: Brainwired  
**Problem Statement**: AI-Driven Scheme Matching for Marginalized Entrepreneurs  

---

## 🌟 Overview

CredNexus is an intelligent, multilingual digital platform engineered to bridge marginalized entrepreneurs, students, and small enterprises with verified government concessional credit schemes (such as NBCFDC, NSFDC, NSKFDC, PMMY Mudra, Stand-Up India) and authorized Channel Partners (State Channelising Agencies [SCAs], Public Sector Banks [PSBs], Regional Rural Banks [RRBs], and NBFC-MFIs).

The platform transforms **"From Confusion → Confidence"** through four core capabilities:
1. **Smart Scheme Recommender**: Multi-step progressive disclosure wizard driven by deterministic 6-dimension scoring and AI-assisted rationale.
2. **Financial & Moratorium Calculator**: Mathematically verified reducing-balance EMI calculations with principal grace periods and full month-by-month amortization schedules.
3. **Geo-Spatial Partner Locator & Router**: Interactive OpenStreetMap/Leaflet mapping with multi-factor routing ranking (distance, partner type, scheme accreditation, operational status, and fund utilization capacity).
4. **12-Language Multilingual Digital Access**: Comprehensive localized interface and scheme data supporting 12 Scheduled Indian Languages with native Bidirectional RTL layout for Urdu.

---

## 🎨 Visual Design System

- **Primary Brand**: Deep Navy (`#0F2747`) — Trust, institutional authority, and stability.
- **Action & Interactive**: Royal Blue (`#1D4ED8`) — Technology, CTAs, and active states.
- **Eligibility & Success**: Emerald (`#15803D`) — Verified records, eligibility, and positive matches.
- **Opportunity & Highlight**: Saffron / Amber (`#F59E0B`) — Grace moratorium, attention items, and warnings.
- **Typography**: Inter (UI Workhorse), Manrope (Display Headlines), Noto Sans (Regional Fallback).
- **Logo System**: Clean, replaceable placeholder system (`<BrandLogo />` and SVG assets in `apps/web/public/logos/`).

---

## 🇮🇳 Supported Languages (12 Prototype Languages)

1. **English** (`en`)
2. **Hindi** (`hi` - हिन्दी)
3. **Gujarati** (`gu` - ગુજરાતી)
4. **Marathi** (`mr` - मराठी)
5. **Bengali** (`bn` - বাংলা)
6. **Urdu** (`ur` - اردو) — **Native Bidirectional RTL (`dir="rtl"`)**
7. **Telugu** (`te` - తెలుగు)
8. **Tamil** (`ta` - தமிழ்)
9. **Kannada** (`kn` - ಕನ್ನಡ)
10. **Malayalam** (`ml` - മലയാളം)
11. **Punjabi** (`pa` - ਪੰਜਾਬੀ)
12. **Odia** (`or` - ଓଡ଼ିଆ)

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js >= 18 (Tested on v24)
- npm >= 9

### 1. Install Dependencies
```bash
cd apps/web
npm install
```

### 2. Run Automated Test Suite
From the project root:
```bash
npm run test
```
*Tests verify EMI formulas, moratorium interest deferment, edge cases, and deterministic scheme matching.*

### 3. Run Development Server
```bash
cd apps/web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
cd apps/web
npm run build
npm run start
```

---

## 🔑 Demo Personas & Credentials (Zero External Setup Required)

CredNexus operates **100% reliably in demo mode without requiring third-party API keys or database servers**.

- **Beneficiary Persona**:
  - Name: `Ramesh Patel` (OBC Entrepreneur, Ahmedabad, Gujarat)
  - Pre-seeded Income: ₹3,80,000
  - Pre-seeded Saved Schemes & Active Guided Dossier
- **Admin Persona**:
  - Name: `Priya Sharma` (Statutory Scheme Officer)
  - Instant One-Click Demo Login on the `/login` page

---

## 📐 System Architecture & Directory Layout

```
CredNexus/
├── apps/
│   └── web/                         # Fullstack Next.js App Router Web Application
│       ├── app/
│       │   ├── page.tsx             # Homepage & interactive matching preview
│       │   ├── (auth)/              # /login, /register
│       │   ├── schemes/             # /schemes, /schemes/[id]
│       │   ├── recommend/           # 4-step Smart Scheme Wizard
│       │   ├── calculator/          # EMI & Moratorium Calculator
│       │   ├── partners/            # Geo-Spatial Leaflet Map & Partner Router
│       │   ├── eligibility/         # Standalone Transparent Rule Checker
│       │   ├── education/           # Domestic & Overseas Education Loans
│       │   ├── lending/             # 6-stage Beneficiary Journey Guide
│       │   ├── dashboard/           # User Dashboard, Saved Schemes, Applications
│       │   └── admin/               # Admin Metrics, Scheme CRUD, Partner Status, Sync
│       ├── components/              # UI primitives, layout, AI widget, maps
│       ├── lib/
│       │   ├── engines/             # calculator, recommender, partner-router
│       │   ├── data/                # Verified schemes & partners datasets
│       │   ├── i18n/                # 12 languages dictionary & RTL context
│       │   └── store/               # Local encrypted auth & persistence store
│       └── public/logos/            # Replaceable SVG logo system
├── data/
│   ├── schemes/                     # Source JSON database of schemes
│   └── partners/                    # Source JSON database of partners
├── tests/                           # Unit tests for calculations & matching
├── docs/                            # In-depth architectural & safety documentation
├── README.md
└── package.json
```

---

## 🛡️ Data Safety & Integrity Policy

1. **No Hallucinated Rules**: Every interest rate (e.g. 6.5% for NBCFDC Microfinance, 4.0% for female education loans), tenure, and income ceiling is strictly anchored in official government corporation releases.
2. **Transparent Freshness Badging**: Records display `VERIFIED` status alongside the date of last verification and official source links.
3. **No False Sanction Claims**: CredNexus guides beneficiaries and prepares structured dossiers; all credit is sanctioned by accredited Channel Partners under official mandates.

---

## 👥 Team Brainwired (SIH 2026)
Built with precision for the Smart India Hackathon 2026.
