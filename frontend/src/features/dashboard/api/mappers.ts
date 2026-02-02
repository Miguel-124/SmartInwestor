import type { DashboardModel, DashboardSummaryDto } from "../types";

export function mapDashboardSummary(dto: DashboardSummaryDto): DashboardModel {
  const totalValue = dto.portfolios.reduce((acc, p) => acc + p.totalValue, 0);

  return {
    currency: dto.currency,
    totalValue,
    portfolios: dto.portfolios,
    history: dto.history.map((h) => ({
      date: new Date(h.date),
      totalValue: h.totalValue,
    })),
  };
}
