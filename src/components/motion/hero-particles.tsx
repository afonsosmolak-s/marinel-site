"use client";

import { useEffect } from "react";
import gsap from "gsap";

// Partículas decorativas flotantes del hero (✦ y ·) en rosa/dorado de marca.
// Se crean imperativamente en mount para no afectar al SSR ni a la hidratación.
export function HeroParticles() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector<HTMLElement>(".hero-section");
    if (!hero) return;

    const colors = ["#f4a7b9", "#c9a84c", "#f4a7b9", "#d4af6a"];
    const symbols = ["✦", "·", "✦", "·", "✦"];
    const particles: HTMLSpanElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("span");
      particle.textContent = symbols[i % symbols.length];
      particle.setAttribute("aria-hidden", "true");
      particle.style.cssText = `
        position: absolute;
        pointer-events: none;
        user-select: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        color: ${colors[i % colors.length]};
        opacity: ${0.3 + Math.random() * 0.4};
        font-size: ${4 + Math.random() * 6}px;
        z-index: 1;
      `;
      hero.appendChild(particle);
      particles.push(particle);

      tweens.push(
        gsap.to(particle, {
          y: -15 + Math.random() * 30,
          duration: 3 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 4,
        }),
      );
    }

    return () => {
      tweens.forEach((tween) => tween.kill());
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return null;
}
