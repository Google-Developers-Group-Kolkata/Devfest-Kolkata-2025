"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import SectionPattern, { GOOGLE_COLORS } from "@/components/ui/section-pattern";

/* ── Gemini-style streaming copy ───────────────────────────────────────────
   The paragraphs arrive the way Gemini writes them out: word by word at an
   even cadence, each one surfacing out of a soft blur with a small lift and
   lit for a beat in one of the four Google hues before it cools to ink. A
   gradient caret rides the leading edge until the last word lands, and the
   four brand keywords bloom their pill as they arrive.                    */

const INK = "#202124";

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

/* Choreography, in seconds. */
const LEAD_IN = 0.35;       // beat between the section landing and the first word
const STAGGER = 0.055;      // gap between consecutive words — even, like a stream
const PARAGRAPH_GAP = 0.45; // extra beat before a new paragraph starts
const WORD_IN = 0.55;       // how long one word takes to surface
const GLOW_OUT = 0.6;       // how long a word's brand-colour glow takes to cool
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]; // expo-out

/** #rrggbb → rgba(), so Framer can interpolate the glow's alpha away. */
function glow(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

type Word = {
  text: string;
  index: number; // running index across every paragraph
  accent: string; // hue this word is lit with on arrival
  pill?: { color: string; bg: string };
};

function buildLines(paragraphs: string[]): Word[][] {
  let index = 0;
  return paragraphs.map((paragraph) =>
    paragraph.split(/\s+/).map((text) => {
      const key = text.toLowerCase().replace(/[.,!?;:"]/g, "");
      const word: Word = {
        text,
        index,
        accent: GOOGLE_COLORS[index % GOOGLE_COLORS.length],
        pill: GDG_KEYWORDS[key],
      };
      index += 1;
      return word;
    })
  );
}

const LINES = buildLines(PARAGRAPHS);

const delayFor = (word: Word, line: number) =>
  LEAD_IN + word.index * STAGGER + line * PARAGRAPH_GAP;

/** When each word starts, flattened in reading order — drives the caret. */
const SCHEDULE = LINES.flatMap((words, line) =>
  words.map((word) => ({ index: word.index, at: delayFor(word, line) }))
);
const STREAM_END = SCHEDULE[SCHEDULE.length - 1].at + WORD_IN * 0.5;

/** The writing head: a four-colour gradient bar with a soft bloom. */
function StreamCaret({ fading, onGone }: { fading: boolean; onGone: () => void }) {
  return (
    <motion.span
      aria-hidden
      className="ml-[0.06em] inline-block h-[0.95em] w-[0.13em] rounded-full"
      style={{
        background: `linear-gradient(180deg, ${GOOGLE_COLORS[0]}, ${GOOGLE_COLORS[1]} 36%, ${GOOGLE_COLORS[2]} 66%, ${GOOGLE_COLORS[3]})`,
        boxShadow: `0 0 14px 2px ${glow(GOOGLE_COLORS[0], 0.4)}`,
      }}
      initial={{ opacity: 0, scaleY: 0.35, y: "0.14em" }}
      animate={
        fading
          ? { opacity: 0, scaleY: 0.35 }
          : { opacity: [1, 0.32, 1], scaleY: 1 }
      }
      transition={
        fading
          ? { duration: 0.45, ease: "easeOut" }
          : {
            opacity: { duration: 1.15, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 0.22, ease: "easeOut" },
          }
      }
      onAnimationComplete={() => {
        if (fading) onGone();
      }}
    />
  );
}

function StreamWord({
  word,
  delay,
  animated,
  play,
}: {
  word: Word;
  delay: number;
  /** Mount the word blurred-out, ready to be written in. */
  animated: boolean;
  /** The section has landed — write it in now. */
  play: boolean;
}) {
  const settledColor = word.pill ? word.pill.color : INK;

  const text = animated ? (
    <motion.span
      className="relative inline-block"
      initial={{
        opacity: 0,
        y: "0.34em",
        scale: 0.96,
        filter: "blur(7px)",
        color: word.pill ? settledColor : word.accent,
      }}
      animate={
        play
          ? {
              opacity: 1,
              y: "0em",
              scale: 1,
              filter: "blur(0px)",
              // Keywords take their cue from the pill blooming behind them,
              // so only the plain words flash a brand hue on the way in.
              ...(word.pill
                ? {}
                : {
                    color: [word.accent, word.accent, INK],
                    textShadow: [
                      `0 0 20px ${glow(word.accent, 0.5)}`,
                      `0 0 0px ${glow(word.accent, 0)}`,
                    ],
                  }),
            }
          : undefined
      }
      transition={{
        duration: WORD_IN,
        delay,
        ease: EASE,
        ...(word.pill
          ? {}
          : {
              color: {
                duration: GLOW_OUT,
                delay,
                times: [0, 0.25, 1],
                ease: "easeOut",
              },
              textShadow: { duration: GLOW_OUT, delay, ease: "easeOut" },
            }),
      }}
    >
      {word.text}
    </motion.span>
  ) : (
    <span className="relative inline-block" style={{ color: settledColor }}>
      {word.text}
    </span>
  );

  if (!word.pill) return text;

  return (
    <span className="relative inline-block rounded-full px-3 py-0.5 font-semibold">
      {animated ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: word.pill.bg }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={play ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay, type: "spring", stiffness: 380, damping: 24, mass: 0.7 }}
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: word.pill.bg }}
        />
      )}
      {text}
    </span>
  );
}

export default function ScrollTextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -25% 0px",
  });

  /* Server-rendered, script-less and reduce-motion readers get the copy as
     plain, finished text. Only once we know the browser wants motion do we
     mount the words blurred-out — decided in a layout effect so the swap
     happens before the first paint, with no flash of settled text. */
  const [animated, setAnimated] = useState(false);
  useIsomorphicLayoutEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimated(true);
    }
  }, []);

  const play = animated && inView;

  const [caretAt, setCaretAt] = useState(-1);
  const [ended, setEnded] = useState(false);

  // The caret runs off the same schedule the words animate on, so it always
  // sits at the frontier of the text being written.
  useEffect(() => {
    if (!play) return;
    const timers = SCHEDULE.map(({ index, at }) =>
      window.setTimeout(() => setCaretAt(index), at * 1000)
    );
    timers.push(window.setTimeout(() => setEnded(true), STREAM_END * 1000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [play]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[90svh] bg-[#E8F0FE] text-zinc-900 flex items-center justify-center px-6 sm:px-12 md:px-16 overflow-hidden select-none"
    >
      <SectionPattern variant="dots-grid" glow={0.15} gridSize={80} />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {LINES.map((words, li) => (
          <p
            key={li}
            className="text-lg sm:text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-[1.1] text-zinc-900 mb-5 last:mb-0 text-center text-pretty"
            style={{
              fontFamily:
                'var(--font-google-sans-display, "Google Sans Display", "Google Sans", "Product Sans", sans-serif)',
            }}
          >
            {words.map((word, wi) => (
              <React.Fragment key={wi}>
                <StreamWord
                  word={word}
                  delay={delayFor(word, li)}
                  animated={animated}
                  play={play}
                />
                {caretAt === word.index && (
                  <StreamCaret fading={ended} onGone={() => setCaretAt(-1)} />
                )}
                {wi < words.length - 1 ? " " : ""}
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
