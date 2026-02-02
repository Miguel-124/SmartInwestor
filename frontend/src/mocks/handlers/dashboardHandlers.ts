import { http, HttpResponse } from "msw";
import { dashboardSummaryFixture } from "../fixtures/dashboardSummary";

export const dashboardHandlers = [
  http.get("/api/dashboard/summary", async () => {
    return HttpResponse.json(dashboardSummaryFixture);
  }),
];
