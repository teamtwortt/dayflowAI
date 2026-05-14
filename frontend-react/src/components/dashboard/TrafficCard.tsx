import { Car } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "../ui/Card";

export function TrafficCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car size={22} className="text-flame-500" />
          <div>
            <div className="text-sm font-semibold">Traffic to Office</div>
            <div className="text-xs text-ink-300 dark:text-ink-200">via I-95 N</div>
            <div className="text-xs font-medium text-flame-500">Light traffic</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-flame-500">25 min</div>
          <svg width="52" height="32" viewBox="0 0 52 32" className="overflow-visible">
            <polyline
              points="0,28 12,22 24,18 36,10 52,4"
              fill="none"
              stroke="#c87941"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="52" cy="4" r="3" fill="#c87941" />
          </svg>
        </div>
      </Card>
    </motion.div>
  );
}
