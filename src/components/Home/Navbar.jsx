"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative w-full py-4 z-50">
      <div className="container mx-auto px-4 md:max-w-4xl">
        <div className="relative flex items-center justify-between bg-black rounded-[30px] py-1 md:py-3 px-5 google-gradient-border">
          {/* Logo and brand */}
          <div className="flex items-center md:w-auto w-full md:justify-start justify-between">
            <div className="flex items-center">
              <img
                src="/favicon.svg"
                alt="DevFest Logo"
                className="h-12 w-auto mr-2"
              />
              <span className="font-semibold text-2xl text-white albert_sans">DevFest</span>
            </div>

            {/* Mobile menu button with animation */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                className="text-white focus:outline-none p-2"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isMenuOpen ? (
                    <motion.svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </motion.svg>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Home</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Schedule</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Tracks</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Socials</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">FAQ</Link>
          </div>

          {/* Login button - Desktop */}
          <div className="hidden md:block mr-1">
            <button className="relative text-black font-semibold py-2 px-6 rounded-r-xl rounded-l-lg hover:scale-105 transition-transform duration-300 bg-white google-gradient-border">
              <span className="relative z-[2] albert_sans">Log In</span>
            </button>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mx-4 absolute top-full left-0 right-0 mt-2 py-5 
                        bg-black rounded-[20px] google-gradient-border overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1
                    }
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1
                    }
                  }
                }}
              >
                {["Home", "Schedule", "Tracks", "Socials", "FAQ"].map((item, index) => (
                  <motion.div
                    key={item}
                    variants={{
                      open: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }
                      },
                      closed: {
                        opacity: 0,
                        y: -20,
                        transition: {
                          duration: 0.2
                        }
                      }
                    }}
                  >
                    <Link href="#" className="text-white hover:text-gray-300 text-xl albert_sans">
                      {item}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.button 
                  className="relative text-black font-semibold py-2 rounded-r-xl rounded-l-lg google-gradient-border bg-white px-30"
                  variants={{
                    open: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }
                    },
                    closed: {
                      opacity: 0,
                      y: -20,
                      transition: {
                        duration: 0.2
                      }
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-[2] albert_sans">Log In</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}