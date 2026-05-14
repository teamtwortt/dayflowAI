import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  hideClose?: boolean;
  initialFocus?: boolean;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-ink-700/40 backdrop-blur-sm dark:bg-ink-800/60"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "relative w-full overflow-hidden rounded-t-3xl border border-cream-400/60 bg-cream-200 shadow-soft dark:border-ink-500/40 dark:bg-ink-600 sm:rounded-3xl",
              sizes[size],
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-start justify-between gap-4 px-5 pt-5">
                <div className="min-w-0">
                  {title ? (
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                  ) : null}
                  {description ? (
                    <p className="mt-0.5 text-xs text-ink-300 dark:text-ink-200">
                      {description}
                    </p>
                  ) : null}
                </div>
                {!hideClose ? (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-300 hover:bg-cream-300/70 dark:text-ink-200 dark:hover:bg-ink-500/40"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
            )}
            <div className="px-5 pb-5 pt-3">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
