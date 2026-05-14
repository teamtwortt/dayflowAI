import { useQuery } from "@tanstack/react-query";

import { getTodayBriefing } from "../api/briefing";

export function useBriefing(city?: string) {
  return useQuery({
    queryKey: ["briefing", city ?? "default"],
    queryFn: () => getTodayBriefing(city),
    staleTime: 5 * 60_000,
  });
}
