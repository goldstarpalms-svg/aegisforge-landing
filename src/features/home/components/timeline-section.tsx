"use client";

import { motion } from "framer-motion";

import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { roadmapPhases } from "@/features/home/content";

export function TimelineSection() {
  return (
    <section className="py-16 sm:py-20" id="roadmap-preview">
      <Container>
        <Reveal className="mb-12 max-w-3xl space-y-4">
          <Badge>Animated roadmap</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">
            AegisForge is growing in phases — deliberate, elegant, and
            technically durable.
          </h2>
          <p className="text-base leading-8 text-balance text-slate-300 sm:text-lg">
            Each phase extends the same product vision: one intelligent platform
            with deeper leverage over time.
          </p>
        </Reveal>

        <div className="relative">
          <motion.div
            initial={{ scaleX: 0, opacity: 0.4 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-5 right-5 left-5 hidden h-px origin-left bg-gradient-to-r from-cyan-300/50 via-violet-300/40 to-white/10 lg:block"
          />
          <div className="grid gap-5 lg:grid-cols-5">
            {roadmapPhases.map((phase, index) => (
              <Reveal key={phase.phase} delay={index * 0.07}>
                <motion.article
                  whileHover={{ y: -6 }}
                  className="relative h-full rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] backdrop-blur-2xl"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm font-semibold text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
                      {index}
                    </div>
                    <span className="text-[0.72rem] tracking-[0.28em] text-slate-400 uppercase">
                      {phase.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {phase.description}
                  </p>
                  <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] tracking-[0.24em] text-slate-300 uppercase">
                    {phase.status}
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
