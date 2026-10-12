"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "approach", label: "Approach" },
  { id: "stack", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

/**
 * Entries that map to a real section on the page. "top" is not one: it is the
 * hero, which is exactly where no section has been reached yet.
 */
const SECTIONS = links.filter((link) => link.id !== "top");

/**
 * Distance from the top of the viewport that decides which section is current.
 * Sits just below the fixed pill (20px offset + 56px tall), so a section becomes
 * active once its heading has scrolled clear of the nav rather than before.
 */
const PROBE = 140;

/**
 * Spring for the nav fill.
 *
 * Damping is just above critical for the stiffness, so it settles without
 * bouncing. The important part is not the numbers: the loop below reads the
 * fill's own position and velocity every frame, so retargeting mid-flight keeps
 * the speed it already has. A CSS transition cannot do that - it restarts from
 * zero on every new target, which reads as a stall in the middle of a long jump.
 */
const SPRING_STIFFNESS = 200;
const SPRING_DAMPING = 28;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);

  /**
   * Read the motion preference once on mount rather than through an animation
   * library. Same signal the CSS media queries use, so the JS and the stylesheet
   * always agree about it.
   */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /**
   * Which entry is lit. At the top of the page no section has been reached, so
   * `active` is null and Home is the one that should be showing. Derived up here
   * rather than next to the JSX because the fill effect below depends on it.
   */
  const activeId = active ?? "top";

  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  /** Section the fill is parked on, so a resize can snap it back into place. */
  const currentRef = useRef<string | null>(null);
  /** Whether the fill has ever been placed. The first appearance must not slide. */
  const shownRef = useRef(false);

  /** Live position and velocity of the fill, in px and px/s. */
  const xRef = useRef(0);
  const vRef = useRef(0);
  /** Where the loop is currently heading, re-read each frame. */
  const targetXRef = useRef(0);
  const widthRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /**
   * Highlight the section the reader is actually in.
   *
   * The rule is "the last section whose top has crossed the probe line". That
   * keeps the highlight on the section you are reading while its content fills
   * the screen, hands it over only once the next heading passes the line, and
   * lets the last entry stay lit through the footer instead of blanking out.
   *
   * At the very top no section has been reached, so the result is null. That is
   * not a gap to fill in: null IS "Home". A visitor scrolled to the top sees Home
   * lit, which is the whole point of having the entry.
   */
  useEffect(() => {
    let frame = 0;

    function update() {
      let current: string | null = null;

      for (const link of SECTIONS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= PROBE) current = link.id;
      }

      setActive(current);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Park the fill under the active entry.
   *
   * The fill is a plain absolutely-positioned span moved with a transform. Its
   * position is advanced by a spring integrated in a requestAnimationFrame loop
   * rather than by a CSS transition, because a spring carries velocity: when the
   * active section changes mid-flight the fill bends toward the new target
   * instead of stopping dead and starting over.
   *
   * The loop is a fixed-step integrator so the motion does not change with the
   * display's refresh rate, and it parks itself as soon as it has settled.
   */
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    function measure(section: string) {
      const target = list!.querySelector<HTMLElement>(`[data-nav="${section}"]`);
      if (!target) return null;
      return { x: target.offsetLeft, width: target.offsetWidth };
    }

    function stop() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastTsRef.current = 0;
    }

    /** Advance one fixed 1/60s step. */
    function step(dt: number) {
      const x = xRef.current;
      const v = vRef.current;
      // a = -k * displacement - c * velocity
      const a =
        -SPRING_STIFFNESS * (x - targetXRef.current) - SPRING_DAMPING * v;
      const nv = v + a * dt;
      const nx = x + nv * dt;

      // Settled: close enough, and slow enough, that another frame would not show.
      if (Math.abs(targetXRef.current - nx) < 0.4 && Math.abs(nv) < 22) {
        xRef.current = targetXRef.current;
        vRef.current = 0;
        fill!.style.transform = `translateX(${targetXRef.current}px)`;
        return false;
      }

      xRef.current = nx;
      vRef.current = nv;
      fill!.style.transform = `translateX(${nx}px)`;
      return true;
    }

    function tick(ts: number) {
      const last = lastTsRef.current || ts;
      lastTsRef.current = ts;

      // Clamp the step so a background tab or a dropped frame cannot throw the
      // spring past its target.
      const dt = Math.min((ts - last) / 1000, 1 / 30);

      if (step(dt)) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
        lastTsRef.current = 0;
      }
    }

    function run() {
      if (!rafRef.current) {
        lastTsRef.current = 0;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    currentRef.current = activeId;

    const spot = measure(activeId);

    if (!spot) {
      fill.style.opacity = "0";
      stop();
      return;
    }

    fill.style.opacity = "1";
    if (widthRef.current !== spot.width) {
      fill.style.width = `${spot.width}px`;
      widthRef.current = spot.width;
    }
    targetXRef.current = spot.x;

    // First appearance lands instantly. So does a reduced-motion visitor, and so
    // does a resize, where a slide would be noise rather than feedback.
    if (!shownRef.current || reduce) {
      stop();
      xRef.current = spot.x;
      vRef.current = 0;
      fill.style.transform = `translateX(${spot.x}px)`;
      shownRef.current = true;
      return;
    }

    shownRef.current = true;
    run();

    return () => stop();
  }, [activeId, reduce]);

  /**
   * Re-place the fill on resize: the entries change width, so the parked offset
   * is stale. Snapping is correct here, the pill itself just moved.
   */
  useEffect(() => {
    function onResize() {
      const list = listRef.current;
      const fill = fillRef.current;
      const section = currentRef.current;
      if (!list || !fill || !section) return;
      const target = list.querySelector<HTMLElement>(`[data-nav="${section}"]`);
      if (!target) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastTsRef.current = 0;

      xRef.current = target.offsetLeft;
      vRef.current = 0;
      targetXRef.current = target.offsetLeft;
      fill.style.width = `${target.offsetWidth}px`;
      widthRef.current = target.offsetWidth;
      fill.style.transform = `translateX(${target.offsetLeft}px)`;
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
        {/* Solid background rather than `backdrop-blur`: a backdrop filter makes
            the browser re-blur the whole strip behind the bar on every scroll
            frame, which is one of the most expensive things you can ask a cheap
            phone to do. At 40% black the bar already reads as glass. */}
        <nav className="pointer-events-auto mt-5 flex h-14 w-fit items-center rounded-full border border-white/10 bg-[#0b0b0e]/85 px-2">
          {/* Relative, so the fill can be positioned against the row it slides in. */}
          <div ref={listRef} className="relative hidden items-center gap-1 md:flex">
            <span
              ref={fillRef}
              aria-hidden
              className="nav-fill pointer-events-none absolute top-0 left-0 h-full rounded-full bg-[#34d399] opacity-0"
            />

            {links.map((link) => (
              <a
                key={link.id}
                data-nav={link.id}
                href={`#${link.id}`}
                aria-current={activeId === link.id ? "true" : undefined}
                className={`relative inline-flex min-w-[76px] justify-center rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300 ${
                  activeId === link.id
                    ? "font-medium text-[#04120c]"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span
              className="absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: open ? "rotate(45deg)" : "translateY(-3.5px)" }}
            />
            <span
              className="absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: open ? "rotate(-45deg)" : "translateY(3.5px)" }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu.
          Mounted only while open, so its links are not focusable behind a closed
          menu. It animates purely in CSS: the panel fades, and the links stagger
          by reading an index off a custom property. No animation library is
          needed for six anchors fading in. */}
      {open && (
        <div
          className="nav-panel fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-[#050507]/97 px-8 text-center md:hidden"
          data-reduce={reduce ? "" : undefined}
        >
          {links.map((link, index) => {
            const isActive = activeId === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                style={{ "--i": index } as React.CSSProperties}
                className={`nav-panel-item w-full max-w-xs border-b border-white/[0.07] py-5 text-3xl font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? "text-[#34d399]" : "text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
