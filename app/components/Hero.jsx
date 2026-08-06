"use client";

import { useEffect, useRef } from "react";
import { DOCS } from "../content";
import WaitlistForm from "./WaitlistForm";

export function Hero({ videoRef }) {
  return (
    <section style={{ position: "relative", zIndex: 1 }}>
      <div className="shell hero__card" data-herocard>
        <video
          ref={videoRef}
          data-demo
          src="/compass-landing-1080p.mp4"
          poster="/art/demo-poster.webp"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="hero__tag">
          <span className="hero__dot" />
          <span>Compass guard / live demo</span>
          <span style={{ marginLeft: "auto", color: "var(--mint)" }}>Authorized flow only</span>
        </div>
      </div>
    </section>
  );
}

export function Pitch() {
  return (
    <section className="pitch">
      <div className="pitch__in">
        <h1 data-reveal>
          Your agent moves money only where you <em>authorized.</em>
        </h1>
        <p className="pitch__sub" data-reveal>
          Compass Guard is the execution firewall for autonomous agents, verifying every transaction
          against your guardrails before it reaches the signer.
        </p>
        <div className="pitch__actions" data-reveal>
          <WaitlistForm id="waitlist" />
          <a className="btn btn--ghost" href={DOCS} target="_blank" rel="noopener noreferrer">Read the docs</a>
        </div>
      </div>
    </section>
  );
}

/**
 * Animates [data-reveal] elements in as they scroll into view.
 *
 * Progressive enhancement on purpose: the markup ships visible, and this
 * hides only what is currently below the fold before letting the observer
 * bring it back. So no JS, a failed chunk or a hydration error degrades to
 * a plain readable page rather than a blank one, and above-the-fold content
 * never flashes.
 */
export function Reveals() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    const show = (n) => {
      n.style.opacity = "";
      n.style.transform = "";
      n.style.filter = "";
      n.classList.add("is-in");
    };
    const hide = (n) => {
      n.style.opacity = "0";
      n.style.transform = "translateY(16px)";
      n.style.filter = "blur(8px)";
    };

    const pending = nodes.filter((n) => n.getBoundingClientRect().top > innerHeight * 0.9);
    pending.forEach(hide);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target);
          io.unobserve(e.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    pending.forEach((n) => io.observe(n));

    // If the observer never fires — a zero-height viewport at mount, a
    // restored background tab — nothing should stay hidden.
    const failsafe = setTimeout(() => pending.forEach(show), 4000);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return null;
}
