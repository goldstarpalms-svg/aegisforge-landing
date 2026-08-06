import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Vision",
  description:
    "Learn why AegisForge exists and what future it is building toward.",
  path: "/vision",
});

const narratives = [
  {
    title: "Human-centered leverage",
    description:
      "We believe intelligent tools should expand human capability, not reduce human agency. AegisForge is designed to amplify judgment, creativity, and momentum.",
  },
  {
    title: "Focused digital calm",
    description:
      "The best technology should feel clear and composed. AegisForge pursues an interface that stays powerful without becoming noisy or overwhelming.",
  },
  {
    title: "Meaningful outcomes",
    description:
      "Our north star is not novelty for novelty's sake. It's better work, better learning, and better systems for solving real problems.",
  },
];

export default function VisionPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-16">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Vision
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Intelligent tools should help people think more clearly and act more
            boldly.
          </h1>
          <p className="text-lg leading-8 text-balance text-slate-300">
            AegisForge is building a product ecosystem for people who want more
            than generic software. We are creating a premium intelligence layer
            for creation, learning, automation, collaboration, and execution.
          </p>
        </div>

        <Section
          title="The product point of view"
          description="Our philosophy is simple: intelligence should create leverage without eroding focus, trust, or human taste."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {narratives.map((item) => (
              <Card key={item.title} className="h-full space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  );
}
