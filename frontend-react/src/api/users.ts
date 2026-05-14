import { api } from "./client";
import type { UserPreferences, UserProfile } from "./types";

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/users/me");
  return data;
}

export async function updatePreferences(
  patch: Partial<UserPreferences>,
): Promise<UserPreferences> {
  const { data } = await api.put<UserPreferences>("/users/me/preferences", patch);
  return data;
}
