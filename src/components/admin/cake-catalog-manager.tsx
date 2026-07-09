"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cake, GripVertical, Layers, Pencil, Plus, Trash2 } from "lucide-react";
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
import { ImageField } from "@/components/admin/image-field";
import { cn } from "@/lib/utils";

// Item de catálogo del configurador de tartas (bizcochos y rellenos):
// nombre + visibilidad + imagen opcional. Mismo patrón que estilos/ocasiones.
export interface CatalogItem {
  id: string;
  name: string;
  imageUrl: string | null;
  orderIndex: number;
  published: boolean;
}

export interface CatalogItemPayload {
  name: string;
  published: boolean;
  imageUrl: string | null;
}

interface CatalogActions {
  create: (input: CatalogItemPayload) => Promise<{ success: boolean; error?: string }>;
  update: (id: string, input: CatalogItemPayload) => Promise<{ success: boolean; error?: string }>;
  remove: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
}

function SortableRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: CatalogItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

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

      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-xl object-cover"
        />
      )}

      <p className="flex-1 font-medium text-foreground">{item.name}</p>

      <Switch checked={item.published} onCheckedChange={onToggle} />

      <div className="flex gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={onEdit}>
          <Pencil className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Eliminar" onClick={onDelete}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// El icono se resuelve aquí dentro (no via prop) — los componentes no pueden
// cruzar la frontera server → client de RSC.
const VARIANT_ICONS = { bizcocho: Cake, relleno: Layers } as const;

export function CakeCatalogManager({
  items,
  labels,
  variant,
  uploadFolder,
  actions,
}: {
  items: CatalogItem[];
  labels: {
    singular: string; // "bizcocho" | "relleno"
    addButton: string; // "Añadir bizcocho"
    emptyTitle: string;
    emptyDescription: string;
  };
  variant: keyof typeof VARIANT_ICONS;
  uploadFolder: string;
  actions: CatalogActions;
}) {
  const icon = VARIANT_ICONS[variant];
  const router = useRouter();
  const [orderedItems, setOrderedItems] = useState(items);
  const [editing, setEditing] = useState<CatalogItem | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [name, setName] = useState("");
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [, startToggling] = useTransition();
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setOrderedItems(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openNew() {
    setName("");
    setPublished(true);
    setImageUrl(null);
    setEditing("new");
  }

  function openEdit(item: CatalogItem) {
    setName(item.name);
    setPublished(item.published);
    setImageUrl(item.imageUrl);
    setEditing(item);
  }

  function save() {
    startSaving(async () => {
      const payload = { name, published, imageUrl };
      const result =
        editing && editing !== "new"
          ? await actions.update(editing.id, payload)
          : await actions.create(payload);
      if (result.success) {
        toast.success(`${capitalize(labels.singular)} guardado.`);
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "No se pudo guardar.");
      }
    });
  }

  function handleToggle(item: CatalogItem) {
    startToggling(async () => {
      await actions.toggle(item.id);
      toast.success(
        item.published
          ? `${capitalize(labels.singular)} ocultado.`
          : `${capitalize(labels.singular)} visible.`,
      );
      router.refresh();
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      actions.reorder(next.map((item) => item.id)).then(() => router.refresh());
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
          {labels.addButton}
        </Button>
      </div>

      {orderedItems.length === 0 ? (
        <EmptyState
          icon={icon}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {orderedItems.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  onEdit={() => openEdit(item)}
                  onDelete={() => setDeleteTarget(item)}
                  onToggle={() => handleToggle(item)}
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
              {editing === "new"
                ? labels.addButton
                : `Editar ${labels.singular}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="catalog-name">Nombre</Label>
              <Input
                id="catalog-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Imagen (opcional)</Label>
              <ImageField
                folder={uploadFolder}
                imageUrl={imageUrl}
                imagePosition={null}
                onImageUrlChange={setImageUrl}
                onPositionChange={() => {}}
                ratio="square"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="catalog-published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="catalog-published">Visible en el sitio</Label>
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
        title={`¿Eliminar "${deleteTarget?.name}"?`}
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await actions.remove(deleteTarget.id);
          toast.success(`${capitalize(labels.singular)} eliminado.`);
          router.refresh();
        }}
      />
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
