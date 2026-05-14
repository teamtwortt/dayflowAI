import { api } from "./client";
import type { Briefing } from "./types";

export async function getTodayBriefing(city?: string): Promise<Briefing> {
  const { data } = await api.get<Briefing>("/briefing/today", {
    params: city ? { city } : undefined,
  });
  return data;
}
