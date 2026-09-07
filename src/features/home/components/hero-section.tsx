"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { heroSignals } from "@/features/home/content";

import { EcosystemVisual } from "./ecosystem-visual";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div className="space-y-10">
          <Reveal>
            <Badge className="px-4 py-1.5 text-[0.7rem] tracking-[0.3em]">
              <Sparkles className="mr-2 size-3.5" />
              AI Operating System · v3.0
            </Badge>
          </Reveal>

          <div className="space-y-7">
            <Reveal delay={0.05}>
              <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.6rem] lg:leading-[0.95]">
                <span className="block">Turn One Sentence Into a</span>
                <span className="mt-2 block bg-[linear-gradient(95deg,#22d3ee_0%,#a78bfa_45%,#f0abfc_100%)] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(34,211,238,0.35)]">
                  Live Application.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-2xl text-lg leading-8 text-balance text-slate-300 sm:text-xl">
                AegisForge is an AI operating system that builds, secures, and
                deploys applications from a single conversation. Your first AI
                software company.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary" size="lg" className="min-w-44">
              <Link href="/waitlist">
                Join Waitlist
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-w-40">
              <Link href="/vision">Read Vision</Link>
            </Button>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal, i) => (
                <motion.div
                  key={signal}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-slate-200 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <Terminal className="mb-2 size-4 text-cyan-300/80" />
                    <span className="font-mono text-cyan-100/90">0{i + 1}</span>
                    <span className="ml-2">{signal}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400/70 to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_48%)] blur-3xl" />
          {/* orbit ring decoration */}
          <motion.div
            className="absolute -inset-4 rounded-[2.5rem] border border-white/[0.06]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
          <EcosystemVisual />
        </Reveal>
      </Container>
    </section>
  );
}
