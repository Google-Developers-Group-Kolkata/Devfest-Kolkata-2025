"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// The badge is the ticket, redrawn. It borrows the pass artwork's own
// coordinate system — its 959x317 box, its perforations and its notches — so
// the two cards are laid out by the same numbers and cannot drift apart.
const TICKET_W = 959;
const TICKET_H = 317;

const BODY = { left: 14.23, right: 945.43, top: 11.25, bottom: 304.44 };
const PERF_L = 143.12;
const PERF_R = 740.1;
const NOTCH_TOP = 37.72;
const NOTCH_BOTTOM = 277.97;

const INK = "#0B0B0B";

// Which artwork a badge wears is decided by the tier it was bought on — the
// same colour the tier carries in `devfest2026-tickets`, so a badge and the
// card that sold the pass agree with each other.
const TIER_COLORS = [
    [/workshop/i, "blue"],
    [/early\s*bird/i, "yellow"],
    [/exclusive/i, "red"],
    [/phase\s*1/i, "blue"],
    [/phase\s*3/i, "red"],
    [/phase\s*2/i, "green"],
];

const PALETTE = {
    red: { bg: "/ticket/background-red.svg", accent: "#F63130" },
    blue: { bg: "/ticket/background-blue.svg", accent: "#4285F4" },
    green: { bg: "/ticket/background-green.svg", accent: "#34A853" },
    yellow: { bg: "/ticket/background-yellow.svg", accent: "#FBBC04" },
};

const colorFor = (ticketName) => {
    const name = String(ticketName ?? "");
    const hit = TIER_COLORS.find(([re]) => re.test(name));
    return PALETTE[hit ? hit[1] : "red"];
};

const px = (v) => `${(v / TICKET_W) * 100}%`;
const py = (v) => `${(v / TICKET_H) * 100}%`;
// Type scales with the card rather than the viewport, so the layout holds at
// any width the section gives it.
const cq = (v) => `${(v / TICKET_W) * 100}cqw`;

// A name is the one field with no fixed length, so it steps down instead of
// running off the card. The tiers are wide enough that each size fits its
// length on one line; only a pathologically long name wraps to a second.
const nameSizeFor = (name) => {
    const n = (name || "").length;
    if (n <= 10) return cq(50);
    if (n <= 16) return cq(42);
    if (n <= 22) return cq(34);
    if (n <= 30) return cq(28);
    return cq(22);
};

// The stub barcode is decoration, not a scannable symbol: the bars are
// derived from the booking id, so they are stable between renders and differ
// from pass to pass. Even indices are bars, odd ones the gaps between them.
const BAR_COUNT = 25;

const barsFor = (seed) => {
    let h = 2166136261;
    const key = String(seed ?? "ticket");
    for (let i = 0; i < key.length; i++) {
        h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    }
    const bars = [];
    for (let i = 0; i < BAR_COUNT; i++) {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        bars.push(1 + ((h >>> 9) % 3));
    }
    return bars;
};

const Barcode = ({ seed }) => (
    <div className="flex h-full w-full flex-col items-stretch" aria-hidden="true">
        {barsFor(seed).map((weight, i) => (
            <div
                key={i}
                style={{
                    flex: `${weight} 0 0`,
                    background: i % 2 ? "transparent" : INK,
                }}
            />
        ))}
    </div>
);

const CalendarIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ width: cq(17), height: cq(17), flex: "0 0 auto" }}
    >
        <rect x="3" y="4" width="18" height="17" rx="2.5" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
);

const PinIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ width: cq(17), height: cq(17), flex: "0 0 auto" }}
    >
        <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10.2" r="2.8" />
    </svg>
);

// What the QR carries when it is scanned: plain text, no link, so the code
// reads the same in any scanner and asks nothing of the person receiving it.
const qrMessage = (attendee) =>
    `${attendee.name} is joining us at DevFest Kolkata '26 on ${attendee.date}, at ${attendee.venue}.`;

/**
 * The badge itself.
 *
 * `cardRef` is the node the section rasterises to a PNG — it is the card and
 * nothing around it, so what is exported is exactly what is on screen.
 */
const BadgeCard = ({ attendee, cardRef }) => {
    const [qr, setQr] = useState(null);
    const { bg, accent } = colorFor(attendee.ticketName);
    const name = attendee.name || "Attendee";
    // Only a genuine booking gets a serial. A test or placeholder pass has
    // nothing worth printing, so its stub carries neither the id nor the
    // bars that are derived from it.
    const hasPassId = Boolean(attendee.bookingId);

    // Generated once per attendee; a data url rather than a rendered <img>,
    // so the rasteriser has nothing to fetch.
    useEffect(() => {
        let alive = true;
        QRCode.toDataURL(qrMessage(attendee), {
            errorCorrectionLevel: "M",
            margin: 0,
            scale: 8,
            color: { dark: "#0B0B0B", light: "#FFFFFFFF" },
        })
            .then((url) => alive && setQr(url))
            .catch(() => alive && setQr(null));
        return () => {
            alive = false;
        };
    }, [attendee]);

    return (
        <div
            ref={cardRef}
            className="relative w-full overflow-hidden"
            style={{
                aspectRatio: `${TICKET_W} / ${TICKET_H}`,
                containerType: "inline-size",
                backgroundImage: `url(${bg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* The two stub perforations, run between the notches so the dashes
                start and stop exactly where the artwork is cut. */}
            <svg
                viewBox={`0 0 ${TICKET_W} ${TICKET_H}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                {[PERF_L, PERF_R].map((x) => (
                    <path
                        key={x}
                        d={`M ${x} ${NOTCH_TOP + 4} V ${NOTCH_BOTTOM - 4}`}
                        stroke={accent}
                        strokeWidth="2.6"
                        strokeDasharray="10 8"
                        strokeLinecap="round"
                    />
                ))}
            </svg>

            {/* Left stub — the scan target, and the four brand dots beneath it. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: px(BODY.left + 27),
                    top: py(56),
                    width: px(PERF_L - BODY.left - 54),
                }}
            >
                <div
                    style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        background: qr ? `url(${qr}) center / contain no-repeat` : "#0B0B0B",
                        borderRadius: cq(6),
                    }}
                />
                <div
                    className="product_sans"
                    style={{
                        marginTop: cq(9),
                        fontSize: cq(11),
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: "0.16em",
                        textAlign: "center",
                        color: "#80868b",
                    }}
                >
                    SCAN ME
                </div>
            </div>

            <div
                className="pointer-events-none absolute flex"
                style={{
                    left: px(BODY.left + 27),
                    top: py(244),
                    width: px(PERF_L - BODY.left - 54),
                    justifyContent: "space-between",
                }}
                aria-hidden="true"
            >
                {["#4285F4", "#EA4335", "#FBBC04", "#34A853"].map((c) => (
                    <span
                        key={c}
                        style={{
                            width: cq(11),
                            height: cq(11),
                            borderRadius: "50%",
                            background: c,
                        }}
                    />
                ))}
            </div>

            {/* Middle stub — brand lockup and the attending pill share the top
                row, the name is the hero, the tier sits under it as a chip. */}
            <div
                className="pointer-events-none absolute flex items-center"
                style={{
                    left: px(PERF_L + 26),
                    top: py(22),
                    height: py(36),
                    gap: cq(11),
                }}
            >
                <img
                    src="/logo-brackets.svg"
                    alt=""
                    style={{ height: cq(32), width: "auto", flex: "0 0 auto" }}
                />
                <span
                    className="product_sans whitespace-nowrap"
                    style={{
                        fontSize: cq(38),
                        fontWeight: 700,
                        lineHeight: 1,
                        color: INK,
                        letterSpacing: "-0.01em",
                    }}
                >
                    DevFest
                </span>
                <span
                    className="product_sans whitespace-nowrap"
                    style={{
                        background: "#ECECEC",
                        color: INK,
                        borderRadius: "999px",
                        padding: `${cq(6)} ${cq(13)}`,
                        fontSize: cq(17),
                        fontWeight: 500,
                        lineHeight: 1,
                    }}
                >
                    Kolkata&rsquo;26
                </span>
            </div>

            <div
                className="product_sans pointer-events-none absolute flex items-center whitespace-nowrap"
                style={{
                    right: px(TICKET_W - (PERF_R - 26)),
                    top: py(24),
                    height: py(34),
                    gap: cq(8),
                    background: "#4285F4",
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: `0 ${cq(18)}`,
                    fontSize: cq(17),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                }}
            >
                I&rsquo;M ATTENDING
                <span aria-hidden="true" style={{ fontSize: cq(16) }}>
                    🚀
                </span>
            </div>

            <div
                className="product_sans pointer-events-none absolute"
                style={{
                    left: px(PERF_L + 26),
                    top: py(80),
                    width: px(545),
                    fontSize: nameSizeFor(name),
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                    color: INK,
                    textTransform: "uppercase",
                    overflowWrap: "anywhere",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {name}
            </div>

            <div
                className="product_sans pointer-events-none absolute flex items-center whitespace-nowrap"
                style={{
                    left: px(PERF_L + 26),
                    top: py(150),
                    height: py(30),
                    maxWidth: px(545),
                    background: accent,
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: `0 ${cq(16)}`,
                    fontSize: cq(15),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    overflow: "hidden",
                }}
            >
                {attendee.ticketName}
            </div>

            <div
                className="product_sans pointer-events-none absolute flex items-center"
                style={{
                    left: px(PERF_L + 26),
                    top: py(186),
                    width: px(545),
                    height: py(24),
                    gap: cq(9),
                    fontSize: cq(16),
                    fontWeight: 500,
                    lineHeight: 1,
                    color: INK,
                }}
            >
                <span
                    className="flex items-center"
                    style={{ gap: cq(7), color: INK }}
                >
                    <CalendarIcon />
                    {attendee.date}
                </span>
                <span style={{ color: "#dadce0" }}>|</span>
                <span
                    style={{
                        background: "#ECECEC",
                        borderRadius: "999px",
                        padding: `${cq(5)} ${cq(11)}`,
                        fontSize: cq(13),
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                    }}
                >
                    DAY {attendee.day}
                </span>
                <span style={{ color: "#dadce0" }}>|</span>
                <span
                    className="flex items-center"
                    style={{ gap: cq(7), color: "#5f6368", overflow: "hidden" }}
                >
                    <PinIcon />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {attendee.venue}
                    </span>
                </span>
            </div>

            {/* The one line that has to travel with the image: a badge is
                not a ticket, and the card says so wherever it is reposted. */}
            <div
                className="product_sans pointer-events-none absolute"
                style={{
                    left: px(PERF_L + 26),
                    top: py(216),
                    width: px(545),
                    fontSize: cq(11),
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "#80868b",
                }}
            >
                Social badge for sharing only — does not guarantee entry.
            </div>

            {/* Kolkata ornament, bottom centre — the same artwork the pass
                card carries, so both read as one family. */}
            <img
                src="/ticket/victoria-memorial.svg"
                alt=""
                className="pointer-events-none absolute"
                style={{
                    left: px((PERF_L + PERF_R) / 2 - 60),
                    bottom: py(TICKET_H - BODY.bottom + 2),
                    width: px(120),
                    height: "auto",
                }}
            />

            {/* Right stub. A real booking prints its serial and the bars
                hashed from it; anything else falls back to the lockup rather
                than showing a placeholder id nobody could use. */}
            {hasPassId ? (
                <>
                    <div
                        className="product_sans pointer-events-none absolute text-center"
                        style={{
                            left: px(PERF_R),
                            width: px(BODY.right - PERF_R),
                            top: py(32),
                            fontSize: cq(12),
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "0.2em",
                            color: "#80868b",
                            textTransform: "uppercase",
                        }}
                    >
                        Event Pass
                    </div>

                    <div
                        className="product_sans pointer-events-none absolute text-center"
                        style={{
                            left: px(PERF_R),
                            width: px(BODY.right - PERF_R),
                            top: py(54),
                            fontSize: cq(24),
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "0.04em",
                            color: INK,
                            textTransform: "uppercase",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {attendee.bookingId}
                    </div>

                    <div
                        className="pointer-events-none absolute"
                        style={{
                            left: px(PERF_R + 27),
                            width: px(BODY.right - PERF_R - 54),
                            top: py(104),
                            height: py(146),
                        }}
                        aria-hidden="true"
                    >
                        <Barcode seed={attendee.bookingId} />
                    </div>
                </>
            ) : (
                <div
                    className="product_sans pointer-events-none absolute text-center"
                    style={{
                        left: px(PERF_R),
                        width: px(BODY.right - PERF_R),
                        top: py(96),
                        lineHeight: 1.1,
                        color: INK,
                    }}
                >
                    <div style={{ fontSize: cq(26), fontWeight: 700 }}>
                        DevFest
                    </div>
                    <div
                        style={{
                            fontSize: cq(15),
                            fontWeight: 500,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#80868b",
                            marginTop: cq(6),
                        }}
                    >
                        Kolkata&rsquo;26
                    </div>
                </div>
            )}

            <div
                className="product_sans pointer-events-none absolute text-center"
                style={{
                    left: px(PERF_R),
                    width: px(BODY.right - PERF_R),
                    bottom: py(26),
                    fontSize: cq(13),
                    fontWeight: 500,
                    lineHeight: 1,
                    color: INK,
                }}
            >
                devfestkolkata.in
            </div>
        </div>
    );
};

export default BadgeCard;
