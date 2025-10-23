"use client";

import React, { useState } from "react";

export default function TicketSummary() {
    const [discountCode, setDiscountCode] = useState("");
    const [isApplied, setIsApplied] = useState(false);

    const ticketPrice = 799;
    const quantity = 1;
    const subtotal = ticketPrice * quantity;
    const total = subtotal;

    const handleApplyDiscount = () => {
        // Add your discount logic here
        setIsApplied(true);
    };

    const handleProceed = () => {
        // Add your payment/proceed logic here
        console.log("Proceeding to payment...");
    };

    return (
        <div className="w-full max-w-sm border-2 border-white rounded-lg p-6">
            {/* Title */}
            <h2 className="text-white text-2xl font-bold mb-6">
                Ticket Summary
            </h2>

            {/* Ticket Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-white">
                    <span>Regular</span>
                    <span className="mx-4">x{quantity}</span>
                    <span>₹ {ticketPrice}</span>
                </div>

                <div className="flex justify-between text-white">
                    <span>Sub Total</span>
                    <span className="ml-auto">₹ {subtotal}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white my-4"></div>

            {/* Total */}
            <div className="flex justify-between text-white text-xl font-bold mb-4">
                <span>Total</span>
                <span>₹ {total}*</span>
            </div>

            {/* Divider */}
            <div className="border-t border-white my-4"></div>

            {/* Discount Code Section */}
            <div className="mb-6">
                <label className="text-white text-sm mb-2 block">
                    Apply Discount / Access Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-transparent border border-white rounded text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Enter code"
                    />
                    <button
                        onClick={handleApplyDiscount}
                        className="bg-[#FF5733] hover:bg-[#E64A2E] text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Proceed Button */}
            <button
                onClick={handleProceed}
                className="w-full bg-[#FF5733] hover:bg-[#E64A2E] text-white py-3 rounded font-bold transition-colors"
            >
                Proceed Now
            </button>
        </div>
    );
}
