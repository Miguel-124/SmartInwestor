import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/http";
import { ReactNode } from "react";

export type Recommendation = {
  text: ReactNode;
  id: string;
  type: "Rebalance" | "Risk" | "Opportunity";
  message: string;
};

export function useAdviceQuery(id: string) {
  return useQuery({
    queryKey: ["advice", id],
    queryFn: () =>
      http<{ recommendations: Recommendation[] }>(
        `/api/v1/portfolio/${id}/advice`,
      ),
  });
}
