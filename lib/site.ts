/**
 * All site content lives here.
 * Edit the values below, save, and the browser refreshes on its own.
 */

type Social = {
  label: string;
  handle: string;
  /**
   * Omitted when the platform has no public profile URL. Discord is the case
   * here: a username is not resolvable by link, only a numeric user id is, so
   * the row renders as copy-only instead of pointing at a dead URL.
   */
  href?: string;
  icon: "x" | "whatsapp" | "instagram" | "facebook" | "github" | "discord";
};

type FocusItem = {
  title: string;
  body: string;
};

export type StackItem = {
  title: string;
  body: string;
  icon: "spark" | "contract" | "robot" | "server" | "browser" | "bug";
  /** Column width on the 6 column desktop grid. */
  span: 2 | 3 | 4;
  /** Background variation: "gradient" | "tint" | "grid" | "plain" */
  bg: "gradient" | "tint" | "grid" | "plain";
};

type ApproachStep = {
  title: string;
  body: string;
};

type Project = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  year?: string;
};

export const site = {
  name: "Ahmad Supriatna",
  eyebrow: "WEB3 BUILDER",
  /**
   * Hero avatar: a plain square image shown inside a circle. No frame, no ring,
   * no animation. Keep `photoWidth`/`photoHeight` in sync with the file so
   * Next.js can reserve the right space and the layout does not jump.
   */
  photo: "/avatar.jpg",
  photoWidth: 400,
  photoHeight: 400,
  availability: "Open to collaboration",

  subtext:
    "I ship web3 products with AI in the loop: contracts, bots, and infra built fast, then checked before they touch mainnet.",

  about: [
    "I build web3 products with AI as a core part of the workflow. That means I move faster than a solo developer writing every line by hand, and I lean on it hardest where speed matters most: tooling, integrations, glue code, and the first working version of an idea.",
    "What I do not hand over is judgment. I read what gets generated, test it against real chain behavior, and take responsibility for the decision to ship. A build that passes a quick look but fails under a real transaction is on me, not the tool.",
    "You get someone who covers the full path a web3 product actually needs, from contract and bot through deployment, and who will tell you when something is not ready yet.",
  ],

  approach: [
    {
      title: "Scope before code",
      body: "The problem gets written down first: what has to work, what can wait, and what would make this a waste of time.",
    },
    {
      title: "Build with AI in the loop",
      body: "Contracts, tooling, and integrations get drafted at speed, then kept only when the code holds up to reading and testing.",
    },
    {
      title: "Verify against the chain",
      body: "Anything that moves value gets tested against real behavior, not just a passing build. Failing cases get found before a user does.",
    },
    {
      title: "Ship, then maintain",
      body: "Deployment is the midpoint. Logs, retries, and cleanup afterward are part of the job, not an afterthought.",
    },
  ] satisfies ApproachStep[],

  focus: [
    {
      title: "Smart contracts",
      body: "Solidity contracts on EVM chains, including upgrade paths, integration with existing protocols, and the tests that back them.",
    },
    {
      title: "On-chain tooling",
      body: "Bots and scripts for on-chain operations, built to handle retries, rate limits, and endpoints that drop out mid-run.",
    },
    {
      title: "Backend & infra",
      body: "Nodes, RPC pools, and data pipelines so a product never depends on a single provider staying up.",
    },
    {
      title: "Web3 frontend",
      body: "Viem, wagmi, and wallet connection flows that hold up outside a local test wallet.",
    },
  ] satisfies FocusItem[],

  stack: [
    {
      title: "AI-assisted development",
      body: "The working method behind the rest of this list. Fast first drafts, then review and testing before anything ships.",
      icon: "spark",
      span: 4,
      bg: "gradient",
    },
    {
      title: "Smart contracts & EVM",
      body: "Solidity and Foundry. From a first prototype to a contract that is ready for audit.",
      icon: "contract",
      span: 2,
      bg: "plain",
    },
    {
      title: "Scripting & automation",
      body: "On-chain operations, parallel workers, and retry logic that survives failures.",
      icon: "robot",
      span: 3,
      bg: "plain",
    },
    {
      title: "Infra & RPC",
      body: "Self-hosted nodes, RPC rotation, and pipelines that stay up when one endpoint dies.",
      icon: "server",
      span: 3,
      bg: "tint",
    },
    {
      title: "Web3 frontend",
      body: "Viem, wagmi, and wallet flows that behave the same outside your test wallet.",
      icon: "browser",
      span: 2,
      bg: "plain",
    },
    {
      title: "Testing & debugging",
      body: "Reproducing failures, reading traces, and finding the case nobody wrote a test for yet.",
      icon: "bug",
      span: 4,
      bg: "grid",
    },
  ] satisfies StackItem[],

  /**
   * The Work section reads this array. A project without `href` renders as a
   * card with no outbound link (private/local repos), so nothing points at a
   * dead URL.
   */
  projects: [
    {
      title: "Ultimate OpenSea Mint Tools",
      summary:
        "All-in-one CLI for minting NFT drops on SeaDrop across ten EVM chains. Four modes: direct public mint, MultiMint (routes through a factory contract, so an order is not capped by the per-wallet limit), allowlist stages (FCFS / GTD / signed) through the OpenSea Drops API, and a flip mode that mints and accepts the top offer in one run. Built around a sniper path: transactions are pre-signed and pre-serialised before the stage opens, then blasted to every RPC and the L2 sequencer at once over warmed keep-alive sockets, so T-0 costs a socket write instead of a sign.",
      tags: [
        "Node.js",
        "Ethers v6",
        "SeaDrop",
        "OpenSea API",
        "Multi-chain",
        "CLI",
      ],
      year: "2026",
    },
    {
      title: "Airdrop Bot Telegram",
      summary:
        "Multi-account Telegram automation engine for airdrop campaigns, built on Telethon and asyncio. Every account runs as a worker under a shared concurrency limit and works the full task loop: joining required channels and private invite links, solving math captchas, submitting social tasks (X, Discord, YouTube, Instagram, GitHub, Reddit, LinkedIn, email, wallets), and reporting results back to a control bot. FloodWait back-off, per-account sessions, and randomised human-like pacing keep the fleet from tripping limits.",
      tags: [
        "Python",
        "Telethon",
        "asyncio",
        "Automation",
        "Multi-account",
      ],
      year: "2026",
    },
  ] as Project[],

  socials: [
    {
      label: "GitHub",
      handle: "EpicAbadi",
      href: "https://github.com/EpicAbadi",
      icon: "github",
    },
    {
      label: "X",
      handle: "@etotsenpai",
      href: "https://x.com/etotsenpai",
      icon: "x",
    },
    {
      label: "Discord",
      handle: "april0537",
      icon: "discord",
    },
    {
      label: "WhatsApp",
      handle: "+62 857-9514-5113",
      href: "https://wa.me/6285795145113",
      icon: "whatsapp",
    },
    {
      label: "Instagram",
      handle: "@ahmadsupriatnaa",
      href: "https://instagram.com/ahmadsupriatnaa",
      icon: "instagram",
    },
    {
      label: "Facebook",
      handle: "dosakemalasan666",
      href: "https://facebook.com/dosakemalasan666",
      icon: "facebook",
    },
  ] satisfies Social[],
};
