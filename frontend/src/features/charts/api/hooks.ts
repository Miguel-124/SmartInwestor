import { useQuery } from "@tanstack/react-query";
import type { ChartsRange } from "../types";
import { getChartsOverview } from "./chartsApi";

export function useChartsOverviewQuery(range: ChartsRange, points: number) {
  return useQuery({
    queryKey: ["charts-overview", range, points],
    queryFn: () => getChartsOverview({ range, points }),
  });
}
