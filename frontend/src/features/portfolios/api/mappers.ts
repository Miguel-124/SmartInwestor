import type { PortfolioDto, PortfolioModel } from "../types";

export function mapPortfolio(dto: PortfolioDto): PortfolioModel {
  const assets = dto.assets.map((a) => {
    const value = a.quantity * a.price;
    const marketPrice = a.marketPrice ?? a.price;
    const marketValue = a.marketValue ?? a.quantity * marketPrice;
    const changeValue = marketValue - value;
    const changePercent = value > 0 ? (changeValue / value) * 100 : 0;

    return {
      ...a,
      currency: a.currency ?? "PLN",
      value,
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
    id: dto.id,
    name: dto.name,
    totalValue,
    marketValue,
    changeValue,
    changePercent,
    assets,
  };
}
