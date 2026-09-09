"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTerminal, FaCloud, FaMobileScreenButton, FaBrain } from "react-icons/fa6";

const TRACKS = [
  {
    icon: FaBrain,
    title: "Applied AI & Gemini",
    desc: "Build multimodal agents, fine-tune models, and explore cutting-edge generative AI architectures.",
    color: "#4285F4", // Blue
    sessions: "12 Sessions",
  },
  {
    icon: FaCloud,
    title: "Cloud & DevOps",
    desc: "Master distributed systems, microservices, zero-trust security, and resilient GCP infrastructure.",
    color: "#EA4335", // Red
    sessions: "8 Sessions",
  },
  {
    icon: FaMobileScreenButton,
    title: "Android & Flutter",
    desc: "Next-gen Compose UI, cross-platform performance, Kotlin Multiplatform, and wearable computing.",
    color: "#FBBC05", // Yellow
    sessions: "10 Sessions",
  },
  {
    icon: FaTerminal,
    title: "Web & Edge Tech",
    desc: "High-performance web applications, modern frameworks, WebAssembly, and local edge computing.",
    color: "#34A853", // Green
    sessions: "9 Sessions",
  },
];

export default function TracksSection() {
  return (
    <section className="relative w-full bg-white text-zinc-900 py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3.5 py-1 text-xs font-medium text-zinc-600 mb-3">
              <span className="flex size-2 rounded-full bg-[#4285F4]" />
              <span>Event Tracks</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900"
              style={{
                fontFamily:
                  'var(--font-google-sans-display, "Google Sans Display", "Google Sans", sans-serif)',
              }}
            >
              Explore Learning Tracks
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-md">
            Four specialized tracks curated by industry leads to accelerate your engineering journey.
          </p>
        </div>

        {/* 4 Track Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRACKS.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all"
              >
                <div>
                  <div
                    className="size-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: track.color }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3
                    className="text-xl font-bold text-zinc-900 mb-2 tracking-tight"
                    style={{
                      fontFamily:
                        'var(--font-google-sans, "Google Sans", sans-serif)',
                    }}
                  >
                    {track.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {track.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>{track.sessions}</span>
                  <span className="text-zinc-900 group-hover:translate-x-1 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
