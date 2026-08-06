import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Waitlist",
  description:
    "Join AegisForge early and get first access to launch updates and rollout news.",
  path: "/waitlist",
});

export default function WaitlistPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Early access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Join the AegisForge waitlist before the public launch.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            If you care about intelligent tools with better product taste, join
            the early community and stay close to every major milestone.
          </p>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Why sign up now?
            </h2>
            <ul className="space-y-3 text-sm leading-7 text-slate-300">
              <li>• Receive launch announcements before the public rollout.</li>
              <li>• Get product updates as the roadmap evolves.</li>
              <li>• Help shape the direction of the first release.</li>
            </ul>
          </Card>
        </div>
        <WaitlistForm />
      </Container>
    </div>
  );
}
