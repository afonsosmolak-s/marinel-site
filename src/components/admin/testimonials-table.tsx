"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Quote, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/admin-table";
import { PublishedBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deleteTestimonialAction,
  toggleTestimonialPublishedAction,
} from "@/app/admin/actions/testimonials";
import type { Testimonial } from "@/types/content";

export function TestimonialsTable({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(item: Testimonial) {
    startTransition(async () => {
      await toggleTestimonialPublishedAction(item.id);
      toast.success(item.published ? "Testimonio ocultado." : "Testimonio publicado.");
      router.refresh();
    });
  }

  return (
    <>
      <AdminTable
        data={testimonials}
        rowKey={(item) => item.id}
        getSearchText={(item) => `${item.authorName} ${item.content}`}
        searchPlaceholder="Buscar testimonios..."
        emptyState={
          <EmptyState
            icon={Quote}
            title="Aún no hay testimonios"
            description="Añade la primera opinión de una alumna o clienta."
            action={
              <LinkButton
                href="/admin/testimonios/nuevo"
                className="mt-2 h-auto rounded-full px-5 py-2.5"
              >
                Crear testimonio
              </LinkButton>
            }
          />
        }
        columns={[
          {
            header: "Autora",
            cell: (item) => (
              <span className="font-medium text-foreground">
                {item.authorName}
              </span>
            ),
          },
          {
            header: "Testimonio",
            cell: (item) => (
              <span className="line-clamp-1 max-w-xs text-muted-foreground">
                {item.content}
              </span>
            ),
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
                  href={`/admin/testimonios/${item.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                  aria-label={`Editar ${item.authorName}`}
                >
                  <Pencil className="size-3.5" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Eliminar ${item.authorName}`}
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
        title={`¿Eliminar el testimonio de "${deleteTarget?.authorName}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteTestimonialAction(deleteTarget.id);
          toast.success("Testimonio eliminado.");
          router.refresh();
        }}
      />
    </>
  );
}
