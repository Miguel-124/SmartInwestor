import { useQuery } from "@tanstack/react-query";
import { meApi } from "./meApi";
import { mapMe } from "./meMapper";

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => mapMe(await meApi.getMe()),
  });
}
