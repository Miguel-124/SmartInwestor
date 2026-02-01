import { Position } from "./Position";

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
