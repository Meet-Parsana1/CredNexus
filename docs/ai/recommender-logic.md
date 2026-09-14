# Deterministic Scheme Recommender & Safety Specification

**Product**: CredNexus  
**SIH 2026 Initiative** — Team Brainwired  

---

## 1. Safety Directive: Zero Hallucinated Financial Rules

CredNexus strictly prohibits probabilistic language models from inventing financial limits, interest rates, or government policies. 

### Architecture
- **Rules Engine**: Deterministic evaluator in TypeScript (`lib/engines/recommender.ts`).
- **AI Role**: Natural language explanation, intent routing, and linguistic translation assistance.

---

## 2. 6-Dimension Scoring Formula

Every candidate scheme receives a score $S \in [0, 100]$:

\[
S = W_{\text{purpose}} + W_{\text{amount}} + W_{\text{income}} + W_{\text{category}} + W_{\text{concession}}
\]

1. **Purpose Alignment ($W_{\text{purpose}} \le 30$)**:
   - Exact category match (e.g. `microfinance` == `microfinance`): 30 pts
   - Close enterprise alignment (`business` / `term_loan`): 20 pts
   - Unaligned sector: 5 pts
2. **Amount Feasibility ($W_{\text{amount}} \le 25$)**:
   - Inside $[\text{minLoanAmount}, \text{maxLoanAmount}]$: 25 pts
   - Under minimum threshold: 10 pts
   - Exceeding ceiling: 5 pts (marks scheme `isEligible = false`)
3. **Statutory Income Ceiling ($W_{\text{income}} \le 20$)**:
   - Income $\le \text{maxAnnualIncome}$ (or no ceiling): 20 pts
   - Exceeding ceiling: 0 pts (marks scheme `isEligible = false`)
4. **Target Beneficiary Classification ($W_{\text{category}} \le 15$)**:
   - Verified target community (OBC/EBC, SC/ST, Women): 15 pts
   - General / Conditional: 5 pts
5. **Gender & Concessional Benefit ($W_{\text{concession}} \le 10$)**:
   - Female applicant concession: 10 pts
   - Standard borrower: 8 pts
