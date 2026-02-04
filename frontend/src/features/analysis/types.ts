import type { RiskProfile } from "../profile/types";

export type AnalysisRequestDto = {
  riskProfile: RiskProfile;
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    assets: Array<{
      symbol: string;
      name: string;
      value: number;
    }>;
  }>;
};
export type AnalysisResponseDto = {
  generatedAt: string;
  riskProfile: RiskProfile;
  totalValue: number;
  diversificationScore: number;
  alignmentScore: number;
  topExposures: Array<{
    name: string;
    value: number;
    percent: number;
  }>;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    severity: "info" | "warning" | "success";
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>;
  stressTests: Array<{
    id: string;
    scenario: string;
    impactPercent: number;
  }>;
};
