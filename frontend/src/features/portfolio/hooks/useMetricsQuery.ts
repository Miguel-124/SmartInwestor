import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/http";

export type MetricPoint = { t: string; v: number };

export function useMetricsQuery(id: string) {
  return useQuery({
    queryKey: ["metrics", id],
    queryFn: () =>
      http<{ equityCurve: MetricPoint[]; drawdown: MetricPoint[] }>(
        `/api/v1/portfolio/${id}/metrics`,
      ),
  });
}
