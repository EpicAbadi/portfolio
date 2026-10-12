import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

/**
 * Same content model as Approach, deliberately different layout:
 * a vertical connected track instead of a two column grid, so two consecutive
 * sections never share the same rhythm.
 */
export function Focus() {
  return (
    <section id="focus" className="section">
      <Reveal>
        <h2 className="max-w-[24ch] text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
          The four things I work on most.
        </h2>
      </Reveal>

      <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="border-l border-white/[0.09] pl-8">
          {site.focus.map((item, index) => (
            <Reveal key={item.title} delay={0.06 * index}>
              <div className={`relative ${index === 0 ? "" : "mt-12"}`}>
                <span className="absolute top-2 -left-[41px] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#34d399]/40 bg-[#050507]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                </span>
                <h3 className="text-lg font-medium tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-white/55">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closing note, carried as a single card so the columns stay balanced. */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-[2rem] border border-white/[0.09] bg-white/[0.02] p-2 lg:mt-0">
            <div className="flex h-full flex-col rounded-[calc(2rem-0.5rem)] bg-[#0b0b0e] p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-[#34d399]">
                <CheckCircle size={18} weight="light" />
              </span>
              <p className="mt-6 text-base leading-relaxed text-white/80">
                I would rather tell you a build is not ready than hand over
                something that breaks on a real transaction.
              </p>
              <a
                href="#approach"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/85 transition-colors duration-500 hover:border-[#34d399]/50 hover:text-[#34d399]"
              >
                Read my approach
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
