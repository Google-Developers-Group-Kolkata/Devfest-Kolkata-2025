"use client";

import React, { useEffect, useRef, useState } from "react";

// Exactly 4 key highlights matching the 4 GDG colors
const GDG_KEYWORDS: Record<string, { color: string; bg: string }> = {
  developers: { color: "#ffffff", bg: "#4285F4" }, // Google Blue
  community: { color: "#ffffff", bg: "#EA4335" },  // Google Red
  future: { color: "#ffffff", bg: "#34A853" },     // Google Green
  innovation: { color: "#202124", bg: "#FBBC05" }, // Google Yellow
};

const PARAGRAPHS = [
  "DevFest Kolkata is a space for developers and designers who build with intent. It is where bold ideas turn into living technology, powered by community and creative vision.",
  "We believe the future of technology starts with passion and shared knowledge. Google Developer Groups Kolkata connects you with the innovation that shapes tomorrow.",
];

type Token = { text: string; keyword: boolean; start: number; end: number };

function tokenize(text: string): Token[] {
  const tokens = text.split(/\s+/);
  const words: Token[] = [];
  let offset = 0;
  tokens.forEach((t) => {
    const clean = t.toLowerCase().replace(/[.,!?;:"]/g, "");
    words.push({
      text: t,
      keyword: Boolean(GDG_KEYWORDS[clean]),
      start: offset,
      end: offset + t.length,
    });
    offset += t.length + 1;
  });
  return words;
}

const TOKENS = PARAGRAPHS.map(tokenize);

function Caret() {
  return (
    <span
      aria-hidden
      className="mr-px inline-block h-[1.05em] w-[0.09em] translate-y-[0.18em] bg-[#4285F4] animate-caret-blink"
    />
  );
}

export default function ScrollTextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState<number[]>(() => PARAGRAPHS.map(() => 0));
  const [activePara, setActivePara] = useState(0);

  // Start typing once the section scrolls well into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = window.requestAnimationFrame(() => {
        setVisible(PARAGRAPHS.map((p) => p.length));
        setDone(true);
      });
      return () => window.cancelAnimationFrame(raf);
    }

    let para = 0;
    let char = 0;
    let timer: number;

    const step = () => {
      if (char < PARAGRAPHS[para].length) {
        setVisible((prev) =>
          prev.map((v, i) => (i === para ? (char += 1) : v))
        );
        const ch = PARAGRAPHS[para][char - 1];
        const pause = /[.,!?;:]/.test(ch) ? 280 : 30 + Math.random() * 26;
        timer = window.setTimeout(step, pause);
      } else if (para < PARAGRAPHS.length - 1) {
        para += 1;
        char = 0;
        setActivePara(para);
        timer = window.setTimeout(step, 560);
      } else {
        timer = window.setTimeout(() => setDone(true), 1600);
      }
    };

    timer = window.setTimeout(step, 450);
    return () => window.clearTimeout(timer);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[90svh] bg-[#E8F0FE] text-zinc-900 flex items-center justify-center px-6 sm:px-12 md:px-16 overflow-hidden select-none"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {TOKENS.map((words, pi) => (
          <p
            key={pi}
            className="text-lg sm:text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-[1.1] text-zinc-900 mb-5 last:mb-0 text-center text-pretty"
            style={{
              fontFamily:
                'var(--font-google-sans-display, "Google Sans Display", "Google Sans", "Product Sans", sans-serif)',
            }}
          >
            {words.map((token, wi) => {
              const pill = token.keyword && visible[pi] >= token.end;
              return (
                <React.Fragment key={wi}>
                  <span
                    className={`inline-block relative ${pill
                      ? "px-3 py-0.5 rounded-full font-semibold"
                      : token.keyword
                        ? "rounded-md"
                        : ""
                      }`}
                    style={
                      pill
                        ? {
                          backgroundColor: GDG_KEYWORDS[
                            token.text.toLowerCase().replace(/[.,!?;:"]/g, "")
                          ].bg,
                          color: GDG_KEYWORDS[
                            token.text.toLowerCase().replace(/[.,!?;:"]/g, "")
                          ].color,
                        }
                        : undefined
                    }
                  >
                    {Array.from(token.text).map((ch, ci) => {
                      const abs = token.start + ci;
                      const shown = visible[pi] > abs;
                      const caretHere =
                        !done && activePara === pi && visible[pi] === abs;
                      return (
                        <React.Fragment key={ci}>
                          {caretHere && <Caret />}
                          <span style={{ opacity: shown ? 1 : 0 }}>
                            {ch}
                          </span>
                        </React.Fragment>
                      );
                    })}
                    {!done && activePara === pi && visible[pi] === token.end && (
                      <Caret />
                    )}
                  </span>
                  {wi < words.length - 1 ? " " : ""}
                </React.Fragment>
              );
            })}
          </p>
        ))}
      </div>
    </section>
  );
}