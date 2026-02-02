import { httpClient } from "../../../shared/api/httpClient";
import type {
  CreateAssetRequestDto,
  CreatePortfolioRequestDto,
  GetPortfoliosResponseDto,
  PortfolioDto,
  UpdateAssetRequestDto,
  UpdatePortfolioRequestDto,
  AssetDto,
} from "../types";

export const portfoliosApi = {
  getAll: () => httpClient<GetPortfoliosResponseDto>("/portfolios"),

  createPortfolio: (body: CreatePortfolioRequestDto) =>
    httpClient<PortfolioDto>("/portfolios", { method: "POST", body }),

  updatePortfolio: (id: string, body: UpdatePortfolioRequestDto) =>
    httpClient<PortfolioDto>(`/portfolios/${id}`, { method: "PATCH", body }),

  deletePortfolio: (id: string) =>
    httpClient<{ ok: boolean }>(`/portfolios/${id}`, { method: "DELETE" }),

  addAsset: (portfolioId: string, body: CreateAssetRequestDto) =>
    httpClient<AssetDto>(`/portfolios/${portfolioId}/assets`, {
      method: "POST",
      body,
    }),

  updateAsset: (
    portfolioId: string,
    assetId: string,
    body: UpdateAssetRequestDto,
  ) =>
    httpClient<AssetDto>(`/portfolios/${portfolioId}/assets/${assetId}`, {
      method: "PATCH",
      body,
    }),

  deleteAsset: (portfolioId: string, assetId: string) =>
    httpClient<{ ok: boolean }>(
      `/portfolios/${portfolioId}/assets/${assetId}`,
      { method: "DELETE" },
    ),
};
