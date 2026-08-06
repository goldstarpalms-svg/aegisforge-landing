"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FaqAccordion } from "@/components/common/faq-accordion";
import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { homeFaqs } from "@/features/home/content";

export function FaqSection() {
  return (
    <section className="py-16 sm:py-20" id="faq-preview">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal className="space-y-5">
          <Badge>FAQ</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">
            Thoughtful answers for the people paying close attention.
          </h2>
          <p className="text-base leading-8 text-balance text-slate-300 sm:text-lg">
            AegisForge should feel clear before it feels complex. These answers
            are designed to reduce uncertainty and make the direction legible.
          </p>
          <Button asChild variant="secondary">
            <Link href="/faq">
              Explore all FAQs
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.06}>
          <FaqAccordion items={homeFaqs} />
        </Reveal>
      </Container>
    </section>
  );
}
