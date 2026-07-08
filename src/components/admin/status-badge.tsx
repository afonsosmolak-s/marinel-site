import { cn } from "@/lib/utils";
import type { CakeOrderStatus, LeadStatus } from "@/types/content";

const TONES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  neutral: "bg-muted text-muted-foreground border-border",
  pink: "bg-pink-tint text-pink-ink border-pink/40",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
} as const;

export function StatusBadge({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        TONES[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <StatusBadge tone={published ? "success" : "neutral"}>
      {published ? "Publicado" : "Borrador"}
    </StatusBadge>
  );
}

const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  confirmado: "Confirmado",
  descartado: "Descartado",
};

const LEAD_STATUS_TONE: Record<LeadStatus, keyof typeof TONES> = {
  nuevo: "pink",
  contactado: "warning",
  confirmado: "success",
  descartado: "neutral",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <StatusBadge tone={LEAD_STATUS_TONE[status]}>
      {LEAD_STATUS_LABEL[status]}
    </StatusBadge>
  );
}

const ORDER_STATUS_LABEL: Record<CakeOrderStatus, string> = {
  pendiente: "Pendiente",
  contactado: "Contactado",
  completado: "Completado",
};

const ORDER_STATUS_TONE: Record<CakeOrderStatus, keyof typeof TONES> = {
  pendiente: "pink",
  contactado: "warning",
  completado: "success",
};

export function CakeOrderStatusBadge({ status }: { status: CakeOrderStatus }) {
  return (
    <StatusBadge tone={ORDER_STATUS_TONE[status]}>
      {ORDER_STATUS_LABEL[status]}
    </StatusBadge>
  );
}
