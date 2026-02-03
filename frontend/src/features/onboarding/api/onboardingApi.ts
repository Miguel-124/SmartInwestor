import { httpClient } from "../../../shared/api/httpClient";
import type {
  OnboardingSubmitRequestDto,
  OnboardingSubmitResponseDto,
} from "../types";

export const onboardingApi = {
  submit: (payload: OnboardingSubmitRequestDto) =>
    httpClient<OnboardingSubmitResponseDto>("/onboarding", {
      method: "POST",
      body: payload,
    }),
};
