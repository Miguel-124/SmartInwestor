import { useQuery } from "@tanstack/react-query";
import { http } from "../../../api/http";

export function useCorrQuery(id: string) {
  return useQuery({
    queryKey: ["corr", id],
    queryFn: () =>
      http<{ labels: string[]; matrix: number[][] }>(
        `/api/v1/portfolio/${id}/corr`,
      ),
  });
}
