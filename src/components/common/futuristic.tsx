"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Shared futuristic primitives for the AegisForge app (dashboard, workspace,
 * scanner, blueprint, nova) so the *product* matches the marketing pages.
 * These are presentational only — they wrap children and never touch app logic.
 */

/** A premium glass card with a soft aurora border + glow. */
export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl",
        "shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] transition duration-300 hover:border-cyan-300/25",
        className,
      )}
    >
      {/* subtle top sheen */}
      <div className="pointer-events-none absolute inset-px rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] opacity-80" />
      <div className="relative">{children}</div>
    </div>
  );
}

/** A futuristic gradient section heading (kicker badge + gradient title). */
export function GradientHeading({
  kicker,
  title,
  sub,
  align = "left",
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {kicker && (
        <Badge className="px-4 py-1.5 text-[0.68rem] tracking-[0.24em]">{kicker}</Badge>
      )}
      <h1
        className={cn(
          "text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl",
          align === "center" && "text-center",
        )}
        style={{
          backgroundImage:
            "linear-gradient(95deg,#ffffff 0%,#cbd5e1 35%,#22d3ee 66%,#a78bfa 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
      </h1>
      {sub && (
        <p className={cn("text-base leading-8 text-slate-300", align === "center" && "mx-auto max-w-2xl text-center")}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** A futuristic page frame: gradient page heading + a glass content area. */
export function AppShell({
  kicker,
  title,
  sub,
  actions,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <GradientHeading kicker={kicker} title={title} sub={sub} />
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
