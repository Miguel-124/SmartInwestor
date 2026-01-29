export type Position = {
  id: string;
  symbol: string;
  name: string;
  qty: number;
  price: number;
  value: number;
  weight: number;
  sector?: string;
};

export type Portfolio = {
  id: string;
  ownerId: string;
  currency: "PLN" | "USD" | "EUR";
  createdAt: string;
  positions: Position[];
  totalValue: number;
  dayPnl?: number;
  ytdPnl?: number;
};
