import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden px-5 pt-24 pb-16 sm:px-6 sm:pb-20 md:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
    >
      {/* Soft background glow. Purely visual, sits behind the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-[420px] w-[420px] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(5,5,7,0) 70%)",
        }}
      />

      <div className="order-2 lg:order-1">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8b8b95]">
            {site.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-[2.5rem] leading-[1.05] font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
            {site.name}
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/60">
            {site.subtext}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={6}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#34d399] py-2 pr-2 pl-6 text-sm font-medium text-[#04120c] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Get in touch
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]">
                  <ArrowUpRight size={15} weight="bold" />
                </span>
              </a>
            </Magnetic>

            <a
              href="#stack"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3.5 text-sm text-white/80 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.04]"
            >
              See my skills
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8b8b95]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d399]" />
            </span>
            {site.availability}
          </p>
        </Reveal>
      </div>

      {/* Avatar. A plain circle: no ring, no glow, no animation. `object-cover`
          fills the circle from the square source, and the character sits centred
          so the face stays inside the crop. */}
      <Reveal delay={0.2} className="order-1 lg:order-2">
        <div className="mx-auto w-[clamp(160px,38vw,224px)] select-none">
          <Image
            src={site.photo}
            alt={`Portrait of ${site.name}`}
            width={site.photoWidth}
            height={site.photoHeight}
            priority
            sizes="(max-width: 1024px) 38vw, 224px"
            className="h-auto w-full rounded-full"
          />
        </div>
      </Reveal>
    </section>
  );
}
