import { http, HttpResponse } from "msw";
import { updateUser } from "../db/usersDb";

export const onboardingHandlers = [
  http.post("*/api/onboarding", async ({ request }) => {
    const body = (await request.json()) as {
      birthDate: string;
      riskProfile: "conservative" | "balanced" | "aggressive";
      acceptRisk: boolean;
    };

    updateUser({
      birthDate: body.birthDate,
      riskProfile: body.riskProfile,
      acceptRisk: body.acceptRisk,
    });

    return HttpResponse.json({ status: "ok" });
  }),
];
