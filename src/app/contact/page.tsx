import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/utils/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Reach the AegisForge team for partnerships, early access, or media conversations.",
  path: "/contact",
});

const contactStreams = [
  {
    title: "General inquiries",
    detail: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    title: "Partnerships",
    detail: "partners@aegisforge.com",
    href: "mailto:partners@aegisforge.com",
  },
  {
    title: "Press",
    detail: "press@aegisforge.com",
    href: "mailto:press@aegisforge.com",
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Contact
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Talk to the team building AegisForge.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            Whether you&apos;re exploring partnerships, early access, or founder
            conversations, we&apos;d love to hear from you.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {contactStreams.map((item) => (
            <Card key={item.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <a
                href={item.href}
                className="text-sm text-cyan-200 hover:text-white"
              >
                {item.detail}
              </a>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
