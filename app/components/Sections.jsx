import Pipeline from "./Pipeline";
import TeamCard from "./TeamCard";
import {
  BEATS, COMPARISON, CONTACT, PARTNERS, STATS, TEAM,
} from "../content";

function Head({ eyebrow, title, lede }) {
  return (
    <>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="h2">{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </>
  );
}

export function BackedBy() {
  return (
    <section className="backed" aria-labelledby="backed-by">
      <div className="shell backed__row">
        <h2 id="backed-by">Backed by</h2>
        <div className="backed__links">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              className="partner"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${p.name} (opens in a new tab)`}
            >
              <img src={p.logo} alt="" loading="lazy" decoding="async" width="30" height="30" />
              <span>{p.name}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="sec" id="how" data-reveal>
      <div className="shell">
        <Head
          eyebrow="How it works"
          title="Nothing reaches the signer without passing Compass first."
          lede="Compass sits between the agent and financial execution on Solana and x402 rails, checking every action against your mandate before a signature exists."
        />

        <Pipeline />
      </div>
    </section>
  );
}

export function Heist() {
  return (
    <section className="sec sec--dark" data-reveal>
      <div className="shell">
        <Head
          eyebrow="The Grok heist · May 2026"
          title="US$175,000 vanished. No stolen key, no exploit, no contract bug."
          lede="An AI agent with its own wallet and $175K in operating funds. Autonomous, trusted, unsupervised. Every layer it had scored the attack as safe."
        />
        <div className="grid beats">
          {BEATS.map((b) => (
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
          With Compass in the path, beat one is denied on the authority change, beat two is escalated
          as off-mandate, and beat three never gets a signature. $0 lost at every step.
        </p>
      </div>
    </section>
  );
}

export function WhyNothingCaught() {
  return (
    <section className="sec" data-reveal>
      <div className="shell">
        <Head
          eyebrow="Why nothing caught it"
          title="Every existing layer scored this attack as safe."
          lede="Everyone else asks whether a transaction looks malicious. Compass asks whether it was authorized for this agent."
        />
        <div className="grid">
          <div className="cmp">
            {COMPARISON.map((r) => (
              <div className={"cmp__row" + (r.isCompass ? " cmp__row--cg" : "")} key={r.who}>
                <div className="cmp__who">{r.who}</div>
                <div className="cmp__what">{r.what}</div>
                <div className="cmp__said">{r.said}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Traction() {
  return (
    <section className="sec" data-reveal>
      <div className="shell">
        <Head
          eyebrow="Traction"
          title="Three teams are building with Compass today."
          lede="Real pilots, not a waitlist."
        />
        <div className="grid stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat__big">{s.big}</div>
              <div className="stat__lbl">{s.label}</div>
              <p className="stat__d">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section className="sec" id="team" data-reveal>
      <div className="shell">
        <Head eyebrow="Team" title="Three founders, one owner per area." />
        <div className="grid team">
          {TEAM.map((p) => <TeamCard key={p.name} person={p} />)}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="closing" data-reveal>
      <div className="shell">
        <div className="closing__card">
          <div className="eyebrow" style={{ color: "var(--emerald)" }}>
            Compass Guard execution firewall
          </div>
          <h2>Put a governed gateway in front of autonomous execution.</h2>
          <p>Protect agents before they move funds. Verify intent, enforce policy and keep the evidence.</p>
          <div className="closing__actions">
            <a className="btn btn--lg" href={CONTACT} target="_blank" rel="noopener noreferrer">
              Join the beta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
