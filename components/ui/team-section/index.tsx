"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Marquee } from "@/demos/ui/marquee";

const teamMembers = [
  {
    image: "/team/sumantro.webp",
    name: "Sumantro Mukherjee",
    role: "Organiser",
  },
  {
    image: "/team/atri-das.webp",
    name: "Atri Das",
    role: "Organiser",
  },
  {
    image: "/team/sarmistha.webp",
    name: "Sarmistha Ghosh",
    role: "Event Organiser",
  },
  {
    image: "/team/akash.webp",
    name: "Akash Kumar Majumder",
    role: "Event Organiser",
  },
  {
    image: "/team/ankan.webp",
    name: "Ankan Saha",
    role: "Web Dev",
  },
  {
    image: "/team/rahul-pal.webp",
    name: "Rahul Pal",
    role: "Web Dev",
  },
  {
    image: "/team/subhadip-das.webp",
    name: "Subhadip Das",
    role: "Web Dev",
  },
  {
    image: "/team/udity.webp",
    name: "Udity Banerjee",
    role: "Graphics",
  },
  {
    image: "/team/tarun.webp",
    name: "Tarun Binay Das",
    role: "Graphics",
  },
  {
    image: "/team/protyoy.webp",
    name: "Protyoy Bhandary",
    role: "Graphics",
  },
  {
    image: "/team/titash.webp",
    name: "Titash Shil",
    role: "PR and Outreach",
  },
  {
    image: "/team/shromana.webp",
    name: "Shromana Majumder",
    role: "Emcee",
  },
  {
    image: "/team/simran.webp",
    name: "Simran Sharma",
    role: "Emcee",
  },
  {
    image: "/team/soumyadeep.webp",
    name: "Soumyadeep Halder",
    role: "Photography / Videography",
  },
  {
    image: "/team/sweety.webp",
    name: "Sweety Jha",
    role: "Social Media",
  },
];

export default function TeamSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    pointerId: 0,
    startX: 0,
    lastX: 0,
    dx: 0,
    lastMoveAt: 0,
  });

  const setPaused = (paused: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.classList.toggle("marquee-paused", paused);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    // Stop native image drag so the gesture reaches our horizontal sweep
    if ((e.target as HTMLElement).closest("img")) {
      e.preventDefault();
    }
    track.setPointerCapture(e.pointerId);
    dragState.current = {
      isDragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      dx: 0,
      lastMoveAt: 0,
    };
    setPaused(true);
    track.classList.add("marquee-dragging");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging || e.pointerId !== state.pointerId) return;
    const dx = e.clientX - state.startX;
    state.dx = dx;
    state.lastMoveAt = performance.now();
    // Move the track to follow the pointer
    if (trackRef.current) {
      trackRef.current.style.setProperty(
        "--marquee-drag",
        `${dx}px`
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging || e.pointerId !== state.pointerId) return;
    state.isDragging = false;
    const track = trackRef.current;
    if (track) {
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      track.classList.remove("marquee-dragging");
      track.style.removeProperty("--marquee-drag");
      setPaused(false);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => handlePointerUp(e);

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <section id="team" className="relative w-full bg-[#E6F4EA] py-12 md:py-24 dark:bg-background overflow-visible">

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 flex max-w-5xl flex-col items-center px-6 text-center lg:px-0">

          <h1 className="relative mb-4 font-medium text-4xl text-zinc-700 tracking-tight sm:text-5xl">
            Powerhouse Of GDG Kolkata
          </h1>
          <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
            Meet the incredible minds behind DevFest Kolkata - the dream team
            dedicated to making this year&apos;s event unforgettable.
          </p>
        </div>

        <div className="relative w-full">
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onDragStart={handleDragStart}
            className="marquee-track cursor-grab active:cursor-grabbing touch-pan-y select-none"
          >
          <Marquee className="[--gap:1.5rem] overflow-visible" pauseOnHover>
            {teamMembers.map((member) => (
              <div
                className="group flex w-64 shrink-0 flex-col"
                key={member.name}
              >
                <div className="relative h-92 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    alt={member.name}
                    className="h-full w-full object-cover select-none grayscale transition-all duration-300 hover:grayscale-0"
                    draggable={false}
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    src={member.image}
                  />
                  <div className="absolute bottom-0 w-full rounded-lg bg-neutral-100/85 p-3 backdrop-blur-xs dark:bg-neutral-800/80">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </h3>
                    <p className="text-neutral-600 text-sm dark:text-neutral-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          </div>
        </div>

      </div>
    </section>
  );
}
