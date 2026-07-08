"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GripVertical, PartyPopper, Pencil, Plus, Trash2 } from "lucide-react";
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
  createCakeOccasionAction,
  deleteCakeOccasionAction,
  reorderCakeOccasionsAction,
  toggleCakeOccasionPublishedAction,
  updateCakeOccasionAction,
} from "@/app/admin/actions/cake-occasions";
import type { CakeOccasion } from "@/types/content";

function SortableRow({
  occasion,
  onEdit,
  onDelete,
  onToggle,
}: {
  occasion: CakeOccasion;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: occasion.id });

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

      <p className="flex-1 font-medium text-foreground">{occasion.name}</p>

      <Switch checked={occasion.published} onCheckedChange={onToggle} />

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Editar ocasión"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Eliminar ocasión"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function CakeOccasionsManager({
  occasions,
}: {
  occasions: CakeOccasion[];
}) {
  const router = useRouter();
  const [orderedOccasions, setOrderedOccasions] = useState(occasions);
  const [editing, setEditing] = useState<CakeOccasion | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CakeOccasion | null>(null);
  const [name, setName] = useState("");
  const [published, setPublished] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [, startToggling] = useTransition();
  const [prevOccasions, setPrevOccasions] = useState(occasions);

  if (occasions !== prevOccasions) {
    setPrevOccasions(occasions);
    setOrderedOccasions(occasions);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openNew() {
    setName("");
    setPublished(true);
    setEditing("new");
  }

  function openEdit(occasion: CakeOccasion) {
    setName(occasion.name);
    setPublished(occasion.published);
    setEditing(occasion);
  }

  function save() {
    startSaving(async () => {
      const payload = { name, published };
      const result =
        editing && editing !== "new"
          ? await updateCakeOccasionAction(editing.id, payload)
          : await createCakeOccasionAction(payload);
      if (result.success) {
        toast.success("Ocasión guardada.");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(occasion: CakeOccasion) {
    startToggling(async () => {
      await toggleCakeOccasionPublishedAction(occasion.id);
      toast.success(
        occasion.published ? "Ocasión ocultada." : "Ocasión visible.",
      );
      router.refresh();
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedOccasions((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      reorderCakeOccasionsAction(next.map((item) => item.id)).then(() =>
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
          Añadir ocasión
        </Button>
      </div>

      {orderedOccasions.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Aún no hay ocasiones"
          description="Añade la primera ocasión disponible."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedOccasions.map((occasion) => occasion.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {orderedOccasions.map((occasion) => (
                <SortableRow
                  key={occasion.id}
                  occasion={occasion}
                  onEdit={() => openEdit(occasion)}
                  onDelete={() => setDeleteTarget(occasion)}
                  onToggle={() => handleToggle(occasion)}
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
              {editing === "new" ? "Añadir ocasión" : "Editar ocasión"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="occasion-name">Nombre</Label>
              <Input
                id="occasion-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="occasion-published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="occasion-published">Visible en el sitio</Label>
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
        title={`¿Eliminar la ocasión "${deleteTarget?.name}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCakeOccasionAction(deleteTarget.id);
          toast.success("Ocasión eliminada.");
          router.refresh();
        }}
      />
    </div>
  );
}
