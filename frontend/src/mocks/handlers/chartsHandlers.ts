import { http, HttpResponse } from "msw";
import { listPortfolios } from "../db/portfoliosDb";
import { getUser } from "../db/usersDb";

function isIsoDateString(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function toUtcDate(iso: string) {
  return new Date(`${iso}T00:00:00.000Z`);
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function clampInt(
  v: string | null,
  min: number,
  max: number,
  fallback: number,
) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function subtractMonthsUTC(d: Date, months: number) {
  const x = new Date(d.getTime());
  x.setUTCMonth(x.getUTCMonth() - months);
  return x;
}

/**
 * Generuje maks. `points` dat równomiernie rozłożonych między start a end (włącznie).
 * Punkty są "stałe" (jeśli brak zmian, wartości się nie zmieniają).
 */
function buildEvenTimeline(start: Date, end: Date, points: number): string[] {
  const s = start.getTime();
  const e = end.getTime();
  if (points <= 1 || s === e) return [toIsoDate(end)];

  const out: string[] = [];
  for (let i = 0; i < points; i++) {
    const t = s + (i * (e - s)) / (points - 1);
    const d = new Date(t);
    // zaokrąglenie do dnia UTC
    const day = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
    out.push(toIsoDate(day));
  }

  // dedupe + sort
  return Array.from(new Set(out)).sort((a, b) => +toUtcDate(a) - +toUtcDate(b));
}

function calcValueAtDate(
  assets: Array<{ purchasedAt: string; value: number }>,
  pointDateIso: string,
) {
  const point = toUtcDate(pointDateIso);
  return assets.reduce((sum, a) => {
    const purchased = toUtcDate(a.purchasedAt);
    if (purchased <= point) return sum + a.value;
    return sum;
  }, 0);
}

export const chartsHandlers = [
  http.get("/api/charts/overview", ({ request }) => {
    const url = new URL(request.url);
    const range = url.searchParams.get("range") ?? "all";
    const points = clampInt(url.searchParams.get("points"), 2, 50, 20);

    const currency = "PLN";
    const db = listPortfolios(getUser().id);

    const portfolios = db.map((p) => {
      const assets = p.assets.map((a) => ({
        ...a,
        value: a.quantity * a.price,
      }));
      const totalValue = assets.reduce((acc, a) => acc + a.value, 0);
      return { id: p.id, name: p.name, totalValue, assets };
    });

    const allAssets = portfolios.flatMap((p) =>
      p.assets
        .filter((a) => isIsoDateString(a.purchasedAt))
        .map((a) => ({ purchasedAt: a.purchasedAt, value: a.value })),
    );

    const todayIso = toIsoDate(new Date());
    const today = toUtcDate(todayIso);

    // start = najwcześniejsza data zakupu (ignorujemy przyszłość)
    const minPurchaseIso =
      allAssets
        .map((a) => a.purchasedAt)
        .filter((d) => toUtcDate(d) <= today)
        .sort((a, b) => +toUtcDate(a) - +toUtcDate(b))[0] ?? todayIso;

    let start = toUtcDate(minPurchaseIso);

    // zakres: 6m / 12m / all (ale nie wcześniej niż pierwszy zakup)
    if (range === "6m") {
      const r = subtractMonthsUTC(today, 6);
      if (r > start) start = r;
    } else if (range === "12m") {
      const r = subtractMonthsUTC(today, 12);
      if (r > start) start = r;
    }

    const timeline = buildEvenTimeline(start, today, points);

    const totalHistory = timeline.map((date) => ({
      date,
      totalValue: Math.round(calcValueAtDate(allAssets, date)),
    }));

    const portfolioHistories = portfolios.map((p) => {
      const assets = p.assets
        .filter((a) => isIsoDateString(a.purchasedAt))
        .map((a) => ({ purchasedAt: a.purchasedAt, value: a.value }));

      const history = timeline.map((date) => ({
        date,
        totalValue: Math.round(calcValueAtDate(assets, date)),
      }));

      return { id: p.id, name: p.name, history };
    });

    return HttpResponse.json(
      {
        currency,
        timeline,
        total: { history: totalHistory },
        portfolios: portfolioHistories,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }),
];
