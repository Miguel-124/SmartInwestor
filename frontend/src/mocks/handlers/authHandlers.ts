import { http, HttpResponse } from "msw";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as RegisterBody;

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return HttpResponse.json(
        { message: "Brak danych rejestracji" },
        { status: 400 },
      );
    }

    if (body.email.toLowerCase() === "taken@example.com") {
      return HttpResponse.json(
        { message: "Email jest istnieje" },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      ok: true,
      token: "mock-token-123",
      user: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as RegisterBody;

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return HttpResponse.json(
        { message: "Brak danych rejestracji" },
        { status: 400 },
      );
    }

    // symulacja: email zajęty
    if (body.email.toLowerCase() === "taken@example.com") {
      return HttpResponse.json(
        { message: "Email jest już zajęty" },
        { status: 409 },
      );
    }

    return HttpResponse.json({ ok: true });
  }),
];
