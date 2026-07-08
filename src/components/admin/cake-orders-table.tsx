"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CakeSlice, Eye, MessageCircle, Trash2 } from "lucide-react";
import { AdminTable } from "@/components/admin/admin-table";
import { CakeOrderStatusBadge } from "@/components/admin/status-badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteCakeOrderAction,
  updateCakeOrderStatusAction,
} from "@/app/admin/actions/cake-orders";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp-message";
import { formatDate } from "@/lib/utils";
import type { CakeOrder, CakeOrderStatus } from "@/types/content";

const STATUS_OPTIONS: CakeOrderStatus[] = [
  "pendiente",
  "contactado",
  "completado",
];

const STATUS_LABEL: Record<CakeOrderStatus, string> = {
  pendiente: "Pendiente",
  contactado: "Contactado",
  completado: "Completado",
};

export function CakeOrdersTable({ orders }: { orders: CakeOrder[] }) {
  const router = useRouter();
  const [viewing, setViewing] = useState<CakeOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CakeOrder | null>(null);
  const [, startTransition] = useTransition();

  function handleStatusChange(order: CakeOrder, status: CakeOrderStatus) {
    startTransition(async () => {
      await updateCakeOrderStatusAction(order.id, status);
      toast.success("Estado actualizado.");
      router.refresh();
      setViewing((current) =>
        current && current.id === order.id ? { ...current, status } : current,
      );
    });
  }

  return (
    <>
      <AdminTable
        data={orders}
        rowKey={(order) => order.id}
        getSearchText={(order) =>
          `${order.fullName} ${order.email} ${order.occasion} ${order.flavour}`
        }
        searchPlaceholder="Buscar pedidos..."
        emptyState={
          <EmptyState
            icon={CakeSlice}
            title="Aún no hay pedidos"
            description="Las solicitudes de tartas a medida aparecerán aquí."
          />
        }
        columns={[
          {
            header: "Nombre",
            cell: (order) => (
              <span className="font-medium text-foreground">
                {order.fullName}
              </span>
            ),
          },
          { header: "Ocasión", cell: (order) => order.occasion },
          {
            header: "Tamaño",
            cell: (order) =>
              order.sizeDimensions
                ? `${order.size} (${order.sizeDimensions})`
                : order.size,
          },
          {
            header: "Fecha deseada",
            cell: (order) => formatDate(order.desiredDate),
          },
          {
            header: "Estado",
            cell: (order) => (
              <Select
                value={order.status}
                onValueChange={(value) =>
                  handleStatusChange(order, value as CakeOrderStatus)
                }
              >
                <SelectTrigger className="w-auto border-none bg-transparent p-0 shadow-none [&_svg]:hidden">
                  <CakeOrderStatusBadge status={order.status} />
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
            cell: (order) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Ver detalle"
                  onClick={() => setViewing(order)}
                >
                  <Eye className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar"
                  onClick={() => setDeleteTarget(order)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.fullName}</DialogTitle>
                <DialogDescription>
                  Pedido del {formatDate(viewing.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 text-sm">
                <DetailRow label="Teléfono" value={viewing.phone} />
                <DetailRow label="Email" value={viewing.email} />
                <DetailRow label="Ocasión" value={viewing.occasion} />
                {viewing.style && (
                  <DetailRow label="Estilo" value={viewing.style} />
                )}
                <DetailRow label="Bizcocho" value={viewing.flavour} />
                <DetailRow label="Relleno" value={viewing.filling} />
                <DetailRow
                  label="Tamaño"
                  value={
                    viewing.sizeDimensions
                      ? `${viewing.size} (${viewing.sizeDimensions})`
                      : viewing.size
                  }
                />
                <DetailRow
                  label="Fecha deseada"
                  value={formatDate(viewing.desiredDate)}
                />
                <DetailRow label="Descripción" value={viewing.description} />
              </dl>
              <DialogFooter className="flex-col items-stretch gap-2 sm:flex-col">
                <a
                  href={buildWhatsAppChatUrl(viewing.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/85"
                >
                  <MessageCircle className="size-4" strokeWidth={1.5} />
                  Abrir WhatsApp
                </a>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={viewing.status === "contactado"}
                    onClick={() => handleStatusChange(viewing, "contactado")}
                  >
                    Marcar como contactado
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={viewing.status === "completado"}
                    onClick={() => handleStatusChange(viewing, "completado")}
                  >
                    Marcar como completado
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`¿Eliminar el pedido de "${deleteTarget?.fullName}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCakeOrderAction(deleteTarget.id);
          toast.success("Pedido eliminado.");
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
