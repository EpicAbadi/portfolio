import { ArrowUpRight, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function Projects() {
  const hasProjects = site.projects.length > 0;

  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
            Selected work
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8b8b95]">
            {hasProjects ? `${site.projects.length} listed` : "Nothing published yet"}
          </span>
        </div>
      </Reveal>

      {hasProjects ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2">
          {site.projects.map((project, index) => {
            // A project with no href (local or private work) renders as a plain
            // card instead of an anchor, so nothing links back to this section.
            const Card = project.href ? "a" : "div";

            return (
              <Reveal key={project.title} delay={0.05 * index}>
                <Card
                  {...(project.href
                    ? {
                        href: project.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="group flex h-full flex-col rounded-[2rem] border border-white/[0.09] bg-white/[0.02] p-2 transition-colors duration-500 hover:border-[#34d399]/35"
                >
                  <div className="flex h-full flex-col rounded-[calc(2rem-0.5rem)] bg-[#0b0b0e] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-medium tracking-tight text-white">
                        {project.title}
                      </h3>
                      {project.href ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-[#34d399]">
                          <ArrowUpRight size={15} weight="bold" />
                        </span>
                      ) : (
                        <span className="shrink-0 pt-1 font-mono text-[11px] text-[#8b8b95]">
                          {project.year}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-white/55">
                      {project.summary}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <Reveal delay={0.08}>
          <div className="mt-12 rounded-[2rem] border border-dashed border-white/[0.12] p-8 md:p-12">
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#8b8b95]">
                  <FolderOpen size={19} weight="light" />
                </span>
                <div>
                  <p className="text-base font-medium text-white/90">
                    Case studies are being written up.
                  </p>
                  <p className="mt-1.5 max-w-[52ch] text-[14px] leading-relaxed text-white/50">
                    This section is wired up and ready to fill. Start with a
                    conversation about what you are building.
                  </p>
                </div>
              </div>
              <a
                href="#contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm text-white/85 transition-colors duration-500 hover:border-[#34d399]/50 hover:text-[#34d399]"
              >
                Get in touch
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
