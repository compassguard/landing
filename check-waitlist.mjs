import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const nav = await readFile(new URL("./app/components/Nav.jsx", import.meta.url), "utf8");
const hero = await readFile(new URL("./app/components/Hero.jsx", import.meta.url), "utf8");
const sections = await readFile(new URL("./app/components/Sections.jsx", import.meta.url), "utf8");
const waitlistForm = await readFile(new URL("./app/components/WaitlistForm.jsx", import.meta.url), "utf8");
const vercel = JSON.parse(await readFile(new URL("./vercel.json", import.meta.url), "utf8"));

// Nav's CTA scrolls to the hero form instead of linking out to Telegram.
assert.match(nav, /<a className="btn" href="#waitlist">\s*Join the waitlist\s*<\/a>/);
assert.doesNotMatch(nav, /Join the beta/);

// The hero form owns the #waitlist anchor target; the closing form is the large dark variant.
assert.match(hero, /<WaitlistForm id="waitlist" \/>/);
assert.match(sections, /<WaitlistForm variant="dark" size="lg" \/>/);
assert.doesNotMatch(hero, /Join the beta/);
assert.doesNotMatch(sections, /Join the beta/);

// The open-beta banner is gone.
assert.doesNotMatch(hero, /BetaBanner/);
assert.doesNotMatch(hero, /Developer beta is open/);

// The form posts to /waitlist and never shows an apiKey (unlike /signup).
assert.match(waitlistForm, /fetch\("\/waitlist"/);
assert.match(waitlistForm, /method: "POST"/);
assert.doesNotMatch(waitlistForm, /apiKey/);

// Vercel rewrite for the waitlist endpoint.
assert.deepEqual(
  vercel.rewrites.find((rewrite) => rewrite.source === "/waitlist"),
  { source: "/waitlist", destination: "https://api.compassguard.xyz/waitlist" },
);

console.log("waitlist checks passed");
