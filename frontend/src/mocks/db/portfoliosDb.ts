import { meFixture } from "../fixtures/me";

export type DbAsset = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  purchasedAt: string;
  currency: "PLN" | "EUR" | "USD";
};

export type DbPortfolio = {
  id: string;
  userId: string;
  name: string;
  assets: DbAsset[];
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function hashSymbol(symbol: string) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 31 + symbol.charCodeAt(i)) % 100000;
  }
  return hash;
}

export function getMockMarketPrice(symbol: string, price: number) {
  const hash = hashSymbol(symbol.toUpperCase());
  const factor = 0.8 + (hash % 60) / 100; // 0.80 - 1.39
  const withDrift = price * factor;
  return Math.round(withDrift * 100) / 100;
}

const portfoliosByUser: Record<string, DbPortfolio[]> = {
  [meFixture.id]: [
    {
      id: "p1",
      userId: meFixture.id,
      name: "Długoterminowy",
      assets: [
        {
          id: "a1",
          symbol: "AAPL",
          name: "Apple",
          quantity: 10,
          price: 780,
          purchasedAt: "2024-01-09",
          currency: "PLN",
        },
        {
          id: "a2",
          symbol: "VWCE",
          name: "Vanguard FTSE All-World",
          quantity: 20,
          price: 1245,
          purchasedAt: "2024-02-15",
          currency: "PLN",
        },
      ],
    },
    {
      id: "p2",
      userId: meFixture.id,
      name: "Spekulacyjny",
      assets: [
        {
          id: "a3",
          symbol: "TSLA",
          name: "Tesla",
          quantity: 4,
          price: 1700,
          purchasedAt: "2024-03-20",
          currency: "PLN",
        },
        {
          id: "a4",
          symbol: "BTC",
          name: "Bitcoin",
          quantity: 0.05,
          price: 68000,
          purchasedAt: "2024-04-10",
          currency: "PLN",
        },
      ],
    },
  ],
};

function getUserPortfolios(userId: string) {
  if (!portfoliosByUser[userId]) portfoliosByUser[userId] = [];
  return portfoliosByUser[userId];
}

export function listPortfolios(userId: string): DbPortfolio[] {
  const portfolios = getUserPortfolios(userId);
  return portfolios.map((p) => ({
    ...p,
    assets: p.assets.map((a) => ({ ...a })),
  }));
}

export function createPortfolio(userId: string, name: string): DbPortfolio {
  const p: DbPortfolio = { id: uid("p"), userId, name, assets: [] };
  portfoliosByUser[userId] = [p, ...getUserPortfolios(userId)];
  return p;
}

export function updatePortfolio(
  userId: string,
  id: string,
  name: string,
): DbPortfolio | null {
  const portfolios = getUserPortfolios(userId);
  const idx = portfolios.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  portfolios[idx] = { ...portfolios[idx], name };
  return portfolios[idx];
}

export function removePortfolio(userId: string, id: string): boolean {
  const portfolios = getUserPortfolios(userId);
  const exists = portfolios.some((p) => p.id === id);
  if (!exists) return false;
  portfoliosByUser[userId] = portfolios.filter((p) => p.id !== id);
  return true;
}

export function addAsset(
  userId: string,
  portfolioId: string,
  asset: Omit<DbAsset, "id">,
): DbAsset | null {
  const p = getUserPortfolios(userId).find((x) => x.id === portfolioId);
  if (!p) return null;
  const a: DbAsset = { id: uid("a"), ...asset };
  p.assets = [a, ...p.assets];
  return a;
}

export function updateAsset(
  userId: string,
  portfolioId: string,
  assetId: string,
  patch: Partial<Omit<DbAsset, "id">>,
): DbAsset | null {
  const p = getUserPortfolios(userId).find((x) => x.id === portfolioId);
  if (!p) return null;

  const idx = p.assets.findIndex((a) => a.id === assetId);
  if (idx === -1) return null;

  const next: DbAsset = { ...p.assets[idx], ...patch };
  p.assets[idx] = next;
  return next;
}

export function getAsset(
  userId: string,
  portfolioId: string,
  assetId: string,
): DbAsset | null {
  const p = getUserPortfolios(userId).find((x) => x.id === portfolioId);
  if (!p) return null;
  const asset = p.assets.find((a) => a.id === assetId);
  return asset ? { ...asset } : null;
}

export function sellAsset(
  userId: string,
  portfolioId: string,
  assetId: string,
  quantity: number,
): { removed: boolean; asset?: DbAsset } | null {
  const p = getUserPortfolios(userId).find((x) => x.id === portfolioId);
  if (!p) return null;

  const idx = p.assets.findIndex((a) => a.id === assetId);
  if (idx === -1) return null;

  const asset = p.assets[idx];
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  if (quantity > asset.quantity) return null;

  const nextQty = asset.quantity - quantity;
  if (nextQty <= 0) {
    p.assets = p.assets.filter((a) => a.id !== assetId);
    return { removed: true };
  }

  const updated: DbAsset = { ...asset, quantity: nextQty };
  p.assets[idx] = updated;
  return { removed: false, asset: updated };
}

export function removeAsset(
  userId: string,
  portfolioId: string,
  assetId: string,
): boolean {
  const p = getUserPortfolios(userId).find((x) => x.id === portfolioId);
  if (!p) return false;

  const exists = p.assets.some((a) => a.id === assetId);
  if (!exists) return false;

  p.assets = p.assets.filter((a) => a.id !== assetId);
  return true;
}
