"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionPattern from "@/components/ui/section-pattern";
import GoogleDots from "@/components/ui/google-dots";

gsap.registerPlugin(ScrollTrigger);

export interface Speaker {
  initial: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  topic: string;
  image: string;
  accentColor: string;
}

const SPEAKERS: Speaker[] = [
  {
    initial: "?",
    firstName: "Mystery",
    lastName: "Keynote #1",
    role: "Global Tech Keynote",
    company: "Google",
    topic: "Frontier AI & Global Engineering Keynote",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    accentColor: "#4285F4", // Google Blue
  },
  {
    initial: "?",
    firstName: "Mystery",
    lastName: "Speaker #2",
    role: "Google Developer Expert",
    company: "Cloud & Distributed Systems",
    topic: "Hyperscale Architecture & Kubernetes",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    accentColor: "#EA4335", // Google Red
  },
  {
    initial: "?",
    firstName: "Mystery",
    lastName: "Pioneer #3",
    role: "Staff AI Researcher",
    company: "Gemini & Deep Learning",
    topic: "Multimodal Autonomous Agents",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    accentColor: "#FBBC05", // Google Yellow
  },
  {
    initial: "?",
    firstName: "Mystery",
    lastName: "Leader #4",
    role: "Engineering Director",
    company: "Web & Open Source",
    topic: "The Future of Web & Edge Experiences",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    accentColor: "#34A853", // Google Green
  },
];

export default function SpeakerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cardPlaceholderEntrance: ScrollTrigger | null = null;
    let cardSlideInAnimation: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const teamMembers = gsap.utils.toArray<HTMLElement>(".team-member");
      const teamMemberCards = gsap.utils.toArray<HTMLElement>(".team-member-card");

      function initTeamAnimations() {
        if (window.innerWidth < 1024) {
          if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
          if (cardSlideInAnimation) cardSlideInAnimation.kill();

          teamMembers.forEach((member) => {
            gsap.set(member, { clearProps: "all" });
            const teamMemberInitial = member.querySelector(
              ".team-member-name-initial h1"
            );
            if (teamMemberInitial) gsap.set(teamMemberInitial, { clearProps: "all" });
          });

          // Cards fall back to their CSS-centered state (translate(-50%, -50%))
          teamMemberCards.forEach((card) => {
            gsap.set(card, { clearProps: "all" });
          });
          return;
        }

        if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
        if (cardSlideInAnimation) cardSlideInAnimation.kill();

        // 1. Initial State: Slots translated down 125%, initial letter scaled to 0
        gsap.set(teamMembers, { y: "125%" });
        teamMembers.forEach((member) => {
          const teamMemberInitial = member.querySelector(
            ".team-member-name-initial h1"
          );
          if (teamMemberInitial) gsap.set(teamMemberInitial, { scale: 0 });
        });

        // Initial Card offscreen positions (Card 0 is farthest right 300%, Card 3 is at 0%)
        teamMemberCards.forEach((card, index) => {
          const cardInitialX = 300 - index * 100;
          gsap.set(card, {
            x: `${cardInitialX}%`,
            rotation: 20,
            scale: 0.75,
          });
        });

        // 2. Entrance Trigger: Slots rise up from bottom as user scrolls towards section
        cardPlaceholderEntrance = ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          end: "top top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            teamMembers.forEach((member, index) => {
              const entranceDelay = 0.12;
              const entranceDuration = 0.65;
              const entranceStart = index * entranceDelay;
              const entranceEnd = entranceStart + entranceDuration;

              if (progress >= entranceStart && progress <= entranceEnd) {
                const memberEntranceProgress =
                  (progress - entranceStart) / entranceDuration;

                const entranceY = 125 - memberEntranceProgress * 125;
                gsap.set(member, { y: `${entranceY}%` });

                const teamMemberInitial = member.querySelector(
                  ".team-member-name-initial h1"
                );
                const initialLetterScaleDelay = 0.4;
                const initialLetterScaleProgress = Math.max(
                  0,
                  (memberEntranceProgress - initialLetterScaleDelay) /
                  (1 - initialLetterScaleDelay)
                );
                if (teamMemberInitial) {
                  gsap.set(teamMemberInitial, { scale: initialLetterScaleProgress });
                }
              } else if (progress > entranceEnd) {
                gsap.set(member, { y: `0%` });
                const teamMemberInitial = member.querySelector(
                  ".team-member-name-initial h1"
                );
                if (teamMemberInitial) gsap.set(teamMemberInitial, { scale: 1 });
              } else {
                gsap.set(member, { y: `125%` });
                const teamMemberInitial = member.querySelector(
                  ".team-member-name-initial h1"
                );
                if (teamMemberInitial) gsap.set(teamMemberInitial, { scale: 0 });
              }
            });
          },
        });

        // 3. Pin & Slide-in Animation: Pins section while cards fly in from the right edge into each slot
        cardSlideInAnimation = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 0.4}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            teamMemberCards.forEach((card, index) => {
              const slideInStagger = 0.075;
              const xRotationDuration = 0.4;
              const xRotationStart = index * slideInStagger;
              const xRotationEnd = xRotationStart + xRotationDuration;

              // Exact template math: Card 0 (300%), Card 1 (200%), Card 2 (100%), Card 3 (0%) -> all land at -50%
              const cardInitialX = 300 - index * 100;
              const cardTargetX = -50;

              if (progress >= xRotationStart && progress <= xRotationEnd) {
                const cardProgress =
                  (progress - xRotationStart) / xRotationDuration;

                const cardSlideInX =
                  cardInitialX + cardProgress * (cardTargetX - cardInitialX);
                const cardSlideInRotation = 20 - cardProgress * 20;

                gsap.set(card, {
                  x: `${cardSlideInX}%`,
                  rotation: cardSlideInRotation,
                });
              } else if (progress > xRotationEnd) {
                gsap.set(card, {
                  x: `-50%`,
                  rotation: 0,
                });
              } else {
                gsap.set(card, {
                  x: `${cardInitialX}%`,
                  rotation: 20,
                });
              }

              // Card scale from 0.75 -> 1.0
              const cardScaleStagger = 0.12;
              const cardScaleStart = 0.4 + index * cardScaleStagger;
              const cardScaleEnd = 1;

              if (progress >= cardScaleStart && progress <= cardScaleEnd) {
                const scaleProgress =
                  (progress - cardScaleStart) / (cardScaleEnd - cardScaleStart);
                const scaleValue = 0.75 + scaleProgress * 0.25;

                gsap.set(card, {
                  scale: scaleValue,
                });
              } else if (progress > cardScaleEnd) {
                gsap.set(card, {
                  scale: 1,
                });
              } else {
                gsap.set(card, {
                  scale: 0.75,
                });
              }
            });
          },
        });
      }

      initTeamAnimations();

      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initTeamAnimations();
          ScrollTrigger.refresh();
        }, 200);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
        if (cardSlideInAnimation) cardSlideInAnimation.kill();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className="relative w-full min-h-[100svh] lg:h-[100svh] bg-[#FCE8E6] text-zinc-900 px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-6 flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <SectionPattern variant="dots" glow={0.16} brackets />

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:h-full lg:max-h-[560px] justify-between">
        {/* Top Header */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-100/80 shrink-0">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-zinc-200/80 bg-zinc-50/80 backdrop-blur-sm px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <GoogleDots variant="wave" />
              <span className="tracking-wide">DevFest Speakers &apos;26</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-zinc-900 leading-none"
              style={{
                fontFamily:
                  'var(--font-google-sans-display, "Google Sans Display", "Google Sans", sans-serif)',
              }}
            >
              Mystery Speakers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal max-w-sm sm:text-right leading-relaxed">
            Lineup reveals dropping soon! World-class leaders & innovators from Google & global tech.
          </p>
        </div>

        {/* 4 Speaker cards: grid (1-col) on phones, 2-col on tablets, pinned GSAP row on desktop */}
        <div className="team grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 mt-6 lg:flex lg:flex-row lg:gap-9 w-full lg:flex-1 lg:min-h-0 items-stretch justify-center">
          {SPEAKERS.map((speaker, index) => (
            <div
              key={index}
              className="team-member relative w-full h-[440px] sm:h-[420px] lg:h-full lg:max-h-[450px] rounded-[1.5rem] border-2 border-dashed border-zinc-300/80 bg-zinc-50/50 will-change-transform"
              style={{
                zIndex: 4 - index,
              }}
            >
              {/* Centered Watermark Initial */}
              <div
                className="team-member-name-initial absolute top-1/2 left-1/2 pointer-events-none select-none"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <h1
                  className="text-[7rem] sm:text-[8rem] lg:text-[10.5rem] font-bold leading-none will-change-transform"
                  style={{
                    color: speaker.accentColor,
                    opacity: 0.22,
                    fontFamily:
                      'var(--font-google-sans-display, "Google Sans Display", sans-serif)',
                  }}
                >
                  {speaker.initial}
                </h1>
              </div>

              {/* Sliding Team Member Card */}
              <div
                className="team-member-card team-member-card-init absolute top-1/2 left-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] p-4 flex flex-col justify-between rounded-[1.5rem] bg-white border border-zinc-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.06)] will-change-transform"
                style={{ "--card-init-x": `${300 - index * 100}%` } as React.CSSProperties}
              >
                {/* Card Top: Pill & Socials */}
                <div className="w-full flex items-center justify-between mb-3">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
                    style={{ backgroundColor: speaker.accentColor }}
                  >
                    {speaker.company}
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-400 uppercase">
                      Teaser
                    </span>
                  </div>
                </div>

                {/* Card Center: Mystery Silhouette with Glowing Accent & Revealing Soon badge */}
                <div className="team-member-img relative w-full flex-1 min-h-0 rounded-xl overflow-hidden mb-2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 aspect-square flex flex-col items-center justify-center select-none">
                  <div
                    className="absolute inset-0 opacity-25 blur-xl pointer-events-none"
                    style={{ backgroundColor: speaker.accentColor }}
                  />
                  <span
                    className="text-6xl font-black font-mono select-none drop-shadow-md transition-transform duration-300 hover:scale-110"
                    style={{ color: speaker.accentColor }}
                  >
                    ?
                  </span>
                  <span className="mt-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-200 border border-white/15 shadow-xs">
                    Revealing Soon
                  </span>
                </div>

                {/* Card Bottom: Role & Name */}
                <div className="team-member-info flex mt-3 flex-col text-left gap-0.5 border-t border-zinc-200/70 pt-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    ( {speaker.role} )
                  </p>
                  <h3
                    className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 leading-tight"
                    style={{
                      fontFamily:
                        'var(--font-google-sans, "Google Sans", sans-serif)',
                    }}
                  >
                    {speaker.firstName}{" "}
                    <span style={{ color: speaker.accentColor }}>
                      {speaker.lastName}
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-600 line-clamp-1 italic">
                    &ldquo;{speaker.topic}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
