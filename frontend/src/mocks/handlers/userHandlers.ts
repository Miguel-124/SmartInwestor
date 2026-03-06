import { http, HttpResponse } from "msw";
import { getUser, updateUser } from "../db/usersDb";

export const userHandlers = [
  http.get("*/api/users/me", async ({ request }) => {
    const auth =
      request.headers.get("authorization") ??
      request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json(getUser());
  }),

  http.put("*/api/users/me", async ({ request }) => {
    const auth =
      request.headers.get("authorization") ??
      request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<{
      birthDate: string;
      riskProfile: "conservative" | "balanced" | "aggressive";
      acceptRisk: boolean;
      firstName: string;
      lastName: string;
      email: string;
      baseCurrency: "PLN" | "EUR" | "USD";
    }>;

    const updated = updateUser(body);
    return HttpResponse.json(updated);
  }),

  http.post("*/api/users/me/password", async ({ request }) => {
    const auth =
      request.headers.get("authorization") ??
      request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<{
      currentPassword: string;
      newPassword: string;
    }>;

    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json(
        { message: "Brak danych do zmiany hasła" },
        { status: 400 },
      );
    }

    return HttpResponse.json({ ok: true });
  }),
];
