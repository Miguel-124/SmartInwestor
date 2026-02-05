import { httpClient } from "../../../shared/api/httpClient";
import type { AnalysisRequestDto, AnalysisResponseDto } from "../types";

export const analysisApi = {
  analyze: (payload: AnalysisRequestDto) =>
    httpClient<AnalysisResponseDto>("/api/analysis", {
      method: "POST",
      body: payload,
    }),
};
