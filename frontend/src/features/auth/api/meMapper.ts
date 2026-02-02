import type { MeModel, MeResponseDto } from "../types";

export function mapMe(dto: MeResponseDto): MeModel {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    createdAt: new Date(dto.createdAt),
  };
}
