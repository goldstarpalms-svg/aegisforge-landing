import { FaqSection } from "@/features/home/components/faq-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { ModulesSection } from "@/features/home/components/modules-section";
import { NovaBuildSection } from "@/features/home/components/nova-build-section";
import { TimelineSection } from "@/features/home/components/timeline-section";
import { TrustSection } from "@/features/home/components/trust-section";
import { VisionSection } from "@/features/home/components/vision-section";
import { WaitlistCta } from "@/features/home/components/waitlist-cta";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <NovaBuildSection />
      <ModulesSection />
      <TimelineSection />
      <VisionSection />
      <WaitlistCta />
      <FaqSection />
    </>
  );
}
