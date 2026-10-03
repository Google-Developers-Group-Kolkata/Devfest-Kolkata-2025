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
    red:    { bg: "/ticket/background-red.svg",    accent: "#F63130" },
    blue:   { bg: "/ticket/background-blue.svg",   accent: "#4285F4" },
    green:  { bg: "/ticket/background-green.svg",  accent: "#34A853" },
    yellow: { bg: "/ticket/background-yellow.svg", accent: "#FBBC04" },
};

const colorFor = (ticketName) => {
    const name = String(ticketName ?? "");
    const hit = TIER_COLORS.find(([re]) => re.test(name));
    return PALETTE[hit ? hit[1] : "red"];
};

const px  = (v) => `${(v / TICKET_W) * 100}%`;
const py  = (v) => `${(v / TICKET_H) * 100}%`;
// Type scales with the card rather than the viewport, so the layout holds at
// any width the section gives it.
const cq  = (v) => `${(v / TICKET_W) * 100}cqw`;

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
        style={{ width: cq(16), height: cq(16), flex: "0 0 auto" }}
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
        style={{ width: cq(16), height: cq(16), flex: "0 0 auto" }}
    >
        <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10.2" r="2.8" />
    </svg>
);

// What the QR carries when it is scanned: plain text, not a URL, so the code
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
    // bars derived from it.
    const hasPassId = Boolean(attendee.bookingId);

    // One line under the name: what they do, where they do it. Either half
    // can be missing; an empty line is not drawn.
    // Both values are already word-boundary-clipped by the API's clip().
    const designation   = String(attendee.designation   ?? "").trim();
    const organisation  = String(attendee.organisation  ?? "").trim();
    const roleLine = [designation, organisation].filter(Boolean).join("  ·  ");

    // Generated once per attendee — a data url rather than a rendered <img>,
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
        return () => { alive = false; };
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

            {/* ─── LEFT STUB ─────────────────────────────────────────────────
                QR takes up most of the stub height so it is big enough to
                scan reliably. LEARN · BUILD · CONNECT and the Google dots
                fill the remaining space below it. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: px(BODY.left + 18),
                    top: py(18),
                    width: px(PERF_L - BODY.left - 36),
                }}
            >
                {/* QR — taller than before so scanners can read it */}
                <div
                    style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        background: qr ? `url(${qr}) center / contain no-repeat` : "#0B0B0B",
                        borderRadius: cq(5),
                    }}
                />
                <div
                    className="product_sans"
                    style={{
                        marginTop: cq(6),
                        fontSize: cq(9),
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

            {/* LEARN · BUILD · CONNECT */}
            <div
                className="product_sans pointer-events-none absolute"
                style={{
                    left: px(BODY.left + 18),
                    top: py(186),
                    width: px(PERF_L - BODY.left - 36),
                    textAlign: "center",
                    lineHeight: 1.4,
                }}
            >
                {["LEARN", "BUILD", "CONNECT"].map((word) => (
                    <div
                        key={word}
                        style={{
                            fontSize: cq(11),
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: INK,
                        }}
                    >
                        {word}
                    </div>
                ))}
                <div
                    style={{
                        marginTop: cq(5),
                        fontSize: cq(8),
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "#80868b",
                    }}
                >
                    #DevFestKolkata
                </div>
            </div>

            {/* Four Google-colour dots — below LEARN/BUILD/CONNECT */}
            <div
                className="pointer-events-none absolute flex"
                style={{
                    left: px(BODY.left + 18),
                    bottom: py(TICKET_H - BODY.bottom + 8),
                    width: px(PERF_L - BODY.left - 36),
                    justifyContent: "space-between",
                }}
                aria-hidden="true"
            >
                {["#4285F4", "#EA4335", "#FBBC04", "#34A853"].map((c) => (
                    <span
                        key={c}
                        style={{
                            width: cq(10),
                            height: cq(10),
                            borderRadius: "50%",
                            background: c,
                        }}
                    />
                ))}
            </div>

            {/* ─── MIDDLE BODY ───────────────────────────────────────────────
                Top row: GDG logo + "DevFest Kolkata'26" lockup on the left,
                "I'M ATTENDING 🚀" pill on the right.
                Below: kicker → name (hero) → role line → ticket chip → date/day/venue → disclaimer. */}

            {/* Brand lockup row */}
            <div
                className="pointer-events-none absolute flex items-center"
                style={{
                    left: px(PERF_L + 26),
                    top: py(14),
                    height: py(36),
                    gap: cq(11),
                }}
            >
                <img
                    src="/logo-brackets.svg"
                    alt=""
                    style={{ height: cq(30), width: "auto", flex: "0 0 auto" }}
                />
                <span
                    className="product_sans whitespace-nowrap"
                    style={{
                        fontSize: cq(36),
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
                        padding: `${cq(5)} ${cq(12)}`,
                        fontSize: cq(15),
                        fontWeight: 500,
                        lineHeight: 1,
                    }}
                >
                    Kolkata&rsquo;26
                </span>
            </div>

            {/* "I'M ATTENDING" pill — top-right of the body */}
            <div
                className="product_sans pointer-events-none absolute flex items-center whitespace-nowrap"
                style={{
                    right: px(TICKET_W - (PERF_R - 26)),
                    top: py(14),
                    height: py(36),
                    gap: cq(8),
                    background: "#4285F4",
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: `0 ${cq(18)}`,
                    fontSize: cq(16),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                }}
            >
                I&rsquo;M ATTENDING
                <span aria-hidden="true" style={{ fontSize: cq(15) }}>🚀</span>
            </div>

            {/* Punchline below the pill — the exact line from the hero,
                now on the badge so it carries the event's own voice. */}
            <div
                className="product_sans pointer-events-none absolute"
                style={{
                    right: px(TICKET_W - (PERF_R - 26)),
                    top: py(55),
                    fontSize: cq(13),
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: INK,
                    textAlign: "right",
                    maxWidth: px(340),
                }}
            >
                কলকাতার ছন্দে, DevFest-এর আনন্দে !
            </div>

            {/* "This pass belongs to" kicker */}
            <div
                className="product_sans pointer-events-none absolute whitespace-nowrap"
                style={{
                    left: px(PERF_L + 26),
                    top: py(55),
                    fontSize: cq(10),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#80868b",
                }}
            >
                This pass belongs to
            </div>

            {/* ── NAME — hero text, kept well below the kicker ── */}
            <div
                className="product_sans pointer-events-none absolute"
                style={{
                    left: px(PERF_L + 26),
                    top: py(88),
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

            {/* Role line — designation · organisation. Both values come out of
                the API already word-boundary-clipped, so CSS just needs to
                hide any overflow without re-truncating mid-word. */}
            {roleLine && (
                <div
                    className="product_sans pointer-events-none absolute"
                    style={{
                        left: px(PERF_L + 26),
                        top: py(148),
                        width: px(545),
                        fontSize: cq(13),
                        fontWeight: 500,
                        lineHeight: 1.15,
                        color: "#5f6368",
                        // overflow:hidden clips without adding "…" — the text
                        // from clip() already ends at a word boundary.
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    {roleLine}
                </div>
            )}

            {/* Ticket chip */}
            <div
                className="product_sans pointer-events-none absolute flex items-center whitespace-nowrap"
                style={{
                    left: px(PERF_L + 26),
                    top: py(165),
                    height: py(26),
                    maxWidth: px(545),
                    background: accent,
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: `0 ${cq(14)}`,
                    fontSize: cq(13.5),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    overflow: "hidden",
                }}
            >
                {attendee.ticketName}
            </div>

            {/* Date / Day / Venue row */}
            <div
                className="product_sans pointer-events-none absolute flex items-center"
                style={{
                    left: px(PERF_L + 26),
                    top: py(196),
                    width: px(545),
                    height: py(22),
                    gap: cq(9),
                    fontSize: cq(14),
                    fontWeight: 500,
                    lineHeight: 1,
                    color: INK,
                }}
            >
                <span className="flex items-center" style={{ gap: cq(6), color: INK }}>
                    <CalendarIcon />
                    {attendee.date}
                </span>
                <span style={{ color: "#dadce0" }}>|</span>
                <span
                    style={{
                        background: "#ECECEC",
                        borderRadius: "999px",
                        padding: `${cq(4)} ${cq(10)}`,
                        fontSize: cq(12),
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                    }}
                >
                    DAY {attendee.day}
                </span>
                <span style={{ color: "#dadce0" }}>|</span>
                <span
                    className="flex items-center"
                    style={{ gap: cq(6), color: "#5f6368", overflow: "hidden" }}
                >
                    <PinIcon />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {attendee.venue}
                    </span>
                </span>
            </div>

            {/* Tagline row — the event's own three-word promise, centred under
                the date row, bridges the date/venue info and the disclaimer. */}
            <div
                className="product_sans pointer-events-none absolute flex items-center"
                style={{
                    left: px(PERF_L + 26),
                    top: py(222),
                    width: px(545),
                    gap: cq(8),
                    fontSize: cq(10.5),
                    fontWeight: 500,
                    lineHeight: 1,
                    color: "#80868b",
                }}
            >
                {["Learn", "Build", "Connect"].map((word, i, arr) => (
                    <span key={word} className="flex items-center" style={{ gap: cq(8) }}>
                        <span>{word}</span>
                        {i < arr.length - 1 && (
                            <span style={{ fontSize: cq(8), opacity: 0.5 }}>●</span>
                        )}
                    </span>
                ))}
                <span style={{ color: "#dadce0", marginLeft: cq(4) }}>·</span>
                <span>Organised by GDG Kolkata</span>
            </div>

            {/* Victoria Memorial ornament, bottom centre */}
            <img
                src="/ticket/victoria-memorial.svg"
                alt=""
                className="pointer-events-none absolute"
                style={{
                    left: px((PERF_L + PERF_R) / 2 - 58),
                    bottom: py(TICKET_H - BODY.bottom + 2),
                    width: px(116),
                    height: "auto",
                }}
            />

            {/* ─── RIGHT STUB ────────────────────────────────────────────────
                A real booking prints "EVENT PASS", its serial, and the barcode
                hashed from the serial. A placeholder falls back to the DevFest
                lockup — no dummy id nobody could use. */}
            {hasPassId ? (
                <>
                    <div
                        className="product_sans pointer-events-none absolute text-center"
                        style={{
                            left: px(PERF_R),
                            width: px(BODY.right - PERF_R),
                            top: py(28),
                            fontSize: cq(11),
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "0.2em",
                            color: "#80868b",
                            textTransform: "uppercase",
                        }}
                    >
                        Event Pass
                    </div>

                    {/* Serial number */}
                    <div
                        className="product_sans pointer-events-none absolute text-center"
                        style={{
                            left: px(PERF_R),
                            width: px(BODY.right - PERF_R),
                            top: py(48),
                            fontSize: cq(22),
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

                    {/* Barcode */}
                    <div
                        className="pointer-events-none absolute"
                        style={{
                            left: px(PERF_R + 27),
                            width: px(BODY.right - PERF_R - 54),
                            top: py(96),
                            height: py(140),
                        }}
                        aria-hidden="true"
                    >
                        <Barcode seed={attendee.bookingId} />
                    </div>
                </>
            ) : (
                /* Fallback for a no-id pass */
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
                    <div style={{ fontSize: cq(26), fontWeight: 700 }}>DevFest</div>
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

            {/* Organiser line — a ticket always names its organiser. */}
            <div
                className="product_sans pointer-events-none absolute text-center"
                style={{
                    left: px(PERF_R),
                    width: px(BODY.right - PERF_R),
                    top: py(252),
                    fontSize: cq(9),
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#80868b",
                }}
            >
                Presented by GDG Kolkata
            </div>

            <div
                className="product_sans pointer-events-none absolute text-center"
                style={{
                    left: px(PERF_R),
                    width: px(BODY.right - PERF_R),
                    bottom: py(26),
                    fontSize: cq(12),
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
