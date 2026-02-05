import type { CurrencyCode } from "../../shared/types/currency";

export type AssetDto = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  purchasedAt: string;
  currency: CurrencyCode;
  marketPrice?: number;
  marketValue?: number;
  changeValue?: number;
  changePercent?: number;
};

export type PortfolioDto = {
  id: string;
  name: string;
  assets: AssetDto[];
  totalValue?: number;
  marketValue?: number;
  changeValue?: number;
  changePercent?: number;
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

export type SellAssetRequestDto = {
  quantity: number;
  soldAt: string;
};

export type PortfolioModel = {
  id: string;
  name: string;
  totalValue: number;
  marketValue: number;
  changeValue: number;
  changePercent: number;
  assets: Array<AssetDto & { value: number }>;
};
