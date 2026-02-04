import type { CurrencyCode } from "../../shared/types/currency";

export type AssetDto = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  purchasedAt: string;
  currency: CurrencyCode;
};

export type PortfolioDto = {
  id: string;
  name: string;
  assets: AssetDto[];
};

export type GetPortfoliosResponseDto = {
  portfolios: PortfolioDto[];
};

export type CreatePortfolioRequestDto = { name: string };
export type UpdatePortfolioRequestDto = { name: string };

export type CreateAssetRequestDto = {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  purchasedAt: string;
  currency: CurrencyCode;
};

export type UpdateAssetRequestDto = Partial<CreateAssetRequestDto>;

export type PortfolioModel = {
  id: string;
  name: string;
  totalValue: number;
  assets: Array<AssetDto & { value: number }>;
};
