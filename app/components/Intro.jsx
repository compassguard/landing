"use client";

import { useEffect, useRef } from "react";

// Natural size of the fortress artwork, and the gate aperture within it.
const AW = 1200, AH = 822;
const AP = { left: 540, top: 540, width: 142, height: 226 };
const INTRO_VH = 380;

const clamp = (n) => Math.min(Math.max(n, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (n) => n * n * (3 - 2 * n);
const seg = (p, a, b) => clamp((p - a) / (b - a));

/**
 * Scroll-driven entrance: the camera pushes through a fortress gate, the
 * portcullis lifts, the wordmark resolves, then the landing takes over.
 *
 * Three mobile behaviours are load-bearing and were fixed the hard way:
 *  - The art scale is capped by the width fit. A floor of (vh*0.44)/AH used
 *    to win on portrait phones and pushed the castle wider than the screen.
 *  - The viewport height is locked and only re-read when the width changes.
 *    Mobile browsers change innerHeight when the URL bar collapses, which
 *    otherwise resized the spacer mid-scroll and made progress jump backwards.
 *  - On completion the fixed layers get display:none, not just
 *    visibility:hidden, or they leave a stale horizontal scroll extent.
 */
export default function Intro({ onDone }) {
  const root = useRef(null);
  const els = useRef({});
  const locked = useRef({ vh: 0, vw: 0 });
  const done = useRef(null);

  useEffect(() => {
    const q = (s) => root.current.querySelector(s);
    const e = (els.current = {
      stage: q("[data-stage]"), spacer: q("[data-spacer]"), veil: q("[data-veil]"),
      art: q("[data-art]"), castle: q("[data-castle]"), passage: q("[data-passage]"),
      glow: q("[data-glow]"), gateClip: q("[data-gateclip]"), gate: q("[data-gate]"),
      ground: q("[data-ground]"), groundShade: q("[data-groundshade]"),
      vignette: q("[data-vignette]"), mist: q("[data-mist]"), hint: q("[data-hint]"),
      nameLogo: q("[data-namelogo]"), rule: q("[data-rule]"), kicker: q("[data-kicker]"),
      seal: q("[data-seal]"),
    });
    const letters = Array.from(root.current.querySelectorAll("[data-l]"));

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      e.stage.style.display = "none";
      e.veil.style.display = "none";
      e.spacer.style.display = "none";
      onDone?.(true);
      return;
    }

    // A viewport of zero at mount — a background/restored tab, an embed
    // measured before layout — would otherwise lock the runway to 0px and
    // leave the intro permanently collapsed with no way to recover.
    const relock = () => {
      if (!innerHeight || !innerWidth) return false;
      locked.current = { vh: innerHeight, vw: innerWidth };
      e.spacer.style.height = (INTRO_VH / 100) * innerHeight + "px";
      return true;
    };

    // Declared here but not invoked until every helper below exists: frame()
    // reads `box`, and calling it any earlier puts us in that const's temporal
    // dead zone, which throws and takes the whole React tree down with it.
    let settle = 0;
    const tryLock = () => {
      if (relock()) { frame(); return; }
      settle = requestAnimationFrame(tryLock);
    };

    const onResize = () => {
      if (!locked.current.vh) return tryLock(); // never got a viewport
      if (innerWidth === locked.current.vw) return; // URL-bar collapse: ignore
      relock();
      frame();
    };

    const box = (n, l, t, w, h) =>
      Object.assign(n.style, {
        left: l + "px", top: t + "px",
        width: Math.max(0, w) + "px", height: Math.max(0, h) + "px",
      });

    function frame() {
      const vw = innerWidth, vh = locked.current.vh || innerHeight;
      const runway = e.spacer.offsetHeight || 1;
      const p = clamp(scrollY / runway);

      if (p >= 1) {
        if (done.current !== true) {
          done.current = true;
          e.stage.style.visibility = "hidden";
          e.stage.style.display = "none";
          e.veil.style.visibility = "hidden";
          e.veil.style.display = "none";
          e.veil.style.opacity = "0";
          onDone?.(true);
        }
        return;
      }
      if (done.current !== false) {
        done.current = false;
        e.stage.style.display = "";
        e.veil.style.display = "";
        e.stage.style.visibility = "visible";
        onDone?.(false);
      }

      const a = ease(seg(p, 0, 0.62));
      const wFit = (vw * 1.04) / AW;
      const base = Math.min(wFit, Math.max(Math.min(wFit, (vh * 0.86) / AH), (vh * 0.44) / AH));
      const scale = base * lerp(1, 4.2, a);
      const gx = AP.left + AP.width / 2, gy = AP.top + AP.height * 0.66;
      const natX = (vw - AW * base) / 2 + gx * base;
      const natY = (vh - AH * base) / 2 + gy * base + vh * 0.03;
      const ax = lerp(natX, vw / 2, a), ay = lerp(natY, vh * 0.5, a);
      const artL = ax - gx * scale, artT = ay - gy * scale;

      box(e.art, artL, artT, AW * scale, AH * scale);
      e.castle.style.width = AW * scale + "px";
      e.castle.style.height = AH * scale + "px";
      e.castle.style.filter = "blur(" + (a * 1.3).toFixed(2) + "px)";

      const pad = 7 * scale;
      box(e.passage, AP.left * scale - pad, AP.top * scale - pad, AP.width * scale + pad * 2, AP.height * scale + pad - 2 * scale);
      e.glow.style.opacity = (0.06 + a * 0.9).toFixed(3);

      const apH = AP.height * scale;
      box(e.gateClip, AP.left * scale, AP.top * scale, AP.width * scale, apH);
      box(e.gate, -AP.left * scale, -AP.top * scale, AW * scale, AH * scale);
      e.gate.style.transform = "translateY(" + (-ease(seg(p, 0.28, 0.56)) * apH * 1.02).toFixed(1) + "px)";

      const groundTop = artT + AH * scale * 0.945;
      e.ground.style.top = groundTop + "px";
      e.groundShade.style.top = groundTop + "px";
      e.groundShade.style.opacity = (1 - a).toFixed(2);
      e.ground.style.filter = "blur(" + (a * 5).toFixed(1) + "px) brightness(" + (1 - a * 0.42).toFixed(3) + ")";
      e.mist.style.top = groundTop + "px";
      e.mist.style.opacity = (1 - a * 0.85).toFixed(2);

      e.vignette.style.opacity = ease(seg(p, 0.2, 0.62)).toFixed(3);
      e.hint.style.opacity = (1 - seg(p, 0, 0.07)).toFixed(2);
      e.hint.style.top = Math.min(groundTop + 18, vh - 74) + "px";

      const veil = ease(seg(p, 0.54, 0.68));
      const out = ease(seg(p, 0.9, 1));
      e.stage.style.opacity = (1 - out).toFixed(3);
      e.veil.style.visibility = veil > 0 ? "visible" : "hidden";
      e.veil.style.opacity = (veil * (1 - out)).toFixed(3);

      const t = seg(p, 0.66, 0.9);
      letters.forEach((n, i) => {
        const lp = ease(clamp((t - i * 0.055) / 0.2));
        n.style.opacity = (lp * (1 - out)).toFixed(3);
        n.style.transform = "translateY(" + ((1 - lp) * 64 - out * 40).toFixed(1) + "px)";
        n.style.filter = "blur(" + ((1 - lp) * 12).toFixed(1) + "px)";
      });
      const lg = ease(seg(t, 0, 0.3));
      e.nameLogo.style.opacity = (lg * (1 - out)).toFixed(3);
      e.nameLogo.style.transform = "translateY(" + (1 - lg) * -30 + "px) scale(" + (0.9 + lg * 0.1).toFixed(3) + ")";
      e.rule.style.width = (ease(seg(t, 0.45, 0.9)) * Math.min(vw * 0.5, 520)).toFixed(0) + "px";
      e.kicker.style.opacity = (ease(seg(t, 0.55, 1)) * (1 - out)).toFixed(3);
      e.seal.style.opacity = (ease(seg(t, 0.75, 1)) * (1 - out)).toFixed(3);
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; frame(); });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize, { passive: true });
    addEventListener("orientationchange", onResize, { passive: true });
    addEventListener("pageshow", onScroll);
    document.addEventListener("visibilitychange", onScroll);
    tryLock();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("orientationchange", onResize);
      removeEventListener("pageshow", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (settle) cancelAnimationFrame(settle);
    };
  }, [onDone]);

  return (
    <div ref={root}>
      <div className="stage" data-stage>
        <div className="stage__wash" />
        <div className="stage__grid" />
        <div className="stage__ground" data-ground />
        <div className="stage__mist" data-mist />
        <div className="stage__shade" data-groundshade />
        <div className="stage__art" data-art>
          <div className="stage__passage" data-passage>
            <div className="stage__glow" data-glow />
          </div>
          <img className="stage__castle" data-castle src="/art/fort-castle.webp" alt="" decoding="async" />
          <div className="stage__gateclip" data-gateclip>
            <img className="stage__gate" data-gate src="/art/fort-gate.webp" alt="" decoding="async" />
          </div>
        </div>
        <div className="stage__vignette" data-vignette />
        <div className="stage__hint" data-hint>
          Scroll to enter
          <span aria-hidden="true">⌄</span>
        </div>
      </div>

      <div className="veil" data-veil>
        <div className="veil__grid" />
        <div className="veil__torch veil__torch--l" />
        <div className="veil__torch veil__torch--r" />
        <div className="veil__name">
          <img data-namelogo src="/art/compass-brand-logo.webp" alt="" width="96" height="96" />
          <div className="veil__letters">
            {"COMPASS".split("").map((c, i) => (
              <span data-l key={i}>{c}</span>
            ))}
          </div>
          <div className="veil__rule" data-rule />
          <div className="veil__kicker" data-kicker>Execution firewall for autonomous agents</div>
          <div className="veil__seal" data-seal>Gate cleared · authorized flow only</div>
        </div>
      </div>

      <div className="spacer" data-spacer />
    </div>
  );
}
