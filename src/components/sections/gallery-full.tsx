"use client";

import { useMemo, useState } from "react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { GalleryViewer } from "@/components/sections/gallery-viewer";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES, type GalleryImage } from "@/types/content";

const ALL = "Todos" as const;

export function GalleryFull({
  images,
  initialId,
}: {
  images: GalleryImage[];
  initialId?: string;
}) {
  const [category, setCategory] = useState<(typeof GALLERY_CATEGORIES)[number] | typeof ALL>(
    ALL,
  );
  const [viewerIndex, setViewerIndex] = useState<number | null>(() => {
    if (!initialId) return null;
    const found = images.findIndex((image) => image.id === initialId);
    return found === -1 ? null : found;
  });

  const activeCategories = useMemo(
    () => Array.from(new Set(images.flatMap((image) => image.categories))),
    [images],
  );

  const filtered = useMemo(
    () =>
      category === ALL
        ? images
        : images.filter((image) => image.categories.includes(category)),
    [images, category],
  );

  return (
    <>
      {activeCategories.length > 0 && (
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          <CategoryChip
            label={ALL}
            active={category === ALL}
            onClick={() => setCategory(ALL)}
          />
          {activeCategories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted-foreground">
          No hay fotografías en esta categoría todavía.
        </p>
      ) : (
        <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10 lg:grid-cols-4">
          {filtered.map((image, index) => (
            <StaggerItem key={image.id}>
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => setViewerIndex(index)}
                  className="block w-full text-left transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5"
                  aria-label={image.caption ?? "Ver fotografía"}
                >
                  <MediaPlaceholder
                    src={image.imageUrl}
                    position={image.imagePosition}
                    alt={image.caption ?? "Fotografía de Marinel Pastelería"}
                    ratio="tall"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="shadow-[4px_4px_10px_rgba(0,0,0,0.18),_10px_10px_30px_rgba(0,0,0,0.10)] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[6px_6px_14px_rgba(0,0,0,0.22),_14px_14px_40px_rgba(0,0,0,0.14)]"
                    imageClassName="brightness-[0.68] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:brightness-[1.07] group-hover:saturate-[1.03]"
                  />
                </button>
                {image.featured && (
                  <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-pink px-3 py-1 text-[0.65rem] font-medium tracking-wide text-foreground uppercase">
                    Destacado
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}

      {viewerIndex !== null && (
        <GalleryViewer
          images={filtered}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-colors",
        active
          ? "border-pink bg-pink-tint text-pink-ink"
          : "border-border text-muted-foreground hover:border-pink",
      )}
    >
      {label}
    </button>
  );
}
