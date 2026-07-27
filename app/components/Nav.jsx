"use client";

import { useEffect, useState } from "react";
import { CONTACT, DOCS, QUICKSTART } from "../content";

export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={"nav" + (stuck ? " nav--stuck" : "")} data-nav>
      <div className="shell nav__in">
        <a className="nav__brand" href="#top">
          <img src="/art/compass-brand-logo.webp" alt="" width="72" height="72" />
          <span>Compass Guard</span>
        </a>
        <div className="nav__links">
          <a href="#how">How it works</a>
          <a href="#gateway">Gateway</a>
          <a href="#policy">Policy</a>
          <a href="#team">Team</a>
          <a href={QUICKSTART} target="_blank" rel="noopener noreferrer">API docs</a>
          <a href={DOCS} target="_blank" rel="noopener noreferrer">Docs</a>
          <a className="btn" href={CONTACT} target="_blank" rel="noopener noreferrer">
            Join the beta
          </a>
        </div>
      </div>
    </nav>
  );
}
