// Shared destinations and copy blocks. Keeping them here means a change of
// contact or docs URL is one edit, not a hunt through markup — the old bundle
// hardcoded the same Telegram handle in three places.

export const CONTACT = "https://t.me/ram4_dev";
export const DOCS = "https://docs.compassguard.xyz";
export const QUICKSTART = "https://api.compassguard.xyz/docs/quickstart";
export const X_URL = "https://x.com/compass_guard";
export const SKILL_PROMPT =
  "Use https://api.compassguard.xyz/skill-onboard.md to guide me through testing Compass Guard.";

export const PARTNERS = [
  { name: "dev3pack", href: "https://x.com/dev3pack", logo: "/dev3pack-logo.png" },
  { name: "Emprelatam", href: "https://emprelatam.com", logo: "/emprelatam-logo.png" },
  { name: "Founder School", href: "https://founderschool.build", logo: "/founderschool-logo.png" },
  { name: "Superteam Argentina", href: "https://superteam.ar", logo: "/superteam-ar-logo.svg" },
];

export const BEATS = [
  {
    n: "Beat one",
    title: "The gift nobody read.",
    body: "A worthless NFT silently expands the wallet's permissions. A $0 move no spending cap flags.",
    state: "Passed",
    detail: "Exposure: full",
  },
  {
    n: "Beat two",
    title: "The whisper in Morse.",
    body: "A Morse-coded command hidden in a public reply hijacks the agent into a valid transfer to an address the owner never authorized.",
    state: "Passed",
    detail: "Next: settlement",
  },
  {
    n: "Beat three",
    title: "The point of no return.",
    body: "The signature is valid, so it executes. No rollback, no undo.",
    state: "Drained",
    detail: "−$175,000",
  },
];

export const COMPARISON = [
  { who: "Spending caps", what: "Risk is assumed to scale with amount. A $0 authority change costs nothing.", said: "Saw $0 → allow" },
  { who: "Risk scoring", what: "Hunts known drainers. A brand-new counterparty is on no list.", said: "No flag → allow" },
  { who: "Wallet security", what: "Raises a warning for a human to read. In an agent world, that human isn't there.", said: "Warned no one" },
  { who: "Compass", what: "Reads the effect, not the amount. Authority change → deny. Unauthorized recipient → escalate.", said: "Off-mandate → stop", isCompass: true },
];

export const STATS = [
  {
    big: "3",
    label: "Design partners",
    body: "Three startups are wiring Compass into agents that already hold funds and move them without a human in the loop. Real integrations against the API, not a signup form.",
  },
  {
    big: "+2",
    label: "In seven days",
    body: "One design partner became three inside a single week, which is roughly how fast teams discover that an agent with a wallet is a liability nobody owns.",
  },
  {
    big: "99%",
    label: "Deterministic",
    body: "Nearly every verdict resolves against the mandate without model inference. Decisions stay fast, repeatable and cheap to run. The judge is the exception, not the path.",
  },
];

// Bios stay inside what the pitch deck states. These are real people; the
// copy elaborates on their stated backgrounds and does not invent credentials.
export const TEAM = [
  {
    name: "Ramiro Carnicer",
    role: "CEO / Vision / Product",
    bio: "Backend engineer at Mercado Libre, shipping production LLM and agent workflows at scale. Owns product direction and how the mandate model is expressed to the teams that have to live inside it.",
    linkedin: "https://www.linkedin.com/in/ramirocarnicersouble",
    photo: "/team/ramiro.jpg",
  },
  {
    name: "Lilly Guo",
    role: "CTO / Tech / Ops",
    bio: "Cryptography and Solana. Owns the signing-path architecture: the part of Compass that has to be correct before anything else about the product matters.",
    linkedin: "https://www.linkedin.com/in/lillyguoai/",
    photo: "/team/lilly.jpg",
  },
  {
    name: "Nicole Sikorski",
    role: "CMO / GTM",
    bio: "Came from Binance. Runs positioning and outreach to the x402 facilitators that are the beachhead: one integration there guards thousands of agents downstream.",
    linkedin: "https://www.linkedin.com/in/nicole-sikorski",
    photo: "/team/nicole.jpg",
  },
];
