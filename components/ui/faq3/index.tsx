'use client';

import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Badge } from '@/components/base-ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/base-ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  badge?: string;
  heading: string;
  subheading: string;
  items: FAQItem[];
}

const GDG_COLORS = [
  {
    hex: "#4285F4",
    borderLeft: "border-l-[#4285F4]",
    badgeBg: "rgba(66, 133, 244, 0.12)",
    bgOpen: "data-[state=open]:bg-blue-50/30",
  },
  {
    hex: "#EA4335",
    borderLeft: "border-l-[#EA4335]",
    badgeBg: "rgba(234, 67, 53, 0.12)",
    bgOpen: "data-[state=open]:bg-red-50/30",
  },
  {
    hex: "#FBBC04",
    borderLeft: "border-l-[#FBBC04]",
    badgeBg: "rgba(251, 188, 4, 0.18)",
    bgOpen: "data-[state=open]:bg-amber-50/30",
  },
  {
    hex: "#34A853",
    borderLeft: "border-l-[#34A853]",
    badgeBg: "rgba(52, 168, 83, 0.12)",
    bgOpen: "data-[state=open]:bg-emerald-50/30",
  },
];

export default function FAQ3({
  badge = 'Frequently asked questions',
  heading,
  subheading,
  items,
}: FAQSectionProps) {
  return (
    <section id="faq" className="bg-[#E8F0FE] flex w-full flex-col items-center justify-center px-4 py-16 sm:py-24 border-t border-zinc-100">
      {/* ── Header ── */}
      <div className="mb-12 flex w-full max-w-xl flex-col items-center text-center sm:mb-16">
        {badge && (
          <Badge
            variant="outline"
            className="border-zinc-200 bg-zinc-50/80 text-zinc-700 mb-5 gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide shadow-2xs"
          >
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#4285F4]" />
              <span className="size-1.5 rounded-full bg-[#EA4335]" />
              <span className="size-1.5 rounded-full bg-[#FBBC05]" />
              <span className="size-1.5 rounded-full bg-[#34A853]" />
            </span>
            <span>{badge}</span>
          </Badge>
        )}

        <h2 className="text-zinc-900 mb-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          {heading}
        </h2>

        <p className="text-zinc-600 max-w-md text-sm leading-relaxed sm:text-base">
          {subheading}
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
          {items.map((item, i) => {
            const num = String(i + 1).padStart(2, '0');
            const color = GDG_COLORS[i % GDG_COLORS.length];

            return (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className={`group rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-50/90 hover:border-zinc-300 border-l-[4px] ${color.borderLeft} ${color.bgOpen} overflow-hidden shadow-2xs transition-all duration-200`}
              >
                <AccordionTrigger className="flex w-full items-center gap-4 px-5 py-4 sm:px-6 sm:py-4.5 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:!hidden">
                  <span
                    className="w-8 shrink-0 py-0.5 text-center text-xs font-bold font-mono tracking-wider rounded-md transition-colors duration-200"
                    style={{
                      backgroundColor: color.badgeBg,
                      color: color.hex,
                    }}
                  >
                    {num}
                  </span>

                  <span className="text-zinc-800 group-hover:text-zinc-950 flex-1 text-left text-sm leading-snug font-semibold transition-colors duration-200 sm:text-base">
                    {item.question}
                  </span>

                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: color.badgeBg,
                      color: color.hex,
                    }}
                  >
                    <FaPlus className="block h-3 w-3 group-data-[state=open]:hidden" />
                    <FaMinus className="hidden h-3 w-3 group-data-[state=open]:block" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pt-0 pb-5 pl-[4.25rem] sm:px-6 sm:pb-5.5">
                  <p className="text-zinc-600 text-sm leading-relaxed sm:text-base">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
