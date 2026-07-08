import { cn } from "@/lib/utils";

export function SectionEyebrow({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-brown uppercase",
        className,
      )}
    >
      <span className="text-pink-ink">{index}</span>
      <span aria-hidden className="h-px w-6 bg-border" />
      {label}
    </p>
  );
}
