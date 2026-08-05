"use client";

import { useEffect, useRef, useState } from "react";

const initials = (name) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("");

/**
 * Pointer-tracking tilt, in the spirit of beUI's tilt-card.
 *
 * Implemented directly rather than pulled from the registry: beUI ships as
 * React + Tailwind 4 + Motion via shadcn, and this page has no Tailwind at
 * all. Adding that toolchain for one hover would mean two styling systems in
 * the codebase for the rest of its life.
 *
 * The tilt is decoration, so it is driven off CSS custom properties and
 * skipped entirely for pointer-coarse and reduced-motion users — on a phone
 * there is no hover to speak of, and the card is a plain link underneath.
 */
export default function TeamCard({ person }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);

  // onError alone is not enough. The img is server-rendered, so the browser
  // requests it and can fail long before React hydrates and attaches the
  // handler — the event is gone by then and the card keeps a broken image.
  // A finished-but-zero-width image is the same failure, observed after
  // the fact.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", ((px - 0.5) * 9).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - py) * 9).toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <a
      ref={ref}
      className="person"
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      aria-label={`${person.name}, ${person.role}, LinkedIn profile (opens in a new tab)`}
    >
      <span className="person__sheen" aria-hidden="true" />

      <span className="person__photo">
        {person.photo && !failed ? (
          <img
            ref={imgRef}
            src={person.photo}
            alt=""
            width="112"
            height="112"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="person__initials" aria-hidden="true">{initials(person.name)}</span>
        )}
      </span>

      <span className="person__nm">{person.name}</span>
      <span className="person__rl">{person.role}</span>
      <span className="person__bio">{person.bio}</span>

      <span className="person__link">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95C21.6 8.75 23 11 23 14.3V21h-4v-6c0-1.6-.03-3.65-2.25-3.65-2.25 0-2.6 1.72-2.6 3.53V21h-4V9Z"
          />
        </svg>
        LinkedIn
        <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
