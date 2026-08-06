import { FaqAccordion } from "@/components/common/faq-accordion";
import { Container } from "@/components/ui/container";
import { homeFaqs } from "@/features/home/content";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about AegisForge, access, and product direction.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            FAQ
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Everything early adopters should know right now.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            AegisForge is being built with clarity and intention. These answers
            outline the product direction, who it is for, and why the platform
            is taking shape the way it is.
          </p>
        </div>
        <FaqAccordion items={homeFaqs} />
      </Container>
    </div>
  );
}
