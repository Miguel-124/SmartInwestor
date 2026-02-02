export type DashboardSummaryDto = {
  currency: "PLN" | "USD" | "EUR" | string;
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
      purchasedAt: string;
    }>;
  }>;
  history: Array<{
    date: string;
    totalValue: number;
  }>;
};

export type DashboardModel = {
  currency: string;
  totalValue: number;
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
    }>;
  }>;
  history: Array<{
    date: Date;
    totalValue: number;
  }>;
};
