import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <Icon className="size-6 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-heading text-lg text-foreground">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
