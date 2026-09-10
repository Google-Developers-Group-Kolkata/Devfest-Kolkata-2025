import React from "react";
import { GOOGLE_COLORS } from "@/components/ui/section-pattern";

/* ── GoogleEqualizer ───────────────────────────────────────────────────────
   The four Google dots, re-cut as a music equaliser. Each bar runs the same
   `gdgEqualise` keyframe on a staggered delay and a slightly different
   tempo, so the group never falls into lockstep. Collapses to four static
   bars under `prefers-reduced-motion`.                                    */

const BARS = [
  { color: GOOGLE_COLORS[0], delay: "0s", duration: "1.05s" },
  { color: GOOGLE_COLORS[1], delay: "-0.75s", duration: "0.85s" },
  { color: GOOGLE_COLORS[2], delay: "-0.35s", duration: "1.25s" },
  { color: GOOGLE_COLORS[3], delay: "-0.55s", duration: "0.95s" },
];

export interface GoogleEqualizerProps {
  /** Bar height in px — width and gap scale from it. */
  height?: number;
  /** Freeze the bars (used for hover/pause states). */
  paused?: boolean;
  className?: string;
}

export default function GoogleEqualizer({
  height = 16,
  paused = false,
  className = "",
}: GoogleEqualizerProps) {
  const barWidth = Math.max(2, Math.round(height * 0.19));

  return (
    <span
      className={`inline-flex items-end ${className}`}
      style={{ height, gap: Math.max(2, Math.round(height * 0.16)) }}
      role="img"
      aria-label="Now playing"
    >
      {BARS.map((bar, i) => (
        <span
          key={i}
          className="gdg-eq-bar block rounded-full"
          style={
            {
              width: barWidth,
              height: "100%",
              backgroundColor: bar.color,
              animationPlayState: paused ? "paused" : "running",
              "--eq-delay": bar.delay,
              "--eq-duration": bar.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
