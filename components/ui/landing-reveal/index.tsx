"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaPlay, FaPause, FaXmark } from "react-icons/fa6";

const REVEAL_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&auto=format&fit=crop&q=80",
];

export default function LandingReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);
  const videoSlotRef = useRef<HTMLDivElement>(null);
  const glassShellRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [revealDone, setRevealDone] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Slideshow auto-advance for Apple Glass widget
  useEffect(() => {
    if (!revealDone || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % REVEAL_IMAGES.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [revealDone, isPlaying]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Setup Counter Digits
      if (counter1Ref.current && counter2Ref.current && counter3Ref.current) {
        counter1Ref.current.innerHTML = `
          <div class="h-[120px] leading-[150px]">0</div>
          <div class="h-[120px] leading-[150px] relative right-[-30px]">1</div>
        `;

        let c2Html = "";
        for (let i = 0; i <= 10; i++) {
          c2Html += `<div class="h-[120px] leading-[150px] ${i === 1 ? "relative right-[-15px]" : ""}">${i === 10 ? "0" : i}</div>`;
        }
        counter2Ref.current.innerHTML = c2Html;

        let c3Html = "";
        for (let i = 0; i < 30; i++) {
          c3Html += `<div class="h-[120px] leading-[150px]">${i % 10}</div>`;
        }
        c3Html += `<div class="h-[120px] leading-[150px]">0</div>`;
        counter3Ref.current.innerHTML = c3Html;

        // Counter roll animations
        const c1Height = (counter1Ref.current.children.length - 1) * 120;
        const c2Height = (counter2Ref.current.children.length - 1) * 120;
        const c3Height = (counter3Ref.current.children.length - 1) * 120;

        gsap.to(counter3Ref.current, {
          y: -c3Height,
          duration: 2.3,
          ease: "power2.inOut",
        });
        gsap.to(counter2Ref.current, {
          y: -c2Height,
          duration: 2.7,
          ease: "power2.inOut",
        });
        gsap.to(counter1Ref.current, {
          y: -c1Height,
          duration: 1.8,
          delay: 1.2,
          ease: "power2.inOut",
        });
      }

      // Initial states: Cards start at top-left, Glass frame shell is completely hidden
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(validCards, { scale: 0, opacity: 0 });

      if (glassShellRef.current) {
        gsap.set(glassShellRef.current, {
          opacity: 0,
          scale: 0.94,
          y: 8,
        });
      }

      // Animate stacked images flying into the videoSlot target
      const flyCardsIntoWidget = () => {
        if (!videoSlotRef.current || !containerRef.current) return;

        // Get live bounding rectangle of destination slot inside the glass widget
        const containerRect = containerRef.current.getBoundingClientRect();
        const slotRect = videoSlotRef.current.getBoundingClientRect();

        const startX = 32; // top-8 left-8
        const startY = 32;
        const startWidth = 280;

        const targetX = slotRect.left - containerRect.left;
        const targetY = slotRect.top - containerRect.top;
        const scaleFactor = slotRect.width / startWidth;

        const flyTl = gsap.timeline();

        // 1. Stack of cards flies directly into the target slot position
        validCards.forEach((card, index) => {
          flyTl.to(
            card,
            {
              x: targetX - startX,
              y: targetY - startY,
              scale: scaleFactor,
              duration: 1.15,
              ease: "power3.inOut",
            },
            index * 0.065
          );
        });

        // 2. Only AFTER images arrive and settle in place: Apple Glass shell smoothly blooms around them
        if (glassShellRef.current) {
          flyTl.to(
            glassShellRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: "back.out(1.4)",
              onComplete: () => {
                setRevealDone(true);
              },
            },
            "-=0.2"
          );
        }

        return flyTl;
      };

      const mainTl = gsap.timeline();

      // 1. Background curtain wipe up
      mainTl.to(".reveal-hero-bg", {
        scaleY: "100%",
        duration: 2.5,
        ease: "power2.inOut",
        delay: 0.2,
      });

      // 2. All images pop in and stack up at top-left
      mainTl.to(
        validCards,
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        "<"
      );

      // 3. Counter fades away & triggers the stack flight directly into corner slot
      mainTl.to(".reveal-counter", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.25,
        onStart: () => {
          flyCardsIntoWidget();
        },
      });

      // 4. Fade out background curtain to reveal white Hero36 underneath
      mainTl.to(
        ".reveal-hero-bg",
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.6,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-40 w-full h-[100svh] pointer-events-none overflow-hidden select-none"
    >
      {/* Background loader curtain wipe */}
      <div
        className="reveal-hero-bg absolute inset-0 w-full h-full origin-bottom bg-[#faf9f7] pointer-events-auto"
        style={{
          transform: "scaleY(0%)",
        }}
      />

      {/* 0-100% Numerical Counter during initial load */}
      <div
        className="reveal-counter fixed right-8 sm:right-12 bottom-8 sm:bottom-10 z-30 flex h-[120px] text-[100px] sm:text-[120px] leading-[150px] font-bold text-zinc-900"
        style={{
          WebkitTextStroke: "2px #18181b",
          clipPath: "polygon(0 0, 100% 0, 100% 120px, 0 120px)",
        }}
      >
        <div ref={counter1Ref} className="relative top-[-15px]" />
        <div ref={counter2Ref} className="relative top-[-15px]" />
        <div ref={counter3Ref} className="relative top-[-15px]" />
      </div>

      {/* Apple-Glass Widget Shell: Invisible at start, appears ONLY after images settle in place */}
      {!isClosed && (
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-30 pointer-events-auto transition-all duration-300">
          <div
            ref={glassShellRef}
            className="group relative w-72 sm:w-80 md:w-88 rounded-3xl p-2.5 backdrop-blur-3xl bg-gradient-to-b from-white/55 via-white/35 to-white/45 border border-white/70 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18),0_8px_20px_-6px_rgba(0,0,0,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.22)] will-change-transform"
          >
            {/* Enhanced Glass Specular Gloss Highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/70 via-white/15 to-transparent opacity-90" />
            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

            {/* EXACT Destination Video Container Slot */}
            <div
              ref={videoSlotRef}
              className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-transparent"
            >
              {/* Live slideshow images that take over permanently once docked */}
              {revealDone &&
                REVEAL_IMAGES.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="DevFest Moment"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                      idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                  />
                ))}

              {/* Live Indicator Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/20">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>DevFest Moments</span>
              </div>

              {/* Close Button at top-right of image slot */}
              {revealDone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClosed(true);
                  }}
                  className="absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-150 border border-white/25 shadow-md cursor-pointer"
                  title="Close Highlights"
                  aria-label="Close Highlights"
                >
                  <FaXmark className="size-3.5" />
                </button>
              )}

              {/* Quick Play/Pause Control on Hover */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-105 border border-white/20"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause className="size-3" /> : <FaPlay className="size-3 ml-0.5" />}
              </button>
            </div>

            {/* Footer Bar of the Glass Widget */}
            <div className="flex items-center justify-between px-2 pt-2 pb-0.5">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900 tracking-tight">
                  DevFest Highlights
                </span>
                <span className="text-[10px] font-normal text-zinc-600">
                  Google Developer Groups Kolkata
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Progress Dots */}
                <div className="flex items-center gap-1">
                  {REVEAL_IMAGES.slice(0, 5).map((_, i) => (
                    <span
                      key={i}
                      className={`size-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlide % 5
                          ? "w-3 bg-zinc-900"
                          : "bg-zinc-400/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Secondary close button in footer */}
                {revealDone && (
                  <button
                    onClick={() => setIsClosed(true)}
                    className="p-1 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-black/5 transition-colors cursor-pointer"
                    title="Dismiss"
                    aria-label="Dismiss DevFest Highlights"
                  >
                    <FaXmark className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stacked Images flying from top-left directly into the corner destination */}
      {!revealDone && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {REVEAL_IMAGES.map((src, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute top-8 left-8 w-[280px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/40 origin-top-left will-change-transform"
            >
              <img
                src={src}
                alt={`DevFest moment ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
