'use client';

import React from 'react';
import { FaArrowRight, FaRegCommentDots } from 'react-icons/fa6';
import SectionPattern from '@/components/ui/section-pattern';
import GoogleEqualizer from '@/components/ui/google-equalizer';
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

/** One Google hue per card, cycled — spine, index chip, toggle and open tint. */
const GDG_COLORS = [
  { hex: '#4285F4', soft: 'rgba(66, 133, 244, 0.10)', wash: 'rgba(66, 133, 244, 0.05)' },
  { hex: '#EA4335', soft: 'rgba(234, 67, 53, 0.10)', wash: 'rgba(234, 67, 53, 0.05)' },
  { hex: '#FBBC04', soft: 'rgba(251, 188, 4, 0.16)', wash: 'rgba(251, 188, 4, 0.07)' },
  { hex: '#34A853', soft: 'rgba(52, 168, 83, 0.10)', wash: 'rgba(52, 168, 83, 0.05)' },
];

export default function FAQ3({
  badge = 'Frequently asked questions',
  heading,
  subheading,
  items,
}: FAQSectionProps) {
  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-[#EDF3FD] py-20 sm:py-28"
    >
      <SectionPattern
        variant="arcs"
        arcOrigin="top-right"
        arcColor="#4285F4"
        glow={0.13}
        brackets
        ribbon="top"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
          {/* ── Left rail: pinned intro + escape hatch ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {badge && (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#4285F4]/20 bg-white/80 px-4 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                {/* The four Google dots, playing like an equaliser */}
                <GoogleEqualizer height={14} />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                  {badge}
                </span>
              </span>
            )}

            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
              {heading}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
              {subheading}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="font-mono text-[2.5rem] font-bold leading-none text-[#4285F4]/25">
                {String(items.length).padStart(2, '0')}
              </span>
              <span className="max-w-[7rem] font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-zinc-500">
                answers, straight from the organisers
              </span>
            </div>

            <button
              type="button"
              data-scroll-to="register"
              className="group mt-8 flex w-full max-w-sm cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200/90 bg-white/75 p-4 text-left backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4285F4]/40 hover:bg-white hover:shadow-[0_14px_34px_rgba(66,133,244,0.14)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#4285F4]/10 text-[#4285F4]">
                <FaRegCommentDots className="size-4" />
              </span>
              <span className="flex flex-1 flex-col text-left">
                <span className="text-sm font-semibold text-zinc-900">
                  Still have a question?
                </span>
                <span className="text-xs text-zinc-500">
                  Join the dispatch and ask us anything
                </span>
              </span>
              <FaArrowRight className="size-3 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#4285F4]" />
            </button>
          </div>

          {/* ── Right rail: the accordion ── */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="flex w-full flex-col gap-3.5"
          >
            {items.map((item, i) => {
              const num = String(i + 1).padStart(2, '0');
              const color = GDG_COLORS[i % GDG_COLORS.length];

              return (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 data-[state=open]:border-transparent data-[state=open]:bg-white data-[state=open]:shadow-[0_18px_44px_rgba(32,33,36,0.10)]"
                  style={
                    {
                      backgroundImage: `linear-gradient(120deg, ${color.wash}, transparent 55%)`,
                    } as React.CSSProperties
                  }
                >
                  {/* Colour spine: a hairline at rest, a full bar once open */}
                  <span
                    className="absolute inset-y-0 left-0 w-[3px] transition-all duration-300 group-hover:w-[5px] group-data-[state=open]:w-[6px]"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />

                  <AccordionTrigger className="flex w-full items-center gap-4 pl-6 pr-5 py-5 text-left hover:no-underline sm:gap-5 sm:pl-7 sm:pr-6">
                    <span
                      className="shrink-0 font-mono text-xs font-bold tracking-[0.08em] transition-opacity duration-200 group-data-[state=closed]:opacity-55"
                      style={{ color: color.hex }}
                    >
                      {num}
                    </span>

                    <span className="flex-1 font-display text-[0.975rem] font-semibold leading-snug text-zinc-800 transition-colors duration-200 group-hover:text-zinc-950 sm:text-lg">
                      {item.question}
                    </span>

                    {/* + morphs into − : the vertical stroke rotates away */}
                    <span
                      className="relative flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-data-[state=open]:rotate-180"
                      style={{ backgroundColor: color.soft }}
                      aria-hidden="true"
                    >
                      <span
                        className="absolute h-[2px] w-3 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span
                        className="absolute h-[2px] w-3 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rotate-90 group-data-[state=open]:rotate-0"
                        style={{ backgroundColor: color.hex }}
                      />
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pl-6 pr-5 sm:pl-7 sm:pr-6">
                    <div className="flex gap-4 pb-5 sm:gap-5">
                      {/* Answer rule, aligned under the index chip */}
                      <span
                        className="mt-1 w-[2px] shrink-0 rounded-full opacity-40"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">
                        {item.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
