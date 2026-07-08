"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types/content";

// Visor de imagen "Apple Photos" — nunca a pantalla completa. Un overlay
// centrado, con márgenes generosos, sobre un fondo oscuro difuminado.
// Nota: no envolver en <AnimatePresence> — combinado con createPortal, la
// animación de salida no dispara onExitComplete y el componente nunca se
// desmonta (comprobado). El cierre es instantáneo, solo la entrada anima.
export function GalleryViewer({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const goPrev = useCallback(
    () => setIndex((current) => (current - 1 + images.length) % images.length),
    [images.length],
  );
  const goNext = useCallback(
    () => setIndex((current) => (current + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const current = images[Math.min(index, images.length - 1)];
  if (!current) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md md:p-16"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagen"
      onClick={onClose}
      onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStartX === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (delta > 50) goPrev();
        else if (delta < -50) goNext();
        setTouchStartX(null);
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-4" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Anterior"
            className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-10 md:size-12"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Siguiente"
            className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-10 md:size-12"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm flex-col items-center md:max-w-md"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
          {current.imageUrl && (
            <Image
              src={current.imageUrl}
              alt={current.caption ?? "Fotografía de Marinel Pastelería"}
              fill
              sizes="(min-width: 768px) 448px, 90vw"
              className="object-cover"
              style={
                current.imagePosition
                  ? {
                      objectPosition: `${current.imagePosition.focalX}% ${current.imagePosition.focalY}%`,
                      transform: `scale(${current.imagePosition.zoom})`,
                      transformOrigin: `${current.imagePosition.focalX}% ${current.imagePosition.focalY}%`,
                    }
                  : undefined
              }
              priority
            />
          )}
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
          {current.caption && <span>{current.caption}</span>}
          {images.length > 1 && (
            <span className="text-white/40">
              {index + 1} / {images.length}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
