import type { CurrencyCode } from "../../shared/types/currency";

export type RiskProfile = "conservative" | "balanced" | "aggressive";

export type ProfileResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  birthDate?: string | null;
  riskProfile?: RiskProfile | null;
  acceptRisk?: boolean | null;
  baseCurrency?: CurrencyCode | null;
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
  baseCurrency?: CurrencyCode;
};

export type UpdateProfileRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  riskProfile: RiskProfile;
  acceptRisk: boolean;
  baseCurrency: CurrencyCode;
};

export type ChangePasswordRequestDto = {
  currentPassword: string;
  newPassword: string;
};
