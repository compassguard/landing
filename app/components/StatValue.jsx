"use client";

import { useEffect, useRef, useState } from "react";

// Matches "3", "+2", "99%": an optional sign, the digits that count up, an
// optional suffix. Anything else (a value this can't parse) is rendered as
// plain static text — the count-up is an enhancement, never a requirement.
const STAT_RE = /^([+-]?)(\d+)(%?)$/;

/**
 * Counts a stat up from zero once it scrolls into view. The visible number
 * during the count is aria-hidden; a static twin holds the real value for
 * screen readers, so nothing announces a stream of intermediate digits.
 *
 * State updates are bounded to ~900ms and scoped to this one small node, not
 * a continuous scroll/pointer-driven value re-rendering the tree, so plain
 * useState is fine here.
 */
export default function StatValue({ value }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parsed = STAT_RE.exec(value);
    const el = ref.current;
    if (!parsed || !el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, sign, digits, suffix] = parsed;
    const target = Number(digits);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const duration = 900;
        const from = performance.now();
        const easeOut = (t) => 1 - (1 - t) ** 3;

        const tick = (now) => {
          const t = Math.min(1, (now - from) / duration);
          setDisplay(`${sign}${Math.round(target * easeOut(t))}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div className="stat__big">
      <span aria-hidden="true" ref={ref}>{display}</span>
      <span className="sr-only">{value}</span>
    </div>
  );
}
