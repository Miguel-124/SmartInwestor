import type { Portfolio } from "@/models/Portfolio";

export const demoPortfolio: Portfolio = {
  id: "demo",
  ownerId: "u1",
  currency: "PLN",
  createdAt: new Date().toISOString(),
  totalValue: 123456,
  dayPnl: 1234,
  ytdPnl: 12.34,
  positions: [
    {
      id: "p1",
      symbol: "AAPL",
      name: "Apple",
      qty: 10,
      price: 750,
      value: 7500,
      weight: 0.061,
      sector: "Tech",
    },
    {
      id: "p2",
      symbol: "MSFT",
      name: "Microsoft",
      qty: 8,
      price: 950,
      value: 7600,
      weight: 0.062,
      sector: "Tech",
    },
    {
      id: "p3",
      symbol: "TLT",
      name: "US Bonds",
      qty: 30,
      price: 100,
      value: 3000,
      weight: 0.024,
      sector: "Bonds",
    },
    {
      id: "p4",
      symbol: "CASH",
      name: "Cash",
      qty: 1,
      price: 1,
      value: 5000,
      weight: 0.04,
      sector: "Cash",
    },
  ],
};

export const demoMetrics = {
  equityCurve: Array.from({ length: 60 }, (_, i) => ({
    t: `D${i + 1}`,
    v: 100000 + i * 400 + Math.sin(i / 3) * 1200,
  })),
  drawdown: Array.from({ length: 60 }, (_, i) => ({
    t: `D${i + 1}`,
    v: -Math.abs(Math.sin(i / 5) * 0.12),
  })),
};

export const demoAdvice = {
  recommendations: [
    { id: "r1", type: "Rebalance", message: "Zredukuj Tech do 40%" },
    { id: "r2", type: "Opportunity", message: "Dodaj 5% obligacji (TLT)" },
    { id: "r3", type: "Risk", message: "Gotówka < 5% — rozważ poduszkę" },
  ],
};
