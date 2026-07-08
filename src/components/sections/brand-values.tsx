"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";
import {
  Award,
  Cake,
  ChefHat,
  Cookie,
  Gift,
  GraduationCap,
  Heart,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const SENTENCES = [
  "Aprende creando.",
  "Convierte tu pasión en una profesión.",
  "Cada tarta cuenta una historia.",
];

const SENTENCE_DURATION = 2000;
const ICON_ONLY_DURATION = 4000;

type FloatVariant = "y" | "rotate" | "pulse" | "glow";

const ICONS: { Icon: LucideIcon; variant: FloatVariant }[] = [
  { Icon: ChefHat, variant: "y" },
  { Icon: Cake, variant: "y" },
  { Icon: Cookie, variant: "y" },
  { Icon: GraduationCap, variant: "rotate" },
  { Icon: Award, variant: "rotate" },
  { Icon: Heart, variant: "pulse" },
  { Icon: Star, variant: "glow" },
  { Icon: Gift, variant: "y" },
];

// Cierre de marca antes del Contacto/Footer: tres frases en ciclo suave,
// seguidas de un respiro solo con los iconos flotando — muy calmado,
// nunca espectacular. Respeta prefers-reduced-motion.
export function BrandValues() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0); // 0-2 = frases, 3 = solo iconos

  useEffect(() => {
    if (reduceMotion) return;
    const duration = step === 3 ? ICON_ONLY_DURATION : SENTENCE_DURATION;
    const timer = setTimeout(() => setStep((current) => (current + 1) % 4), duration);
    return () => clearTimeout(timer);
  }, [step, reduceMotion]);

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, var(--pink-tint), transparent 70%)",
        }}
      />
      <Container className="flex flex-col items-center text-center">
        <div className="flex h-16 items-center justify-center md:h-20">
          {reduceMotion ? (
            <h2 className="text-balance font-heading text-3xl text-foreground md:text-5xl">
              {SENTENCES[0]}
            </h2>
          ) : (
            <AnimatePresence mode="wait">
              {step < 3 && (
                <motion.h2
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-balance font-heading text-3xl text-foreground md:text-5xl"
                >
                  {SENTENCES[step]}
                </motion.h2>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10 md:gap-6">
          {ICONS.map(({ Icon, variant }, index) => (
            <FloatingIcon
              key={index}
              Icon={Icon}
              variant={variant}
              delay={index * 0.3}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

const FLOAT_ANIMATIONS: Record<FloatVariant, TargetAndTransition> = {
  y: { y: [0, -6, 0] },
  rotate: { rotate: [0, 4, 0, -4, 0] },
  pulse: { scale: [1, 1.08, 1] },
  glow: { opacity: [0.7, 1, 0.7] },
};

function FloatingIcon({
  Icon,
  variant,
  delay,
  reduceMotion,
}: {
  Icon: LucideIcon;
  variant: FloatVariant;
  delay: number;
  reduceMotion: boolean;
}) {
  const [duration] = useState(() => 3.5 + Math.random());

  return (
    <motion.span
      className="flex size-10 items-center justify-center rounded-full bg-background text-pink-ink shadow-[0_10px_30px_-15px_rgba(139,107,92,0.3)] md:size-12"
      animate={reduceMotion ? undefined : FLOAT_ANIMATIONS[variant]}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon className="size-4 md:size-5" strokeWidth={1.5} />
    </motion.span>
  );
}
