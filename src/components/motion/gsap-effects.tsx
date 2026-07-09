"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Efectos GSAP globales del sitio público — montado una vez por página:
// 1. Títulos de formulario (.form-title) — fade-in al entrar en viewport.
// 2. Subrayado rosa de los títulos de sección (.title-underline).
// 3. Hover de las tarjetas de galería (.gallery-card + .card-overlay).
// 4. Shimmer del botón primario (.btn-primary + .btn-shimmer).
export function GsapEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // 1 — Títulos de formulario
      gsap.utils.toArray<HTMLElement>(".form-title").forEach((titleEl) => {
        gsap.from(titleEl, {
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      // 2 — Subrayado animado de títulos de sección
      gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
        const line = title.querySelector(".title-underline");
        if (!line) return;
        gsap.fromTo(
          line,
          { width: 0, opacity: 0 },
          {
            width: "60px",
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: { trigger: title, start: "top 85%" },
          },
        );
      });

      // 3 — Hover de tarjetas de galería
      gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card) => {
        const img = card.querySelector("img");
        const overlay = card.querySelector(".card-overlay");
        if (!img || !overlay) return;

        const onEnter = () => {
          gsap.to(img, { scale: 1.03, duration: 0.4, ease: "power2.out" });
          gsap.to(overlay, { opacity: 1, duration: 0.3 });
          gsap.to(card, {
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            duration: 0.3,
          });
        };
        const onLeave = () => {
          gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(overlay, { opacity: 0, duration: 0.3 });
          gsap.to(card, {
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            duration: 0.3,
          });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // 4 — Shimmer del botón primario
      gsap.utils.toArray<HTMLElement>(".btn-primary").forEach((btn) => {
        const shimmer = btn.querySelector(".btn-shimmer");
        if (!shimmer) return;

        gsap.set(shimmer, { x: "-100%", opacity: 0 });
        const onEnter = () => {
          gsap.fromTo(
            shimmer,
            { x: "-100%", opacity: 1 },
            { x: "200%", duration: 0.5, ease: "power1.inOut" },
          );
        };

        btn.addEventListener("mouseenter", onEnter);
        cleanups.push(() => btn.removeEventListener("mouseenter", onEnter));
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
