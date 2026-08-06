"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { aboutTags, visionStory } from "@/features/home/content";

export function VisionSection() {
  return (
    <section className="py-16 sm:py-20" id="vision-preview">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal className="space-y-5">
          <Badge>Why AegisForge exists</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-balance text-white sm:text-5xl lg:text-6xl">
            The future should feel more coherent than the software we use today.
          </h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {aboutTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.24em] text-slate-300 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.06}
          className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] backdrop-blur-2xl sm:p-9"
        >
          <div className="space-y-6">
            {visionStory.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-8 text-balance text-slate-300 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="secondary">
              <Link href="/vision">
                Read the full vision
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
