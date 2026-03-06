import { http, HttpResponse } from "msw";

function buildRates(toParam: string | null) {
  const codes = (toParam ?? "").split(",").filter(Boolean);
  const rates: Record<string, number> = {};
  codes.forEach((code, idx) => {
    rates[code] = 0.9 + idx * 0.1;
  });
  return rates;
}

export const fxHandlers = [
  http.get("https://api.frankfurter.app/latest", ({ request }) => {
    const url = new URL(request.url);
    const rates = buildRates(url.searchParams.get("to"));
    return HttpResponse.json({ rates });
  }),
];
