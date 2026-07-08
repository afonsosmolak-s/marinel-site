"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GripVertical, Images, Pencil, Plus, Trash2 } from "lucide-react";
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
  rectSortingStrategy,
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
import { ImageField } from "@/components/admin/image-field";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { cn } from "@/lib/utils";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  reorderGalleryImagesAction,
  toggleGalleryImagePublishedAction,
  updateGalleryImageAction,
} from "@/app/admin/actions/gallery";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryImage,
  type ImagePosition,
} from "@/types/content";

function SortableTile({
  image,
  onEdit,
  onDelete,
  onToggle,
}: {
  image: GalleryImage;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(isDragging && "z-10 opacity-70")}
    >
      <div className="relative">
        <MediaPlaceholder
          src={image.imageUrl}
          alt={image.caption ?? "Imagen de la galería"}
          ratio="tall"
          position={image.imagePosition}
          caption={image.caption ?? undefined}
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Reordenar"
          className="absolute top-2 left-2 flex size-7 cursor-grab items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" />
        </button>
      </div>
      {image.categories.length > 0 && (
        <p className="mt-1.5 text-[0.65rem] text-muted-foreground">
          {image.categories.join(" · ")}
        </p>
      )}
      <div className="mt-1.5 flex items-center justify-between">
        <Switch size="sm" checked={image.published} onCheckedChange={onToggle} />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Editar imagen"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Eliminar imagen"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [orderedImages, setOrderedImages] = useState(images);
  const [editing, setEditing] = useState<GalleryImage | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState<ImagePosition | null>(null);
  const [caption, setCaption] = useState("");
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [, startToggling] = useTransition();
  const [prevImages, setPrevImages] = useState(images);

  // Sincroniza el estado local (necesario para el feedback optimista del
  // drag-and-drop) con los props tras un router.refresh() — patrón de
  // ajuste de estado durante el render, no en un efecto.
  if (images !== prevImages) {
    setPrevImages(images);
    setOrderedImages(images);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openNew() {
    setImageUrl(null);
    setImagePosition(null);
    setCaption("");
    setCategories([]);
    setFeatured(false);
    setPublished(true);
    setEditing("new");
  }

  function openEdit(image: GalleryImage) {
    setImageUrl(image.imageUrl);
    setImagePosition(image.imagePosition);
    setCaption(image.caption ?? "");
    setCategories(image.categories);
    setFeatured(image.featured);
    setPublished(image.published);
    setEditing(image);
  }

  function toggleCategory(category: GalleryCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function save() {
    startSaving(async () => {
      const payload = {
        imageUrl,
        imagePosition,
        caption: caption || null,
        categories,
        featured,
        published,
      };
      const result =
        editing && editing !== "new"
          ? await updateGalleryImageAction(editing.id, payload)
          : await createGalleryImageAction(payload);
      if (result.success) {
        toast.success("Imagen guardada.");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(image: GalleryImage) {
    startToggling(async () => {
      await toggleGalleryImagePublishedAction(image.id);
      toast.success(image.published ? "Imagen ocultada." : "Imagen publicada.");
      router.refresh();
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedImages((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      reorderGalleryImagesAction(next.map((item) => item.id)).then(() =>
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
          Añadir imagen
        </Button>
      </div>

      {orderedImages.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Aún no hay imágenes"
          description="Añade la primera fotografía de la galería."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedImages.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {orderedImages.map((image) => (
                <SortableTile
                  key={image.id}
                  image={image}
                  onEdit={() => openEdit(image)}
                  onDelete={() => setDeleteTarget(image)}
                  onToggle={() => handleToggle(image)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing === "new" ? "Añadir imagen" : "Editar imagen"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageField
              folder="gallery"
              imageUrl={imageUrl}
              imagePosition={imagePosition}
              ratio="tall"
              className="max-w-[200px]"
              onImageUrlChange={setImageUrl}
              onPositionChange={setImagePosition}
            />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="caption">Descripción</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Categorías</Label>
              <div className="flex flex-wrap gap-1.5">
                {GALLERY_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      categories.includes(category)
                        ? "border-pink bg-pink-tint text-pink-ink"
                        : "border-border text-muted-foreground hover:border-pink",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="gallery-featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="gallery-featured">
                Destacada{" "}
                <span className="font-normal text-muted-foreground">
                  (muestra una etiqueta &quot;Destacado&quot; sobre la foto)
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="gallery-published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="gallery-published">Publicada</Label>
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
        title="¿Eliminar esta imagen?"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteGalleryImageAction(deleteTarget.id);
          toast.success("Imagen eliminada.");
          router.refresh();
        }}
      />
    </div>
  );
}
