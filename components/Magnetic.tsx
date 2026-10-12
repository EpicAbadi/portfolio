"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Magnetic wrapper: the button leans toward the cursor.
 *
 * Hand-rolled rather than using motion values. It is one small effect on one
 * button, and pulling in an animation library to move it cost far more in
 * download and parse time than the effect is worth on a slow device.
 *
 * The offset is written straight to the element's transform inside a
 * requestAnimationFrame, and the element is only moved on a pointer that can
 * actually hover. Touch devices never fire the listeners, and a visitor who
 * prefers reduced motion is never wired up at all.
 */
export function Magnetic({
  children,
  strength = 12,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No hover, no effect. This also keeps touch devices from paying for it.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function tick() {
      // Ease a quarter of the remaining distance each frame: settles in a few
      // frames, and cheap enough to run while the pointer is moving.
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      el!.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      start();
    }

    function onLeave() {
      targetX = 0;
      targetY = 0;
      start();
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return <div ref={ref}>{children}</div>;
}
