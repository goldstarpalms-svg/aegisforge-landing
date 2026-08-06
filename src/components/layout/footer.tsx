import Link from "next/link";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/ui/container";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { primaryNavigation, secondaryNavigation } from "@/config/navigation";
import { footerNewsletterLabel } from "@/features/home/content";
import { siteConfig } from "@/config/site";

const socialLinks = [
  { label: "X", href: siteConfig.socials.x },
  { label: "LinkedIn", href: siteConfig.socials.linkedin },
  { label: "GitHub", href: siteConfig.socials.github },
];

export function Footer() {
  return (
    <footer className="border-t border-white/6 pt-16 pb-10">
      <Container>
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_-40px_rgba(2,8,23,0.95)] backdrop-blur-2xl sm:p-8 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-300 uppercase transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
              Navigation
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
              Legal
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              {secondaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
                Newsletter
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {footerNewsletterLabel}
              </p>
            </div>
            <WaitlistForm compact />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AegisForge. All rights reserved.</p>
          <p>{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
