# CredNexus — Environment & External Services Configuration

This document specifies every external dependency, configuration variable, and operational requirement for the CredNexus platform.

---

## 1. Environment Variable Matrix

| Variable | Required | Public / Secret | Used For | Where to Obtain | Local Dev Default | Vercel Production Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes (Prod)** / Optional (Dev) | Secret | PostgreSQL persistence for NSFDC schemes, partners, and ingestion audit logs | Vercel Postgres, Neon, Supabase, or AWS RDS | Empty (falls back to snapshot) | **Required** in Project Settings |
| `CRON_SECRET` | **Yes (Prod)** / Optional (Dev) | Secret | Authentication token for scheduled Vercel Cron scraper endpoint (`/api/admin/sync`) | Generate locally: `openssl rand -hex 32` | Optional | **Required** in Project Settings |
| `ADMIN_SECRET_KEY` | Recommended | Secret | Admin portal authentication for manual ingestion triggers | Set secure random string | Optional | Recommended |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Public | Base application URL for canonical metadata and navigation links | Application domain | `http://localhost:3000` | `https://cred-nexus-web-3b9n-five.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | Optional | Public | Display name for header and SEO metadata | User choice | `CredNexus` | `CredNexus` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Optional | Public | Fallback locale code | Pre-set | `en` | `en` |
| `NEXT_PUBLIC_MAP_DEFAULT_LAT` | Optional | Public | Initial center latitude for Indian map | Pre-set | `20.5937` | `20.5937` |
| `NEXT_PUBLIC_MAP_DEFAULT_LNG` | Optional | Public | Initial center longitude for Indian map | Pre-set | `78.9629` | `78.9629` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **No** (Optional) | Public | Optional Google Maps JS SDK integration | Google Cloud Console | None | Optional |

---

## 2. Zero-Key Operational Architecture

To guarantee reliability, avoid vendor lock-in, and eliminate billing dependencies:

1. **In-App Interactive Mapping**:
   - Provider: **OpenStreetMap** tile servers with **Leaflet**.
   - API Key Required: **None** (100% free open-source mapping with attribution).
2. **Turn-by-Turn Routing**:
   - Provider: **OSRM (Open Source Routing Machine)** public routing endpoint.
   - API Key Required: **None** (rate-limited and cached).
3. **Turn-by-Turn Phone Navigation ("Start Navigation")**:
   - Provider: **Native Google Maps mobile deep-linking**.
   - Syntax: `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${partnerLat},${partnerLng}&travelmode=driving`
   - API Key Required: **None** (runs natively on Android and iOS).
4. **Address Geocoding**:
   - Provider: **Nominatim OpenStreetMap**.
   - API Key Required: **None** (uses custom `User-Agent: CredNexus-SIH2026/1.0` with strict 1 req/sec rate limiting and address-hash caching).
5. **NSFDC Source Scraper**:
   - Provider: Direct HTTPS ingestion from `https://nsfdc.nic.in`.
   - API Key Required: **None** (public government portal).

---

## 3. Pre-Flight Developer Checklist

### Step 1: Local Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd CredNexus
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify tests and build without database:
   ```bash
   npm test
   npm run build
   ```

### Step 2: Database Setup (For Live Scraper Writes)
1. Create a free PostgreSQL database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres.
2. Add your connection string to `.env.local`:
   ```bash
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```
3. Initialize the database schema:
   ```bash
   node scripts/init-db.mjs
   ```

### Step 3: Vercel Production Deployment
1. Go to **Vercel Dashboard → Project Settings → Environment Variables**.
2. Add:
   - `DATABASE_URL` = `<your-postgres-url>`
   - `CRON_SECRET` = `<your-generated-secret>`
   - `NEXT_PUBLIC_APP_URL` = `https://cred-nexus-web-3b9n-five.vercel.app`
3. Verify the deployment build succeeds.
