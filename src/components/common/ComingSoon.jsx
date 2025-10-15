import React from "react";

export default function ComingSoon({ description = "" }) {
    return (
        <div className="bg-[#2C2C2C] rounded-[32px] px-12 py-10 max-w-md shadow-2xl">
            {/* Clock Icon */}
            <div className="flex justify-center mb-6">
                <div className="bg-[#404040] rounded-[20px] p-5 inline-block">
                    <svg
                        width="56"
                        height="56"
                        viewBox="0 0 56 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M28 14V28L38 38"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Coming Soon Text */}
            <h3 className="text-white text-4xl font-bold text-center mb-4">
                Coming soon
            </h3>

            {/* Description */}
            {/* <p className="text-[#AAAAAA] text-center text-base leading-relaxed">
                We&apos;re crafting an amazing agenda for you.
                <br />
                Stay tuned for updates!
            </p> */}
            <p className="text-[#AAAAAA] text-center text-base leading-relaxed">
                {!description ? `We're crafting an amazing agenda for you.`: description}
                <br />
                {`Stay tuned for updates!`}
            </p>
        </div>
    );
}
