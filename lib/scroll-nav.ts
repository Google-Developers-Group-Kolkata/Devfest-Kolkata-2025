/* ── In-page section navigation, without hash notation ─────────────────────
   Nav tabs, CTAs and footer links carry `data-scroll-to="<section id>"`
   instead of an `#anchor` href. SmoothScrollProvider listens for clicks on
   the attribute and drives Lenis to the section, so nothing is appended to
   the address bar.

   Triggers that also have to work from another route (the footer, which
   renders on /team too) are `<Link href="/" data-scroll-to="...">`: when the
   section isn't on the current page the click falls through to the router,
   and the target is parked here for the home page to pick up on mount.   */

/** Attribute marking an element as an in-page scroll trigger. */
export const SCROLL_ATTR = "data-scroll-to";

/* Clearance under the fixed navbar comes from `[id] { scroll-margin-top }` in
   globals.css — Lenis subtracts a target's scroll-margin itself, so adding a
   second offset here would double-count it. */

const PENDING_KEY = "devfest:pending-section";

/** Park a section id across a route change. Storage can throw in private
 *  modes, and a missed scroll is not worth breaking navigation over. */
export function rememberPendingSection(id: string): void {
  try {
    window.sessionStorage.setItem(PENDING_KEY, id);
  } catch {
    /* no-op */
  }
}

/** Peek at the parked section id without consuming it. Reading and clearing
 *  must stay separate: React Strict Mode double-invokes effects in dev, so a
 *  destructive read would let the first (immediately torn down) pass swallow
 *  the target and leave the second pass with nothing to scroll to. */
export function readPendingSection(): string | null {
  try {
    return window.sessionStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

/** Drop the parked section id, once it has actually been scrolled to. */
export function clearPendingSection(): void {
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* no-op */
  }
}
