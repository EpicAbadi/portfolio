import {
  Browser,
  Bug,
  Database,
  FileCode,
  Robot,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { site, type StackItem } from "@/lib/site";

const icons: Record<StackItem["icon"], Icon> = {
  spark: Sparkle,
  contract: FileCode,
  robot: Robot,
  server: Database,
  browser: Browser,
  bug: Bug,
};

/** Column width on the 6 column desktop grid. */
const spanClass: Record<StackItem["span"], string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

const bgClass: Record<StackItem["bg"], string> = {
  gradient:
    "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(52,211,153,0.14)_0%,rgba(11,11,14,0)_60%)]",
  tint: "bg-[#111116]",
  grid: "dot-grid",
  plain: "",
};

export function Stack() {
  return (
    <section id="stack" className="section">
      <Reveal>
        <h2 className="max-w-[26ch] text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
          The toolkit I reach for every day.
        </h2>
      </Reveal>

      {/* Two columns from the smallest screen: a single column makes six cards
          an endless scroll on a phone. */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-6">
        {site.stack.map((item, index) => {
          const Icon = icons[item.icon];
          return (
            <Reveal
              key={item.title}
              delay={0.05 * index}
              className={`col-span-2 sm:col-span-1 ${spanClass[item.span]}`}
            >
              <div className="flex h-full flex-col rounded-[2rem] border border-white/[0.09] bg-white/[0.02] p-2">
                <div
                  className={`flex h-full flex-col rounded-[calc(2rem-0.5rem)] p-4 sm:p-6 ${bgClass[item.bg]}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-[#34d399]">
                    <Icon size={18} weight="light" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-medium tracking-tight text-white sm:mt-6 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
