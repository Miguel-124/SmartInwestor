import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/http";
import type { Portfolio } from "../../../models/Portfolio";

export function usePortfolioQuery(id: string) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: () => http<Portfolio>(`/api/v1/portfolio/${id}`),
  });
}
