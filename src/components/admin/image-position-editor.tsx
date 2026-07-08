"use client";

import { useRef } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEDIA_RATIOS, type MediaRatio } from "@/components/media-placeholder";
import type { ImagePosition } from "@/types/content";

const DEFAULT_POSITION: ImagePosition = { focalX: 50, focalY: 50, zoom: 1 };

// Editor de encuadre estilo Shopify: arrastra para fijar el punto focal,
// desliza para hacer zoom. Nunca hay que recortar la foto antes de subirla.
export function ImagePositionEditor({
  src,
  value,
  onChange,
  ratio = "tall",
}: {
  src: string;
  value: ImagePosition | null;
  onChange: (position: ImagePosition) => void;
  ratio?: MediaRatio;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const position = value ?? DEFAULT_POSITION;

  function updateFromPointer(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChange({ ...position, focalX: Math.round(x), focalY: Math.round(y) });
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full touch-none overflow-hidden rounded-2xl border border-border bg-muted select-none",
          MEDIA_RATIOS[ratio],
        )}
        style={{ cursor: "crosshair" }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.buttons !== 1) return;
          updateFromPointer(event.clientX, event.clientY);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- editor necesita transform/object-position dinámicos */}
        <img
          src={src}
          alt="Vista previa de encuadre"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            objectFit: "cover",
            objectPosition: `${position.focalX}% ${position.focalY}%`,
            transform: `scale(${position.zoom})`,
            transformOrigin: `${position.focalX}% ${position.focalY}%`,
          }}
          draggable={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{ left: `${position.focalX}%`, top: `${position.focalY}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        <ZoomOut className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={position.zoom}
          onChange={(event) =>
            onChange({ ...position, zoom: Number(event.target.value) })
          }
          className="h-1 flex-1 accent-foreground"
        />
        <ZoomIn className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="text-xs text-muted-foreground">
        Arrastra sobre la imagen para elegir el punto de enfoque.
      </p>
    </div>
  );
}
