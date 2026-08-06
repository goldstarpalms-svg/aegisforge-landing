import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { roadmapPhases } from "@/features/home/content";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Roadmap",
  description:
    "See how AegisForge plans to ship its foundation, workflows, and platform layers.",
  path: "/roadmap",
});

export default function RoadmapPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-12">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Roadmap
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Building a durable product, one disciplined phase at a time.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            We are prioritizing a strong product shell, intelligent core
            workflows, collaborative capabilities, and a scalable platform
            ecosystem.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {roadmapPhases.map((item) => (
            <Card key={item.phase} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm tracking-[0.22em] text-cyan-200 uppercase">
                  {item.phase}
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                  {item.status}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
