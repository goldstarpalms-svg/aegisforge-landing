import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}

export function Section({
  eyebrow,
  title,
  description,
  children,
  id,
}: SectionProps) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 max-w-3xl space-y-4 sm:mb-12">
          {eyebrow ? <Badge>{eyebrow}</Badge> : null}
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-base leading-8 text-balance text-slate-300 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
