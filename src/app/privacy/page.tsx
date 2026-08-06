import { Container } from "@/components/ui/container";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Privacy",
  description:
    "Understand how AegisForge approaches privacy and information handling.",
  path: "/privacy",
});

const privacySections = [
  {
    title: "Information we collect",
    copy: "For this foundation release, any information you share through the waitlist is limited to what you voluntarily submit, such as your name, email, company, and interest in the product.",
  },
  {
    title: "How we use it",
    copy: "We use submitted information to communicate launch updates, evaluate early-access interest, and improve our go-to-market decisions. We do not sell personal information.",
  },
  {
    title: "Security mindset",
    copy: "We aim to build with secure defaults, thoughtful access control, and minimal data collection. This policy will evolve as the product matures and infrastructure expands.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Privacy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Privacy is part of product quality.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            We believe respectful software should collect responsibly, explain
            clearly, and grow trust through restraint.
          </p>
        </div>
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          {privacySections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-slate-300">{section.copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
