import { api } from "./client";
import type { EventCategory } from "./types";

export interface ParsedEvent {
  title: string;
  datetime: string;
  category: EventCategory;
  location?: string | null;
  notes?: string | null;
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function parseEventText(text: string): Promise<ParsedEvent> {
  const { data } = await api.post<ParsedEvent>("/ai/parse-event", { text });
  return data;
}

export async function fetchAIBriefing(): Promise<{ text: string | null }> {
  const { data } = await api.get<{ text: string | null }>("/ai/briefing");
  return data;
}

export async function aiChat(
  message: string,
  history: AIChatMessage[] = [],
): Promise<{ reply: string }> {
  const { data } = await api.post<{ reply: string }>("/ai/chat", {
    message,
    history,
  });
  return data;
}
