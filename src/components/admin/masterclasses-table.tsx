"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AdminTable } from "@/components/admin/admin-table";
import { PublishedBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deleteMasterclassAction,
  toggleMasterclassPublishedAction,
} from "@/app/admin/actions/masterclasses";
import type { Masterclass } from "@/types/content";

export function MasterclassesTable({
  masterclasses,
}: {
  masterclasses: Masterclass[];
}) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Masterclass | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(item: Masterclass) {
    startTransition(async () => {
      await toggleMasterclassPublishedAction(item.id);
      toast.success(item.published ? "Masterclass ocultada." : "Masterclass publicada.");
      router.refresh();
    });
  }

  return (
    <>
      <AdminTable
        data={masterclasses}
        rowKey={(item) => item.id}
        getSearchText={(item) => item.title}
        searchPlaceholder="Buscar masterclasses..."
        emptyState={
          <EmptyState
            icon={CalendarDays}
            title="Aún no hay masterclasses"
            description="Crea la primera sesión para que aparezca en la web."
            action={
              <LinkButton
                href="/admin/masterclass/nuevo"
                className="mt-2 h-auto rounded-full px-5 py-2.5"
              >
                Crear masterclass
              </LinkButton>
            }
          />
        }
        columns={[
          {
            header: "Título",
            cell: (item) => (
              <span className="font-medium text-foreground">{item.title}</span>
            ),
          },
          {
            header: "Fecha",
            cell: (item) => (item.date ? formatDate(item.date) : "Próximamente"),
          },
          {
            header: "Plazas",
            cell: (item) => item.capacity ?? "—",
          },
          {
            header: "Estado",
            cell: (item) => (
              <div className="flex items-center gap-2.5">
                <Switch
                  size="sm"
                  checked={item.published}
                  onCheckedChange={() => handleToggle(item)}
                />
                <PublishedBadge published={item.published} />
              </div>
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (item) => (
              <div className="flex justify-end gap-1">
                <Link
                  href={`/admin/masterclass/${item.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                  aria-label={`Editar ${item.title}`}
                >
                  <Pencil className="size-3.5" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Eliminar ${item.title}`}
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`¿Eliminar "${deleteTarget?.title}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteMasterclassAction(deleteTarget.id);
          toast.success("Masterclass eliminada.");
          router.refresh();
        }}
      />
    </>
  );
}
