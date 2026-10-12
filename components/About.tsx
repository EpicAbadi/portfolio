import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="section">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <h2 className="text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
            I build at AI speed and take responsibility for what ships.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-6">
          {site.about.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.08 * index}>
              <p className="max-w-[62ch] text-base leading-relaxed text-white/60">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
