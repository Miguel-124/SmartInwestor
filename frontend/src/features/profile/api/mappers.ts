import type { ProfileModel, ProfileResponseDto } from "../types";

function normalizeOptional<T>(value: T | null | undefined) {
  return value ?? undefined;
}

export function mapProfile(dto: ProfileResponseDto): ProfileModel {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    createdAt: new Date(dto.createdAt),
    birthDate: normalizeOptional(dto.birthDate),
    riskProfile: normalizeOptional(dto.riskProfile),
    acceptRisk: normalizeOptional(dto.acceptRisk),
  };
}
