import { http, HttpResponse } from "msw";
import { getUser } from "../db/usersDb";
import {
  addAsset,
  createPortfolio,
  listPortfolios,
  removeAsset,
  removePortfolio,
  updateAsset,
  updatePortfolio,
} from "../db/portfoliosDb";

type CreatePortfolioBody = { name?: string };
type UpdatePortfolioBody = { name?: string };

type CreateAssetBody = {
  symbol?: string;
  name?: string;
  quantity?: number;
  price?: number;
  purchasedAt?: string;
};

type UpdateAssetBody = Partial<CreateAssetBody>;

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
  http.get("/api/portfolios", ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    return HttpResponse.json({ portfolios: listPortfolios(getUser().id) });
  }),

  http.post("/api/portfolios", async ({ request }) => {
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

  http.patch("/api/portfolios/:id", async ({ request, params }) => {
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

  http.delete("/api/portfolios/:id", ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const id = String(params.id);
    const ok = removePortfolio(getUser().id, id);
    if (!ok)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json({ ok: true });
  }),

  http.post("/api/portfolios/:id/assets", async ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const portfolioId = String(params.id);
    const body = (await request.json().catch(() => ({}))) as CreateAssetBody;

    const symbol = body.symbol?.trim();
    const name = body.name?.trim();
    const quantity = Number(body.quantity);
    const price = Number(body.price);
    const purchasedAt = body.purchasedAt?.trim();

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

    const a = addAsset(getUser().id, portfolioId, {
      symbol,
      name,
      quantity,
      price,
      purchasedAt,
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
      if (typeof body.purchasedAt === "string")
        patch.purchasedAt = body.purchasedAt.trim();

      const nextSymbol =
        typeof patch.symbol === "string" ? patch.symbol : undefined;
      const nextName = typeof patch.name === "string" ? patch.name : undefined;
      const nextQty =
        typeof patch.quantity === "number" ? patch.quantity : undefined;
      const nextPrice =
        typeof patch.price === "number" ? patch.price : undefined;
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

      const updated = updateAsset(getUser().id, portfolioId, assetId, patch);
      if (!updated)
        return HttpResponse.json({ message: "Not found" }, { status: 404 });

      return HttpResponse.json(updated);
    },
  ),

  http.delete("/api/portfolios/:id/assets/:assetId", ({ request, params }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const portfolioId = String(params.id);
    const assetId = String(params.assetId);

    const ok = removeAsset(getUser().id, portfolioId, assetId);
    if (!ok)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });

    return HttpResponse.json({ ok: true });
  }),
];
