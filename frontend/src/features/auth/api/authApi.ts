import { httpClient } from "../../../shared/api/httpClient";
import type {
  LoginRequestDto,
  LoginResponseDto,
  GoogleLoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from "../types";

export const authApi = {
  login: (body: LoginRequestDto) =>
    httpClient<LoginResponseDto>("/api/auth/login", { method: "POST", body }),

  register: (body: RegisterRequestDto) =>
    httpClient<RegisterResponseDto>("/api/auth/register", {
      method: "POST",
      body,
    }),

  googleLogin: () =>
    httpClient<GoogleLoginResponseDto>("/api/auth/google", {
      method: "POST",
    }),
};
