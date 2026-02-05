import type { DashboardModel, DashboardSummaryDto } from "../types";

export function mapDashboardSummary(dto: DashboardSummaryDto): DashboardModel {
  const portfolios = dto.portfolios.map((p) => {
    const assets = p.assets.map((a) => {
      const marketPrice = a.marketPrice ?? a.price;
      const marketValue = a.marketValue ?? a.quantity * marketPrice;
      const changeValue = marketValue - a.value;
      const changePercent = a.value > 0 ? (changeValue / a.value) * 100 : 0;

      return {
        ...a,
        marketPrice,
        marketValue,
        changeValue: a.changeValue ?? changeValue,
        changePercent: a.changePercent ?? changePercent,
      };
    });

    const totalValue = assets.reduce((acc, a) => acc + a.value, 0);
    const marketValue = assets.reduce((acc, a) => acc + a.marketValue, 0);
    const changeValue = marketValue - totalValue;
    const changePercent = totalValue > 0 ? (changeValue / totalValue) * 100 : 0;

    return {
      ...p,
      totalValue,
      marketValue: p.marketValue ?? marketValue,
      changeValue: p.changeValue ?? changeValue,
      changePercent: p.changePercent ?? changePercent,
      assets,
    };
  });

  const totalValue = portfolios.reduce((acc, p) => acc + p.totalValue, 0);
  const totalMarketValue = portfolios.reduce(
    (acc, p) => acc + p.marketValue,
    0,
  );
  const changeValue = totalMarketValue - totalValue;
  const changePercent = totalValue > 0 ? (changeValue / totalValue) * 100 : 0;

  return {
    currency: dto.currency,
    totalValue,
    totalMarketValue,
    changeValue,
    changePercent,
    portfolios,
    history: dto.history.map((h) => ({
      date: new Date(h.date),
      totalValue: h.totalValue,
      marketValue: h.marketValue ?? h.totalValue,
    })),
  };
}
