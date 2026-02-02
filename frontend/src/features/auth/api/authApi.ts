import { httpClient } from "../../../shared/api/httpClient";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from "../types";

export const authApi = {
  login: (body: LoginRequestDto) =>
    httpClient<LoginResponseDto>("/auth/login", { method: "POST", body }),

  register: (body: RegisterRequestDto) =>
    httpClient<RegisterResponseDto>("/auth/register", { method: "POST", body }),
};
