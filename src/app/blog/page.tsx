import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  blogPageIntro,
  blogPreviewCards,
  blogThemes,
} from "@/features/home/content";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Read product notes, design thinking, and technical ideas from the AegisForge build journey.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="space-y-12">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm tracking-[0.28em] text-cyan-200 uppercase">
            Blog
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Notes from building a future-facing technology company.
          </h1>
          <p className="text-lg leading-8 text-balance text-slate-300">
            {blogPageIntro}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {blogPreviewCards.map((post) => {
            const Icon = post.icon;

            return (
              <Card key={post.title} className="space-y-5">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-7 text-slate-300">
                    {post.description}
                  </p>
                </div>
                <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                  Coming soon
                </div>
              </Card>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:p-8">
          <p className="text-sm tracking-[0.28em] text-slate-400 uppercase">
            Editorial themes
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {blogThemes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-300 uppercase"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
