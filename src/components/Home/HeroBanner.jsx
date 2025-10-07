"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative h-[90vh] md:h-[100vh] pt-20 md:pt-28 lg:pt-24">
      {/* Background decoration */}
      <div className="absolute top-[-180px] md:top-[-300px] lg:top-[-280px] left-[-50px] md:left-[-220px] lg:left-[-180px] xl:left-[-50px] w-[350px] md:w-[500px] lg:w-[574px] aspect-square rounded-full bg-radial-green-dark" />

      {/* Hero content container */}
      <div className="container mx-auto px-4 pt-2 md:pt-4 lg:pt-6 pb-2 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 justify-around">
          {/* Left side with text */}
          <motion.div 
            className="text-center lg:text-left mb-2 md:mb-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 2, // After bridge fade-in (1s) and taxi animation (1.5s)
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <h1 className="text-[#FFF3D2] font-bold leading-[1] md:leading-[0.8] text-fluid albert_sans">
              DevFest
            </h1>
            <h2 className="text-[#FFF2D1] font-bold leading-[1.2] md:leading-[1.1] text-fluid albert_sans">
              Kolkata
            </h2>
            <h3 className="text-[#FFF3D2] font-bold text-fluid-100 albert_sans">
              '25
            </h3>
            
            {/* Learn More button - now inside the text container for same alignment */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 4, // Same timing as the right side image
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <Link href="#">
                <button className="relative px-6 py-2 md:py-3 text-xl font-semibold text-white rounded-full hover:scale-105 transition-transform duration-300 group google-gradient-border cursor-pointer">
                  <div className="flex items-center relative z-[2]">
                    <span className="albert_sans">Learn More</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none">
                      <path d="M13 7L18 12M18 12L13 17M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side with SVG graphic */}
          <motion.div 
            className="flex justify-center lg:justify-end items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 4, // After title pop-in completes
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <img
              className="w-60 sm:w-70 md:w-90 lg:w-96 h-auto"
              alt="DevFest Graphic"
              src="https://c.animaapp.com/mg29wexsYAh6GJ/img/subtract.svg"
            />
          </motion.div>
        </div>
      </div>

      {/* Minimal padding before the bridge */}
      {/* <div className="h-4 md:h-6 lg:h-8"></div> */}

      {/* Bridge graphic at bottom */}
      <motion.div 
        className="w-full absolute bottom-[2%] lg:bottom-[0%] mt-2 md:mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 1,
          ease: "easeIn"
        }}
      >
        <img
          className="w-full h-auto"
          alt="Howrah bridge"
          src="https://c.animaapp.com/mg29wexsYAh6GJ/img/howrah-bridge.svg"
        />
      </motion.div>

      {/* Yellow taxi with left-to-right animation - positioned at the bottom of the bridge */}
      <motion.div
        className="absolute bottom-[2%] lg:bottom-[0%] w-[70px] sm:w-[100px] md:w-[130px] lg:w-[180px] h-auto"
        initial={{ x: "-100vw", opacity: 0 }}
        animate={{ 
          x: ["-100vw", "100vw"],
          opacity: 1 
        }}
        transition={{ 
          x: {
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
            times: [0, 1]
          },
          opacity: {
            duration: 1,
            ease: "easeIn"
          }
        }}
      >
        <img
          src="/yellow_taxi.png"
          alt="Yellow taxi"
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}