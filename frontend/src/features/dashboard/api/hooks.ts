import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboardApi";
import { mapDashboardSummary } from "./mappers";

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const dto = await dashboardApi.getSummary();
      return mapDashboardSummary(dto);
    },
  });
}
