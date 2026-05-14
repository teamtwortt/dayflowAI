import { Plus } from "lucide-react";

import { Button } from "../ui/Button";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

export function SectionHeader({
  title,
  onViewAll,
  onAdd,
  addLabel = "Add",
}: SectionHeaderProps) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-bold tracking-tight">{title}</h3>
      <div className="flex items-center gap-3">
        {onViewAll ? (
          <button
            onClick={onViewAll}
            className="focus-ring rounded-md text-sm font-medium text-flame-500 hover:underline"
          >
            View all ›
          </button>
        ) : null}
        {onAdd ? (
          <Button size="sm" onClick={onAdd}>
            <Plus size={14} strokeWidth={2.5} />
            {addLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
