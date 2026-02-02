import { httpClient } from "../../../shared/api/httpClient";
import type { DashboardSummaryDto } from "../types";

export const dashboardApi = {
  getSummary: () => httpClient<DashboardSummaryDto>("/dashboard/summary"),
};
