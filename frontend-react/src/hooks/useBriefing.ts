import { useQuery } from "@tanstack/react-query";

import { getTodayBriefing } from "../api/briefing";

/** Server resolves city/timezone from Dynamo prefs; stable key avoids refetch churn when profile loads. */
export function useBriefing() {
  return useQuery({
    queryKey: ["briefing"],
    queryFn: () => getTodayBriefing(),
    staleTime: 5 * 60_000,
  });
}
