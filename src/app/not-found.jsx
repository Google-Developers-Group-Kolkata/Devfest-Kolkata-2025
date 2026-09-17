"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function NotFound() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 200);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden px-6 sm:px-8">
            <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[600px]">
                {/* GDG Kolkata logo */}
                <div
                    className="w-[100px] sm:w-[130px] md:w-[160px] mb-6 sm:mb-8"
                    style={{
                        opacity: show ? 1 : 0,
                        transform: show ? "none" : "translateY(20px)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <Image
                        src="/gdg-kolkata-logo-white.svg"
                        alt="GDG Kolkata"
                        width={160}
                        height={50}
                        className="w-full h-auto"
                        priority
                    />
                </div>

                {/* Title */}
                <div
                    className="cs-title-pop product_sans"
                    style={{ opacity: show ? undefined : 0 }}
                >
                    <div
                        className="cs-float text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px]"
                        style={{ fontWeight: 700, lineHeight: 1.1, color: "#ffffff" }}
                    >
                        Page Not Found 🤷‍♂️
                    </div>
                </div>

                {/* Subtitle */}
                <div
                    className="cs-subtitle-in product_sans mt-4 sm:mt-5 max-w-[90vw] text-[13px] sm:text-[15px] md:text-[17px] lg:text-[20px]"
                    style={{
                        color: "rgba(255,255,255,0.8)",
                        lineHeight: 1.6,
                        opacity: show ? undefined : 0,
                    }}
                >
                    Looks like this page does not exist yet.
                    <br />
                    Our team is working on it!
                    <br />
                    Check out the homepage in the meantime.
                </div>

                {/* Google gradient divider line */}
                <div
                    className="cs-btn-pop mt-6 sm:mt-8 h-[3px] w-[50px] sm:w-[70px] md:w-[80px] rounded-full"
                    style={{
                        background:
                            "linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%)",
                        opacity: show ? undefined : 0,
                    }}
                />

                {/* Home button */}
                <a
                    href="/"
                    className="cs-btn-pop product_sans mt-6 sm:mt-8 inline-block cursor-pointer rounded-full border-[3px] border-white bg-transparent px-6 sm:px-8 py-2 sm:py-2.5 text-[13px] sm:text-[15px] md:text-[16px] text-white transition-transform hover:scale-105"
                    style={{ opacity: show ? undefined : 0 }}
                >
                    Take me Home
                </a>
            </div>
        </div>
    );
}
