import React from "react";
import Link from "next/link";

export default function Support() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-10 bg-gray-50 text-gray-800">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">
                Devfest Kolkata 2025– Support
            </h1>

            {/* Intro Section */}
            <section className="mb-8">
                <p>
                    Welcome to the support page for{" "}
                    <strong>Devfest Kolkata 2025</strong>. We're here to help you with
                    any questions or issues you might have.
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
                    If you need help or have feedback, please reach out to us:
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

            {/* Footer */}
            <section>
                <p>
                    Thank you for visiting <strong>Devfest Kolkata 2025</strong>!
                </p>
            </section>
        </main>
    );
}
