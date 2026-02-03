export type OnboardingRiskProfile = "conservative" | "balanced" | "aggressive";

export type OnboardingSubmitRequestDto = {
  birthDate: string; // ISO: YYYY-MM-DD
  riskProfile: OnboardingRiskProfile;
  acceptRisk: boolean;
};

export type OnboardingSubmitResponseDto = {
  status: "ok";
};
