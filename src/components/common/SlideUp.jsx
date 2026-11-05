"use client";

import { useLayoutEffect, useRef } from "react";

// The rise the About section ("Memories we Created") plays, packaged for any
// section: the content starts SLIDE px low and transparent, and climbs into
// place as the section's top travels from START to END of the viewport height.
// It is scrubbed by the scroll rather than fired once, so scrolling back up
// plays it in reverse. Keep these in step with AboutSection, which runs its own
// copy because its other scroll effects have to take the rise back out.
const SLIDE = 72;
const START = 0.82;
const END = 0.32;
const TRANSITION = "transform 200ms linear, opacity 200ms linear";

// `ref` lands on the outer box, which never moves, so anything that scrolls to
// the section (the footer links) aims at where it rests rather than where it
// is mid-rise. The inner box is the one that moves; measuring it instead would
// chase its own transform.
const SlideUp = ({ ref, children }) => {
    const ownRef = useRef(null);
    const anchorRef = ref ?? ownRef;
    const riseRef = useRef(null);

    // Layout effect, so the hidden starting state is in place before the
    // first paint rather than flashing the section at full strength.
    useLayoutEffect(() => {
        const anchor = anchorRef.current;
        const rise = riseRef.current;
        if (!anchor || !rise) return;

        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        // Focus inside holds the section in place, so tabbing onto a link
        // near the bottom of the screen never lands on something invisible.
        let focused = false;
        let raf;

        const apply = () => {
            let p = 1;
            if (!reduce?.matches && !focused) {
                const vh = window.innerHeight;
                const top = anchor.getBoundingClientRect().top;
                // Where this top comes to rest once the page can scroll no
                // further. Near the end of the page a section may never climb
                // as far as END, so the rise finishes there instead of
                // stalling half faded.
                const room =
                    document.documentElement.scrollHeight - vh - window.scrollY;
                const end = Math.max(vh * END, top - room);
                p = 1 - (top - end) / (vh * (START - END));
                p = Math.min(1, Math.max(0, p));
            }

            // Settled means nothing left behind: a transform or will-change
            // would make this box the containing block for anything fixed or
            // sticky inside, and opacity would make it a stacking context —
            // the sections were laid out without either.
            const s = rise.style;
            if (p >= 1) {
                s.transform = "";
                s.opacity = "";
                s.willChange = "";
            } else {
                s.transform = `translateY(${(1 - p) * SLIDE}px)`;
                s.opacity = String(p);
                s.willChange = "transform, opacity";
            }
        };

        const schedule = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(apply);
        };

        const onFocusIn = () => {
            focused = true;
            apply();
        };
        const onFocusOut = (e) => {
            if (rise.contains(e.relatedTarget)) return;
            focused = false;
            schedule();
        };

        // The starting state goes in without a transition, or the section
        // would visibly fade out from full on mount; the smoothing joins a
        // frame later, for the scroll-driven changes only.
        apply();
        const arm = requestAnimationFrame(() => {
            rise.style.transition = TRANSITION;
        });

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        reduce?.addEventListener?.("change", schedule);
        rise.addEventListener("focusin", onFocusIn);
        rise.addEventListener("focusout", onFocusOut);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            reduce?.removeEventListener?.("change", schedule);
            rise.removeEventListener("focusin", onFocusIn);
            rise.removeEventListener("focusout", onFocusOut);
            cancelAnimationFrame(raf);
            cancelAnimationFrame(arm);
        };
    }, [anchorRef]);

    return (
        <div ref={anchorRef}>
            <div ref={riseRef}>{children}</div>
        </div>
    );
};

export default SlideUp;
