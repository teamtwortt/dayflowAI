import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import * as ai from "../api/ai";
import { extractError } from "../api/client";

export function useParseEventText() {
  return useMutation({
    mutationFn: (text: string) => ai.parseEventText(text),
    onError: (err) => {
      toast.error(extractError(err, "Could not parse that"));
    },
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({
      message,
      history,
    }: {
      message: string;
      history: ai.AIChatMessage[];
    }) => ai.aiChat(message, history),
    onError: (err) => {
      toast.error(extractError(err, "Assistant is unavailable"));
    },
  });
}

export async function fetchAIBriefingText(): Promise<string | null> {
  try {
    const data = await ai.fetchAIBriefing();
    return data.text;
  } catch {
    return null;
  }
}
