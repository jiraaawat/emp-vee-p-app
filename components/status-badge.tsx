import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string; classes: string }> = {
  active: { label: "Active", classes: "bg-secondary/10 text-secondary border-secondary/20" },
  resigned: { label: "Resigned", classes: "bg-surface-container-high text-on-surface-variant border-white/10" },
  present: { label: "Present", classes: "bg-secondary/10 text-secondary border-secondary/20" },
  absent: { label: "Absent", classes: "bg-error/10 text-error border-error/20" },
  late: { label: "Late", classes: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  leave: { label: "Leave", classes: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "Pending", classes: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  approved: { label: "Approved", classes: "bg-secondary/10 text-secondary border-secondary/20" },
  rejected: { label: "Rejected", classes: "bg-error/10 text-error border-error/20" },
  open: { label: "Open", classes: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  resolved: { label: "Resolved", classes: "bg-secondary/10 text-secondary border-secondary/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status.toLowerCase()] || {
    label: status,
    classes: "bg-surface-container-high text-on-surface border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.classes,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
