import { httpClient } from "../../../shared/api/httpClient";
import type { ProfileResponseDto, UpdateProfileRequestDto } from "../types";

export const profileApi = {
  getProfile: () => httpClient<ProfileResponseDto>("/users/me"),
  updateProfile: (payload: UpdateProfileRequestDto) =>
    httpClient<ProfileResponseDto>("/users/me", {
      method: "PUT",
      body: payload,
    }),
};
