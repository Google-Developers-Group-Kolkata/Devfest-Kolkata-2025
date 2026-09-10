import React from "react";
import { GOOGLE_COLORS } from "@/components/ui/section-pattern";

/* ── GoogleDots ────────────────────────────────────────────────────────────
   The four Google dots that head up each section's eyebrow. Every section
   runs a different behaviour, so the mark reads as the same family without
   four identical loops ticking on screen at once:

     wave    staggered vertical bounce      → Mystery Speakers
     pulse   breathing scale                → Tickets
     typing  chat-indicator fade + lift     → Testimonials
     orbit   dots chase a small circle      → Footer

   The FAQ badge uses <GoogleEqualizer /> instead — bars, not dots.        */

export type DotAnimation = "wave" | "pulse" | "typing" | "orbit";

/** Tempo per variant, and the gap between each dot's start. `orbit` is
 *  staggered to exactly a quarter of its cycle so the four dots sit evenly
 *  spaced around the ring. */
const TIMING: Record<DotAnimation, { duration: number; stagger: number }> = {
  wave: { duration: 1.4, stagger: 0.12 },
  pulse: { duration: 1.8, stagger: 0.22 },
  typing: { duration: 1.15, stagger: 0.15 },
  orbit: { duration: 2.4, stagger: 0.6 },
};

export interface GoogleDotsProps {
  variant?: DotAnimation;
  /** Dot diameter in px; the gap scales from it. */
  size?: number;
  className?: string;
}

export default function GoogleDots({
  variant = "wave",
  size = 6,
  className = "",
}: GoogleDotsProps) {
  const { duration, stagger } = TIMING[variant];

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: Math.max(2, Math.round(size * 0.7)) }}
      aria-hidden="true"
    >
      {GOOGLE_COLORS.map((color, i) => (
        <span
          key={color}
          className={`block shrink-0 rounded-full gdg-dot-${variant}`}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDuration: `${duration}s`,
            // Negative delays so the group is already mid-cycle on first paint.
            animationDelay: `-${(stagger * i).toFixed(2)}s`,
          }}
        />
      ))}
    </span>
  );
}
