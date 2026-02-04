import { httpClient } from "../../../shared/api/httpClient";
import type {
  ChangePasswordRequestDto,
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "../types";

export const profileApi = {
  getProfile: () => httpClient<ProfileResponseDto>("/users/me"),
  updateProfile: (payload: UpdateProfileRequestDto) =>
    httpClient<ProfileResponseDto>("/users/me", {
      method: "PUT",
      body: payload,
    }),
  changePassword: (payload: ChangePasswordRequestDto) =>
    httpClient<{ ok: boolean }>("/users/me/password", {
      method: "POST",
      body: payload,
    }),
};
