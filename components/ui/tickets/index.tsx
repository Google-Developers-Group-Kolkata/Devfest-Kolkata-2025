"use client";

import React from "react";
import { FaTicketSimple } from "react-icons/fa6";

const GDG_CARD_BGS = [
  { tint: "#E8F0FE", text: "#4285F4" },
  { tint: "#FCE8E6", text: "#EA4335" },
  { tint: "#E6F4EA", text: "#34A853" },
];

export default function TicketsSection() {
  return (
    <section id="tickets" className="relative w-full bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            <span className="size-1.5 rounded-full bg-[#4285F4]" />
            <span className="size-1.5 rounded-full bg-[#EA4335]" />
            <span className="size-1.5 rounded-full bg-[#FBBC05]" />
            <span className="size-1.5 rounded-full bg-[#34A853]" />
            <span className="ml-1 text-zinc-500">DevFest Passes</span>
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Grab your Tickets
          </h2>
          <p className="text-base text-zinc-500 sm:text-lg">
            Passes drop soon. Stay tuned.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {GDG_CARD_BGS.map((card, index) => (
            <div
              key={index}
              className="relative h-[360px] w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-zinc-100"
              style={{ backgroundColor: card.tint }}
            >
              <div
                className="absolute inset-0 blur-md"
                style={{
                  background: `radial-gradient(60% 60% at 50% 45%, ${card.text}26, transparent 70%)`,
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/20 backdrop-blur-sm">
                <span
                  className="flex size-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${card.text}1A`,
                    color: card.text,
                  }}
                >
                  <FaTicketSimple className="size-5" />
                </span>
                <span
                  className="rounded-full border px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{
                    color: card.text,
                    borderColor: `${card.text}40`,
                  }}
                >
                  Coming Soon
                </span>
                <p
                  className="text-sm font-medium"
                  style={{ color: `${card.text}B3` }}
                >
                  Tickets opening soon
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}