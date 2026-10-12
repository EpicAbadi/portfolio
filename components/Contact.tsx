"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  WhatsappLogo,
  XLogo,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const icons: Record<string, Icon> = {
  x: XLogo,
  whatsapp: WhatsappLogo,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  github: GithubLogo,
  discord: DiscordLogo,
};

function SocialButton({
  label,
  handle,
  href,
  icon,
}: {
  label: string;
  handle: string;
  href?: string;
  icon: string;
}) {
  const [copied, setCopied] = useState(false);
  const Icon = icons[icon];

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/75 transition-colors duration-500 group-hover:text-[#34d399]">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-tight text-white/85">
          {label}
        </span>
        <span className="block truncate font-mono text-[11px] text-[#8b8b95]">
          {handle}
        </span>
      </span>
    </>
  );

  return (
    <div className="group flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.02] p-1.5 pr-2 transition-colors duration-500 hover:border-[#34d399]/35">
      {/* No href means the platform has no public profile URL (Discord), so the
          row stays copy-only rather than linking somewhere that does not resolve. */}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-full py-2 pl-3"
        >
          {inner}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3">
          {inner}
        </div>
      )}

      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/45 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
      >
        {copied ? (
          <Check size={14} weight="bold" className="text-[#34d399]" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.02] p-2">
          <div className="relative rounded-[calc(2rem-0.5rem)] bg-[#0b0b0e] px-6 py-12 sm:px-8 sm:py-16 md:px-14 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full opacity-50 blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(52,211,153,0.28) 0%, rgba(11,11,14,0) 70%)",
              }}
            />

            <div className="relative">
              <h2 className="max-w-[22ch] text-[1.75rem] leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-[2.6rem]">
                Got an on-chain system to build or stress test?
              </h2>
              <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-white/55 sm:text-base">
                Send a short note about the context. You get back technical
                questions and a clear approach, not a generic pitch.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-2.5 sm:mt-10 sm:grid-cols-2">
                {site.socials.map((social) => (
                  <SocialButton key={social.label} {...social} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
