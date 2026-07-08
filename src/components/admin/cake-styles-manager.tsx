"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GripVertical, Palette, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { cn } from "@/lib/utils";
import {
  createCakeStyleAction,
  deleteCakeStyleAction,
  reorderCakeStylesAction,
  toggleCakeStylePublishedAction,
  updateCakeStyleAction,
} from "@/app/admin/actions/cake-styles";
import type { CakeStyle } from "@/types/content";

function SortableRow({
  style,
  onEdit,
  onDelete,
  onToggle,
}: {
  style: CakeStyle;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: style.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-background px-4 py-3.5",
        isDragging && "z-10 opacity-70",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="flex size-7 cursor-grab items-center justify-center rounded-full text-muted-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </button>

      <p className="flex-1 font-medium text-foreground">{style.name}</p>

      <Switch checked={style.published} onCheckedChange={onToggle} />

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Editar estilo"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Eliminar estilo"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function CakeStylesManager({ styles }: { styles: CakeStyle[] }) {
  const router = useRouter();
  const [orderedStyles, setOrderedStyles] = useState(styles);
  const [editing, setEditing] = useState<CakeStyle | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CakeStyle | null>(null);
  const [name, setName] = useState("");
  const [published, setPublished] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [, startToggling] = useTransition();
  const [prevStyles, setPrevStyles] = useState(styles);

  if (styles !== prevStyles) {
    setPrevStyles(styles);
    setOrderedStyles(styles);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openNew() {
    setName("");
    setPublished(true);
    setEditing("new");
  }

  function openEdit(style: CakeStyle) {
    setName(style.name);
    setPublished(style.published);
    setEditing(style);
  }

  function save() {
    startSaving(async () => {
      const payload = { name, published };
      const result =
        editing && editing !== "new"
          ? await updateCakeStyleAction(editing.id, payload)
          : await createCakeStyleAction(payload);
      if (result.success) {
        toast.success("Estilo guardado.");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(style: CakeStyle) {
    startToggling(async () => {
      await toggleCakeStylePublishedAction(style.id);
      toast.success(style.published ? "Estilo ocultado." : "Estilo visible.");
      router.refresh();
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedStyles((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      reorderCakeStylesAction(next.map((item) => item.id)).then(() =>
        router.refresh(),
      );
      return next;
    });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={openNew}
          className="h-auto rounded-full bg-foreground px-5 py-2.5 text-primary-foreground hover:bg-foreground/85"
        >
          <Plus className="size-4" />
          Añadir estilo
        </Button>
      </div>

      {orderedStyles.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="Aún no hay estilos"
          description="Añade el primer estilo de tarta disponible."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedStyles.map((style) => style.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {orderedStyles.map((style) => (
                <SortableRow
                  key={style.id}
                  style={style}
                  onEdit={() => openEdit(style)}
                  onDelete={() => setDeleteTarget(style)}
                  onToggle={() => handleToggle(style)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing === "new" ? "Añadir estilo" : "Editar estilo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="style-name">Nombre</Label>
              <Input
                id="style-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="style-published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="style-published">Visible en el sitio</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={isSaving}
              className="bg-foreground text-primary-foreground hover:bg-foreground/85"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`¿Eliminar el estilo "${deleteTarget?.name}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCakeStyleAction(deleteTarget.id);
          toast.success("Estilo eliminado.");
          router.refresh();
        }}
      />
    </div>
  );
}
