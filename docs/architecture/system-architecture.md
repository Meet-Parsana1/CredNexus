# System Architecture & Technical Specifications

**Product**: CredNexus  
**Initiative**: Smart India Hackathon (SIH) 2026  
**Team**: Brainwired  

---

## 1. Architectural Philosophy: "Trust-First Minimal Fintech"

CredNexus is architected to address systemic failures in government financial inclusion:
- **Information Asymmetry**: Beneficiaries cannot distinguish microfinance (&le; ₹1.40L) from commercial term loans (&le; ₹50L).
- **Hidden Moratorium Mechanics**: Lack of mathematical clarity regarding repayment during grace periods.
- **Routing Inefficiency**: Borrowers approaching unaccredited bank branches without knowledge of designated Channel Partner desks.

---

## 2. Multi-Tier Application Structure

```
[ Beneficiary / Student / Admin ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│                   Next.js 14+ Client                   │
│  - Tailwind CSS with Deep Navy & Royal Blue Tokens     │
│  - 12 Languages i18n Context + Urdu BiDi RTL           │
│  - Interactive OpenStreetMap / Leaflet Engine          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           Modular Calculation & Business Engines       │
│  - Deterministic 6-Dimension Scheme Recommender        │
│  - Reducing Balance EMI & Moratorium Math Engine       │
│  - Multi-Factor Geo-Spatial Channel Partner Router     │
│  - Offline / Local Deterministic AI Assistant          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               Data Verification & Sync Layer           │
│  - Seeded Official Records (NBCFDC, NSKFDC, PMMY, SUI) │
│  - Channel Partner Registry (SCA, PSB, RRB, NBFC-MFI)  │
│  - Snapshot Hashing & Parity Drift Detection Engine    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Financial Calculation Specifications

### Equated Monthly Installment (EMI) Formula
\[
\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}
\]
Where:
- $P$: Loan principal in INR.
- $r$: Monthly interest rate $\left(\frac{\text{Annual Rate}}{12 \times 100}\right)$.
- $n$: Number of active repayment months post-moratorium.

### Moratorium Behavior
- During moratorium period ($1 \le m \le M$), principal is deferred.
- Simple interest is serviced monthly: $\text{Interest}_m = P \times r$.
- Repayment period post-moratorium is $n = \text{Tenure} - M$.
