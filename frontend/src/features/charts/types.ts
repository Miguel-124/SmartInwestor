export type ChartsRange = "6m" | "12m" | "all";

export type ChartsPointDto = {
  date: string;
  totalValue: number;
  marketValue?: number;
};

export type ChartsPortfolioSeriesDto = {
  id: string;
  name: string;
  history: ChartsPointDto[];
  assets?: Array<{
    id: string;
    symbol: string;
    name: string;
    history: ChartsPointDto[];
  }>;
};

export type ChartsOverviewDto = {
  currency: string;
  timeline: string[];
  total: { history: ChartsPointDto[] };
  portfolios: ChartsPortfolioSeriesDto[];
};
