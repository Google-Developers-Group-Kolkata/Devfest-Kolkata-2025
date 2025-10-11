import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-10 text-[#111] bg-white">
            <h1 className="text-4xl font-bold text-green-600 mb-2">
                Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm mb-6">
                Effective date: <strong>13/09/2025</strong>
            </p>

            {/* Section 1 */}
            <section className="py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mt-4">
                    1. Introduction
                </h2>
                <p className="mt-2">
                    Welcome to the DevFest / GDG Kolkata website (the “Site”).
                    This Privacy Policy explains how{" "}
                    <strong>Google Developer Groups Kolkata</strong> (“we”, “us”
                    or “our”) collects, uses, shares, and protects personal
                    information received through the Site and related services
                    (including event registration and communications).
                </p>
                <p className="text-sm text-gray-600 mt-3">
                    Please read it carefully. By using the Site or registering
                    for our events you accept the practices described in this
                    policy.
                </p>
            </section>

            {/* Section 2 */}
            <section className="py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mt-4">
                    2. Information We Collect
                </h2>

                <h3 className="text-xl text-green-600 mt-3">
                    2.1 Information you provide
                </h3>
                <p className="mt-2">
                    We collect information you give us directly, for example
                    when you:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        Register for an event or create an account (name, email
                        address, phone number, organization, job title, payment
                        details when applicable).
                    </li>
                    <li>
                        Contact us via email or contact forms (message content
                        and contact details).
                    </li>
                    <li>
                        Upload materials or submit content (photos, bios, talk
                        proposals).
                    </li>
                </ul>

                <h3 className="text-xl text-green-600 mt-4">
                    2.2 Information we collect automatically
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Usage data (pages visited, time on page, clicks).</li>
                    <li>
                        Device & technical data (IP address, browser type, OS,
                        referrer, device identifiers).
                    </li>
                    <li>
                        Cookies and similar technologies — see{" "}
                        <Link href="#cookies" className="text-green-600 underline">
                            Cookies & tracking
                        </Link>{" "}
                        below.
                    </li>
                </ul>

                <h3 className="text-xl text-green-600 mt-4">
                    2.3 Information from third parties
                </h3>
                <p className="mt-2">
                    We may receive information from third-party services you
                    connect to (e.g., social login providers) or from partners
                    (sponsors, ticketing platforms). We use such information
                    only as permitted by you and applicable law.
                </p>
            </section>

            {/* Section 3 */}
            <section className="py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mt-4">
                    3. How We Use Your Information
                </h2>
                <p className="mt-2">We use personal information to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        Provide and manage event registration, tickets, and
                        attendee services.
                    </li>
                    <li>
                        Communicate event updates, schedules, and marketing
                        (only if you opt in or where permitted by law).
                    </li>
                    <li>Process payments and prevent fraud.</li>
                    <li>Improve the Site and personalize user experience.</li>
                    <li>
                        Comply with legal obligations and enforce our
                        agreements.
                    </li>
                </ul>
            </section>

            {/* Section 4 */}
            <section className="py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mt-4">
                    4. Legal Bases for Processing (EEA/GDPR)
                </h2>
                <p className="mt-2">
                    If you are in the EEA, we rely on one or more of the
                    following legal bases to process your personal data:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        Performance of a contract (e.g., to fulfill event
                        registration).
                    </li>
                    <li>Legal compliance obligations.</li>
                    <li>
                        Legitimate interests (e.g., site security, fraud
                        prevention, analytics) provided those interests are not
                        overridden by your rights.
                    </li>
                    <li>
                        Your consent (where required) — for example for
                        marketing communications or optional cookies.
                    </li>
                </ul>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mt-4">
                    5. Cookies & Tracking
                </h2>
                <p className="mt-2">
                    We use cookies and similar technologies to operate and
                    improve our Site, analyze usage, and support features such
                    as login and registration. Cookies may be:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        <strong>Strictly necessary:</strong> required for the
                        Site to function (session, auth).
                    </li>
                    <li>
                        <strong>Performance & analytics:</strong> used to
                        analyze how the Site is used (e.g., Google Analytics).
                    </li>
                    <li>
                        <strong>Functional & preferences:</strong> remember user
                        settings and preferences.
                    </li>
                    <li>
                        <strong>Advertising:</strong> third-party cookies that
                        may be used for targeted advertising if applicable.
                    </li>
                </ul>
                <p className="mt-2">
                    You can control cookie preferences in your browser and,
                    where provided, via any cookie consent manager on the Site.
                    Disabling some cookies may affect Site functionality.
                </p>
            </section>

            {/* Remaining Sections (6–15) */}
            {[
                {
                    title: "6. Sharing & Disclosure",
                    content: (
                        <>
                            <p>We may share personal information with:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>
                                    Service providers and vendors who help run
                                    the Site or event (payment processors,
                                    ticketing platforms, email, analytics, CRM).
                                </li>
                                <li>
                                    Sponsors or partners only where required for
                                    event logistics (with your consent where
                                    applicable).
                                </li>
                                <li>
                                    Legal & safety reasons: when required by
                                    law, to respond to legal requests, to
                                    protect rights, safety, property, or to
                                    prevent fraud.
                                </li>
                            </ul>
                            <p className="mt-2">
                                We do not sell personal information. If any sale
                                of business or assets occurs, personal
                                information may be transferred as part of that
                                transaction; we will notify affected users as
                                required by law.
                            </p>
                        </>
                    ),
                },
                {
                    title: "7. Third-Party Services & Links",
                    content: (
                        <p>
                            The Site may include links to third-party websites
                            and embed third-party services (social media, maps,
                            ticketing). These services have their own privacy
                            practices — we encourage you to read their policies
                            before providing personal information.
                        </p>
                    ),
                },
                {
                    title: "8. Data Retention",
                    content: (
                        <p>
                            We retain personal information as long as necessary
                            to provide services, comply with legal obligations,
                            resolve disputes, and enforce our agreements.
                        </p>
                    ),
                },
                {
                    title: "9. International Transfers",
                    content: (
                        <p>
                            Your data may be stored or processed outside your
                            country. When we transfer data across borders, we
                            take steps to protect it in accordance with
                            applicable law (e.g., standard contractual clauses
                            or other safeguards where required).
                        </p>
                    ),
                },
                {
                    title: "10. Security",
                    content: (
                        <p>
                            We implement reasonable technical and organizational
                            measures aimed at protecting personal data. However,
                            no system is completely secure — we cannot guarantee
                            absolute security.
                        </p>
                    ),
                },
                {
                    title: "11. Your Rights",
                    content: (
                        <>
                            <p>
                                Depending on your location, you may have rights
                                regarding your personal information, including
                                to:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Access the data we hold about you.</li>
                                <li>
                                    Correct inaccurate or incomplete
                                    information.
                                </li>
                                <li>
                                    Request deletion of your personal data
                                    (subject to legal exceptions).
                                </li>
                                <li>
                                    Restrict or object to processing and request
                                    portability of your data.
                                </li>
                                <li>
                                    Lodge a complaint with a data protection
                                    authority (for EEA residents).
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    title: "12. Children",
                    content: (
                        <p>
                            Our Site and events are not intended for children
                            under the age of 13. We do not knowingly collect
                            personal information from children under 13.
                        </p>
                    ),
                },
                {
                    title: "13. California Privacy Rights (CCPA)",
                    content: (
                        <p>
                            If you are a California resident, you may have
                            additional rights under the CCPA, including the
                            right to request disclosure of categories of
                            personal information collected and shared, and the
                            right to opt out of the sale of personal information
                            (we do not sell personal data for monetary
                            consideration).
                        </p>
                    ),
                },
                {
                    title: "14. Changes to This Policy",
                    content: (
                        <p>
                            We may update this Privacy Policy. When we do, we
                            will revise the effective date above and notify
                            users where appropriate. Continued use of the Site
                            after changes constitutes acceptance of the updated
                            policy.
                        </p>
                    ),
                },
                {
                    title: "15. Contact Us",
                    content: (
                        <p>
                            If you have questions, requests, or concerns about
                            this Privacy Policy, please contact: <br />
                            <strong>Google Developer Groups Kolkata</strong>
                            <br />
                            Email:{" "}
                            <a
                                href="mailto:contact.gdgkolkata@gmail.com"
                                className="text-green-600 underline"
                            >
                                contact.gdgkolkata@gmail.com
                            </a>
                            <br />
                            Address: Kolkata, West Bengal, India 700051
                        </p>
                    ),
                },
            ].map((sec, i) => (
                <section key={i} className="py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-green-600 mt-4">
                        {sec.title}
                    </h2>
                    <div className="mt-2">{sec.content}</div>
                </section>
            ))}

            <footer className="text-sm text-gray-600 mt-6">
                <p>
                    Last updated: <strong>13/09/2025</strong>
                </p>
                <p>
                    © 2025 Google Developer Groups Kolkata. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
