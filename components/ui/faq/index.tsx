"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";

const FAQS = [
  {
    q: "What is DevFest Kolkata 2026?",
    a: "DevFest is an annual decentralized tech conference hosted by Google Developer Groups across the world. DevFest Kolkata brings developers, creators, students, and tech leads together for a day of technical sessions, live demos, and community networking.",
  },
  {
    q: "Who can attend DevFest?",
    a: "Everyone! Whether you are an experienced software engineer, a student, a designer, or a founder interested in AI, Cloud, and Web technologies, DevFest has sessions tailored for all experience levels.",
  },
  {
    q: "Will there be hands-on workshops and codelabs?",
    a: "Yes! Alongside keynote and track talks, there are dedicated workshop areas where you can code alongside Google Developer Experts and build real projects.",
  },
  {
    q: "Are refreshments, lunch, and official DevFest swag provided?",
    a: "Yes, all registered attendees receive official DevFest welcome kits, lunch, event swag, and access to all track stages and networking lounges.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full bg-zinc-50/50 text-zinc-900 py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1 text-xs font-medium text-zinc-600 mb-3 shadow-xs">
            <span className="flex size-2 rounded-full bg-[#FBBC05]" />
            <span>Got Questions?</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900"
            style={{
              fontFamily:
                'var(--font-google-sans-display, "Google Sans Display", "Google Sans", sans-serif)',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Everything you need to know about DevFest Kolkata 2026.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-zinc-50/60 transition-colors"
                >
                  <span
                    className="text-base sm:text-lg font-medium text-zinc-900 pr-4"
                    style={{
                      fontFamily:
                        'var(--font-google-sans, "Google Sans", sans-serif)',
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-400 shrink-0"
                  >
                    <FaChevronDown className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
