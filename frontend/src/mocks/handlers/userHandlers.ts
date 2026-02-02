import { http, HttpResponse } from "msw";
import { meFixture } from "../fixtures/me";

export const userHandlers = [
  http.get("/api/users/me", async ({ request }) => {
    const auth =
      request.headers.get("authorization") ??
      request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json(meFixture);
  }),
];
