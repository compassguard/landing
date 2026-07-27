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

export const GATEWAY_STEPS = [
  {
    icon: "/art/icon-castle.webp",
    kicker: "Mandate",
    title: "Define what the agent may do.",
    body: "Limits, destinations, tools, tokens, timing and approval requirements become the operating charter.",
    tags: ["spend caps", "allowlists", "slippage rules"],
  },
  {
    icon: "/art/icon-inspect.webp",
    kicker: "Evaluation",
    title: "Inspect the proposed action.",
    body: "Compass Guard decodes the request, checks policy and classifies risk before the signer is involved.",
    tags: ["transfer", "swap", "tool call"],
  },
  {
    icon: "/art/icon-lock.webp",
    kicker: "Record",
    title: "Leave a traceable decision.",
    body: "Approvals, blocks and escalations are written with context so teams can review what happened.",
    tags: ["decision reason", "policy match", "audit log"],
  },
];

export const RULES = [
  { text: "Destination wallet is outside the mandate", tag: "counterparty", verdict: "escalate" },
  { text: "Swap output token is not approved", tag: "token", verdict: "block" },
  { text: "Amount is within daily agent limit", tag: "limit", verdict: "approve" },
  { text: "Slippage exceeds policy threshold", tag: "execution", verdict: "block" },
  { text: "Recurring condition matches active mandate", tag: "automation", verdict: "approve" },
];

export const BEATS = [
  {
    n: "Beat one",
    title: "The gift nobody read.",
    body: "A worthless NFT silently expands the wallet's permissions — a $0 move no spending cap flags.",
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
  { big: "3", label: "Design partners", body: "Startups actively integrating Compass into money-moving agents." },
  { big: "+2", label: "In seven days", body: "From one design partner to three in a single week." },
  { big: "99%", label: "Deterministic", body: "Most verdicts resolve without inference, so decisions stay fast and cheap." },
];

export const TEAM = [
  { name: "Ramiro Carnicer", role: "CEO · Vision · Product", bio: "Backend engineer at Mercado Libre — production LLM and agent workflows." },
  { name: "Lilly Guo", role: "CTO · Tech · Ops", bio: "Cryptography and Solana — owns the signing-path architecture." },
  { name: "Nicole Sikorski", role: "CMO · GTM", bio: "Binance — positioning and facilitator outreach." },
];
