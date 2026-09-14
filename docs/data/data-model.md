# CredNexus Data Model Documentation

CredNexus is architected around a single, authoritative data core located in the top-level `data/` directory. This document outlines the schema, entities, and relationships powering the application.

---

## 1. Core Entities

### 1.1 Scheme (`data/schemes/schemes.json`)
Represents a statutory or central corporation concessional lending scheme (e.g., NBCFDC, NSKFDC, PMMY, Stand-Up India).

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `sch_nbcfdc_micro`) |
| `code` | `string` | Statutory scheme code (e.g., `NBCFDC-MFS-01`) |
| `name` | `string` | Full official name of scheme |
| `tagline` | `string` | Plain-language beneficiary summary |
| `category` | `SchemeCategory` | `microfinance`, `term_loan`, `education`, `business`, `green_sanitation` |
| `minLoanAmount` | `number` | Minimum loan size in INR |
| `maxLoanAmount` | `number` | Maximum loan ceiling in INR |
| `interestRateRange`| `{ min: number, max: number }` | Concessional interest rate percentage range |
| `tenureMonths` | `{ min: number, max: number }` | Repayment tenure range in months |
| `moratoriumMonths`| `number` | Repayment holiday period in months |
| `subsidyPercentage`| `number` (optional) | Capital or interest subsidy percentage |
| `eligibilityCriteria`| `EligibilityCriteria` | Target demographics, income ceilings, age limits |
| `requiredDocuments` | `string[]` | Mandatory KYC and certification documents |
| `isGovtSponsored` | `boolean` | Central / Corporation subsidy marker |
| `lastUpdated` | `string` | ISO timestamp of statutory data verification |

### 1.2 Channel Partner (`data/partners/partners.json`)
Represents an accredited intermediary delivering concessional funds directly to beneficiaries.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `prt_dl_sca_01`) |
| `code` | `string` | Institutional code |
| `name` | `string` | Full name of agency or bank branch |
| `type` | `PartnerType` | `SCA`, `PSB`, `RRB`, `NBFC_MFI` |
| `address` | `string` | Street address |
| `city` | `string` | City / Municipality |
| `district` | `string` | District |
| `state` | `string` | State or Union Territory |
| `pincode` | `string` | 6-digit postal code |
| `lat` | `number` | Latitude coordinate |
| `lng` | `number` | Longitude coordinate |
| `supportedCategories`| `SchemeCategory[]` | Categories serviced by partner |
| `supportedSchemeCodes`| `string[]` | Specific statutory scheme codes supported |
| `operationalStatus` | `string` | `ACTIVE`, `SUSPENDED`, `UNDER_REVIEW` |
| `fundUtilizationRatePercent`| `number` | Fund deployment efficiency metric |
| `npaRiskStatus` | `string` | Intermediary health risk: `LOW`, `MODERATE`, `HIGH` |
| `verificationStatus` | `string` | Verification stamp (`VERIFIED`) |

---

## 2. Authoritative Data Principles
1. **Single Source of Truth**: Data in `data/schemes/schemes.json` and `data/partners/partners.json` is the sole authoritative source.
2. **Service Layer Proxy**: Web pages and API route handlers interact with data via `lib/services/scheme.service.ts` and `lib/services/partner.service.ts`.
3. **Immutability & Audit**: Each update is timestamped and tracked through SHA-256 integrity verification.
