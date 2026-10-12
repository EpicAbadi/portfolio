"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  className?: string;
};

/**
 * Soft fade-up as an element enters the viewport.
 *
 * Hand-rolled instead of using an animation library. There are 19 of these on
 * the page, and the library cost ~59 KB of JavaScript that had to be downloaded,
 * parsed and executed on every visit just to fade a few blocks in. This does the
 * same job with an IntersectionObserver and two CSS properties.
 *
 * Only `opacity` and `transform` are animated: animating `filter` would force a
 * repaint of every revealed element on every frame.
 *
 * The observer disconnects after the first hit, so a block never animates twice.
 * Visitors who asked for reduced motion get the final state with no transition.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      // A block counts as "in view" once a fifth of it is showing.
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      data-shown={shown ? "" : undefined}
      // Inline because the delay is per-instance and Tailwind cannot generate a
      // class for a runtime value. Only set while hidden, so it never lingers.
      style={!shown && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
