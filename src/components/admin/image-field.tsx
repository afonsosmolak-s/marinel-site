"use client";

import { useRef, useTransition } from "react";
import { Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/app/admin/actions/upload";
import { MediaPlaceholder, type MediaRatio } from "@/components/media-placeholder";
import { ImagePositionEditor } from "@/components/admin/image-position-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImagePosition } from "@/types/content";

// Campo de imagen estándar del panel: subida + encuadre (punto focal/zoom)
// en un solo componente. Úsese en cualquier formulario con una imagen —
// nunca imágenes hardcodeadas, todo pasa por aquí.
export function ImageField({
  folder,
  imageUrl,
  imagePosition,
  onImageUrlChange,
  onPositionChange,
  ratio = "tall",
  className,
}: {
  folder: string;
  imageUrl: string | null;
  imagePosition: ImagePosition | null;
  onImageUrlChange: (url: string | null) => void;
  onPositionChange: (position: ImagePosition | null) => void;
  ratio?: MediaRatio;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData, folder);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      onImageUrlChange(result.url);
      onPositionChange(null);
    });
  }

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {imageUrl ? (
        <div className="space-y-2">
          <ImagePositionEditor
            src={imageUrl}
            value={imagePosition}
            onChange={onPositionChange}
            ratio={ratio}
          />
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              Cambiar foto
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                onImageUrlChange(null);
                onPositionChange(null);
              }}
            >
              <X className="size-3.5" />
              Quitar
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFiles(event.dataTransfer.files);
          }}
          className="relative cursor-pointer"
        >
          <MediaPlaceholder
            alt="Imagen"
            ratio={ratio}
            caption={isPending ? "Subiendo..." : "Arrastra o haz clic para subir"}
          />
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-background/70">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
