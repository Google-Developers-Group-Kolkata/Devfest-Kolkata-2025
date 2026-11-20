// DevFest Kolkata workshop certificate, rendered as a PDF with pdf-lib.
//
// Layout engine ported from the Evntfy project (GDGKolkata/src/lib/
// certificate.ts), restyled to match the DevFest site: Google Sans, the four
// Google brand colours, the GDG brackets mark and the Howrah Bridge line art
// from the ticket artwork — all drawn as vectors, so nothing is rasterised.
//
// Pure function: bytes in, bytes out. No Firebase and no request object, so a
// route, a script or a preview can all call it. Assets are read from disk
// relative to `assetsDir` (default: <cwd>/src and <cwd>/public).

import { readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const hex = (value) => {
    const n = parseInt(value.slice(1), 16);
    return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

// SVG colours come as "#rrggbb" or "rgb(r, g, b)" depending on the export.
const parseColor = (value) => {
    const m = String(value).match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    return m ? rgb(m[1] / 255, m[2] / 255, m[3] / 255) : hex(value);
};

// Site palette (globals.css): Google red/blue/green/yellow, #1E1E1E ink.
const RED = hex("#EA4335");
const BLUE = hex("#4285F4");
const GREEN = hex("#34A853");
const YELLOW = hex("#FBBC04");
const BLUE_TEXT = hex("#1A73E8"); // BLUE darkened so bold text passes contrast on white
const INK = hex("#1E1E1E");
const GRAY = hex("#5F6368");
const GRAY_LIGHT = hex("#80868B");
const RULE = hex("#DADCE0");
const BRIDGE = hex("#C6DAFC");
const BRAND = [RED, BLUE, GREEN, YELLOW];

const PAGE_W = 841.89; // A4 landscape
const PAGE_H = 595.28;

// ---------------------------------------------------------------- assets ---

const readAsset = (dir, ...parts) => readFileSync(path.join(dir, ...parts));

// The SVG artwork is simple (only <path d fill stroke stroke-width>), so a
// regex pull is enough and avoids an XML dependency.
const svgPaths = (svg) => {
    const out = [];
    for (const [tag] of svg.matchAll(/<path\b[^>]*>/g)) {
        const attr = (name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
        const d = attr("d");
        if (!d) continue;
        // Some exports set colours in an inline style instead of attributes.
        const styled = (prop) => attr("style")?.match(new RegExp(`${prop}:\\s*([^;]+)`))?.[1]?.trim();
        out.push({
            d,
            fill: attr("fill") ?? styled("fill"),
            stroke: attr("stroke") ?? styled("stroke"),
            strokeWidth: Number(attr("stroke-width") ?? 1),
        });
    }
    return out;
};

const svgSize = (svg) => {
    const [, , w, h] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1 1").split(/\s+/).map(Number);
    return { w, h };
};

// pdf-lib's drawSvgPath puts the origin at the top-left with y pointing down.
// `top` is therefore the page y of the artwork's top edge.
const drawSvgArt = (page, svg, { x, top, scale, color, strokeOverride }) => {
    for (const p of svgPaths(svg)) {
        const hasFill = p.fill && p.fill !== "none";
        const hasStroke = p.stroke && p.stroke !== "none";
        page.drawSvgPath(p.d, {
            x,
            y: top,
            scale,
            color: hasFill ? parseColor(p.fill) : undefined,
            borderColor: hasStroke ? strokeOverride ?? parseColor(p.stroke) : undefined,
            borderWidth: hasStroke ? p.strokeWidth * scale : 0,
        });
    }
};

// ------------------------------------------------------------------ text ---

// Keep only characters the font actually has: a missing glyph would draw as
// an empty box. Accents fold to plain letters first so "José" survives.
const safe = (font, text, fallback = "") => {
    const has = new Set(font.getCharacterSet());
    const folded = String(text ?? "")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    let out = "";
    for (const ch of folded) if (has.has(ch.codePointAt(0))) out += ch;
    return out.trim() || fallback;
};

const words = (text, style) => text.split(" ").filter(Boolean).map((w) => ({ text: w, style }));

// The body is three blocks: an intro line, one bold-blue entry per workshop,
// and the organiser/date sentence. Each block is wrapped on its own and the
// workshops are separated by a small gap, so any number of topics stacks
// cleanly instead of running together in one paragraph.
const introTokens = (count) =>
    words(`For successfully completing the ${count > 1 ? "workshops" : "workshop"} on`, "regular");

const outroTokens = ({ organizer, event, dateLabel }) => {
    const tokens = [...words("organized by", "regular")];
    tokens.push(...words(organizer, "bold"));
    tokens.push(...words("as part of", "regular"));
    tokens.push(...words(`${event}${dateLabel ? "," : "."}`, "bold"));
    if (dateLabel) {
        tokens.push(...words("held on", "regular"));
        // one token, so "21st November, 2026." never splits across lines
        tokens.push({ text: `${dateLabel}.`, style: "bold" });
    }
    return tokens;
};

const wrapTokens = (tokens, fontFor, size, maxWidth) => {
    const space = fontFor("regular").widthOfTextAtSize(" ", size);
    const lines = [];
    let current = [];
    let currentWidth = 0;
    for (const token of tokens) {
        const w = fontFor(token.style).widthOfTextAtSize(token.text, size);
        const next = currentWidth + (current.length ? space : 0) + w;
        if (next > maxWidth && current.length) {
            lines.push(current);
            current = [token];
            currentWidth = w;
        } else {
            current.push(token);
            currentWidth = next;
        }
    }
    if (current.length) lines.push(current);
    return lines;
};

const drawTokenLine = (page, tokens, fontFor, colorFor, size, centerX, y) => {
    const space = fontFor("regular").widthOfTextAtSize(" ", size);
    const lineWidth = tokens.reduce(
        (sum, t, i) => sum + fontFor(t.style).widthOfTextAtSize(t.text, size) + (i ? space : 0),
        0
    );
    let x = centerX - lineWidth / 2;
    for (const t of tokens) {
        const font = fontFor(t.style);
        page.drawText(t.text, { x, y, size, font, color: colorFor(t.style) });
        x += font.widthOfTextAtSize(t.text, size) + space;
    }
};

// CSS letter-spacing has no pdf-lib equivalent: draw one character at a time.
const drawTracked = (page, text, y, font, size, color, centerX, tracking) => {
    const width = [...text].reduce((s, ch) => s + font.widthOfTextAtSize(ch, size) + tracking, -tracking);
    let x = centerX - width / 2;
    for (const ch of text) {
        page.drawText(ch, { x, y, size, font, color });
        x += font.widthOfTextAtSize(ch, size) + tracking;
    }
};

const drawCentered = (page, text, y, font, size, color, centerX) => {
    page.drawText(text, { x: centerX - font.widthOfTextAtSize(text, size) / 2, y, size, font, color });
};

// A person's name has no length bound, so it shrinks to fit rather than
// overflowing the page or wrapping onto a second line.
const drawFitted = (page, text, y, font, preferred, min, color, centerX, maxWidth) => {
    let size = preferred;
    while (size > min && font.widthOfTextAtSize(text, size) > maxWidth) size -= 1;
    drawCentered(page, text, y, font, size, color, centerX);
};

// ----------------------------------------------------------------- build ---

/**
 * @param {object} input
 * @param {string} input.name        attendee name
 * @param {string[]} [input.topics]  workshop topics, one line-group each (bold blue)
 * @param {string} [input.topic]     a single topic; shorthand for topics: [topic]
 * @param {string} input.certKey     unique certificate key, printed at the bottom
 * @param {string} [input.event]     default "DevFest Kolkata 2026"
 * @param {string} [input.organizer] default "GDG Kolkata"
 * @param {string} [input.dateLabel] e.g. "21st November, 2026"
 * @param {string} [input.rootDir]   project root holding src/ and public/; default cwd
 * @returns {Promise<Uint8Array>}
 */
export async function generateCertificatePdf(input) {
    const {
        name,
        topic,
        topics = topic ? [topic] : [],
        certKey,
        event = "DevFest Kolkata 2026",
        organizer = "GDG Kolkata",
        dateLabel = "",
        rootDir = process.cwd(),
    } = input;

    const fontsDir = path.join(rootDir, "src", "fonts", "certificate");
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    pdf.setTitle(`Certificate of Completion - ${event}`);
    pdf.setProducer("GDG Kolkata");

    const regular = await pdf.embedFont(readAsset(fontsDir, "GoogleSans-Regular.ttf"), { subset: true });
    const medium = await pdf.embedFont(readAsset(fontsDir, "GoogleSans-Medium.ttf"), { subset: true });
    const bold = await pdf.embedFont(readAsset(fontsDir, "GoogleSans-Bold.ttf"), { subset: true });
    const fontFor = (style) => (style === "regular" ? regular : bold);
    const colorFor = (style) => (style === "topic" ? BLUE_TEXT : style === "bold" ? INK : GRAY);

    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const centerX = PAGE_W / 2;
    const left = 64;
    const right = PAGE_W - 64;

    // Four-colour edge bars, top and bottom — the site's brand strip.
    const seg = PAGE_W / 4;
    BRAND.forEach((color, i) => {
        page.drawRectangle({ x: i * seg, y: PAGE_H - 9, width: seg, height: 9, color });
        page.drawRectangle({ x: i * seg, y: 0, width: seg, height: 6, color });
    });

    // Header: GDG brackets mark + wordmark on the left, event on the right.
    const publicDir = path.join(rootDir, "public");
    const logoSvg = readAsset(publicDir, "logo-brackets.svg").toString("utf8");
    const logoSize = svgSize(logoSvg);
    const logoScale = 36 / logoSize.w;
    const headerTop = PAGE_H - 36;
    drawSvgArt(page, logoSvg, { x: left, top: headerTop, scale: logoScale });
    page.drawText("Google Developer Group", { x: left + 46, y: headerTop - 15, size: 12.5, font: medium, color: INK });
    page.drawText("Kolkata", { x: left + 46, y: headerTop - 30, size: 12.5, font: medium, color: INK });

    // DevFest Kolkata 2026 logo, top right.
    const devfestLogo = await pdf.embedPng(readAsset(publicDir, "certificate", "devfest-logo.png"));
    const devfestH = 44;
    const devfestW = (devfestLogo.width / devfestLogo.height) * devfestH;
    page.drawImage(devfestLogo, { x: right - devfestW, y: headerTop - 40, width: devfestW, height: devfestH });

    // Centre block.
    drawTracked(page, "CERTIFICATE OF COMPLETION", 428, bold, 13, BLUE_TEXT, centerX, 3);
    drawCentered(page, "This certificate is proudly presented to", 402, regular, 13, GRAY, centerX);
    drawFitted(page, safe(bold, name, "Attendee"), 356, bold, 42, 20, INK, centerX, right - left - 40);

    // Divider: the four brand dots.
    const dotGap = 17;
    BRAND.forEach((color, i) => {
        page.drawCircle({ x: centerX + (i - 1.5) * dotGap, y: 330, size: 3.6, color });
    });

    const size = 13.5;
    const lineGap = 21;
    const topicList = (topics.length ? topics : ["the workshop"]).map((t) => safe(bold, t)).filter(Boolean);
    const blocks = [
        wrapTokens(introTokens(topicList.length), fontFor, size, 620),
        ...topicList.map((t) => wrapTokens(words(t, "topic"), fontFor, size, 620)),
        wrapTokens(
            outroTokens({
                organizer: safe(bold, organizer, "GDG Kolkata"),
                event: safe(bold, event, "DevFest Kolkata 2026"),
                dateLabel: safe(regular, dateLabel),
            }),
            fontFor,
            size,
            620
        ),
    ];
    let y = 298;
    blocks.forEach((lines, i) => {
        for (const line of lines) {
            drawTokenLine(page, line, fontFor, colorFor, size, centerX, y);
            y -= lineGap;
        }
        // a little air around the workshop entries
        if (i < blocks.length - 1) y -= 5;
    });

    // Howrah Bridge line art from the ticket artwork, pale, behind the footer.
    const bridgeSvg = readAsset(publicDir, "ticket", "howrah_bridge.svg").toString("utf8");
    const bridgeSize = svgSize(bridgeSvg);
    const bridgeScale = 330 / bridgeSize.w;
    drawSvgArt(page, bridgeSvg, {
        x: centerX - 165,
        top: 150 + bridgeSize.h * bridgeScale,
        scale: bridgeScale,
        strokeOverride: BRIDGE,
    });

    // Footer.
    const barY = 64;
    page.drawLine({ start: { x: left, y: barY + 24 }, end: { x: right, y: barY + 24 }, color: RULE, thickness: 1 });

    // Certificate ID, centred.
    drawCentered(page, "CERTIFICATE ID", barY + 6, bold, 7.5, GRAY_LIGHT, centerX);
    drawCentered(page, certKey, barY - 9, bold, 13, INK, centerX);

    return pdf.save();
}
