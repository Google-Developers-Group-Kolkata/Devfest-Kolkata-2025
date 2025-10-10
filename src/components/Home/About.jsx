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
                    Devfest is a global tech event by Google Developer Groups that celebrates open source, bringing developers together for a day of learning, collaboration, and community — with talks, hands-on sessions, and networking around technologies like Flutter, Firebase, AI, Android, Google Cloud and anything Open Source. Devfest is a global tech event by Google Developer Groups flutter, Firebase, AI, Android, Google Cloud and anything Open Source.
                </p>
            </div>
        </div>
    );
}
