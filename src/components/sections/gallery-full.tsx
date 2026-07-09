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
                {/* Mismo look que las gallery-card de la home, pero vía CSS —
                    aquí las tarjetas se re-crean al filtrar por categoría y los
                    listeners GSAP montados una sola vez se perderían. */}
                <button
                  type="button"
                  onClick={() => setViewerIndex(index)}
                  className="relative block w-full overflow-hidden rounded-3xl border border-transparent text-left shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:border-[#c9a84c]"
                  aria-label={image.caption ?? "Ver fotografía"}
                >
                  <MediaPlaceholder
                    src={image.imageUrl}
                    position={image.imagePosition}
                    alt={image.caption ?? "Fotografía de Marinel Pastelería"}
                    ratio="tall"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    imageClassName="brightness-[0.68] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:brightness-[1.07] group-hover:saturate-[1.03]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 bg-[#c9a84c]/[0.08] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
