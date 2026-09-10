import React from "react";

/* ── SectionPattern ────────────────────────────────────────────────────────
   A decorative, fully inert backdrop that breaks up the flat section fills
   with Google-brand motifs: a Material dot matrix, a blueprint grid, the
   concentric "signal" arcs, the four-colour brand stripe, drifting GDG
   colour glows, and floating angle brackets lifted from the DevFest mark.

   Drop it in as the first child of a `relative` section and give the
   section's content wrapper `relative z-10`.                              */

export const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"] as const;

export type PatternVariant = "dots" | "grid" | "dots-grid" | "arcs";

type ArcOrigin =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "center";

const ARC_ORIGINS: Record<ArcOrigin, { x: string; y: string }> = {
  "top-right": { x: "100%", y: "0%" },
  "top-left": { x: "0%", y: "0%" },
  "bottom-right": { x: "100%", y: "100%" },
  "bottom-left": { x: "0%", y: "100%" },
  center: { x: "50%", y: "50%" },
};

interface GlowSpec {
  color: string;
  style: React.CSSProperties;
  driftX: string;
  driftY: string;
  duration: string;
  delay: string;
}

/** Four ambient colour washes, one per Google hue, parked in the corners. */
const GLOWS: GlowSpec[] = [
  { color: GOOGLE_COLORS[0], style: { top: "-12%", left: "-8%", width: "38vw", height: "38vw" }, driftX: "6%", driftY: "8%", duration: "26s", delay: "0s" },
  { color: GOOGLE_COLORS[1], style: { top: "8%", right: "-10%", width: "32vw", height: "32vw" }, driftX: "-7%", driftY: "6%", duration: "31s", delay: "-6s" },
  { color: GOOGLE_COLORS[2], style: { bottom: "-14%", left: "18%", width: "34vw", height: "34vw" }, driftX: "5%", driftY: "-9%", duration: "29s", delay: "-12s" },
  { color: GOOGLE_COLORS[3], style: { bottom: "2%", right: "6%", width: "28vw", height: "28vw" }, driftX: "-6%", driftY: "-7%", duration: "34s", delay: "-3s" },
];

interface BracketSpec {
  glyph: string;
  size: string;
  color: string;
  rot: string;
  duration: string;
  delay: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

/** Angle-bracket confetti echoing the `< >` GDG logo mark. */
const BRACKETS: BracketSpec[] = [
  { glyph: "<", top: "13%", left: "2.5%", size: "3rem", color: GOOGLE_COLORS[0], rot: "-8deg", duration: "9s", delay: "0s" },
  { glyph: "</>", bottom: "15%", left: "3%", size: "2rem", color: GOOGLE_COLORS[3], rot: "6deg", duration: "11s", delay: "-3s" },
  { glyph: ">", top: "24%", right: "3%", size: "3rem", color: GOOGLE_COLORS[1], rot: "8deg", duration: "10s", delay: "-1.5s" },
  { glyph: "/>", bottom: "18%", right: "2.5%", size: "2.25rem", color: GOOGLE_COLORS[2], rot: "-6deg", duration: "12s", delay: "-5s" },
];

export interface SectionPatternProps {
  /** Structural motif drawn behind the content. */
  variant?: PatternVariant;
  /** `light` inks the motif dark for pale fills, `dark` inks it white. */
  tone?: "light" | "dark";
  /** Ambient four-colour glow opacity, 0 turns the glows off. */
  glow?: number;
  /** Where the concentric arcs radiate from. */
  arcOrigin?: ArcOrigin;
  /** Accent hue for the arcs — defaults to Google Blue. */
  arcColor?: string;
  /** Pin the four-colour Google stripe to an edge. */
  ribbon?: "top" | "bottom" | false;
  /** Float a few angle brackets from the DevFest mark. */
  brackets?: boolean;
  /** Spacing of the dot matrix / grid rules. */
  dotSize?: number;
  gridSize?: number;
  className?: string;
}

export default function SectionPattern({
  variant = "dots",
  tone = "light",
  glow = 0.22,
  arcOrigin = "top-right",
  arcColor = GOOGLE_COLORS[0],
  ribbon = false,
  brackets = false,
  dotSize = 22,
  gridSize = 72,
  className = "",
}: SectionPatternProps) {
  const isDark = tone === "dark";
  const dotColor = isDark ? "rgba(255,255,255,0.13)" : "rgba(32,33,36,0.15)";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(32,33,36,0.065)";

  const showDots = variant === "dots" || variant === "dots-grid";
  const showGrid = variant === "grid" || variant === "dots-grid";
  const showArcs = variant === "arcs";
  const arc = ARC_ORIGINS[arcOrigin];

  return (
    <div className={`gdg-pattern ${className}`} aria-hidden="true">
      {/* Ambient GDG colour wash */}
      {glow > 0 &&
        GLOWS.map((g, i) => (
          <span
            key={`glow-${i}`}
            className="gdg-glow"
            style={
              {
                ...g.style,
                opacity: glow,
                "--gdg-glow-color": g.color,
                "--gdg-drift-x": g.driftX,
                "--gdg-drift-y": g.driftY,
                "--gdg-glow-duration": g.duration,
                "--gdg-glow-delay": g.delay,
              } as React.CSSProperties
            }
          />
        ))}

      {/* Blueprint rules sit under the dot matrix */}
      {showGrid && (
        <span
          className="gdg-layer gdg-grid"
          style={
            {
              "--gdg-grid-color": gridColor,
              "--gdg-grid-size": `${gridSize}px`,
            } as React.CSSProperties
          }
        />
      )}

      {showDots && (
        <span
          className="gdg-layer gdg-dots"
          style={
            {
              "--gdg-dot-color": dotColor,
              "--gdg-dot-size": `${dotSize}px`,
            } as React.CSSProperties
          }
        />
      )}

      {showArcs && (
        <>
          <span
            className="gdg-layer gdg-arcs"
            style={
              {
                "--gdg-arc-x": arc.x,
                "--gdg-arc-y": arc.y,
                "--gdg-arc-color": `${arcColor}2E`,
              } as React.CSSProperties
            }
          />
          <span
            className="gdg-layer gdg-dots"
            style={
              {
                "--gdg-dot-color": dotColor,
                "--gdg-dot-size": `${dotSize}px`,
                "--gdg-dot-mask":
                  "radial-gradient(90% 70% at 10% 100%, #000 0%, transparent 70%)",
              } as React.CSSProperties
            }
          />
        </>
      )}

      {brackets &&
        BRACKETS.map((b, i) => (
          <span
            key={`bracket-${i}`}
            className="gdg-bracket hidden sm:block"
            style={
              {
                top: b.top,
                bottom: b.bottom,
                left: b.left,
                right: b.right,
                fontSize: b.size,
                color: b.color,
                opacity: isDark ? 0.15 : 0.11,
                "--gdg-float-rot": b.rot,
                "--gdg-float-duration": b.duration,
                "--gdg-float-delay": b.delay,
              } as React.CSSProperties
            }
          >
            {b.glyph}
          </span>
        ))}

      {ribbon && (
        <span
          className="gdg-ribbon"
          style={{
            top: ribbon === "top" ? 0 : undefined,
            bottom: ribbon === "bottom" ? 0 : undefined,
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}
