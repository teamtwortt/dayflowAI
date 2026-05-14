import { motion } from "framer-motion";

import { getGreeting } from "../../lib/format";

interface GreetingProps {
  serverGreeting?: string;
  summary?: string;
  name?: string | null;
}

function firstName(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/)[0];
}

export function Greeting({ serverGreeting, summary, name }: GreetingProps) {
  const { title, sub } = getGreeting();
  const first = firstName(name);
  const base = serverGreeting || title;
  const heading = first ? `${base}, ${first}!` : `${base}!`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-5"
    >
      <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm text-ink-300 dark:text-ink-200">
        {summary || sub}
      </p>
    </motion.div>
  );
}
