import Pipeline from "./Pipeline";
import StatValue from "./StatValue";
import WaitlistForm from "./WaitlistForm";
import { Head } from "./Sections";
import { DOCS, STATS } from "../content";
import { ACP_BEATS, ACP_RULES } from "../virtuals-content";

const CALL_SNIPPET = `$ acp client create-job-from-offering \\
    --provider compass --offering mandate-check \\
    --requirements '{"action":"fund_job","provider":"bulk-audience-agent.xyz","budget":420,"settlementToken":"USDC","intent":"pay a completed content job"}'`;

export function VirtualsPitch() {
  return (
    <section className="pitch">
      <div className="pitch__in">
        <div className="eyebrow" data-reveal>For agents on Virtuals ACP</div>
        <h1 data-reveal>
          Your ACP agent pays only the providers you <em>authorized.</em>
        </h1>
        <p className="pitch__sub" data-reveal>
          Compass Guard is the execution firewall for agents on the Agent Commerce Protocol. It checks
          every job against your mandate — the provider, the budget, the settlement token — before your
          agent signs the Proof of Agreement and escrow funds. No SDK to install — call the agent directly
          on ACP.
        </p>
        <div className="pitch__actions" data-reveal>
          <WaitlistForm id="waitlist" source="virtuals" />
          <a className="btn btn--ghost" href={DOCS} target="_blank" rel="noopener noreferrer">Read the docs</a>
        </div>
        <p className="pitch__note" data-reveal>Approve / escalate / block. Every decision recorded.</p>
      </div>
    </section>
  );
}

export function AcpFlow() {
  return (
    <section className="sec" id="how" data-reveal>
      <div className="shell">
        <div className="flow-head">
          <Head
            eyebrow={<>How it works <span className="tag-preview">Preview · job offering in review</span></>}
            title="Don't integrate Compass. Call it."
            lede="Compass runs as its own Provider agent on ACP, publishing one job offering — mandate-check. Any Client agent calls it the same way it calls any other Provider: no SDK, no hook contract, nothing added to your own agent."
          />
          <pre className="code-block"><code>{CALL_SNIPPET}</code></pre>
          <p className="code-caption">Mandate resolved from your agent's wallet. No wallet on file → escalate, not approve.</p>
        </div>
        <Pipeline />
      </div>
    </section>
  );
}

export function VirtualsTraction() {
  return (
    <section className="sec" data-reveal>
      <div className="shell">
        <Head
          title="Three teams already run Compass in production."
          lede="None of them are on ACP yet — that is what this waitlist is for."
        />
        <div className="grid stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <StatValue value={s.big} />
              <div className="stat__lbl">{s.label}</div>
              <p className="stat__d">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AcpFailure() {
  return (
    <section className="sec sec--dark" data-reveal>
      <div className="shell">
        <Head
          eyebrow="The failure mode ACP does not cover"
          title="A Proof of Agreement is a valid signature, not an authorization."
          lede="Every phase of ACP did its job. Nothing on-chain was malformed — the exposure sat in what the parties agreed to, not in how the agreement was executed."
        />
        <div className="grid beats">
          {ACP_BEATS.map((b) => (
            <article className="beat" key={b.n}>
              <div className="beat__n">{b.n}</div>
              <h3 className="beat__t">{b.title}</h3>
              <p className="beat__d">{b.body}</p>
              <div className="beat__out">
                <span className="bad">{b.state}</span>
                <span>{b.detail}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="lede" style={{ marginTop: 28 }}>
          With Compass in the path, the Provider is off-allowlist at Request, the budget breaches the
          per-job cap at Negotiation, and no Proof of Agreement is ever signed. Escrow never funds.
        </p>
      </div>
    </section>
  );
}

export function AcpMandate() {
  return (
    <section className="sec" id="mandate" data-reveal>
      <div className="shell">
        <Head
          eyebrow="Mandate examples"
          title="Calm controls for agents that pay other agents."
          lede="Encode the difference between a Proof of Agreement that is cryptographically valid and a job that was actually authorized."
        />
        <div className="rules">
          {ACP_RULES.map((r) => (
            <div className={`rule rule--${r.verdict}`} key={r.text}>
              <div>
                {r.text}
                <em>{r.tag}</em>
              </div>
              <span>{r.verdict.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VirtualsClosingCta() {
  return (
    <section className="closing" data-reveal>
      <div className="shell">
        <div className="closing__card">
          <h2>Put a mandate in front of your ACP agent.</h2>
          <p>Private beta for teams running Client, Provider or Evaluator agents on the Agent Commerce Protocol.</p>
          <div className="closing__actions">
            <WaitlistForm variant="dark" size="lg" source="virtuals" />
          </div>
        </div>
      </div>
    </section>
  );
}
