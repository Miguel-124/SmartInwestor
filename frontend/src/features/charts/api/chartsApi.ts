import type { ChartsOverviewDto, ChartsRange } from "../types";

export async function getChartsOverview(params: {
  range: ChartsRange;
  points: number;
}) {
  const qs = new URLSearchParams({
    range: params.range,
    points: String(params.points),
  });

  const response = await fetch(`/api/charts/overview?${qs.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<ChartsOverviewDto>;
}
