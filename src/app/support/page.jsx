"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Support() {
    const [deleting, setDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleDeleteAccount = async () => {
        if (!emailInput || !emailInput.trim()) {
            setEmailError("Please enter your email.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        try {
            setDeleting(true);

            const res = await fetch("/api/delete-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailInput.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to delete account.");
                throw new Error(data.error || "Failed to delete account.");
            }

            toast.success("Account deleted successfully.");
            setShowModal(false);
            setEmailInput("");
            setEmailError("");
        } catch (error) {
            setEmailError(error.message || "An error occurred. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <main className="max-w-3xl mx-auto px-6 py-10 bg-gray-50 text-gray-800">
                <h1 className="text-4xl font-bold text-blue-600 mb-6">
                    Devfest Kolkata 2025– Support
                </h1>

                {/* Intro Section */}
                <section className="mb-8">
                    <p>
                        Welcome to the support page for{" "}
                        <strong>Devfest Kolkata 2025</strong>. We're here to
                        help you with any questions or issues you might have.
                    </p>
                </section>

                {/* Common Topics */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        📋 Common Topics
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Troubleshooting login or account issues</li>
                        <li>Feature how-to guides</li>
                        <li>Reporting bugs or crashes</li>
                        <li>Privacy concerns</li>
                        <li>App feedback and suggestions</li>
                    </ul>
                </section>

                {/* Contact Support */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        📬 Contact Support
                    </h2>
                    <p>
                        If you need help or have feedback, please reach out to
                        us:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>
                            Email:{" "}
                            <Link
                                href="mailto:contact.gdgkolkata@gmail.com"
                                className="text-blue-600 hover:underline"
                            >
                                contact.gdgkolkata@gmail.com
                            </Link>
                        </li>
                        <li>
                            Twitter:{" "}
                            <Link
                                href="https://x.com/gdgkolkata"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                @gdgkolkata
                            </Link>
                        </li>
                    </ul>
                </section>

                {/* Legal Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        🔐 Terms & Policy
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            <Link
                                href="https://www.devfestkolkata.in/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="https://www.devfestkolkata.in/terms-of-use"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Terms of Use
                            </Link>
                        </li>
                    </ul>
                </section>

                {/* Account Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        👤 Account
                    </h2>
                    <p className="text-sm text-gray-700 mb-3">
                        Manage your account settings. If you want to permanently
                        remove your account and associated data, use the button
                        below.
                    </p>

                    <div>
                        <button
                            onClick={() => { setEmailError(""); setShowModal(true); }}
                            disabled={deleting}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
                            aria-label="Delete account"
                            title="Delete my account"
                        >
                            {deleting ? "Deleting..." : "Delete my account"}
                        </button>
                    </div>

                    {showModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center"
                            onKeyDown={(e) => {
                                if (e.key === "Escape") setShowModal(false);
                            }}
                        >
                            <div
                                className="fixed inset-0 bg-black/40"
                                onClick={() => setShowModal(false)}
                            />
                            <div className="relative z-60 w-full max-w-md mx-4">
                                <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Confirm account deletion
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Enter your email to confirm permanent
                                        deletion of your account.
                                    </p>
                                    <label className="block text-xs text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => {
                                            setEmailInput(e.target.value);
                                            setEmailError("");
                                        }}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        placeholder="you@example.com"
                                        autoFocus
                                    />
                                    {emailError && (
                                        <p className="text-xs text-red-600 mt-2">
                                            {emailError}
                                        </p>
                                    )}

                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEmailInput("");
                                                setEmailError("");
                                            }}
                                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteAccount}
                                            disabled={deleting}
                                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                                        >
                                            {deleting
                                                ? "Deleting..."
                                                : "Confirm & Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <section>
                    <p>
                        Thank you for visiting{" "}
                        <strong>Devfest Kolkata 2025</strong>!
                    </p>
                </section>
            </main>
        </div>
    );
}
