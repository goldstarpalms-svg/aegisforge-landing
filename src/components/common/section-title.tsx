"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SectionTitleProps {
  kicker?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({ kicker, title, className, align = "left" }: SectionTitleProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);

  // Parallax-ish gradient shimmer on the heading gradient
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      el.style.setProperty("--gx", `${50 + x * 30}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("space-y-4", className)}
    >
      {kicker && (
        <Badge className="px-4 py-1.5 text-[0.68rem] tracking-[0.26em]">{kicker}</Badge>
      )}
      <h2
        ref={ref}
        className={cn(
          "text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl",
          align === "center" && "mx-auto max-w-3xl text-center",
        )}
        style={{
          backgroundImage:
            "linear-gradient(95deg, #fff 0%, #cbd5e1 40%, var(--gx, 50%) 60%, #a78bfa 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
      </h2>
    </motion.div>
  );
}
