import { http, HttpResponse } from "msw";
import { setUserFromRegister } from "../db/usersDb";

type LoginBody = { email?: string; password?: string };
type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as LoginBody;

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "Brak danych logowania" },
        { status: 400 },
      );
    }

    if (body.password === "wrong-password") {
      return HttpResponse.json(
        { message: "Nieprawidłowy email lub hasło" },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: "mock-token-123",
      user: { firstName: "Jan", lastName: "Kowalski", email: body.email },
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

    if (body.email.toLowerCase() === "taken@example.com") {
      return HttpResponse.json(
        { message: "Email jest już zajęty" },
        { status: 409 },
      );
    }

    setUserFromRegister({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });

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
];
