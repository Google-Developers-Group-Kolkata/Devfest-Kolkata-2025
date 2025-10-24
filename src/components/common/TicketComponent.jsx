import React from "react";
import { Star } from "lucide-react";

export default function TicketComponent({ title, description, features, price, color }) {

    const bgColors = {
        blue: "bg-blue-600 hover:bg-blue-700",
        green: "bg-green-600 hover:bg-green-700",
        red: "bg-red-600 hover:bg-red-700",
        yellow: "bg-yellow-600 hover:bg-yellow-700",
    }

    const textColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        red: "text-red-600",
        yellow: "text-yellow-600",
    }

    return (
        <div className="relative w-full max-w-lg">
            {/* Ticket Card */}
            <div className="bg-[#FFF8DC] rounded-lg p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <Star className={`w-8 h-8 ${textColors[color]}`} />
                    <h2 className="text-lg font-bold text-gray-900 product_sans">
                        {title}
                    </h2>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">
                    {description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                    {features.map((feature, index) => (
                        <div className="flex items-start gap-2" key={index}>
                            <span className="text-gray-700">•</span>
                            <p className="text-sm text-gray-700">
                                {feature}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹ {price}
                    </div>
                    <button className={`${bgColors[color]} text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer`}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
