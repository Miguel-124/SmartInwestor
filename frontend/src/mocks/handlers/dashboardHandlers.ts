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

function addDaysUTC(d: Date, days: number) {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function addMonthsUTC(d: Date, months: number) {
  const x = new Date(d.getTime());
  x.setUTCMonth(x.getUTCMonth() + months);
  return x;
}

function startOfDayUTC(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function endOfMonthUTC(d: Date) {
  // ostatni dzień miesiąca
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
}

function endOfQuarterUTC(d: Date) {
  const q = Math.floor(d.getUTCMonth() / 3); // 0..3
  const endMonth = q * 3 + 2;
  return new Date(Date.UTC(d.getUTCFullYear(), endMonth + 1, 0));
}

function endOfYearUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), 12, 0));
}

function daysBetweenUTC(a: Date, b: Date) {
  const ms = startOfDayUTC(b).getTime() - startOfDayUTC(a).getTime();
  return Math.max(0, Math.round(ms / (24 * 60 * 60 * 1000)));
}

type HistoryPoint = { date: string; totalValue: number };
const MAX_DASHBOARD_POINTS = 8;

function downsampleEvenly<T>(arr: T[], maxPoints: number): T[] {
  if (arr.length <= maxPoints) return arr;
  if (maxPoints <= 2) return [arr[0], arr[arr.length - 1]];

  const n = arr.length;
  const indices = new Set<number>();

  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.round((i * (n - 1)) / (maxPoints - 1));
    indices.add(idx);
  }

  return Array.from(indices)
    .sort((a, b) => a - b)
    .map((i) => arr[i]);
}

function buildAdaptiveHistory(
  assets: Array<{ purchasedAt: string; value: number }>,
): HistoryPoint[] {
  const todayIso = toIsoDate(new Date());
  const today = toUtcDate(todayIso);

  // wyciągamy tylko sensowne daty <= dziś
  const valid = assets
    .filter((a) => isIsoDateString(a.purchasedAt))
    .map((a) => ({ ...a, purchased: toUtcDate(a.purchasedAt) }))
    .filter((a) => a.purchased <= today);

  if (valid.length === 0) {
    // brak aktywów -> historia 0 od dziś (żeby wykres nie crashował)
    return [{ date: todayIso, totalValue: 0 }];
  }

  // start = najwcześniejszy zakup
  valid.sort((a, b) => a.purchased.getTime() - b.purchased.getTime());
  const start = valid[0].purchased;

  const rangeDays = daysBetweenUTC(start, today);

  // dobór granulacji
  const unit: "day" | "month" | "quarter" | "year" =
    rangeDays <= 90
      ? "day"
      : rangeDays <= 730
        ? "month"
        : rangeDays <= 2920
          ? "quarter"
          : "year";

  const points: Date[] = [];

  // zawsze zaczynamy od dokładnej daty pierwszego aktywa
  points.push(startOfDayUTC(start));

  // generujemy kolejne punkty zależnie od jednostki, zawsze <= today
  let cursor = startOfDayUTC(start);

  const pushIfNew = (d: Date) => {
    const last = points[points.length - 1];
    if (!last || last.getTime() !== d.getTime()) points.push(d);
  };

  while (cursor < today) {
    let next: Date;

    if (unit === "day") {
      next = addDaysUTC(cursor, 1);
    } else if (unit === "month") {
      // idziemy miesiącami, ale punkt to koniec miesiąca (żeby w obrębie miesiąca skok “był widoczny”)
      const end = endOfMonthUTC(cursor);
      next =
        end.getTime() > cursor.getTime()
          ? end
          : endOfMonthUTC(addMonthsUTC(cursor, 1));
    } else if (unit === "quarter") {
      const end = endOfQuarterUTC(cursor);
      next =
        end.getTime() > cursor.getTime()
          ? end
          : endOfQuarterUTC(addMonthsUTC(cursor, 3));
    } else {
      const end = endOfYearUTC(cursor);
      next =
        end.getTime() > cursor.getTime()
          ? end
          : endOfYearUTC(addMonthsUTC(cursor, 12));
    }

    if (next > today) next = today;
    pushIfNew(next);

    // przesuwamy cursor: dzień po punkcie (żeby uniknąć pętli w miesiąc/kwartał/rok)
    cursor = addDaysUTC(next, 1);
  }

  // valueAt(date) = suma wartości aktywów kupionych <= date
  const history = points.map((d) => {
    const totalValue = valid.reduce((sum, a) => {
      if (a.purchased <= d) return sum + a.value;
      return sum;
    }, 0);

    return { date: toIsoDate(d), totalValue: Math.round(totalValue) };
  });

  // gwarancja, że ostatni punkt jest “dzisiaj”
  const last = history[history.length - 1];
  if (!last || last.date !== todayIso) {
    const totalValue = valid.reduce((sum, a) => sum + a.value, 0);
    history.push({ date: todayIso, totalValue: Math.round(totalValue) });
  }

  return history;
}

export const dashboardHandlers = [
  http.get("/api/dashboard/summary", async () => {
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

    // ✅ historia smart z aktywów
    const allAssets = portfolios.flatMap((p) =>
      p.assets.map((a) => ({ purchasedAt: a.purchasedAt, value: a.value })),
    );
    const historyRaw = buildAdaptiveHistory(allAssets);
    const history = downsampleEvenly(historyRaw, MAX_DASHBOARD_POINTS);

    return HttpResponse.json({ currency, portfolios, history });
  }),
];
