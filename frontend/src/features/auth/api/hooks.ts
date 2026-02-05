import { useMutation } from "@tanstack/react-query";
import { authApi } from "./authApi";
import type { LoginRequestDto, RegisterRequestDto } from "../types";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (body: LoginRequestDto) => authApi.login(body),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (body: RegisterRequestDto) => authApi.register(body),
  });
}

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: () => authApi.googleLogin(),
  });
}
