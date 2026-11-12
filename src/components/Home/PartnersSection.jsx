"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Every partner, in the order they fill the grid. Entries with a `label` have
// their billing printed inside their box; the rest are shown by logo alone.
// Add or remove partners freely — the grid grows or shrinks to fit.
const PARTNERS = [
    {
        label: "Powered by",
        name: "Google for Developers",
        logo: "/sponsors/google-for-developers.svg",
        href: "https://developers.google.com/",
    },
    {
        label: "Co-presented by",
        name: "Logitech",
        logo: "/sponsors/Logitech_RGB_black_L.png",
        href: "https://www.logitech.com/en-in",
    },
    {
        label: "Supported by",
        name: "Anvayapc",
        logo: "/sponsors/anvayapc.jpeg",
        href: "https://anvayapc.com",
    },
    // Digital news partner
    {
        name: "News Ei Samay",
        logo: "/sponsors/news-ei-samay.png",
        href: "https://newseisamay.com/",
    },
    // Healthcare partner
    {
        name: "Sasta Sundar",
        logo: "/sponsors/sasta-sundar.png",
        href: "https://www.sastasundar.com/",
    },
    // Media partners
    {
        name: "Candid Kolkata",
        logo: "/sponsors/candid-kolkata.png",
        href: "https://www.instagram.com/candidkolkata/",
    },
    // In association with
    {
        name: "FRIENDS FM",
        logo: "/sponsors/friends-fm.png",
        href: "https://www.instagram.com/919friendsfm/",
    },
    // Media partners
    {
        name: "Kolkata Calling",
        logo: "/sponsors/kolkata-calling.png",
        href: "https://www.kolkatacalling.com/",
    },
    {
        name: "West Bengal",
        logo: "/sponsors/west-bengal.png",
        href: "https://www.instagram.com/WestBengal/",
    },
    {
        name: "Wiki Kolkata",
        logo: "/sponsors/wiki-kolkata.png",
        href: "https://www.wikikolkata.com/",
    },
    // Community partners
    {
        name: "Kolkata IT Hub",
        logo: "/sponsors/kolkata-it-hub.png",
        href: "https://in.linkedin.com/company/kolkata-it-hub",
    },
    {
        name: "Open Source Con",
        logo: "/sponsors/open-source-con.png",
        href: "https://opensourcecon.in/",
    },
    {
        name: "Friends of Figma Kolkata",
        logo: "/sponsors/friends-of-figma-kolkata.png",
        href: "https://friends.figma.com/kolkata/",
    },
    {
        name: "JetBrains",
        logo: "/sponsors/jetbrains.png",
        href: "https://www.jetbrains.com/",
    },
    {
        name: "Oh Kolkata",
        logo: "/sponsors/ohkolkatalogocircle.png",
        href: "https://ohkolkata.com/",
    },
];

// The staircase shape, one per breakpoint. Each string is a grid row:
//   X  a partner's box
//   o  an empty box — a gap the outline still runs around
//   .  nothing at all; the backdrop shows through
// Rows repeat from the top until every partner is placed. In the last row,
// X slots before the final partner turn into empty boxes so the shape stays
// whole, and anything after it is dropped so the shape ends on a logo.
// Every row needs at least one X.
const LAYOUTS = [
    {
        key: "phone",
        cols: 3,
        className: "grid sm:hidden",
        rows: ["XX.", ".XX", "XoX"],
    },
    {
        key: "tablet",
        cols: 5,
        className: "hidden sm:grid lg:hidden",
        rows: ["XX.X.", ".XXoX", ".XoXX", "XXoX."],
    },
    {
        key: "desktop",
        cols: 6,
        className: "hidden lg:grid",
        rows: ["XX.X..", ".XXoX.", "..XXoX", ".XoXX.", "XXoX.."],
    },
];

const buildCells = (rows, count) => {
    const cells = [];
    let placed = 0;
    for (let r = 0; placed < count; r++) {
        [...rows[r % rows.length]].forEach((slot, c) => {
            if (slot === ".") return;
            const partner = slot === "X" && placed < count ? placed++ : null;
            cells.push({ row: r + 1, col: c + 1, partner });
        });
    }
    while (cells.length && cells[cells.length - 1].partner === null) {
        cells.pop();
    }
    return cells;
};

const GRIDS = LAYOUTS.map((layout) => ({
    ...layout,
    cells: buildCells(layout.rows, PARTNERS.length),
}));

const LINE = "#202124";

// Hover fills cycle through the Google pastels; billing labels use the darker
// Google text shades so they stay readable at small sizes.
const TINTS = ["#E8F0FE", "#FCE8E6", "#FEF7E0", "#E6F4EA"];
const LABEL_COLORS = ["#1A73E8", "#D93025", "#188038", "#B06000"];

const EASE = [0.33, 0, 0.2, 1];

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045 } },
};

const cellVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const PartnerCell = ({ partner, index }) => {
    const Tag = partner.href ? "a" : "div";
    const labelled = Boolean(partner.label);

    return (
        <Tag
            {...(partner.href
                ? {
                      href: partner.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                  }
                : {})}
            title={partner.name}
            className="group relative block h-full w-full bg-white transition-colors duration-300 ease-out hover:bg-[var(--tint)] focus-visible:bg-[var(--tint)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1A73E8]"
            style={{ "--tint": TINTS[index % TINTS.length] }}
        >
            {labelled && (
                <span
                    className="product_sans absolute left-[9%] right-[9%] top-[9%] text-[11px] sm:text-[12px] xl:text-[13px]"
                    style={{
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: "0.01em",
                        color: LABEL_COLORS[index % LABEL_COLORS.length],
                    }}
                >
                    {partner.label}
                </span>
            )}

            {/* A fixed logo box keeps wide wordmarks and square badges visually
                balanced: wide ones run out of width, square ones out of height. */}
            <span
                className={`absolute flex items-center justify-center ${
                    labelled
                        ? "inset-x-[8%] top-[30%] bottom-[9%]"
                        : "inset-x-[12%] inset-y-[22%]"
                }`}
            >
                <img
                    src={partner.logo}
                    alt={partner.name}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                />
            </span>

            {partner.href && (
                <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={2}
                    className="absolute right-[6%] top-[6%] h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: LINE }}
                />
            )}
        </Tag>
    );
};

const PartnersGrid = ({ grid, reduced }) => (
    // A 1px gap plus a 1px outline on every box draws each shared edge once,
    // so neighbouring boxes read as one continuous line.
    <motion.div
        className={`${grid.className} p-px`}
        style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
            gap: "1px",
        }}
        variants={gridVariants}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
    >
        {grid.cells.map((cell) => (
            <motion.div
                key={`${cell.row}-${cell.col}`}
                variants={cellVariants}
                className="aspect-square"
                style={{
                    gridRow: cell.row,
                    gridColumn: cell.col,
                    boxShadow: `0 0 0 1px ${LINE}`,
                }}
                {...(cell.partner === null ? { "aria-hidden": true } : {})}
            >
                {cell.partner !== null && (
                    <PartnerCell
                        partner={PARTNERS[cell.partner]}
                        index={cell.partner}
                    />
                )}
            </motion.div>
        ))}
    </motion.div>
);

const PartnersSection = () => {
    const reduced = useReducedMotion();

    return (
        <section id="partners" className="relative w-full select-none">
            <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                <motion.div
                    className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: EASE }}
                >
                    <h2
                        className="product_sans max-w-[560px] text-[30px] sm:text-[36px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                        style={{
                            fontWeight: 700,
                            lineHeight: 1.04,
                            letterSpacing: "-0.015em",
                            color: "#000000",
                        }}
                    >
                        Thank you to our{" "}
                        <span
                            className="inline-block"
                            style={{ color: "#4285F4" }}
                        >
                            Sponsors &amp; Partners
                        </span>
                    </h2>

                    <div className="max-w-[520px] lg:max-w-[360px] lg:pb-2">
                        <p
                            className="product_sans text-[15px] md:text-[16px] xl:text-[17px]"
                            style={{
                                fontWeight: 400,
                                lineHeight: 1.5,
                                color: "#3c4043",
                            }}
                        >
                            DevFest Kolkata 2026 runs on the support of the
                            platforms and partners standing behind our
                            community.
                        </p>
                    </div>
                </motion.div>

                <div className="mt-12 md:mt-16 xl:mt-20">
                    {GRIDS.map((grid) => (
                        <PartnersGrid
                            key={grid.key}
                            grid={grid}
                            reduced={reduced}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
