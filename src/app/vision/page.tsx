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

const steps = [
  {
    number: "01",
    title: "You have an idea",
    body: "It arrives the way ideas always do — incomplete, urgent, a little fragile. Maybe it came to you on a walk, or in a conversation, or at 2am when the world was quiet enough to listen. You don't need a framework. You don't need a sprint planning session. You just want to see it exist.",
  },
  {
    number: "02",
    title: "You describe it in your own words",
    body: "Not in a spec. Not in a Jira ticket. In a sentence — the way you'd explain it to a friend who believes in you. \"I want a tool that lets small teams track their expenses without all the bloat.\" That's enough. That's where AegisForge begins.",
  },
  {
    number: "03",
    title: "AegisForge listens and understands",
    body: "Behind the scenes, something important happens: AegisForge doesn't just process your words — it understands your intent. It figures out what kind of product you're describing, what architecture makes sense, what needs to be secured, what should go live first. Like a trusted colleague who's been doing this for years.",
  },
  {
    number: "04",
    title: "The right agents go to work",
    body: "One builds the structure. One secures the edges. One prepares the deployment. They work together, quietly, the way a good team does — each handling their part without being asked twice. You don't orchestrate them. They orchestrate themselves around your idea.",
  },
  {
    number: "05",
    title: "Something real comes back to you",
    body: "Not a mockup. Not a PowerPoint. A blueprint with real architecture. A security report with real findings. A deployment that's ready to go live. Something you can touch, share, build on. Something that honors the idea that started it all.",
  },
  {
    number: "06",
    title: "You go from idea to impact faster",
    body: "And here's the part that matters most: you didn't have to become an expert in five things to ship one thing. You stayed focused on what you're great at — having the idea, making the decisions, caring about the outcome. AegisForge handled the rest. That's the promise. That's the whole point.",
  },
];

export default function VisionPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-20">
        {/* Hero */}
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

        {/* Quote */}
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute -left-4 top-0 text-6xl leading-none text-cyan-400/20 select-none sm:-left-8 sm:text-8xl">
            &ldquo;
          </div>
          <blockquote className="border-l-2 border-cyan-400/30 pl-6 sm:pl-8">
            <p className="text-xl leading-9 text-white sm:text-2xl sm:leading-10">
              The best technology doesn&apos;t make you feel powerful by giving
              you more tools. It makes you feel powerful by needing fewer of
              them.
            </p>
            <footer className="mt-4 text-sm text-slate-400">
              — The belief that started AegisForge
            </footer>
          </blockquote>
        </div>

        {/* Step-by-step story */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From the moment you have an idea
            </h2>
            <p className="mt-3 text-slate-400">
              This is how it should feel to build software.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="group relative">
                {/* Connector line */}
                <div className="absolute left-[1.1rem] top-12 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent sm:left-[1.4rem]" />

                <div className="relative flex gap-5 sm:gap-8">
                  {/* Number */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-sm font-semibold text-cyan-300 sm:size-11 sm:text-base">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing thought */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
            <p className="text-lg leading-8 text-white sm:text-xl sm:leading-9">
              We&apos;re not building AegisForge because software is broken.
              We&apos;re building it because the people who use it aren&apos;t
              — and they deserve tools that match their ambition.
            </p>
            <p className="mt-4 text-sm text-slate-400">
              That&apos;s the vision. Everything else follows.
            </p>
          </div>
        </div>

        {/* Philosophy cards */}
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
