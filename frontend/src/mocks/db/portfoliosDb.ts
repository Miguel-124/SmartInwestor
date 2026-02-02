export type DbAsset = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  purchasedAt: string;
};

export type DbPortfolio = {
  id: string;
  name: string;
  assets: DbAsset[];
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// In-memory store (wspólny dla handlers)
let portfolios: DbPortfolio[] = [
  {
    id: "p1",
    name: "Długoterminowy",
    assets: [
      {
        id: "a1",
        symbol: "AAPL",
        name: "Apple",
        quantity: 10,
        price: 780,
        purchasedAt: "2024-01-09",
      },
      {
        id: "a2",
        symbol: "VWCE",
        name: "Vanguard FTSE All-World",
        quantity: 20,
        price: 1245,
        purchasedAt: "2024-02-15",
      },
    ],
  },
  {
    id: "p2",
    name: "Spekulacyjny",
    assets: [
      {
        id: "a3",
        symbol: "TSLA",
        name: "Tesla",
        quantity: 4,
        price: 1700,
        purchasedAt: "2024-03-20",
      },
      {
        id: "a4",
        symbol: "BTC",
        name: "Bitcoin",
        quantity: 0.05,
        price: 68000,
        purchasedAt: "2024-04-10",
      },
    ],
  },
];

export function listPortfolios(): DbPortfolio[] {
  // zwracamy kopię, żeby handler przypadkiem nie mutował bez kontroli
  return portfolios.map((p) => ({
    ...p,
    assets: p.assets.map((a) => ({ ...a })),
  }));
}

export function createPortfolio(name: string): DbPortfolio {
  const p: DbPortfolio = { id: uid("p"), name, assets: [] };
  portfolios = [p, ...portfolios];
  return p;
}

export function updatePortfolio(id: string, name: string): DbPortfolio | null {
  const idx = portfolios.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  portfolios[idx] = { ...portfolios[idx], name };
  return portfolios[idx];
}

export function removePortfolio(id: string): boolean {
  const exists = portfolios.some((p) => p.id === id);
  if (!exists) return false;
  portfolios = portfolios.filter((p) => p.id !== id);
  return true;
}

export function addAsset(
  portfolioId: string,
  asset: Omit<DbAsset, "id">,
): DbAsset | null {
  const p = portfolios.find((x) => x.id === portfolioId);
  if (!p) return null;
  const a: DbAsset = { id: uid("a"), ...asset };
  p.assets = [a, ...p.assets];
  return a;
}

export function updateAsset(
  portfolioId: string,
  assetId: string,
  patch: Partial<Omit<DbAsset, "id">>,
): DbAsset | null {
  const p = portfolios.find((x) => x.id === portfolioId);
  if (!p) return null;

  const idx = p.assets.findIndex((a) => a.id === assetId);
  if (idx === -1) return null;

  const next: DbAsset = { ...p.assets[idx], ...patch };
  p.assets[idx] = next;
  return next;
}

export function removeAsset(portfolioId: string, assetId: string): boolean {
  const p = portfolios.find((x) => x.id === portfolioId);
  if (!p) return false;

  const exists = p.assets.some((a) => a.id === assetId);
  if (!exists) return false;

  p.assets = p.assets.filter((a) => a.id !== assetId);
  return true;
}
