import { http, HttpResponse } from "msw";

type AnalysisBody = {
  riskProfile?: "conservative" | "balanced" | "aggressive";
  portfolios?: Array<{
    id: string;
    name: string;
    totalValue: number;
    assets: Array<{
      symbol: string;
      name: string;
      value: number;
    }>;
  }>;
};

const CRYPTO = new Set(["BTC", "ETH", "SOL"]);

function sumValues(portfolios: AnalysisBody["portfolios"]) {
  return (portfolios ?? []).reduce((acc, p) => acc + (p.totalValue ?? 0), 0);
}

function calcExposures(portfolios: AnalysisBody["portfolios"]) {
  const map = new Map<string, number>();
  (portfolios ?? []).forEach((p) => {
    p.assets.forEach((a) => {
      map.set(a.name, (map.get(a.name) ?? 0) + a.value);
    });
  });

  const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
  const items = Array.from(map.entries()).map(([name, value]) => ({
    name,
    value,
    percent: total > 0 ? Math.round((value / total) * 100) : 0,
  }));

  return items.sort((a, b) => b.value - a.value).slice(0, 5);
}

function cryptoPercent(portfolios: AnalysisBody["portfolios"]) {
  const total = sumValues(portfolios);
  if (total === 0) return 0;

  const crypto = (portfolios ?? []).reduce((acc, p) => {
    const v = p.assets
      .filter((a) => CRYPTO.has(a.symbol))
      .reduce((s, a) => s + a.value, 0);
    return acc + v;
  }, 0);

  return crypto / total;
}

function diversificationScore(portfolios: AnalysisBody["portfolios"]) {
  const symbols = new Set<string>();
  (portfolios ?? []).forEach((p) => {
    p.assets.forEach((a) => symbols.add(a.symbol));
  });

  return Math.min(100, 40 + symbols.size * 10);
}

function alignmentScore(
  riskProfile: AnalysisBody["riskProfile"],
  cryptoPct: number,
) {
  const max =
    riskProfile === "conservative"
      ? 0.05
      : riskProfile === "balanced"
        ? 0.15
        : 0.3;
  const over = Math.max(0, cryptoPct - max);
  return Math.max(30, Math.round(100 - over * 300));
}

export const analysisHandlers = [
  http.post("*/api/analysis", async ({ request }) => {
    const auth =
      request.headers.get("authorization") ??
      request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as AnalysisBody;
    const riskProfile = body.riskProfile ?? "balanced";
    const totalValue = sumValues(body.portfolios);
    const exposures = calcExposures(body.portfolios);
    const cryptoPct = cryptoPercent(body.portfolios);
    const divScore = diversificationScore(body.portfolios);
    const alignScore = alignmentScore(riskProfile, cryptoPct);

    const recommendations = [];
    if (
      cryptoPct >
      (riskProfile === "conservative"
        ? 0.05
        : riskProfile === "balanced"
          ? 0.15
          : 0.3)
    ) {
      recommendations.push({
        id: "rec-crypto",
        title: "Zredukuj udział krypto",
        description:
          "Aktualny udział aktywów wysokiego ryzyka jest powyżej zalecanego dla Twojego profilu.",
        priority: "high" as const,
      });
    }
    if (divScore < 70) {
      recommendations.push({
        id: "rec-div",
        title: "Zwiększ dywersyfikację",
        description:
          "Wprowadź więcej niezależnych klas aktywów, aby obniżyć ryzyko portfela.",
        priority: "medium" as const,
      });
    }
    if (recommendations.length === 0) {
      recommendations.push({
        id: "rec-ok",
        title: "Utrzymaj obecny poziom ryzyka",
        description:
          "Portfel jest spójny z Twoim profilem – obserwuj i rebalansuj okresowo.",
        priority: "low" as const,
      });
    }

    const insights = [];
    const top = exposures[0];
    if (top && top.percent > 40) {
      insights.push({
        id: "ins-concentration",
        title: "Wysoka koncentracja",
        description: `Największa pozycja stanowi ${top.percent}% wartości portfela.`,
        severity: "warning" as const,
      });
    } else {
      insights.push({
        id: "ins-balanced",
        title: "Rozsądny rozkład",
        description: "Nie widać jednej dominującej pozycji.",
        severity: "success" as const,
      });
    }

    if (cryptoPct > 0) {
      insights.push({
        id: "ins-crypto",
        title: "Udział aktywów krypto",
        description: `Krypto stanowi ${(cryptoPct * 100).toFixed(1)}% portfela.`,
        severity: "info" as const,
      });
    }

    return HttpResponse.json({
      generatedAt: new Date().toISOString(),
      riskProfile,
      totalValue,
      diversificationScore: divScore,
      alignmentScore: alignScore,
      topExposures: exposures,
      insights,
      recommendations,
      stressTests: [
        {
          id: "st-1",
          scenario: "Spadek rynku akcji o 15%",
          impactPercent: -8,
        },
        {
          id: "st-2",
          scenario: "Wzrost stóp procentowych o 1 p.p.",
          impactPercent: -4,
        },
        {
          id: "st-3",
          scenario: "Nagły wzrost zmienności",
          impactPercent: -6,
        },
      ],
    });
  }),
];
