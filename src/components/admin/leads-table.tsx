"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Inbox, Trash2 } from "lucide-react";
import { AdminTable } from "@/components/admin/admin-table";
import { LeadStatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteLeadAction, updateLeadStatusAction } from "@/app/admin/actions/leads";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/content";

const STATUS_OPTIONS: LeadStatus[] = [
  "nuevo",
  "contactado",
  "confirmado",
  "descartado",
];

const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  confirmado: "Confirmado",
  descartado: "Descartado",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [viewing, setViewing] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [, startTransition] = useTransition();

  function handleStatusChange(lead: Lead, status: LeadStatus) {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, status);
      toast.success("Estado actualizado.");
      router.refresh();
    });
  }

  return (
    <>
      <AdminTable
        data={leads}
        rowKey={(lead) => lead.id}
        getSearchText={(lead) =>
          `${lead.fullName} ${lead.email} ${lead.courseInterest} ${lead.city}`
        }
        searchPlaceholder="Buscar formularios..."
        emptyState={
          <EmptyState
            icon={Inbox}
            title="Aún no hay solicitudes"
            description="Las solicitudes del formulario de contacto aparecerán aquí."
          />
        }
        columns={[
          {
            header: "Nombre",
            cell: (lead) => (
              <span className="font-medium text-foreground">
                {lead.fullName}
              </span>
            ),
          },
          { header: "Curso de interés", cell: (lead) => lead.courseInterest },
          { header: "Ciudad", cell: (lead) => lead.city },
          { header: "Fecha", cell: (lead) => formatDate(lead.createdAt) },
          {
            header: "Estado",
            cell: (lead) => (
              <Select
                value={lead.status}
                onValueChange={(value) =>
                  handleStatusChange(lead, value as LeadStatus)
                }
              >
                <SelectTrigger className="w-auto border-none bg-transparent p-0 shadow-none [&_svg]:hidden">
                  <LeadStatusBadge status={lead.status} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (lead) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Ver detalle"
                  onClick={() => setViewing(lead)}
                >
                  <Eye className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar"
                  onClick={() => setDeleteTarget(lead)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.fullName}</DialogTitle>
                <DialogDescription>
                  Solicitud del {formatDate(viewing.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 text-sm">
                <DetailRow label="Teléfono" value={viewing.phone} />
                <DetailRow label="Email" value={viewing.email} />
                <DetailRow label="Ciudad" value={viewing.city} />
                <DetailRow label="Curso de interés" value={viewing.courseInterest} />
                <DetailRow label="Nivel" value={viewing.experienceLevel} />
                {viewing.goal && <DetailRow label="Objetivo" value={viewing.goal} />}
                {viewing.message && (
                  <DetailRow label="Mensaje" value={viewing.message} />
                )}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`¿Eliminar la solicitud de "${deleteTarget?.fullName}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteLeadAction(deleteTarget.id);
          toast.success("Solicitud eliminada.");
          router.refresh();
        }}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
