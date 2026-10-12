import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function Approach() {
  return (
    <section
      id="approach"
      className="section"
    >
      <Reveal>
        <h2 className="max-w-[26ch] text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
          How a build actually gets from idea to mainnet.
        </h2>
      </Reveal>

      <ol className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:mt-14 sm:grid-cols-2">
        {site.approach.map((step, index) => (
          <Reveal key={step.title} delay={0.06 * index}>
            <li className="border-t border-white/[0.09] pt-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-[#34d399]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium tracking-tight text-white">
                  {step.title}
                </h3>
              </div>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-white/55">
                {step.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
