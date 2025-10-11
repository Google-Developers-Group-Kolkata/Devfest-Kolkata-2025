import React from "react";

export default function TermsOfUse() {
    const appName = "Devfest Kolkata 2025";
    return (
        <main className="max-w-4xl mx-auto px-6 py-10 bg-gray-50 text-gray-800">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
                Terms of Use
            </h1>
            <p className="text-gray-600 text-sm mb-8">
                Effective date: <strong>13/09/2025</strong>
            </p>

            {/* Section 1 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    1. Acceptance of Terms
                </h2>
                <p>
                    By accessing or using <strong>{appName}</strong> (“we”,
                    “us”, or “our”) services, websites, or applications
                    (collectively, the “Service”), you agree to be bound by
                    these Terms of Use. If you do not agree to these terms,
                    please do not use our Service.
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    2. Modifications
                </h2>
                <p>
                    We may revise these Terms at any time. The updated version
                    will be posted on this page with a new effective date.
                    Continued use of the Service after such changes constitutes
                    acceptance of the updated Terms.
                </p>
            </section>

            {/* Section 3 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    3. Eligibility
                </h2>
                <p>
                    You must be at least 13 years old to use the Service. If you
                    are under 18, you may only use the Service under the
                    supervision of a parent or guardian who agrees to these
                    Terms.
                </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    4. Use of the Service
                </h2>
                <p>When using our Service, you agree that you will not:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Violate any applicable laws or regulations.</li>
                    <li>
                        Infringe on any intellectual property or privacy rights
                        of others.
                    </li>
                    <li>
                        Use the Service for fraudulent or harmful activities.
                    </li>
                    <li>
                        Attempt to gain unauthorized access to our systems or
                        data.
                    </li>
                    <li>
                        Interfere with the proper operation or security of the
                        Service.
                    </li>
                </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    5. Accounts & Security
                </h2>
                <p>
                    If the Service requires you to create an account, you are
                    responsible for maintaining the confidentiality of your
                    credentials. You must notify us immediately of any
                    unauthorized access or security breach.
                </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    6. Intellectual Property
                </h2>
                <p>
                    All content, trademarks, logos, and software within the
                    Service are owned or licensed by{" "}
                    <strong>{appName}</strong> and protected under
                    applicable intellectual property laws. You may not copy,
                    distribute, modify, or create derivative works without
                    written permission.
                </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    7. Third-Party Links & Services
                </h2>
                <p>
                    Our Service may include links to third-party websites or
                    tools. We are not responsible for the content, policies, or
                    practices of these external sites. Accessing third-party
                    services is at your own risk.
                </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    8. Termination
                </h2>
                <p>
                    We reserve the right to suspend or terminate your access to
                    the Service at any time, with or without notice, for any
                    reason, including violation of these Terms.
                </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    9. Disclaimer of Warranties
                </h2>
                <p>
                    The Service is provided “as is” and “as available.” We make
                    no warranties or representations of any kind, express or
                    implied, regarding the Service, including but not limited to
                    accuracy, reliability, or availability.
                </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    10. Limitation of Liability
                </h2>
                <p>
                    To the fullest extent permitted by law,{" "}
                    <strong>{appName}</strong> shall not be liable for any
                    indirect, incidental, consequential, or punitive damages
                    arising from your use or inability to use the Service.
                </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    11. Indemnification
                </h2>
                <p>
                    You agree to indemnify and hold harmless{" "}
                    <strong>{appName}</strong>, its affiliates, and their
                    representatives from any claims, damages, or expenses
                    arising from your use of the Service or violation of these
                    Terms.
                </p>
            </section>

            {/* Section 12 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    12. Governing Law
                </h2>
                <p>
                    These Terms are governed by and construed in accordance with
                    the laws of India, without regard to its conflict of law
                    principles. Any disputes shall be subject to the exclusive
                    jurisdiction of the courts in Kolkata, West Bengal, India.
                </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">
                    13. Contact Us
                </h2>
                <p>
                    If you have any questions or concerns regarding these Terms,
                    please contact us:
                </p>
                <p className="mt-2">
                    <strong>Google Developer Groups Kolkata</strong>
                    <br />
                    Email:{" "}
                    <a
                        href="mailto:contact.gdgkolkata@gmail.com"
                        className="text-green-600 hover:underline"
                    >
                        contact.gdgkolkata@gmail.com
                    </a>
                    <br />
                    Address: Kolkata, West Bengal, India 700051
                </p>
            </section>

            {/* Footer */}
            <footer className="text-sm text-gray-600 mt-8">
                <p>
                    Last updated: <strong>13/09/2025</strong>
                </p>
                <p>© 2025 Google Developer Groups Kolkata. All rights reserved.</p>
            </footer>
        </main>
    );
}
