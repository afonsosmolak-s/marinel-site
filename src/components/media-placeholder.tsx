import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePosition } from "@/types/content";

export const MEDIA_RATIOS = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
  fill: "h-full w-full",
} as const;

export type MediaRatio = keyof typeof MEDIA_RATIOS;

const TONES = {
  pink: "bg-gradient-to-br from-pink-tint to-warm",
  warm: "bg-gradient-to-br from-warm to-secondary",
} as const;

interface MediaPlaceholderProps {
  src?: string | null;
  alt: string;
  ratio?: MediaRatio;
  tone?: keyof typeof TONES;
  caption?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  position?: ImagePosition | null;
}

// Placeholder elegante para huecos de fotografía real (pendiente de la
// clienta). Cuando `src` llega, se cambia a next/image sin tocar el layout —
// ver ARCHITECTURE.md. `position` aplica el encuadre (punto focal + zoom)
// elegido en el panel — ver ImagePositionEditor.
export function MediaPlaceholder({
  src,
  alt,
  ratio = "square",
  tone = "pink",
  caption,
  className,
  imageClassName,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
  position,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border",
        MEDIA_RATIOS[ratio],
        !src && TONES[tone],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
          style={
            position
              ? {
                  objectPosition: `${position.focalX}% ${position.focalY}%`,
                  transform: `scale(${position.zoom})`,
                  transformOrigin: `${position.focalX}% ${position.focalY}%`,
                }
              : undefined
          }
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <ImageIcon
            className="size-7 text-brown/40"
            strokeWidth={1.25}
            aria-hidden
          />
          {caption && (
            <span className="text-[0.65rem] font-medium tracking-[0.15em] text-brown/50 uppercase">
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
