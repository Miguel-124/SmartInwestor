import { http, HttpResponse } from "msw";
import { demoPortfolio, demoMetrics, demoAdvice } from "./data";

export const handlers = [
  http.get("/api/v1/portfolio/:id", ({ params }) => {
    if (params.id !== "demo") {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json(demoPortfolio);
  }),
  http.get("/api/v1/portfolio/:id/metrics", ({ params }) => {
    if (params.id !== "demo") {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json(demoMetrics);
  }),
  http.get("/api/v1/portfolio/:id/advice", ({ params }) => {
    if (params.id !== "demo") {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json(demoAdvice);
  }),
  http.get("/api/v1/portfolio/:id/corr", ({ params }) => {
    if (params.id !== "demo") {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json({
      labels: ["AAPL", "MSFT", "TLT"],
      matrix: [
        [1, 0.42, -0.18],
        [0.42, 1, -0.12],
        [-0.18, -0.12, 1],
      ],
    });
  }),
];
