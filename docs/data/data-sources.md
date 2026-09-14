# CredNexus Statutory Data Sources & Ingestion Standards

CredNexus ingests, structures, and updates data from sovereign apex corporations and public bodies under the Ministry of Social Justice and Empowerment (MoSJE), Ministry of Finance, and state departments.

---

## 1. Statutory Corporations & Portals

### 1.1 National Backward Classes Finance & Development Corporation (NBCFDC)
- **Apex Entity**: MoSJE, Government of India
- **Key Programs Ingested**:
  - Micro Finance Scheme (Direct to SHGs and individuals)
  - General Term Loan Scheme (Micro and small enterprise capitalization)
  - Education Loan Scheme (Domestic and overseas professional studies)
- **Primary Delivery Channel**: State Channelising Agencies (SCAs), Regional Rural Banks (RRBs), and Public Sector Banks (PSBs).

### 1.2 National Safai Karamcharis Finance & Development Corporation (NSKFDC)
- **Apex Entity**: MoSJE, Government of India
- **Key Programs Ingested**:
  - Green Business & Sanitation Equipment Scheme (Swachhta Udyami Yojana)
- **Special Provisions**: Concessional rates up to 4% - 6% with capital subsidy allowances for mechanized cleaning equipment.

### 1.3 Pradhan Mantri MUDRA Yojana (PMMY) & Stand-Up India
- **Apex Entities**: Department of Financial Services (DFS), SIDBI, Government of India
- **Key Programs Ingested**:
  - MUDRA Kishore (₹50,000 to ₹5,00,000)
  - Stand-Up India (₹10,00,000 to ₹1,00,00,000 for SC/ST/Women entrepreneurs)

---

## 2. Ingestion & Audit Pipeline
1. **Automated Hash Checking**: Seed files are fingerprinted using SHA-256 upon boot and ingestion.
2. **Strict Typings**: Validated against TypeScript interfaces in `apps/web/lib/types/index.ts`.
3. **Data Freshness Tracker**: Displayed to beneficiaries across all matching, calculator, and scheme detail views to maintain absolute transparency.
