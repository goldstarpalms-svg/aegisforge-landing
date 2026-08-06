import { Container } from "@/components/ui/container";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Terms",
  description:
    "Read the baseline terms for using AegisForge and joining its early access ecosystem.",
  path: "/terms",
});

const termsSections = [
  {
    title: "Use of the site",
    copy: "By using the AegisForge website, you agree to access the experience lawfully and avoid any attempt to disrupt, exploit, or misuse the service.",
  },
  {
    title: "Early access",
    copy: "Joining the waitlist does not guarantee immediate access. We may invite users in stages based on product readiness, research needs, and rollout strategy.",
  },
  {
    title: "Changes",
    copy: "These terms may evolve as AegisForge grows. Continued use of the site after updates indicates acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Terms
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Ground rules for using AegisForge&apos;s early product surface.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            These baseline terms keep expectations clear while the product and
            company continue to evolve.
          </p>
        </div>
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          {termsSections.map((section) => (
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
