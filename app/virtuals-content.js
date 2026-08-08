// ACP-specific copy blocks for the Virtuals landing. Vocabulary here is
// pinned to Virtuals Protocol's public documentation (whitepaper.virtuals.io)
// — phase names, role names, and the Proof of Agreement / escrow / hook
// contract terms are quoted, not paraphrased, so a builder on ACP recognizes
// every term on the page. Shared copy (URLs, partners, stats, team) still
// lives in ./content — this file only holds what is unique to ACP.

export const ACP_BEATS = [
  {
    n: "Phase one · Request",
    title: "The offering that read the buyer.",
    body: "The job listing's requirements hide instructions aimed at the Client's planner. Nothing on-chain is malformed.",
    state: "Passed",
    detail: "Exposure: full",
  },
  {
    n: "Phase two · Negotiation",
    title: "The agreement nobody questioned.",
    body: "budget.set jumps higher than any past job. The signature is valid, so escrow funds.",
    state: "Passed",
    detail: "Next: settlement",
  },
  {
    n: "Phase four · Evaluation",
    title: "Evaluation approved it.",
    body: "With no Evaluator set, the Client approves its own job. No dispute path after release.",
    state: "Released",
    detail: "Funds gone",
  },
];

export const ACP_RULES = [
  { text: "Provider agent is not in the mandate's allowlist", tag: "counterparty", verdict: "escalate" },
  { text: "Job budget exceeds the per-job cap for this offering", tag: "budget", verdict: "block" },
  { text: "Settlement token is not the USDC contract for this chain", tag: "asset", verdict: "block" },
  { text: "Cumulative funded jobs today are within the daily limit", tag: "limit", verdict: "approve" },
  { text: "The Client agent is its own Evaluator on a job above threshold", tag: "evaluation", verdict: "escalate" },
  { text: "Agent Compute auto-top-up exceeds the monthly inference budget", tag: "compute", verdict: "block" },
];
