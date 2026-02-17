export type InvestorRole = 'investor' | 'admin';
export type EntityType = 'individual' | 'family_office' | 'institution' | 'esg_fund';

export interface Investor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: InvestorRole;
}

export interface AuthState {
  token: string | null;
  investor: Investor | null;
}

export interface Holdings {
  walletAddress: string;
  tokenBalance: number;
  goldGrams: number;
  pricePerGramEur: number;
  currentValueEur: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  transactionHash: string | null;
  type: string;
  tokenAmount: number;
  goldGrams: number;
  pricePerToken: number;
  totalCost: number;
  currency: string;
  transactionDate: string;
  status: string;
}

export interface TaxLot {
  id: string;
  lotNumber: string;
  acquisitionDate: string;
  tokensRemaining: number;
  costBasisPerToken: number;
  totalCostBasis: number;
  unrealizedGainLoss: number;
  holdingPeriodType: string;
  jurisdiction: string;
}

export interface TaxSummary {
  lotCount: number;
  totalCostBasis: number;
  totalTokens: number;
  totalUnrealizedGainLoss: number;
}

export interface EsgMetrics {
  totalRecycledGoldGrams: number;
  forestSavedHectares: number;
  mercuryAvoidedKg: number;
  soilErosionAvoidedM3: number;
  environmentalCostSavedEur: number;
  sustainabilityScore: number;
  lastCalculated: string;
}

export interface PortfolioSnapshot {
  snapshotDate: string;
  tokenBalance: number;
  portfolioValueEur: number;
}
