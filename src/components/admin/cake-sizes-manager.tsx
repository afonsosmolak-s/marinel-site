"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GripVertical, Pencil, Plus, Ruler, Trash2 } from "lucide-react";
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
import { cn, formatCakeDimensions } from "@/lib/utils";
import {
  createCakeSizeAction,
  deleteCakeSizeAction,
  reorderCakeSizesAction,
  toggleCakeSizePublishedAction,
  updateCakeSizeAction,
} from "@/app/admin/actions/cake-sizes";
import type { CakeSize } from "@/types/content";

function SortableRow({
  size,
  onEdit,
  onDelete,
  onToggle,
}: {
  size: CakeSize;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: size.id });

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

      <div className="flex-1">
        <p className="font-medium text-foreground">{size.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatCakeDimensions(size.width, size.height)}
        </p>
      </div>

      <Switch checked={size.published} onCheckedChange={onToggle} />

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Editar tamaño"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Eliminar tamaño"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function CakeSizesManager({ sizes }: { sizes: CakeSize[] }) {
  const router = useRouter();
  const [orderedSizes, setOrderedSizes] = useState(sizes);
  const [editing, setEditing] = useState<CakeSize | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CakeSize | null>(null);
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [published, setPublished] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [, startToggling] = useTransition();
  const [prevSizes, setPrevSizes] = useState(sizes);

  if (sizes !== prevSizes) {
    setPrevSizes(sizes);
    setOrderedSizes(sizes);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openNew() {
    setName("");
    setWidth("");
    setHeight("");
    setPublished(true);
    setEditing("new");
  }

  function openEdit(size: CakeSize) {
    setName(size.name);
    setWidth(String(size.width));
    setHeight(String(size.height));
    setPublished(size.published);
    setEditing(size);
  }

  function save() {
    startSaving(async () => {
      const payload = {
        name,
        width: Number(width),
        height: Number(height),
        published,
      };
      const result =
        editing && editing !== "new"
          ? await updateCakeSizeAction(editing.id, payload)
          : await createCakeSizeAction(payload);
      if (result.success) {
        toast.success("Tamaño guardado.");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(size: CakeSize) {
    startToggling(async () => {
      await toggleCakeSizePublishedAction(size.id);
      toast.success(size.published ? "Tamaño ocultado." : "Tamaño visible.");
      router.refresh();
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedSizes((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      reorderCakeSizesAction(next.map((item) => item.id)).then(() =>
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
          Añadir tamaño
        </Button>
      </div>

      {orderedSizes.length === 0 ? (
        <EmptyState
          icon={Ruler}
          title="Aún no hay tamaños"
          description="Añade el primer tamaño de tarta disponible."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedSizes.map((size) => size.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {orderedSizes.map((size) => (
                <SortableRow
                  key={size.id}
                  size={size}
                  onEdit={() => openEdit(size)}
                  onDelete={() => setDeleteTarget(size)}
                  onToggle={() => handleToggle(size)}
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
              {editing === "new" ? "Añadir tamaño" : "Editar tamaño"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="size-name">Nombre</Label>
              <Input
                id="size-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="size-width">Ancho (cm)</Label>
                <Input
                  id="size-width"
                  type="number"
                  min={1}
                  value={width}
                  onChange={(event) => setWidth(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="size-height">Alto (cm)</Label>
                <Input
                  id="size-height"
                  type="number"
                  min={1}
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="size-published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="size-published">Visible en el sitio</Label>
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
        title={`¿Eliminar el tamaño "${deleteTarget?.name}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCakeSizeAction(deleteTarget.id);
          toast.success("Tamaño eliminado.");
          router.refresh();
        }}
      />
    </div>
  );
}
