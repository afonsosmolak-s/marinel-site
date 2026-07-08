"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cake, ChefHat, Cookie, Utensils } from "lucide-react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const TOTAL_MS = 2600;

const ICONS = [
  { Icon: Cake,      delay: 0.0  },
  { Icon: ChefHat,   delay: 0.15 },
  { Icon: Cookie,    delay: 0.30 },
  { Icon: Utensils,  delay: 0.45 },
];

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(false), TOTAL_MS);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-4%" }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          aria-hidden
        >
          {/* ícones em grelha 2×2 */}
          <div className="grid grid-cols-2 gap-8">
            {ICONS.map(({ Icon, delay }) => (
              <motion.div
                key={delay}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                  delay,
                }}
                className="flex size-20 items-center justify-center rounded-2xl border border-pink/25 bg-pink-tint/30"
              >
                <Icon className="size-9 text-pink-ink" strokeWidth={1.4} />
              </motion.div>
            ))}
          </div>

          {/* linha + nome */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <motion.div
                className="h-px bg-pink/40"
                initial={{ width: 0 }}
                animate={{ width: 52 }}
                transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
              />
              <motion.span
                className="text-[0.5rem] text-pink/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                ◆
              </motion.span>
              <motion.div
                className="h-px bg-pink/40"
                initial={{ width: 0 }}
                animate={{ width: 52 }}
                transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
              />
            </div>

            <motion.p
              className="font-heading text-2xl font-medium tracking-[0.06em] text-foreground md:text-3xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE_OUT }}
            >
              Tartas Marinel
            </motion.p>

            <motion.p
              className="text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.95, ease: EASE_OUT }}
            >
              Chef & Repostería Artesanal
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
