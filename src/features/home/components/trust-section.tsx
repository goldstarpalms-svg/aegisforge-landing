"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

import { Reveal } from "@/components/common/reveal";
import { Container } from "@/components/ui/container";
import { trustMetrics } from "@/features/home/content";

function formatMetric(value: number, compact?: boolean, suffix = "") {
  if (compact && value >= 1000) {
    const compactValue = value / 1000;
    return `${compactValue.toFixed(1)}K${suffix}`;
  }

  return `${Math.round(value)}${suffix}`;
}

function MetricCard({
  value,
  label,
  suffix,
  compact,
}: {
  value: number;
  label: string;
  suffix?: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const [displayValue, setDisplayValue] = useState(() =>
    formatMetric(0, compact, suffix),
  );

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(formatMetric(latest, compact, suffix));
      },
    });

    return () => controls.stop();
  }, [compact, isInView, suffix, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -5 }}
      className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-6 shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] backdrop-blur-2xl"
    >
      <p className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
        {displayValue}
      </p>
      <p className="mt-3 text-sm tracking-[0.28em] text-slate-400 uppercase">
        {label}
      </p>
    </motion.div>
  );
}

export function TrustSection() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <Reveal className="mb-8 max-w-2xl">
          <p className="text-sm tracking-[0.3em] text-slate-400 uppercase">
            Trust signals
          </p>
          <p className="mt-3 text-lg leading-8 text-balance text-slate-300">
            Early numbers are placeholders for now — but the platform is being
            designed to scale globally from the beginning.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {trustMetrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.06}>
              <MetricCard {...metric} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
