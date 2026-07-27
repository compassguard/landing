"use client";

import { useEffect, useReducer } from "react";

/**
 * Three proposals, chosen so the sequence argues the product rather than
 * just decorating it. The last one is beat one of the Grok heist: a $0 call
 * that hands over spending authority, which every amount-based control on
 * the market waves through.
 */
const SCENARIOS = [
  {
    id: "allow",
    verdict: "allow",
    request: "transfer 240 USDC",
    detail: "to an allow-listed vendor",
    check: "Within the daily limit. Destination is on the mandate.",
    outcome: "Signed and settled",
  },
  {
    id: "escalate",
    verdict: "escalate",
    request: "transfer 12,000 USDC",
    detail: "to a wallet seen for the first time",
    check: "Destination is outside the mandate. Held for a human.",
    outcome: "Held for review · $0 moved",
  },
  {
    id: "deny",
    verdict: "deny",
    request: "setApprovalForAll",
    detail: "a $0 call that hands over spending authority",
    check: "No amount, full exposure. An authority change is off-mandate.",
    outcome: "Blocked before signing · $0 moved",
  },
];

// phase -> how long it holds, in ms
const TIMELINE = [
  ["propose", 900],
  ["travel", 1100],
  ["inspect", 1500],
  ["verdict", 900],
  ["outcome", 1600],
  ["rest", 700],
];

const VERDICT_LABEL = { allow: "Allow", escalate: "Escalate", deny: "Deny" };

function step(state) {
  const next = state.step + 1;
  if (next < TIMELINE.length) return { ...state, step: next };
  return { scenario: (state.scenario + 1) % SCENARIOS.length, step: 0 };
}

export default function Pipeline() {
  const [state, advance] = useReducer(step, { scenario: 0, step: 0 });
  const [phase] = TIMELINE[state.step];
  const sc = SCENARIOS[state.scenario];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(advance, TIMELINE[state.step][1]);
    return () => clearTimeout(t);
  }, [state]);

  // Which stations have been reached by now.
  const atAgent = true;
  const atCore = ["travel", "inspect", "verdict", "outcome", "rest"].includes(phase);
  const settled = phase === "outcome" || phase === "rest";
  const atSigner = settled && sc.verdict === "allow";
  // Three outcomes, three treatments. The portcullis is reserved for deny —
  // an escalation is a hold awaiting a human, not a barred gate, and
  // collapsing the two would undercut the distinction the product sells.
  const barred = settled && sc.verdict === "deny";
  const held = settled && sc.verdict === "escalate";

  return (
    <div className="pipe" data-phase={phase} data-verdict={sc.verdict}>
      <div className="pipe__stations">
        <article className={"pstation" + (atAgent ? " is-lit" : "")}>
          <div className="pstation__k">Agent</div>
          <div className="pstation__t">Proposes</div>
          <p className="pstation__d">Payments, tool calls, transactions.</p>
          <div className="pstation__req" aria-hidden="true">
            <code>{sc.request}</code>
            <span>{sc.detail}</span>
          </div>
        </article>

        <div className="prail prail--in" aria-hidden="true">
          <span className="prail__packet" />
        </div>

        <div className={"pcore" + (atCore ? " is-lit" : "") + (barred ? " is-barred" : "") + (held ? " is-held" : "")}>
          <div className="pcore__halo" aria-hidden="true" />
          <div className="pcore__scan" aria-hidden="true" />
          <img
            className="pcore__bot"
            src="/art/guardian.webp"
            alt="The Compass Guardian checking a proposal against the mandate"
            width="200"
            height="200"
            loading="lazy"
            decoding="async"
          />
          <img
            className="pcore__gate"
            src="/art/portcullis.webp"
            alt=""
            aria-hidden="true"
            width="120"
            height="211"
            loading="lazy"
            decoding="async"
          />
          <div className="pcore__badge">Compass</div>
          <div className="pcore__verdicts">
            {["allow", "escalate", "deny"].map((v) => (
              <span
                key={v}
                className={`verdict verdict--${v === "escalate" ? "esc" : v}` + (settled || phase === "verdict" ? (v === sc.verdict ? " is-hit" : " is-dim") : "")}
              >
                {VERDICT_LABEL[v]}
              </span>
            ))}
          </div>
        </div>

        <div className="prail prail--out" aria-hidden="true">
          <span className="prail__packet" />
        </div>

        <article className={"pstation" + (atSigner ? " is-lit" : "")}>
          <div className="pstation__k">Signer</div>
          <div className="pstation__t">Settles</div>
          <p className="pstation__d">Only approved actions reach the chain.</p>
          <div className="pstation__req" aria-hidden="true">
            <code>{sc.verdict === "allow" ? "signed" : "nothing signed"}</code>
            <span>{sc.verdict === "allow" ? "on-chain" : "no transaction exists"}</span>
          </div>
        </article>
      </div>

      {/* The running commentary. aria-live so the sequence is followable
          without watching it, and the only place the verdict is announced
          as text rather than colour. */}
      <p className="pipe__readout" aria-live="polite">
        <span className={`verdict verdict--${sc.verdict === "escalate" ? "esc" : sc.verdict}`}>
          {VERDICT_LABEL[sc.verdict]}
        </span>
        <span className="pipe__reason">{settled ? sc.outcome : sc.check}</span>
      </p>
    </div>
  );
}
