"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 20,
  image = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  image?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const initial = image && !reduceMotion
    ? { opacity: 0, scale: 1.06, filter: "blur(10px)" }
    : { opacity: 0, y: reduceMotion ? 0 : y };

  const visible = image && !reduceMotion
    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
    : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: image ? 0.85 : 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
