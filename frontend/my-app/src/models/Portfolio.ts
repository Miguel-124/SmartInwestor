export interface HistoryPoint {
  date: string;
  value: number;
}
export interface AllocationEntry {
  name: string;
  value: number;
}
export interface Holding {
  ticker: string;
  name: string;
  qty: number;
  currentPrice: number;
  pnl: number;
}
export interface Recommendation {
  id: string;
  text: string;
  type: "risk" | "opportunity";
}
export type CorrelationMatrix = Array<Array<string | number>>;

export const portfolioModel = {
  totalValue: 125000,
  dailyChange: -0.8,
  ytdChange: 12.5,
  history: [] as HistoryPoint[],
  allocation: [] as AllocationEntry[],
  holdings: [] as Holding[],
  correlations: [] as CorrelationMatrix,
  recommendations: [] as Recommendation[],
};
