"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { moduleCards } from "@/features/home/content";

export function ModulesSection() {
  return (
    <section className="py-16 sm:py-20" id="technology-preview">
      <Container>
        <Reveal className="mb-12 max-w-3xl space-y-4">
          <Badge>Technology ecosystem</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">
            Beautiful modules, designed to feel like one connected intelligence
            system.
          </h2>
          <p className="text-base leading-8 text-balance text-slate-300 sm:text-lg">
            Each capability is built as part of the same platform language — not
            a loose collection of tools, but one living product surface.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {moduleCards.map((module, index) => {
            const Icon = module.icon;

            return (
              <Reveal key={module.title} delay={index * 0.05}>
                <motion.div whileHover={{ y: -8 }} className="group h-full">
                  <Link
                    href="/technology"
                    className="relative flex h-full min-h-72 flex-col overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] backdrop-blur-2xl transition duration-300 hover:border-white/20"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${module.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
                    />
                    <div className="absolute inset-px rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] opacity-80" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex size-[3.25rem] items-center justify-center rounded-[1.3rem] border border-white/10 bg-slate-950/70 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(129,140,248,0.28)]">
                        <Icon className="size-5" />
                      </div>
                      <div className="mt-8 space-y-3">
                        <h3 className="text-xl font-semibold text-white">
                          {module.title}
                        </h3>
                        <p className="text-sm leading-7 text-slate-300">
                          {module.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-8 text-sm font-medium text-slate-300">
                        <span>Dedicated page later</span>
                        <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
