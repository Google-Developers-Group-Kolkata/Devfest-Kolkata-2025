"use client";

export default function About() {
    return (
        <div className="container mx-auto flex flex-col relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#fff2d1] mb-10 text-center z-30">
                About Us
            </h2>
            <div className="absolute left-1/2 top-[-100px] md:top-[-80px] w-[180px] h-[180px] rounded-full bg-radial-red-dark transform -translate-x-1/2 rotate-[-69.587deg]"></div>
            <div className="max-w-3xl mx-auto text-white text-lg md:text-xl mt-16 text-center">
                <p>
                    DevFest Kolkata 2025 is the city’s biggest celebration of
                    technology, innovation, and community — proudly hosted by
                    Google Developer Group Kolkata. 
                    <br />
                    <br />
                    Part of a global movement
                    powered by developers and tech enthusiasts, DevFest brings
                    together professionals, students, and creators to explore
                    the latest in AI, Android, Cloud, Flutter, Firebase, and the
                    Open Source ecosystem. 
                    <br />
                    <br />
                    Expect a full day of inspiring talks,
                    hands-on workshops, live demos, and meaningful networking —
                    all designed to spark ideas, share knowledge, and empower
                    the next generation of innovators. 
                    <br />
                    <br />
                    Join us as we build,
                    learn, and grow together — because the future of tech starts
                    with community.
                </p>
            </div>
        </div>
    );
}
