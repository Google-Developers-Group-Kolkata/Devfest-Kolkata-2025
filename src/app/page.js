"use client";

import React from "react";
import HeroBanner from "@/components/Home/HeroBanner";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketCard from "../components/Home/Tickets";
import About from "@/components/Home/About";
import Venue from "@/components/Home/Venue";

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

                <section className="pb-8 md:pb-8">
                    <TicketCard />
                </section>

                {/* About Section */}
                <section className="py-16 px-8 open_sans">
                    <Venue />
                </section>

                <section className="py-16 px-4 open_sans">
                    <About />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DevFest2025;
