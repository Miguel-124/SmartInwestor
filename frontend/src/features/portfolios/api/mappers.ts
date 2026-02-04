import type { PortfolioDto, PortfolioModel } from "../types";

export function mapPortfolio(dto: PortfolioDto): PortfolioModel {
  const assets = dto.assets.map((a) => ({
    ...a,
    currency: a.currency ?? "PLN",
    value: a.quantity * a.price,
  }));
  const totalValue = assets.reduce((acc, a) => acc + a.value, 0);

  return {
    id: dto.id,
    name: dto.name,
    totalValue,
    assets,
  };
}
