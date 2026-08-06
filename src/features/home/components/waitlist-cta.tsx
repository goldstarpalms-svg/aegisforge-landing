"use client";

import { Reveal } from "@/components/common/reveal";
import { Container } from "@/components/ui/container";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export function WaitlistCta() {
  return (
    <section className="py-16 sm:py-20" id="waitlist-preview">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.05] px-6 py-8 shadow-[0_30px_120px_-40px_rgba(2,8,23,0.95)] backdrop-blur-2xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(129,140,248,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm tracking-[0.3em] text-cyan-200 uppercase">
                  Join the waitlist
                </p>
                <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-balance text-white sm:text-5xl">
                  Be part of the first community shaping what AegisForge
                  becomes.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-balance text-slate-300 sm:text-lg">
                  Get product updates, launch signals, and early access to the
                  platform as we move from foundation to intelligence.
                </p>
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.26em] text-slate-300 uppercase">
                  Referral system coming soon
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
                <WaitlistForm compact />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
