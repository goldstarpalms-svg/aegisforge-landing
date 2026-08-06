import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  moduleCards,
  technologyHighlights,
  technologyPageIntro,
} from "@/features/home/content";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Technology",
  description:
    "Explore the modular technology ecosystem shaping the AegisForge platform.",
  path: "/technology",
});

export default function TechnologyPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-12">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Technology
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            A modular platform with one shared intelligence layer.
          </h1>
          <p className="text-lg leading-8 text-balance text-slate-300">
            {technologyPageIntro}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {moduleCards.map((module) => {
            const Icon = module.icon;

            return (
              <Card key={module.title} className="h-full space-y-5">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-white">
                    {module.title}
                  </h2>
                  <p className="text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {technologyHighlights.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-300 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-xl"
            >
              {item}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
