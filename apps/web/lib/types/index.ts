export type SchemeCategory = 
  | 'microfinance' 
  | 'term_loan' 
  | 'education' 
  | 'business' 
  | 'green_sanitation';

export type VerificationStatus = 
  | 'VERIFIED' 
  | 'DEMO_ILLUSTRATIVE' 
  | 'EXTERNAL_SYNC';

export interface Scheme {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: SchemeCategory;
  tagline: string;
  description: string;
  objective: string;
  targetGroup: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRateMin: number;
  interestRateMax: number;
  femaleInterestConcession?: number;
  tenureMinMonths: number;
  tenureMaxMonths: number;
  moratoriumMinMonths: number;
  moratoriumMaxMonths: number;
  coveragePercent: number;
  maxAnnualIncome: number; // 0 if no ceiling
  targetBeneficiaries: string[]; // e.g. ["Backward Classes", "Women", "Sanitation Workers"]
  eligibleActivities: string[];
  requiredDocuments: string[];
  eligiblePartnerTypes: ('SCA' | 'PSB' | 'RRB' | 'NBFC_MFI')[];
  source: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  lastVerified: string;
  features: string[];
}

export type PartnerType = 'SCA' | 'PSB' | 'RRB' | 'NBFC_MFI';

export interface ChannelPartner {
  id: string;
  code: string;
  name: string;
  type: PartnerType;
  typeLabel: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  supportedCategories: SchemeCategory[];
  supportedSchemeCodes: string[];
  operationalStatus: 'ACTIVE' | 'LIMITED' | 'INACTIVE';
  fundUtilizationRatePercent: number;
  npaRiskStatus: 'LOW' | 'MEDIUM' | 'HIGH';
  verificationStatus: VerificationStatus;
  lastVerified: string;
  notes?: string;
}

export interface RecommenderInput {
  purpose: SchemeCategory | 'any';
  projectCost: number;
  annualIncome: number;
  applicantCategory: string; // e.g. "OBC", "SC/ST", "General", "Minority"
  isFemale: boolean;
  educationLevel?: string;
  state?: string;
  district?: string;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number; // 0 - 100
  isEligible: boolean;
  suitability: 'High' | 'Moderate' | 'Low' | 'Ineligible';
  matchedReasons: string[];
  unmetCriteria: string[];
  caveats: string[];
  calculatedIndicativeEMI?: number;
}

export interface CalculatorInput {
  principal: number;
  interestRatePercent: number; // annual
  tenureMonths: number;
  moratoriumMonths: number;
  capitalizeMoratoriumInterest?: boolean;
}

export interface AmortizationRow {
  month: number;
  isMoratorium: boolean;
  openingBalance: number;
  interestPaid: number;
  principalPaid: number;
  totalInstallment: number;
  closingBalance: number;
}

export interface CalculatorResult {
  principal: number;
  interestRatePercent: number;
  tenureMonths: number;
  moratoriumMonths: number;
  regularMonthlyEMI: number;
  moratoriumMonthlyInterest: number;
  totalInterestPaid: number;
  totalRepayment: number;
  schedule: AmortizationRow[];
  notes: string[];
}

export interface PartnerRoutingCriteria {
  userLat?: number;
  userLng?: number;
  selectedState?: string;
  selectedDistrict?: string;
  schemeCode?: string;
  category?: SchemeCategory;
  maxDistanceKm?: number;
}

export interface PartnerRoutingResult {
  partner: ChannelPartner;
  distanceKm: number;
  routingScore: number;
  isCompatible: boolean;
  reasons: string[];
  statusLabel: 'Recommended' | 'Available' | 'Limited Availability' | 'Restricted';
}

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'READY_TO_APPLY' 
  | 'GUIDED_TO_PARTNER' 
  | 'SUBMITTED_DEMO' 
  | 'UNDER_REVIEW_DEMO' 
  | 'APPROVED_DEMO';

export interface UserApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  partnerId?: string;
  partnerName?: string;
  projectAmount: number;
  purpose: string;
  status: ApplicationStatus;
  statusNotes: string;
  createdAt: string;
  updatedAt: string;
  requiredDocuments: { name: string; uploaded: boolean }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  state: string;
  district: string;
  category: string;
  annualIncome: number;
  savedSchemeIds: string[];
}
