import { useMutation, useQuery } from "@tanstack/react-query";
import { profileApi } from "./profileApi";
import { mapProfile } from "./mappers";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => mapProfile(await profileApi.getProfile()),
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: profileApi.updateProfile,
  });
}
