"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Intro from "./Intro";
import Nav from "./Nav";
import { BetaBanner, Hero, Pitch, Reveals } from "./Hero";
import {
  BackedBy, ClosingCta, Gateway, Heist, HowItWorks, Policy, Team, Traction, WhyNothingCaught,
} from "./Sections";
import { CONTACT, DOCS, X_URL } from "../content";

export default function Landing() {
  const videoRef = useRef(null);
  const [entered, setEntered] = useState(false);

  // Video gate: the demo must start exactly once, from zero, and only after
  // the intro has cleared and the card is genuinely on screen.
  //
  // Driven from an effect rather than straight out of the Intro callback so
  // it runs after React has committed `entered` — the reveal is only real
  // once aria-hidden has actually flipped in the DOM.
  const gate = useRef({ token: 0, started: false, off: null });

  useEffect(() => {
    const g = gate.current;
    if (!entered || g.started) return;

    const v = videoRef.current;
    if (!v) return;
    const token = g.token;

    const start = () => {
      if (token !== g.token) return; // reversed while we waited
      if (!v.getClientRects().length) return;
      g.started = true;
      v.muted = true;
      v.playsInline = true;
      v.currentTime = 0;
      v.play().catch(() => { g.started = false; });
    };

    if (v.readyState >= 1) {
      start();
      return;
    }

    // No metadata yet: play() here would either reject or start from an
    // undefined position, so wait for the dimensions to land.
    v.addEventListener("loadedmetadata", start);
    let gone = false;
    const off = () => {
      if (gone) return; // idempotent: onDone and this effect's cleanup both call it
      gone = true;
      v.removeEventListener("loadedmetadata", start);
    };
    g.off = off;
    return () => {
      off();
      if (g.off === off) g.off = null;
    };
  }, [entered]);

  // Teardown on reversal has to be synchronous with the scroll frame that
  // caused it. Leaving it to the effect cleanup opens a window where the DOM
  // has already reverted — aria-hidden flips in the mutation phase — while
  // the passive cleanup has not run yet, so the orphaned listener is briefly
  // still live on a page the intro has re-covered.
  const onDone = useCallback((done) => {
    if (!done) {
      const g = gate.current;
      g.token++;
      if (g.off) { g.off(); g.off = null; }
    }
    setEntered(done);
  }, []);

  return (
    <>
      <Intro onDone={onDone} />
      <div
        className="landing"
        data-landing
        aria-hidden={entered ? "false" : "true"}
        style={{ pointerEvents: entered ? undefined : "none" }}
      >
        <Nav />
        <BetaBanner />
        <main id="top">
          <Hero videoRef={videoRef} />
          <Pitch />
          <BackedBy />
          <HowItWorks />
          {/* Proof of life sits right after the explanation: who is already
              using it and who built it, before the longer heist narrative. */}
          <Traction />
          <Team />
          <Heist />
          <WhyNothingCaught />
          <Gateway />
          <Policy />
          <ClosingCta />
        </main>
        <footer className="foot">
          <div className="shell foot__in">
            <span>© 2026 Compass Guard · Execution firewall for autonomous agents.</span>
            <span>
              <a href="/launch">Launch app</a>
              {" · "}
              <a href={CONTACT} target="_blank" rel="noopener noreferrer">Contact us</a>
              {" · "}
              <a href={X_URL} target="_blank" rel="noopener noreferrer">X</a>
              {" · "}
              <a href={DOCS} target="_blank" rel="noopener noreferrer">Docs</a>
            </span>
          </div>
        </footer>
      </div>
      <Reveals />
    </>
  );
}
