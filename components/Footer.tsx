import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-6">
      <div className="flex flex-col gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8b8b95]">
          {site.name}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {site.socials.map((social) =>
            /* Discord has no public profile URL, so it stays a plain label here
               rather than an anchor with nothing to point at. */
            social.href ? (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/50 transition-colors duration-300 hover:text-[#34d399]"
              >
                {social.label}
              </a>
            ) : (
              <span
                key={social.label}
                className="text-[13px] text-white/50"
                title={social.handle}
              >
                {social.label}
              </span>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
