"use client";

import { IndianRupee } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function TicketSummary() {
    const { user, loading } = useAuth();
    const [discountCode, setDiscountCode] = useState("");
    const [isApplied, setIsApplied] = useState(false);
    const [discountStatus, setDiscountStatus] = useState("idle");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountErrorMessage, setDiscountErrorMessage] = useState(null);
    const [discountSuccessMessage, setDiscountSuccessMessage] = useState(null);

    const ticketPrice = 799;
    const quantity = 1;
    const subtotal = ticketPrice * quantity;
    const total = subtotal;

    const handleApplyDiscount = async () => {
        const trimmedCode = discountCode.trim();
        if (!trimmedCode) {
            setDiscountStatus("error");
            setDiscountErrorMessage("Please enter a discount code.");
            return;
        }

        setDiscountStatus("loading");
        setDiscountErrorMessage(null);

        try {
            const token = await user.getIdToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/discounts/verify`,
                {
                    code: trimmedCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 && response.data.valid) {
                const data = response.data;
                setAppliedDiscount({
                    code: trimmedCode,
                    valueType: data.valueType,
                    disCountPercent:
                        data.valueType === "PERCENTAGE"
                            ? data.discountPercent ?? 0
                            : null,
                    discountAmountInPaise: Number(
                        data.discountAmountInPaise ?? 0
                    ),
                    discountAmountInInr: Number(data.discountAmountInInr ?? 0),
                    message: data.message ?? "Discount applied successfully!",
                    type: data.type,
                    expiresAt: data.expiresAt ?? null,
                    remainingUses: data.remainingUses ?? null,
                });
                setDiscountStatus("success");
                setDiscountSuccessMessage("Discount applied successfully!");
            }
        } catch (error) {
            // console.error("Error applying discount:", error);
            console.log("Error applying discount:", error);
            if (error.response && error.response?.status === 400) {
                setDiscountStatus("error");
                setDiscountErrorMessage("Invalid or expired discount code.");
                return;
            }
            setDiscountStatus("error");
            setDiscountErrorMessage(
                "Unable to verify discount. Please try again later."
            );
            return;
        }

        setIsApplied(true);
    };

    const handleProceed = () => {
        // Add your payment/proceed logic here
        console.log("Proceeding to payment...");
    };

    return (
        <div className="w-full max-w-sm border-2 border-white rounded-lg p-6">
            {/* Title */}
            <h2 className="text-white text-2xl font-bold mb-6 product_sans">
                Ticket Summary
            </h2>

            {/* Ticket Details */}
            <div className="space-y-3 mb-4 product_sans">
                <div className="flex justify-between text-white">
                    <span>Base amount</span>
                    <span className="flex items-center justify-center">
                        <IndianRupee className="w-4 h-4" /> {ticketPrice}
                    </span>
                </div>

                <div className="flex justify-between text-white">
                    <span>Discount</span>
                    <span className="ml-auto">---</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white my-4"></div>

            {/* Total */}
            <div className="flex justify-between text-white text-lg md:text-xl font-bold mb-4 product_sans">
                <span>Amount Payable</span>
                <span className="foreground-dark text-xl md:text-2xl font-bold flex items-center justify-center">
                    <IndianRupee className="w-7 h-7" /> {total}*
                </span>
            </div>

            {/* Divider */}
            <div className="border-t border-white my-4"></div>

            {/* Discount Code Section */}
            <div className="mb-6">
                <label className="text-white text-sm mb-2 block">
                    Apply Discount / Coupon Code
                </label>
                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                            setDiscountCode(e.target.value.toUpperCase());
                            setDiscountErrorMessage(null);
                        }}
                        className="flex-1 px-3 py-2 bg-transparent border border-white rounded text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="DEVFEST2025"
                        autoComplete="off"
                    />
                    <button
                        onClick={handleApplyDiscount}
                        className="bg-[#FF5733] hover:bg-[#E64A2E] text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        Apply
                    </button>
                </div>
                {discountErrorMessage && (
                    <p className="text-red-400 pt-2">{discountErrorMessage}</p>
                )}
                {discountSuccessMessage && (
                    <div className="flex w-full justify-around items-center pt-2">
                        <p className="text-green-400">
                            {discountSuccessMessage}
                        </p>
                        <button className="text-red-400 underline cursor-pointer">
                            Remove
                        </button>
                    </div>
                )}
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
