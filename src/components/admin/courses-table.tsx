"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/admin-table";
import { PublishedBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deleteCourseAction,
  toggleCoursePublishedAction,
} from "@/app/admin/actions/courses";
import type { Course } from "@/types/content";

export function CoursesTable({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(course: Course) {
    startTransition(async () => {
      await toggleCoursePublishedAction(course.id);
      toast.success(course.published ? "Curso ocultado." : "Curso publicado.");
      router.refresh();
    });
  }

  return (
    <>
      <AdminTable
        data={courses}
        rowKey={(course) => course.id}
        getSearchText={(course) => `${course.title} ${course.level} ${course.format}`}
        searchPlaceholder="Buscar cursos..."
        emptyState={
          <EmptyState
            icon={BookOpen}
            title="Aún no hay cursos"
            description="Crea tu primer curso para que aparezca en la web."
            action={
              <LinkButton
                href="/admin/cursos/nuevo"
                className="mt-2 h-auto rounded-full px-5 py-2.5"
              >
                Crear curso
              </LinkButton>
            }
          />
        }
        columns={[
          {
            header: "Título",
            cell: (course) => (
              <span className="font-medium text-foreground">
                {course.title}
              </span>
            ),
          },
          { header: "Nivel", cell: (course) => course.level },
          { header: "Formato", cell: (course) => course.format },
          {
            header: "Estado",
            cell: (course) => (
              <div className="flex items-center gap-2.5">
                <Switch
                  size="sm"
                  checked={course.published}
                  onCheckedChange={() => handleToggle(course)}
                />
                <PublishedBadge published={course.published} />
              </div>
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (course) => (
              <div className="flex justify-end gap-1">
                <Link
                  href={`/admin/cursos/${course.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                  aria-label={`Editar ${course.title}`}
                >
                  <Pencil className="size-3.5" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Eliminar ${course.title}`}
                  onClick={() => setDeleteTarget(course)}
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
        description="Esta acción no se puede deshacer. El curso dejará de estar disponible en la web."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCourseAction(deleteTarget.id);
          toast.success("Curso eliminado.");
          router.refresh();
        }}
      />
    </>
  );
}
