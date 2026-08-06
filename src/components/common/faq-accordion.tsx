"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FaqItem } from "@/features/home/content";

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.question}
            className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-xl transition hover:border-white/15"
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7"
              onClick={() =>
                setOpenIndex((current) => (current === index ? -1 : index))
              }
            >
              <span className="text-base font-semibold text-white sm:text-lg">
                {item.question}
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                <ChevronDown
                  className={cn(
                    "size-4 transition duration-300",
                    isOpen && "rotate-180 text-cyan-200",
                  )}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm leading-7 text-slate-300 sm:px-7">
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
