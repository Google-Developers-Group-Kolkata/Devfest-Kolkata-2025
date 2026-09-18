import React from "react";

export const metadata = {
    title: "Code of Conduct | GDG Kolkata",
    description:
        "GDG Kolkata Code of Conduct and Anti-Harassment Policy for DevFest Kolkata and all community events.",
};

export default function CodeOfConduct() {
    return (
        <main className="min-h-screen bg-[#1E1E1E] text-white">
            <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 product_sans" style={{ color: "#4285F4" }}>
                    Code of Conduct &amp; Anti-Harassment Policy
                </h1>
                <p className="text-gray-400 text-sm mb-10 sm:mb-12">
                    Effective date: <strong>13/09/2026</strong>
                </p>

                {/* Intro */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        <strong className="text-white">GDG Kolkata</strong>, part of the
                        Google Developer Groups (GDG) program, is dedicated to providing
                        a harassment-free and inclusive event experience for everyone —
                        regardless of gender identity and expression, sexual orientation,
                        disabilities, neurodiversity, physical appearance, body size,
                        ethnicity, nationality, race, age, religion, or other protected
                        category. We do not tolerate harassment of event participants in
                        any form. GDG Kolkata takes violations of this policy seriously and
                        will respond appropriately.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mt-4">
                        All participants of GDG Kolkata events — including DevFest Kolkata
                        — must abide by the following policy.
                    </p>
                </section>

                {/* Be Excellent To Each Other */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#EA4335" }}
                    >
                        Be Excellent To Each Other
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        We want every GDG Kolkata event to be an excellent experience for
                        everyone, regardless of gender identity and expression, sexual
                        orientation, disabilities, neurodiversity, physical appearance, body
                        size, ethnicity, nationality, race, age, religion, or other protected
                        category. Treat everyone with respect. Participate while
                        acknowledging that everyone deserves to be here — each of us has the
                        right to enjoy our experience without fear of harassment,
                        discrimination, or condescension, whether blatant or via
                        micro-aggressions. Jokes shouldn&apos;t demean others. Consider what
                        you are saying, and how it would feel if it were said to or about
                        you.
                    </p>
                </section>

                {/* Speak Up */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#34A853" }}
                    >
                        Speak Up If You See Or Hear Something
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        Harassment is not tolerated, and you are empowered to politely
                        engage when you or others are disrespected. The person making you
                        feel uncomfortable may not be aware of what they are doing, and
                        politely bringing their behavior to their attention is encouraged.
                        If a participant engages in harassing or uncomfortable behavior, the
                        event organizers may take any action they deem appropriate, including
                        warning or expelling the offender from the event with no refund. If
                        you are being harassed, feel uncomfortable, notice someone else being
                        harassed, or have any other concerns, please contact a member of the
                        event staff immediately.
                    </p>
                </section>

                {/* Zero Tolerance Policy */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#FBBC04" }}
                    >
                        Zero Tolerance Policy
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-5">
                        We have a zero tolerance policy for in-person or online harassment
                        of any kind, including but not limited to:
                    </p>
                    <ul className="space-y-2.5 mb-6">
                        {[
                            "Deliberate intimidation",
                            "Harassing photography or recording",
                            "Sustained disruption of talks or other sessions",
                            "Offensive verbal language",
                            "Language that reinforces social structures of domination",
                            "Sexual imagery and language",
                            "Unwelcome sexual or physical attention",
                            "Physical or cyber threats",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] sm:text-base">
                                <span
                                    className="mt-1.5 block w-2 h-2 rounded-full shrink-0"
                                    style={{
                                        backgroundColor: [
                                            "#EA4335",
                                            "#4285F4",
                                            "#34A853",
                                            "#FBBC04",
                                        ][i % 4],
                                    }}
                                />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-4">
                        This zero tolerance policy applies to harassment of any kind
                        related to, but not limited to:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[
                            "Neurodiversity",
                            "Race",
                            "Color",
                            "National origin",
                            "Gender identity",
                            "Gender expression",
                            "Sexual orientation",
                            "Age",
                            "Body size",
                            "Disabilities",
                            "Appearance",
                            "Religion",
                            "Pregnancy",
                            "Military status",
                            "Social demographic",
                        ].map((cat, i) => (
                            <span
                                key={i}
                                className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-600 text-gray-300"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-4">
                        All participants of GDG Kolkata events — in-person and online
                        attendees, event staff, speakers, volunteers, partners, and
                        sponsors — must abide by this policy. Participants asked to stop
                        any harassing behavior are expected to comply immediately.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-4">
                        This policy extends to talks, forums, workshops, codelabs,
                        hackathons, social media, parties, hallway conversations —
                        everywhere GDG Kolkata community members interact. GDG Kolkata
                        reserves the right to refuse admittance to, or remove any person
                        from, any GDG Kolkata event (including future events) at any time,
                        at its sole discretion. This includes, but is not limited to,
                        attendees behaving in a disorderly manner or failing to comply with
                        this policy and its terms.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-4">
                        Our event staff can usually be identified by special badges/attire.
                        We will look into and review every allegation of a violation of this
                        policy and respond appropriately. While we take all concerns raised
                        seriously, we will use our discretion in determining when and how to
                        follow up on reported incidents, and may decline to take further
                        action and/or direct the participant to other resources for
                        resolution.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        Event staff will be happy to help participants contact venue
                        security or local law enforcement, provide escorts, or otherwise
                        assist those experiencing discomfort or harassment to feel safe for
                        the duration of the event. We value your attendance.
                    </p>
                </section>

                {/* Exhibiting Partners */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#4285F4" }}
                    >
                        Exhibiting Partners
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        Exhibiting partners, sponsors, and vendor booths are also subject
                        to this policy. Exhibitors should not use sexualized images,
                        activities, or other material, and booth staff (including
                        volunteers) should not use sexualized clothing, uniforms, or
                        costumes, or otherwise create a sexualized environment. Participants
                        and exhibitors disobeying this policy will be notified and are
                        expected to stop any offending behavior immediately.
                    </p>
                </section>

                {/* Reporting */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#EA4335" }}
                    >
                        Reporting
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base mb-4">
                        If someone makes you or anyone else feel unsafe or unwelcome,
                        please report it as soon as possible. Harassment and other Code of
                        Conduct violations reduce the value of our events for everyone — we
                        want you to be happy at GDG Kolkata events, and people like you
                        make our community a better place.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        You can make a report either personally, to a member of the
                        organizing team, or by email at{" "}
                        <a
                            href="mailto:contact.gdgkolkata@gmail.com"
                            className="underline font-semibold transition-colors hover:text-[#34A853]"
                            style={{ color: "#4285F4" }}
                        >
                            contact.gdgkolkata@gmail.com
                        </a>
                        .
                    </p>
                </section>

                {/* Why This Policy Is Important */}
                <section className="mb-10 sm:mb-12 border-b border-gray-700 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#34A853" }}
                    >
                        Why This Policy Is Important
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        Harassment at events and in online communities is unfortunately
                        common. Creating an official policy helps make it clear that
                        harassment of anyone, for any reason, is not acceptable within GDG
                        Kolkata&apos;s events and community. This policy aims to prevent
                        harassment by clearly defining expectations for behavior, provides
                        reassurance to participants, and encourages people who may have had
                        bad experiences elsewhere to participate fully and confidently in
                        ours.
                    </p>
                </section>

                {/* License and Attribution */}
                <section className="mb-10 sm:mb-12 pb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4 product_sans"
                        style={{ color: "#FBBC04" }}
                    >
                        License and Attribution
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-[15px] sm:text-base">
                        This policy is licensed under the{" "}
                        <a
                            href="https://creativecommons.org/publicdomain/zero/1.0/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold transition-colors hover:text-[#EA4335]"
                            style={{ color: "#4285F4" }}
                        >
                            Creative Commons Zero (CC0)
                        </a>{" "}
                        license. It is adapted for GDG Kolkata from the official{" "}
                        <strong className="text-white">
                            Google Developer Groups (GDG) Code of Conduct and
                            Anti-Harassment Policy
                        </strong>
                        , which is itself based on and influenced by several community
                        policies, including the Ohio LinuxFest Anti-Harassment Policy, the
                        Con Anti-Harassment Project, the Geek Feminism Wiki (created by the
                        Ada Initiative), ConfCodeofConduct.com, JSConf, Rust, Diversity in
                        Python, and Write/Speak/Code.
                    </p>
                </section>

                {/* Footer */}
                <footer className="text-sm text-gray-500 pt-6 border-t border-gray-700">
                    <p>
                        Last updated: <strong className="text-gray-400">13/09/2026</strong>
                    </p>
                    <p className="mt-1">
                        &copy; 2026 Google Developer Groups Kolkata. All rights reserved.
                    </p>
                </footer>
            </div>
        </main>
    );
}
