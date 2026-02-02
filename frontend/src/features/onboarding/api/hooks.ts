import { useMutation } from "@tanstack/react-query";
import { onboardingApi } from "./onboardingApi";

export function useSubmitOnboardingMutation() {
  return useMutation({
    mutationFn: onboardingApi.submit,
  });
}
