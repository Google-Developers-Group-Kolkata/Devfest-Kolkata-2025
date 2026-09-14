"use client";

import { useEffect, useState } from "react";

const TramHero = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // If the user prefers reduced motion the tram sits at its final
        // position, so show the overlay right away.
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            const t = setTimeout(() => setShow(true), 600);
            return () => clearTimeout(t);
        }

        // Fire the logo/button entrance when the tram's body reaches the
        // middle of the right side (~halfway through the 5s run).
        const t = setTimeout(() => setShow(true), 2500);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="relative h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden select-none"
            style={{ backgroundColor: "#ffffff" }}
        >
            {/* Tram sliding left -> right, stops with its last portion on the right */}
            <div
                className="tram-slide absolute left-0 will-change-transform pointer-events-none"
                style={{ width: "50vw", bottom: "-0.85vw" }}
            >
                <img
                    src="/hero-tram/tram.webp"
                    alt=""
                    draggable={false}
                    className="block w-full h-auto"
                />
            </div>

            {/* GDG Kolkata logo — fades in from small to normal once the tram arrives */}
            <div
                className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-1000 ease-out motion-reduce:transition-none ${
                    show ? "opacity-100 scale-100" : "opacity-0 scale-[0.55]"
                }`}
                style={{ top: "30%", width: "min(86vw, 86vh)" }}
            >
                <img
                    src="/gdg-kolkata-logo.png"
                    alt="GDG Kolkata"
                    draggable={false}
                    className="block w-full h-auto"
                />
            </div>

            {/* Start the experience button — fades in right after the logo */}
            <button
                type="button"
                className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-[clamp(6px,0.8vw,12px)] cursor-pointer bg-transparent border-0 p-0 transition-all duration-700 ease-out motion-reduce:transition-none group ${
                    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ top: "53%", transitionDelay: show ? "180ms" : "0ms" }}
                onClick={() => {}}
            >
                <span
                    className="product_sans font-medium text-black whitespace-nowrap leading-none tracking-normal"
                    style={{ fontSize: "clamp(16px, 1.9vw, 26px)" }}
                >
                    Start the experience
                </span>
                <svg
                    viewBox="0 0 49 25"
                    className="text-black transition-transform duration-200 group-hover:translate-x-1.5"
                    style={{ width: "clamp(20px, 2.4vw, 34px)", height: "auto" }}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 12.5C0 12.1317 0.184363 11.7785 0.51253 11.518C0.840698 11.2576 1.28579 11.1113 1.74989 11.1113H43.0228L32.009 2.37364C31.6804 2.11288 31.4958 1.75922 31.4958 1.39045C31.4958 1.02168 31.6804 0.668012 32.009 0.407253C32.3375 0.146493 32.7832 8.68851e-09 33.2479 0C33.7126 -8.68851e-09 34.1582 0.146493 34.4868 0.407253L48.4859 11.5168C48.6489 11.6458 48.7782 11.799 48.8664 11.9678C48.9546 12.1365 49 12.3173 49 12.5C49 12.6827 48.9546 12.8635 48.8664 13.0322C48.7782 13.201 48.6489 13.3542 48.4859 13.4832L34.4868 24.5927C34.1582 24.8535 33.7126 25 33.2479 25C32.7832 25 32.3375 24.8535 32.009 24.5927C31.6804 24.332 31.4958 23.9783 31.4958 23.6096C31.4958 23.2408 31.6804 22.8871 32.009 22.6264L43.0228 13.8887H1.74989C1.28579 13.8887 0.840698 13.7424 0.51253 13.482C0.184363 13.2215 0 12.8683 0 12.5Z"
                        fill="black"
                    />
                </svg>
            </button>
        </div>
    );
};

export default TramHero;