import { httpClient } from "../../../shared/api/httpClient";
import type { MeResponseDto } from "../types";

export const meApi = {
  getMe: () => httpClient<MeResponseDto>("/api/users/me"),
};
