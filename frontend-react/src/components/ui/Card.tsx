import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
  padded?: boolean;
  hover?: boolean;
  children?: ReactNode;
}

export function Card({
  as = "div",
  className,
  padded = true,
  hover = false,
  children,
  ...rest
}: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "rounded-2xl surface-elevated",
        padded && "p-4 sm:p-5",
        hover && "transition-colors hover:bg-cream-300/60 dark:hover:bg-ink-500/40",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
