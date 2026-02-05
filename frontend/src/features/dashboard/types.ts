export type DashboardSummaryDto = {
  currency: "PLN" | "USD" | "EUR" | string;
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    marketValue?: number;
    changeValue?: number;
    changePercent?: number;
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
      marketPrice?: number;
      marketValue?: number;
      changeValue?: number;
      changePercent?: number;
      purchasedAt: string;
    }>;
  }>;
  history: Array<{
    date: string;
    totalValue: number;
    marketValue?: number;
  }>;
};

export type DashboardModel = {
  currency: string;
  totalValue: number;
  totalMarketValue: number;
  changeValue: number;
  changePercent: number;
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    marketValue: number;
    changeValue: number;
    changePercent: number;
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
      marketPrice: number;
      marketValue: number;
      changeValue: number;
      changePercent: number;
    }>;
  }>;
  history: Array<{
    date: Date;
    totalValue: number;
    marketValue: number;
  }>;
};
