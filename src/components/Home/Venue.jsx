"use client";

import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";

const PLACE_NAME = "Vedic Village";
const ADDRESS = "Shikharpur P.O, Bagu, Sikharpur, Kolkata, West Bengal 700135";

export default function Venue() {
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${PLACE_NAME} ${ADDRESS}`
    )}`;

    return (
        <>
            <div className="text-center mb-14">
                <h2 className="text-5xl md:text-6xl font-bold text-[#FFF3D2] mb-3">
                    Venue
                </h2>
                <p className="text-[#888] text-lg">
                    Your spot for the ultimate tech vibe.
                </p>
            </div>
            <div
                className="rounded-3xl bg-[#353535] text-card-foreground shadow-xl ring-1 ring-border md:grid md:grid-cols-2 md:w-[80%] w-full md:mx-auto mb-20"
                style={{
                    // subtle elevated look similar to the screenshot
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.06), 0 40px 60px rgba(0,0,0,0.05)",
                }}
            >
                {/* Left: Copy */}
                <div className="flex flex-col justify-center items-center md:items-start gap-6 px-8 py-12 lg:px-12 lg:py-16">
                    {/* <div className="space-y-3 flex flex-col items-center"> */}
                        <h1 className="text-[#FFF3D2] text-4xl font-semibold tracking-tight lg:text-6xl">
                            {PLACE_NAME}
                        </h1>
                        <p className="text-[#FFF3D2] text-center sm:text-left">{ADDRESS}</p>
                    {/* </div> */}

                    <div className="">
                        <button className="rounded-full py-2 px-8 bg-[#1E1E1E] google-gradient-border cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                            <span className="flex items-center gap-2 text-[#FFF3D2]">
                                <MapPinIcon className="h-5 w-5" />
                                <span className="w-full">Get Directions</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right: Image with angled edges */}
                <div className="relative flex justify-center items-center">
                    {/* wrapper keeps rounded corners while the image uses a polygon clip */}
                    <div className="p-10">
                        <img
                            src="/venue_img.png"
                            alt="Entrance of Vedic Village with thatched roof gate surrounded by greenery"
                            className="rounded-[2.3rem]"
                            style={{
                                clipPath:
                                    "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
