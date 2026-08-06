"use client";

import { useEffect, useRef, useState } from "react";
import { DOCS, QUICKSTART } from "../content";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef(null);

  // Sentinel-based, not a scroll listener: a zero-height marker sits above
  // the nav and an IntersectionObserver flips `stuck` once it scrolls past
  // the 12px threshold. No per-frame scroll handler needed for a toggle.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-12px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
      <nav className={"nav" + (stuck ? " nav--stuck" : "")} data-nav>
        <div className="shell nav__in">
          <a className="nav__brand" href="#top">
            <img src="/art/compass-brand-logo.webp" alt="" width="72" height="72" />
            <span>Compass Guard</span>
          </a>
          <div className="nav__links">
            <a href="#how">How it works</a>
            <a href="#team">Team</a>
            <a href={QUICKSTART} target="_blank" rel="noopener noreferrer">API docs</a>
            <a href={DOCS} target="_blank" rel="noopener noreferrer">Docs</a>
            <a className="btn" href="#waitlist">
              Join the waitlist
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
