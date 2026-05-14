import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { useAIChat } from "../hooks/useAI";
import type { AIChatMessage } from "../api/ai";
import { cn } from "../lib/cn";

const STARTERS = [
  "What's on my calendar today?",
  "What should I do next?",
  "How busy is my week?",
  "Suggest a 90-min focus block for tomorrow",
];

export default function Assistant() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm DayFlow AI. Ask me about your schedule, weather, or what to do next.",
    },
  ]);
  const [input, setInput] = useState("");
  const chat = useAIChat();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    const next: AIChatMessage[] = [...messages, { role: "user", content: message }];
    setMessages(next);
    setInput("");
    const { reply } = await chat.mutateAsync({
      message,
      history: messages,
    });
    setMessages([...next, { role: "assistant", content: reply }]);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] w-full max-w-2xl flex-col px-4 py-5 sm:px-6 md:h-[calc(100vh-2rem)]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Assistant</h2>
          <p className="text-xs text-ink-300 dark:text-ink-200">
            Powered by Amazon Bedrock · Claude · with safe local fallback
          </p>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-cream-200/50 p-3 dark:bg-ink-600/40 sm:p-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={`${idx}-${m.role}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-2",
                m.role === "user" && "flex-row-reverse",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  m.role === "assistant"
                    ? "bg-flame-500/15 text-flame-500"
                    : "bg-ink-500 text-ink-50 dark:bg-cream-400 dark:text-ink-700",
                )}
              >
                {m.role === "assistant" ? <Sparkles size={14} /> : <User size={14} />}
              </div>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
                  m.role === "assistant"
                    ? "surface-elevated rounded-tl-sm"
                    : "rounded-tr-sm bg-flame-500 text-white",
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {chat.isPending ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-flame-500/15 text-flame-500">
              <Sparkles size={14} />
            </div>
            <div className="surface-elevated rounded-2xl rounded-tl-sm px-3.5 py-2">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-flame-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-flame-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-flame-500" />
              </span>
            </div>
          </motion.div>
        ) : null}
      </div>

      {messages.length <= 1 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-cream-400/60 bg-cream-200 px-3 py-1 text-xs text-ink-400 transition-colors hover:bg-flame-500/10 hover:text-flame-600 dark:border-ink-500/40 dark:bg-ink-600 dark:text-ink-100"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          placeholder="Ask the assistant... (Enter to send · Shift+Enter for newline)"
        />
        <Button
          onClick={() => send()}
          loading={chat.isPending}
          disabled={!input.trim()}
          size="lg"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
