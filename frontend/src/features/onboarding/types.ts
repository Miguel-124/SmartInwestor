export type OnboardingRiskProfile = "conservative" | "balanced" | "aggressive";

export type OnboardingSubmitRequestDto = {
  birthDate: string;
  riskProfile: OnboardingRiskProfile;
  acceptRisk: boolean;
};

export type OnboardingSubmitResponseDto = {
  status: "ok";
};
