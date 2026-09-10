"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SCROLL_ATTR,
  clearPendingSection,
  readPendingSection,
  rememberPendingSection,
} from "@/lib/scroll-nav";

declare global {
  interface Window {
    /** Shared Lenis instance so any component can drive the page scroll. */
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis honours `prefers-reduced-motion` on its own: smoothing is
    // disabled and programmatic scrolls become instant.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const glideTo = (target: HTMLElement | number) => {
      lenis.scrollTo(target, {
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    };

    /* ── In-page navigation ─────────────────────────────────────────────────
       Runs in the capture phase, before React and before next/link's own
       handler. preventDefault() here is what makes a <Link> stand down (it
       bails on `e.defaultPrevented`), while React onClick handlers on the
       same element — closing the mobile drawer, for one — still fire because
       propagation is left intact. Nothing is written to the URL. */
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const node = event.target as HTMLElement | null;
      if (!node?.closest) return;

      const trigger = node.closest(`[${SCROLL_ATTR}]`);
      if (trigger) {
        const id = trigger.getAttribute(SCROLL_ATTR);
        const section = id ? document.getElementById(id) : null;

        if (section) {
          event.preventDefault();
          glideTo(section);
        } else if (id) {
          // Not on this route: hand the target to the home page and let the
          // trigger's own <Link href="/"> do the routing.
          rememberPendingSection(id);
        }
        return;
      }

      // The wordmark links home; from the home page that means "back to top".
      const anchor = node.closest("a") as HTMLAnchorElement | null;
      if (
        anchor &&
        anchor.getAttribute("href") === "/" &&
        window.location.pathname === "/"
      ) {
        event.preventDefault();
        glideTo(0);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    /* Finish a cross-route jump: /team → / lands here, then scrolls. Also
       honours a legacy #hash URL so links shared before this change still
       land in the right place. The landing runs after ScrollTrigger.refresh()
       so the pinned speaker section has its final height, and the stored id is
       cleared only once the scroll has actually been applied. */
    const pending = readPendingSection() || window.location.hash.slice(1);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();

      if (!pending) return;
      const section = document.getElementById(pending);
      if (!section) return;

      lenis.scrollTo(section, { immediate: true, force: true });
      clearPendingSection();
    }, 500);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
