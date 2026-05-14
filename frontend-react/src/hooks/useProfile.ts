import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getMe, updatePreferences } from "../api/users";
import { extractError } from "../api/client";
import type { UserPreferences } from "../api/types";

export const profileKey = ["profile"] as const;

export function useProfile() {
  return useQuery({
    queryKey: profileKey,
    queryFn: getMe,
    staleTime: 5 * 60_000,
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<UserPreferences>) => updatePreferences(patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKey });
      qc.invalidateQueries({ queryKey: ["briefing"] });
      toast.success("Preferences saved");
    },
    onError: (err) => {
      toast.error(extractError(err, "Could not save preferences"));
    },
  });
}
