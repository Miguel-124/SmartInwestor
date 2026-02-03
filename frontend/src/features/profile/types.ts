export type RiskProfile = "conservative" | "balanced" | "aggressive";

export type ProfileResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // ISO
  birthDate?: string | null; // ISO: YYYY-MM-DD
  riskProfile?: RiskProfile | null;
  acceptRisk?: boolean | null;
};

export type ProfileModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  birthDate?: string;
  riskProfile?: RiskProfile;
  acceptRisk?: boolean;
};

export type UpdateProfileRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  riskProfile: RiskProfile;
  acceptRisk: boolean;
};
