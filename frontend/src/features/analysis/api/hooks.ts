import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "./analysisApi";
import type { AnalysisRequestDto } from "../types";

export function useAnalysisQuery(params: AnalysisRequestDto | null) {
  return useQuery({
    queryKey: [
      "analysis",
      params?.riskProfile ?? "none",
      params
        ? params.portfolios.map((p) => `${p.id}:${p.totalValue}`).join("|")
        : "empty",
    ],
    queryFn: async () => {
      if (!params) throw new Error("Brak danych do analizy");
      const payload: AnalysisRequestDto = {
        riskProfile: params.riskProfile,
        portfolios: params.portfolios.map((p) => ({
          id: p.id,
          name: p.name,
          totalValue: p.totalValue,
          assets: p.assets.map((a) => ({
            symbol: a.symbol,
            name: a.name,
            value: a.value,
          })),
        })),
      };
      return analysisApi.analyze(payload);
    },
    enabled: !!params,
  });
}
