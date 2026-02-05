import { httpClient } from "../../../shared/api/httpClient";
import type {
  ChangePasswordRequestDto,
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "../types";

export const profileApi = {
  getProfile: () => httpClient<ProfileResponseDto>("/api/users/me"),
  updateProfile: (payload: UpdateProfileRequestDto) =>
    httpClient<ProfileResponseDto>("/api/users/me", {
      method: "PUT",
      body: payload,
    }),
  changePassword: (payload: ChangePasswordRequestDto) =>
    httpClient<{ ok: boolean }>("/api/users/me/password", {
      method: "POST",
      body: payload,
    }),
};
