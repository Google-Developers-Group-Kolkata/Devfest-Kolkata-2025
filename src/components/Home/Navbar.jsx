"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar({ scrollToView, refs }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // States for scroll animation
  const [showNav, setShowNav] = useState(true);
  const [lastYPos, setLastYPos] = useState(0);

  const profileRef = useRef(null);
  const drawerRef = useRef(null);
  
  // Effect to handle scroll detection
  useEffect(() => {
    function handleScroll() {
      const currentYPos = window.scrollY;
      const isScrollingUp = currentYPos < lastYPos;

      // Show navbar if scrolling up or at the very top of the page
      setShowNav(isScrollingUp || currentYPos < 10); 
      setLastYPos(currentYPos);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastYPos]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isProfileDrawerOpen &&
        profileRef.current &&
        drawerRef.current &&
        !profileRef.current.contains(event.target) &&
        !drawerRef.current.contains(event.target)
      ) {
        setIsProfileDrawerOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsProfileDrawerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileDrawerOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutUser();
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
      setIsSigningOut(false);
    }
  };
  
  // Framer Motion variants for the navbar animation
  const navbarVariants = {
    hidden: {
      y: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.nav 
      variants={navbarVariants}
      animate={showNav ? "visible" : "hidden"}
      className="sticky top-0 w-full py-4 z-50" // <-- Changed to sticky
    >
      <div className="container mx-auto px-4 md:max-w-4xl">
        <div className="relative flex items-center justify-between bg-black rounded-[61px] py-1 md:py-3 px-5 google-gradient-border">
          {/* Logo and brand */}
          <div className="flex items-center md:w-auto w-full md:justify-start justify-between">
            <div className="flex items-center">
              <img
                src="/favicon.svg"
                alt="DevFest Logo"
                className="h-12 w-auto mr-2"
              />
              {/* <span className="font-semibold text-3xl text-white albert_sans">GDG Kolkata</span> */}
            </div>

            <div className="flex items-center md:hidden">
            {!user && (<button onClick={handleGoogleSignIn} disabled={isSigningIn} className="relative text-black font-semibold py-1 px-4 rounded-[42px] bg-[#FFF3D2] cursor-pointer albert_sans">
              Log In
              </button>)}
            {/* Mobile menu button with animation */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                className="text-white focus:outline-none p-2 pr-0"
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
          </div>

          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <span onClick={() => scrollToView(refs.homeRef)} className="text-white hover:text-gray-300 text-xl font-medium albert_sans cursor-pointer">Home</span>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Schedule</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Tracks</Link>
            <Link href="#" className="text-white hover:text-gray-300 text-xl font-medium albert_sans">Socials</Link>
            <span onClick={() => scrollToView(refs.faqRef)} className="text-white hover:text-gray-300 text-xl font-medium albert_sans cursor-pointer">FAQ</span>
          </div>

          {/* Login button - Desktop */}
          <div className="hidden md:block mr-1">
            {!user && (<button onClick={handleGoogleSignIn} disabled={isSigningIn} className="relative text-black font-semibold py-2 px-6 rounded-[42px] hover:scale-105 transition-transform duration-300 bg-[#FFF3D2] cursor-pointer">
              <span className="relative z-[2] albert_sans">Log In</span>
            </button>)}
            {user && (
              <div className="relative flex flex-col items-center gap-3">
                <button
                  ref={profileRef}
                  onClick={() => setIsProfileDrawerOpen(!isProfileDrawerOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-white/20 transition-all duration-200 cursor-pointer"
                >
                  <img
                    key={user.photoURL || user.uid}
                    className="w-full h-full object-cover"
                    src={user ? user.photoURL : "/default-avatar.png"}
                    alt={user.displayName || "User Profile"}
                    loading="lazy"
                    onError={(e) => {
                      // fallback to a local default image when remote fails
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isProfileDrawerOpen && (
                    <motion.div
                      ref={drawerRef}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-15 w-72 bg-[#1E1E1E] rounded-2xl shadow-lg google-gradient-border overflow-hidden z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <img 
                            key={user.photoURL || user.uid + "-drawer"}
                            src={user.photoURL || "/default-avatar.png"} 
                            alt={user.displayName || "Profile"} 
                            className="w-12 h-12 rounded-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate albert_sans">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-white text-sm truncate albert_sans">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleGoogleSignOut}
                          disabled={isSigningOut}
                          className="w-full text-black font-semibold py-2 px-4 rounded-xl bg-[#FFF3D2] hover:bg-[#FFE4A3] transition-colors duration-200 albert_sans disabled:opacity-50 cursor-pointer"
                        >
                          {isSigningOut ? 'Signing out...' : 'Log Out'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
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
                
                {user && (<motion.button 
                  className="relative text-black font-semibold py-2 rounded-r-xl rounded-l-lg google-gradient-border bg-white px-30"
                  onClick={handleGoogleSignOut}
                  disabled={isSigningOut}
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
                  <span className="relative z-[2] albert_sans">Log Out</span>
                </motion.button>)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};