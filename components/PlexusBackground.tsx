"use client";

import { useEffect, useRef } from "react";

/**
 * Plexus background: a constellation mesh of drifting nodes joined by lines.
 *
 * Drawn on a canvas rather than as DOM elements: a few hundred lines per frame
 * as divs would thrash the layout engine, while the canvas costs one repaint of
 * a single fixed layer that never touches layout at all.
 *
 * Performance notes, because this runs for the whole life of the page:
 * - The neighbour search is O(n^2) on purpose. With the node count capped at 140
 *   that is under 10k distance checks per frame, which is cheaper than the
 *   bookkeeping a spatial grid would add.
 * - Alpha strings are precomputed into a table. Building them with template
 *   literals every frame allocates thousands of throwaway strings per second.
 * - Lines are batched per alpha step, so the stroke style changes a handful of
 *   times per frame instead of once per line.
 * - The loop stops while the tab is hidden, and never starts at all for a
 *   visitor who asked for reduced motion (they get one static frame).
 */
const LINK_DIST = 160; // px: longest line drawn between two nodes
const NODE_MIN = 55;
const NODE_MAX = 165;
const AREA_PER_NODE = 7200; // px^2 per node
const DRIFT = 14; // px per second, the slowest the mesh ever moves
const ALPHA_STEPS = 24;
const LINE_ALPHA_MAX = 0.46;
const NODE_ALPHA = 0.85;

/** Precomputed stroke colours, indexed by alpha step. */
const LINE_COLOURS = Array.from(
  { length: ALPHA_STEPS },
  (_, i) => `rgba(255,255,255,${((i / (ALPHA_STEPS - 1)) * LINE_ALPHA_MAX).toFixed(3)})`,
);

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const c = el.getContext("2d");
    if (!c) return;

    // Bind to consts of a narrowed type: inside the closures below, TypeScript
    // cannot carry the null-narrowing of `el` / `c` across the function boundary.
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = c;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let lastTs = 0;

    function targetCount() {
      return Math.max(
        NODE_MIN,
        Math.min(NODE_MAX, Math.round((w * h) / AREA_PER_NODE)),
      );
    }

    function makeNode(): Node {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT,
        vy: (Math.random() - 0.5) * DRIFT,
        r: 0.6 + Math.random() * 0.9,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // --- lines, batched by alpha step ---
      // Bucket the pairs first so the whole frame costs ~24 stroke() calls
      // instead of one per line.
      const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);
      const link2 = LINK_DIST * LINK_DIST;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link2) continue;

          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          // Squared falloff: lines fade out rather than stopping at a hard edge.
          const step = Math.min(ALPHA_STEPS - 1, Math.round(t * t * (ALPHA_STEPS - 1)));
          buckets[step].push(a.x, a.y, b.x, b.y);
        }
      }

      ctx.lineWidth = 1;
      for (let step = 0; step < ALPHA_STEPS; step++) {
        const seg = buckets[step];
        if (seg.length === 0) continue;
        ctx.strokeStyle = LINE_COLOURS[step];
        ctx.beginPath();
        for (let k = 0; k < seg.length; k += 4) {
          ctx.moveTo(seg[k], seg[k + 1]);
          ctx.lineTo(seg[k + 2], seg[k + 3]);
        }
        ctx.stroke();
      }

      // --- nodes ---
      ctx.fillStyle = `rgba(255,255,255,${NODE_ALPHA})`;
      ctx.beginPath();
      for (const n of nodes) {
        ctx.moveTo(n.x + n.r, n.y);
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    function advance(dt: number) {
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        // Wrap with a margin so a node never vanishes inside the viewport.
        if (n.x < -LINK_DIST) n.x = w + LINK_DIST;
        else if (n.x > w + LINK_DIST) n.x = -LINK_DIST;
        if (n.y < -LINK_DIST) n.y = h + LINK_DIST;
        else if (n.y > h + LINK_DIST) n.y = -LINK_DIST;
      }
    }

    function frame(ts: number) {
      const last = lastTs || ts;
      lastTs = ts;
      // Clamp so a background tab or a dropped frame cannot teleport the mesh.
      advance(Math.min((ts - last) / 1000, 1 / 30));
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduce || raf) return;
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      lastTs = 0;
    }

    function resize() {
      const prevW = w;
      const prevH = h;

      w = window.innerWidth;
      h = window.innerHeight;

      // Cap the ratio: a 3x buffer on a large screen is millions of pixels to
      // clear every frame for detail nobody can see.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prevW === 0 || nodes.length === 0) {
        nodes = Array.from({ length: targetCount() }, makeNode);
      } else {
        // Rescale instead of reseeding, so resizing does not make the whole
        // mesh jump to new random positions.
        const sx = w / prevW;
        const sy = h / prevH;
        for (const n of nodes) {
          n.x *= sx;
          n.y *= sy;
        }
        const want = targetCount();
        while (nodes.length > want) nodes.pop();
        while (nodes.length < want) nodes.push(makeNode());
      }

      draw();
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    }

    resize();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="plexus" />;
}
