import { http, HttpResponse } from "msw";
import { getUser } from "../db/usersDb";
import {
  addAsset,
  createPortfolio,
  getAsset,
  getMockMarketPrice,
  listPortfolios,
  removeAsset,
  removePortfolio,
  sellAsset,
  updateAsset,
  updatePortfolio,
} from "../db/portfoliosDb";
import { currencyCodes } from "../../shared/types/currency";

type CreatePortfolioBody = { name?: string };
type UpdatePortfolioBody = { name?: string };

type CreateAssetBody = {
  symbol?: string;
  name?: string;
  quantity?: number;
  price?: number;
  purchasedAt?: string;
  currency?: "PLN" | "EUR" | "USD";
};

type UpdateAssetBody = Partial<CreateAssetBody>;

type SellAssetBody = {
  quantity?: number;
  soldAt?: string;
};

type CurrencyCode = (typeof currencyCodes)[number];

function isCurrencyCode(value: string): value is CurrencyCode {
  return currencyCodes.includes(value as CurrencyCode);
}

function requireAuth(request: Request) {
  const auth =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export const portfoliosHandlers = [
  http.get("*/api/portfolios", ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const portfolios = listPortfolios(getUser().id).map((p) => {
      const assets = p.assets.map((a) => {
        const marketPrice = getMockMarketPrice(a.symbol, a.price);
        const marketValue = marketPrice * a.quantity;
        const value = a.price * a.quantity;
        const changeValue = marketValue - value;
        const changePercent = value > 0 ? (changeValue / value) * 100 : 0;

        return {
          ...a,
          marketPrice,
          marketValue,
          changeValue,
          changePercent,
        };
      });

      const totalValue = assets.reduce(
        (acc, a) => acc + a.price * a.quantity,
        0,
      );
      const totalMarketValue = assets.reduce(
        (acc, a) => acc + (a.marketValue ?? a.price * a.quantity),
        0,
      );
      const changeValue = totalMarketValue - totalValue;
      const changePercent =
        totalValue > 0 ? (changeValue / totalValue) * 100 : 0;

      return {
        ...p,
        totalValue,
        marketValue: totalMarketValue,
        changeValue,
        changePercent,
        assets,
      };
    });

    return HttpResponse.json({ portfolios });
  }),

  http.post("*/api/portfolios", async ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = (await request
      .json()
      .catch(() => ({}))) as CreatePortfolioBody;
    const name = body.name?.trim();

    if (!name || name.length < 2) {
      return HttpResponse.json(
        { message: "Nazwa portfela jest wymagana" },
        { status: 400 },
      );
    }

    const p = createPortfolio(getUser().id, name);
    return HttpResponse.json(p, { status: 201 });
  }),

  http.patch("*/api/portfolios/:id", async ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const id = String(params.id);
    const body = (await request
      .json()
      .catch(() => ({}))) as UpdatePortfolioBody;
    const name = body.name?.trim();

    if (!name || name.length < 2) {
      return HttpResponse.json(
        { message: "Nazwa portfela jest wymagana" },
        { status: 400 },
      );
    }

    const updated = updatePortfolio(getUser().id, id, name);
    if (!updated)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json(updated);
  }),

  http.delete("*/api/portfolios/:id", ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const id = String(params.id);
    const ok = removePortfolio(getUser().id, id);
    if (!ok)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json({ ok: true });
  }),

  http.post("*/api/portfolios/:id/assets", async ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const portfolioId = String(params.id);
    const body = (await request.json().catch(() => ({}))) as CreateAssetBody;

    const symbol = body.symbol?.trim();
    const name = body.name?.trim();
    const quantity = Number(body.quantity);
    const price = Number(body.price);
    const purchasedAt = body.purchasedAt?.trim();
    const currency = body.currency ?? "PLN";

    if (!purchasedAt || !/^\d{4}-\d{2}-\d{2}$/.test(purchasedAt)) {
      return HttpResponse.json(
        { message: "Data zakupu jest wymagana (YYYY-MM-DD)" },
        { status: 400 },
      );
    }
    if (!symbol || !name) {
      return HttpResponse.json(
        { message: "Symbol i nazwa są wymagane" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return HttpResponse.json(
        { message: "Ilość musi być > 0" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(price) || price < 0) {
      return HttpResponse.json(
        { message: "Cena nie może być ujemna" },
        { status: 400 },
      );
    }
    if (!currencyCodes.includes(currency)) {
      return HttpResponse.json(
        { message: "Nieprawidłowa waluta" },
        { status: 400 },
      );
    }

    const a = addAsset(getUser().id, portfolioId, {
      symbol,
      name,
      quantity,
      price,
      purchasedAt,
      currency,
    });
    if (!a) return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json(a, { status: 201 });
  }),

  http.patch(
    "/api/portfolios/:id/assets/:assetId",
    async ({ request, params }) => {
      const unauthorized = requireAuth(request);
      if (unauthorized) return unauthorized;

      const portfolioId = String(params.id);
      const assetId = String(params.assetId);

      const body = (await request.json().catch(() => ({}))) as UpdateAssetBody;

      const patch: Record<string, unknown> = {};
      if (typeof body.symbol === "string") patch.symbol = body.symbol.trim();
      if (typeof body.name === "string") patch.name = body.name.trim();
      if (typeof body.quantity !== "undefined")
        patch.quantity = Number(body.quantity);
      if (typeof body.price !== "undefined") patch.price = Number(body.price);
      if (typeof body.currency === "string") patch.currency = body.currency;
      if (typeof body.purchasedAt === "string")
        patch.purchasedAt = body.purchasedAt.trim();

      const nextSymbol =
        typeof patch.symbol === "string" ? patch.symbol : undefined;
      const nextName = typeof patch.name === "string" ? patch.name : undefined;
      const nextQty =
        typeof patch.quantity === "number" ? patch.quantity : undefined;
      const nextPrice =
        typeof patch.price === "number" ? patch.price : undefined;
      const nextCurrency =
        typeof patch.currency === "string" ? patch.currency : undefined;
      const nextPurchasedAt =
        typeof patch.purchasedAt === "string" ? patch.purchasedAt : undefined;

      if (nextSymbol !== undefined && nextSymbol.length === 0) {
        return HttpResponse.json(
          { message: "Symbol i nazwa są wymagane" },
          { status: 400 },
        );
      }
      if (nextName !== undefined && nextName.length === 0) {
        return HttpResponse.json(
          { message: "Symbol i nazwa są wymagane" },
          { status: 400 },
        );
      }
      if (
        nextQty !== undefined &&
        (!Number.isFinite(nextQty) || nextQty <= 0)
      ) {
        return HttpResponse.json(
          { message: "Ilość musi być > 0" },
          { status: 400 },
        );
      }
      if (
        nextPrice !== undefined &&
        (!Number.isFinite(nextPrice) || nextPrice < 0)
      ) {
        return HttpResponse.json(
          { message: "Cena nie może być ujemna" },
          { status: 400 },
        );
      }
      if (
        nextPurchasedAt !== undefined &&
        !/^\d{4}-\d{2}-\d{2}$/.test(nextPurchasedAt)
      ) {
        return HttpResponse.json(
          { message: "Data zakupu jest wymagana (YYYY-MM-DD)" },
          { status: 400 },
        );
      }
      if (nextCurrency !== undefined && !isCurrencyCode(nextCurrency)) {
        return HttpResponse.json(
          { message: "Nieprawidłowa waluta" },
          { status: 400 },
        );
      }

      const updated = updateAsset(getUser().id, portfolioId, assetId, patch);
      if (!updated)
        return HttpResponse.json({ message: "Not found" }, { status: 404 });

      return HttpResponse.json(updated);
    },
  ),

  http.delete("*/api/portfolios/:id/assets/:assetId", ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const portfolioId = String(params.id);
    const assetId = String(params.assetId);

    const ok = removeAsset(getUser().id, portfolioId, assetId);
    if (!ok)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json({ ok: true });
  }),

  http.post(
    "/api/portfolios/:id/assets/:assetId/sell",
    async ({ request, params }) => {
      const unauthorized = requireAuth(request);
      if (unauthorized) return unauthorized;

      const portfolioId = String(params.id);
      const assetId = String(params.assetId);

      const body = (await request.json().catch(() => ({}))) as SellAssetBody;
      const quantity = Number(body.quantity);
      const soldAt = body.soldAt?.trim();

      if (!soldAt || !/^\d{4}-\d{2}-\d{2}$/.test(soldAt)) {
        return HttpResponse.json(
          { message: "Data sprzedaży jest wymagana (YYYY-MM-DD)" },
          { status: 400 },
        );
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return HttpResponse.json(
          { message: "Ilość musi być > 0" },
          { status: 400 },
        );
      }

      const asset = getAsset(getUser().id, portfolioId, assetId);
      if (!asset) {
        return HttpResponse.json({ message: "Not found" }, { status: 404 });
      }

      if (quantity > asset.quantity) {
        return HttpResponse.json(
          { message: "Nie możesz sprzedać więcej niż posiadasz" },
          { status: 400 },
        );
      }

      const result = sellAsset(getUser().id, portfolioId, assetId, quantity);
      if (!result)
        return HttpResponse.json({ message: "Not found" }, { status: 404 });

      return HttpResponse.json({ ok: true });
    },
  ),
];
