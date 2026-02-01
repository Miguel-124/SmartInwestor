import { create } from "zustand";

export type PortfolioFilters = {
  search: string;
  sector: string | null;
  minWeight: number | null; // w %
  maxWeight: number | null; // w %
};
interface PortfolioUIState {
  filters: PortfolioFilters;
  setFilter: <K extends keyof PortfolioFilters>(
    k: K,
    v: PortfolioFilters[K],
  ) => void;
  reset: () => void;
}
export const usePortfolioUI = create<PortfolioUIState>((set) => ({
  filters: { search: "", sector: null, minWeight: null, maxWeight: null },
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  reset: () =>
    set({
      filters: { search: "", sector: null, minWeight: null, maxWeight: null },
    }),
}));
