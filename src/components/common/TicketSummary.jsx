"use client";

import { CircleCheck, IndianRupee, Lock } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import Script from "next/script";

export default function TicketSummary({
  ticketPrice,
  ticketSlug,
}) {
  const { user, loading } = useAuth();
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discountStatus, setDiscountStatus] = useState("idle");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountErrorMessage, setDiscountErrorMessage] = useState(null);
  const [discountSuccessMessage, setDiscountSuccessMessage] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [pricingFromServer, setPricingFromServer] = useState(null);

  const formatCurrency = (amount) => `${amount.toFixed(2)}`;

  const effectiveValueType =
    pricingFromServer?.discountValueType ?? appliedDiscount?.valueType ?? null;
  const effectiveDiscountPercent =
    effectiveValueType === "PERCENTAGE"
      ? pricingFromServer?.discountPercent ??
        appliedDiscount?.discountPercent ??
        0
      : 0;
  const effectiveDiscountAmountInInr =
    effectiveValueType === "FLAT"
      ? pricingFromServer?.discountAmountInInr ??
        appliedDiscount?.discountAmountInInr ??
        0
      : pricingFromServer?.discountAmountInInr ?? 0;
  const effectiveDiscountCode =
    pricingFromServer?.discountCode ?? appliedDiscount?.code ?? null;
  const appliedDiscountCode = appliedDiscount?.code ?? null;

  const finalAmountInr = useMemo(() => {
    if (pricingFromServer) {
      return pricingFromServer.finalAmountInInr;
    }
    if (effectiveValueType === "FLAT") {
      const discounted = ticketPrice - effectiveDiscountAmountInInr;
      return Number(Math.max(discounted, 0).toFixed(2));
    }
    if (effectiveValueType === "PERCENTAGE") {
      const discounted = ticketPrice * (1 - effectiveDiscountPercent / 100);
      return Number(Math.max(discounted, 0).toFixed(2));
    }
    return Number(ticketPrice.toFixed(2));
  }, [
    pricingFromServer,
    ticketPrice,
    effectiveValueType,
    effectiveDiscountAmountInInr,
    effectiveDiscountPercent,
  ]);

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
          ticketSlug: ticketSlug,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.valid) {
        const data = response.data;
        setAppliedDiscount({
          code: trimmedCode,
          valueType: data.valueType,
          discountPercent:
            data.valueType === "PERCENTAGE" ? data.discountPercent ?? 0 : null,
          discountAmountInPaise: Number(data.discountAmountInPaise ?? 0),
          discountAmountInInr: Number(data.discountAmountInInr ?? 0),
          message: data.message ?? "Discount applied successfully!",
          type: data.type,
          expiresAt: data.expiresAt ?? null,
          remainingUses: data.remainingUses ?? null,
        });
        setDiscountStatus("success");
        setDiscountSuccessMessage("Discount applied successfully!");
        setIsApplied(true);
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
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountSuccessMessage(null);
    setDiscountCode("");
    setIsApplied(false);
    setPricingFromServer(null);
    setDiscountStatus("idle");
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const token = await user.getIdToken();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-order`,
        { code: appliedDiscountCode, ticketSlug: ticketSlug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, pricing, ticket } = response.data;

      if (pricing) {
        setPricingFromServer(pricing);
      } else {
        setPricingFromServer(null);
      }

      // Proceed to payment gateway with the order details
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "DevFest Kolkata 2025",
        description: `Devfest Kolkata 2025 + ${ticket.title}`,
        order_id: order.id,
        handler: function (response) {
          toast.success(`Payment successful! Thank you for your purchase.`);
          window.location.reload();
        },
        notes: order.notes,
        theme: {
          color: "#FF5733",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="w-full max-w-sm border-2 border-white rounded-lg p-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      {/* Title */}
      <h2 className="text-white text-2xl font-bold mb-6 product_sans">
        Ticket Summary
      </h2>

      {/* Ticket Details */}
      <div className="space-y-3 mb-4 product_sans">
        <div className="flex justify-between text-white">
          <span>Base amount</span>
          <span className="flex items-center justify-center">
            <IndianRupee className="w-3 h-3" /> {formatCurrency(ticketPrice)}
          </span>
        </div>

        <div className="flex justify-between text-white">
          <span>Discount</span>
          <span className="ml-auto">
            {effectiveValueType === "FLAT"
              ? `- ${formatCurrency(effectiveDiscountAmountInInr)}${
                  effectiveDiscountCode ? ` (${effectiveDiscountCode})` : ""
                }`
              : effectiveValueType === "PERCENTAGE" &&
                effectiveDiscountPercent > 0
              ? `- ${effectiveDiscountPercent}%${
                  effectiveDiscountCode ? ` (${effectiveDiscountCode})` : ""
                }`
              : "—"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white my-4"></div>

      {/* Total */}
      <div className="flex justify-between text-white text-lg md:text-xl font-bold mb-4 product_sans">
        <span>Amount Payable</span>
        <span className="foreground-dark text-xl md:text-2xl font-bold flex items-center justify-center">
          <IndianRupee className="w-5 h-5" /> {formatCurrency(finalAmountInr)}*
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-white my-4"></div>

      {/* Discount Code Section */}
      <div className="mb-6">
        <label className="text-white text-sm mb-2 block">
          Apply Discount / Coupon Code
        </label>
        <div
          className={`flex md:flex-row gap-2 ${isApplied ? "" : "flex-col"}`}
        >
          <input
            type="text"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value.toUpperCase());
              setDiscountErrorMessage(null);
              setDiscountSuccessMessage(null);
              setDiscountStatus("idle");
              setIsApplied(false);
            }}
            className="flex-1 px-3 py-2 bg-transparent border border-white rounded text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="DEVFEST2025"
            autoComplete="off"
          />
          {!isApplied ? (
            <button
              onClick={handleApplyDiscount}
              className="bg-[#FF5733] hover:bg-[#E64A2E] text-white px-4 py-2 rounded font-medium transition-colors cursor-pointer"
            >
              {discountStatus === "loading" ? "Applying..." : "Apply"}
            </button>
          ) : (
            <CircleCheck className="text-green-400 w-10 h-10" />
          )}
        </div>
        {discountErrorMessage && (
          <p className="text-red-400 pt-2">{discountErrorMessage}</p>
        )}
        {discountSuccessMessage && (
          <div className="flex w-full justify-around items-center pt-2">
            <p className="text-green-400">{discountSuccessMessage}</p>
            <button
              onClick={handleRemoveDiscount}
              className="text-red-400 underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Proceed Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-[#FF5733] hover:bg-[#E64A2E] text-white py-3 rounded font-bold transition-colors cursor-pointer"
      >
        <span className="flex items-center justify-center gap-3">
          {isProcessingPayment ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processing…
            </>
          ) : (
            <>
              <Lock />
              Pay Securely
            </>
          )}
        </span>
      </button>
    </div>
  );
}
