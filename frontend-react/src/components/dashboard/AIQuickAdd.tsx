import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";

import { useParseEventText } from "../../hooks/useAI";
import { useCreateEvent } from "../../hooks/useEvents";
import { Button } from "../ui/Button";
import { Kbd } from "../ui/Kbd";

const SUGGESTIONS = [
  "Coffee with Sam tomorrow at 9am",
  "Dentist Friday 3:30pm",
  "Team standup every weekday at 9",
  "Gym tonight at 7pm",
];

export function AIQuickAdd() {
  const [text, setText] = useState("");
  const parse = useParseEventText();
  const create = useCreateEvent();
  const busy = parse.isPending || create.isPending;

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    const parsed = await parse.mutateAsync(text);
    await create.mutateAsync({
      title: parsed.title,
      datetime: parsed.datetime,
      category: parsed.category,
      location: parsed.location ?? null,
      notes: parsed.notes ?? null,
    });
    setText("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="surface-elevated mb-5 rounded-2xl p-3"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flame-500/15 text-flame-500">
          <Sparkles size={16} />
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type an event in plain English — e.g. “Lunch with Maya tomorrow at 1pm”"
          className="flex-1 bg-transparent text-sm text-ink-700 placeholder:text-ink-200 focus:outline-none dark:text-ink-50 dark:placeholder:text-ink-300"
          disabled={busy}
          aria-label="Add event with natural language"
        />
        <Button
          type="submit"
          size="sm"
          loading={busy}
          disabled={!text.trim()}
          className="shrink-0"
        >
          <Send size={14} />
          Add
        </Button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5 pl-11">
        <span className="self-center text-[0.65rem] text-ink-300 dark:text-ink-200">
          Try:
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setText(s)}
            className="rounded-full border border-cream-400/60 bg-cream-100 px-2 py-0.5 text-[0.7rem] text-ink-400 transition-colors hover:bg-flame-500/10 hover:text-flame-600 dark:border-ink-500/40 dark:bg-ink-700 dark:text-ink-200"
          >
            {s}
          </button>
        ))}
        <span className="ml-auto self-center text-[0.65rem] text-ink-300 dark:text-ink-200">
          <Kbd>⌘</Kbd> <Kbd>K</Kbd> for search
        </span>
      </div>
    </motion.div>
  );
}
