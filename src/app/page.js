"use client";

import React from "react";
import HeroBanner from "@/components/Home/HeroBanner";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketCard from "../components/Home/Tickets";

const DevFest2025 = () => {
    return (
        <div className="min-h-screen bg-[#1e1e1e] overflow-x-hidden">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Banner Section */}
                <section className="pb-8 md:pb-8">
                    <HeroBanner />
                </section>

                {/* About Section */}
                <TicketCard />
                <section className="py-16 px-4 albert_sans">
                    <div className="container mx-auto">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#fff2d1] mb-6 text-center">
                            About DevFest
                            <div className="w-24 h-1 bg-green-300 mx-auto mt-2 rounded-full animate-pulse"></div>
                        </h2>
                        <div className="max-w-3xl mx-auto text-white text-lg md:text-xl mt-8 text-center">
                            <p className="mb-4">
                                DevFest is Google Developer Group{`'`}s biggest
                                event of the year. A tech conference for
                                developers, organized by the community, focusing
                                on Google technologies and beyond.
                            </p>
                            <p>
                                Join us at DevFest Kolkata 2025 for a day packed
                                with inspiring talks, hands-on workshops,
                                networking opportunities, and cutting-edge
                                technologies. Whether you{`'`}re a beginner or
                                an expert, DevFest has something for everyone.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DevFest2025;
